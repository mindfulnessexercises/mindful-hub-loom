import { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/analytics";

/**
 * Mounts homepage engagement tracking — meant to be rendered once, near the
 * top of the page (sibling of <main>). Two channels:
 *
 * 1) **Scroll-depth milestones**
 *    Fires `homepage_scroll_depth` exactly once per page-view at 25%, 50%,
 *    75% and 100% of the page's scrollable height. Uses `requestAnimationFrame`
 *    + a passive scroll listener so it never blocks rendering or fights the
 *    main thread on long pages.
 *
 * 2) **Section impressions**
 *    Watches every element with `data-track-section="<id>"` and fires
 *    `homepage_section_viewed` once per section per page-view when ≥40% of
 *    it has been visible for 600ms (dwell threshold to suppress fly-bys).
 *    Sections are inferred from the data attribute, so adding a new section
 *    only requires marking up its wrapper — no edits here needed.
 *
 * 3) **CTA impressions**
 *    Same dwell logic, but watches `data-track-cta="<id>"` elements (form
 *    wrappers, hero button rows, FinalCTA buttons). Fires
 *    `homepage_cta_viewed` once per CTA per page-view. Pair this with the
 *    existing `cta_clicked` events to compute per-CTA CTR and view→signup
 *    funnels.
 *
 * Together these let analytics correlate "user reached EbookCapture" /
 * "scrolled to 75%" with downstream signup or registration events to find
 * which sections actually drive conversion.
 */

const SCROLL_MILESTONES = [25, 50, 75, 100] as const;
const IMPRESSION_THRESHOLD = 0.4;
const IMPRESSION_DWELL_MS = 600;

export function HomepageEngagementTracker() {
  // Persist across re-renders / strict-mode double-mount so we don't double-fire.
  const firedScroll = useRef(new Set<number>());
  const firedSections = useRef(new Set<string>());

  useEffect(() => {
    if (typeof window === "undefined") return;

    // ─── Scroll depth ───────────────────────────────────────────────
    let ticking = false;
    const computeAndFire = () => {
      ticking = false;
      const doc = document.documentElement;
      const scrollTop = window.scrollY || doc.scrollTop || 0;
      const viewport = window.innerHeight || doc.clientHeight || 0;
      const fullHeight = Math.max(
        doc.scrollHeight,
        document.body?.scrollHeight ?? 0,
      );
      const scrollable = Math.max(1, fullHeight - viewport);
      const pct = Math.min(100, Math.round(((scrollTop + viewport) / fullHeight) * 100));
      // Use the bottom-of-viewport position so reaching 100% requires actually
      // seeing the bottom (not just scrolling past 100% of doc top offset).
      for (const milestone of SCROLL_MILESTONES) {
        if (pct >= milestone && !firedScroll.current.has(milestone)) {
          firedScroll.current.add(milestone);
          trackEvent("homepage_scroll_depth", {
            milestone,
            scroll_top: scrollTop,
            viewport_height: viewport,
            doc_height: fullHeight,
            scrollable_px: scrollable,
          });
        }
      }
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(computeAndFire);
    };
    // Fire once immediately for above-the-fold short pages.
    computeAndFire();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    // ─── Section + CTA impressions ─────────────────────────────────
    let observer: IntersectionObserver | null = null;
    const dwellTimers = new Map<string, ReturnType<typeof setTimeout>>();
    // Tracks which keys have already fired across BOTH section and CTA
    // observers — keys are namespaced ("section:hero" vs "cta:ebook_form")
    // so a section and a CTA can never collide.
    const firedKeys = new Set<string>();
    // Mirror to refs so strict-mode double-mounts don't double-fire.
    firedSections.current.forEach((s) => firedKeys.add(`section:${s}`));

    const fire = (
      kind: "section" | "cta",
      el: HTMLElement,
      id: string,
    ) => {
      const key = `${kind}:${id}`;
      if (firedKeys.has(key)) return;
      firedKeys.add(key);
      if (kind === "section") {
        firedSections.current.add(id);
        trackEvent("homepage_section_viewed", {
          section_id: id,
          section_label: el.dataset.trackSectionLabel ?? id,
          section_index: Number(el.dataset.trackSectionIndex ?? -1),
        });
      } else {
        trackEvent("homepage_cta_viewed", {
          cta_id: id,
          cta_label: el.dataset.trackCtaLabel ?? id,
          cta_location: el.dataset.trackCtaLocation ?? "homepage",
        });
      }
    };

    if (typeof IntersectionObserver !== "undefined") {
      const targets = Array.from(
        document.querySelectorAll<HTMLElement>(
          "[data-track-section], [data-track-cta]",
        ),
      );
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            const el = entry.target as HTMLElement;
            const kind: "section" | "cta" = el.dataset.trackCta ? "cta" : "section";
            const id = (kind === "cta" ? el.dataset.trackCta : el.dataset.trackSection) ?? "";
            if (!id) continue;
            const key = `${kind}:${id}`;
            if (firedKeys.has(key)) {
              if (observer) observer.unobserve(el);
              continue;
            }
            const visible = entry.isIntersecting && entry.intersectionRatio >= IMPRESSION_THRESHOLD;
            if (visible) {
              if (!dwellTimers.has(key)) {
                dwellTimers.set(
                  key,
                  setTimeout(() => {
                    dwellTimers.delete(key);
                    fire(kind, el, id);
                    if (observer) observer.unobserve(el);
                  }, IMPRESSION_DWELL_MS),
                );
              }
            } else {
              const t = dwellTimers.get(key);
              if (t != null) {
                clearTimeout(t);
                dwellTimers.delete(key);
              }
            }
          }
        },
        { threshold: [IMPRESSION_THRESHOLD] },
      );
      // Assign an ordinal index by document order for sections only.
      targets.forEach((el, i) => {
        if (el.dataset.trackSection && el.dataset.trackSectionIndex == null) {
          el.dataset.trackSectionIndex = String(i);
        }
        observer!.observe(el);
      });
    }
        observer!.observe(el);
      });
    }

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      observer?.disconnect();
      for (const t of dwellTimers.values()) clearTimeout(t);
    };
  }, []);

  return null;
}
