import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/**
 * Per-slug SEO overrides imported from the original WordPress site (Yoast).
 *
 * Why this exists: the WP REST proxy gives us auto-generated titles/descriptions
 * derived from the post body. The live mindfulnessexercises.com site has been
 * ranking with hand-tuned Yoast titles, descriptions, canonicals, and focus
 * keywords. Until we re-import those values into our wp_seo table and prefer
 * them over the auto-derived ones, crawlers see degraded SEO for migrated posts.
 *
 * Yoast templates such as %%title%% / %%sitename%% / %%page%% / %%sep%% leak
 * through when the editor never overrode the default — those are filtered out
 * here so we never render literal placeholders to crawlers.
 */
export interface WpSeoOverride {
  yoast_title: string | null;
  yoast_desc: string | null;
  yoast_canonical: string | null;
  yoast_focus_kw: string | null;
  robots_noindex: boolean;
}

const PLACEHOLDER_RE = /%%[a-z_]+%%/i;

/** Drop strings that are empty, contain Yoast placeholders, or are pure noise. */
function clean(value: string | null | undefined): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (PLACEHOLDER_RE.test(trimmed)) return null;
  return trimmed;
}

export function useWpSeoOverride(slug: string | undefined) {
  return useQuery({
    queryKey: ["wp_seo", slug ?? ""],
    enabled: Boolean(slug),
    staleTime: 1000 * 60 * 60, // 1h — these rarely change at runtime
    queryFn: async (): Promise<WpSeoOverride | null> => {
      if (!slug) return null;
      const { data, error } = await supabase
        .from("wp_seo")
        .select("yoast_title, yoast_desc, yoast_canonical, yoast_focus_kw")
        .eq("slug", slug)
        .maybeSingle();
      if (error) return null;
      if (!data) return null;
      return {
        yoast_title: clean(data.yoast_title),
        yoast_desc: clean(data.yoast_desc),
        yoast_canonical: clean(data.yoast_canonical),
        yoast_focus_kw: clean(data.yoast_focus_kw),
      };
    },
  });
}
