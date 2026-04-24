import { useRef } from "react";
import { useQueries } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { wp, getFeaturedImage, stripHtml, type WPCategory, type WPPost } from "@/lib/wp";
import { wpKeys, WP_STALE } from "@/lib/wp-cache";
import { trackEvent } from "@/lib/analytics";
import { useImpression } from "@/hooks/use-impression";

/**
 * Surfaces a horizontal row of recent posts from categories OTHER than the
 * one currently selected. The intent is discovery: when a visitor narrows the
 * Library to a single topic, this row keeps adjacent topics one click away,
 * preventing tunnel vision and lifting cross-category browsing.
 *
 * Strategy:
 *   - Pick the top N categories (by post count) excluding the active one and
 *     "uncategorized".
 *   - Fetch the most recent post from each in parallel via useQueries (so the
 *     react-query cache is shared with the rest of the app).
 *   - Render a single horizontally-scrollable row of compact cards.
 *
 * Analytics:
 *   - Row impression  → `featured_other_cats_row_viewed` (fires once per
 *     mount when ≥50% of the row has been on screen for 400ms).
 *   - Card impression → `featured_other_cats_card_viewed` (per-card, same
 *     dwell rules; carries the post + category).
 *   - Card click      → `featured_other_cats_card_clicked` with full context
 *     (post, source category, position, click_target = "image" | "title" |
 *     "category_badge" | "read_link").
 */

const OTHER_CATS_LIMIT = 6;

export interface FeaturedFromOtherCategoriesProps {
  /** ID of the category currently filtered to (we exclude this one). */
  activeCategoryId: number;
  /** Visible categories already filtered to count>0 and not "uncategorized". */
  allCategories: WPCategory[];
  /** Optional title override. */
  title?: string;
}

export function FeaturedFromOtherCategories({
  activeCategoryId,
  allCategories,
  title = "Featured from other categories",
}: FeaturedFromOtherCategoriesProps) {
  // Most-popular categories first — those tend to have the freshest content
  // and the broadest appeal as a "you might also like" prompt.
  const otherCats = [...allCategories]
    .filter((c) => c.id !== activeCategoryId)
    .sort((a, b) => b.count - a.count)
    .slice(0, OTHER_CATS_LIMIT);

  const queries = useQueries({
    queries: otherCats.map((cat) => ({
      // Reuse the standard posts cache key so any other component that lists
      // posts from this category gets the same hit.
      queryKey: [
        ...wpKeys.postsList({
          scope: "library-other-cat-feature",
          category: cat.id,
          perPage: 1,
        }),
      ],
      queryFn: () => wp.posts({ categories: cat.id, per_page: 1, orderby: "date", order: "desc" }),
      staleTime: WP_STALE.list,
      gcTime: WP_STALE.gc,
    })),
  });

  // Pair each fetched post with its category so the card can show the badge
  // and link to that category's filtered view.
  // Final order is deterministic: primary = category popularity (post count
  // desc); secondary tie-breaker = most-recent post date desc. This keeps the
  // row stable across renders and makes the "what shows up first" logic
  // predictable for editorial review.
  const items = otherCats
    .map((cat, i) => {
      const post = queries[i]?.data?.items[0] as WPPost | undefined;
      return post ? { cat, post } : null;
    })
    .filter((x): x is { cat: WPCategory; post: WPPost } => Boolean(x))
    .sort((a, b) => {
      if (b.cat.count !== a.cat.count) return b.cat.count - a.cat.count;
      const aTs = new Date(a.post.date).getTime();
      const bTs = new Date(b.post.date).getTime();
      return bTs - aTs;
    });

  // Row-level impression: one event per mount when the row becomes viewable.
  // Uses a stable signature of the rendered items so re-orderings/different
  // categories register as separate impressions in analytics.
  const itemsSignature = items.map((x) => `${x.cat.id}:${x.post.id}`).join(",");
  const rowRef = useImpression<HTMLElement>(
    () => {
      trackEvent("featured_other_cats_row_viewed", {
        from_category_id: activeCategoryId,
        item_count: items.length,
        items_signature: itemsSignature,
      });
    },
    { enabled: items.length > 0 },
  );

  // Hide entirely when nothing to show — avoids a lonely heading + spinner.
  if (items.length === 0) return null;

  const handleClick = (
    cat: WPCategory,
    post: WPPost,
    position: number,
    click_target: "image" | "title" | "category_badge" | "read_link",
  ) => {
    trackEvent("featured_other_cats_card_clicked", {
      from_category_id: activeCategoryId,
      category_id: cat.id,
      category_slug: cat.slug,
      category_name: cat.name,
      post_id: post.id,
      post_slug: post.slug,
      position,
      click_target,
    });
  };

  return (
    <section
      ref={rowRef}
      aria-label={title}
      className="mt-12 lg:mt-16 pt-10 lg:pt-12 border-t border-border"
    >
      <div className="flex items-end justify-between gap-4 mb-5">
        <div>
          <p className="text-eyebrow text-muted-foreground mb-1">Discover more</p>
          <h2 className="text-card-heading text-foreground">{title}</h2>
        </div>
        <Link
          to="/library"
          className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2 transition-all"
        >
          Browse all <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <ul
        className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x snap-mandatory"
        role="list"
      >
        {items.map(({ cat, post }, position) => (
          <FeaturedCard
            key={post.id}
            cat={cat}
            post={post}
            position={position}
            fromCategoryId={activeCategoryId}
            onClick={handleClick}
          />
        ))}
      </ul>
    </section>
  );
}

interface FeaturedCardProps {
  cat: WPCategory;
  post: WPPost;
  position: number;
  fromCategoryId: number;
  onClick: (
    cat: WPCategory,
    post: WPPost,
    position: number,
    click_target: "image" | "title" | "category_badge" | "read_link",
  ) => void;
}

/**
 * Per-card wrapper so each card can own its own impression observer.
 * Splitting this out keeps the parent JSX readable AND lets each card fire
 * `featured_other_cats_card_viewed` independently as the user scrolls the
 * horizontal rail.
 */
function FeaturedCard({ cat, post, position, fromCategoryId, onClick }: FeaturedCardProps) {
  // Guard against double-fires from React 18 strict-mode re-mounts.
  const firedRef = useRef(false);
  const liRef = useImpression<HTMLLIElement>(() => {
    if (firedRef.current) return;
    firedRef.current = true;
    trackEvent("featured_other_cats_card_viewed", {
      from_category_id: fromCategoryId,
      category_id: cat.id,
      category_slug: cat.slug,
      post_id: post.id,
      post_slug: post.slug,
      position,
    });
  });
  const img = getFeaturedImage(post);
  return (
    <li ref={liRef} className="snap-start shrink-0 w-[260px] sm:w-[280px]">
      <article className="group h-full flex flex-col bg-card rounded-lg overflow-hidden border border-border shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-shadow">
        <Link
          to={`/${post.slug}`}
          onClick={() => onClick(cat, post, position, "image")}
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
            onClick={() => onClick(cat, post, position, "category_badge")}
            className="text-xs font-medium text-primary hover:underline underline-offset-4 mb-2 inline-block"
          >
            {cat.name}
          </Link>
          <Link
            to={`/${post.slug}`}
            onClick={() => onClick(cat, post, position, "title")}
            className="text-sm font-semibold text-foreground line-clamp-2 mb-3 hover:text-primary transition-colors"
            dangerouslySetInnerHTML={{ __html: post.title.rendered }}
          />
          <Link
            to={`/${post.slug}`}
            onClick={() => onClick(cat, post, position, "read_link")}
            className="mt-auto inline-flex items-center gap-1 text-xs font-semibold text-primary hover:gap-2 transition-all min-h-[36px]"
          >
            Read <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </article>
    </li>
  );
}
// Suppress unused-import warning for useEffect (kept available for future scroll telemetry).
void useEffect;
