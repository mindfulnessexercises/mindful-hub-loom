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
] as const;

export const RESERVED_SLUG_SET: ReadonlySet<string> = new Set(RESERVED_SLUGS);

export function isReservedSlug(slug: string): boolean {
  return RESERVED_SLUG_SET.has(slug);
}
