// Rehost meditation audio from external URLs into the meditation-audio bucket.
// One-shot admin utility: streams each row's source MP3, uploads to Storage,
// then updates `audio_url` (preserving `original_audio_url`) and sets rehosted=true.
//
// Usage:
//   POST /functions/v1/rehost-audio
//   Body (optional):
//     { "slug": "the-art-of-surrender" }   // single row
//     { "ids": ["uuid", ...] }             // specific rows
//     { "force": true }                    // re-rehost rows already marked rehosted
//   Default (no body): rehosts every row where rehosted = false.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.95.0";
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";

const BUCKET = "meditation-audio";

interface Meditation {
  id: string;
  slug: string;
  audio_url: string;
  original_audio_url: string | null;
  rehosted: boolean;
}

interface RehostResult {
  id: string;
  slug: string;
  status: "rehosted" | "skipped" | "error";
  new_url?: string;
  error?: string;
}

function extOf(url: string): string {
  try {
    const path = new URL(url).pathname;
    const m = path.match(/\.([a-z0-9]{2,5})$/i);
    return m ? m[1].toLowerCase() : "mp3";
  } catch {
    return "mp3";
  }
}

function contentTypeFor(ext: string): string {
  const map: Record<string, string> = {
    mp3: "audio/mpeg",
    m4a: "audio/mp4",
    mp4: "audio/mp4",
    wav: "audio/wav",
    ogg: "audio/ogg",
    aac: "audio/aac",
  };
  return map[ext] ?? "application/octet-stream";
}

async function rehostOne(
  supabase: ReturnType<typeof createClient>,
  row: Meditation,
  force: boolean,
): Promise<RehostResult> {
  if (row.rehosted && !force) {
    return { id: row.id, slug: row.slug, status: "skipped", new_url: row.audio_url };
  }

  const sourceUrl = row.original_audio_url || row.audio_url;
  if (!sourceUrl || /\/storage\/v1\/object\/public\//.test(sourceUrl)) {
    return {
      id: row.id,
      slug: row.slug,
      status: "skipped",
      new_url: row.audio_url,
      error: "already on storage or no source",
    };
  }

  // Fetch source
  const res = await fetch(sourceUrl, { redirect: "follow" });
  if (!res.ok || !res.body) {
    return { id: row.id, slug: row.slug, status: "error", error: `fetch ${res.status}` };
  }
  const ext = extOf(sourceUrl);
  const contentType = res.headers.get("content-type") || contentTypeFor(ext);
  const buf = new Uint8Array(await res.arrayBuffer());

  const objectPath = `${row.slug}.${ext}`;
  const { error: uploadErr } = await supabase.storage
    .from(BUCKET)
    .upload(objectPath, buf, { contentType, upsert: true });
  if (uploadErr) {
    return { id: row.id, slug: row.slug, status: "error", error: `upload: ${uploadErr.message}` };
  }

  const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(objectPath);
  const newUrl = pub.publicUrl;

  const { error: updErr } = await supabase
    .from("meditations")
    .update({
      audio_url: newUrl,
      original_audio_url: row.original_audio_url || sourceUrl,
      rehosted: true,
      updated_at: new Date().toISOString(),
    })
    .eq("id", row.id);
  if (updErr) {
    return { id: row.id, slug: row.slug, status: "error", error: `db: ${updErr.message}` };
  }

  return { id: row.id, slug: row.slug, status: "rehosted", new_url: newUrl };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

    let body: { slug?: string; ids?: string[]; force?: boolean } = {};
    if (req.method === "POST") {
      try {
        body = await req.json();
      } catch {
        body = {};
      }
    }
    const force = body.force === true;

    let query = supabase
      .from("meditations")
      .select("id, slug, audio_url, original_audio_url, rehosted");

    if (body.slug) query = query.eq("slug", body.slug);
    else if (body.ids?.length) query = query.in("id", body.ids);
    else if (!force) query = query.eq("rehosted", false);

    const { data, error } = await query;
    if (error) throw error;

    const rows = (data ?? []) as Meditation[];
    const results: RehostResult[] = [];
    for (const row of rows) {
      try {
        results.push(await rehostOne(supabase, row, force));
      } catch (e) {
        results.push({
          id: row.id,
          slug: row.slug,
          status: "error",
          error: e instanceof Error ? e.message : String(e),
        });
      }
    }

    const summary = {
      total: results.length,
      rehosted: results.filter((r) => r.status === "rehosted").length,
      skipped: results.filter((r) => r.status === "skipped").length,
      errors: results.filter((r) => r.status === "error").length,
      results,
    };

    return new Response(JSON.stringify(summary, null, 2), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (e) {
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : String(e) }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 },
    );
  }
});
