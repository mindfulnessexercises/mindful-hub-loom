import { useEffect, useRef, type RefObject } from "react";
import { trackEvent } from "@/lib/analytics";

/**
 * Audio engagement tracking hook.
 *
 * Fires three event names per `<audio>` element:
 *   - `audio_started`     — once, on first successful play of this src
 *   - `audio_completed`   — once, when playback crosses 90% of duration OR
 *                           the `ended` event fires (whichever comes first)
 *   - (optional internal) — silently no-ops if the element never reports a
 *                           valid duration; we never throw.
 *
 * Why 90% (not 100%)?
 *   Industry-standard "completion" threshold. Most listeners scrub past the
 *   final outro; counting only `ended` undercounts genuine completions by
 *   ~15-25%. We still treat `ended` as a completion in case the track is
 *   too short for the timeupdate sampler to land in the 90-100% window.
 *
 * De-duplication:
 *   `audio_started` and `audio_completed` each fire AT MOST ONCE per
 *   `(audioRef.current, src)` mount. Pause/resume does not re-fire start.
 *   Refreshing the page or unmounting/remounting the player resets the
 *   ref, so a fresh session can start a new event pair — that is the
 *   desired behavior for a session-based metric.
 *
 * Usage:
 *   const audioRef = useRef<HTMLAudioElement | null>(null);
 *   useAudioTracking(audioRef, {
 *     src: track.src,
 *     title: track.title,
 *     surface: "playlist_block",
 *     playlistSlug: hostSlug,
 *     position: i + 1,
 *   });
 *   return <audio ref={audioRef} src={track.src} controls />;
 */

export interface AudioTrackingProps {
  /** Audio file URL — used to dedupe event firing across pause/resume. */
  src: string;
  /** Human-readable track title for downstream analysis. */
  title?: string;
  /** Where the player lives, e.g. "playlist_block" | "meditation_player" | "podcast_player". */
  surface: string;
  /** Slug of the post hosting the player (for attribution). */
  playlistSlug?: string;
  /** 1-based position within a playlist, when applicable. */
  position?: number;
  /** Stable id for the meditation/episode/track when one exists. */
  contentId?: string | number;
}

const COMPLETION_THRESHOLD = 0.9;

export function useAudioTracking(
  audioRef: RefObject<HTMLAudioElement | null>,
  props: AudioTrackingProps,
): void {
  // Track which src has already fired which event — keyed by src so swapping
  // the audio source within the same player resets the dedupe.
  const startedFor = useRef<string | null>(null);
  const completedFor = useRef<string | null>(null);

  // Capture latest props in a ref so the effect's cleanup/handlers always
  // see the current values without re-binding listeners on every render.
  const propsRef = useRef(props);
  propsRef.current = props;

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;

    const baseProps = () => {
      const p = propsRef.current;
      return {
        src: p.src,
        title: p.title,
        surface: p.surface,
        playlist_slug: p.playlistSlug,
        position: p.position,
        content_id: p.contentId,
      };
    };

    const onPlay = () => {
      const p = propsRef.current;
      if (startedFor.current === p.src) return;
      startedFor.current = p.src;
      trackEvent("audio_started", baseProps());
    };

    const onTimeUpdate = () => {
      const p = propsRef.current;
      if (completedFor.current === p.src) return;
      const dur = a.duration;
      if (!Number.isFinite(dur) || dur <= 0) return;
      // Only mark complete on >=90% played; ignore tiny tracks where the
      // sampler may already be past 90% on the first tick.
      if (a.currentTime / dur < COMPLETION_THRESHOLD) return;
      completedFor.current = p.src;
      trackEvent("audio_completed", {
        ...baseProps(),
        duration_seconds: Math.round(dur),
        completion_trigger: "threshold_90",
      });
    };

    const onEnded = () => {
      const p = propsRef.current;
      if (completedFor.current === p.src) return;
      completedFor.current = p.src;
      const dur = Number.isFinite(a.duration) && a.duration > 0 ? Math.round(a.duration) : undefined;
      trackEvent("audio_completed", {
        ...baseProps(),
        duration_seconds: dur,
        completion_trigger: "ended",
      });
    };

    a.addEventListener("play", onPlay);
    a.addEventListener("timeupdate", onTimeUpdate);
    a.addEventListener("ended", onEnded);
    return () => {
      a.removeEventListener("play", onPlay);
      a.removeEventListener("timeupdate", onTimeUpdate);
      a.removeEventListener("ended", onEnded);
    };
    // We intentionally re-bind only on element change; props are read via ref.
  }, [audioRef]);

  // When the src changes for the same element, reset dedupe so the next
  // play of the new file fires a fresh start/complete pair.
  useEffect(() => {
    startedFor.current = null;
    completedFor.current = null;
  }, [props.src]);
}
