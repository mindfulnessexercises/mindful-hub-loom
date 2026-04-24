import { useEffect, useRef } from "react";

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
 * The hook is "one-shot": once the element has fired, observation is
 * disconnected. Re-mounting the element resets it (intentional — fresh
 * mount = new impression opportunity).
 */
export function useImpression<T extends HTMLElement>(
  onImpression: () => void,
  options?: { threshold?: number; dwellMs?: number; enabled?: boolean },
) {
  const ref = useRef<T | null>(null);
  // Latch the callback so consumers can pass an inline arrow without
  // re-subscribing the observer on every render.
  const cbRef = useRef(onImpression);
  cbRef.current = onImpression;

  const threshold = options?.threshold ?? 0.5;
  const dwellMs = options?.dwellMs ?? 400;
  const enabled = options?.enabled ?? true;

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
                cbRef.current();
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
  }, [threshold, dwellMs, enabled]);

  return ref;
}
