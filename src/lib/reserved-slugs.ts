// Centralized list of slugs reserved for app-owned routes. The WP resolver
// must NEVER attempt to fetch a WP post/page for these — they belong to a
// dedicated route component (e.g. /blog, /search, /category/:slug, /ce-policies).
//
// Adding a new top-level route? Add its base segment here too.
export const RESERVED_SLUGS = [
  "",            // root "/"
  "blog",        // /blog index
  "ce-policies", // CE policies page
  "search",      // /search results page
  "category",    // /category/:slug landing pages
  "library",     // /library browse-all index
  "audio-library", // /audio-library — themed audio browser across all playlists
  "admin",       // /admin/* internal pages (analytics dashboard etc.)
  // Legacy WP "section landing" slugs whose pages are hand-built archives
  // pointing to outdated content + external links. We redirect /podcast and
  // /downloads to /category/<slug> so the WP resolver never serves them.
  "podcast",
  "downloads",
] as const;

export const RESERVED_SLUG_SET: ReadonlySet<string> = new Set(RESERVED_SLUGS);

export function isReservedSlug(slug: string): boolean {
  return RESERVED_SLUG_SET.has(slug);
}
