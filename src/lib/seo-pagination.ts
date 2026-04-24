// Helpers for building canonical + prev/next URLs on filtered/paginated views.
//
// Conventions / contract (verify against this when changing):
//  - "Page 1" never includes ?page=1 in the canonical (avoid duplicate URLs).
//  - rel="prev" omits ?page=2 → ?page (i.e. page 1 has no `page` param).
//  - All filter params present in the URL (q, cat, tab, sort, type, …) are
//    preserved in canonical AND in prev/next so a paginated filtered series
//    stays self-consistent. Missing/empty/default values are dropped so two
//    equivalent views serialise to the same canonical.
//  - Param ORDER is deterministic (alphabetical, with `page` always last).
//    Two equivalent views must produce byte-identical canonical URLs; this is
//    what lets shared deep links and crawler-discovered URLs collapse to the
//    same canonical signal.
//  - `page` is clamped to [1, totalPages] before serialisation so a stale
//    or malicious ?page=99 doesn't generate an off-the-end canonical.

export const SITE_ORIGIN = "https://mindfulnessexercises.com";

export interface BuildPaginatedSeoOpts {
  /** Path without query, e.g. "/library", "/category/stress" */
  path: string;
  /** 1-based page number currently being viewed. Will be clamped. */
  page: number;
  /** Total pages available (from WP's X-WP-TotalPages header). */
  totalPages: number;
  /** Filter params to preserve across canonical/prev/next. Empty/undefined values omitted. */
  filters?: Record<string, string | number | undefined>;
}

/**
 * Build a stable, sorted query string. Params are alphabetised so that two
 * equivalent views collapse to the same URL. `page` is intentionally NOT
 * sorted alphabetically — it always lives at the end so URLs read as
 * `?cat=42&q=foo&sort=newest&page=2` (humans expect page last).
 */
function serialiseParams(params: Record<string, string | number | undefined>, page?: number): string {
  const entries = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== "" && v !== null)
    .map(([k, v]) => [k, String(v)] as const)
    .sort(([a], [b]) => a.localeCompare(b));

  const usp = new URLSearchParams();
  for (const [k, v] of entries) usp.append(k, v);
  if (page !== undefined && page > 1) usp.append("page", String(page));
  return usp.toString();
}

function buildUrl(path: string, params: Record<string, string | number | undefined>, page?: number): string {
  const qs = serialiseParams(params, page);
  return `${SITE_ORIGIN}${path}${qs ? `?${qs}` : ""}`;
}

/**
 * Build canonical, prevUrl, and nextUrl for a paginated list view.
 *
 * Returns canonical that ALWAYS reflects the current view (including its
 * filters and page) so each page in the series self-references — Google's
 * recommended approach now that rel=prev/next is no longer a strong signal
 * but canonicals are.
 */
export function buildPaginatedSeo({ path, page, totalPages, filters = {} }: BuildPaginatedSeoOpts) {
  // Clamp the page number so out-of-range values can't produce phantom
  // canonicals that 200 OK but show no results.
  const safeTotal = Math.max(1, Math.floor(totalPages || 1));
  const safePage = Math.min(Math.max(1, Math.floor(page || 1)), safeTotal);

  const canonical = buildUrl(path, filters, safePage);
  const prevUrl =
    safePage > 1 ? buildUrl(path, filters, safePage - 1) : undefined;
  const nextUrl =
    safePage < safeTotal ? buildUrl(path, filters, safePage + 1) : undefined;

  return { canonical, prevUrl, nextUrl };
}
