import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { validateEventProps } from "@/lib/analytics";

describe("validateEventProps", () => {
  let warnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    warnSpy.mockRestore();
  });

  it("passes through events with no required-prop schema", () => {
    const out = validateEventProps("untracked_custom_event", { foo: "bar" });
    expect(out).toEqual({ foo: "bar" });
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it("passes through valid featured row card click", () => {
    const props = {
      category_id: 12,
      category_slug: "meditation",
      post_id: 99,
      post_slug: "morning-practice",
      position: 0,
      click_target: "title",
    };
    const out = validateEventProps("featured_other_cats_card_clicked", props);
    expect(out).toEqual(props);
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it("flags missing identifiers on featured row card view", () => {
    const out = validateEventProps("featured_other_cats_card_viewed", {
      category_slug: "meditation",
      post_slug: "morning-practice",
      position: 1,
    });
    expect(out._validation_failed).toBe(true);
    expect(out._missing_props).toBe("category_id,post_id");
    expect(warnSpy).toHaveBeenCalledOnce();
  });

  it("treats null and empty string as missing, but allows 0 and false", () => {
    const ok = validateEventProps("homepage_scroll_depth", { depth_percent: 0 });
    expect(ok._validation_failed).toBeUndefined();

    const bad = validateEventProps("legacy_redirect", {
      from: "/foo",
      to: "/bar",
      rule: "",
      external: false,
    });
    expect(bad._validation_failed).toBe(true);
    expect(bad._missing_props).toBe("rule");
  });

  it("validates cta_clicked baseline shape", () => {
    const bad = validateEventProps("cta_clicked", { cta_label: "Go" });
    expect(bad._missing_props).toBe("cta_destination,cta_location");
  });
});
