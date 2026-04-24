import { ArrowDownWideNarrow } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/**
 * Canonical sort keys used in the Library URL (?sort=...). Kept stable so that
 * shared links continue to resolve to the same ordering even if the WordPress
 * REST mapping changes. "relevance" requires an active search query — when no
 * `q` is present we silently fall back to "newest" inside the page logic.
 */
export type LibrarySort = "newest" | "oldest" | "relevance" | "popular" | "title";

export const LIBRARY_SORT_OPTIONS: { value: LibrarySort; label: string; hint?: string }[] = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "relevance", label: "Most relevant", hint: "When searching" },
  { value: "popular", label: "Most popular" },
  { value: "title", label: "Title (A–Z)" },
];

/**
 * Translate a {@link LibrarySort} into the WordPress REST `orderby` + `order`
 * params. Centralised so the URL key stays decoupled from WP's vocabulary.
 *
 * Notes:
 * - `relevance` only works on the WP REST API when `search` is non-empty;
 *   callers must check `hasSearch` before using it (we fall back to date desc).
 * - `popular` uses `comment_count` — a server-side proxy for engagement that
 *   doesn't require an analytics plugin. Swap to a hit-counter field later if
 *   the WP install gains one.
 */
export function sortToWpParams(
  sort: LibrarySort,
  hasSearch: boolean,
): { orderby: "date" | "title" | "relevance" | "comment_count"; order: "asc" | "desc" } {
  switch (sort) {
    case "oldest":
      return { orderby: "date", order: "asc" };
    case "title":
      return { orderby: "title", order: "asc" };
    case "popular":
      return { orderby: "comment_count", order: "desc" };
    case "relevance":
      return hasSearch
        ? { orderby: "relevance", order: "desc" }
        : { orderby: "date", order: "desc" };
    case "newest":
    default:
      return { orderby: "date", order: "desc" };
  }
}

export interface LibrarySortSelectProps {
  value: LibrarySort;
  onChange: (next: LibrarySort) => void;
  /** Whether a search query is active — disables the relevance option label otherwise. */
  hasSearch: boolean;
  /** Whether to also include the "popular" option (omit on Pages tab where comment counts are meaningless). */
  includePopular?: boolean;
  className?: string;
}

export function LibrarySortSelect({
  value,
  onChange,
  hasSearch,
  includePopular = true,
  className,
}: LibrarySortSelectProps) {
  return (
    <div className={`flex items-center gap-2 ${className ?? ""}`}>
      <ArrowDownWideNarrow className="h-4 w-4 text-muted-foreground shrink-0" aria-hidden />
      <label htmlFor="library-sort" className="text-caption text-muted-foreground sr-only sm:not-sr-only">
        Sort
      </label>
      <Select value={value} onValueChange={(v) => onChange(v as LibrarySort)}>
        <SelectTrigger id="library-sort" className="h-10 min-h-[40px] w-[180px] bg-card text-sm" aria-label="Sort results">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {LIBRARY_SORT_OPTIONS.filter((o) => includePopular || o.value !== "popular").map((opt) => {
            const disabled = opt.value === "relevance" && !hasSearch;
            return (
              <SelectItem key={opt.value} value={opt.value} disabled={disabled}>
                <span className="flex items-center gap-2">
                  {opt.label}
                  {disabled && (
                    <span className="text-xs text-muted-foreground">(needs search)</span>
                  )}
                </span>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}
