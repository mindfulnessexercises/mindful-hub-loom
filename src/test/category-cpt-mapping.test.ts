/**
 * Verifies that special homepage categories whose content lives in WordPress
 * custom post types (Podcast → /wp/v2/podcast-episodes, Downloads →
 * /wp/v2/downloads) get routed to the correct REST endpoint.
 *
 * Two layers:
 *   1. Unit — mock fetch and assert the URL path used per slug. Always runs.
 *   2. Live — hit the real WP REST API and assert non-empty results. Opt-in
 *      via RUN_LIVE_WP_TESTS=1 so CI/sandbox runs stay hermetic and fast.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CATEGORY_CPT_ENDPOINT, CPT_URL_PARENT, URL_PARENT_TO_CPT_ENDPOINT, getCategoryCptEndpointById, getWpPostHref, wp } from "@/lib/wp";
import { resolveLegacyRedirect } from "@/lib/legacy-redirects";
import { isReservedSlug } from "@/lib/reserved-slugs";
import { mapWpPathToAppPath } from "@/lib/rewrite-wp-html";

const LIVE = process.env.RUN_LIVE_WP_TESTS === "1";
const WP_ORIGIN = "https://mindfulnessexercises.com";

interface ExpectedMapping {
  slug: string;
  endpoint: string;
  /** Category id on mindfulnessexercises.com — used for the live check. */
  categoryId: number;
}

// Keep this list in sync with CATEGORY_CPT_ENDPOINT. Category ids are sourced
// from the live WP REST API and verified in the live-only test below.
const EXPECTED: ExpectedMapping[] = [
  { slug: "podcast", endpoint: "/wp/v2/podcast-episodes", categoryId: 13273 },
  { slug: "downloads", endpoint: "/wp/v2/downloads", categoryId: 13431 },
];

describe("CATEGORY_CPT_ENDPOINT registry", () => {
  it.each(EXPECTED)(
    "$slug maps to $endpoint",
    ({ slug, endpoint }) => {
      expect(CATEGORY_CPT_ENDPOINT[slug]).toBe(endpoint);
    },
  );

  it("does not override standard category slugs that use the default /posts endpoint", () => {
    // Default-post-type categories (e.g. blog, meditation-scripts) must NOT be
    // in the registry — otherwise the Category page would silently 404.
    expect(CATEGORY_CPT_ENDPOINT.blog).toBeUndefined();
    expect(CATEGORY_CPT_ENDPOINT["meditation-scripts"]).toBeUndefined();
    expect(CATEGORY_CPT_ENDPOINT.stress).toBeUndefined();
  });

  it("derives the CPT endpoint from a selected category id", () => {
    const categories = [
      { id: 13273, slug: "podcast" },
      { id: 13431, slug: "downloads" },
      { id: 42, slug: "blog" },
    ];

    expect(getCategoryCptEndpointById(categories, 13273)).toBe("/wp/v2/podcast-episodes");
    expect(getCategoryCptEndpointById(categories, 13431)).toBe("/wp/v2/downloads");
    expect(getCategoryCptEndpointById(categories, 42)).toBeUndefined();
    expect(getCategoryCptEndpointById(categories, undefined)).toBeUndefined();
  });
});

describe("wp.posts() endpoint routing (mocked fetch)", () => {
  let fetchSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify([{ id: 1, slug: "stub" }]), {
        status: 200,
        headers: { "x-wp-total": "1", "x-wp-totalpages": "1" },
      }),
    );
  });

  afterEach(() => {
    fetchSpy.mockRestore();
  });

  it("hits /wp/v2/posts by default", async () => {
    await wp.posts({ categories: 999 });
    const url = new URL(fetchSpy.mock.calls[0][0] as string);
    expect(url.searchParams.get("path")).toBe("/wp/v2/posts");
    expect(url.searchParams.get("categories")).toBe("999");
  });

  it.each(EXPECTED)(
    "uses $endpoint when wp.posts is called with that endpoint (slug=$slug)",
    async ({ endpoint, categoryId }) => {
      await wp.posts({ categories: categoryId, endpoint });
      const url = new URL(fetchSpy.mock.calls[0][0] as string);
      expect(url.searchParams.get("path")).toBe(endpoint);
      expect(url.searchParams.get("categories")).toBe(String(categoryId));
    },
  );

  it("returns the parsed paginated result shape", async () => {
    const result = await wp.posts({ endpoint: "/wp/v2/podcast-episodes" });
    expect(result.items).toHaveLength(1);
    expect(result.total).toBe(1);
    expect(result.totalPages).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// Live integration — opt-in. Hits the real WP REST API. Skipped by default to
// keep the suite hermetic. Run with: RUN_LIVE_WP_TESTS=1 vitest run.
// ---------------------------------------------------------------------------
describe.skipIf(!LIVE)("live WP REST returns non-empty results per CPT mapping", () => {
  it.each(EXPECTED)(
    "GET $endpoint?categories=$categoryId returns at least one item",
    async ({ slug, endpoint, categoryId }) => {
      // 1. Confirm the category slug still exists upstream and the id matches.
      const catRes = await fetch(`${WP_ORIGIN}/wp-json/wp/v2/categories?slug=${slug}`);
      expect(catRes.ok).toBe(true);
      const cats = (await catRes.json()) as Array<{ id: number; slug: string }>;
      expect(cats.length).toBeGreaterThan(0);
      expect(cats[0].id).toBe(categoryId);

      // 2. Confirm the CPT endpoint actually returns posts for that category.
      const postsRes = await fetch(
        `${WP_ORIGIN}/wp-json${endpoint}?categories=${categoryId}&per_page=1`,
      );
      expect(postsRes.ok).toBe(true);
      const total = Number(postsRes.headers.get("x-wp-total") ?? 0);
      const items = (await postsRes.json()) as unknown[];
      expect(items.length).toBeGreaterThan(0);
      expect(total).toBeGreaterThan(0);
    },
    20_000,
  );
});

// ---------------------------------------------------------------------------
// Section landing redirects: visiting /podcast or /downloads must NOT load the
// stale legacy WP page — they must redirect to /category/<slug> instead.
// ---------------------------------------------------------------------------
describe("section landing slugs route to category pages", () => {
  it.each([
    { from: "/podcast", to: "/category/podcast" },
    { from: "/downloads", to: "/category/downloads" },
  ])("redirects $from → $to", ({ from, to }) => {
    const hit = resolveLegacyRedirect(from);
    expect(hit).not.toBeNull();
    expect(hit?.target).toBe(to);
    expect(hit?.external).toBe(false);
    expect(hit?.rule).toBe("section_landing_to_category");
  });

  it("treats podcast and downloads as reserved so WPResolver short-circuits", () => {
    // Belt-and-suspenders: even if a navigation happens before useLegacyRedirects
    // fires, WPResolver must not fetch the WP page with that slug.
    expect(isReservedSlug("podcast")).toBe(true);
    expect(isReservedSlug("downloads")).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// CPT URL parent registry: ensures podcast episodes / downloads keep clean
// in-app URLs and that legacy WP body links to those URLs get rewritten.
// ---------------------------------------------------------------------------
describe("CPT_URL_PARENT registry", () => {
  it("maps each CPT endpoint to a URL parent and back", () => {
    expect(CPT_URL_PARENT[CATEGORY_CPT_ENDPOINT.podcast]).toBe("podcast-episodes");
    expect(CPT_URL_PARENT[CATEGORY_CPT_ENDPOINT.downloads]).toBe("downloads");
    // Round-trip: parent → endpoint → parent.
    for (const [endpoint, parent] of Object.entries(CPT_URL_PARENT)) {
      expect(URL_PARENT_TO_CPT_ENDPOINT[parent]).toBe(endpoint);
    }
  });

  it("rewrites legacy CPT permalinks to in-app paths in WP body HTML", () => {
    expect(mapWpPathToAppPath("/podcast-episodes/the-dharma-of-healing-with-justin-michelson"))
      .toBe("/podcast-episodes/the-dharma-of-healing-with-justin-michelson");
    expect(mapWpPathToAppPath("/downloads/some-pdf-resource"))
      .toBe("/downloads/some-pdf-resource");
    // Sanity: unknown nested paths still left external.
    expect(mapWpPathToAppPath("/something/unknown/nested")).toBeNull();
  });

  it("builds internal app hrefs for CPT and default posts", () => {
    expect(getWpPostHref("the-dharma-of-healing-with-justin-michelson", "/wp/v2/podcast-episodes"))
      .toBe("/podcast-episodes/the-dharma-of-healing-with-justin-michelson");
    expect(getWpPostHref("some-download", "/wp/v2/downloads")).toBe("/downloads/some-download");
    expect(getWpPostHref("standard-blog-post")).toBe("/standard-blog-post");
  });
});
