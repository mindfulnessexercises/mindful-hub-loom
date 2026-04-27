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
      "Four short tracks of hand-picked quotes and gentle reflection prompts — a calm companion for reconnecting with purpose, presence, and meaning in your workday.",
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
      "Three contemplative tracks weaving together teachings on karma — how each thought, word, and action shapes our relationships, our path, and our growth.",
    tracks: [
      { title: "Part 1: Karma", src: `${AUDIO_BASE}/karma-quotes/part-1.mp3` },
      { title: "Part 2: Karma", src: `${AUDIO_BASE}/karma-quotes/part-2.mp3` },
      { title: "Part 3: Karma", src: `${AUDIO_BASE}/karma-quotes/part-3.mp3` },
    ],
  },
  "self-care-quotes": {
    heading: "Listen to the Self-Care audio series",
    intro:
      "Two gentle tracks of soothing quotes and mindful pauses — a soft reminder that tending to yourself is not indulgence, but practice.",
    tracks: [
      { title: "Part 1: Self-Care Quotes", src: `${AUDIO_BASE}/self-care-quotes/part-1.mp3` },
      { title: "Part 2: Self-Care Quotes", src: `${AUDIO_BASE}/self-care-quotes/part-2.mp3` },
    ],
  },
  "mindset-quotes": {
    heading: "Listen to the Growth Mindset audio series",
    intro:
      "Two reflective tracks of curated quotes to help you meet challenge with curiosity, soften self-judgment, and grow through what you go through.",
    tracks: [
      { title: "Part 1: Growth Mindset", src: `${AUDIO_BASE}/mindset-quotes/part-1.mp3` },
      { title: "Part 2: Growth Mindset", src: `${AUDIO_BASE}/mindset-quotes/part-2.mp3` },
    ],
  },
  "resilience-quotes": {
    heading: "Listen to the Resilience audio series",
    intro:
      "Two grounding tracks of quotes and quiet reflection — for the days you need to remember how steady you actually are.",
    tracks: [
      { title: "Part 1: Resilience", src: `${AUDIO_BASE}/resilience-quotes/part-1.mp3` },
      { title: "Part 2: Resilience", src: `${AUDIO_BASE}/resilience-quotes/part-2.mp3` },
    ],
  },
  "stress-quotes": {
    heading: "Listen to the Stress audio series",
    intro:
      "Two calming tracks designed to slow the breath and quiet a busy mind — soft wisdom for moments when stress feels louder than you do.",
    tracks: [
      { title: "Part 1: Stress Quotes", src: `${AUDIO_BASE}/stress-quotes/part-1.mp3` },
      { title: "Part 2: Stress Quotes", src: `${AUDIO_BASE}/stress-quotes/part-2.mp3` },
    ],
  },
  "empathy-quotes": {
    heading: "Listen to the Empathy audio series",
    intro:
      "Three warm tracks of quotes and reflection on truly seeing others — for opening the heart, deepening understanding, and meeting people (and yourself) with compassion.",
    tracks: [
      { title: "Part 1: Empathy Quotes", src: `${AUDIO_BASE}/empathy-quotes/part-1.mp3` },
      { title: "Part 2: Empathy Quotes", src: `${AUDIO_BASE}/empathy-quotes/part-2.mp3` },
      { title: "Part 3: Empathy Quotes", src: `${AUDIO_BASE}/empathy-quotes/part-3.mp3` },
    ],
  },
  "self-worth-quotes": {
    heading: "Listen to the Self-Worth audio series",
    intro:
      "Two affirming tracks of curated quotes and mindful pauses — a quiet reminder that your worth was never something you had to earn.",
    tracks: [
      { title: "Part 1: Self-Worth Quotes", src: `${AUDIO_BASE}/self-worth-quotes/part-1.mp3` },
      { title: "Part 2: Self-Worth Quotes", src: `${AUDIO_BASE}/self-worth-quotes/part-2.mp3` },
    ],
  },
  "letting-go-quotes": {
    heading: "Listen to the Letting Go audio series",
    intro:
      "Two spacious tracks of quotes and gentle reflection on releasing what's no longer yours to carry — making room for what wants to come next.",
    tracks: [
      { title: "Part 1: Letting Go Quotes", src: `${AUDIO_BASE}/letting-go-quotes/part-1.mp3` },
      { title: "Part 2: Letting Go Quotes", src: `${AUDIO_BASE}/letting-go-quotes/part-2.mp3` },
    ],
  },
  "silence-quotes": {
    heading: "Listen to the Silence audio series",
    intro:
      "Two quiet tracks of timeless quotes and unhurried pauses — an invitation to listen for what only stillness can say.",
    tracks: [
      { title: "Part 1: Silence Quotes", src: `${AUDIO_BASE}/silence-quotes/part-1.mp3` },
      { title: "Part 2: Silence Quotes", src: `${AUDIO_BASE}/silence-quotes/part-2.mp3` },
    ],
  },
  "healing-quotes": {
    heading: "Listen to the Healing audio series",
    intro:
      "Two tender tracks of quotes and reflection for walking alongside your own healing — at its own pace, in its own time, with kindness.",
    tracks: [
      { title: "Part 1: Healing Quotes", src: `${AUDIO_BASE}/healing-quotes/part-1.mp3` },
      { title: "Part 2: Healing Quotes", src: `${AUDIO_BASE}/healing-quotes/part-2.mp3` },
    ],
  },
  "heart-chakra-affirmations": {
    heading: "Listen to the Heart Chakra audio series",
    intro:
      "Six guided tracks of affirmations for Anahata, the heart center — softening the chest, opening to love, and gently tending to old emotional wounds.",
    tracks: [
      { title: "Part 1: Heart Chakra", src: `${AUDIO_BASE}/heart-chakra-affirmations/part-1.mp3` },
      { title: "Part 2: Heart Chakra", src: `${AUDIO_BASE}/heart-chakra-affirmations/part-2.mp3` },
      { title: "Part 3: Heart Chakra", src: `${AUDIO_BASE}/heart-chakra-affirmations/part-3.mp3` },
      { title: "Part 4: Heart Chakra", src: `${AUDIO_BASE}/heart-chakra-affirmations/part-4.mp3` },
      { title: "Part 5: Heart Chakra", src: `${AUDIO_BASE}/heart-chakra-affirmations/part-5.mp3` },
      { title: "Part 6: Heart Chakra", src: `${AUDIO_BASE}/heart-chakra-affirmations/part-6.mp3` },
    ],
  },
  "sacral-chakra-affirmations": {
    heading: "Listen to the Sacral Chakra audio series",
    intro:
      "Four guided tracks of affirmations for Svadhisthana, the sacral center — awakening creativity, sensuality, and the joyful flow of emotion.",
    tracks: [
      { title: "Part 1: Sacral Chakra", src: `${AUDIO_BASE}/sacral-chakra-affirmations/part-1.mp3` },
      { title: "Part 2: Sacral Chakra", src: `${AUDIO_BASE}/sacral-chakra-affirmations/part-2.mp3` },
      { title: "Part 3: Sacral Chakra", src: `${AUDIO_BASE}/sacral-chakra-affirmations/part-3.mp3` },
      { title: "Part 4: Sacral Chakra", src: `${AUDIO_BASE}/sacral-chakra-affirmations/part-4.mp3` },
    ],
  },
  "gratitude-affirmations": {
    heading: "Listen to the Gratitude Affirmations audio series",
    intro:
      "Eight gentle tracks of gratitude affirmations and quiet reflection — a soft daily practice for noticing what's already enough, and letting the heart catch up to the good.",
    tracks: [
      { title: "Part 1: Gratitude Affirmations", src: `${AUDIO_BASE}/gratitude-affirmations/part-1.mp3` },
      { title: "Part 2: Gratitude Affirmations", src: `${AUDIO_BASE}/gratitude-affirmations/part-2.mp3` },
      { title: "Part 3: Gratitude Affirmations", src: `${AUDIO_BASE}/gratitude-affirmations/part-3.mp3` },
      { title: "Part 4: Gratitude Affirmations", src: `${AUDIO_BASE}/gratitude-affirmations/part-4.mp3` },
      { title: "Part 5: Gratitude Affirmations", src: `${AUDIO_BASE}/gratitude-affirmations/part-5.mp3` },
      { title: "Part 6: Gratitude Affirmations", src: `${AUDIO_BASE}/gratitude-affirmations/part-6.mp3` },
      { title: "Part 7: Gratitude Affirmations", src: `${AUDIO_BASE}/gratitude-affirmations/part-7.mp3` },
      { title: "Part 8: Gratitude Affirmations", src: `${AUDIO_BASE}/gratitude-affirmations/part-8.mp3` },
    ],
  },
  "i-am-affirmations": {
    heading: "Listen to the I Am Affirmations audio series",
    intro:
      "A grounding series of 'I Am' affirmations — quiet declarations of who you already are, returning you to the steady ground beneath the noise. (Part 1 coming soon.)",
    tracks: [
      { title: "Part 2: I Am Affirmations", src: `${AUDIO_BASE}/i-am-affirmations/part-2.mp3` },
      { title: "Part 3: I Am Affirmations", src: `${AUDIO_BASE}/i-am-affirmations/part-3.mp3` },
      { title: "Part 4: I Am Affirmations", src: `${AUDIO_BASE}/i-am-affirmations/part-4.mp3` },
    ],
  },
};

export function getPlaylist(slug: string | undefined): AudioPlaylist | null {
  if (!slug) return null;
  return AUDIO_PLAYLISTS[slug] ?? null;
}
