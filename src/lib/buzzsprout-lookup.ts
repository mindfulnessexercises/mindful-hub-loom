// Client-side lookup of cached Buzzsprout episodes by WP post slug.
//
// The `buzzsprout_episodes` table is populated by the `buzzsprout-sync`
// edge function. We expose a tiny in-module cache so multiple components
// rendering on the same page only hit the DB once per slug.

import { supabase } from "@/integrations/supabase/client";
import type { BuzzsproutEmbed } from "@/lib/buzzsprout";

const cache = new Map<string, BuzzsproutEmbed | null>();

export async function lookupBuzzsproutBySlug(
  slug: string,
): Promise<BuzzsproutEmbed | null> {
  if (!slug) return null;
  if (cache.has(slug)) return cache.get(slug) ?? null;

  const { data, error } = await supabase
    .from("buzzsprout_episodes")
    .select("episode_id, podcast_id")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) {
    cache.set(slug, null);
    return null;
  }
  const embed: BuzzsproutEmbed = {
    podcastId: data.podcast_id,
    episodeId: data.episode_id,
    iframeSrc: `https://www.buzzsprout.com/${data.podcast_id}/episodes/${data.episode_id}?client_source=small_player&iframe=true&player=small`,
  };
  cache.set(slug, embed);
  return embed;
}
