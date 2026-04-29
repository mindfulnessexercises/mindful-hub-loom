// Single source of truth for the production origin used in SEO surfaces
// (canonicals, JSON-LD, og:url, sitemap URLs). Centralizing this means a
// future move to a different origin is a one-file change.
//
// Why a constant rather than reading window.location.origin: when the page
// is server-rendered (sitemap edge function, social-bot scrapes that bypass
// JS) we still need a deterministic absolute URL — and Google's canonical
// signal MUST be absolute and stable across deployments.
//
// Preview vs prod: the SITE_ORIGIN is intentionally hardcoded to the prod
// domain so that every preview/staging build self-references the prod URL.
// This prevents preview builds from accidentally telling Google to index
// `id-preview--*.lovable.app` URLs.
export const SITE_ORIGIN = "https://mindfulnessexercises.com";

/** Build an absolute URL for SEO surfaces from a path. Path may be already
 *  absolute (returned as-is) or root-relative (prefixed with SITE_ORIGIN). */
export function absoluteUrl(pathOrUrl: string): string {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const path = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  return `${SITE_ORIGIN}${path}`;
}
