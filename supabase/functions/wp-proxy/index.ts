// Lovable Cloud edge function: caches WordPress REST responses for ~10 min.
// Usage from frontend: GET /functions/v1/wp-proxy?path=/wp/v2/posts&per_page=12&page=1
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.104.1/cors";

const WP_BASE = "https://mindfulnessexercises.com/wp-json";
const CACHE_SECONDS = 600; // 10 minutes

// Allowlist to prevent SSRF / arbitrary host
const ALLOWED_PREFIXES = ["/wp/v2/"];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const path = url.searchParams.get("path") ?? "";

    if (!ALLOWED_PREFIXES.some((p) => path.startsWith(p))) {
      return new Response(
        JSON.stringify({ error: "Invalid path" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Pass through every other query param to WP
    const wpUrl = new URL(`${WP_BASE}${path}`);
    url.searchParams.forEach((value, key) => {
      if (key !== "path") wpUrl.searchParams.append(key, value);
    });

    const wpRes = await fetch(wpUrl.toString(), {
      headers: { Accept: "application/json" },
    });

    const body = await wpRes.text();

    // Forward useful WP pagination headers
    const total = wpRes.headers.get("x-wp-total") ?? "";
    const totalPages = wpRes.headers.get("x-wp-totalpages") ?? "";

    return new Response(body, {
      status: wpRes.status,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
        "Cache-Control": `public, max-age=${CACHE_SECONDS}, s-maxage=${CACHE_SECONDS}`,
        "X-WP-Total": total,
        "X-WP-TotalPages": totalPages,
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
