// Extracts presentational metadata from a track title string so the UI
// can show structured Speaker / Type / Source chips instead of forcing
// the visitor to parse a long single-line title.
//
// Track titles in audio-playlists.ts follow a loose convention:
//   "<Clean Title> — <Type> by <Teacher>"
//
// Examples:
//   "Meeting Meditation (3 Minutes) — Guided Meditation by Sean Fargo"
//   "Leading With Purpose — Guided Meditation by Sean Fargo"
//   "Part 1: Karma"                       (no type / teacher)
//
// The default voice is Sean Fargo (per content/audio-attribution memory),
// so when a track has a clear type but no explicit "by …" we still
// surface him as the speaker.

export interface TrackMetadata {
  /** Short, clean display title with the trailing " — Type by Teacher" stripped. */
  cleanTitle: string;
  /** e.g. "Guided Meditation", "Talk", "Q&A". Undefined when the title carries no type. */
  type?: string;
  /** Teacher / speaker name. Defaults to "Sean Fargo" when type is present. */
  speaker?: string;
}

const DEFAULT_SPEAKER = "Sean Fargo";

// Match: "<title> — <type> by <teacher>"   (em dash or hyphen-with-spaces)
const FULL_RE = /^(.*?)\s+[—–-]\s+(.+?)\s+by\s+(.+?)\s*$/i;

// Match: "<title> — <type>"                (no teacher)
const TYPE_ONLY_RE = /^(.*?)\s+[—–-]\s+(.+?)\s*$/;

export function parseTrackTitle(raw: string): TrackMetadata {
  const trimmed = raw.trim();

  const full = trimmed.match(FULL_RE);
  if (full) {
    return {
      cleanTitle: full[1].trim(),
      type: full[2].trim(),
      speaker: full[3].trim(),
    };
  }

  const partial = trimmed.match(TYPE_ONLY_RE);
  if (partial) {
    const type = partial[2].trim();
    // Only treat the right-hand side as a "type" when it looks like one
    // (mentions Meditation / Talk / Q&A / Reflection / Practice).
    if (/(meditation|talk|q&a|reflection|practice|series|dharma)/i.test(type)) {
      return {
        cleanTitle: partial[1].trim(),
        type,
        speaker: DEFAULT_SPEAKER,
      };
    }
  }

  return { cleanTitle: trimmed };
}
