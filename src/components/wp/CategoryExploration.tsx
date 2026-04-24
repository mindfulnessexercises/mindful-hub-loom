import { useEffect, useMemo, useState } from "react";
import { useQueries } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { ArrowRight, Compass, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  wp,
  getFeaturedImage,
  stripHtml,
  type WPCategory,
  type WPPost,
} from "@/lib/wp";
import { wpKeys, WP_STALE } from "@/lib/wp-cache";
import { trackEvent } from "@/lib/analytics";

/**
 * Wide-net category exploration module for the Library.
 *
 * Differs from {@link FeaturedFromOtherCategories} (compact 6-card horizontal
 * row) by:
 *   - Showing many more categories (default 12, expandable to 24+)
 *   - Working even when no category filter is active (pure discovery surface)
 *   - Lazy-loading additional batches via "Show more topics" so the initial
 *     payload stays small
 *   - Each topic block previews up to 3 recent posts to give visitors a
 *     real sense of the category, not just its name
 *
 * Sorting strategy: we shuffle the candidate pool with a stable seed (current
 * day) so the surface feels fresh on repeat visits without re-rendering chaos
 * within a session. Top-popularity categories are pinned to the front.
 */

const INITIAL_BATCH = 6;
const BATCH_INCREMENT = 6;
const POSTS_PER_TOPIC = 3;
const PINNED_BY_POPULARITY = 3;

export interface CategoryExplorationProps {
  /** Visible categories already filtered to count > 0 and not "uncategorized". */
  categories: WPCategory[];
  /** Optional active category id to exclude from suggestions. */
  excludeCategoryId?: number;
  /** Section heading override. */
  title?: string;
  /** Eyebrow override. */
  eyebrow?: string;
}

/** Stable per-day shuffle so the order varies across visits but not within one. */
function dailyShuffle<T>(arr: T[]): T[] {
  const seed = Math.floor(Date.now() / 86_400_000); // day index
  return [...arr]
    .map((item) => ({ item, k: hash(`${seed}:${JSON.stringify(item)}`) }))
    .sort((a, b) => a.k - b.k)
    .map((x) => x.item);
}

// Tiny string hash (xorshift-esque) — fine for shuffle keys, NOT crypto.
function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function CategoryExploration({
  categories,
  excludeCategoryId,
  title = "Discover more topics",
  eyebrow = "Wider exploration",
}: CategoryExplorationProps) {
  // Build the candidate pool: pin the top-N by popularity at the front, then
  // shuffle the long-tail so different topics surface across visits.
  const ordered = useMemo(() => {
    const pool = categories.filter((c) => c.id !== excludeCategoryId);
    const byPop = [...pool].sort((a, b) => b.count - a.count);
    const pinned = byPop.slice(0, PINNED_BY_POPULARITY);
    const rest = dailyShuffle(byPop.slice(PINNED_BY_POPULARITY));
    return [...pinned, ...rest];
  }, [categories, excludeCategoryId]);

  const [visibleCount, setVisibleCount] = useState(INITIAL_BATCH);
  const visibleCats = ordered.slice(0, Math.min(visibleCount, ordered.length));
  const hasMore = visibleCount < ordered.length;

  // Fetch up to N recent posts per visible category in parallel. react-query
  // caches per-category so revisiting the page is instant.
  const queries = useQueries({
    queries: visibleCats.map((cat) => ({
      queryKey: [
        ...wpKeys.postsList({
          scope: "category-exploration",
          category: cat.id,
          perPage: POSTS_PER_TOPIC,
        }),
      ],
      queryFn: () =>
        wp.posts({
          categories: cat.id,
          per_page: POSTS_PER_TOPIC,
          orderby: "date",
          order: "desc",
        }),
      staleTime: WP_STALE.list,
      gcTime: WP_STALE.gc,
    })),
  });

  const onShowMore = () => {
    const next = Math.min(visibleCount + BATCH_INCREMENT, ordered.length);
    setVisibleCount(next);
    trackEvent("category_exploration_loaded_more", {
      from: visibleCount,
      to: next,
      total_available: ordered.length,
    });
  };

  // SEO: emit a JSON-LD ItemList describing the visible topic cards so search
  // engines can understand this as a structured list of category landing pages
  // (each pointing at its crawlable /category/:slug URL). Re-runs whenever the
  // visible set grows (Show more) so the markup stays in sync. Skipped when
  // there's nothing to render.
  useEffect(() => {
    if (visibleCats.length === 0) return;
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const json = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: title,
      itemListOrder: "https://schema.org/ItemListOrderDescending",
      numberOfItems: visibleCats.length,
      itemListElement: visibleCats.map((cat, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${origin}/category/${cat.slug}`,
        name: stripHtml(cat.name),
      })),
    };
    const id = "category-exploration-jsonld";
    let el = document.getElementById(id) as HTMLScriptElement | null;
    const created = !el;
    if (!el) {
      el = document.createElement("script");
      el.id = id;
      el.type = "application/ld+json";
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(json);
    return () => {
      if (created) el?.remove();
    };
  }, [visibleCats, title]);

  if (visibleCats.length === 0) return null;

  return (
    <section
      aria-label={title}
      className="mt-12 lg:mt-16 pt-10 lg:pt-12 border-t border-border"
    >
      <div className="flex items-end justify-between gap-4 mb-6">
        <div>
          <p className="text-eyebrow text-muted-foreground mb-1 inline-flex items-center gap-1.5">
            <Compass className="h-3.5 w-3.5" aria-hidden /> {eyebrow}
          </p>
          <h2 className="text-card-heading text-foreground">{title}</h2>
          <p className="text-body-sm text-muted-foreground mt-1">
            Browse a wider slice of the library — {ordered.length}{" "}
            {ordered.length === 1 ? "category" : "categories"} to explore.
          </p>
        </div>
      </div>

      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {visibleCats.map((cat, i) => {
          const q = queries[i];
          const posts: WPPost[] = q?.data?.items ?? [];
          return (
            <li key={cat.id}>
              <article className="h-full flex flex-col rounded-lg border border-border bg-card p-5 hover:border-primary/30 hover:shadow-[var(--shadow-card-hover)] transition-all">
                <header className="flex items-start justify-between gap-3 mb-3">
                  <div className="min-w-0">
                    <h3 className="text-base font-semibold text-foreground truncate">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {cat.count.toLocaleString()} {cat.count === 1 ? "post" : "posts"}
                    </p>
                  </div>
                  <Link
                    to={`/library?cat=${cat.id}`}
                    onClick={() =>
                      trackEvent("category_exploration_topic_opened", {
                        category_id: cat.id,
                        category_slug: cat.slug,
                        location: "topic_card_header",
                      })
                    }
                    className="shrink-0 text-xs font-semibold text-primary hover:underline underline-offset-4 inline-flex items-center gap-1 min-h-[36px]"
                    aria-label={`Browse all ${cat.name} posts`}
                  >
                    Browse <ArrowRight className="h-3 w-3" />
                  </Link>
                </header>

                <div className="flex-1">
                  {q?.isLoading && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground py-4">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" /> Loading recent posts…
                    </div>
                  )}
                  {!q?.isLoading && posts.length === 0 && (
                    <p className="text-xs text-muted-foreground py-2">
                      No recent posts to preview.
                    </p>
                  )}
                  {posts.length > 0 && (
                    <ul className="space-y-2.5 border-t border-border/60 pt-3">
                      {posts.map((p) => {
                        const img = getFeaturedImage(p);
                        return (
                          <li key={p.id}>
                            <Link
                              to={`/${p.slug}`}
                              onClick={() =>
                                trackEvent("category_exploration_post_opened", {
                                  category_id: cat.id,
                                  category_slug: cat.slug,
                                  post_id: p.id,
                                })
                              }
                              className="group flex items-start gap-3 -mx-1 px-1 py-1 rounded hover:bg-[hsl(var(--section-alternate))] transition-colors"
                            >
                              {img ? (
                                <img
                                  src={img.url}
                                  alt=""
                                  loading="lazy"
                                  className="h-10 w-10 rounded object-cover shrink-0"
                                />
                              ) : (
                                <div className="h-10 w-10 rounded bg-accent shrink-0" aria-hidden />
                              )}
                              <span
                                className="text-xs leading-snug text-foreground line-clamp-2 group-hover:text-primary transition-colors"
                                dangerouslySetInnerHTML={{ __html: p.title.rendered }}
                              />
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>

                {/* Inline call-to-action for keyboard users / mobile reach */}
                <Link
                  to={`/library?cat=${cat.id}`}
                  onClick={() =>
                    trackEvent("category_exploration_topic_opened", {
                      category_id: cat.id,
                      category_slug: cat.slug,
                      location: "topic_card_footer",
                    })
                  }
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2 transition-all min-h-[36px]"
                >
                  Explore {cat.name} <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </article>
            </li>
          );
        })}
      </ul>

      {hasMore && (
        <div className="mt-8 flex justify-center">
          <Button
            type="button"
            variant="outline"
            onClick={onShowMore}
            className="min-h-[44px]"
          >
            Show more topics
            <span className="ml-1.5 opacity-60 text-xs">
              ({Math.min(BATCH_INCREMENT, ordered.length - visibleCount)} more)
            </span>
          </Button>
        </div>
      )}
    </section>
  );
}

