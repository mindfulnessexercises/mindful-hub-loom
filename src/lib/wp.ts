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

async function wpFetch<T>(path: string, params: Record<string, string | number | undefined> = {}): Promise<PaginatedResult<T>> {
  const search = new URLSearchParams({ path });
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== "") search.append(k, String(v));
  }
  const res = await fetch(`${PROXY_URL}?${search.toString()}`, {
    headers: { apikey: ANON, Authorization: `Bearer ${ANON}` },
  });
  if (!res.ok) throw new Error(`WP fetch failed: ${res.status}`);
  const items = (await res.json()) as T[];
  const total = Number(res.headers.get("x-wp-total") ?? items.length ?? 0);
  const totalPages = Number(res.headers.get("x-wp-totalpages") ?? 1);
  return { items, total, totalPages };
}

export const wp = {
  posts: (params: { page?: number; per_page?: number; search?: string; categories?: number; _embed?: 1 } = {}) =>
    wpFetch<WPPost>("/wp/v2/posts", { _embed: 1, per_page: 12, ...params }),
  postBySlug: (slug: string) =>
    wpFetch<WPPost>("/wp/v2/posts", { slug, _embed: 1, per_page: 1 }).then((r) => r.items[0] ?? null),
  pages: (params: { page?: number; per_page?: number; search?: string } = {}) =>
    wpFetch<WPPage>("/wp/v2/pages", { per_page: 100, ...params }),
  pageBySlug: (slug: string) =>
    wpFetch<WPPage>("/wp/v2/pages", { slug, _embed: 1, per_page: 1 }).then((r) => r.items[0] ?? null),
  categories: () => wpFetch<WPCategory>("/wp/v2/categories", { per_page: 100, orderby: "count", order: "desc" }),
  categoryBySlug: (slug: string) =>
    wpFetch<WPCategory>("/wp/v2/categories", { slug, per_page: 1 }).then((r) => r.items[0] ?? null),
};

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
