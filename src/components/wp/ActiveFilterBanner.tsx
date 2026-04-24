import { ChevronRight, X, Filter } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";

/**
 * Active-filter banner shown across the top of the Library results when any
 * filter (category and/or search) is applied. Doubles as a **breadcrumb**:
 *
 *   Library  ›  Category: <name> ×  ›  Search: "<q>" ×
 *
 * Interaction model:
 *   - Clicking "Library" wipes EVERY filter (category, search, page) — same
 *     as the standalone "Clear all filters" button. This matches the user's
 *     mental model that the root crumb is the unfiltered library.
 *   - Clicking the category segment removes ONLY the category filter, leaving
 *     any active search term intact.
 *   - Clicking the search segment removes ONLY the search query, leaving the
 *     category filter intact.
 *   - The bigger explicit buttons on the right remain as redundant, more
 *     discoverable affordances — especially important on mobile where the
 *     compact crumb hit-targets can feel fiddly.
 */

export interface ActiveFilterBannerProps {
  categoryName?: string;
  search?: string;
  onClearCategory: () => void;
  onClearSearch: () => void;
  onClearAll: () => void;
}

export function ActiveFilterBanner({
  categoryName,
  search,
  onClearCategory,
  onClearSearch,
  onClearAll,
}: ActiveFilterBannerProps) {
  // Render nothing when no filter is active so the banner never adds visual
  // noise to the unfiltered library view.
  if (!categoryName && !search) return null;

  const handleClearCategory = () => {
    trackEvent("library_filter_cleared", {
      target: "category",
      had_search: Boolean(search),
      category_name: categoryName,
    });
    onClearCategory();
  };

  const handleClearSearch = () => {
    trackEvent("library_filter_cleared", {
      target: "search",
      had_category: Boolean(categoryName),
      query: search,
    });
    onClearSearch();
  };

  const handleClearAll = () => {
    trackEvent("library_filter_cleared", {
      target: "all",
      had_search: Boolean(search),
      had_category: Boolean(categoryName),
      category_name: categoryName,
    });
    onClearAll();
  };

  // Shared chip styling for the interactive crumb segments. Mobile-friendly
  // 36px+ tap target via py-1 + min-h-[36px] without making the bar feel chunky.
  const chipClass =
    "group inline-flex items-center gap-1 rounded-md border border-border bg-card px-2 py-1 min-h-[36px] text-sm text-foreground hover:border-primary/40 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 transition-colors";

  return (
    <div
      role="status"
      aria-live="polite"
      className="mb-6 rounded-lg border border-primary/30 bg-primary/5 p-3 sm:p-4"
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        {/* Breadcrumb trail — each segment after Library acts as a one-click
            "remove just this filter" control. Library itself wipes everything. */}
        <nav aria-label="Filter breadcrumb" className="flex flex-wrap items-center gap-1.5 min-w-0">
          <Filter className="h-3.5 w-3.5 text-primary shrink-0" aria-hidden />
          <Link
            to="/library"
            onClick={handleClearAll}
            className="text-sm font-medium text-primary hover:underline underline-offset-4 min-h-[36px] inline-flex items-center"
          >
            Library
          </Link>

          {categoryName && (
            <>
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" aria-hidden />
              <button
                type="button"
                onClick={handleClearCategory}
                className={chipClass}
                aria-label={`Clear category filter: ${categoryName}`}
                title="Clear category filter"
              >
                <span className="font-semibold truncate max-w-[12rem]">{categoryName}</span>
                <X
                  className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary shrink-0"
                  aria-hidden
                />
              </button>
            </>
          )}

          {search && (
            <>
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" aria-hidden />
              <button
                type="button"
                onClick={handleClearSearch}
                className={chipClass}
                aria-label={`Clear search: ${search}`}
                title="Clear search"
              >
                <span className="truncate max-w-[14rem]">
                  Search: <span className="font-semibold">&ldquo;{search}&rdquo;</span>
                </span>
                <X
                  className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary shrink-0"
                  aria-hidden
                />
              </button>
            </>
          )}
        </nav>

        {/* Spacer pushes actions to the right on wide layouts. */}
        <div className="flex-1" />

        {/* Redundant, more discoverable escape hatches. Kept because mobile
            users often miss that the breadcrumb chips themselves are clickable. */}
        <div className="flex flex-wrap items-center gap-2">
          {categoryName && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleClearCategory}
              className="h-9 min-h-[36px] gap-1.5 bg-card"
            >
              <X className="h-3.5 w-3.5" aria-hidden /> Clear category
            </Button>
          )}
          {(categoryName || search) && (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={handleClearAll}
              className="h-9 min-h-[36px] gap-1.5 text-primary hover:text-primary"
            >
              <X className="h-3.5 w-3.5" aria-hidden /> Clear all filters
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
