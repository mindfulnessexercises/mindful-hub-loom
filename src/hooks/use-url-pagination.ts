import { useEffect } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { trackEvent } from "@/lib/analytics";

/**
 * Keeps an infinite-query's loaded page count in sync with a `?page=N` URL
 * parameter so Load More state is shareable and survives back/forward.
 *
 * - Reads `?page=N` (default 1) and auto-fetches additional pages until the
 *   loaded count matches N.
 * - Returns `loadMore` to call from your "Load more" button — it both fetches
 *   the next page AND increments `?page=` in the URL.
 * - When other filters change (q, cat, type, …) the caller should reset
 *   `?page=` via their own `updateParam` helper.
 *
 * Analytics: each `loadMore` call fires a `pagination_load_more` event so we
 * can attribute downstream CTA clicks to how deep the user paged. The
 * `source` arg labels which list issued the call (e.g. "library_posts",
 * "search_posts", "category"); the current pathname + querystring are also
 * included so filter context is preserved alongside the depth signal.
 */
export function useUrlPagination(opts: {
  loadedPages: number;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => unknown;
  /** Identifier for which list this hook is paginating, used in analytics. */
  source?: string;
}) {
  const { loadedPages, hasNextPage, isFetchingNextPage, fetchNextPage, source } = opts;
  const [params, setParams] = useSearchParams();
  const location = useLocation();
  const target = Math.max(1, Number(params.get("page") ?? "1"));

  useEffect(() => {
    if (loadedPages > 0 && loadedPages < target && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [loadedPages, target, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const loadMore = () => {
    fetchNextPage();
    const nextPage = loadedPages + 1;
    const next = new URLSearchParams(params);
    next.set("page", String(nextPage));
    setParams(next);
    trackEvent("pagination_load_more", {
      source: source ?? "unknown",
      from_page: loadedPages,
      to_page: nextPage,
      path: location.pathname,
      query: location.search || undefined,
    });
  };

  return { loadMore, currentPage: target };
}
