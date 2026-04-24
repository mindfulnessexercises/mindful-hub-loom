// Centralized React Query cache keys + staleTime presets for WordPress data.
//
// Why centralize?
//  - Guarantees identical filter combos produce identical keys (cache hits).
//  - Prevents "missed dimension" bugs (e.g. forgetting per_page or page in
//    the key, which causes silent refetches when those values change).
//  - One place to bump staleTime when WP rate-limits.
//
// React Query rule for Infinite Queries:
//   Each PAGE inside an infinite query is keyed by (queryKey + pageParam),
//   so we must NOT include `page` in queryKey for infinite queries — only
//   filter dimensions. For non-infinite single-page fetches, include `page`.

export const WP_STALE = {
  // Lists that should feel "live-ish" but cache aggressively for navigation.
  list: 30 * 60 * 1000,        // 30 min
  // Single posts/pages — content rarely changes within a session.
  detail: 60 * 60 * 1000,      // 1 hr
  // Categories barely ever change.
  taxonomy: 6 * 60 * 60 * 1000, // 6 hr
  // gcTime: keep cached entries around long after they go stale so back-nav
  // restores instantly without any refetch.
  gc: 24 * 60 * 60 * 1000,     // 24 hr
} as const;

// ---- Posts ----
export const wpKeys = {
  // Infinite list of posts — key on every filter dimension EXCEPT page.
  // Each loaded page lives at (key, pageParam) inside the infinite cache.
  postsList: (filters: {
    search?: string;
    category?: number;
    perPage: number;
    scope?: string; // optional namespace, e.g. "blog" | "search"
    endpoint?: string; // optional CPT endpoint override (e.g. /wp/v2/podcast-episodes)
  }) =>
    [
      "wp", "posts", "list",
      filters.scope ?? "default",
      { q: filters.search ?? "", cat: filters.category ?? 0, pp: filters.perPage, ep: filters.endpoint ?? "" },
    ] as const,

  // Non-infinite single-page fetch (e.g. simple "give me 100 pages").
  pagesList: (filters: { search?: string; perPage: number; page?: number }) =>
    [
      "wp", "pages", "list",
      { q: filters.search ?? "", pp: filters.perPage, page: filters.page ?? 1 },
    ] as const,

  // Resolver: try post, then page, by slug.
  resolveSlug: (slug: string) => ["wp", "resolve", slug] as const,

  // Categories index.
  categories: () => ["wp", "categories"] as const,

  // Single category by slug.
  categoryBySlug: (slug: string) => ["wp", "category", slug] as const,

  // Latest-N posts (homepage strip etc.).
  latestPosts: (n: number) => ["wp", "posts", "latest", n] as const,
};
