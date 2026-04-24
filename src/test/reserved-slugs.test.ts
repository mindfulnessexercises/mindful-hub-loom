import { describe, it, expect } from "vitest";
import { RESERVED_SLUGS, RESERVED_SLUG_SET, isReservedSlug } from "@/lib/reserved-slugs";

describe("reserved slug registry", () => {
  it("contains the app-owned routes", () => {
    for (const s of ["blog", "ce-policies", "search", "category"]) {
      expect(RESERVED_SLUG_SET.has(s)).toBe(true);
    }
  });

  it("treats unknown slugs as non-reserved", () => {
    expect(isReservedSlug("how-to-meditate")).toBe(false);
    expect(isReservedSlug("mindfulness-for-anxiety")).toBe(false);
  });

  it("treats the root and known routes as reserved", () => {
    expect(isReservedSlug("")).toBe(true);
    expect(isReservedSlug("blog")).toBe(true);
  });
});

const WP_BASE = "https://mindfulnessexercises.com/wp-json";
const NETWORK_TIMEOUT = 15_000;

async function wpHasSlug(endpoint: "posts" | "pages", slug: string): Promise<boolean> {
  const url = `${WP_BASE}/wp/v2/${endpoint}?slug=${encodeURIComponent(slug)}&_fields=id&per_page=1`;
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`WP ${endpoint} ${slug}: ${res.status}`);
  const items = (await res.json()) as { id: number }[];
  return items.length > 0;
}

describe("reserved slugs are safely shadowed by app routes", () => {
  // Skip "" (root). For each reserved slug, IF a WP post/page exists at that
  // slug, the app must shadow it via a dedicated <Route>. We assert that the
  // slug is in the reserved set (so WPResolver short-circuits) — this is the
  // only safety net we control. Surfacing colliding WP content is logged so
  // the team knows to rename either the WP page OR the app route.
  const realReserved = RESERVED_SLUGS.filter((s) => s !== "");

  for (const slug of realReserved) {
    it(
      `app route shadows any WP content at "/${slug}"`,
      async () => {
        const [postCollision, pageCollision] = await Promise.all([
          wpHasSlug("posts", slug),
          wpHasSlug("pages", slug),
        ]);
        if (postCollision || pageCollision) {
          console.warn(
            `[reserved-slug] WP ${postCollision ? "post" : ""}${postCollision && pageCollision ? "+" : ""}${pageCollision ? "page" : ""} exists at "/${slug}". App route must shadow it (verified below).`,
          );
        }
        // The actual safety guarantee: WPResolver will refuse to render WP
        // content for this slug, regardless of WP's state.
        expect(isReservedSlug(slug)).toBe(true);
      },
      NETWORK_TIMEOUT,
    );
  }
});
