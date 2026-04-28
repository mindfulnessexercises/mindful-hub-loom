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
 * Per-event required-prop registry. Events not listed here are unconstrained
 * (free-form telemetry). Events listed here MUST carry every key in their
 * array OR the validator will:
 *   1. console.warn (visible in dev + prod) so the bad call site is obvious
 *   2. append `_validation_failed: true` and `_missing_props: "a,b"` to the
 *      payload so the in-app dashboard surfaces broken events too
 *   3. still forward the event — analytics MUST NEVER break the UX, and
 *      partial data is more useful than dropped data for diagnosis.
 *
 * Keep this in sync with `docs/analytics-taxonomy.md`.
 *
 * Featured-row events are the canonical example: every card-level impression
 * or click MUST carry the post + category identifiers, otherwise the row is
 * unattributable in funnel analysis.
 */
const REQUIRED_PROPS: Record<string, readonly string[]> = {
  // CTA clicks — minimum shape that downstream funnel queries depend on.
  cta_clicked: ["cta_label", "cta_destination", "cta_location"],

  // Email signups — every capture surface MUST tag itself with track + surface.
  email_signup_submitted: ["form_id", "track", "surface"],
  email_signup_succeeded: ["form_id", "track", "surface"],
  email_signup_failed: ["form_id", "track", "surface"],

  // Sticky email bar lifecycle
  sticky_email_bar_viewed: ["track", "source_path"],
  sticky_email_bar_dismissed: ["track", "source_path"],

  // Featured-from-other-categories rail (Library)
  featured_other_cats_row_viewed: ["from_category_id", "item_count", "items_signature"],
  featured_other_cats_card_viewed: ["category_id", "category_slug", "post_id", "post_slug", "position"],
  featured_other_cats_card_clicked: [
    "category_id",
    "category_slug",
    "post_id",
    "post_slug",
    "position",
    "click_target",
  ],
  featured_other_cats_empty_clear_clicked: ["from_category_id"],

  // Category exploration grid (Library)
  category_exploration_loaded_more: ["from", "to", "total_available"],
  category_exploration_topic_opened: ["category_id", "category_slug", "location"],
  category_exploration_post_opened: ["category_id", "category_slug", "post_id"],

  // More-like-this related links (post detail)
  more_like_this_post_opened: ["post_id"],
  more_like_this_page_opened: ["page_id"],
  more_like_this_related_category_opened: ["category_id", "category_slug"],

  // Search & filter
  search_submitted: ["query", "source"],
  category_filter_changed: ["from_category_id", "to_category_id", "source"],
  sort_changed: ["from_sort", "to_sort", "source"],
  library_tab_changed: ["from_tab", "to_tab", "source"],
  search_type_changed: ["from_type", "to_type", "source"],
  library_filter_cleared: ["cleared"],
  library_view_shared: ["method", "path"],
  pagination_load_more: ["source", "from_page", "to_page"],
  empty_state_tile_clicked: ["category_id", "category_slug"],

  // Engagement
  homepage_scroll_depth: ["depth_percent"],
  homepage_section_viewed: ["section"],
  homepage_cta_viewed: ["cta_location"],

  // Audio engagement (see src/hooks/use-audio-tracking.ts)
  audio_started: ["src", "surface"],
  audio_completed: ["src", "surface", "completion_trigger"],

  // Video engagement (see src/components/video/LiteVideoEmbed.tsx)
  // Only fires on poster click — downstream play/pause/complete events
  // would require loading the Vimeo/YouTube SDK and defeat the lite embed.
  video_play_clicked: ["video_provider", "video_id", "video_title", "video_location"],

  // Buzzsprout podcast embed (see src/components/wp/BuzzsproutEmbed.tsx).
  // Cross-origin iframe blocks real play/ended events — these are the only
  // two signals we can measure reliably from the parent document.
  buzzsprout_embed_viewed: ["episode_id", "podcast_id", "post_slug"],
  buzzsprout_embed_play_intent: ["episode_id", "podcast_id", "post_slug"],

  // Certification click-throughs (site-wide; see src/hooks/use-certification-click-tracker.ts)
  certification_cta_clicked: ["cta_destination", "cta_location", "source_path"],

  // Infra
  legacy_redirect: ["from", "to", "rule", "external"],
};

/**
 * Returns the list of missing required props for `name`, or an empty array if
 * the event is valid (or has no required-prop schema).
 *
 * "Missing" means the key is not present OR the value is `null`/`undefined`/
 * empty string. Zero and `false` are valid values.
 */
function findMissingRequired(name: string, props: EventProps): string[] {
  const required = REQUIRED_PROPS[name];
  if (!required) return [];
  const missing: string[] = [];
  for (const key of required) {
    const v = props[key];
    if (v === undefined || v === null || v === "") missing.push(key);
  }
  return missing;
}

/**
 * Validate + annotate. Returns the props to actually send (possibly with
 * validation flags appended) and emits a console.warn when validation fails.
 *
 * Exported for unit testing — `trackEvent` uses it internally.
 */
export function validateEventProps(name: string, props: EventProps): EventProps {
  const missing = findMissingRequired(name, props);
  if (missing.length === 0) return props;
  // eslint-disable-next-line no-console
  console.warn(
    `[analytics] event "${name}" is missing required props: ${missing.join(", ")}`,
    { received: props },
  );
  return {
    ...props,
    _validation_failed: true,
    _missing_props: missing.join(","),
  };
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
  const validated = validateEventProps(name, cleaned);
  const win = w();

  // Lovable Cloud sink — queued + non-blocking. Powers the in-app dashboard.
  enqueueCloud(name, validated);

  if (!win) return;

  // GTM / GA4 — pushes onto dataLayer with `event` key.
  try {
    if (Array.isArray(win.dataLayer)) {
      win.dataLayer.push({ event: name, ...validated });
    }
  } catch {
    /* never let analytics break the app */
  }

  // Plausible
  try {
    if (typeof win.plausible === "function") {
      win.plausible(name, Object.keys(validated).length ? { props: validated } : undefined);
    }
  } catch {
    /* swallow */
  }

  // PostHog
  try {
    if (win.posthog?.capture) {
      win.posthog.capture(name, validated);
    }
  } catch {
    /* swallow */
  }

  // Dev-only visibility — see what is being fired without a provider attached.
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.debug("[analytics]", name, validated);
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
  // Enrich every CTA click with podcast attribution if the user played a
  // Buzzsprout episode earlier in this tab. The attribution payload is
  // namespaced (`podcast_play_*`) so it never collides with the CTA's own
  // props and downstream queries can join cleanly.
  //
  // Sync inline import would create a circular dep at module-eval time, so
  // we read sessionStorage via a tiny helper that has no other deps.
  let attributed: Record<string, string | number | boolean> = {};
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { getPodcastAttribution } = require("./podcast-attribution") as typeof import("./podcast-attribution");
    const a = getPodcastAttribution();
    if (a) {
      attributed = {
        attributed_to_podcast: true,
        ...a,
      };
    }
  } catch {
    /* attribution is best-effort; never break the click */
  }
  trackEvent("cta_clicked", { ...props, ...attributed });
  // Also record dispatch / queue arrival tracking. Done lazily-imported to
  // avoid a circular import (cta-arrival imports `trackEvent` from this file).
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  void import("./cta-arrival").then((m) => m.recordCtaDispatch(props)).catch(() => {});
}

