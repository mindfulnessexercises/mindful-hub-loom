// Per-post registry mapping section headings → uploaded audio tracks.
// Used by WPResolver to inject native <audio> players inline beneath
// matching <h2>/<h3>/<h4> headings inside long-form posts (e.g. the
// "150 Empowering Positive Affirmations for Teens" article, which has
// one recorded affirmations track per section).
//
// To add support for another post:
//   1. Upload MP3s to the meditation-audio bucket
//   2. Add an entry below keyed by the WP post slug
//   3. Each track's `match` is compared (case-insensitive, punctuation-
//      stripped) against heading text. First match wins.

export interface InlineAudioTrack {
  /** Substring that must appear in the heading text (case-insensitive). */
  match: string;
  /** Visible label rendered above the player. */
  label: string;
  /** Public URL of the audio file. */
  src: string;
}

const AUDIO_BASE =
  "https://glpbynaneshuhmjtbpsa.supabase.co/storage/v1/object/public/meditation-audio";

export const INLINE_AUDIO_SECTIONS: Record<string, InlineAudioTrack[]> = {
  "positive-affirmations-for-teens": [
    {
      match: "social relationships",
      label: "Listen: Social Relationships affirmations",
      src: `${AUDIO_BASE}/affirmations-for-teens/social-relationships.mp3`,
    },
    {
      match: "emotional wellbeing",
      label: "Listen: Emotional Wellbeing affirmations",
      src: `${AUDIO_BASE}/affirmations-for-teens/emotional-wellbeing.mp3`,
    },
    {
      match: "motivation and goal setting",
      label: "Listen: Motivation & Goal Setting affirmations",
      src: `${AUDIO_BASE}/affirmations-for-teens/motivation-and-goal-setting.mp3`,
    },
    {
      match: "body positivity",
      label: "Listen: Body Positivity & Self-Image affirmations",
      src: `${AUDIO_BASE}/affirmations-for-teens/body-positivity-and-self-image.mp3`,
    },
    {
      match: "empowerment and independence",
      label: "Listen: Empowerment & Independence affirmations",
      src: `${AUDIO_BASE}/affirmations-for-teens/empowerment-and-independence.mp3`,
    },
    {
      match: "gratitude and positivity",
      label: "Listen: Gratitude & Positivity affirmations",
      src: `${AUDIO_BASE}/affirmations-for-teens/gratitude-and-positivity.mp3`,
    },
    {
      match: "resilience and adaptability",
      label: "Listen: Resilience & Adaptability affirmations",
      src: `${AUDIO_BASE}/affirmations-for-teens/resilience-and-adaptability.mp3`,
    },
    {
      match: "creativity and innovation",
      label: "Listen: Creativity & Innovation affirmations",
      src: `${AUDIO_BASE}/affirmations-for-teens/creativity-and-innovation.mp3`,
    },
    {
      match: "time management and productivity",
      label: "Listen: Time Management & Productivity affirmations",
      // v2 = re-recorded take (April 2026), supersedes original.
      src: `${AUDIO_BASE}/affirmations-for-teens/time-management-and-productivity-v2.mp3`,
    },
    {
      match: "conflict resolution and communication",
      label: "Listen: Conflict Resolution & Communication affirmations",
      // v2 = re-recorded take (April 2026), supersedes original.
      src: `${AUDIO_BASE}/affirmations-for-teens/conflict-resolution-and-communication-v2.mp3`,
    },
    {
      match: "mindfulness and presence",
      label: "Listen: Mindfulness & Presence affirmations",
      src: `${AUDIO_BASE}/affirmations-for-teens/mindfulness-and-presence.mp3`,
    },
    {
      match: "personal development and growth",
      label: "Listen: Personal Development & Growth affirmations",
      src: `${AUDIO_BASE}/affirmations-for-teens/personal-development-and-growth.mp3`,
    },
    {
      match: "graciousness and empathy",
      label: "Listen: Graciousness & Empathy affirmations",
      src: `${AUDIO_BASE}/affirmations-for-teens/graciousness-and-empathy.mp3`,
    },
  ],
};

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/&[a-z]+;/g, " ") // strip HTML entities
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Injects styled native <audio> players directly after any heading
 * (h2/h3/h4) whose text matches a configured track for the given slug.
 * Returns the original HTML when no slug entry exists (zero overhead
 * for the vast majority of posts).
 */
export function injectInlineAudio(html: string, slug: string | undefined): string {
  if (!html || !slug) return html;
  const tracks = INLINE_AUDIO_SECTIONS[slug];
  if (!tracks || tracks.length === 0) return html;

  return html.replace(
    /<(h[2-4])([^>]*)>([\s\S]*?)<\/\1>/gi,
    (full, tag, attrs, inner) => {
      const text = normalize(inner.replace(/<[^>]+>/g, ""));
      if (!text) return full;
      const track = tracks.find((t) => text.includes(normalize(t.match)));
      if (!track) return full;

      // Inline styles only — keeps this independent of Tailwind classes
      // surviving WP HTML rewrites. Mirrors the "serene & elevated" feel.
      const player = `
<figure class="inline-audio-section my-6 rounded-xl border border-border bg-muted/40 p-4 not-prose" data-audio-slug="${slug}">
  <figcaption class="mb-2 text-sm font-medium text-foreground/80">${track.label}</figcaption>
  <audio controls preload="none" src="${track.src}" class="w-full" style="width:100%">
    Your browser does not support the audio element.
    <a href="${track.src}">Download the audio file</a>.
  </audio>
</figure>`;
      return `${full}\n${player}`;
    },
  );
}
