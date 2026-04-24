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

/**
 * "More like this" recommendation block for the Library.
 *
 * Triggers when a category filter is active. Picks a small set of "similar"
 * categories using token-overlap on the active category's name (same scoring
 * idea as SparseCategoryHelper), then fetches a few recent posts from each.
 * Also surfaces a small list of related pages by title-token match.
 *
 * Differences from sibling discovery components:
 *   - {@link FeaturedFromOtherCategories}: 1 post per other-category, popularity-ordered
 *   - {@link CategoryExploration}:         wide-net browse-everything grid
 *   - {@link MoreLikeThis} (this file):    similarity-driven, mixes posts + pages
 *
 * The mix keeps the recommendation feeling "for you" rather than generic.
 */

const RELATED_CATEGORY_LIMIT = 4;
const POSTS_PER_RELATED_CAT = 2;
const RELATED_PAGES_LIMIT = 3;

export interface MoreLikeThisProps {
  activeCategory: WPCategory;
  allCategories: WPCategory[];
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

/** Pick categories most similar to `active` by token overlap; popularity breaks ties. */
function pickRelated(active: WPCategory, all: WPCategory[]): WPCategory[] {
  const activeTokens = new Set(tokenize(active.name));
  const scored = all
    .filter((c) => c.id !== active.id && c.count > 0)
    .map((c) => ({
      c,
      overlap: tokenize(c.name).filter((t) => activeTokens.has(t)).length,
    }))
    // Drop zero-overlap candidates so this section stays meaningfully "similar"
    // — the wide-net Discover module already covers pure popularity.
    .filter((x) => x.overlap > 0)
    .sort((a, b) => (b.overlap - a.overlap) || (b.c.count - a.c.count));

  // Fallback: if no overlapping categories exist, fall back to popularity so
  // the section still renders something useful.
  if (scored.length === 0) {
    return all
      .filter((c) => c.id !== active.id && c.count > 0)
      .sort((a, b) => b.count - a.count)
      .slice(0, RELATED_CATEGORY_LIMIT);
  }

  return scored.slice(0, RELATED_CATEGORY_LIMIT).map((s) => s.c);
}

export function MoreLikeThis({ activeCategory, allCategories }: MoreLikeThisProps) {
  const related = useMemo(
    () => pickRelated(activeCategory, allCategories),
    [activeCategory, allCategories],
  );

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

  // Related pages: search WP pages with the active category name as the query.
  // This is a coarse heuristic but works well when page slugs/titles share
  // vocabulary with the topic (e.g. "anxiety" → /anxiety-relief, etc.).
  const pagesQuery = useQuery({
    queryKey: ["wp", "pages", "more-like-this", activeCategory.id],
    queryFn: () =>
      wp.pages({
        search: activeCategory.name,
        per_page: RELATED_PAGES_LIMIT,
        orderby: "relevance",
        order: "desc",
      }),
    staleTime: WP_STALE.list,
    gcTime: WP_STALE.gc,
    // Only run if the active category name is meaningful (>= 3 chars).
    enabled: activeCategory.name.trim().length >= 3,
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

  // Render nothing if we have absolutely nothing to recommend — avoids a
  // lonely heading.
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
            Articles and pages from related topics, hand-picked from the library.
          </p>
        </div>
      </div>

      {/* Posts grid */}
      {dedupedPosts.length > 0 && (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {dedupedPosts.map(({ post, cat }) => {
            const img = getFeaturedImage(post);
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
                        })
                      }
                      className="text-xs font-medium text-primary hover:underline underline-offset-4 mb-2 inline-block"
                    >
                      {cat.name}
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
