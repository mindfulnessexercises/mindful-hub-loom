import { useState, useCallback, type KeyboardEvent } from "react";
import { Play } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import type { VideoProvider } from "@/lib/video-catalog";

/**
 * "Lite" video embed — renders a poster image with a play button and only
 * loads the heavy Vimeo / YouTube iframe (~600KB-1MB of JS) once the user
 * clicks. Drops 99% of the player's TTI cost on pages that embed many videos
 * (course playlists, the video archive) while keeping zero-JS-friendly fallback
 * markup (a plain <a> link to the original URL) for crawlers.
 *
 * Posters:
 *   - Vimeo  → vumbnail.com (free, no API key, returns 640x360 jpg)
 *   - YouTube → i.ytimg.com/vi/{id}/hqdefault.jpg
 *
 * Analytics:
 *   - `video_play_clicked` fires on first click (one per mount)
 *   - downstream play / pause / completion events come from the embedded
 *     player's own iframe and are intentionally NOT instrumented here —
 *     same-origin postMessage instrumentation lives in use-audio-tracking
 *     for audio; video-side equivalents would require Vimeo/YouTube SDKs
 *     that defeat the lite-embed's whole purpose.
 */
export interface LiteVideoEmbedProps {
  provider: VideoProvider;
  /** Vimeo numeric id or YouTube 11-char id. */
  id: string;
  /** Vimeo unlisted-video hash (h=...) — required for private vimeo links. */
  hash?: string;
  /** Required for accessible label + analytics attribution. */
  title: string;
  /** Stable section identifier for analytics ("course_sleep", "qa_archive"). */
  location: string;
  /** Optional duration string ("1:21:53") shown on the poster. */
  duration?: string;
  /** Override aspect ratio (default 16:9). */
  className?: string;
  /** Override the poster image (skips the provider thumbnail service). */
  posterOverride?: string;
}

function buildPoster(provider: VideoProvider, id: string): string {
  if (provider === "vimeo") return `https://vumbnail.com/${id}.jpg`;
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}

function buildIframeSrc(
  provider: VideoProvider,
  id: string,
  hash: string | undefined,
): string {
  if (provider === "vimeo") {
    // h= is required for unlisted videos. autoplay=1 because the user just clicked.
    const params = new URLSearchParams({
      autoplay: "1",
      title: "0",
      byline: "0",
      portrait: "0",
      dnt: "1",
    });
    if (hash) params.set("h", hash);
    return `https://player.vimeo.com/video/${id}?${params.toString()}`;
  }
  const params = new URLSearchParams({
    autoplay: "1",
    rel: "0",
    modestbranding: "1",
  });
  return `https://www.youtube-nocookie.com/embed/${id}?${params.toString()}`;
}

export function LiteVideoEmbed({
  provider,
  id,
  hash,
  title,
  location,
  duration,
  className,
  posterOverride,
}: LiteVideoEmbedProps) {
  const [active, setActive] = useState(false);

  const activate = useCallback(() => {
    if (active) return;
    setActive(true);
    trackEvent("video_play_clicked", {
      video_provider: provider,
      video_id: id,
      video_title: title,
      video_location: location,
    });
  }, [active, provider, id, title, location]);

  const onKey = useCallback(
    (e: KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        activate();
      }
    },
    [activate],
  );

  const poster = posterOverride ?? buildPoster(provider, id);

  return (
    <figure
      className={cn(
        "relative w-full overflow-hidden rounded-xl bg-muted shadow-card aspect-video not-prose",
        className,
      )}
    >
      {active ? (
        <iframe
          src={buildIframeSrc(provider, id, hash)}
          title={title}
          allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
          allowFullScreen
          loading="lazy"
          className="absolute inset-0 h-full w-full border-0"
        />
      ) : (
        <button
          type="button"
          onClick={activate}
          onKeyDown={onKey}
          aria-label={`Play video: ${title}`}
          className="group absolute inset-0 flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <img
            src={poster}
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            onError={(e) => {
              // Vimeo's vumbnail service occasionally 404s for very new uploads —
              // fall back to a soft-tinted placeholder so the play button still shows.
              (e.currentTarget as HTMLImageElement).style.visibility = "hidden";
            }}
          />
          <span
            className="absolute inset-0 bg-gradient-to-t from-foreground/55 via-foreground/5 to-transparent"
            aria-hidden="true"
          />
          <span
            className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-elevated transition-transform duration-300 group-hover:scale-110"
            aria-hidden="true"
          >
            <Play className="h-7 w-7 translate-x-[2px]" fill="currentColor" />
          </span>
          {duration && (
            <span className="absolute bottom-3 right-3 z-10 rounded-md bg-foreground/80 px-2 py-1 text-xs font-medium text-background">
              {duration}
            </span>
          )}
          <span className="absolute bottom-3 left-3 right-20 z-10 line-clamp-2 text-left font-serif text-sm font-semibold text-background drop-shadow">
            {title}
          </span>
        </button>
      )}
      {/* Crawler-friendly fallback link (hidden visually) */}
      <noscript>
        <a href={provider === "vimeo" ? `https://vimeo.com/${id}` : `https://youtu.be/${id}`}>
          {title}
        </a>
      </noscript>
    </figure>
  );
}
