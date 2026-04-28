import { useMemo } from "react";
import { useQueries, useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, BookOpen } from "lucide-react";
import {
  wp,
  getFeaturedImage,
  stripHtml,
  type WPCategory,
  type WPPost,
  type WPPage,
} from "@/lib/wp";
import { wpKeys, WP_STALE } from "@/lib/wp-cache";
import { trackEvent } from "@/lib/analytics";
import { getRecentCategories } from "@/lib/recent-categories";

/**
 * "More like this" recommendation block for the Library.
 *
 * Picks a small set of "similar" categories using a weighted blend of
 * **three intent signals**, then fetches a few recent posts from each and a
 * handful of related pages.
 *
 * Scoring signals (per candidate category):
 *   1. **Active-category similarity** — token overlap between the active
 *      category name and the candidate name.
 *   2. **Search-term relevance** — token overlap between the user's current
 *      search query and the candidate (slug + name). Strongest signal of
 *      *current* intent.
 *   3. **Recently visited categories** — token overlap with names of
 *      categories the user filtered by earlier this session, with a
 *      recency-weighted boost. Captures "where they've been wandering".
 *
 * The blend means the section feels topical (similarity) AND personalised
 * (their search + browsing trail) without becoming a generic popularity
 * list — that role is filled by FeaturedFromOtherCategories /
 * CategoryExploration.
 */

const RELATED_CATEGORY_LIMIT = 4;
const POSTS_PER_RELATED_CAT = 2;
const RELATED_PAGES_LIMIT = 3;

// Signal weights — kept here so they're easy to tune from one place. The
// active category gets the highest weight because it's the strongest "what
// am I looking at right now" signal; search follows because it's the most
// explicit declared intent; recent visits are a softer "what's been
// interesting this session" hint.
const W_ACTIVE = 3;
const W_SEARCH = 2.5;
const W_RECENT_BASE = 1.2;
// Tie-breaker weight on log10(post count) so popularity nudges ties without
// dominating real similarity.
const W_POPULARITY = 0.15;

export interface MoreLikeThisProps {
  activeCategory: WPCategory;
  allCategories: WPCategory[];
  /** Current search query, if any — folded into the relevance score. */
  search?: string;
}

const STOP = new Set([
  "and", "the", "for", "with", "of", "in", "on", "to", "a", "an", "your", "you",
  "how", "what", "why", "when", "is", "are", "be", "or",
]);

function tokenize(s: string): string[] {
  return Array.from(
    new Set(
      s
        .toLowerCase()
        .replace(/<[^>]*>/g, " ")
        .replace(/[^a-z0-9\s-]/g, " ")
        .split(/[\s-]+/)
        .filter((t) => t.length > 2 && !STOP.has(t)),
    ),
  );
}

interface ScoredCategory {
  c: WPCategory;
  score: number;
  /** Component breakdown — kept for analytics + debuggability. */
  breakdown: {
    active: number;
    search: number;
    recent: number;
    popularity: number;
  };
}

/**
 * Score every candidate category by the weighted blend of similarity,
 * search relevance, and recent-visit overlap. Returns the top N.
 */
function pickRelated(
  active: WPCategory,
  all: WPCategory[],
  search: string | undefined,
): ScoredCategory[] {
  const activeTokens = new Set(tokenize(active.name));
  const searchTokens = new Set(search ? tokenize(search) : []);

  // Recent categories with recency weight: most recent = 1.0, decaying
  // linearly to 0.4 across the slot range so older visits still nudge but
  // don't outvote the freshest signal.
  const recent = getRecentCategories(active.id);
  const recentTokenWeights = new Map<string, number>();
  recent.forEach((entry, idx) => {
    const weight = 1 - (idx / Math.max(1, recent.length)) * 0.6; // 1.0 → 0.4
    for (const tok of tokenize(entry.name)) {
      recentTokenWeights.set(
        tok,
        Math.max(recentTokenWeights.get(tok) ?? 0, weight),
      );
    }
  });

  const candidates = all.filter((c) => c.id !== active.id && c.count > 0);

  const scored: ScoredCategory[] = candidates.map((c) => {
    const candTokens = tokenize(`${c.slug} ${c.name}`);
    const activeOverlap = candTokens.filter((t) => activeTokens.has(t)).length;
    const searchOverlap = candTokens.filter((t) => searchTokens.has(t)).length;
    const recentOverlap = candTokens.reduce(
      (sum, t) => sum + (recentTokenWeights.get(t) ?? 0),
      0,
    );
    const popularity = Math.log10(Math.max(1, c.count));

    const score =
      activeOverlap * W_ACTIVE +
      searchOverlap * W_SEARCH +
      recentOverlap * W_RECENT_BASE +
      popularity * W_POPULARITY;

    return {
      c,
      score,
      breakdown: {
        active: activeOverlap,
        search: searchOverlap,
        recent: Number(recentOverlap.toFixed(2)),
        popularity: Number(popularity.toFixed(2)),
      },
    };
  });

  // Require *some* meaningful intent signal (not just popularity) so this
  // section stays distinct from generic discovery surfaces. If absolutely
  // nothing scores above the popularity floor, fall back to popularity so
  // the section still renders.
  const meaningful = scored.filter(
    (s) => s.breakdown.active + s.breakdown.search + s.breakdown.recent > 0,
  );

  const pool = meaningful.length > 0 ? meaningful : scored;

  return pool
    .sort((a, b) => b.score - a.score || b.c.count - a.c.count)
    .slice(0, RELATED_CATEGORY_LIMIT);
}

export function MoreLikeThis({ activeCategory, allCategories, search }: MoreLikeThisProps) {
  const scoredRelated = useMemo(
    () => pickRelated(activeCategory, allCategories, search),
    [activeCategory, allCategories, search],
  );
  const related = useMemo(() => scoredRelated.map((s) => s.c), [scoredRelated]);

  // Map id → score breakdown for analytics enrichment.
  const breakdownById = useMemo(() => {
    const m = new Map<number, ScoredCategory["breakdown"]>();
    scoredRelated.forEach((s) => m.set(s.c.id, s.breakdown));
    return m;
  }, [scoredRelated]);

  // Fetch top N posts per related category in parallel.
  const postQueries = useQueries({
    queries: related.map((cat) => ({
      queryKey: [
        ...wpKeys.postsList({
          scope: "more-like-this",
          category: cat.id,
          perPage: POSTS_PER_RELATED_CAT,
        }),
      ],
      queryFn: () =>
        wp.posts({
          categories: cat.id,
          per_page: POSTS_PER_RELATED_CAT,
          orderby: "date",
          order: "desc",
        }),
      staleTime: WP_STALE.list,
      gcTime: WP_STALE.gc,
    })),
  });

  // Related pages: prefer the explicit search term (strongest declared
  // intent) when present; otherwise fall back to the active category name.
  const pagesQueryTerm = (search?.trim() && search.trim().length >= 3)
    ? search.trim()
    : activeCategory.name;
  const pagesQuery = useQuery({
    queryKey: ["wp", "pages", "more-like-this", activeCategory.id, pagesQueryTerm],
    queryFn: () =>
      wp.pages({
        search: pagesQueryTerm,
        per_page: RELATED_PAGES_LIMIT,
        orderby: "relevance",
        order: "desc",
      }),
    staleTime: WP_STALE.list,
    gcTime: WP_STALE.gc,
    enabled: pagesQueryTerm.trim().length >= 3,
  });

  // Build a flat, de-duplicated post list paired with its source category.
  const posts = related.flatMap((cat, i) => {
    const items = (postQueries[i]?.data?.items ?? []) as WPPost[];
    return items.map((p) => ({ post: p, cat }));
  });
  const seenPostIds = new Set<number>();
  const dedupedPosts = posts.filter(({ post }) => {
    if (seenPostIds.has(post.id)) return false;
    seenPostIds.add(post.id);
    return true;
  });

  const pages = (pagesQuery.data?.items ?? []) as WPPage[];

  if (dedupedPosts.length === 0 && pages.length === 0) return null;

  return (
    <section
      aria-label={`More like ${activeCategory.name}`}
      className="mt-12 lg:mt-16 pt-10 lg:pt-12 border-t border-border"
    >
      <div className="flex items-end justify-between gap-4 mb-6">
        <div>
          <p className="text-eyebrow text-muted-foreground mb-1 inline-flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5" aria-hidden /> Recommended for you
          </p>
          <h2 className="text-card-heading text-foreground">
            More like {activeCategory.name}
          </h2>
          <p className="text-body-sm text-muted-foreground mt-1">
            {search?.trim()
              ? `Tuned to your search "${search.trim()}" and recent topics.`
              : "Articles and pages from related topics, hand-picked from the library."}
          </p>
        </div>
      </div>

      {/* Posts grid */}
      {dedupedPosts.length > 0 && (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {dedupedPosts.map(({ post, cat }) => {
            const img = getFeaturedImage(post);
            const breakdown = breakdownById.get(cat.id);
            return (
              <li key={post.id}>
                <article className="group h-full flex flex-col bg-card rounded-lg overflow-hidden border border-border shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-shadow">
                  <Link
                    to={`/${post.slug}`}
                    onClick={() =>
                      trackEvent("more_like_this_post_opened", {
                        post_id: post.id,
                        from_category_id: activeCategory.id,
                        from_category_slug: activeCategory.slug,
                        related_category_id: cat.id,
                        related_category_slug: cat.slug,
                        signal_active: breakdown?.active,
                        signal_search: breakdown?.search,
                        signal_recent: breakdown?.recent,
                        had_search: Boolean(search?.trim()),
                      })
                    }
                    className="block aspect-[16/10] bg-muted overflow-hidden"
                    aria-label={stripHtml(post.title.rendered)}
                  >
                    {img ? (
                      <img
                        src={img.url}
                        alt={img.alt}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-[hsl(var(--accent))]" />
                    )}
                  </Link>
                  <div className="p-4 flex flex-col flex-1">
                    <Link
                      to={`/library?cat=${cat.id}`}
                      onClick={() =>
                        trackEvent("more_like_this_related_category_opened", {
                          from_category_id: activeCategory.id,
                          related_category_id: cat.id,
                          related_category_slug: cat.slug,
                          signal_active: breakdown?.active,
                          signal_search: breakdown?.search,
                          signal_recent: breakdown?.recent,
                        })
                      }
                      className="text-xs font-medium text-primary hover:underline underline-offset-4 mb-2 inline-block"
                    >
                      {stripHtml(cat.name)}
                    </Link>
                    <h3
                      className="text-sm font-semibold text-foreground line-clamp-2 mb-3"
                      dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                    />
                    <Link
                      to={`/${post.slug}`}
                      onClick={() =>
                        trackEvent("more_like_this_post_opened", {
                          post_id: post.id,
                          from_category_id: activeCategory.id,
                          from_category_slug: activeCategory.slug,
                          related_category_id: cat.id,
                          related_category_slug: cat.slug,
                          location: "card_footer",
                        })
                      }
                      className="mt-auto inline-flex items-center gap-1 text-xs font-semibold text-primary hover:gap-2 transition-all min-h-[36px]"
                    >
                      Read <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      )}

      {/* Related pages */}
      {pages.length > 0 && (
        <div className="mt-8">
          <h3 className="text-sm font-semibold text-foreground mb-3 inline-flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-muted-foreground" aria-hidden />
            Related pages
          </h3>
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {pages.map((p) => (
              <li key={p.id}>
                <Link
                  to={`/${p.slug}`}
                  onClick={() =>
                    trackEvent("more_like_this_page_opened", {
                      page_id: p.id,
                      from_category_id: activeCategory.id,
                      from_category_slug: activeCategory.slug,
                      query_term: pagesQueryTerm,
                      had_search: Boolean(search?.trim()),
                    })
                  }
                  className="group flex items-start gap-3 p-3 rounded-lg border border-border bg-card hover:border-primary/30 hover:shadow-[var(--shadow-card-hover)] transition-all min-h-[44px]"
                >
                  <div className="shrink-0 mt-0.5 h-8 w-8 rounded-md bg-accent text-accent-foreground inline-flex items-center justify-center">
                    <BookOpen className="h-4 w-4" aria-hidden />
                  </div>
                  <span
                    className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2"
                    dangerouslySetInnerHTML={{ __html: p.title.rendered }}
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
