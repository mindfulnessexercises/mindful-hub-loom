// Lightweight theme inference for the audio registry.
//
// Themes are derived at read time from a track's title and the WP host
// slug it belongs to — no per-track curation required. The mapping is
// intentionally generous: a single track can carry several themes, so
// "Sensing Into Safety" surfaces under both Safety and Body.
//
// Used by:
//   - <AudioPlaylistBlock> for in-page filter chips
//   - /audio-library for cross-post browsing
//
// To tune a theme, edit its `match` keywords below. Order in
// `THEME_DEFINITIONS` controls chip order in the UI.

import type { AudioPlaylist, PlaylistTrack } from "@/lib/audio-playlists";

export interface ThemeDefinition {
  /** Stable id used in URL params + as the React key. */
  id: string;
  /** Human label shown on the chip. */
  label: string;
  /** Short tooltip / aria-description. */
  description: string;
  /**
   * Lowercase keywords or phrases. A track matches the theme if any
   * keyword appears in its lowercased "haystack" (title + host slug
   * + playlist heading).
   */
  match: string[];
}

/**
 * Curated theme list. Ordered by the breadth of the topic so the most
 * commonly useful chips appear first. Add new themes here — they will
 * appear automatically across both filter surfaces.
 */
export const THEME_DEFINITIONS: ThemeDefinition[] = [
  {
    id: "anxiety",
    label: "Anxiety",
    description: "Practices for soothing anxious thoughts and a tight chest.",
    match: ["anxiety", "anxious", "panic", "worry", "nervous", "calm-down"],
  },
  {
    id: "stress",
    label: "Stress",
    description: "Releasing tension, slowing the breath, softening the day.",
    match: ["stress", "tension", "overwhelm", "burnout", "pressure"],
  },
  {
    id: "sleep",
    label: "Sleep",
    description: "Bedtime, drifting off, and gentle nighttime practices.",
    match: ["sleep", "bedtime", "night", "rest", "good-night", "drift"],
  },
  {
    id: "self-compassion",
    label: "Self-Compassion",
    description: "Meeting yourself with the kindness you'd offer a friend.",
    match: [
      "self-compassion",
      "self compassion",
      "compassion",
      "self-kindness",
      "self-acceptance",
      "self-love",
      "rain",
    ],
  },
  {
    id: "loving-kindness",
    label: "Loving-Kindness",
    description: "Metta — wishing wellbeing for self and others.",
    match: [
      "loving-kindness",
      "loving kindness",
      "metta",
      "benefactor",
      "just like me",
      "tonglen",
    ],
  },
  {
    id: "gratitude",
    label: "Gratitude",
    description: "Noticing, naming, and resting in what's already good.",
    match: [
      "gratitude",
      "thankful",
      "appreciation",
      "appreciat",
      "gladness",
      "grateful",
    ],
  },
  {
    id: "happiness",
    label: "Happiness & Joy",
    description: "Cultivating joy, gladness, and small lifts of the heart.",
    match: [
      "happiness",
      "happy",
      "joy",
      "gladden",
      "delight",
      "ripples of happiness",
    ],
  },
  {
    id: "safety",
    label: "Safety & Belonging",
    description: "Trauma-sensitive practices for a steady nervous system.",
    match: [
      "safety",
      "safe place",
      "sensing into safety",
      "trauma",
      "belonging",
      "refuge",
      "ease & well-being",
      "ease and well-being",
      "wakeful relaxation",
    ],
  },
  {
    id: "shame",
    label: "Shame & Worth",
    description: "Working with shame, self-criticism, and a felt sense of worth.",
    match: [
      "shame",
      "self-worth",
      "worthiness",
      "inner critic",
      "self-conscious",
      "self conscious",
      "imperfect",
    ],
  },
  {
    id: "anger",
    label: "Anger & Difficult Emotions",
    description: "Meeting heat, frustration, and difficult feelings with care.",
    match: [
      "anger",
      "angry",
      "afflictive",
      "frustration",
      "irritation",
      "difficult",
      "hard feelings",
      "dullness and anger",
    ],
  },
  {
    id: "grief",
    label: "Grief & Loss",
    description: "Tender practices for sorrow, loss, and letting go.",
    match: ["grief", "loss", "letting go", "letting-go", "release", "mourning"],
  },
  {
    id: "forgiveness",
    label: "Forgiveness",
    description: "Releasing the weight of resentment — for self and others.",
    match: ["forgiveness", "forgiving", "forgive"],
  },
  {
    id: "body",
    label: "Body Care",
    description: "Body scans, embodied awareness, and tending to physical sensation.",
    match: [
      "body scan",
      "body-scan",
      "body appreciation",
      "tending to the body",
      "soft belly",
      "relaxing your body",
      "embodied",
      "welcome your body",
      "sensing into the heart",
      "five senses",
      "movement meditation",
      "walking meditation",
      "stomach",
      "belly",
    ],
  },
  {
    id: "breath",
    label: "Breath",
    description: "Mindful breathing — counting, soft belly, anapanasati.",
    match: [
      "breath",
      "breathing",
      "anapanasati",
      "soft belly",
      "exhale",
      "inhale",
      "deep abdominal",
    ],
  },
  {
    id: "presence",
    label: "Presence & Stillness",
    description: "Settling into the simple aliveness of right now.",
    match: [
      "presence",
      "stillness",
      "silence",
      "quiet",
      "settling",
      "arriving",
      "fresh start",
      "aliveness",
      "space between",
      "spacious",
    ],
  },
  {
    id: "acceptance",
    label: "Acceptance & Allowing",
    description: "Welcoming this moment, just as it is.",
    match: [
      "acceptance",
      "allow",
      "letting life be",
      "it's ok",
      "surrender",
      "equanimity",
    ],
  },
  {
    id: "focus",
    label: "Focus & Mind",
    description: "Working with thoughts, attention, and mental weather.",
    match: [
      "thoughts",
      "thinking",
      "rumination",
      "focus",
      "concentration",
      "attention",
      "mind appreciation",
      "soft receptive mind",
    ],
  },
  {
    id: "morning",
    label: "Morning",
    description: "Practices to begin the day grounded and open.",
    match: ["morning", "starting the day", "beginning the day", "wake"],
  },
  {
    id: "pregnancy",
    label: "Pregnancy & Motherhood",
    description: "Guided meditations for pregnancy, birth, and early motherhood.",
    match: [
      "pregnancy",
      "pregnant",
      "maternal",
      "mama",
      "baby",
      "labour",
      "labor",
      "delivery",
      "motherhood",
    ],
  },
  {
    id: "relationships",
    label: "Relationships",
    description: "Empathy, listening, and presence with others.",
    match: [
      "empathy",
      "listening",
      "speaking with",
      "partner",
      "relationship",
      "interconnect",
    ],
  },
  {
    id: "work",
    label: "Meaningful Work",
    description: "Purpose, vocation, and right livelihood at work.",
    match: ["meaningful work", "right livelihood", "vocation", "purpose", "leading with"],
  },
  {
    id: "self-care",
    label: "Self-Care",
    description: "Replenishing practices for tired, depleted days.",
    match: [
      "self-care",
      "self care",
      "energy booster",
      "filling your cup",
      "tending",
      "nourish",
      "replenish",
      "feeling supported",
    ],
  },
];

export interface TrackWithContext {
  track: PlaylistTrack;
  /** WP slug of the host playlist. */
  hostSlug: string;
  /** The host playlist heading — used for context in the library. */
  hostHeading: string;
  /** 1-indexed position within the host playlist. */
  index: number;
}

/** Build a normalized lowercase haystack we match keywords against. */
function buildHaystack(t: PlaylistTrack, hostSlug: string, hostHeading: string): string {
  return `${t.title}\n${hostHeading}\n${hostSlug}\n${t.postSlug ?? ""}`.toLowerCase();
}

/**
 * Compute the set of theme ids a single track belongs to.
 * Always returns a Set (possibly empty).
 */
export function inferTrackThemes(
  track: PlaylistTrack,
  hostSlug: string,
  hostHeading: string,
): Set<string> {
  const hay = buildHaystack(track, hostSlug, hostHeading);
  const ids = new Set<string>();
  for (const theme of THEME_DEFINITIONS) {
    for (const kw of theme.match) {
      if (hay.includes(kw)) {
        ids.add(theme.id);
        break;
      }
    }
  }
  return ids;
}

/**
 * Return only the themes that match at least one track in the given
 * playlist, in canonical order. Used to populate the in-playlist chip
 * row — chips that would match nothing are hidden.
 */
export function themesForPlaylist(
  playlist: AudioPlaylist,
  hostSlug: string,
): { theme: ThemeDefinition; count: number }[] {
  const counts = new Map<string, number>();
  for (const t of playlist.tracks) {
    const ids = inferTrackThemes(t, hostSlug, playlist.heading);
    for (const id of ids) counts.set(id, (counts.get(id) ?? 0) + 1);
  }
  return THEME_DEFINITIONS
    .filter((th) => counts.has(th.id))
    .map((theme) => ({ theme, count: counts.get(theme.id) ?? 0 }));
}

/**
 * Flatten the entire registry into per-track records, attach inferred
 * themes, and return both the flat list + the global theme counts. Used
 * by /audio-library.
 */
export function flattenRegistry(
  registry: Record<string, AudioPlaylist>,
): {
  tracks: (TrackWithContext & { themes: Set<string> })[];
  themeCounts: Map<string, number>;
} {
  const tracks: (TrackWithContext & { themes: Set<string> })[] = [];
  const themeCounts = new Map<string, number>();
  for (const [hostSlug, playlist] of Object.entries(registry)) {
    playlist.tracks.forEach((track, i) => {
      const themes = inferTrackThemes(track, hostSlug, playlist.heading);
      tracks.push({
        track,
        hostSlug,
        hostHeading: playlist.heading,
        index: i + 1,
        themes,
      });
      for (const id of themes) themeCounts.set(id, (themeCounts.get(id) ?? 0) + 1);
    });
  }
  return { tracks, themeCounts };
}

/** Look up a theme by id. */
export function getTheme(id: string): ThemeDefinition | undefined {
  return THEME_DEFINITIONS.find((t) => t.id === id);
}
