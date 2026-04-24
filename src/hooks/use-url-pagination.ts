import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

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
 */
export function useUrlPagination(opts: {
  loadedPages: number;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => unknown;
}) {
  const { loadedPages, hasNextPage, isFetchingNextPage, fetchNextPage } = opts;
  const [params, setParams] = useSearchParams();
  const target = Math.max(1, Number(params.get("page") ?? "1"));

  useEffect(() => {
    if (loadedPages > 0 && loadedPages < target && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [loadedPages, target, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const loadMore = () => {
    fetchNextPage();
    const next = new URLSearchParams(params);
    next.set("page", String(loadedPages + 1));
    setParams(next);
  };

  return { loadMore, currentPage: target };
}
