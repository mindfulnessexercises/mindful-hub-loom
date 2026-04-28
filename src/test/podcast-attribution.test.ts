import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  recordPodcastPlay,
  getPodcastAttribution,
  _clearPodcastAttributionForTests,
} from "@/lib/podcast-attribution";

describe("podcast-attribution", () => {
  beforeEach(() => {
    _clearPodcastAttributionForTests();
    // Reset the URL on each test so source_path is deterministic.
    window.history.replaceState({}, "", "/podcast-episodes/some-slug");
  });

  it("returns null when no play has been recorded", () => {
    expect(getPodcastAttribution()).toBeNull();
  });

  it("records a play and returns it as flat namespaced props", () => {
    recordPodcastPlay({
      episodeId: "18714235",
      podcastId: "2555881",
      postSlug: "gratitude-beyond-words",
    });
    const a = getPodcastAttribution();
    expect(a).toMatchObject({
      podcast_play_episode_id: "18714235",
      podcast_play_podcast_id: "2555881",
      podcast_play_post_slug: "gratitude-beyond-words",
      podcast_play_source_path: "/podcast-episodes/some-slug",
    });
    expect(typeof a?.podcast_play_occurred_at).toBe("string");
    expect(typeof a?.podcast_play_age_seconds).toBe("number");
    expect(a!.podcast_play_age_seconds).toBeGreaterThanOrEqual(0);
  });

  it("the most recent play overwrites earlier ones", () => {
    recordPodcastPlay({ episodeId: "1", podcastId: "p", postSlug: "a" });
    recordPodcastPlay({ episodeId: "2", podcastId: "p", postSlug: "b" });
    expect(getPodcastAttribution()?.podcast_play_episode_id).toBe("2");
    expect(getPodcastAttribution()?.podcast_play_post_slug).toBe("b");
  });

  it("computes age_seconds from occurred_at", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:00Z"));
    recordPodcastPlay({ episodeId: "x", podcastId: "p", postSlug: "s" });
    vi.setSystemTime(new Date("2026-01-01T00:02:30Z")); // +150s
    expect(getPodcastAttribution()?.podcast_play_age_seconds).toBe(150);
    vi.useRealTimers();
  });
});
