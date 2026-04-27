import { Download, ExternalLink, Headphones } from "lucide-react";
import type { AudioPlaylist, PlaylistTrack } from "@/lib/audio-playlists";

interface AudioPlaylistBlockProps {
  playlist: AudioPlaylist;
  /**
   * Slug of the post hosting this playlist. Used to hide the
   * "Open original post" link on tracks that already live on this page.
   */
  hostSlug?: string;
}

/** Strip a leading slash from a slug for normalized comparison. */
function normalizeSlug(slug: string | undefined): string | undefined {
  if (!slug) return undefined;
  return slug.replace(/^\/+/, "").replace(/\/+$/, "");
}

/** Suggested filename when the user clicks Download. */
function downloadName(track: PlaylistTrack): string {
  try {
    const url = new URL(track.src);
    const last = url.pathname.split("/").filter(Boolean).pop();
    if (last) return decodeURIComponent(last);
  } catch {
    // ignore — fall through
  }
  return `${track.title.replace(/[^\w\-]+/g, "-").toLowerCase()}.mp3`;
}

/**
 * Single playlist block rendered above the WP HTML body for posts that
 * have a multi-part audio series (e.g. /meaningful-work-quotes). Uses
 * native <audio> controls — same UX language as the inline section
 * players, just stacked into a single card with track titles.
 *
 * Each track row offers three actions:
 *   1. Inline native <audio> player
 *   2. Download (.mp3) — direct file download
 *   3. Open original post — only when the track originates from a
 *      different WP slug than the host page
 */
export function AudioPlaylistBlock({ playlist, hostSlug }: AudioPlaylistBlockProps) {
  const host = normalizeSlug(hostSlug);

  return (
    <section
      aria-label={playlist.heading}
      className="mb-10 rounded-xl border border-border bg-[hsl(var(--section-alternate))] p-5 sm:p-6"
    >
      <p className="text-eyebrow text-primary mb-2 inline-flex items-center gap-1.5">
        <Headphones className="h-3.5 w-3.5" /> Guided meditation downloads
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
        {playlist.tracks.map((t, i) => {
          const trackSlug = normalizeSlug(t.postSlug);
          const showOpenPost = !!trackSlug && trackSlug !== host;
          return (
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
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <a
                  href={t.src}
                  download={downloadName(t)}
                  className="inline-flex min-h-[44px] items-center gap-1.5 rounded-md border border-border bg-background px-3 py-2 text-xs font-medium text-foreground/85 transition hover:bg-muted hover:text-foreground"
                  aria-label={`Download ${t.title} as MP3`}
                >
                  <Download className="h-3.5 w-3.5" aria-hidden />
                  Download MP3
                </a>
                {showOpenPost && (
                  <a
                    href={`/${trackSlug}`}
                    className="inline-flex min-h-[44px] items-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium text-primary transition hover:underline"
                    aria-label={`Open the original post for ${t.title}`}
                  >
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                    Open original post
                  </a>
                )}
              </div>
            </li>
          );
        })}
      </ol>

      <div className="mt-6 border-t border-border pt-5">
        <h3 className="text-eyebrow text-primary mb-3">
          About these downloads
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
              Each track is a short, self-contained guided meditation or
              reflection. You can listen straight through in order, or dip
              into a single track whenever you have a few minutes. Tap
              <strong> Download MP3</strong> to save any track for offline
              listening on your phone, in the car, or anywhere quiet.
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
              silences do as much work as the words. There's no right way —
              listening on a walk, before sleep, or alongside the written
              reflections below all work beautifully.
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
              Yes — listening and downloading are always free for personal
              practice. Use the <strong>Download MP3</strong> button on any
              track to keep a copy. You're also welcome to share the page
              link with anyone who might find it nourishing.
            </p>
          </details>
        </dl>
      </div>
    </section>
  );
}
