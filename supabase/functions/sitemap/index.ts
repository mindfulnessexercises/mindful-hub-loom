// Generates XML sitemaps live from the WordPress REST API.
// Routes (via ?type= query param):
//   ?type=index   -> sitemap index listing the child sitemaps (default)
//   ?type=posts&page=N
//   ?type=pages&page=N
//   ?type=categories
//
// Google limit: 50,000 URLs / 50 MB per file. We use 1000/page to stay safe.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const WP_BASE = "https://mindfulnessexercises.com/wp-json";
const SITE_BASE = "https://mindfulnessexercises.com";
const PER_PAGE = 100; // WP max
const URLS_PER_SITEMAP = 1000; // each child sitemap holds up to 1000 URLs (10 WP pages)
const CACHE_SECONDS = 3600; // 1 hour

function xmlEscape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

async function wpFetch(path: string, params: Record<string, string | number> = {}) {
  const url = new URL(`${WP_BASE}${path}`);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, String(v));
  const res = await fetch(url.toString(), { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`WP ${path} failed: ${res.status}`);
  const total = Number(res.headers.get("x-wp-total") ?? 0);
  const totalPages = Number(res.headers.get("x-wp-totalpages") ?? 1);
  const items = await res.json();
  return { items, total, totalPages };
}

async function getCounts() {
  // Just need totals — fetch 1 item per type to read x-wp-total header.
  const [posts, pages] = await Promise.all([
    wpFetch("/wp/v2/posts", { per_page: 1, _fields: "id" }),
    wpFetch("/wp/v2/pages", { per_page: 1, _fields: "id" }),
  ]);
  return { posts: posts.total, pages: pages.total };
}

function originFromReq(req: Request): string {
  // Prefer the request's origin so sitemap URLs work on any deployment.
  // Fallback to the live WP site origin.
  const u = new URL(req.url);
  return `${u.protocol}//${u.host}`;
}

function buildIndex(origin: string, postsCount: number, pagesCount: number): string {
  const postSitemaps = Math.max(1, Math.ceil(postsCount / URLS_PER_SITEMAP));
  const pageSitemaps = Math.max(1, Math.ceil(pagesCount / URLS_PER_SITEMAP));
  const lastmod = new Date().toISOString();

  const entries: string[] = [];
  for (let i = 1; i <= postSitemaps; i++) {
    entries.push(
      `<sitemap><loc>${origin}/functions/v1/sitemap?type=posts&amp;page=${i}</loc><lastmod>${lastmod}</lastmod></sitemap>`,
    );
  }
  for (let i = 1; i <= pageSitemaps; i++) {
    entries.push(
      `<sitemap><loc>${origin}/functions/v1/sitemap?type=pages&amp;page=${i}</loc><lastmod>${lastmod}</lastmod></sitemap>`,
    );
  }
  entries.push(
    `<sitemap><loc>${origin}/functions/v1/sitemap?type=categories</loc><lastmod>${lastmod}</lastmod></sitemap>`,
  );

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join("\n")}
</sitemapindex>`;
}

interface WPItem {
  slug: string;
  modified: string;
  link: string;
  type?: string;
}

async function fetchSlice(
  endpoint: "/wp/v2/posts" | "/wp/v2/pages",
  sitemapPage: number,
): Promise<WPItem[]> {
  // Each sitemap holds URLS_PER_SITEMAP urls = 10 WP pages of 100.
  const wpPagesPerSitemap = URLS_PER_SITEMAP / PER_PAGE;
  const startWpPage = (sitemapPage - 1) * wpPagesPerSitemap + 1;
  const requests: Promise<{ items: WPItem[] }>[] = [];
  for (let p = startWpPage; p < startWpPage + wpPagesPerSitemap; p++) {
    requests.push(
      wpFetch(endpoint, {
        per_page: PER_PAGE,
        page: p,
        _fields: "slug,modified,link,type",
        orderby: "modified",
        order: "desc",
      }).then((r) => ({ items: r.items as WPItem[] })).catch(() => ({ items: [] })),
    );
  }
  const results = await Promise.all(requests);
  return results.flatMap((r) => r.items);
}

function buildUrlset(items: { loc: string; lastmod?: string }[]): string {
  const urls = items
    .map(
      (it) =>
        `<url><loc>${xmlEscape(it.loc)}</loc>${it.lastmod ? `<lastmod>${it.lastmod}</lastmod>` : ""}</url>`,
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

function rewriteToSite(origin: string, wpLink: string): string {
  // Map WP permalinks to your site by replacing the WP origin with the request origin.
  try {
    const u = new URL(wpLink);
    const path = u.pathname + u.search;
    return `${origin}${path}`;
  } catch {
    return `${origin}/${wpLink}`;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const url = new URL(req.url);
    const type = url.searchParams.get("type") ?? "index";
    const page = Math.max(1, Number(url.searchParams.get("page") ?? "1"));
    // Allow ?origin= override so the deployed app can ask for sitemaps with its own URL.
    const origin = url.searchParams.get("origin") ?? originFromReq(req);

    const xmlHeaders = {
      ...corsHeaders,
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": `public, max-age=${CACHE_SECONDS}, s-maxage=${CACHE_SECONDS}`,
    };

    if (type === "index") {
      const counts = await getCounts();
      const xml = buildIndex(origin, counts.posts, counts.pages);
      return new Response(xml, { headers: xmlHeaders });
    }

    if (type === "posts" || type === "pages") {
      const endpoint = type === "posts" ? "/wp/v2/posts" : "/wp/v2/pages";
      const items = await fetchSlice(endpoint, page);
      const urls = items.map((it) => ({
        loc: rewriteToSite(origin, it.link),
        lastmod: it.modified,
      }));
      return new Response(buildUrlset(urls), { headers: xmlHeaders });
    }

    if (type === "categories") {
      const all: { slug: string }[] = [];
      let p = 1;
      while (true) {
        const { items, totalPages } = await wpFetch("/wp/v2/categories", {
          per_page: PER_PAGE,
          page: p,
          _fields: "slug",
          hide_empty: "true",
        });
        all.push(...(items as { slug: string }[]));
        if (p >= totalPages) break;
        p++;
      }
      const lastmod = new Date().toISOString();
      const urls = all.map((c) => ({
        loc: `${origin}/category/${c.slug}`,
        lastmod,
      }));
      return new Response(buildUrlset(urls), { headers: xmlHeaders });
    }

    return new Response(JSON.stringify({ error: "Unknown type" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("sitemap error:", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
