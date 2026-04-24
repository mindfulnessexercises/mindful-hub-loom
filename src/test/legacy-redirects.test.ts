import { describe, expect, it } from "vitest";
import { resolveLegacyRedirect } from "@/lib/legacy-redirects";

describe("resolveLegacyRedirect", () => {
  it("returns null for unknown paths", () => {
    expect(resolveLegacyRedirect("/")).toBeNull();
    expect(resolveLegacyRedirect("/some-post")).toBeNull();
    expect(resolveLegacyRedirect("/library")).toBeNull();
  });

  it("strips date prefixes from dated permalinks", () => {
    const r = resolveLegacyRedirect("/2023/05/some-post");
    expect(r).toMatchObject({ target: "/some-post", external: false, rule: "dated_permalink" });
    const r2 = resolveLegacyRedirect("/2023/05/12/another-post/");
    expect(r2).toMatchObject({ target: "/another-post", external: false });
  });

  it("forwards tag and author archives to the legacy domain", () => {
    const r = resolveLegacyRedirect("/tag/breathwork");
    expect(r?.external).toBe(true);
    expect(r?.target).toBe("https://mindfulnessexercises.com/tag/breathwork");
    const a = resolveLegacyRedirect("/author/sean-fargo");
    expect(a?.target).toBe("https://mindfulnessexercises.com/author/sean-fargo");
  });

  it("maps root pagination to /blog with a page param", () => {
    const r = resolveLegacyRedirect("/page/3");
    expect(r).toMatchObject({ target: "/blog?page=3", external: false });
  });

  it("maps category pagination to the in-app category page", () => {
    const r = resolveLegacyRedirect("/category/meditation/page/2");
    expect(r).toMatchObject({ target: "/category/meditation?page=2", external: false });
  });

  it("forwards ?p= shortlinks to the legacy domain", () => {
    const r = resolveLegacyRedirect("/", "?p=12345");
    expect(r?.external).toBe(true);
    expect(r?.target).toBe("https://mindfulnessexercises.com/?p=12345");
  });

  it("normalizes trailing slashes", () => {
    const r = resolveLegacyRedirect("/tag/breathwork/");
    expect(r?.rule).toBe("tag_archive");
  });
});
