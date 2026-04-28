import { useEffect, useMemo, useRef, useState } from "react";
import { Clock, Download, ExternalLink, Headphones, ListMusic, Tag } from "lucide-react";
import type { AudioPlaylist, PlaylistTrack } from "@/lib/audio-playlists";
import {
  inferTrackThemes,
  themesForPlaylist,
} from "@/lib/audio-themes";

interface AudioPlaylistBlockProps {
  playlist: AudioPlaylist;
  /**
   * Slug of the post hosting this playlist. Used to hide the
   * "Open original post" link on tracks that already live on this page.
   */
  hostSlug?: string;
}

/** Strip a leading/trailing slash from a slug for normalized comparison. */
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

/** Format seconds → "M:SS" or "H:MM:SS". */
function formatDuration(seconds: number | undefined): string | null {
  if (!seconds || !Number.isFinite(seconds) || seconds <= 0) return null;
  const total = Math.round(seconds);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
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
 *
 * Multi-track playlists also display a "Series" badge, a track count,
 * and a running total duration that fills in as each file's metadata
 * loads.
 */
export function AudioPlaylistBlock({ playlist, hostSlug }: AudioPlaylistBlockProps) {
  const host = normalizeSlug(hostSlug);
  const isSeries = playlist.tracks.length > 1;

  // Per-track durations, keyed by track index. Populated as each
  // <audio> element fires loadedmetadata.
  const [durations, setDurations] = useState<Record<number, number>>({});

  // Reset when the playlist itself changes (slug navigation).
  const playlistKey = useMemo(
    () => playlist.tracks.map((t) => t.src).join("|"),
    [playlist.tracks],
  );
  const lastKeyRef = useRef(playlistKey);
  useEffect(() => {
    if (lastKeyRef.current !== playlistKey) {
      lastKeyRef.current = playlistKey;
      setDurations({});
    }
  }, [playlistKey]);

  const knownCount = Object.keys(durations).length;
  const totalSeconds = Object.values(durations).reduce((a, b) => a + b, 0);
  const totalLabel = formatDuration(totalSeconds);
  const allKnown = knownCount === playlist.tracks.length;

  // Theme filter state — narrows the visible tracks within this single
  // playlist. Resets when the playlist changes.
  const [activeThemes, setActiveThemes] = useState<Set<string>>(new Set());
  useEffect(() => {
    setActiveThemes(new Set());
  }, [playlistKey]);

  // Themes that have at least one matching track in this playlist.
  const availableThemes = useMemo(
    () => themesForPlaylist(playlist, hostSlug ?? ""),
    [playlist, hostSlug],
  );

  // Per-track theme sets (so we can match against the active filter
  // without recomputing for each track on every render).
  const trackThemes = useMemo(
    () =>
      playlist.tracks.map((t) =>
        inferTrackThemes(t, hostSlug ?? "", playlist.heading),
      ),
    [playlist, hostSlug],
  );

  // Tracks that pass the active theme filter (OR-match: a track shows
  // if it carries ANY of the selected themes). When no theme is
  // active, every track is shown.
  const visibleIndexes = useMemo(() => {
    if (activeThemes.size === 0) return playlist.tracks.map((_, i) => i);
    return playlist.tracks
      .map((_, i) => i)
      .filter((i) => {
        const themes = trackThemes[i];
        for (const id of activeThemes) if (themes.has(id)) return true;
        return false;
      });
  }, [activeThemes, playlist.tracks, trackThemes]);

  const toggleTheme = (id: string) => {
    setActiveThemes((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };
  const clearThemes = () => setActiveThemes(new Set());

  return (
    <section
      aria-label={playlist.heading}
      className="mb-10 rounded-xl border border-border bg-[hsl(var(--section-alternate))] p-5 sm:p-6"
    >
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <p className="text-eyebrow text-primary inline-flex items-center gap-1.5">
          <Headphones className="h-3.5 w-3.5" /> Guided meditation downloads
        </p>
        {isSeries && (
          <span
            className="text-eyebrow inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-primary"
            aria-label={`Series of ${playlist.tracks.length} tracks`}
          >
            <ListMusic className="h-3 w-3" aria-hidden /> Series
          </span>
        )}
      </div>

      <h2 className="text-card-heading text-foreground mb-2 font-serif">
        {playlist.heading}
      </h2>

      {playlist.intro && (
        <p className="text-body text-muted-foreground mb-4 max-w-2xl">
          {playlist.intro}
        </p>
      )}

      {isSeries && (
        <div className="mb-5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <ListMusic className="h-3.5 w-3.5" aria-hidden />
            {playlist.tracks.length} tracks
          </span>
          {totalLabel && (
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" aria-hidden />
              {allKnown ? totalLabel : `~${totalLabel}+`} total
            </span>
          )}
        </div>
      )}

      {/* Theme filter chips — only shown when the playlist has at least
          two themes worth filtering by. Single-theme playlists hide the
          row to avoid noise. */}
      {availableThemes.length >= 2 && (
        <div className="mb-5">
          <p className="text-eyebrow text-muted-foreground mb-2 inline-flex items-center gap-1.5">
            <Tag className="h-3 w-3" aria-hidden />
            Browse by theme
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {availableThemes.map(({ theme, count }) => {
              const active = activeThemes.has(theme.id);
              return (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => toggleTheme(theme.id)}
                  aria-pressed={active}
                  title={theme.description}
                  className={`inline-flex min-h-[44px] items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                    active
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background text-foreground/80 hover:border-primary/40 hover:text-foreground"
                  }`}
                >
                  {theme.label}
                  <span
                    className={`tabular-nums text-[10px] ${
                      active ? "opacity-90" : "text-muted-foreground"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
            {activeThemes.size > 0 && (
              <button
                type="button"
                onClick={clearThemes}
                className="inline-flex min-h-[44px] items-center rounded-full px-3 py-1.5 text-xs font-medium text-primary transition hover:underline"
              >
                Clear
              </button>
            )}
          </div>
          {activeThemes.size > 0 && (
            <p className="mt-2 text-xs text-muted-foreground">
              Showing {visibleIndexes.length} of {playlist.tracks.length} tracks
            </p>
          )}
        </div>
      )}

      {/* Compact tracklist summary so visitors can scan before playing. */}
      {isSeries && (
        <details className="group mb-5 rounded-lg border border-border bg-background/60 p-4">
          <summary className="cursor-pointer list-none text-sm font-medium text-foreground marker:hidden flex items-center justify-between gap-3 min-h-[44px]">
            <span className="inline-flex items-center gap-2">
              <ListMusic className="h-4 w-4 text-primary" aria-hidden />
              Tracklist
            </span>
            <span
              aria-hidden
              className="text-muted-foreground transition-transform group-open:rotate-45 text-lg leading-none"
            >
              +
            </span>
          </summary>
          <ol className="mt-3 space-y-1.5 text-sm text-muted-foreground">
            {playlist.tracks.map((t, i) => {
              const d = formatDuration(durations[i]);
              return (
                <li key={`toc-${t.src}`} className="flex items-baseline gap-2">
                  <span className="text-primary/70 tabular-nums w-6 shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <a
                    href={`#track-${i + 1}`}
                    className="flex-1 hover:text-foreground hover:underline"
                  >
                    {t.title}
                  </a>
                  {d && (
                    <span className="text-xs text-muted-foreground/80 tabular-nums shrink-0">
                      {d}
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        </details>
      )}

      {visibleIndexes.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-background/60 p-6 text-center">
          <p className="text-sm text-muted-foreground">
            No tracks match the selected themes on this page.
          </p>
          <button
            type="button"
            onClick={clearThemes}
            className="mt-3 inline-flex min-h-[44px] items-center rounded-md border border-border bg-background px-3 py-2 text-xs font-medium text-foreground/85 transition hover:bg-muted"
          >
            Clear theme filters
          </button>
        </div>
      ) : (
      <ol className="space-y-4">
        {visibleIndexes.map((i) => {
          const t = playlist.tracks[i];
          const trackSlug = normalizeSlug(t.postSlug);
          const showOpenPost = !!trackSlug && trackSlug !== host;
          const d = formatDuration(durations[i]);
          return (
            <li
              key={t.src}
              id={`track-${i + 1}`}
              className="rounded-lg border border-border bg-background p-4 scroll-mt-24"
            >
              <div className="mb-2 flex items-start gap-2 text-sm font-medium text-foreground/85">
                <span
                  aria-hidden
                  className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary mt-0.5"
                >
                  {i + 1}
                </span>
                <span className="flex-1">{t.title}</span>
                {d && (
                  <span
                    className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-xs font-medium tabular-nums text-muted-foreground shrink-0"
                    aria-label={`Duration ${d}`}
                  >
                    <Clock className="h-3 w-3" aria-hidden />
                    {d}
                  </span>
                )}
              </div>
              <audio
                controls
                preload="metadata"
                src={t.src}
                className="w-full"
                style={{ width: "100%" }}
                onLoadedMetadata={(e) => {
                  const dur = (e.currentTarget as HTMLAudioElement).duration;
                  if (Number.isFinite(dur) && dur > 0) {
                    setDurations((prev) =>
                      prev[i] === dur ? prev : { ...prev, [i]: dur },
                    );
                  }
                }}
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
      )}

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
