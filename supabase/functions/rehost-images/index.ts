// Rehost WordPress images into the wp-images bucket and return a mapping
// of original URL -> permanent Cloud Storage URL. Used by the frontend
// (via rewriteWpImages) and as a one-shot backfill utility.
//
// Endpoints:
//   POST /functions/v1/rehost-images
//     Body: { "urls": ["https://mindfulnessexercises.com/wp-content/uploads/...", ...] }
//     -> { "mappings": { "<original>": "<new>" }, "errors": {...} }
//   GET  /functions/v1/rehost-images?lookup=1&urls=<comma-separated>
//     -> { "mappings": { ... } }   (read-only, never fetches new images)
//
// Notes:
//   * Only mirrors images on mindfulnessexercises.com hosts.
//   * Idempotent: a URL already in `rehosted_images` returns the cached mapping.
//   * Uses the unique index on original_url to avoid duplicate uploads under races.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.104.1";
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.104.1/cors";

const BUCKET = "wp-images";
const ALLOWED_HOSTS = new Set([
  "mindfulnessexercises.com",
  "www.mindfulnessexercises.com",
]);
const ALLOWED_EXT = new Set(["jpg", "jpeg", "png", "gif", "webp", "svg", "avif"]);
const MAX_BYTES = 25 * 1024 * 1024; // 25MB safety cap per image

function extOf(pathname: string): string {
  const m = pathname.match(/\.([a-z0-9]{2,5})$/i);
  return m ? m[1].toLowerCase() : "jpg";
}

function contentTypeFor(ext: string): string {
  const map: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    webp: "image/webp",
    svg: "image/svg+xml",
    avif: "image/avif",
  };
  return map[ext] ?? "application/octet-stream";
}

function storagePathFor(u: URL): string {
  // Preserve the WP path so collisions are extremely unlikely:
  //   /wp-content/uploads/2017/10/foo.jpg -> wp-content/uploads/2017/10/foo.jpg
  return u.pathname.replace(/^\/+/, "");
}

function isAllowedImageUrl(raw: string): URL | null {
  try {
    const u = new URL(raw);
    if (!ALLOWED_HOSTS.has(u.hostname.toLowerCase())) return null;
    const ext = extOf(u.pathname);
    if (!ALLOWED_EXT.has(ext)) return null;
    return u;
  } catch {
    return null;
  }
}

type SB = ReturnType<typeof createClient>;

async function rehostOne(
  supabase: SB,
  rawUrl: string,
): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
  const u = isAllowedImageUrl(rawUrl);
  if (!u) return { ok: false, error: "url not allowed" };

  // Cache hit?
  const { data: existing } = await supabase
    .from("rehosted_images")
    .select("public_url")
    .eq("original_url", rawUrl)
    .maybeSingle();
  if (existing?.public_url) return { ok: true, url: existing.public_url as string };

  // Fetch source
  const res = await fetch(u.toString(), { redirect: "follow" });
  if (!res.ok) return { ok: false, error: `fetch ${res.status}` };
  const buf = new Uint8Array(await res.arrayBuffer());
  if (buf.byteLength > MAX_BYTES) return { ok: false, error: "image too large" };
  const ext = extOf(u.pathname);
  const contentType = res.headers.get("content-type") || contentTypeFor(ext);

  const path = storagePathFor(u);
  const { error: upErr } = await supabase.storage
    .from(BUCKET)
    .upload(path, buf, { contentType, upsert: true });
  if (upErr) return { ok: false, error: `upload: ${upErr.message}` };

  const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
  const newUrl = pub.publicUrl;

  // Persist mapping (ignore unique-violation race — re-read instead)
  const { error: insErr } = await supabase.from("rehosted_images").insert({
    original_url: rawUrl,
    storage_path: path,
    public_url: newUrl,
    content_type: contentType,
    byte_size: buf.byteLength,
  });
  if (insErr && !/duplicate key|unique/i.test(insErr.message)) {
    return { ok: false, error: `db: ${insErr.message}` };
  }

  return { ok: true, url: newUrl };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

    const url = new URL(req.url);
    let urls: string[] = [];
    let lookupOnly = false;

    if (req.method === "GET") {
      lookupOnly = url.searchParams.get("lookup") === "1";
      const csv = url.searchParams.get("urls") ?? "";
      urls = csv.split(",").map((s) => s.trim()).filter(Boolean);
    } else if (req.method === "POST") {
      try {
        const body = await req.json();
        urls = Array.isArray(body?.urls) ? body.urls.filter((s: unknown) => typeof s === "string") : [];
        lookupOnly = body?.lookup === true;
      } catch {
        urls = [];
      }
    }

    if (urls.length === 0) {
      return new Response(JSON.stringify({ mappings: {}, errors: {} }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (urls.length > 200) urls = urls.slice(0, 200);

    const mappings: Record<string, string> = {};
    const errors: Record<string, string> = {};

    if (lookupOnly) {
      const { data } = await supabase
        .from("rehosted_images")
        .select("original_url, public_url")
        .in("original_url", urls);
      for (const row of data ?? []) {
        mappings[(row as { original_url: string }).original_url] =
          (row as { public_url: string }).public_url;
      }
    } else {
      // Process in small batches to avoid hammering WP
      const concurrency = 4;
      for (let i = 0; i < urls.length; i += concurrency) {
        const batch = urls.slice(i, i + concurrency);
        const results = await Promise.all(batch.map((u) => rehostOne(supabase, u)));
        batch.forEach((u, idx) => {
          const r = results[idx];
          if (r.ok) mappings[u] = r.url;
          else errors[u] = r.error;
        });
      }
    }

    return new Response(
      JSON.stringify({
        total: urls.length,
        rehosted: Object.keys(mappings).length,
        errors_count: Object.keys(errors).length,
        mappings,
        errors,
      }, null, 2),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : String(e) }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 },
    );
  }
});
