import { ArrowDownWideNarrow, Info, Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectGroup,
  SelectSeparator,
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
  { value: "relevance", label: "Most relevant", hint: "Search-only" },
  // NOTE: "popular" intentionally omitted from the UI. The upstream WordPress
  // REST endpoint does not expose `comment_count` (or any popularity field) as
  // a valid `orderby`, so the request 400s. Kept in the type union so that
  // legacy `?sort=popular` URLs still parse — they fall back to "newest" via
  // sortToWpParams below.
  { value: "title", label: "Title (A–Z)" },
];

/**
 * Translate a {@link LibrarySort} into the WordPress REST `orderby` + `order`
 * params. Centralised so the URL key stays decoupled from WP's vocabulary.
 */
export function sortToWpParams(
  sort: LibrarySort,
  hasSearch: boolean,
): { orderby: "date" | "title" | "relevance"; order: "asc" | "desc" } {
  switch (sort) {
    case "oldest":
      return { orderby: "date", order: "asc" };
    case "title":
      return { orderby: "title", order: "asc" };
    case "popular":
      // Upstream WP REST rejects comment_count orderby on this site — fall
      // back to newest so legacy shared links still render results.
      return { orderby: "date", order: "desc" };
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
      <label
        htmlFor="library-sort"
        className="hidden sm:inline-flex items-center gap-1.5 text-caption text-muted-foreground font-medium"
      >
        <ArrowDownWideNarrow className="h-4 w-4" aria-hidden />
        Sort by
      </label>
      <Select value={value} onValueChange={(v) => onChange(v as LibrarySort)}>
        <SelectTrigger
          id="library-sort"
          className="h-10 min-h-[40px] w-[200px] bg-card text-sm font-medium"
          aria-label="Sort results"
        >
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent className="w-[260px]">
          <SelectGroup>
            <SelectLabel className="text-xs uppercase tracking-wide text-muted-foreground">
              Order results by
            </SelectLabel>
            {LIBRARY_SORT_OPTIONS.filter((o) => includePopular || o.value !== "popular").map((opt) => {
              const disabled = opt.value === "relevance" && !hasSearch;
              return (
                <SelectItem key={opt.value} value={opt.value} disabled={disabled}>
                  <span className="flex w-full items-center justify-between gap-3">
                    <span>{opt.label}</span>
                    {opt.value === "relevance" && (
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-medium uppercase tracking-wide px-1.5 py-0.5 rounded ${
                          disabled
                            ? "bg-muted text-muted-foreground"
                            : "bg-primary/10 text-primary"
                        }`}
                      >
                        <Search className="h-3 w-3" aria-hidden />
                        Search-only
                      </span>
                    )}
                  </span>
                </SelectItem>
              );
            })}
          </SelectGroup>
          {!hasSearch && (
            <>
              <SelectSeparator />
              <p className="px-2 py-2 text-xs text-muted-foreground flex items-start gap-1.5">
                <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" aria-hidden />
                <span>
                  <strong className="font-semibold text-foreground">Most relevant</strong> becomes
                  available after you enter a search query.
                </span>
              </p>
            </>
          )}
        </SelectContent>
      </Select>
    </div>
  );
}

