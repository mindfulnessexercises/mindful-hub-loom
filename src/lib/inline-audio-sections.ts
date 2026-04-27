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
      match: "self-confidence and self-worth",
      label: "Listen: Self-Confidence & Self-Worth affirmations",
      src: `${AUDIO_BASE}/affirmations-for-teens/self-confidence-and-self-worth.mp3`,
    },
    {
      match: "academic success",
      label: "Listen: Academic Success affirmations",
      src: `${AUDIO_BASE}/affirmations-for-teens/academic-success.mp3`,
    },
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
  "karma-quotes": [
    {
      match: "relationship karma quotes",
      label: "Listen: Relationship Karma quotes",
      src: `${AUDIO_BASE}/karma-quotes/relationship-karma-quotes.mp3`,
    },
    {
      match: "karma quotes about life",
      label: "Listen: Karma Quotes about Life",
      src: `${AUDIO_BASE}/karma-quotes/karma-quotes-about-life.mp3`,
    },
    {
      match: "karma greed quotes",
      label: "Listen: Karma Greed quotes",
      src: `${AUDIO_BASE}/karma-quotes/karma-greed-quotes.mp3`,
    },
    {
      match: "karma you reap what you sow",
      label: "Listen: Karma — You Reap What You Sow",
      src: `${AUDIO_BASE}/karma-quotes/karma-you-reap-what-you-sow.mp3`,
    },
    {
      match: "karma justice quotes",
      label: "Listen: Karma Justice quotes",
      src: `${AUDIO_BASE}/karma-quotes/karma-justice-quotes.mp3`,
    },
  ],
  "stoic-quotes": [
    {
      match: "epictetus quotes",
      label: "Listen: Epictetus quotes",
      src: `${AUDIO_BASE}/stoic-quotes/epictetus.mp3`,
    },
    {
      match: "seneca quotes",
      label: "Listen: Seneca quotes",
      src: `${AUDIO_BASE}/stoic-quotes/seneca.mp3`,
    },
    {
      match: "marcus aurelius quotes",
      label: "Listen: Marcus Aurelius quotes",
      src: `${AUDIO_BASE}/stoic-quotes/marcus-aurelius.mp3`,
    },
    {
      match: "zeno of citium quotes",
      label: "Listen: Zeno of Citium quotes",
      src: `${AUDIO_BASE}/stoic-quotes/zeno-of-citium.mp3`,
    },
    {
      // No dedicated Cleanthes section yet — attach to "More Stoic Quotes",
      // the natural catch-all section. When a Cleanthes h3 is added the
      // match string can be updated; the rendered player won't change.
      match: "more stoic quotes",
      label: "Listen: Cleanthes quotes",
      src: `${AUDIO_BASE}/stoic-quotes/cleanthes.mp3`,
    },
  ],
  "chakra-affirmations": [
    {
      match: "root chakra muladhara",
      label: "Listen: Root Chakra (Muladhara) affirmations",
      src: `${AUDIO_BASE}/chakra-affirmations/root-chakra-muladhara.mp3`,
    },
    {
      match: "sacral chakra svadhisthana",
      label: "Listen: Sacral Chakra (Svadhisthana) affirmations",
      src: `${AUDIO_BASE}/chakra-affirmations/sacral-chakra-svadhisthana.mp3`,
    },
    {
      match: "solar plexus chakra manipura",
      label: "Listen: Solar Plexus Chakra (Manipura) affirmations",
      src: `${AUDIO_BASE}/chakra-affirmations/solar-plexus-chakra-manipura.mp3`,
    },
    {
      // Match before "Heart Chakra Affirmations" anywhere — the hub
      // page heading is "Heart Chakra (Anahata):" so include both.
      match: "heart chakra anahata",
      label: "Listen: Heart Chakra (Anahata) affirmations",
      src: `${AUDIO_BASE}/chakra-affirmations/heart-chakra-anahata.mp3`,
    },
    {
      match: "throat chakra vishuddha",
      label: "Listen: Throat Chakra (Vishuddha) affirmations",
      src: `${AUDIO_BASE}/chakra-affirmations/throat-chakra-vishuddha.mp3`,
    },
    {
      match: "third eye chakra ajna",
      label: "Listen: Third Eye Chakra (Ajna) affirmations",
      src: `${AUDIO_BASE}/chakra-affirmations/third-eye-chakra-ajna.mp3`,
    },
    {
      match: "crown chakra sahasrara",
      label: "Listen: Crown Chakra (Sahasrara) affirmations",
      src: `${AUDIO_BASE}/chakra-affirmations/crown-chakra-sahasrara.mp3`,
    },
  ],
  "morning-affirmations": [
    {
      match: "adventure and boldness",
      label: "Listen: Adventure & Boldness affirmations",
      src: `${AUDIO_BASE}/morning-affirmations/adventure-and-boldness.mp3`,
    },
    {
      match: "adventure and exploration",
      label: "Listen: Adventure & Exploration affirmations",
      src: `${AUDIO_BASE}/morning-affirmations/adventure-and-exploration.mp3`,
    },
    {
      match: "communication and expression",
      label: "Listen: Communication & Expression affirmations",
      src: `${AUDIO_BASE}/morning-affirmations/communication-and-expression.mp3`,
    },
    {
      match: "confidence in facing challenges",
      label: "Listen: Confidence in Facing Challenges affirmations",
      src: `${AUDIO_BASE}/morning-affirmations/confidence-in-facing-challenges.mp3`,
    },
    {
      match: "creativity and inspiration",
      label: "Listen: Creativity & Inspiration affirmations",
      src: `${AUDIO_BASE}/morning-affirmations/creativity-and-inspiration.mp3`,
    },
    {
      match: "financial abundance",
      label: "Listen: Financial Abundance affirmations",
      src: `${AUDIO_BASE}/morning-affirmations/financial-abundance.mp3`,
    },
    {
      match: "focus and productivity",
      label: "Listen: Focus & Productivity affirmations",
      src: `${AUDIO_BASE}/morning-affirmations/focus-and-productivity.mp3`,
    },
    {
      match: "gratitude and appreciation",
      label: "Listen: Gratitude & Appreciation affirmations",
      src: `${AUDIO_BASE}/morning-affirmations/gratitude-and-appreciation.mp3`,
    },
    {
      match: "health and well-being",
      label: "Listen: Health & Well-Being affirmations",
      src: `${AUDIO_BASE}/morning-affirmations/health-and-well-being.mp3`,
    },
    {
      match: "inner peace and serenity",
      label: "Listen: Inner Peace & Serenity affirmations",
      src: `${AUDIO_BASE}/morning-affirmations/inner-peace-and-serenity.mp3`,
    },
    {
      match: "optimism and positivity",
      label: "Listen: Optimism & Positivity affirmations",
      src: `${AUDIO_BASE}/morning-affirmations/optimism-and-positivity.mp3`,
    },
    {
      match: "personal growth and learning",
      label: "Listen: Personal Growth & Learning affirmations",
      src: `${AUDIO_BASE}/morning-affirmations/personal-growth-and-learning.mp3`,
    },
    {
      match: "positivity and mindfulness",
      label: "Listen: Positivity & Mindfulness affirmations",
      src: `${AUDIO_BASE}/morning-affirmations/positivity-and-mindfulness.mp3`,
    },
    {
      match: "relationships and connection",
      label: "Listen: Relationships & Connection affirmations",
      src: `${AUDIO_BASE}/morning-affirmations/relationships-and-connection.mp3`,
    },
    {
      match: "spirituality and inner connection",
      label: "Listen: Spirituality & Inner Connection affirmations",
      src: `${AUDIO_BASE}/morning-affirmations/spirituality-and-inner-connection.mp3`,
    },
  ],
  "positive-affirmations-for-men": [
    {
      match: "assertiveness and leadership",
      label: "Listen: Assertiveness & Leadership affirmations",
      // v2 = re-recorded take, supersedes original.
      src: `${AUDIO_BASE}/positive-affirmations-for-men/assertiveness-and-leadership-v2.mp3`,
    },
    {
      match: "balanced work-life integration",
      label: "Listen: Balanced Work-Life Integration affirmations",
      src: `${AUDIO_BASE}/positive-affirmations-for-men/balanced-work-life-integration.mp3`,
    },
    {
      match: "career and ambition",
      label: "Listen: Career & Ambition affirmations",
      // v2 = re-recorded take, supersedes original.
      src: `${AUDIO_BASE}/positive-affirmations-for-men/career-and-ambition-v2.mp3`,
    },
    {
      match: "courage and bravery",
      label: "Listen: Courage & Bravery affirmations",
      src: `${AUDIO_BASE}/positive-affirmations-for-men/courage-and-bravery.mp3`,
    },
    {
      match: "creativity and innovation",
      label: "Listen: Creativity & Innovation affirmations",
      // v2 = re-recorded take, supersedes original.
      src: `${AUDIO_BASE}/positive-affirmations-for-men/creativity-and-innovation-v2.mp3`,
    },
    {
      match: "financial abundance and prosperity",
      label: "Listen: Financial Abundance & Prosperity affirmations",
      // v2 = re-recorded take, supersedes original.
      src: `${AUDIO_BASE}/positive-affirmations-for-men/financial-abundance-and-prosperity-v2.mp3`,
    },
    {
      match: "gratitude and appreciation",
      label: "Listen: Gratitude & Appreciation affirmations",
      src: `${AUDIO_BASE}/positive-affirmations-for-men/gratitude-and-appreciation.mp3`,
    },
    {
      match: "health and well-being",
      label: "Listen: Health & Well-Being affirmations",
      src: `${AUDIO_BASE}/positive-affirmations-for-men/health-and-well-being.mp3`,
    },
    {
      match: "mindfulness and presence",
      label: "Listen: Mindfulness & Presence affirmations",
      src: `${AUDIO_BASE}/positive-affirmations-for-men/mindfulness-and-presence.mp3`,
    },
    {
      match: "optimism and positivity",
      label: "Listen: Optimism & Positivity affirmations",
      src: `${AUDIO_BASE}/positive-affirmations-for-men/optimism-and-positivity.mp3`,
    },
    {
      match: "personal growth and fulfillment",
      label: "Listen: Personal Growth & Fulfillment affirmations",
      src: `${AUDIO_BASE}/positive-affirmations-for-men/personal-growth-and-fulfillment.mp3`,
    },
    {
      match: "relationships and communication",
      label: "Listen: Relationships & Communication affirmations",
      src: `${AUDIO_BASE}/positive-affirmations-for-men/relationships-and-communication.mp3`,
    },
    {
      match: "self-confidence and self-worth",
      label: "Listen: Self-Confidence & Self-Worth affirmations",
      src: `${AUDIO_BASE}/positive-affirmations-for-men/self-confidence-and-self-worth.mp3`,
    },
    {
      match: "strength and resilience",
      label: "Listen: Strength & Resilience affirmations",
      src: `${AUDIO_BASE}/positive-affirmations-for-men/strength-and-resilience.mp3`,
    },
  ],
  "positive-affirmations-for-kids": [
    {
      match: "creativity and imagination",
      label: "Listen: Creativity & Imagination affirmations",
      // v2 = re-recorded take, supersedes original.
      src: `${AUDIO_BASE}/positive-affirmations-for-kids/creativity-and-imagination-v2.mp3`,
    },
    {
      match: "emotions and resilience",
      label: "Listen: Emotions & Resilience affirmations",
      // v2 = re-recorded take, supersedes original.
      src: `${AUDIO_BASE}/positive-affirmations-for-kids/emotions-and-resilience-v2.mp3`,
    },
    {
      match: "gratitude and appreciation",
      label: "Listen: Gratitude & Appreciation affirmations",
      src: `${AUDIO_BASE}/positive-affirmations-for-kids/gratitude-and-appreciation.mp3`,
    },
    {
      match: "environmental responsibility",
      label: "Listen: Environmental Responsibility affirmations",
      // v2 = re-recorded take, supersedes original.
      src: `${AUDIO_BASE}/positive-affirmations-for-kids/environmental-responsibility-v2.mp3`,
    },
    {
      match: "kindness and empathy",
      label: "Listen: Kindness & Empathy affirmations",
      src: `${AUDIO_BASE}/positive-affirmations-for-kids/kindness-and-empathy.mp3`,
    },
    {
      match: "respect and manners",
      label: "Listen: Respect & Manners affirmations",
      src: `${AUDIO_BASE}/positive-affirmations-for-kids/respect-and-manners.mp3`,
    },
    {
      match: "responsibility and independence",
      label: "Listen: Responsibility & Independence affirmations",
      src: `${AUDIO_BASE}/positive-affirmations-for-kids/responsibility-and-independence.mp3`,
    },
  ],
  "positive-affirmations-for-women": [
    {
      match: "strong woman affirmations",
      label: "Listen: Strong Woman affirmations",
      src: `${AUDIO_BASE}/positive-affirmations-for-women/strong-woman.mp3`,
    },
    {
      match: "daily affirmations for women",
      label: "Listen: Daily Affirmations for Women",
      src: `${AUDIO_BASE}/positive-affirmations-for-women/daily.mp3`,
    },
    {
      match: "morning affirmations for women",
      label: "Listen: Morning Affirmations for Women",
      src: `${AUDIO_BASE}/positive-affirmations-for-women/morning.mp3`,
    },
    {
      match: "confidence affirmations for women",
      label: "Listen: Confidence Affirmations for Women",
      src: `${AUDIO_BASE}/positive-affirmations-for-women/confidence.mp3`,
    },
    {
      match: "empowerment and leadership",
      label: "Listen: Empowerment & Leadership affirmations",
      src: `${AUDIO_BASE}/positive-affirmations-for-women/empowerment-and-leadership.mp3`,
    },
    {
      match: "personal growth and development",
      label: "Listen: Personal Growth & Development affirmations",
      src: `${AUDIO_BASE}/positive-affirmations-for-women/personal-growth-and-development.mp3`,
    },
    {
      match: "healing and resilience",
      label: "Listen: Healing & Resilience affirmations",
      src: `${AUDIO_BASE}/positive-affirmations-for-women/healing-and-resilience.mp3`,
    },
    {
      match: "balance and well-being",
      label: "Listen: Balance & Well-Being affirmations",
      src: `${AUDIO_BASE}/positive-affirmations-for-women/balance-and-well-being.mp3`,
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
