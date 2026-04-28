// Client-side lookup of cached Buzzsprout episodes by WP post slug.
// Populated by the `buzzsprout-sync` edge function.

import { supabase } from "@/integrations/supabase/client";
import type { BuzzsproutEmbed } from "@/lib/buzzsprout";

export interface BuzzsproutEpisodeRecord {
  embed: BuzzsproutEmbed;
  title: string;
  slug: string;
  artworkUrl: string | null;
  publishedAt: string | null;
  durationSeconds: number | null;
  descriptionHtml: string | null;
  aiSummary: string | null;
  aiTakeaways: string[] | null;
  aiQuestions: string[] | null;
}

const cache = new Map<string, BuzzsproutEpisodeRecord | null>();

export async function lookupBuzzsproutBySlug(
  slug: string,
): Promise<BuzzsproutEpisodeRecord | null> {
  if (!slug) return null;
  if (cache.has(slug)) return cache.get(slug) ?? null;

  const { data, error } = await supabase
    .from("buzzsprout_episodes")
    .select(
      "episode_id, podcast_id, title, slug, artwork_url, published_at, duration_seconds, description_html, ai_summary, ai_takeaways, ai_questions",
    )
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) {
    cache.set(slug, null);
    return null;
  }
  const record: BuzzsproutEpisodeRecord = {
    embed: {
      podcastId: data.podcast_id,
      episodeId: data.episode_id,
      iframeSrc: `https://www.buzzsprout.com/${data.podcast_id}/episodes/${data.episode_id}?client_source=small_player&iframe=true&player=small`,
    },
    title: data.title,
    slug: data.slug,
    artworkUrl: data.artwork_url ?? null,
    publishedAt: data.published_at ?? null,
    durationSeconds: data.duration_seconds ?? null,
    descriptionHtml: data.description_html ?? null,
    aiSummary: data.ai_summary ?? null,
    aiTakeaways: (data.ai_takeaways as string[] | null) ?? null,
    aiQuestions: (data.ai_questions as string[] | null) ?? null,
  };
  cache.set(slug, record);
  return record;
}

/** Backwards-compatible: returns just the embed (used as a fallback player). */
export async function lookupBuzzsproutEmbedBySlug(
  slug: string,
): Promise<BuzzsproutEmbed | null> {
  const r = await lookupBuzzsproutBySlug(slug);
  return r?.embed ?? null;
}
