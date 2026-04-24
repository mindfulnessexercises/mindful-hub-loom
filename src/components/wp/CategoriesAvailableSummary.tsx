import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Info, Tag } from "lucide-react";
import type { WPCategory } from "@/lib/wp";

/**
 * Renders a collapsible "categories available" overview for the Library:
 *
 *   - Headline counts: total categories + total posts across them
 *   - Alphabetized list of every category with its post count
 *   - Active category is visually highlighted; clicking any chip applies it
 *     as a Library filter via the standard `?cat=…` URL param
 *
 * Goal: give visitors a transparent inventory of what topics exist on the
 * site without forcing them to scroll through the horizontally-scrolling
 * filter strip. Collapsed by default to keep the page above-the-fold tight.
 */
export interface CategoriesAvailableSummaryProps {
  /** Already filtered to count > 0 and not "uncategorized". */
  categories: WPCategory[];
  /** Currently active category id (from ?cat=…), if any. */
  activeCategoryId?: number;
  /** Optional: total page count to show alongside posts ("X categories · Y posts · Z pages"). */
  totalPages?: number;
}

export function CategoriesAvailableSummary({
  categories,
  activeCategoryId,
  totalPages,
}: CategoriesAvailableSummaryProps) {
  const [open, setOpen] = useState(false);

  // Sort alphabetically — predictable for scanning. The horizontal strip
  // above already surfaces popularity ordering.
  const sorted = useMemo(
    () => [...categories].sort((a, b) => a.name.localeCompare(b.name)),
    [categories],
  );

  const totalPosts = useMemo(
    () => categories.reduce((sum, c) => sum + (c.count || 0), 0),
    [categories],
  );

  if (categories.length === 0) return null;

  return (
    <section
      aria-label="Categories available on the site"
      className="mb-8 rounded-xl border border-border bg-card overflow-hidden"
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="categories-available-list"
        className="w-full flex items-center justify-between gap-4 p-4 lg:p-5 text-left hover:bg-[hsl(var(--section-alternate))] transition-colors min-h-[44px]"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="shrink-0 h-9 w-9 rounded-md bg-accent text-accent-foreground inline-flex items-center justify-center">
            <Tag className="h-4 w-4" aria-hidden />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground">
              {categories.length} categories available
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {totalPosts.toLocaleString()} {totalPosts === 1 ? "post" : "posts"} indexed
              {totalPages !== undefined && (
                <>
                  {" · "}
                  {totalPages.toLocaleString()} {totalPages === 1 ? "page" : "pages"}
                </>
              )}
            </p>
          </div>
        </div>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>

      {open && (
        <div id="categories-available-list" className="px-4 lg:px-5 pb-5 pt-1">
          {/* Plain-language explanation of what clicking a chip actually does
              to the Library — keeps users from being surprised when their
              total / pagination drops after applying a category filter. */}
          <div
            role="note"
            className="mb-4 flex items-start gap-2.5 rounded-md border border-border bg-[hsl(var(--section-alternate))] p-3 text-xs text-muted-foreground"
          >
            <Info className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" aria-hidden />
            <p className="leading-relaxed">
              Selecting a category filters the Library to only that topic. The
              total result count and number of pages will update to reflect
              just those posts (e.g. picking a 40-post category shows 40
              results across however many pages that fills, not the full
              library total). Clear the filter — or pick{" "}
              <Link to="/library" className="font-semibold text-primary hover:underline underline-offset-4">
                All categories
              </Link>{" "}
              — to see everything again.
            </p>
          </div>
          <ul className="flex flex-wrap gap-2">
            {sorted.map((c) => {
              const isActive = c.id === activeCategoryId;
              return (
                <li key={c.id}>
                  <Link
                    to={`/library?cat=${c.id}`}
                    aria-current={isActive ? "true" : undefined}
                    className={`inline-flex items-center gap-1.5 px-3 py-2 min-h-[36px] rounded-full text-xs font-medium border transition-colors ${
                      isActive
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card text-foreground border-border hover:border-primary/40 hover:text-primary"
                    }`}
                  >
                    {c.name}
                    <span className={isActive ? "opacity-80" : "opacity-60"}>
                      ({c.count.toLocaleString()})
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </section>
  );
}
