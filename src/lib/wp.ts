// WordPress REST client that goes through the Lovable Cloud cache function.
const PROJECT_ID = import.meta.env.VITE_SUPABASE_PROJECT_ID;
const PROXY_URL = `https://${PROJECT_ID}.supabase.co/functions/v1/wp-proxy`;
const ANON = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export interface WPRendered { rendered: string }
export interface WPMedia { source_url: string; alt_text?: string; media_details?: { width?: number; height?: number } }
export interface WPTerm { id: number; name: string; slug: string; taxonomy: string }
export interface WPAuthor { id: number; name: string; slug: string; avatar_urls?: Record<string, string> }

export interface WPPost {
  id: number;
  date: string;
  modified: string;
  slug: string;
  link: string;
  title: WPRendered;
  excerpt: WPRendered;
  content: WPRendered;
  featured_media: number;
  categories: number[];
  tags: number[];
  yoast_head_json?: { description?: string; og_image?: { url: string }[] };
  _embedded?: {
    "wp:featuredmedia"?: WPMedia[];
    "wp:term"?: WPTerm[][];
    author?: WPAuthor[];
  };
}

export interface WPPage extends WPPost {}

export interface WPCategory { id: number; name: string; slug: string; count: number; description?: string }

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  totalPages: number;
}

// Cache controls
//   ttl  — override cache duration in seconds (0 disables, max 86400)
//   bust — true forces a fresh upstream fetch and tells caches not to store
export interface CacheOptions { ttl?: number; bust?: boolean }

async function wpFetch<T>(
  path: string,
  params: Record<string, string | number | undefined> = {},
  cache: CacheOptions = {},
): Promise<PaginatedResult<T>> {
  const search = new URLSearchParams({ path });
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== "") search.append(k, String(v));
  }
  if (cache.ttl !== undefined) search.append("ttl", String(cache.ttl));
  if (cache.bust) search.append("bust", "1");
  const res = await fetch(`${PROXY_URL}?${search.toString()}`, {
    headers: { apikey: ANON, Authorization: `Bearer ${ANON}` },
    // When busting, also bypass the browser's HTTP cache.
    cache: cache.bust ? "no-store" : "default",
  });
  if (!res.ok) throw new Error(`WP fetch failed: ${res.status}`);
  const items = (await res.json()) as T[];
  const total = Number(res.headers.get("x-wp-total") ?? items.length ?? 0);
  const totalPages = Number(res.headers.get("x-wp-totalpages") ?? 1);
  return { items, total, totalPages };
}

type PostsParams = {
  page?: number;
  per_page?: number;
  search?: string;
  categories?: number;
  _embed?: 1;
  orderby?: "date" | "title" | "relevance" | "comment_count" | "modified";
  order?: "asc" | "desc";
  /**
   * Override the REST endpoint. Defaults to "/wp/v2/posts" but can be pointed
   * at a custom post type like "/wp/v2/podcast-episodes" or "/wp/v2/downloads"
   * to surface CPT entries in category listings (the standard /posts endpoint
   * only returns the built-in `post` type, even when the CPT shares the same
   * category taxonomy).
   */
  endpoint?: string;
};
type PagesParams = {
  page?: number;
  per_page?: number;
  search?: string;
  orderby?: "date" | "title" | "relevance" | "modified" | "menu_order";
  order?: "asc" | "desc";
};

export const wp = {
  posts: (params: PostsParams = {}, cache: CacheOptions = {}) => {
    const { endpoint = "/wp/v2/posts", ...rest } = params;
    return wpFetch<WPPost>(endpoint, { _embed: 1, per_page: 12, ...rest }, cache);
  },
  postBySlug: (slug: string, cache: CacheOptions = {}) =>
    wpFetch<WPPost>("/wp/v2/posts", { slug, _embed: 1, per_page: 1 }, cache).then((r) => r.items[0] ?? null),
  /**
   * Look up a single CPT entry by slug from an arbitrary REST endpoint
   * (e.g. /wp/v2/podcast-episodes). Returns null on 404 so callers can fall
   * through to the next lookup. Used by WPResolver to support nested URLs
   * like /podcast-episodes/<slug> and /downloads/<slug>.
   */
  cptBySlug: async (endpoint: string, slug: string, cache: CacheOptions = {}) => {
    try {
      const r = await wpFetch<WPPost>(endpoint, { slug, _embed: 1, per_page: 1 }, cache);
      return r.items[0] ?? null;
    } catch {
      return null;
    }
  },
  pages: (params: PagesParams = {}, cache: CacheOptions = {}) =>
    wpFetch<WPPage>("/wp/v2/pages", { per_page: 100, ...params }, cache),
  pageBySlug: (slug: string, cache: CacheOptions = {}) =>
    wpFetch<WPPage>("/wp/v2/pages", { slug, _embed: 1, per_page: 1 }, cache).then((r) => r.items[0] ?? null),
  categories: (cache: CacheOptions = {}) =>
    wpFetch<WPCategory>("/wp/v2/categories", { per_page: 100, orderby: "count", order: "desc" }, cache),
  categoryBySlug: (slug: string, cache: CacheOptions = {}) =>
    wpFetch<WPCategory>("/wp/v2/categories", { slug, per_page: 1 }, cache).then((r) => r.items[0] ?? null),
};

/**
 * Map of category slug → custom post type REST endpoint. WordPress's standard
 * /wp/v2/posts only returns the built-in `post` type, so categories whose
 * content lives in a CPT (Podcast = `podcast-episodes`, Downloads = `downloads`)
 * appear empty unless we hit the CPT endpoint directly. Both CPTs still expose
 * the `categories` taxonomy, so filtering by category id still works.
 */
export const CATEGORY_CPT_ENDPOINT: Record<string, string> = {
  podcast: "/wp/v2/podcast-episodes",
  downloads: "/wp/v2/downloads",
};

/**
 * Map of URL parent segment → REST endpoint for nested permalinks like
 * /podcast-episodes/<slug>, /downloads/<slug>. Used by WPResolver to look up
 * the correct CPT when resolving a nested URL, and by Category.tsx to build
 * the in-app link for a CPT entry surfaced in a category listing.
 *
 * Example: a card in /category/podcast knows the slug lives at
 * /podcast-episodes/<slug>, not /<slug>, because `podcast` resolves to the
 * `/wp/v2/podcast-episodes` endpoint and the URL parent for that endpoint is
 * `podcast-episodes`.
 */
export const CPT_URL_PARENT: Record<string, string> = {
  "/wp/v2/podcast-episodes": "podcast-episodes",
  "/wp/v2/downloads": "downloads",
};

export const URL_PARENT_TO_CPT_ENDPOINT: Record<string, string> = Object.fromEntries(
  Object.entries(CPT_URL_PARENT).map(([endpoint, parent]) => [parent, endpoint]),
);

export function getCategoryCptEndpointById(
  categories: Array<Pick<WPCategory, "id" | "slug">> | undefined,
  categoryId?: number,
): string | undefined {
  if (!categoryId || !categories?.length) return undefined;
  const slug = categories.find((category) => category.id === categoryId)?.slug;
  return slug ? CATEGORY_CPT_ENDPOINT[slug] : undefined;
}

export function getWpPostHref(postSlug: string, endpoint?: string): string {
  const urlParent = endpoint ? CPT_URL_PARENT[endpoint] : "";
  return urlParent ? `/${urlParent}/${postSlug}` : `/${postSlug}`;
}



// Common TTL presets (seconds)
export const WP_TTL = {
  short: 60,        // 1 min — for fast-moving content
  default: 600,     // 10 min — matches edge default
  long: 3600,       // 1 hr — for slow-changing pages/categories
  day: 86_400,      // 24 hr — for very stable assets
} as const;

// Force a fresh fetch from WordPress for one path. Use after publishing/editing
// content in WP. Returns the freshly fetched payload (and refreshes downstream
// caches by sending bust=1).
export async function bustWPCache(path: "posts" | "pages" | "categories" = "posts"): Promise<void> {
  if (path === "posts") await wp.posts({ per_page: 1 }, { bust: true });
  else if (path === "pages") await wp.pages({ per_page: 1 }, { bust: true });
  else await wp.categories({ bust: true });
}


// ---- Helpers ----
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

export function getFeaturedImage(post: WPPost): { url: string; alt: string; width?: number; height?: number } | null {
  const media = post._embedded?.["wp:featuredmedia"]?.[0];
  if (!media?.source_url) return null;
  return {
    url: media.source_url,
    alt: media.alt_text || stripHtml(post.title.rendered),
    width: media.media_details?.width,
    height: media.media_details?.height,
  };
}

export function getCategories(post: WPPost): WPTerm[] {
  const groups = post._embedded?.["wp:term"] ?? [];
  return groups.flat().filter((t) => t.taxonomy === "category");
}

export function getAuthor(post: WPPost): WPAuthor | null {
  return post._embedded?.author?.[0] ?? null;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}
