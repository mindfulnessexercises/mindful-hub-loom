// Per-post registry mapping a WP slug → an ordered playlist of audio
// tracks. Used by WPResolver to render a single playlist block at the
// TOP of a post/page body (above the WP HTML), in contrast with
// `inline-audio-sections.ts` which embeds players beside section
// headings.
//
// Use this for posts where multiple audio files form a single multi-
// part series rather than sectioned chapters (e.g. the 4-part
// "Meaningful Work" recording on /meaningful-work-quotes).

export interface PlaylistTrack {
  /** Visible track title. */
  title: string;
  /** Public URL of the audio file. */
  src: string;
}

export interface AudioPlaylist {
  /** Heading rendered above the playlist block. */
  heading: string;
  /** Optional short intro paragraph below the heading. */
  intro?: string;
  /** Ordered tracks. */
  tracks: PlaylistTrack[];
}

const AUDIO_BASE =
  "https://glpbynaneshuhmjtbpsa.supabase.co/storage/v1/object/public/meditation-audio";

export const AUDIO_PLAYLISTS: Record<string, AudioPlaylist> = {
  "meaningful-work-quotes": {
    heading: "Listen to the Meaningful Work audio series",
    intro:
      "A four-part guided reflection on finding purpose, presence, and meaning in your daily work.",
    tracks: [
      { title: "Part 1: Meaningful Work", src: `${AUDIO_BASE}/meaningful-work-quotes/part-1.mp3` },
      { title: "Part 2: Meaningful Work", src: `${AUDIO_BASE}/meaningful-work-quotes/part-2.mp3` },
      { title: "Part 3: Meaningful Work", src: `${AUDIO_BASE}/meaningful-work-quotes/part-3.mp3` },
      { title: "Part 4: Meaningful Work", src: `${AUDIO_BASE}/meaningful-work-quotes/part-4.mp3` },
    ],
  },
  "karma-quotes": {
    heading: "Listen to the Karma audio series",
    intro:
      "A three-part reflection exploring karma's influence on relationships, life, and personal growth.",
    tracks: [
      { title: "Part 1: Karma", src: `${AUDIO_BASE}/karma-quotes/part-1.mp3` },
      { title: "Part 2: Karma", src: `${AUDIO_BASE}/karma-quotes/part-2.mp3` },
      { title: "Part 3: Karma", src: `${AUDIO_BASE}/karma-quotes/part-3.mp3` },
    ],
  },
  "self-care-quotes": {
    heading: "Listen to the Self-Care audio series",
    intro:
      "A two-part guided reflection on self-care as a daily mindfulness practice.",
    tracks: [
      { title: "Part 1: Self-Care Quotes", src: `${AUDIO_BASE}/self-care-quotes/part-1.mp3` },
      { title: "Part 2: Self-Care Quotes", src: `${AUDIO_BASE}/self-care-quotes/part-2.mp3` },
    ],
  },
};

export function getPlaylist(slug: string | undefined): AudioPlaylist | null {
  if (!slug) return null;
  return AUDIO_PLAYLISTS[slug] ?? null;
}
