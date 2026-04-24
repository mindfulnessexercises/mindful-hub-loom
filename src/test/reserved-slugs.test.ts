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

describe("reserved slugs do not collide with live WordPress content", () => {
  // Skip "" (root), it's not a real WP slug. Test the rest.
  const realReserved = RESERVED_SLUGS.filter((s) => s !== "");

  for (const slug of realReserved) {
    it(
      `no WP post or page exists at slug "${slug}"`,
      async () => {
        const [postCollision, pageCollision] = await Promise.all([
          wpHasSlug("posts", slug),
          wpHasSlug("pages", slug),
        ]);
        expect(postCollision, `WP post with slug "${slug}" would collide with the app route`).toBe(false);
        expect(pageCollision, `WP page with slug "${slug}" would collide with the app route`).toBe(false);
      },
      NETWORK_TIMEOUT,
    );
  }
});
