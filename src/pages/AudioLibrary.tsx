import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Clock,
  Download,
  Headphones,
  ListMusic,
  Search as SearchIcon,
  Tag,
  X,
} from "lucide-react";

import { Navbar } from "@/components/homepage/Navbar";
import { Footer } from "@/components/homepage/Footer";
import { WPSeo } from "@/components/wp/WPSeo";
import { AUDIO_PLAYLISTS } from "@/lib/audio-playlists";
import {
  THEME_DEFINITIONS,
  flattenRegistry,
  getTheme,
} from "@/lib/audio-themes";

/** Format seconds → "M:SS" or "H:MM:SS". Returns null when unknown. */
function formatDuration(seconds: number | undefined): string | null {
  if (!seconds || !Number.isFinite(seconds) || seconds <= 0) return null;
  const total = Math.round(seconds);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  if (h > 0)
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

/** Suggested filename when the user clicks Download. */
function downloadName(title: string, src: string): string {
  try {
    const url = new URL(src);
    const last = url.pathname.split("/").filter(Boolean).pop();
    if (last) return decodeURIComponent(last);
  } catch {
    // ignore — fall through
  }
  return `${title.replace(/[^\w\-]+/g, "-").toLowerCase()}.mp3`;
}

/**
 * Themed browse page across the entire audio registry.
 *
 * Pulls every track from `AUDIO_PLAYLISTS`, infers themes via
 * `audio-themes.ts`, and lets visitors filter by one or more themes
 * + a free-text search. Selected themes are reflected in the URL
 * (`?theme=safety,gratitude&q=…`) so views are shareable and
 * indexable.
 *
 * Results de-duplicate on `track.src` so a meditation that lives on
 * three pregnancy posts only appears once, with a small "also on"
 * pill linking to the alternate hosts.
 */
export default function AudioLibrary() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Flatten the registry once. Tens of playlists / hundreds of tracks
  // — well within "compute on every navigation" range.
  const flat = useMemo(() => flattenRegistry(AUDIO_PLAYLISTS), []);

  // De-duplicate on src and aggregate the host slugs each track lives on.
  const uniqueTracks = useMemo(() => {
    const map = new Map<
      string,
      {
        src: string;
        title: string;
        themes: Set<string>;
        primaryHostSlug: string;
        primaryHostHeading: string;
        alsoOn: { hostSlug: string; hostHeading: string }[];
      }
    >();
    for (const t of flat.tracks) {
      const existing = map.get(t.track.src);
      if (existing) {
        // Merge themes + alternate hosts; keep the first-encountered
        // host as the canonical "primary" link target.
        for (const id of t.themes) existing.themes.add(id);
        if (
          existing.primaryHostSlug !== t.hostSlug &&
          !existing.alsoOn.some((a) => a.hostSlug === t.hostSlug)
        ) {
          existing.alsoOn.push({
            hostSlug: t.hostSlug,
            hostHeading: t.hostHeading,
          });
        }
        continue;
      }
      map.set(t.track.src, {
        src: t.track.src,
        title: t.track.title,
        themes: new Set(t.themes),
        primaryHostSlug: t.hostSlug,
        primaryHostHeading: t.hostHeading,
        alsoOn: [],
      });
    }
    return Array.from(map.values());
  }, [flat]);

  // Recompute global theme counts on the de-duplicated set so the
  // numbers on the chips reflect what visitors will actually see.
  const themeCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const t of uniqueTracks) {
      for (const id of t.themes) counts.set(id, (counts.get(id) ?? 0) + 1);
    }
    return counts;
  }, [uniqueTracks]);

  // URL-driven filter state.
  const activeThemes = useMemo(() => {
    const raw = searchParams.get("theme") ?? "";
    return new Set(
      raw
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    );
  }, [searchParams]);
  const query = (searchParams.get("q") ?? "").trim();
  const [searchInput, setSearchInput] = useState(query);

  useEffect(() => {
    setSearchInput(query);
  }, [query]);

  const updateThemes = (next: Set<string>) => {
    const params = new URLSearchParams(searchParams);
    if (next.size === 0) params.delete("theme");
    else params.set("theme", Array.from(next).join(","));
    setSearchParams(params, { replace: false });
  };
  const toggleTheme = (id: string) => {
    const next = new Set(activeThemes);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    updateThemes(next);
  };
  const clearThemes = () => updateThemes(new Set());

  const submitSearch = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value.trim()) params.set("q", value.trim());
    else params.delete("q");
    setSearchParams(params, { replace: false });
  };

  // Apply filters: tracks must (a) carry every selected theme (AND
  // semantics across chips on the library — narrows quickly across
  // hundreds of tracks), and (b) match the search query if present.
  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return uniqueTracks.filter((t) => {
      if (activeThemes.size > 0) {
        for (const id of activeThemes) {
          if (!t.themes.has(id)) return false;
        }
      }
      if (q) {
        const hay =
          `${t.title}\n${t.primaryHostHeading}\n${t.primaryHostSlug}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [uniqueTracks, activeThemes, query]);

  // Sort filtered results alphabetically by title for a calm,
  // browsable feel (vs. arbitrary insertion order).
  const sorted = useMemo(
    () => [...filtered].sort((a, b) => a.title.localeCompare(b.title)),
    [filtered],
  );

  const totalTracks = uniqueTracks.length;
  const playlistCount = Object.keys(AUDIO_PLAYLISTS).length;

  // Per-track durations populated as <audio> metadata loads.
  const [durations, setDurations] = useState<Record<string, number>>({});

  return (
    <div className="min-h-screen bg-background">
      <WPSeo
        title="Audio Library — Guided Meditations by Theme | Mindfulness Exercises"
        description={`Browse ${totalTracks} guided meditations and dharma talks by theme — anxiety, sleep, self-compassion, gratitude, safety, body care, and more. Listen, download, and share.`}
        canonical="https://mindfulnessexercises.com/audio-library"
        type="website"
      />

      <Navbar />

      <main>
        <header className="border-b border-border bg-[hsl(var(--section-alternate))]">
          <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
            <p className="text-eyebrow text-primary mb-3 inline-flex items-center gap-1.5">
              <Headphones className="h-3.5 w-3.5" /> Audio Library
            </p>
            <h1 className="text-display-md font-serif text-foreground mb-4">
              Guided Meditations by Theme
            </h1>
            <p className="text-body-lg text-muted-foreground max-w-2xl">
              {totalTracks.toLocaleString()} guided meditations, dharma talks,
              and reflection tracks across {playlistCount} playlists — filter
              by what you need today, listen in your browser, or download for
              offline practice.
            </p>
          </div>
        </header>

        <section
          aria-label="Filter audio library"
          className="border-b border-border bg-background"
        >
          <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
            {/* Search */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submitSearch(searchInput);
              }}
              className="mb-5 flex items-center gap-2"
              role="search"
            >
              <label htmlFor="audio-search" className="sr-only">
                Search audio titles and topics
              </label>
              <div className="relative flex-1">
                <SearchIcon
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden
                />
                <input
                  id="audio-search"
                  type="search"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search by title or topic — e.g. RAIN, body scan, soft belly"
                  className="w-full min-h-[44px] rounded-md border border-border bg-background pl-9 pr-9 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                />
                {searchInput && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchInput("");
                      submitSearch("");
                    }}
                    aria-label="Clear search"
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <button
                type="submit"
                className="inline-flex min-h-[44px] items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
              >
                Search
              </button>
            </form>

            {/* Theme chip cloud */}
            <div>
              <p className="text-eyebrow text-muted-foreground mb-2 inline-flex items-center gap-1.5">
                <Tag className="h-3 w-3" aria-hidden />
                Browse by theme
              </p>
              <div className="flex flex-wrap items-center gap-2">
                {THEME_DEFINITIONS.filter((t) => themeCounts.has(t.id)).map(
                  (theme) => {
                    const active = activeThemes.has(theme.id);
                    const count = themeCounts.get(theme.id) ?? 0;
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
                  },
                )}
                {(activeThemes.size > 0 || query) && (
                  <button
                    type="button"
                    onClick={() => {
                      clearThemes();
                      setSearchInput("");
                      submitSearch("");
                    }}
                    className="inline-flex min-h-[44px] items-center rounded-full px-3 py-1.5 text-xs font-medium text-primary transition hover:underline"
                  >
                    Reset all filters
                  </button>
                )}
              </div>
            </div>

            {/* Active filter summary (also a screen-reader live region). */}
            <p
              className="mt-4 text-sm text-muted-foreground"
              aria-live="polite"
            >
              Showing <strong className="text-foreground">{sorted.length}</strong>{" "}
              of {totalTracks} tracks
              {activeThemes.size > 0 && (
                <>
                  {" "}
                  matching{" "}
                  {Array.from(activeThemes)
                    .map((id) => getTheme(id)?.label ?? id)
                    .join(" + ")}
                </>
              )}
              {query && (
                <>
                  {" "}
                  for "<span className="text-foreground">{query}</span>"
                </>
              )}
              .
            </p>
          </div>
        </section>

        <section
          aria-label="Audio results"
          className="mx-auto max-w-5xl px-4 py-10 sm:px-6"
        >
          {sorted.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-[hsl(var(--section-alternate))] p-12 text-center">
              <h2 className="text-card-heading font-serif text-foreground mb-2">
                No tracks match your filters
              </h2>
              <p className="text-body text-muted-foreground mb-5">
                Try removing a theme or clearing your search to see more
                guided meditations.
              </p>
              <button
                type="button"
                onClick={() => {
                  clearThemes();
                  setSearchInput("");
                  submitSearch("");
                }}
                className="inline-flex min-h-[44px] items-center rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground/85 transition hover:bg-muted"
              >
                Reset all filters
              </button>
            </div>
          ) : (
            <ol className="space-y-4">
              {sorted.map((t) => {
                const trackThemes = THEME_DEFINITIONS.filter((th) =>
                  t.themes.has(th.id),
                );
                const d = formatDuration(durations[t.src]);
                return (
                  <li
                    key={t.src}
                    className="rounded-lg border border-border bg-background p-4 sm:p-5"
                  >
                    <div className="mb-2 flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <h2 className="text-base font-medium text-foreground/90 leading-snug">
                          {t.title}
                        </h2>
                        <p className="mt-1 text-xs text-muted-foreground">
                          From{" "}
                          <Link
                            to={`/${t.primaryHostSlug}`}
                            className="text-primary hover:underline"
                          >
                            {t.primaryHostHeading.replace(/^Listen:?\s*/i, "")}
                          </Link>
                          {t.alsoOn.length > 0 && (
                            <>
                              {" · also on "}
                              {t.alsoOn.map((alt, i) => (
                                <span key={alt.hostSlug}>
                                  <Link
                                    to={`/${alt.hostSlug}`}
                                    className="text-primary hover:underline"
                                  >
                                    {alt.hostHeading.replace(
                                      /^Listen:?\s*/i,
                                      "",
                                    )}
                                  </Link>
                                  {i < t.alsoOn.length - 1 && ", "}
                                </span>
                              ))}
                            </>
                          )}
                        </p>
                      </div>
                      {d && (
                        <span
                          className="inline-flex shrink-0 items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-xs font-medium tabular-nums text-muted-foreground"
                          aria-label={`Duration ${d}`}
                        >
                          <Clock className="h-3 w-3" aria-hidden />
                          {d}
                        </span>
                      )}
                    </div>

                    {trackThemes.length > 0 && (
                      <div className="mb-2.5 flex flex-wrap gap-1.5">
                        {trackThemes.map((th) => (
                          <button
                            key={th.id}
                            type="button"
                            onClick={() => toggleTheme(th.id)}
                            className={`text-[10px] uppercase tracking-wide rounded-full border px-2 py-0.5 transition ${
                              activeThemes.has(th.id)
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
                            }`}
                            title={`Filter by ${th.label}`}
                          >
                            {th.label}
                          </button>
                        ))}
                      </div>
                    )}

                    <audio
                      controls
                      preload="metadata"
                      src={t.src}
                      className="w-full"
                      style={{ width: "100%" }}
                      onLoadedMetadata={(e) => {
                        const dur = (e.currentTarget as HTMLAudioElement)
                          .duration;
                        if (Number.isFinite(dur) && dur > 0) {
                          setDurations((prev) =>
                            prev[t.src] === dur
                              ? prev
                              : { ...prev, [t.src]: dur },
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
                        download={downloadName(t.title, t.src)}
                        className="inline-flex min-h-[44px] items-center gap-1.5 rounded-md border border-border bg-background px-3 py-2 text-xs font-medium text-foreground/85 transition hover:bg-muted hover:text-foreground"
                        aria-label={`Download ${t.title} as MP3`}
                      >
                        <Download className="h-3.5 w-3.5" aria-hidden />
                        Download MP3
                      </a>
                      <Link
                        to={`/${t.primaryHostSlug}`}
                        className="inline-flex min-h-[44px] items-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium text-primary transition hover:underline"
                      >
                        <ListMusic className="h-3.5 w-3.5" aria-hidden />
                        View full playlist
                      </Link>
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
