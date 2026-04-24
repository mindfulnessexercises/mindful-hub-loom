// Helpers for building canonical + prev/next URLs on filtered/paginated views.
//
// Conventions:
//  - "Page 1" never includes ?page=1 in the canonical (avoid duplicate URLs).
//  - rel="prev" omits ?page=2 → ?page (i.e. page 1 has no `page` param).
//  - Filter params (q, cat, type, tab) are preserved in canonical AND in
//    prev/next so a paginated filtered series stays self-consistent.

export const SITE_ORIGIN = "https://mindfulnessexercises.com";

export interface BuildPaginatedSeoOpts {
  /** Path without query, e.g. "/blog", "/category/stress" */
  path: string;
  /** 1-based page number currently being viewed. */
  page: number;
  /** Total pages available (from WP's X-WP-TotalPages header). */
  totalPages: number;
  /** Filter params to preserve across canonical/prev/next. Empty values omitted. */
  filters?: Record<string, string | number | undefined>;
}

function buildUrl(path: string, params: Record<string, string | number | undefined>): string {
  const usp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === "" || v === null) continue;
    usp.append(k, String(v));
  }
  const qs = usp.toString();
  return `${SITE_ORIGIN}${path}${qs ? `?${qs}` : ""}`;
}

/**
 * Build canonical, prevUrl, and nextUrl for a paginated list view.
 *
 * Returns canonical that ALWAYS reflects the current view (including its
 * filters and page) so each page in the series self-references — this is
 * Google's recommended approach now that rel=prev/next is no longer a strong
 * signal but canonicals are.
 */
export function buildPaginatedSeo({ path, page, totalPages, filters = {} }: BuildPaginatedSeoOpts) {
  const baseFilters = filters;
  const canonical = buildUrl(path, {
    ...baseFilters,
    page: page > 1 ? page : undefined,
  });
  const prevUrl =
    page > 1
      ? buildUrl(path, { ...baseFilters, page: page - 1 > 1 ? page - 1 : undefined })
      : undefined;
  const nextUrl =
    page < totalPages
      ? buildUrl(path, { ...baseFilters, page: page + 1 })
      : undefined;
  return { canonical, prevUrl, nextUrl };
}
