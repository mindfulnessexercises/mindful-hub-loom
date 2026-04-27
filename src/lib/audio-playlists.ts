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
  "mindset-quotes": {
    heading: "Listen to the Growth Mindset audio series",
    intro:
      "A two-part reflection on cultivating a growth mindset for personal transformation.",
    tracks: [
      { title: "Part 1: Growth Mindset", src: `${AUDIO_BASE}/mindset-quotes/part-1.mp3` },
      { title: "Part 2: Growth Mindset", src: `${AUDIO_BASE}/mindset-quotes/part-2.mp3` },
    ],
  },
  "resilience-quotes": {
    heading: "Listen to the Resilience audio series",
    intro:
      "A two-part guided reflection on building resilience through mindful awareness.",
    tracks: [
      { title: "Part 1: Resilience", src: `${AUDIO_BASE}/resilience-quotes/part-1.mp3` },
      { title: "Part 2: Resilience", src: `${AUDIO_BASE}/resilience-quotes/part-2.mp3` },
    ],
  },
  "stress-quotes": {
    heading: "Listen to the Stress audio series",
    intro:
      "A two-part guided reflection on navigating stress with mindful wisdom.",
    tracks: [
      { title: "Part 1: Stress Quotes", src: `${AUDIO_BASE}/stress-quotes/part-1.mp3` },
      { title: "Part 2: Stress Quotes", src: `${AUDIO_BASE}/stress-quotes/part-2.mp3` },
    ],
  },
  "empathy-quotes": {
    heading: "Listen to the Empathy audio series",
    intro:
      "A three-part reflection on cultivating empathy, understanding, and compassion.",
    tracks: [
      { title: "Part 1: Empathy Quotes", src: `${AUDIO_BASE}/empathy-quotes/part-1.mp3` },
      { title: "Part 2: Empathy Quotes", src: `${AUDIO_BASE}/empathy-quotes/part-2.mp3` },
      { title: "Part 3: Empathy Quotes", src: `${AUDIO_BASE}/empathy-quotes/part-3.mp3` },
    ],
  },
  "self-worth-quotes": {
    heading: "Listen to the Self-Worth audio series",
    intro:
      "A two-part guided reflection on building confidence and inner self-worth.",
    tracks: [
      { title: "Part 1: Self-Worth Quotes", src: `${AUDIO_BASE}/self-worth-quotes/part-1.mp3` },
      { title: "Part 2: Self-Worth Quotes", src: `${AUDIO_BASE}/self-worth-quotes/part-2.mp3` },
    ],
  },
  "letting-go-quotes": {
    heading: "Listen to the Letting Go audio series",
    intro:
      "A two-part reflection on the practice of letting go for renewal and growth.",
    tracks: [
      { title: "Part 1: Letting Go Quotes", src: `${AUDIO_BASE}/letting-go-quotes/part-1.mp3` },
      { title: "Part 2: Letting Go Quotes", src: `${AUDIO_BASE}/letting-go-quotes/part-2.mp3` },
    ],
  },
  "silence-quotes": {
    heading: "Listen to the Silence audio series",
    intro:
      "A guided reflection on the power of silence for inspiration and stillness. (Part 1 coming soon.)",
    tracks: [
      { title: "Part 2: Silence Quotes", src: `${AUDIO_BASE}/silence-quotes/part-2.mp3` },
    ],
  },
};

export function getPlaylist(slug: string | undefined): AudioPlaylist | null {
  if (!slug) return null;
  return AUDIO_PLAYLISTS[slug] ?? null;
}
