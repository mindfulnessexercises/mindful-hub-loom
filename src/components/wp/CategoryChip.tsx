import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Calendar, FileText, Loader2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { wp, formatDate, stripHtml, type WPCategory } from "@/lib/wp";
import { wpKeys, WP_STALE } from "@/lib/wp-cache";

/**
 * A Library category filter chip with a rich tooltip.
 *
 * Tooltip shows:
 *   - Total posts in the category   (already on `cat.count` — no extra fetch)
 *   - Last updated date             (lazy-fetched: most-recent post in this
 *                                    category, only on first hover/focus)
 *
 * Notes on what's NOT shown and why:
 *   - "Total pages in category" is omitted on purpose. WordPress pages are
 *     not categorisable by default — there's no reliable per-category page
 *     count from the REST API. Showing zeros or guessed values would be
 *     misleading; better to omit the row entirely.
 *
 * The fetch is keyed identically to other "first post in category"
 * components (FeaturedFromOtherCategories, SparseCategoryHelper prewarm),
 * so the result is shared across the cache and clicking after hover is
 * effectively instant.
 */

export interface CategoryChipProps {
  cat: WPCategory;
  active: boolean;
  onSelect: (id: number) => void;
}

export function CategoryChip({ cat, active, onSelect }: CategoryChipProps) {
  // Defer the network call until the user actually opens the tooltip — keeps
  // the chip row lightweight even when there are 30+ categories.
  const [hovered, setHovered] = useState(false);

  const recentQuery = useQuery({
    queryKey: [
      ...wpKeys.postsList({ scope: "library-other-cat-feature", category: cat.id, perPage: 1 }),
    ],
    queryFn: () => wp.posts({ categories: cat.id, per_page: 1, orderby: "date", order: "desc" }),
    enabled: hovered,
    staleTime: WP_STALE.list,
    gcTime: WP_STALE.gc,
  });

  const lastPost = recentQuery.data?.items[0];

  return (
    <Tooltip delayDuration={250} onOpenChange={(open) => open && setHovered(true)}>
      <TooltipTrigger asChild>
        <button
          role="tab"
          aria-selected={active}
          onClick={() => onSelect(cat.id)}
          onMouseEnter={() => setHovered(true)}
          onFocus={() => setHovered(true)}
          className={`shrink-0 text-xs font-medium px-3 py-2 min-h-[36px] rounded-full border transition-colors ${
            active
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-card text-muted-foreground border-border hover:text-foreground"
          }`}
        >
          {stripHtml(cat.name)} <span className="opacity-60 ml-1">({cat.count})</span>
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs p-3 space-y-1.5">
        <p className="text-sm font-semibold text-foreground">{stripHtml(cat.name)}</p>
        <div className="space-y-1 text-xs text-muted-foreground">
          <p className="flex items-center gap-1.5">
            <FileText className="h-3 w-3" aria-hidden />
            {cat.count.toLocaleString()} {cat.count === 1 ? "post" : "posts"}
          </p>
          <p className="flex items-center gap-1.5">
            <Calendar className="h-3 w-3" aria-hidden />
            {recentQuery.isLoading ? (
              <span className="inline-flex items-center gap-1">
                <Loader2 className="h-3 w-3 animate-spin" aria-hidden /> Loading…
              </span>
            ) : lastPost ? (
              <>Last updated {formatDate(lastPost.date)}</>
            ) : recentQuery.isError ? (
              <>Last updated date unavailable</>
            ) : (
              <>Hover to load last updated</>
            )}
          </p>
        </div>
        {cat.description && (
          <p className="text-xs text-muted-foreground/80 pt-1 border-t border-border/50 line-clamp-3">
            {cat.description}
          </p>
        )}
      </TooltipContent>
    </Tooltip>
  );
}
