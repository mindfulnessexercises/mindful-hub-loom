// Outbound destination outcome tracking — bridges `cta_clicked` (intent) with
// arrival on the destination page (outcome) to close funnel loops.
//
// Two flavors, depending on whether the destination is in-app or external:
//
//   • INTERNAL (e.g. "/library?cat=42") — we record click context in
//     sessionStorage keyed by the normalized destination path. When the
//     router navigates to that path within the freshness window, we fire
//     `cta_destination_arrived` with the original click context plus the
//     latency between click and arrival. This proves the user actually
//     reached the page (not just clicked-then-back-buttoned).
//
//   • EXTERNAL (e.g. "https://certify.mindfulnessexercises.com") — we cannot
//     observe arrival from this app. We instead fire `cta_destination_dispatched`
//     synchronously alongside the click as a best-effort handoff signal,
//     plus include `outbound: true` so reports can separate the two cases.
//
// Funnel:    cta_clicked  →  cta_destination_dispatched | cta_destination_arrived
//
// Storage shape (sessionStorage so it survives same-tab nav but not new tabs):
//   key:   cta_arrival:v1
//   value: { [normalizedPath: string]: { ctx: CtaClickProps, ts: number } }

import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackEvent, type CtaClickProps } from "./analytics";

const STORAGE_KEY = "cta_arrival:v1";
const FRESHNESS_MS = 60_000; // 1 minute — beyond this we don't credit arrival
const MAX_ENTRIES = 16; // bound storage so a clicky session can't grow unbounded

type Pending = { ctx: CtaClickProps; ts: number };
type Store = Record<string, Pending>;

function readStore(): Store {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Store;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeStore(s: Store): void {
  try {
    // Trim if we exceeded the cap — drop oldest entries first.
    const keys = Object.keys(s);
    if (keys.length > MAX_ENTRIES) {
      const sorted = keys
        .map((k) => [k, s[k].ts] as const)
        .sort((a, b) => a[1] - b[1]);
      for (let i = 0; i < sorted.length - MAX_ENTRIES; i++) {
        delete s[sorted[i][0]];
      }
    }
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch {
    /* sessionStorage may be unavailable (Safari private mode etc) — silent fail */
  }
}

/**
 * Normalize a destination value into a comparable key.
 *  - Absolute URLs keep their full origin so we can detect outbound vs internal.
 *  - Relative paths/hrefs are normalized to start with "/".
 *  - Trailing slashes (other than root) are stripped.
 *  - Hashes are dropped (we credit page-level arrival, not section anchors).
 */
export function normalizeDestination(dest: string): { key: string; isExternal: boolean; pathname: string } {
  const trimmed = (dest || "").trim();
  if (!trimmed) return { key: "/", isExternal: false, pathname: "/" };

  // Mailto / tel / form: pseudo-destinations — treat as external no-arrival.
  if (/^(mailto:|tel:|form:|javascript:)/i.test(trimmed)) {
    return { key: trimmed.toLowerCase(), isExternal: true, pathname: trimmed };
  }

  let url: URL;
  try {
    url = new URL(trimmed, window.location.origin);
  } catch {
    return { key: trimmed, isExternal: false, pathname: trimmed };
  }

  const isExternal = url.origin !== window.location.origin;
  let pathname = url.pathname || "/";
  if (pathname.length > 1 && pathname.endsWith("/")) pathname = pathname.slice(0, -1);
  // Search params are kept (filters/category matter) but hash is not.
  const key = isExternal
    ? `${url.origin}${pathname}${url.search}`
    : `${pathname}${url.search}`;
  return { key, isExternal, pathname };
}

/**
 * Call right before/after `trackCtaClick`. For internal destinations it
 * stashes context for the arrival hook to consume; for external destinations
 * it fires `cta_destination_dispatched` immediately.
 */
export function recordCtaDispatch(ctx: CtaClickProps): void {
  if (typeof window === "undefined") return;
  const { key, isExternal, pathname } = normalizeDestination(ctx.cta_destination);

  if (isExternal) {
    trackEvent("cta_destination_dispatched", {
      ...ctx,
      destination_key: key,
      outbound: true,
    });
    return;
  }

  // Internal — stash for the arrival tracker.
  const store = readStore();
  store[key] = { ctx, ts: Date.now() };
  writeStore(store);
}

/**
 * Mount once at the app root. Watches react-router location changes and
 * fires `cta_destination_arrived` when the new pathname+search matches a
 * recently-recorded CTA click.
 */
export function usePageArrivalTracker(): void {
  const location = useLocation();
  useEffect(() => {
    if (typeof window === "undefined") return;
    const store = readStore();
    if (Object.keys(store).length === 0) return;

    const now = Date.now();
    let pathname = location.pathname || "/";
    if (pathname.length > 1 && pathname.endsWith("/")) pathname = pathname.slice(0, -1);
    const arrivalKey = `${pathname}${location.search}`;
    // Also try a path-only match so a CTA pointing at "/library" still credits
    // when the user lands on "/library?cat=foo" from a homepage filter widget.
    const arrivalPathOnly = pathname;

    const candidates = [arrivalKey, arrivalPathOnly];
    let matched: { key: string; pending: Pending } | null = null;
    for (const k of candidates) {
      const pending = store[k];
      if (pending && now - pending.ts <= FRESHNESS_MS) {
        matched = { key: k, pending };
        break;
      }
    }

    // GC: drop expired entries on every navigation so storage stays small.
    let dirty = false;
    for (const [k, v] of Object.entries(store)) {
      if (now - v.ts > FRESHNESS_MS) {
        delete store[k];
        dirty = true;
      }
    }

    if (matched) {
      const { ctx, ts } = matched.pending;
      trackEvent("cta_destination_arrived", {
        ...ctx,
        destination_key: matched.key,
        arrived_path: arrivalKey,
        latency_ms: now - ts,
        outbound: false,
      });
      delete store[matched.key];
      dirty = true;
    }

    if (dirty) writeStore(store);
  }, [location.pathname, location.search]);
}
