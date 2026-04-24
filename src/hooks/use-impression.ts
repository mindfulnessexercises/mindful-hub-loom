import { useEffect, useRef } from "react";
import { shouldFireImpression } from "@/lib/impression-dedupe";

/**
 * Fires `onImpression` exactly once per element when at least `threshold`
 * fraction of it has been visible for `dwellMs` continuous milliseconds.
 *
 * Why dwell + threshold rather than first-pixel-visible:
 *   - Avoids counting fly-by impressions during fast scroll, which inflate
 *     impression counts and tank CTR signals.
 *   - 50% visibility for 400ms is the de-facto industry baseline (matches
 *     IAB display impression standards, scaled down a touch for SPA cards).
 *
 * The hook is "one-shot" within a mount: once the element has fired,
 * observation is disconnected.
 *
 * Strict Mode / route-transition dedupe:
 *   - In dev React 18 mounts effects twice; cleanup of the first mount
 *     clears the dwell timer, so the per-instance `fired` ref already
 *     prevents that pair from double-firing.
 *   - For dedupe across separate mounts (e.g. user navigates away and
 *     back), pass a stable `dedupeKey` derived from the rendered content
 *     (e.g. `"featured_card:<cat>:<post>"`). The hook will consult the
 *     module-level `shouldFireImpression` cache so the SAME card seen
 *     within the TTL window won't re-fire.
 *   - Omit `dedupeKey` to keep the legacy "every fresh mount = new
 *     impression" behaviour.
 */
export function useImpression<T extends HTMLElement>(
  onImpression: () => void,
  options?: {
    threshold?: number;
    dwellMs?: number;
    enabled?: boolean;
    /** Stable identity for cross-mount dedupe. Omit to disable. */
    dedupeKey?: string;
    /** TTL in ms for the dedupe cache (default: 30 minutes). */
    dedupeTtlMs?: number;
  },
) {
  const ref = useRef<T | null>(null);
  // Latch the callback so consumers can pass an inline arrow without
  // re-subscribing the observer on every render.
  const cbRef = useRef(onImpression);
  cbRef.current = onImpression;

  const threshold = options?.threshold ?? 0.5;
  const dwellMs = options?.dwellMs ?? 400;
  const enabled = options?.enabled ?? true;
  const dedupeKey = options?.dedupeKey;
  const dedupeTtlMs = options?.dedupeTtlMs;

  useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    let dwellTimer: ReturnType<typeof setTimeout> | null = null;
    let fired = false;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (fired) return;
          if (entry.isIntersecting && entry.intersectionRatio >= threshold) {
            if (dwellTimer == null) {
              dwellTimer = setTimeout(() => {
                fired = true;
                // Cross-mount dedupe gate. shouldFireImpression is a
                // claiming check — only call it once we're committed to
                // firing, not eagerly on mount.
                if (!dedupeKey || shouldFireImpression(dedupeKey, dedupeTtlMs)) {
                  cbRef.current();
                }
                observer.disconnect();
              }, dwellMs);
            }
          } else if (dwellTimer != null) {
            // Scrolled away before dwell completed — reset.
            clearTimeout(dwellTimer);
            dwellTimer = null;
          }
        }
      },
      { threshold: [threshold] },
    );

    observer.observe(el);
    return () => {
      if (dwellTimer != null) clearTimeout(dwellTimer);
      observer.disconnect();
    };
  }, [threshold, dwellMs, enabled, dedupeKey, dedupeTtlMs]);

  return ref;
}
