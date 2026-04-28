// Sync Buzzsprout episodes into the `buzzsprout_episodes` table.
//
// Calls https://www.buzzsprout.com/api/<podcastId>/episodes.json with the
// project's BUZZSPROUT_API_TOKEN, then upserts every episode by episode_id.
// We derive a slug from the episode title using the same rules WordPress uses
// for post slugs so we can join podcast-episode WP posts to Buzzsprout
// episodes by slug at request time.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.45.0/cors";

const PODCAST_ID = "2555881";

interface BuzzsproutEpisode {
  id: number;
  title: string;
  audio_url?: string;
  artwork_url?: string;
  published_at?: string;
  duration?: number;
  slug?: string;
}

// WordPress-compatible slugify: lowercase, strip diacritics, drop punctuation,
// collapse whitespace to single hyphens. Matches the slugs we see in WP URLs.
function slugify(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const token = Deno.env.get("BUZZSPROUT_API_TOKEN");
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!token) {
    return new Response(JSON.stringify({ error: "BUZZSPROUT_API_TOKEN not configured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  if (!supabaseUrl || !serviceKey) {
    return new Response(JSON.stringify({ error: "Supabase env not configured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const url = `https://www.buzzsprout.com/api/${PODCAST_ID}/episodes.json`;
    const res = await fetch(url, {
      headers: {
        Authorization: `Token token=${token}`,
        Accept: "application/json",
      },
    });
    if (!res.ok) {
      const body = await res.text();
      return new Response(
        JSON.stringify({ error: `Buzzsprout API ${res.status}`, body }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    const episodes = (await res.json()) as BuzzsproutEpisode[];

    const supabase = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false },
    });

    const rows = episodes.map((e) => ({
      episode_id: String(e.id),
      podcast_id: PODCAST_ID,
      slug: e.slug && e.slug.length > 0 ? slugify(e.slug) : slugify(e.title),
      title: e.title,
      audio_url: e.audio_url ?? null,
      artwork_url: e.artwork_url ?? null,
      published_at: e.published_at ?? null,
      duration_seconds: typeof e.duration === "number" ? e.duration : null,
    }));

    // Upsert in chunks to stay well under any payload limits.
    const chunkSize = 200;
    let upserted = 0;
    for (let i = 0; i < rows.length; i += chunkSize) {
      const chunk = rows.slice(i, i + chunkSize);
      const { error } = await supabase
        .from("buzzsprout_episodes")
        .upsert(chunk, { onConflict: "episode_id" });
      if (error) throw error;
      upserted += chunk.length;
    }

    return new Response(
      JSON.stringify({ ok: true, fetched: episodes.length, upserted }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
