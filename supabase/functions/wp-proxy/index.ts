// Lovable Cloud edge function: caches WordPress REST responses.
// Usage from frontend: GET /functions/v1/wp-proxy?path=/wp/v2/posts&per_page=12&page=1
//
// Caching controls (query params, all optional):
//   ttl=<seconds>   Override cache duration for this request. Range 0..86400.
//                   ttl=0 disables caching for this response.
//   bust=1          Force a fresh fetch from WordPress AND mark the response
//                   no-store so caches drop their copy.
//
// Defaults: 600s (10 min) for posts/pages/categories, 60s when ?bust=1 is used
// upstream (clients should follow with normal requests after).

import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.104.1/cors";

// Configurable via the WP_API_BASE secret so we can flip to a subdomain
// (e.g. https://wp.mindfulnessexercises.com/wp-json) at cutover without a
// code deploy. Falls back to the legacy root domain.
const WP_BASE =
  Deno.env.get("WP_API_BASE")?.replace(/\/+$/, "") ??
  "https://mindfulnessexercises.com/wp-json";
const DEFAULT_CACHE_SECONDS = 600;
const MAX_CACHE_SECONDS = 86_400; // 24h ceiling

// Allowlist to prevent SSRF / arbitrary host
const ALLOWED_PREFIXES = ["/wp/v2/"];

function clampTtl(raw: string | null): number | null {
  if (raw === null) return null;
  const n = Number(raw);
  if (!Number.isFinite(n) || n < 0) return null;
  return Math.min(Math.floor(n), MAX_CACHE_SECONDS);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const path = url.searchParams.get("path") ?? "";
    const ttlParam = clampTtl(url.searchParams.get("ttl"));
    const bust = url.searchParams.get("bust") === "1";

    if (!ALLOWED_PREFIXES.some((p) => path.startsWith(p))) {
      return new Response(
        JSON.stringify({ error: "Invalid path" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Pass through every other query param to WP (excluding our control params)
    const wpUrl = new URL(`${WP_BASE}${path}`);
    url.searchParams.forEach((value, key) => {
      if (key === "path" || key === "ttl" || key === "bust") return;
      wpUrl.searchParams.append(key, value);
    });

    const wpRes = await fetch(wpUrl.toString(), {
      headers: { Accept: "application/json" },
      // When busting, ask WP for a fresh copy (no intermediary caches).
      cache: bust ? "no-store" : "default",
    });

    const body = await wpRes.text();
    const total = wpRes.headers.get("x-wp-total") ?? "";
    const totalPages = wpRes.headers.get("x-wp-totalpages") ?? "";

    // Decide cache header:
    // - bust=1            => no-store (force-revalidate, do not cache)
    // - ttl=0             => no-store
    // - ttl=N             => public, max-age=N
    // - default           => public, max-age=DEFAULT
    let cacheControl: string;
    if (bust || ttlParam === 0) {
      cacheControl = "no-store, max-age=0, must-revalidate";
    } else {
      const seconds = ttlParam ?? DEFAULT_CACHE_SECONDS;
      cacheControl = `public, max-age=${seconds}, s-maxage=${seconds}`;
    }

    return new Response(body, {
      status: wpRes.status,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
        "Cache-Control": cacheControl,
        "X-WP-Total": total,
        "X-WP-TotalPages": totalPages,
        "X-Cache-TTL": String(ttlParam ?? (bust ? 0 : DEFAULT_CACHE_SECONDS)),
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("wp-proxy error:", message);
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
