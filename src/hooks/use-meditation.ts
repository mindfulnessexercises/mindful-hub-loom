import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Meditation {
  slug: string;
  title: string;
  speaker: string | null;
  portrait_url: string | null;
  audio_url: string;
  duration_seconds: number | null;
}

/**
 * Fetches the meditation/talk audio metadata for a given post slug.
 * Returns null when the post has no associated meditation, which is the
 * common case for blog articles. Cached aggressively — meditations rarely
 * change once imported.
 */
export function useMeditation(slug: string | undefined) {
  return useQuery({
    queryKey: ["meditation", slug],
    queryFn: async (): Promise<Meditation | null> => {
      if (!slug) return null;
      const { data, error } = await supabase
        .from("meditations")
        .select("slug, title, speaker, portrait_url, audio_url, duration_seconds")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
  });
}
