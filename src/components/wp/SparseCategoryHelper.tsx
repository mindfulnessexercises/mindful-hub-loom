import { Link } from "react-router-dom";
import { ArrowRight, Compass, Search as SearchIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { WPCategory } from "@/lib/wp";

/**
 * Renders a helpful panel when a chosen category yields zero or only a handful
 * of results. The goal is to keep the user moving instead of bouncing:
 *   1. Acknowledge the sparse result (with the active category name)
 *   2. Suggest 4–6 related categories (token overlap + popularity fallback)
 *   3. Offer 1–2 next actions (browse all, search, clear filter)
 *
 * Variants:
 *   - "empty"  → no results at all in the active category
 *   - "sparse" → some results, but below FEW_THRESHOLD
 */

const FEW_THRESHOLD = 3;

export interface SparseCategoryHelperProps {
  /** Category currently selected via ?cat=… */
  activeCategory: WPCategory;
  /** All visible categories (already filtered to count>0 and not "uncategorized") */
  allCategories: WPCategory[];
  /** Number of posts returned for the active category */
  resultCount: number;
  /** Active search query, if any — drives the contextual copy */
  search?: string;
  /** Clear only the category filter (keep search if any) */
  onClearCategory: () => void;
  /** Clear all active filters (search + category) */
  onClearAll: () => void;
  /** Switch to a different category */
  onSelectCategory: (id: number) => void;
}

/** Lowercase, drop common stopwords, return distinct word tokens. */
function tokenize(s: string): string[] {
  const stop = new Set(["and", "the", "for", "with", "of", "in", "on", "to", "a", "an", "your", "you"]);
  return Array.from(
    new Set(
      s
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, " ")
        .split(/[\s-]+/)
        .filter((t) => t.length > 2 && !stop.has(t)),
    ),
  );
}

/**
 * Score categories by token overlap with the active category name. Ties broken
 * by post count (popularity). Excludes the active one and any with 0 posts.
 */
function pickRelated(active: WPCategory, all: WPCategory[], limit = 6): WPCategory[] {
  const activeTokens = new Set(tokenize(active.name));
  const scored = all
    .filter((c) => c.id !== active.id && c.count > 0)
    .map((c) => {
      const overlap = tokenize(c.name).filter((t) => activeTokens.has(t)).length;
      return { c, overlap };
    })
    .sort((a, b) => {
      if (b.overlap !== a.overlap) return b.overlap - a.overlap;
      return b.c.count - a.c.count;
    });
  // If nothing overlaps, fall back to the most popular categories.
  return scored.slice(0, limit).map((s) => s.c);
}

export function SparseCategoryHelper({
  activeCategory,
  allCategories,
  resultCount,
  search,
  onClearCategory,
  onClearAll,
  onSelectCategory,
}: SparseCategoryHelperProps) {
  const variant: "empty" | "sparse" = resultCount === 0 ? "empty" : "sparse";
  // Only render the sparse helper when results are unhelpfully few — once
  // there are enough results the user can browse normally without a nudge.
  if (variant === "sparse" && resultCount >= FEW_THRESHOLD) return null;

  const related = pickRelated(activeCategory, allCategories);

  const heading =
    variant === "empty"
      ? search
        ? `No matches for "${search}" in ${activeCategory.name}`
        : `Nothing here yet in ${activeCategory.name}`
      : `Only ${resultCount} ${resultCount === 1 ? "result" : "results"} in ${activeCategory.name}`;

  const subheading =
    variant === "empty"
      ? "Try a related topic below, broaden your search, or browse the full library."
      : "You might also like these related topics:";

  return (
    <section
      aria-label={variant === "empty" ? "No results — suggestions" : "Sparse results — related topics"}
      className="mb-8 rounded-xl border border-border bg-[hsl(var(--section-alternate))] p-6 lg:p-8"
    >
      <div className="flex items-start gap-4">
        <div className="shrink-0 h-10 w-10 rounded-md bg-accent text-accent-foreground inline-flex items-center justify-center">
          <Compass className="h-5 w-5" aria-hidden />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-card-heading text-foreground">{heading}</h2>
          <p className="mt-1 text-body-sm text-muted-foreground">{subheading}</p>

          {related.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-2">
              {related.map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => onSelectCategory(c.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[36px] rounded-full bg-card text-foreground border border-border hover:border-primary/40 hover:text-primary transition-colors text-xs font-medium"
                  >
                    {c.name}
                    <span className="opacity-60">({c.count})</span>
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClearCategory}
              className="min-h-[40px]"
            >
              <X className="h-3.5 w-3.5" /> Clear category
            </Button>
            {search && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onClearAll}
                className="min-h-[40px]"
              >
                <X className="h-3.5 w-3.5" /> Clear all filters
              </Button>
            )}
            <Link
              to="/library"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2 transition-all min-h-[40px]"
            >
              Browse the full library <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            {!search && (
              <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <SearchIcon className="h-3.5 w-3.5" /> Tip: try the search above
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
