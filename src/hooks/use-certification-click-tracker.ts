import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackEvent } from "@/lib/analytics";

/**
 * Site-wide certification click tracker.
 *
 * Mounted once at the app root, this listens for ANY click on an anchor
 * pointing at the certification host and fires `certification_cta_clicked`
 * with attribution metadata. We use event delegation on `document` so we
 * cover every link without needing to instrument each component:
 *
 *   - Hero, Footer, Navbar, FinalCTA, CertificationSpotlight, etc.
 *   - Future links added anywhere in the app, including WP-rendered HTML.
 *
 * Per the user spec, tracking is site-wide (not gated to audio pages) and
 * each event is tagged with its source page so audio-attributed conversions
 * can be filtered later (`source_path`, `source_section`, `from_audio_page`).
 *
 * Dedupe within a single click: a CTA may already fire `cta_clicked` via
 * `trackCtaClick()` from its own onClick handler; this delegated tracker
 * still fires a separate, dedicated `certification_cta_clicked` event with
 * the certification-specific shape so downstream funnel queries do not
 * have to JOIN/LIKE-match destination URLs across heterogeneous CTA events.
 */

const CERT_HOST_RE = /^https?:\/\/certify\.mindfulnessexercises\.com(\/|$)/i;

/**
 * The set of pages on this site that contain audio players. Matched by
 * pathname prefix or exact match. Used to set `from_audio_page` so
 * conversions can be sliced by audio-engagement context.
 *
 * Audio-bearing surfaces today:
 *   • /audio-library                           — global audio hub
 *   • /admin/meditation-player-demo            — demo
 *   • Any WP-rendered post that injects an AudioPlaylistBlock or
 *     a MeditationPlayer (resolved via WPResolver). We can't enumerate
 *     these statically, so we also probe the live DOM for an <audio>
 *     element on the current page.
 */
const KNOWN_AUDIO_PATHS = ["/audio-library", "/podcast", "/downloads"];

function pageHasAudioPlayer(pathname: string): boolean {
  if (KNOWN_AUDIO_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return true;
  }
  if (typeof document === "undefined") return false;
  return !!document.querySelector("audio");
}

/**
 * Walks up from the click target to find the nearest enclosing element with
 * a stable identifier, so we can attribute the click to a section/component
 * without forcing every CTA author to add tracking attributes.
 *
 * Priority order:
 *   1. Closest ancestor with `data-track-cta-location`  (explicit)
 *   2. Closest <section> with `aria-label` or `id`      (semantic)
 *   3. The link's own `id`                              (fallback)
 */
function inferSourceSection(target: HTMLElement): string | undefined {
  const explicit = target.closest<HTMLElement>("[data-track-cta-location]");
  if (explicit?.dataset.trackCtaLocation) return explicit.dataset.trackCtaLocation;

  const section = target.closest<HTMLElement>("section[aria-label], section[id]");
  if (section) return section.getAttribute("aria-label") || section.id || undefined;

  return target.id || undefined;
}

export function useCertificationClickTracker(): void {
  const location = useLocation();

  useEffect(() => {
    if (typeof document === "undefined") return;

    const handler = (e: MouseEvent) => {
      // Only primary clicks — middle-click / cmd-click open in a new tab
      // but the browser still fires a `click`, so we keep tracking those.
      // We skip modified clicks ONLY when the target is not a link anchor
      // we care about; for cert links, modifier clicks are still legitimate
      // conversions (user opening the cert page in a background tab).
      const targetEl = e.target as HTMLElement | null;
      if (!targetEl) return;
      const anchor = targetEl.closest<HTMLAnchorElement>("a[href]");
      if (!anchor) return;
      const href = anchor.getAttribute("href") || "";
      if (!CERT_HOST_RE.test(href)) return;

      const sourcePath = location.pathname || window.location.pathname;
      trackEvent("certification_cta_clicked", {
        cta_destination: href,
        cta_label: (anchor.textContent || "").trim().slice(0, 120) || undefined,
        cta_location: inferSourceSection(anchor) || "unknown",
        source_path: sourcePath,
        from_audio_page: pageHasAudioPlayer(sourcePath),
        opens_new_tab: anchor.target === "_blank",
        modified_click: e.metaKey || e.ctrlKey || e.shiftKey || e.altKey,
      });
    };

    // Capture phase so we observe the click before any handler that might
    // call `stopPropagation()` on it (e.g. Radix menu items).
    document.addEventListener("click", handler, { capture: true });
    return () => document.removeEventListener("click", handler, { capture: true });
  }, [location.pathname]);
}
