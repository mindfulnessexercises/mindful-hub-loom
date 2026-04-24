/**
 * Session-scoped impression dedupe.
 *
 * Why this exists:
 *   - React 18 Strict Mode mounts components twice in development, which
 *     causes effect-driven impression fires to double-count even though
 *     useImpression's per-instance `fired` ref guards against intra-effect
 *     re-fires.
 *   - SPA route transitions can re-mount the same featured card seconds
 *     later (e.g. user clicks into a post and clicks back). Without an
 *     out-of-component memory we'd count those as fresh impressions.
 *   - An impression observer attached to a horizontally scrollable rail
 *     can have the same card swing in and out of view as the user pans;
 *     the per-instance ref handles that, but a different React render
 *     tree (e.g. responsive layout flip) still resets it.
 *
 * What this is NOT:
 *   - A global "fire once forever" cache. We expire entries after
 *     IMPRESSION_TTL_MS so a genuine return visit later in the session
 *     still counts as a real impression. Tune via the constant below.
 *   - Persisted across sessions. Memory only — closing the tab clears it.
 *     This matches the analytics intent: a returning user the next day is
 *     a new opportunity worth recording.
 *
 * Intended usage:
 *   ```ts
 *   const key = `featured_card:${categoryId}:${postId}`;
 *   if (!shouldFireImpression(key)) return;
 *   trackEvent("featured_other_cats_card_viewed", { ... });
 *   ```
 *   Call `shouldFireImpression` only AFTER all other guards (visibility,
 *   dwell time, etc.) have passed — this is the LAST gate before emitting.
 */

const IMPRESSION_TTL_MS = 30 * 60 * 1000; // 30 minutes — re-impress beyond this

// Module-level Map. Survives across React re-mounts in the same SPA session
// because module state is shared. Cleared on hard navigation/tab close.
const seenImpressions = new Map<string, number>();

/**
 * Returns true if the given impression key has NOT been recorded recently.
 * On `true`, marks the key as seen so a follow-up call within TTL returns
 * false. This is a side-effecting "claim" — call it exactly once at the
 * point you actually want to fire the analytics event.
 */
export function shouldFireImpression(key: string, ttlMs: number = IMPRESSION_TTL_MS): boolean {
  const now = Date.now();
  const last = seenImpressions.get(key);
  if (last !== undefined && now - last < ttlMs) {
    return false;
  }
  seenImpressions.set(key, now);
  // Lightweight GC so the map doesn't grow unbounded across long sessions.
  // Runs at most once per call and only when we're inserting; cost is O(N)
  // but N is bounded by what one user can scroll past.
  if (seenImpressions.size > 500) {
    for (const [k, ts] of seenImpressions) {
      if (now - ts >= ttlMs) seenImpressions.delete(k);
    }
  }
  return true;
}

/** Test-only helper: wipe the dedupe cache between unit tests. */
export function _resetImpressionDedupe(): void {
  seenImpressions.clear();
}
