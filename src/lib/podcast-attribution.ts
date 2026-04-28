/**
 * Podcast → CTA attribution.
 *
 * Records the most recent Buzzsprout play interaction in sessionStorage so any
 * subsequent CTA click in the same tab can be attributed back to it. We chose
 * sessionStorage over a module-scoped variable so attribution survives the
 * SPA → SPA navigations the user takes between the podcast page and a
 * conversion page (pricing, signup, etc.) where the next CTA actually lives.
 *
 * Window: "same session, after play" — no time cap. Once a user plays an
 * episode, every CTA they click in that tab carries the attribution payload
 * until the tab is closed.
 *
 * Storage shape (single key, JSON-encoded):
 *   {
 *     episode_id: string;
 *     podcast_id: string;
 *     post_slug: string;
 *     source_path: string;   // pathname where the play happened
 *     occurred_at: string;   // ISO of the play_intent fire
 *   }
 */
const STORAGE_KEY = "podcast_last_play";

export interface PodcastAttribution {
  podcast_play_episode_id: string;
  podcast_play_podcast_id: string;
  podcast_play_post_slug: string;
  podcast_play_source_path: string;
  podcast_play_occurred_at: string;
  /** Seconds between the play and the current attribution lookup. */
  podcast_play_age_seconds: number;
}

interface StoredPlay {
  episode_id: string;
  podcast_id: string;
  post_slug: string;
  source_path: string;
  occurred_at: string;
}

function safeSessionStorage(): Storage | null {
  try {
    if (typeof window === "undefined") return null;
    return window.sessionStorage;
  } catch {
    return null;
  }
}

/**
 * Persist a play_intent so future CTA clicks can attribute back to it.
 * Idempotent — overwrites any prior play with the latest one (most recent
 * play wins, which matches how a listener would mentally credit a CTA).
 */
export function recordPodcastPlay(input: {
  episodeId: string;
  podcastId: string;
  postSlug?: string;
}): void {
  const store = safeSessionStorage();
  if (!store) return;
  const payload: StoredPlay = {
    episode_id: input.episodeId,
    podcast_id: input.podcastId,
    post_slug: input.postSlug ?? "",
    source_path:
      typeof window !== "undefined" ? window.location.pathname : "",
    occurred_at: new Date().toISOString(),
  };
  try {
    store.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    /* quota / privacy mode — silent */
  }
}

/**
 * Read the stored play (if any) and return it as a flat set of props ready
 * to merge into another event payload. Returns null when no play has been
 * recorded in this session.
 *
 * Exported as flat snake_case keys (rather than nested) because every sink
 * (GA4 dataLayer, Plausible props, our `analytics_events.props` jsonb) is
 * easier to query with flat keys.
 */
export function getPodcastAttribution(): PodcastAttribution | null {
  const store = safeSessionStorage();
  if (!store) return null;
  let raw: string | null = null;
  try {
    raw = store.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
  if (!raw) return null;
  let parsed: StoredPlay;
  try {
    parsed = JSON.parse(raw) as StoredPlay;
  } catch {
    return null;
  }
  if (!parsed?.episode_id) return null;
  const ageSeconds = Math.max(
    0,
    Math.round((Date.now() - new Date(parsed.occurred_at).getTime()) / 1000),
  );
  return {
    podcast_play_episode_id: parsed.episode_id,
    podcast_play_podcast_id: parsed.podcast_id,
    podcast_play_post_slug: parsed.post_slug,
    podcast_play_source_path: parsed.source_path,
    podcast_play_occurred_at: parsed.occurred_at,
    podcast_play_age_seconds: ageSeconds,
  };
}

/** Test-only: clear the stored play. */
export function _clearPodcastAttributionForTests(): void {
  const store = safeSessionStorage();
  try {
    store?.removeItem(STORAGE_KEY);
  } catch {
    /* noop */
  }
}
