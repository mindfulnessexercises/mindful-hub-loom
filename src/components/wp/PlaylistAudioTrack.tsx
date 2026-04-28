import { useRef } from "react";
import { Clock, Download, ExternalLink } from "lucide-react";
import type { PlaylistTrack } from "@/lib/audio-playlists";
import { useAudioTracking } from "@/hooks/use-audio-tracking";
import { trackEvent } from "@/lib/analytics";

interface PlaylistAudioTrackProps {
  track: PlaylistTrack;
  /** 0-based index within the playlist; we display as 1-based. */
  index: number;
  /** Slug of the post hosting this playlist (for analytics + cross-link gating). */
  hostSlug: string | undefined;
  /** Slug of the original post the track came from, if different from host. */
  trackOriginSlug: string | undefined;
  /** Formatted duration label (e.g. "3:42"); null when unknown. */
  durationLabel: string | null;
  /** Suggested filename for the Download MP3 link. */
  downloadFilename: string;
  /** Called when the <audio> element reports its duration via loadedmetadata. */
  onDurationKnown: (seconds: number) => void;
}

/**
 * Single playable row inside an AudioPlaylistBlock. Pulled out into its own
 * component so each track gets:
 *   - Its own audio ref + `useAudioTracking()` instance (rules of hooks
 *     forbid dynamic hook calls from a parent .map()).
 *   - A clean attribution surface (`surface: "playlist_block"`) for the
 *     analytics_events table, separate from MeditationPlayer / PodcastPlayer.
 */
export function PlaylistAudioTrack({
  track,
  index,
  hostSlug,
  trackOriginSlug,
  durationLabel,
  downloadFilename,
  onDurationKnown,
}: PlaylistAudioTrackProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useAudioTracking(audioRef, {
    src: track.src,
    title: track.title,
    surface: "playlist_block",
    playlistSlug: hostSlug,
    position: index + 1,
  });

  const showOpenPost = !!trackOriginSlug && trackOriginSlug !== hostSlug;

  return (
    <li
      id={`track-${index + 1}`}
      className="rounded-lg border border-border bg-background p-4 scroll-mt-24"
    >
      <div className="mb-2 flex items-start gap-2 text-sm font-medium text-foreground/85">
        <span
          aria-hidden
          className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary mt-0.5"
        >
          {index + 1}
        </span>
        <span className="flex-1">{track.title}</span>
        {durationLabel && (
          <span
            className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-xs font-medium tabular-nums text-muted-foreground shrink-0"
            aria-label={`Duration ${durationLabel}`}
          >
            <Clock className="h-3 w-3" aria-hidden />
            {durationLabel}
          </span>
        )}
      </div>
      <audio
        ref={audioRef}
        controls
        preload="metadata"
        src={track.src}
        className="w-full"
        style={{ width: "100%" }}
        onLoadedMetadata={(e) => {
          const dur = (e.currentTarget as HTMLAudioElement).duration;
          if (Number.isFinite(dur) && dur > 0) onDurationKnown(dur);
        }}
      >
        Your browser does not support the audio element.{" "}
        <a href={track.src}>Download the audio file</a>.
      </audio>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <a
          href={track.src}
          download={downloadFilename}
          onClick={() =>
            trackEvent("audio_download_clicked", {
              src: track.src,
              title: track.title,
              surface: "playlist_block",
              playlist_slug: hostSlug,
              position: index + 1,
            })
          }
          className="inline-flex min-h-[44px] items-center gap-1.5 rounded-md border border-border bg-background px-3 py-2 text-xs font-medium text-foreground/85 transition hover:bg-muted hover:text-foreground"
          aria-label={`Download ${track.title} as MP3`}
        >
          <Download className="h-3.5 w-3.5" aria-hidden />
          Download MP3
        </a>
        {showOpenPost && (
          <a
            href={`/${trackOriginSlug}`}
            className="inline-flex min-h-[44px] items-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium text-primary transition hover:underline"
            aria-label={`Open the original post for ${track.title}`}
          >
            <ExternalLink className="h-3.5 w-3.5" aria-hidden />
            Open original post
          </a>
        )}
      </div>
    </li>
  );
}
