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

      <div className="mt-6 border-t border-border pt-5">
        <h3 className="text-eyebrow text-primary mb-3">
          About this audio series
        </h3>
        <dl className="space-y-3">
          <details className="group rounded-lg border border-border bg-background/60 p-4 min-h-[44px]">
            <summary className="cursor-pointer list-none text-sm font-medium text-foreground marker:hidden flex items-start justify-between gap-3">
              <span>How does this audio series work?</span>
              <span
                aria-hidden
                className="text-muted-foreground transition-transform group-open:rotate-45 text-lg leading-none"
              >
                +
              </span>
            </summary>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Each track is a short, self-contained reflection — a hand-picked
              collection of quotes read slowly, with quiet pauses to let the
              words land. You can listen straight through in order, or dip into
              a single part whenever you have a few minutes.
            </p>
          </details>

          <details className="group rounded-lg border border-border bg-background/60 p-4 min-h-[44px]">
            <summary className="cursor-pointer list-none text-sm font-medium text-foreground marker:hidden flex items-start justify-between gap-3">
              <span>Who is this for?</span>
              <span
                aria-hidden
                className="text-muted-foreground transition-transform group-open:rotate-45 text-lg leading-none"
              >
                +
              </span>
            </summary>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              For anyone who wants to slow down — beginners and longtime
              meditators alike. No prior practice is needed. Teachers, coaches,
              and therapists are also welcome to share these with clients and
              students as a gentle contemplative resource.
            </p>
          </details>

          <details className="group rounded-lg border border-border bg-background/60 p-4 min-h-[44px]">
            <summary className="cursor-pointer list-none text-sm font-medium text-foreground marker:hidden flex items-start justify-between gap-3">
              <span>How should I listen?</span>
              <span
                aria-hidden
                className="text-muted-foreground transition-transform group-open:rotate-45 text-lg leading-none"
              >
                +
              </span>
            </summary>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Find a quiet moment, use headphones if you can, and let the
              silences between quotes do as much work as the words. There's no
              right way — listening on a walk, before sleep, or alongside the
              written quotes below all work beautifully.
            </p>
          </details>

          <details className="group rounded-lg border border-border bg-background/60 p-4 min-h-[44px]">
            <summary className="cursor-pointer list-none text-sm font-medium text-foreground marker:hidden flex items-start justify-between gap-3">
              <span>Can I save or share these?</span>
              <span
                aria-hidden
                className="text-muted-foreground transition-transform group-open:rotate-45 text-lg leading-none"
              >
                +
              </span>
            </summary>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Yes — listening here is always free. You're welcome to share the
              page link with anyone who might find it nourishing.
            </p>
          </details>
        </dl>
      </div>
    </section>
  );
}
