import { Headphones } from "lucide-react";
import type { AudioPlaylist } from "@/lib/audio-playlists";

interface AudioPlaylistBlockProps {
  playlist: AudioPlaylist;
}

/**
 * Single playlist block rendered above the WP HTML body for posts that
 * have a multi-part audio series (e.g. /meaningful-work-quotes). Uses
 * native <audio> controls — same UX language as the inline section
 * players, just stacked into a single card with track titles.
 */
export function AudioPlaylistBlock({ playlist }: AudioPlaylistBlockProps) {
  return (
    <section
      aria-label={playlist.heading}
      className="mb-10 rounded-xl border border-border bg-[hsl(var(--section-alternate))] p-5 sm:p-6"
    >
      <p className="text-eyebrow text-primary mb-2 inline-flex items-center gap-1.5">
        <Headphones className="h-3.5 w-3.5" /> Audio series
      </p>
      <h2 className="text-card-heading text-foreground mb-2 font-serif">
        {playlist.heading}
      </h2>
      {playlist.intro && (
        <p className="text-body text-muted-foreground mb-5 max-w-2xl">
          {playlist.intro}
        </p>
      )}
      <ol className="space-y-4">
        {playlist.tracks.map((t, i) => (
          <li
            key={t.src}
            className="rounded-lg border border-border bg-background p-4"
          >
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground/85">
              <span
                aria-hidden
                className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary"
              >
                {i + 1}
              </span>
              {t.title}
            </div>
            <audio
              controls
              preload="none"
              src={t.src}
              className="w-full"
              style={{ width: "100%" }}
            >
              Your browser does not support the audio element.{" "}
              <a href={t.src}>Download the audio file</a>.
            </audio>
          </li>
        ))}
      </ol>
    </section>
  );
}
