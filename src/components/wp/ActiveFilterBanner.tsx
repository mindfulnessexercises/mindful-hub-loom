import { ChevronRight, X, Filter } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";

/**
 * Active-filter banner shown across the top of the Library results when any
 * filter (category and/or search) is applied. Doubles as a **breadcrumb**:
 *
 *   Library  ›  Category: <name>  ·  Search: "<q>"
 *
 * Provides the two one-click escape hatches users keep asking for:
 *   - "× Clear category" — removes only the category filter, keeping search
 *   - "Clear all filters" — wipes everything (category, search, page)
 *
 * Visible on every viewport (the existing chips inside the desktop tab row
 * stay as a redundant secondary affordance, but this banner is the primary
 * "you are filtered" signal — especially important on mobile where the chip
 * row sits behind the bottom-sheet trigger).
 */

export interface ActiveFilterBannerProps {
  categoryName?: string;
  search?: string;
  onClearCategory: () => void;
  onClearAll: () => void;
}

export function ActiveFilterBanner({
  categoryName,
  search,
  onClearCategory,
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

  const handleClearAll = () => {
    trackEvent("library_filter_cleared", {
      target: "all",
      had_search: Boolean(search),
      had_category: Boolean(categoryName),
      category_name: categoryName,
    });
    onClearAll();
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className="mb-6 rounded-lg border border-primary/30 bg-primary/5 p-3 sm:p-4"
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        {/* Breadcrumb trail */}
        <nav aria-label="Filter breadcrumb" className="flex items-center gap-1.5 min-w-0">
          <Filter className="h-3.5 w-3.5 text-primary shrink-0" aria-hidden />
          <Link
            to="/library"
            onClick={handleClearAll}
            className="text-sm font-medium text-primary hover:underline underline-offset-4"
          >
            Library
          </Link>
          {categoryName && (
            <>
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" aria-hidden />
              <span className="text-sm font-semibold text-foreground truncate">
                {categoryName}
              </span>
            </>
          )}
          {search && (
            <>
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" aria-hidden />
              <span className="text-sm text-foreground truncate">
                Search: <span className="font-semibold">&ldquo;{search}&rdquo;</span>
              </span>
            </>
          )}
        </nav>

        {/* Spacer pushes actions to the right on wide layouts. */}
        <div className="flex-1" />

        {/* One-click escape hatches */}
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
