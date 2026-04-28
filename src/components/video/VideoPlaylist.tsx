import { useState, useMemo } from "react";
import { Play, Clock } from "lucide-react";
import { LiteVideoEmbed } from "./LiteVideoEmbed";
import type { VideoEntry } from "@/lib/video-catalog";
import { cn } from "@/lib/utils";

/**
 * Video playlist UI — single hero player at top, scrollable episode list below.
 * Mirrors the AudioPlaylistBlock pattern so users moving between audio and
 * video courses get the same mental model.
 *
 * The hero player is a fresh <LiteVideoEmbed> per active video (key={index})
 * which deliberately UNMOUNTS the previous iframe — this stops the previous
 * video's audio when switching, with no need for postMessage glue.
 */
export interface VideoPlaylistProps {
  videos: readonly VideoEntry[];
  /** Stable analytics location ("course_sleep_meditations"). */
  location: string;
}

export function VideoPlaylist({ videos, location }: VideoPlaylistProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = videos[activeIndex];

  const totalDuration = useMemo(() => {
    // Sum HH:MM:SS strings, tolerating malformed sheet entries (e.g. "59:38:00"
    // when the source meant 59:38). We just count anything plausible.
    let totalSeconds = 0;
    for (const v of videos) {
      const parts = v.duration.split(":").map((p) => parseInt(p, 10));
      if (parts.some(Number.isNaN)) continue;
      // Reject obviously bad values (any segment >= 60 except the hour slot)
      if (parts.length === 3 && (parts[1] >= 60 || parts[2] >= 60)) continue;
      if (parts.length === 2 && parts[1] >= 60) continue;
      if (parts.length === 3) totalSeconds += parts[0] * 3600 + parts[1] * 60 + parts[2];
      else if (parts.length === 2) totalSeconds += parts[0] * 60 + parts[1];
    }
    if (!totalSeconds) return null;
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  }, [videos]);

  if (!active) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
      <div>
        <LiteVideoEmbed
          // key forces a fresh iframe mount on switch so the prior video stops
          key={`${active.provider}-${active.id}-${activeIndex}`}
          provider={active.provider}
          id={active.id}
          hash={active.hash}
          title={active.title}
          duration={active.duration}
          location={`${location}_player`}
        />
        <div className="mt-4">
          <h3 className="font-serif text-xl font-semibold text-foreground leading-snug">
            {active.title}
          </h3>
          {active.duration && (
            <p className="mt-1 inline-flex items-center gap-1.5 text-caption text-muted-foreground">
              <Clock className="h-3 w-3" aria-hidden="true" />
              {active.duration}
            </p>
          )}
        </div>
      </div>

      <aside className="rounded-xl border border-border bg-card overflow-hidden flex flex-col">
        <div className="px-4 py-3 border-b border-border bg-muted/30">
          <p className="text-eyebrow text-muted-foreground">In this collection</p>
          <p className="text-body-sm font-semibold text-foreground mt-0.5">
            {videos.length} videos{totalDuration ? ` · ${totalDuration} total` : ""}
          </p>
        </div>
        <ol
          className="overflow-y-auto max-h-[28rem] lg:max-h-[34rem] divide-y divide-border"
          aria-label="Video playlist"
        >
          {videos.map((v, i) => {
            const isActive = i === activeIndex;
            return (
              <li key={`${v.provider}-${v.id}-${i}`}>
                <button
                  type="button"
                  onClick={() => setActiveIndex(i)}
                  aria-current={isActive ? "true" : undefined}
                  className={cn(
                    "w-full text-left px-4 py-3 min-h-[44px] flex items-start gap-3 transition-colors",
                    isActive
                      ? "bg-primary/5"
                      : "hover:bg-muted/40 focus-visible:bg-muted/40",
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5 h-7 w-7 shrink-0 rounded-full flex items-center justify-center text-xs font-semibold",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground",
                    )}
                    aria-hidden="true"
                  >
                    {isActive ? <Play className="h-3 w-3" fill="currentColor" /> : i + 1}
                  </span>
                  <span className="flex-1 min-w-0">
                    <span
                      className={cn(
                        "block text-body-sm leading-snug line-clamp-2",
                        isActive ? "font-semibold text-foreground" : "text-foreground/85",
                      )}
                    >
                      {v.title}
                    </span>
                    {v.duration && (
                      <span className="mt-0.5 block text-caption text-muted-foreground">
                        {v.duration}
                      </span>
                    )}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </aside>
    </div>
  );
}
