import { describe, expect, it, beforeEach } from "vitest";
import { shouldFireImpression, _resetImpressionDedupe } from "@/lib/impression-dedupe";

describe("shouldFireImpression", () => {
  beforeEach(() => _resetImpressionDedupe());

  it("returns true on first call for a key", () => {
    expect(shouldFireImpression("a")).toBe(true);
  });

  it("returns false on a second call within TTL", () => {
    shouldFireImpression("a");
    expect(shouldFireImpression("a")).toBe(false);
  });

  it("treats different keys independently", () => {
    expect(shouldFireImpression("a")).toBe(true);
    expect(shouldFireImpression("b")).toBe(true);
    expect(shouldFireImpression("a")).toBe(false);
    expect(shouldFireImpression("b")).toBe(false);
  });

  it("re-fires after the TTL expires", async () => {
    expect(shouldFireImpression("a", 5)).toBe(true);
    expect(shouldFireImpression("a", 5)).toBe(false);
    await new Promise((r) => setTimeout(r, 10));
    expect(shouldFireImpression("a", 5)).toBe(true);
  });

  it("dedupes a strict-mode style double-fire", () => {
    // Two synchronous calls in the same tick (mimicking React 18's
    // double-mount in dev) should result in exactly ONE true.
    const key = "featured_card:42:99";
    const results = [shouldFireImpression(key), shouldFireImpression(key)];
    expect(results).toEqual([true, false]);
  });
});
