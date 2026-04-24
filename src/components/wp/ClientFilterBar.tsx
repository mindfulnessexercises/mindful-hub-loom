import { useEffect, useMemo, useState } from "react";
import { Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { stripHtml, type WPPost } from "@/lib/wp";

/**
 * Lightweight client-side filter for already-loaded posts.
 *
 * Distinct from the server search bar at the top of each page: that one
 * triggers a fresh WordPress query and resets pagination. THIS one only
 * narrows the rows already visible — instant, offline, no refetch — so users
 * can scan a long "Load more" stack quickly.
 *
 * Matches against title + excerpt (HTML stripped). Returns the filtered list
 * plus the input element to render and the current query string.
 */
export function useClientPostFilter(posts: WPPost[]) {
  const [query, setQuery] = useState("");

  // Reset the local filter whenever the underlying server result set changes
  // identity (e.g. user changed category / server search). Otherwise stale
  // filter text could hide everything in the new list.
  useEffect(() => {
    setQuery("");
  }, [posts]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return posts;
    return posts.filter((p) => {
      const title = stripHtml(p.title.rendered).toLowerCase();
      if (title.includes(q)) return true;
      const excerpt = stripHtml(p.excerpt?.rendered ?? "").toLowerCase();
      return excerpt.includes(q);
    });
  }, [posts, query]);

  return { query, setQuery, filtered };
}

export interface ClientFilterBarProps {
  query: string;
  onChange: (value: string) => void;
  loadedCount: number;
  filteredCount: number;
  /** Plural noun used in helper text (e.g. "articles"). */
  noun?: string;
  className?: string;
  placeholder?: string;
}

/**
 * The visible filter input + helper text. Pure presentation; pair with
 * `useClientPostFilter` (or any state owner) to drive `query`/`onChange`.
 */
export function ClientFilterBar({
  query,
  onChange,
  loadedCount,
  filteredCount,
  noun = "results",
  className = "",
  placeholder,
}: ClientFilterBarProps) {
  const isFiltering = query.trim().length > 0;
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center gap-3 ${className}`}>
      <div className="relative flex-1 max-w-md">
        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" aria-hidden />
        <Input
          type="search"
          value={query}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder ?? `Filter the ${loadedCount.toLocaleString()} loaded ${noun}…`}
          aria-label={`Filter loaded ${noun}`}
          className="pl-9 pr-9 h-10 bg-card text-sm"
        />
        {isFiltering && (
          <button
            type="button"
            onClick={() => onChange("")}
            aria-label="Clear filter"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
      {isFiltering && (
        <p className="text-caption text-muted-foreground" aria-live="polite">
          {filteredCount.toLocaleString()} of {loadedCount.toLocaleString()} loaded {noun} match
        </p>
      )}
    </div>
  );
}
