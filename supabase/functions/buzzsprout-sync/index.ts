// Sync Buzzsprout episodes into the `buzzsprout_episodes` table.
//
// Calls https://www.buzzsprout.com/api/<podcastId>/episodes.json with the
// project's BUZZSPROUT_API_TOKEN, then upserts every episode by episode_id.
// We derive a slug from the episode title using the same rules WordPress uses
// for post slugs so we can join podcast-episode WP posts to Buzzsprout
// episodes by slug at request time.
//
// After upsert, any episode that doesn't yet have AI-generated content is
// enriched in-line by calling the Lovable AI gateway. New episodes from
// future syncs (every 6 hours) automatically pick up enrichment.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import {
  DEFAULT_STYLE,
  STYLE_VERSION,
  detectBannedPhrases,
  getStyle,
  type PromptStyle,
} from "./prompt-styles.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const PODCAST_ID = "2555881";
const AI_GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";
const AI_MODEL = "google/gemini-3-flash-preview";

interface BuzzsproutEpisode {
  id: number;
  title: string;
  audio_url?: string;
  artwork_url?: string;
  published_at?: string;
  duration?: number;
  slug?: string;
  description?: string; // HTML show notes
}

function slugify(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

interface EnrichmentResult {
  summary: string;
  takeaways: string[];
  questions: string[];
}

async function enrichEpisode(
  apiKey: string,
  title: string,
  descriptionPlain: string,
): Promise<EnrichmentResult | null> {
  const trimmed = descriptionPlain.slice(0, 6000);
  const systemPrompt = [
    "You write SEO-rich summaries for mindfulness podcast episodes.",
    "Voice: warm, grounded, never clichéd or salesy. Avoid generic 'spa' language.",
    "Output strictly via the provided tool.",
  ].join(" ");

  const userPrompt = `Episode title: ${title}\n\nEpisode description / show notes:\n${trimmed || "(no description provided)"}\n\nGenerate the structured fields.`;

  const body = {
    model: AI_MODEL,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    tools: [
      {
        type: "function",
        function: {
          name: "generate_episode_summary",
          description: "Generate SEO summary, takeaways, and reflection questions for a podcast episode.",
          parameters: {
            type: "object",
            properties: {
              summary: {
                type: "string",
                description: "2-3 paragraph SEO summary (~150-220 words). No headings, just prose.",
              },
              takeaways: {
                type: "array",
                items: { type: "string" },
                minItems: 3,
                maxItems: 5,
                description: "3-5 concise key takeaways from the episode.",
              },
              questions: {
                type: "array",
                items: { type: "string" },
                minItems: 3,
                maxItems: 5,
                description: "3-5 open-ended reflection questions for listeners.",
              },
            },
            required: ["summary", "takeaways", "questions"],
            additionalProperties: false,
          },
        },
      },
    ],
    tool_choice: { type: "function", function: { name: "generate_episode_summary" } },
  };

  const res = await fetch(AI_GATEWAY_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    console.error("AI enrichment failed", res.status, await res.text());
    return null;
  }
  const data = await res.json();
  const args = data?.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
  if (!args) return null;
  try {
    const parsed = JSON.parse(args);
    return {
      summary: String(parsed.summary ?? ""),
      takeaways: Array.isArray(parsed.takeaways) ? parsed.takeaways.map(String) : [],
      questions: Array.isArray(parsed.questions) ? parsed.questions.map(String) : [],
    };
  } catch (e) {
    console.error("Failed to parse AI args", e);
    return null;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const token = Deno.env.get("BUZZSPROUT_API_TOKEN");
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");
  if (!token || !supabaseUrl || !serviceKey) {
    return new Response(JSON.stringify({ error: "Required env not configured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Optional cap on how many episodes to enrich per run, to keep cron fast
  // and cost bounded. Defaults to 5 (more than enough for a 2-3-day cadence).
  const url = new URL(req.url);
  const enrichLimit = Math.max(0, Number(url.searchParams.get("enrich_limit") ?? "5"));

  try {
    const apiUrl = `https://www.buzzsprout.com/api/${PODCAST_ID}/episodes.json`;
    const res = await fetch(apiUrl, {
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
      description_html: e.description ?? null,
    }));

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

    // Enrich episodes missing AI content (newest first).
    let enriched = 0;
    let enrichErrors = 0;
    if (enrichLimit > 0 && lovableApiKey) {
      const { data: pending, error: pendingErr } = await supabase
        .from("buzzsprout_episodes")
        .select("episode_id, title, description_html")
        .is("ai_generated_at", null)
        .order("published_at", { ascending: false, nullsFirst: false })
        .limit(enrichLimit);
      if (pendingErr) throw pendingErr;

      for (const row of pending ?? []) {
        const plain = row.description_html ? stripHtml(row.description_html) : "";
        const result = await enrichEpisode(lovableApiKey, row.title, plain);
        if (!result) {
          enrichErrors += 1;
          continue;
        }
        const { error: updateErr } = await supabase
          .from("buzzsprout_episodes")
          .update({
            ai_summary: result.summary,
            ai_takeaways: result.takeaways,
            ai_questions: result.questions,
            ai_generated_at: new Date().toISOString(),
          })
          .eq("episode_id", row.episode_id);
        if (updateErr) {
          enrichErrors += 1;
          console.error("update failed", row.episode_id, updateErr);
        } else {
          enriched += 1;
        }
      }
    }

    return new Response(
      JSON.stringify({
        ok: true,
        fetched: episodes.length,
        upserted,
        enriched,
        enrichErrors,
      }),
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
