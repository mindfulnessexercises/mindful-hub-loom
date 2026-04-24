/**
 * Lightweight, provider-agnostic analytics event bus.
 *
 * Why this shape:
 *   - We don't want to hard-couple the app to any single vendor. This module
 *     fans an event out to whatever providers happen to be loaded on the page
 *     at runtime (GTM/GA4 via dataLayer, Plausible, PostHog).
 *   - Calls are non-throwing and silently no-op if no provider exists, so
 *     adding tracking calls in components is always safe — we can wire in a
 *     real provider later without touching the call sites.
 *   - In dev (import.meta.env.DEV) we also `console.debug` so engineers can
 *     verify the event payload is correct before connecting a vendor.
 *
 * Naming convention for events: `snake_case` verbs in past tense, e.g.
 *   - "cta_clicked"             — user clicked a tracked CTA
 *   - "email_signup_submitted"  — user submitted the email capture form
 *   - "email_signup_succeeded"  — submission returned success
 *   - "email_signup_failed"     — submission errored
 *
 * Property keys are also snake_case so they map cleanly to GA4 custom params
 * and Plausible/PostHog property tables.
 */

type EventProps = Record<string, string | number | boolean | null | undefined>;

interface DataLayerWindow extends Window {
  dataLayer?: Array<Record<string, unknown>>;
  plausible?: (event: string, opts?: { props?: EventProps }) => void;
  posthog?: { capture?: (event: string, props?: EventProps) => void };
}

function w(): DataLayerWindow | undefined {
  return typeof window === "undefined" ? undefined : (window as DataLayerWindow);
}

/** Strip undefined values — providers (esp. GA4) prefer omitted keys to nulls. */
function clean(props: EventProps): EventProps {
  const out: EventProps = {};
  for (const [k, v] of Object.entries(props)) {
    if (v !== undefined) out[k] = v;
  }
  return out;
}

/**
 * Fire-and-forget Lovable Cloud sink. Buffers events into rAF-batched
 * inserts so a click handler never awaits a network round-trip, and so a
 * burst of events (e.g. impression observer firing 6 sections at once)
 * coalesces into a single INSERT. Failures are swallowed by design —
 * analytics MUST NEVER break the UX.
 */
type QueuedEvent = { name: string; props: EventProps; occurred_at: string };
const cloudQueue: QueuedEvent[] = [];
let flushScheduled = false;

async function flushCloudQueue(): Promise<void> {
  flushScheduled = false;
  if (cloudQueue.length === 0) return;
  const batch = cloudQueue.splice(0, cloudQueue.length);
  try {
    // Lazy import so analytics has zero cost on initial bundle parse and
    // doesn't pull supabase into pages that never fire an event.
    const { supabase } = await import("@/integrations/supabase/client");
    const rows = batch.map((e) => ({ name: e.name, props: e.props, occurred_at: e.occurred_at }));
    await supabase.from("analytics_events").insert(rows);
  } catch {
    /* never let analytics break the app */
  }
}

function enqueueCloud(name: string, props: EventProps): void {
  cloudQueue.push({ name, props, occurred_at: new Date().toISOString() });
  if (flushScheduled) return;
  flushScheduled = true;
  if (typeof window !== "undefined" && typeof window.requestAnimationFrame === "function") {
    window.requestAnimationFrame(() => void flushCloudQueue());
  } else {
    queueMicrotask(() => void flushCloudQueue());
  }
}

/**
 * Fire a tracked event. Safe to call even when no analytics provider is
 * loaded — it will silently no-op (and dev-log).
 */
export function trackEvent(name: string, props: EventProps = {}): void {
  const cleaned = clean(props);
  const win = w();

  // Lovable Cloud sink — queued + non-blocking. Powers the in-app dashboard.
  enqueueCloud(name, cleaned);

  if (!win) return;

  // GTM / GA4 — pushes onto dataLayer with `event` key.
  try {
    if (Array.isArray(win.dataLayer)) {
      win.dataLayer.push({ event: name, ...cleaned });
    }
  } catch {
    /* never let analytics break the app */
  }

  // Plausible
  try {
    if (typeof win.plausible === "function") {
      win.plausible(name, Object.keys(cleaned).length ? { props: cleaned } : undefined);
    }
  } catch {
    /* swallow */
  }

  // PostHog
  try {
    if (win.posthog?.capture) {
      win.posthog.capture(name, cleaned);
    }
  } catch {
    /* swallow */
  }

  // Dev-only visibility — see what is being fired without a provider attached.
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.debug("[analytics]", name, cleaned);
  }
}

/**
 * Specialised helper for CTA clicks so all call sites use the same property
 * shape. This keeps downstream funnel queries simple — one event name with
 * structured props rather than a different event per CTA label.
 *
 * Required props:
 *   - cta_label:       The visible button text (e.g. "Get free practice")
 *   - cta_destination: The href/route the click sends the user to
 *   - cta_location:    Where on the site the CTA sits (e.g. "library_post_card")
 *
 * Optional props:
 *   - post_id, page_id          — content the CTA originated from
 *   - category_id, category_slug — matched category that produced the CTA
 *   - matched                   — true if a category-rule produced the label,
 *                                 false for default fallbacks
 */
export interface CtaClickProps {
  cta_label: string;
  cta_destination: string;
  cta_location: string;
  post_id?: number;
  page_id?: number;
  category_id?: number;
  category_slug?: string;
  matched?: boolean;
  /** "category" | "title" | "default" — where the CTA rule matched, if any. */
  match_source?: string;
}

export function trackCtaClick(props: CtaClickProps): void {
  trackEvent("cta_clicked", { ...props });
  // Also record dispatch / queue arrival tracking. Done lazily-imported to
  // avoid a circular import (cta-arrival imports `trackEvent` from this file).
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  void import("./cta-arrival").then((m) => m.recordCtaDispatch(props)).catch(() => {});
}

