/**
 * Regression guard: every URL in src/test/fixtures/top-100-urls.csv (the
 * top-100 highest-traffic legacy WordPress pages) must continue to resolve
 * to either a real React route or a known redirect target. SEO equity on
 * these pages is irreplaceable — accidentally 404'ing one is a release
 * blocker.
 *
 * We assert at the routing-layer level (no network): a URL is "covered" if
 *
 *   1. It's a section route (/blog, /podcast, /), OR
 *   2. A legacy-redirects rule rewrites it (in-app or off-site), OR
 *   3. It's a single-segment slug (handled by /:slug → WPResolver), OR
 *   4. Its parent segment is one of the registered splat parents in App.tsx.
 *
 * Adding a new top-100 URL whose parent isn't a splat → register the splat
 * in App.tsx (and here). Removing a splat from App.tsx → this test fails.
 */
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import { resolveLegacyRedirect } from "@/lib/legacy-redirects";
import { isReservedSlug } from "@/lib/reserved-slugs";

// Mirrors the routes mounted in src/App.tsx. Keep in sync.
const SECTION_ROUTES = new Set<string>([
  "/",
  "/blog",
  "/library",
  "/audio-library",
  "/videos",
  "/search",
  "/podcast",
  "/downloads",
  "/ce-policies",
]);

// Splat routes mounted as `<Route path="/<parent>/*" element={<WPResolver />}/>`.
// WPResolver derives the slug from the LAST URL segment, so any nested URL
// whose parent is in this set will resolve.
const SPLAT_PARENTS = new Set<string>([
  "course",
  "courses",
  "podcast-episodes",
  "downloads",
  "lessons",
  "meditation",
  "meaningful-work",
  "free-online-mindfulness-courses",
  "how-to-teach-meditation",
  "mindfulness-teacher",
  "blog", // /blog/:slug alias
]);

const fixturePath = join(
  dirname(fileURLToPath(import.meta.url)),
  "fixtures",
  "top-100-urls.csv",
);

const URLS = readFileSync(fixturePath, "utf8")
  .split("\n")
  .map((s) => s.trim())
  .filter(Boolean);

function isCovered(rawPath: string): { covered: boolean; via: string } {
  const path = "/" + rawPath.replace(/^\/+|\/+$/g, "");

  if (SECTION_ROUTES.has(path)) return { covered: true, via: "section" };

  const redirect = resolveLegacyRedirect(path);
  if (redirect) return { covered: true, via: `redirect:${redirect.rule}` };

  const segs = path.split("/").filter(Boolean);
  if (segs.length === 1) {
    if (isReservedSlug(segs[0])) return { covered: true, via: "reserved" };
    return { covered: true, via: "slug" };
  }

  const parent = segs[segs.length - 2];
  if (SPLAT_PARENTS.has(parent)) return { covered: true, via: `splat:${parent}` };

  return { covered: false, via: "none" };
}

describe("top-100 URL preservation", () => {
  it("loaded the fixture", () => {
    expect(URLS.length).toBeGreaterThanOrEqual(100);
  });

  it("every top-100 URL resolves to a route or redirect", () => {
    const broken: Array<{ path: string }> = [];
    for (const raw of URLS) {
      const { covered } = isCovered(raw);
      if (!covered) broken.push({ path: raw });
    }
    expect(
      broken,
      `These top-100 URLs no longer resolve. Add a splat route in App.tsx ` +
        `or a redirect in legacy-redirects.ts:\n${broken
          .map((b) => `  - ${b.path}`)
          .join("\n")}`,
    ).toEqual([]);
  });

  it("teacher CPT pages are NOT redirected off-site (top-100 SEO pages)", () => {
    const sean = resolveLegacyRedirect("/mindfulness-teacher/sean-fargo");
    const joseph = resolveLegacyRedirect(
      "/mindfulness-teacher/joseph-goldstein",
    );
    expect(sean).toBeNull();
    expect(joseph).toBeNull();
  });
});
