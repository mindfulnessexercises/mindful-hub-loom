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
  /**
   * Optional WP post slug where this track originally lives. When set
   * (and different from the host playlist's slug), the track row will
   * render an "Open original post" link so visitors can jump to the
   * source page for context. Leading slash is optional.
   */
  postSlug?: string;
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
      "Four short tracks of hand-picked quotes and gentle reflection prompts — a calm companion for reconnecting with purpose, presence, and meaning in your workday. Plus a Meeting Meditation series in three lengths (1, 3, and 5 minutes) for steadying yourself before walking into the room.",
    tracks: [
      { title: "Part 1: Meaningful Work", src: `${AUDIO_BASE}/meaningful-work-quotes/part-1.mp3` },
      { title: "Part 2: Meaningful Work", src: `${AUDIO_BASE}/meaningful-work-quotes/part-2.mp3` },
      { title: "Part 3: Meaningful Work", src: `${AUDIO_BASE}/meaningful-work-quotes/part-3.mp3` },
      { title: "Part 4: Meaningful Work", src: `${AUDIO_BASE}/meaningful-work-quotes/part-4.mp3` },
      { title: "Meeting Meditation (1 Minute) — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/meaningful-work-quotes/meeting-1-minute.mp3` },
      { title: "Meeting Meditation (3 Minutes) — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/meaningful-work-quotes/meeting-3-minutes.mp3` },
      { title: "Meeting Meditation (5 Minutes) — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/meaningful-work-quotes/meeting-5-minutes.mp3` },
      { title: "Leading With Purpose — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/meaningful-work-quotes/leading-with-purpose.mp3` },
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
      "Two calming tracks designed to slow the breath and quiet a busy mind — soft wisdom for moments when stress feels louder than you do. Plus guided meditations and a long-form dharma teaching: Relieving Stress; Dropping the Suitcases of Regret & Worry; Mindfulness for Stress in two lengths (a longer settling practice and a shorter five-minute reset); Soft Belly Breathing — a gentle belly-breath practice for stress relief; and Stress, Wakeful Relaxation, and Freedom (Tara Brach) — a long-form retreat-style talk on meeting stress with the wakeful, relaxed presence that opens into freedom.",
    tracks: [
      { title: "Part 1: Stress Quotes", src: `${AUDIO_BASE}/stress-quotes/part-1.mp3` },
      { title: "Part 2: Stress Quotes", src: `${AUDIO_BASE}/stress-quotes/part-2.mp3` },
      { title: "Bonus: Relieving Stress — Guided Meditation", src: `${AUDIO_BASE}/stress-quotes/relieving-stress.mp3` },
      { title: "Bonus: Dropping the Suitcases of Regret & Worry — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/stress-quotes/dropping-the-suitcases.mp3` },
      { title: "Bonus: Mindfulness for Stress — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/stress-quotes/mindfulness-for-stress.mp3` },
      { title: "Bonus: Mindfulness for Stress (Short Version) — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/stress-quotes/mindfulness-for-stress-short.mp3` },
      { title: "Bonus: Soft Belly Breathing To Reduce Stress — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/soft-belly/soft-belly-breathing-stress.mp3` },
      { title: "Stress, Wakeful Relaxation, and Freedom — Dharma Talk by Tara Brach", src: `${AUDIO_BASE}/stress-quotes/tara-brach-stress-wakeful-relaxation-and-freedom.mp3` },
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
      { title: "Empathy: Its Nature, What Makes It Hard, and How to Develop It — Dharma Talk by Donald Rothberg", src: `${AUDIO_BASE}/empathy-quotes/donald-rothberg-empathy-its-nature-what-makes-it-hard-and-how-to-develop-it.mp3` },
      { title: "Listening Deeply — Dharma Talk by Kate Munding", src: `${AUDIO_BASE}/empathy-quotes/kate-munding-listening-deeply.mp3` },
      { title: "Just Like Me — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/empathy-quotes/just-like-me.mp3` },
    ],
  },
  "self-worth-quotes": {
    heading: "Listen to the Self-Worth audio series",
    intro:
      "Two affirming tracks of curated quotes and mindful pauses — a quiet reminder that your worth was never something you had to earn. Plus a bonus guided meditation: Feeling Worthy, and two short dharma talks by Gil Fronsdal — Power and Worthiness on how a settled sense of worth becomes its own quiet form of strength, and Practice Notes: Imperfect on the steady kindness of meeting yourself just as you are.",
    tracks: [
      { title: "Part 1: Self-Worth Quotes", src: `${AUDIO_BASE}/self-worth-quotes/part-1.mp3` },
      { title: "Part 2: Self-Worth Quotes", src: `${AUDIO_BASE}/self-worth-quotes/part-2.mp3` },
      { title: "Bonus: Feeling Worthy — Guided Meditation", src: `${AUDIO_BASE}/self-worth-quotes/feeling-worthy.mp3` },
      { title: "Power and Worthiness — Dharma Talk by Gil Fronsdal", src: `${AUDIO_BASE}/self-worth-quotes/power-and-worthiness.mp3` },
      { title: "Practice Notes: Imperfect — Dharma Talk by Gil Fronsdal", src: `${AUDIO_BASE}/self-worth-quotes/practice-notes-imperfect.mp3` },
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
      "Two quiet tracks of timeless quotes and unhurried pauses — an invitation to listen for what only stillness can say. Closes with a bonus guided meditation by Sean Fargo: Grounded Silence — a longer settling into the steady, embodied quiet beneath the noise.",
    tracks: [
      { title: "Part 1: Silence Quotes", src: `${AUDIO_BASE}/silence-quotes/part-1.mp3` },
      { title: "Part 2: Silence Quotes", src: `${AUDIO_BASE}/silence-quotes/part-2.mp3` },
      { title: "Bonus: Grounded Silence — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/silence-quotes/grounded-silence.mp3` },
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
      "Six guided tracks of affirmations for Anahata, the heart center — softening the chest, opening to love, and gently tending to old emotional wounds. Plus a bonus guided meditation: Sensing Into the Heart.",
    tracks: [
      { title: "Part 1: Heart Chakra", src: `${AUDIO_BASE}/heart-chakra-affirmations/part-1.mp3` },
      { title: "Part 2: Heart Chakra", src: `${AUDIO_BASE}/heart-chakra-affirmations/part-2.mp3` },
      { title: "Part 3: Heart Chakra", src: `${AUDIO_BASE}/heart-chakra-affirmations/part-3.mp3` },
      { title: "Part 4: Heart Chakra", src: `${AUDIO_BASE}/heart-chakra-affirmations/part-4.mp3` },
      { title: "Part 5: Heart Chakra", src: `${AUDIO_BASE}/heart-chakra-affirmations/part-5.mp3` },
      { title: "Part 6: Heart Chakra", src: `${AUDIO_BASE}/heart-chakra-affirmations/part-6.mp3` },
      { title: "Bonus: Sensing Into the Heart — Guided Meditation", src: `${AUDIO_BASE}/heart-chakra-affirmations/sensing-into-the-heart.mp3` },
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
  "throat-chakra-affirmations": {
    heading: "Listen to the Throat Chakra audio series",
    intro:
      "Four guided tracks of affirmations for Vishuddha, the throat center — clearing the channel of expression, honoring your truth, and finding the words that have been waiting to be spoken.",
    tracks: [
      { title: "Part 1: Throat Chakra", src: `${AUDIO_BASE}/throat-chakra-affirmations/part-1.mp3` },
      { title: "Part 2: Throat Chakra", src: `${AUDIO_BASE}/throat-chakra-affirmations/part-2.mp3` },
      { title: "Part 3: Throat Chakra", src: `${AUDIO_BASE}/throat-chakra-affirmations/part-3.mp3` },
      { title: "Part 4: Throat Chakra", src: `${AUDIO_BASE}/throat-chakra-affirmations/part-4.mp3` },
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
      { title: "Bonus: Affirmations of Gratitude — Guided Meditation", src: `${AUDIO_BASE}/gratitude-affirmations/affirmations-of-gratitude.mp3` },
      { title: "12 Intentions of Gratitude — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/gratitude-affirmations/12-intentions-of-gratitude.mp3` },
    ],
  },
  "i-am-affirmations": {
    heading: "Listen to the I Am Affirmations audio series",
    intro:
      "A grounding four-part series of 'I Am' affirmations — quiet declarations of who you already are, returning you to the steady ground beneath the noise.",
    tracks: [
      { title: "Part 1: I Am Affirmations", src: `${AUDIO_BASE}/i-am-affirmations/part-1.mp3` },
      { title: "Part 2: I Am Affirmations", src: `${AUDIO_BASE}/i-am-affirmations/part-2.mp3` },
      { title: "Part 3: I Am Affirmations", src: `${AUDIO_BASE}/i-am-affirmations/part-3.mp3` },
      { title: "Part 4: I Am Affirmations", src: `${AUDIO_BASE}/i-am-affirmations/part-4.mp3` },
    ],
  },
  "meditation-script-contentment": {
    heading: "Listen: Contentment audio series",
    intro:
      "A guided meditation plus a dharma talk on contentment — Contentment for Simply Being rests into the quiet sufficiency of this moment; Practice Notes: Contentment (Gil Fronsdal) reflects on contentment as a path of practice.",
    tracks: [
      { title: "Contentment for Simply Being — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/meditation-script-contentment/contentment-for-simply-being.mp3` },
      { title: "Practice Notes: Contentment — Dharma Talk by Gil Fronsdal", src: `${AUDIO_BASE}/meditation-script-contentment/practice-notes-contentment.mp3` },
    ],
  },
  "awareness-of-the-four-elements": {
    heading: "Listen: Body Awareness audio series",
    intro:
      "Two guided meditations for inhabiting the body — Elemental Body Awareness moves through earth, water, fire, and air; How to Come Home to the Body offers a slower return to physical presence.",
    tracks: [
      { title: "Elemental Body Awareness — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/awareness-of-the-four-elements/elemental-body-awareness.mp3` },
      { title: "How to Come Home to the Body — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/awareness-of-the-four-elements/come-home-to-the-body.mp3` },
      { title: "Breathing Spirit Into Form — Dharma Talk by Ajahn Sumedho", src: `${AUDIO_BASE}/awareness-of-the-four-elements/ajahn-sumedho-breathing-spirit-into-form.mp3` },
    ],
  },
  "how-to-practice-mindfulness-of-death-and-why-its-important": {
    heading: "Listen: Mindfulness of Death",
    intro:
      "A tender guided meditation on the truth of impermanence — not as fear, but as an invitation to live this life more awake, more honest, more grateful.",
    tracks: [
      { title: "Mindfulness of Death — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/how-to-practice-mindfulness-of-death/mindfulness-of-death.mp3` },
      { title: "Reflection on Mortality — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/6-mindful-breathing-exercises/foundations-28-reflection-on-mortality.mp3` },
      { title: "Nachiketa and the Lord of Death — Dharma Talk by Jack Kornfield", src: `${AUDIO_BASE}/how-to-practice-mindfulness-of-death-and-why-its-important/jack-kornfield-nachiketa-and-the-lord-of-death.mp3` },
      { title: "Nachiketo and the Lord of Death: Moving Through Difficulties as Transformative Practice — Dharma Talk by Jack Kornfield", src: `${AUDIO_BASE}/how-to-practice-mindfulness-of-death-and-why-its-important/jack-kornfield-nachiketo-moving-through-difficulties-2018.mp3` },
      { title: "Mortality and the Poignancy of Life — Dharma Talk by Matthew Brensilver", src: `${AUDIO_BASE}/how-to-practice-mindfulness-of-death-and-why-its-important/matthew-brensilver-mortality-and-the-poignancy-of-life.mp3` },
    ],
  },
  "feeling-tones-pleasant-unpleasant-neutral": {
    heading: "Listen: Mindfulness of Feeling Tones",
    intro:
      "A guided meditation on vedanā — the subtle tone of pleasant, unpleasant, or neutral that colors every experience before we even notice it.",
    tracks: [
      { title: "Mindfulness of Feeling Tones — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/feeling-tones-pleasant-unpleasant-neutral/mindfulness-of-feeling-tones.mp3` },
    ],
  },
  "10-tips-for-teaching-mindfulness-of-breathing-practices": {
    heading: "Listen: Mindfulness of Breathing",
    intro:
      "A guided meditation on the foundational practice — resting attention on the breath, returning gently each time the mind wanders.",
    tracks: [
      { title: "Mindfulness of Breathing — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/10-tips-teaching-mindfulness-of-breathing/mindfulness-of-breathing.mp3` },
      { title: "Training Overview — Introduction by Sean Fargo", src: `${AUDIO_BASE}/10-tips-for-teaching-mindfulness-of-breathing-practices/training-overview.mp3` },
      { title: "Cultivating Sati — Dharma Talk by Ajahn Sucitto", src: `${AUDIO_BASE}/10-tips-for-teaching-mindfulness-of-breathing-practices/ajahn-sucitto-cultivating-sati.mp3` },
      { title: "Meditation: Coming Back to the Breath — Guided Meditation by Tara Brach", src: `${AUDIO_BASE}/10-tips-for-teaching-mindfulness-of-breathing-practices/tara-brach-coming-back-to-the-breath.mp3` },
      { title: "Nine Breathing Exercises to Release Dead Energies — Guided Meditation by Anam Thubten", src: `${AUDIO_BASE}/10-tips-for-teaching-mindfulness-of-breathing-practices/anam-thubten-nine-breathing-exercises-to-release-dead-energies.mp3` },
    ],
  },
  "6-mindful-breathing-exercises": {
    heading: "Listen: Mindful Breathing audio series",
    intro:
      "Eleven of Sean Fargo's guided breath meditations — from curiosity and embodied awareness, to counting each exhale, to resting in the rhythm of the breath without judgment — plus longer practices on the beauty of the breath, breathing space, a short five-minute reset, breathing with care, mental space through mindful breathing, feeling embodied, and weaving mindful breathing into self-care. Plus three classic guided breath meditations from Gil Fronsdal — two long-form retreats from 2001 and 2003, and his Anapanasati teaching on the Four Forms of Mindfulness of Breathing — followed by a fourteen-part Guided Anapanasati Meditation series (Gil Fronsdal) recorded live at IMC: a slow, retreat-style progression through the Anapanasati instructions covering knowing the breath, exploring the breath, relating to the breath, the reassurance of the breath, breath and peripheral awareness, exploring impermanence, relaxing the mental formation (in two takes), noticing ease and effortlessness, relaxing while cultivating joy and ease, cultivating well-being, noticing absence and the little cessations, peripheral awareness and fading away, and impermanence, fading away and letting go.",
    tracks: [
      { title: "Breathing With Curiosity — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/6-mindful-breathing-exercises/breathing-with-curiosity.mp3` },
      { title: "Embodied Awareness of Breathing — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/6-mindful-breathing-exercises/embodied-awareness-of-breathing.mp3` },
      { title: "Counting Each Exhale — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/6-mindful-breathing-exercises/counting-each-exhale.mp3` },
      { title: "Rhythm Of The Breath Without Judgment — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/6-mindful-breathing-exercises/rhythm-of-the-breath.mp3` },
      { title: "The Beauty Of Your Breath — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/6-mindful-breathing-exercises/beauty-of-your-breath.mp3` },
      { title: "Breathing Space — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/6-mindful-breathing-exercises/breathing-space.mp3` },
      { title: "Five-Minute Breathing — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/6-mindful-breathing-exercises/5-minute-breathing.mp3` },
      { title: "Ten-Minute Breathing — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/6-mindful-breathing-exercises/breathing-10-minutes.mp3` },
      { title: "Fifteen-Minute Breathing — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/6-mindful-breathing-exercises/breathing-15-minutes.mp3` },
      { title: "Breathing In Care — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/6-mindful-breathing-exercises/breathing-in-care.mp3` },
      { title: "Creating Mental Space Through Mindful Breathing — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/6-mindful-breathing-exercises/creating-mental-space.mp3` },
      { title: "Feeling Embodied With Mindfulness — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/6-mindful-breathing-exercises/feeling-embodied.mp3` },
      { title: "Mindfulness of Breathing & Self-Care — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/cultivating-self-care/mindfulness-of-breathing-self-care.mp3` },
      { title: "Guided Meditation on the Breath — Long-Form Retreat by Gil Fronsdal", src: `${AUDIO_BASE}/6-mindful-breathing-exercises/gil-fronsdal-breath-2001.mp3` },
      { title: "Guided Meditation on the Breath — Guided Meditation by Gil Fronsdal", src: `${AUDIO_BASE}/6-mindful-breathing-exercises/gil-fronsdal-breath-2003.mp3` },
      { title: "Anapanasati: Four Forms of Mindfulness of Breathing — Guided Meditation by Gil Fronsdal", src: `${AUDIO_BASE}/6-mindful-breathing-exercises/gil-fronsdal-anapanasati-four-forms.mp3` },
      { title: "Guided Anapanasati Meditation: Knowing the Breath — Guided Meditation by Gil Fronsdal", src: `${AUDIO_BASE}/6-mindful-breathing-exercises/gil-fronsdal-anapana-knowing-the-breath.mp3` },
      { title: "Guided Anapanasati Meditation: Exploring the Breath — Guided Meditation by Gil Fronsdal", src: `${AUDIO_BASE}/6-mindful-breathing-exercises/gil-fronsdal-anapana-exploring-the-breath.mp3` },
      { title: "Guided Anapanasati Meditation: Relating to the Breath — Guided Meditation by Gil Fronsdal", src: `${AUDIO_BASE}/6-mindful-breathing-exercises/gil-fronsdal-anapana-relating-to-the-breath.mp3` },
      { title: "Guided Anapanasati Meditation: The Reassurance of the Breath — Guided Meditation by Gil Fronsdal", src: `${AUDIO_BASE}/6-mindful-breathing-exercises/gil-fronsdal-anapana-reassurance-of-the-breath.mp3` },
      { title: "Guided Anapanasati Meditation: Breath and Peripheral Awareness — Guided Meditation by Gil Fronsdal", src: `${AUDIO_BASE}/6-mindful-breathing-exercises/gil-fronsdal-anapana-breath-and-peripheral-awareness.mp3` },
      { title: "Guided Anapanasati Meditation: Exploring Impermanence and Awareness — Guided Meditation by Gil Fronsdal", src: `${AUDIO_BASE}/6-mindful-breathing-exercises/gil-fronsdal-anapana-exploring-impermanence-and-awareness.mp3` },
      { title: "Guided Anapanasati Meditation: Relaxing the Mental Formation — Guided Meditation by Gil Fronsdal", src: `${AUDIO_BASE}/6-mindful-breathing-exercises/gil-fronsdal-anapana-relaxing-the-mental-formation.mp3` },
      { title: "Guided Anapanasati Meditation: Relaxing Mental Formations by Being Present and Letting Go — Guided Meditation by Gil Fronsdal", src: `${AUDIO_BASE}/6-mindful-breathing-exercises/gil-fronsdal-anapana-relaxing-mental-formations-being-present-letting-go.mp3` },
      { title: "Guided Anapanasati Meditation: Noticing Ease and Effortlessness — Guided Meditation by Gil Fronsdal", src: `${AUDIO_BASE}/6-mindful-breathing-exercises/gil-fronsdal-anapana-noticing-ease-and-effortlessness.mp3` },
      { title: "Guided Anapanasati Meditation: Relaxing and Cultivating Joy and Ease — Guided Meditation by Gil Fronsdal", src: `${AUDIO_BASE}/6-mindful-breathing-exercises/gil-fronsdal-anapana-relaxing-cultivating-joy-ease.mp3` },
      { title: "Guided Anapanasati Meditation: Cultivating Well-Being — Guided Meditation by Gil Fronsdal", src: `${AUDIO_BASE}/6-mindful-breathing-exercises/gil-fronsdal-anapana-cultivating-well-being.mp3` },
      { title: "Guided Anapanasati Meditation: Noticing Absence and Little Cessations — Guided Meditation by Gil Fronsdal", src: `${AUDIO_BASE}/6-mindful-breathing-exercises/gil-fronsdal-anapana-noticing-absence-and-little-cessations.mp3` },
      { title: "Guided Anapanasati Meditation: Peripheral Awareness and Fading Away — Guided Meditation by Gil Fronsdal", src: `${AUDIO_BASE}/6-mindful-breathing-exercises/gil-fronsdal-anapana-peripheral-awareness-and-fading-away.mp3` },
      { title: "Guided Anapanasati Meditation: Impermanence, Fading Away and Letting Go — Guided Meditation by Gil Fronsdal", src: `${AUDIO_BASE}/6-mindful-breathing-exercises/gil-fronsdal-anapana-impermanence-fading-letting-go.mp3` },
      { title: "Guided Meditation: Journey of 3 Breaths — Guided Meditation by Gil Fronsdal", src: `${AUDIO_BASE}/6-mindful-breathing-exercises/gil-fronsdal-journey-of-3-breaths.mp3` },
      { title: "Dharma Talk: Attention Focused Narrow — Dharma Talk by Gil Fronsdal", src: `${AUDIO_BASE}/6-mindful-breathing-exercises/gil-fronsdal-attention-focused-narrow.mp3` },
      { title: "Foundations 02: Tranquil Breathing — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/6-mindful-breathing-exercises/foundations-02-tranquil-breathing.mp3` },
      { title: "Foundations 03: Meditation Basics — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/6-mindful-breathing-exercises/foundations-03-meditation-basics.mp3` },
      { title: "Foundations 04: Finger Switching — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/6-mindful-breathing-exercises/foundations-04-finger-switching.mp3` },
      { title: "Foundations 05: Breath Focus A — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/6-mindful-breathing-exercises/foundations-05-breath-focus-a.mp3` },
      { title: "Foundations 06: Head Switching — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/6-mindful-breathing-exercises/foundations-06-head-switching.mp3` },
      { title: "Foundations 07: Breath Focus B — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/6-mindful-breathing-exercises/foundations-07-breath-focus-b.mp3` },
      { title: "Foundations 08: Body Scan A — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/6-mindful-breathing-exercises/foundations-08-body-scan-a.mp3` },
      { title: "Foundations 09: Breath Focus C — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/6-mindful-breathing-exercises/foundations-09-breath-focus-c.mp3` },
      { title: "Foundations 10: Body Scan B — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/6-mindful-breathing-exercises/foundations-10-body-scan-b.mp3` },
      { title: "Foundations 11: Breath Focus D — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/6-mindful-breathing-exercises/foundations-11-breath-focus-d.mp3` },
      { title: "Foundations 12: Repeated Phrase A — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/6-mindful-breathing-exercises/foundations-12-repeated-phrase-a.mp3` },
      { title: "Foundations 13: Breath Focus E — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/6-mindful-breathing-exercises/foundations-13-breath-focus-e.mp3` },
      { title: "Foundations 14: Repeated Phrase B — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/6-mindful-breathing-exercises/foundations-14-repeated-phrase-b.mp3` },
      { title: "Foundations 15: Flexible Awareness — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/6-mindful-breathing-exercises/foundations-15-flexible-awareness.mp3` },
      { title: "Foundations 16: Noting A — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/6-mindful-breathing-exercises/foundations-16-noting-a.mp3` },
      { title: "Foundations 17: Noting B — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/6-mindful-breathing-exercises/foundations-17-noting-b.mp3` },
      { title: "Foundations 18: Noting C — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/6-mindful-breathing-exercises/foundations-18-noting-c.mp3` },
      { title: "Foundations 19: Noting Gone — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/6-mindful-breathing-exercises/foundations-19-noting-gone.mp3` },
      { title: "Foundations 20: Just Being — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/6-mindful-breathing-exercises/foundations-20-just-being.mp3` },
      { title: "Foundations 21: Emotional Priming — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/6-mindful-breathing-exercises/foundations-21-emotional-priming.mp3` },
      { title: "Foundations 22: Glimpse — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/6-mindful-breathing-exercises/foundations-22-glimpse.mp3` },
      { title: "Foundations 23: Aware of Awareness — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/6-mindful-breathing-exercises/foundations-23-aware-of-awareness.mp3` },
      { title: "Foundations 24: Headless Way — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/6-mindful-breathing-exercises/foundations-24-headless-way.mp3` },
      { title: "Foundations 25: Self-Inquiry A — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/6-mindful-breathing-exercises/foundations-25-self-inquiry-a.mp3` },
      { title: "Foundations 26: Yoga Nidra — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/6-mindful-breathing-exercises/foundations-26-yoga-nidra.mp3` },
      { title: "Foundations 27: Self-Inquiry B — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/6-mindful-breathing-exercises/foundations-27-self-inquiry-b.mp3` },
      { title: "Foundations 28: Reflection on Mortality — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/6-mindful-breathing-exercises/foundations-28-reflection-on-mortality.mp3` },
      { title: "Foundations 29: Self-Inquiry C — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/6-mindful-breathing-exercises/foundations-29-self-inquiry-c.mp3` },
      { title: "Foundations 30: Actualism — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/6-mindful-breathing-exercises/foundations-30-actualism.mp3` },
      { title: "Right Concentration — Dharma Talk by Shaila Catherine", src: `${AUDIO_BASE}/6-mindful-breathing-exercises/shaila-catherine-right-concentration.mp3` },
      { title: "Anapanasati Concentration / Samatha Meditation — Guided Meditation by Tina Rasmussen", src: `${AUDIO_BASE}/6-mindful-breathing-exercises/tina-rasmussen-anapanasati-concentration-samatha.mp3` },
      { title: "Lack of Continuity of Mindfulness and Concentration — Dharma Talk by Kate Munding", src: `${AUDIO_BASE}/6-mindful-breathing-exercises/kate-munding-lack-of-continuity-mindfulness-concentration.mp3` },
      { title: "One Complete Cycle of Breath — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/6-mindful-breathing-exercises/1-complete-cycle-of-breath.mp3` },
      { title: "Two Minutes of Mindful Breathing — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/6-mindful-breathing-exercises/2-minutes-of-mindful-breathing.mp3` },
      { title: "Three Mindful Breaths — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/6-mindful-breathing-exercises/3-mindful-breaths.mp3` },
      { title: "Interest and Investigation — Dharma Talk by Will Kabat-Zinn", src: `${AUDIO_BASE}/6-mindful-breathing-exercises/will-kabat-zinn-interest-and-investigation.mp3` },
      { title: "Nine Breathing Exercises to Release Dead Energies — Guided Meditation by Anam Thubten", src: `${AUDIO_BASE}/6-mindful-breathing-exercises/anam-thubten-nine-breathing-exercises-release-dead-energies.mp3` },
      { title: "Focused Attention and Open Awareness — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/6-mindful-breathing-exercises/focused-attention-and-open-awareness.mp3` },
      { title: "Focused Attention (Intermediate) — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/6-mindful-breathing-exercises/focused-attention-intermediate.mp3` },
    ],
  },
  "using-yoga-and-mindfulness-to-heal-trauma": {
    heading: "Listen: Finding Refuge in the Body",
    intro:
      "A trauma-sensitive guided meditation for slowly, gently rebuilding a sense of safety and belonging within your own body.",
    tracks: [
      { title: "Finding Refuge in the Body — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/using-yoga-and-mindfulness-to-heal-trauma/finding-refuge-in-the-body.mp3` },
    ],
  },
  "cope-with-difficult-emotions-through-mindfulness": {
    heading: "Listen: Difficult Emotions audio series",
    intro:
      "Guided meditations, dharma talks, and long-form retreat teachings on working with hard feelings — Exploring Frustration turns toward the heat of it with curiosity and care; Entering Into Difficulty (Gil Fronsdal) is a tender reflection on stepping closer, instead of away, when the difficult arises; Working With Afflictive Emotions (Joseph Goldstein) widens the lens with a longer retreat-style teaching; Guided Forgiveness Meditation (Gil Fronsdal) and Guided Forgiveness Meditation For Depression (Ronna Kabatznick) are classic forgiveness practices for releasing the weight of resentment, alongside two long-form forgiveness teachings from Tara Brach — A Forgiving Heart and Forgiving Ourselves and Others; Pain (Gil Fronsdal) is a long-form dharma talk on meeting physical and emotional pain with steady, kind awareness; the Working With Pain in Meditation and Daily Life series (Ines Freedman) offers three retreat-style sessions plus three guided practices — Emotional Reactions to Pain, Free-Floating in the Discomfort, and Local Intensity, Global Spread — for working skillfully with chronic and acute pain; Working with Pain and Recurring Thoughts and Working with Trauma (Tara Brach) bring practical, retreat-style guidance to two of the hardest places practice meets life; Dullness and Anger (Ajahn Sumedho) is a long-form Theravada teaching on meeting heavy, irritable, or shut-down states with patient awareness.",
    tracks: [
      { title: "Exploring Frustration — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/cope-with-difficult-emotions/exploring-frustration.mp3` },
      { title: "Entering Into Difficulty — Dharma Talk by Gil Fronsdal", src: `${AUDIO_BASE}/cope-with-difficult-emotions/entering-into-difficulty.mp3` },
      { title: "Working With Afflictive Emotions — Dharma Talk by Joseph Goldstein", src: `${AUDIO_BASE}/cope-with-difficult-emotions/working-with-afflictive-emotions.mp3` },
      { title: "Guided Forgiveness Meditation — Guided Meditation by Gil Fronsdal", src: `${AUDIO_BASE}/cope-with-difficult-emotions-through-mindfulness/gil-fronsdal-forgiveness.mp3` },
      { title: "Guided Forgiveness Meditation For Depression — Guided Meditation by Ronna Kabatznick", src: `${AUDIO_BASE}/kindness-for-your-thinking-mind/ronna-kabatznick-forgiveness-for-depression.mp3` },
      { title: "A Forgiving Heart — Guided Meditation by Tara Brach", src: `${AUDIO_BASE}/cope-with-difficult-emotions-through-mindfulness/tara-brach-a-forgiving-heart.mp3` },
      { title: "Forgiving Ourselves and Others — Guided Heart Meditation by Tara Brach", src: `${AUDIO_BASE}/cope-with-difficult-emotions-through-mindfulness/tara-brach-forgiving-ourselves-and-others.mp3` },
      { title: "Pain — Dharma Talk by Gil Fronsdal", src: `${AUDIO_BASE}/cope-with-difficult-emotions-through-mindfulness/gil-fronsdal-pain.mp3` },
      { title: "Working With Pain in Meditation and Daily Life — Week 1, Part 1 — Dharma Talk by Ines Freedman", src: `${AUDIO_BASE}/cope-with-difficult-emotions-through-mindfulness/ines-freedman-pain-wk1-pt1.mp3` },
      { title: "Working With Pain in Meditation and Daily Life — Week 1, Part 2 — Dharma Talk by Ines Freedman", src: `${AUDIO_BASE}/cope-with-difficult-emotions-through-mindfulness/ines-freedman-pain-wk1-pt2.mp3` },
      { title: "Working With Pain in Meditation and Daily Life — Week 2, Part 1 — Dharma Talk by Ines Freedman", src: `${AUDIO_BASE}/cope-with-difficult-emotions-through-mindfulness/ines-freedman-pain-wk2-pt1.mp3` },
      { title: "Emotional Reactions to Pain — Guided Meditation by Ines Freedman", src: `${AUDIO_BASE}/cope-with-difficult-emotions-through-mindfulness/ines-freedman-emotional-reactions-to-pain.mp3` },
      { title: "Free-Floating in the Discomfort — Guided Meditation by Ines Freedman", src: `${AUDIO_BASE}/cope-with-difficult-emotions-through-mindfulness/ines-freedman-free-floating-in-discomfort.mp3` },
      { title: "Local Intensity, Global Spread — Guided Meditation by Ines Freedman", src: `${AUDIO_BASE}/cope-with-difficult-emotions-through-mindfulness/ines-freedman-local-intensity-global-spread.mp3` },
      { title: "Working With Pain in Meditation and Daily Life — Week 2, Part 2 — Dharma Talk by Ines Freedman", src: `${AUDIO_BASE}/cope-with-difficult-emotions-through-mindfulness/ines-freedman-pain-wk2-pt2.mp3` },
      { title: "Working with Pain and Recurring Thoughts — Q&R by Tara Brach", src: `${AUDIO_BASE}/cope-with-difficult-emotions-through-mindfulness/tara-brach-working-with-pain-and-recurring-thoughts.mp3` },
      { title: "Working with Trauma — Morning Q&R by Tara Brach", src: `${AUDIO_BASE}/cope-with-difficult-emotions-through-mindfulness/tara-brach-working-with-trauma.mp3` },
      { title: "Dullness and Anger — Dharma Talk by Ajahn Sumedho", src: `${AUDIO_BASE}/cope-with-difficult-emotions-through-mindfulness/ajahn-sumedho-dullness-and-anger.mp3` },
      { title: "Dharmette: Responses vs Reactions — Dharma Talk by Gil Fronsdal", src: `${AUDIO_BASE}/cope-with-difficult-emotions-through-mindfulness/gil-fronsdal-dharmette-responses-vs-reactions.mp3` },
      { title: "RAIN: Working With Difficult Emotions — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/cope-with-difficult-emotions-through-mindfulness/rain-meditation.mp3` },
      { title: "Three Kinds of Craving — Dharma Talk by Will Kabat-Zinn", src: `${AUDIO_BASE}/cope-with-difficult-emotions-through-mindfulness/will-kabat-zinn-three-kinds-of-craving.mp3` },
      { title: "You Are Not Your Fault — Dharma Talk by Wes Nisker", src: `${AUDIO_BASE}/cope-with-difficult-emotions-through-mindfulness/wes-nisker-you-are-not-your-fault.mp3` },
      { title: "Transforming Suffering — Dharma Talk by Mark Coleman", src: `${AUDIO_BASE}/cope-with-difficult-emotions-through-mindfulness/mark-coleman-transforming-suffering.mp3` },
      { title: "Light Brings Out The Darkness, Darkness Brings Out The Light — Dharma Talk by James Baraz", src: `${AUDIO_BASE}/cope-with-difficult-emotions-through-mindfulness/james-baraz-light-brings-out-the-darkness-darkness-brings-out-the-light.mp3` },
      { title: "Equanimity: Finding Balance In Difficult Times — Dharma Talk by James Baraz", src: `${AUDIO_BASE}/cope-with-difficult-emotions-through-mindfulness/james-baraz-equanimity-finding-balance-in-difficult-times.mp3` },
      { title: "Practicing With Anger — Dharma Talk by Donald Rothberg", src: `${AUDIO_BASE}/cope-with-difficult-emotions-through-mindfulness/donald-rothberg-practicing-with-anger.mp3` },
      { title: "Practicing With Darkness and Light at the Winter Solstice — Dharma Talk by Donald Rothberg", src: `${AUDIO_BASE}/cope-with-difficult-emotions-through-mindfulness/donald-rothberg-practicing-with-darkness-and-light-at-the-winter-solstice.mp3` },
      { title: "Forgiveness Practice — Dharma Talk by Donald Rothberg", src: `${AUDIO_BASE}/cope-with-difficult-emotions-through-mindfulness/donald-rothberg-forgiveness-practice.mp3` },
      { title: "Equanimity — Dharma Talk by Donald Rothberg", src: `${AUDIO_BASE}/cope-with-difficult-emotions-through-mindfulness/donald-rothberg-equanimity.mp3` },
      { title: "Compassion With Attunement — Dharma Talk by Frank Ostaseski", src: `${AUDIO_BASE}/cope-with-difficult-emotions-through-mindfulness/frank-ostaseski-compassion-with-attunement.mp3` },
      { title: "Guided Meditation: The Practice of Forgiveness — Guided Meditation by Guy Armstrong", src: `${AUDIO_BASE}/cope-with-difficult-emotions-through-mindfulness/guy-armstrong-guided-meditation-the-practice-of-forgiveness.mp3` },
      { title: "Grief — Dharma Talk by Ajahn Brahm", src: `${AUDIO_BASE}/cope-with-difficult-emotions-through-mindfulness/ajahn-brahm-grief.mp3` },
      { title: "The Instinctual Body: Sex, Survival and Social Drives — Dharma Talk by Martin Aylward", src: `${AUDIO_BASE}/cope-with-difficult-emotions-through-mindfulness/martin-aylward-the-instinctual-body.mp3` },
      { title: "Love, Relationship, Sexuality and Dharma — Dharma Talk by Matthew Brensilver", src: `${AUDIO_BASE}/cope-with-difficult-emotions-through-mindfulness/matthew-brensilver-love-relationship-sexuality-and-dharma.mp3` },
      { title: "Guided Metta With Forgiveness — Guided Meditation by Kamala Masters", src: `${AUDIO_BASE}/cope-with-difficult-emotions-through-mindfulness/kamala-masters-guided-metta-with-forgiveness.mp3` },
      { title: "Guided Equanimity With Awareness Practice — Guided Meditation by Kamala Masters", src: `${AUDIO_BASE}/cope-with-difficult-emotions-through-mindfulness/kamala-masters-guided-equanimity-with-awareness-practice.mp3` },
      { title: "The Art of Renunciation — Dharma Talk by Joseph Goldstein", src: `${AUDIO_BASE}/cope-with-difficult-emotions-through-mindfulness/joseph-goldstein-the-art-of-renunciation.mp3` },
      { title: "The Realm of Hungry Ghosts: Working with Attachment and Addiction — Dharma Talk by Tara Brach", src: `${AUDIO_BASE}/cope-with-difficult-emotions-through-mindfulness/tara-brach-the-realm-of-hungry-ghosts.mp3` },
      { title: "The Noble Truths of Addiction and Recovery, Part 1 — Dharma Talk by Kevin Griffin", src: `${AUDIO_BASE}/cope-with-difficult-emotions-through-mindfulness/kevin-griffin-noble-truths-of-addiction-and-recovery-part-1.mp3` },
      { title: "The Noble Truths of Addiction and Recovery, Part 2 — Dharma Talk by Kevin Griffin", src: `${AUDIO_BASE}/cope-with-difficult-emotions-through-mindfulness/kevin-griffin-noble-truths-of-addiction-and-recovery-part-2.mp3` },
      { title: "The Noble Truths of Addiction and Recovery, Part 3 — Dharma Talk by Kevin Griffin", src: `${AUDIO_BASE}/cope-with-difficult-emotions-through-mindfulness/kevin-griffin-noble-truths-of-addiction-and-recovery-part-3.mp3` },
      { title: "The Noble Truths of Addiction and Recovery, Part 4 — Dharma Talk by Kevin Griffin", src: `${AUDIO_BASE}/cope-with-difficult-emotions-through-mindfulness/kevin-griffin-noble-truths-of-addiction-and-recovery-part-4.mp3` },
    ],
  },
  "an-anti-anxiety-gratitude-practice": {
    heading: "Listen: Anti-Anxiety Gratitude audio series",
    intro:
      "Three guided meditations for letting gratitude and gentle attention soften an anxious mind — Feeling Appreciative lets appreciation land in the chest as a quiet antidote to worry; Appreciating the Little Things turns warm attention to the small, ordinary moments that quietly hold the day together; Befriending Anxiety invites a softer, more allowing relationship with the anxious feeling itself.",
    tracks: [
      { title: "Feeling Appreciative — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/an-anti-anxiety-gratitude-practice/feeling-appreciative.mp3` },
      { title: "Appreciating the Little Things — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/an-anti-anxiety-gratitude-practice/appreciating-the-little-things.mp3` },
      { title: "Befriending Anxiety — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/an-anti-anxiety-gratitude-practice/befriending-anxiety.mp3` },
    ],
  },
  "meditation-inner-critic-audio": {
    heading: "Listen: The 3 Core Identities of the Critic",
    intro:
      "A short talk unpacking the three faces the inner critic tends to wear — and how seeing them clearly is the first step to loosening their grip.",
    tracks: [
      { title: "The 3 Core Identities of the Critic — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/inner-critic/three-core-identities.mp3` },
      { title: "Dharmette: Self-Conscious — Dharma Talk by Gil Fronsdal", src: `${AUDIO_BASE}/meditation-inner-critic-audio/gil-fronsdal-dharmette-self-conscious.mp3` },
      { title: "Guided Meditation on Working With the Inner Critic — Guided Meditation by Mark Coleman", src: `${AUDIO_BASE}/meditation-inner-critic-audio/mark-coleman-guided-meditation-on-working-with-the-inner-critic.mp3` },
    ],
  },
  "guided-meditation-inner-critic": {
    heading: "Listen: The 3 Core Identities of the Critic",
    intro:
      "A short talk unpacking the three faces the inner critic tends to wear — and how seeing them clearly is the first step to loosening their grip.",
    tracks: [
      { title: "The 3 Core Identities of the Critic — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/inner-critic/three-core-identities.mp3` },
      { title: "Dharmette: Self-Conscious — Dharma Talk by Gil Fronsdal", src: `${AUDIO_BASE}/meditation-inner-critic-audio/gil-fronsdal-dharmette-self-conscious.mp3` },
      { title: "Guided Meditation on Working With the Inner Critic — Guided Meditation by Mark Coleman", src: `${AUDIO_BASE}/meditation-inner-critic-audio/mark-coleman-guided-meditation-on-working-with-the-inner-critic.mp3` },
    ],
  },
  "when-mindfulness-meets-the-nervous-system": {
    heading: "Listen: Nervous System audio series",
    intro:
      "Three trauma-sensitive guided meditations — Mindfulness of Shame meets shame with steady awareness; How to Befriend Your Body, Your Emotions and Your Spirit invites a softer relationship with the whole of you; Anchoring Your Awareness Through Mindfulness offers a longer, settling practice for steadying an activated nervous system.",
    tracks: [
      { title: "Mindfulness of Shame — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/when-mindfulness-meets-the-nervous-system/mindfulness-of-shame.mp3` },
      { title: "How to Befriend Your Body, Your Emotions & Your Spirit — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/when-mindfulness-meets-the-nervous-system/befriend-body-emotions-spirit.mp3` },
      { title: "Anchoring Your Awareness Through Mindfulness — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/when-mindfulness-meets-the-nervous-system/anchoring-your-awareness-through-mindfulness.mp3` },
    ],
  },
  "growing-happiness-in-the-mind": {
    heading: "Listen: Happiness audio series",
    intro:
      "A guided meditation, a dharma talk, and a long-form retreat practice on happiness — Opening to Gladness lets small moments of joy land; Ripples of Happiness (Matthew Brensilver) explores how cultivated happiness ripples outward into relationship, work, and world; Gladdening the Mind (Tara Brach) is a long-form retreat-style guided meditation on intentionally lifting the heart by remembering what's already good.",
    tracks: [
      { title: "Opening to Gladness — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/growing-happiness-in-the-mind/opening-to-gladness.mp3` },
      { title: "Ripples of Happiness — Dharma Talk by Matthew Brensilver", src: `${AUDIO_BASE}/growing-happiness-in-the-mind/ripples-of-happiness.mp3` },
      { title: "Gladdening the Mind — Guided Meditation by Tara Brach", src: `${AUDIO_BASE}/growing-happiness-in-the-mind/tara-brach-gladdening-the-mind.mp3` },
    ],
  },
  "the-highest-form-of-happiness-rediscovering-peace": {
    heading: "Listen: Opening to Happiness",
    intro:
      "A guided meditation for softening into the kind of happiness that doesn't depend on circumstance — the steady, peaceful kind that lives beneath the noise.",
    tracks: [
      { title: "Opening to Happiness — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/highest-form-of-happiness/opening-to-happiness.mp3` },
      { title: "Daily Practices For Love & Happiness — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/highest-form-of-happiness/daily-practices-love-happiness.mp3` },
      { title: "Refreshing — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/the-highest-form-of-happiness-rediscovering-peace/refreshing-meditation.mp3` },
    ],
  },
  "visiting-your-safe-place": {
    heading: "Listen: Safe Place audio series",
    intro:
      "Two trauma-sensitive guided meditations — Sensing Into Safety notices the small signals of safety already present in the body, a gentle anchor for the nervous system; Guided Visualization for Ease & Well-Being uses imagery to settle into a felt sense of spacious, easeful belonging.",
    tracks: [
      { title: "Sensing Into Safety — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/visiting-your-safe-place/sensing-into-safety.mp3` },
      { title: "Guided Visualization For Ease & Well-Being — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/visiting-your-safe-place/guided-visualization-ease-wellbeing.mp3` },
    ],
  },
  "movement-meditation": {
    heading: "Listen: Seven Directions Meditation",
    intro:
      "A spacious guided meditation orienting awareness through the seven directions — front, back, left, right, above, below, and within — a practice of fully inhabiting your place in space.",
    tracks: [
      { title: "Seven Directions — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/movement-meditation/seven-directions.mp3` },
    ],
  },
  "cultivating-self-care-and-extending-it-out": {
    heading: "Listen: Self-Care audio series",
    intro:
      "Five gentle guided meditations for offering kind, attentive care to yourself — Tending to the Body softens you back into physical presence; Caring Awareness for the Head brings tenderness to a busy mind; Filling Your Cup is a longer replenishing practice for the days you've poured yourself empty; Mindfulness of Breathing & Self-Care weaves the breath into a fuller practice of tending to yourself; Mindful Eating turns slow, curious attention to the simple, daily act of nourishment.",
    tracks: [
      { title: "Tending to the Body — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/cultivating-self-care/tending-to-the-body.mp3` },
      { title: "Caring Awareness for the Head — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/cultivating-self-care/caring-awareness-for-the-head.mp3` },
      { title: "Filling Your Cup — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/cultivating-self-care/filling-your-cup.mp3` },
      { title: "Mindfulness of Breathing & Self-Care — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/cultivating-self-care/mindfulness-of-breathing-self-care.mp3` },
      { title: "Mindful Eating — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/cultivating-self-care/mindful-eating.mp3` },
    ],
  },
  "higher-self-meditation": {
    heading: "Listen: The Expanding Dimension of Time",
    intro:
      "A spacious guided meditation that softens the felt sense of time — opening into a wider, quieter awareness beneath the rush.",
    tracks: [
      { title: "The Expanding Dimension of Time — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/higher-self-meditation/expanding-dimension-of-time.mp3` },
      { title: "Dharmette: Practicing with Imagination — Dharma Talk by Gil Fronsdal", src: `${AUDIO_BASE}/higher-self-meditation/gil-fronsdal-dharmette-practicing-with-imagination.mp3` },
    ],
  },
  "what-rick-hansons-meditation-taught-me-about-truly-staying-present": {
    heading: "Listen: This Moment Is Like This",
    intro:
      "A grounding guided meditation for meeting whatever is here — pleasant, unpleasant, or in-between — with the simple acknowledgment: this moment is like this.",
    tracks: [
      { title: "This Moment Is Like This — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/rick-hansons-meditation-staying-present/this-moment-is-like-this.mp3` },
      { title: "Nowness, Wholeness, Allness, Oneness — Dharma Talk by Rick Hanson", src: `${AUDIO_BASE}/what-rick-hansons-meditation-taught-me-about-truly-staying-present/rick-hanson-nowness-wholeness-allness-oneness.mp3` },
      { title: "Self-Compassion (Part 1) — Dharma Talk by Rick Hanson", src: `${AUDIO_BASE}/what-rick-hansons-meditation-taught-me-about-truly-staying-present/rick-hanson-self-compassion-part-1.mp3` },
      { title: "Self-Compassion (Part 2) — Dharma Talk by Rick Hanson", src: `${AUDIO_BASE}/what-rick-hansons-meditation-taught-me-about-truly-staying-present/rick-hanson-self-compassion-part-2.mp3` },
      { title: "Using the Mind to Change the Brain — Dharma Talk by Rick Hanson", src: `${AUDIO_BASE}/what-rick-hansons-meditation-taught-me-about-truly-staying-present/rick-hanson-using-the-mind-to-change-the-brain.mp3` },
      { title: "Being for Yourself — Dharma Talk by Rick Hanson", src: `${AUDIO_BASE}/what-rick-hansons-meditation-taught-me-about-truly-staying-present/rick-hanson-being-for-yourself.mp3` },
      { title: "Self-Compassion Practice — Dharma Talk by Rick Hanson", src: `${AUDIO_BASE}/what-rick-hansons-meditation-taught-me-about-truly-staying-present/rick-hanson-self-compassion-practice.mp3` },
      { title: "The H.E.A.L. Steps to Happiness — Dharma Talk by Rick Hanson", src: `${AUDIO_BASE}/what-rick-hansons-meditation-taught-me-about-truly-staying-present/rick-hanson-the-heal-steps.mp3` },
      { title: "Me and We — Dharma Talk by Rick Hanson", src: `${AUDIO_BASE}/what-rick-hansons-meditation-taught-me-about-truly-staying-present/rick-hanson-me-and-we.mp3` },
      { title: "Intimacy with Linda Graham — Dharma Talk by Rick Hanson", src: `${AUDIO_BASE}/what-rick-hansons-meditation-taught-me-about-truly-staying-present/rick-hanson-intimacy-with-linda-graham.mp3` },
      { title: "Hardwiring Happiness — Guided Meditation by Rick Hanson", src: `${AUDIO_BASE}/what-rick-hansons-meditation-taught-me-about-truly-staying-present/rick-hanson-hardwiring-happiness.mp3` },
    ],
  },
  "kindness-for-your-thinking-mind": {
    heading: "Listen: Kindness for the Mind audio series",
    intro:
      "Guided meditations and dharma talks for meeting the mind with kindness — Three Centers grounds awareness in belly, heart, and head; Mind Appreciation turns warm attention to the mind itself; Mindfulness of Thoughts & Feelings (in two takes) practices noticing the inner weather without getting carried away; Thoughts and Emotions is a companion practice for working skillfully with what arises; Practice Notes: Soft Receptive Mind (Gil Fronsdal) invites a gentler, more open quality of attention to thinking; Practice Notes: Thinking as Scenery (Gil Fronsdal) reframes thoughts as the passing landscape of the mind, not the destination; Guided Forgiveness Meditation For Depression (Ronna Kabatznick) brings forgiveness practice specifically to the heaviness of depression, followed by her four-part Dharma and Depression series (Weeks 2–5) — a deeper retreat-style exploration of how the dharma meets the lived experience of depression; Sickness, Depression and One's Own Virtues (Ajahn Sumedho) is a long-form reflection on meeting heavy mind-states by remembering the goodness still within you.",
    tracks: [
      { title: "Three Centers — Belly, Heart & Head by Sean Fargo", src: `${AUDIO_BASE}/kindness-for-your-thinking-mind/three-centers.mp3` },
      { title: "Mind Appreciation — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/kindness-for-your-thinking-mind/mind-appreciation.mp3` },
      { title: "Mindfulness of Thoughts & Feelings — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/kindness-for-your-thinking-mind/mindfulness-of-thoughts-feelings.mp3` },
      { title: "Mindfulness of Thoughts & Feelings (Alternate Take) — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/kindness-for-your-thinking-mind/mindfulness-of-thoughts-feelings-v2.mp3` },
      { title: "Thoughts and Emotions — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/working-with-thoughts/thoughts-and-emotions.mp3` },
      { title: "Practice Notes: Soft Receptive Mind — Dharma Talk by Gil Fronsdal", src: `${AUDIO_BASE}/kindness-for-your-thinking-mind/soft-receptive-mind.mp3` },
      { title: "Practice Notes: Thinking as Scenery — Dharma Talk by Gil Fronsdal", src: `${AUDIO_BASE}/kindness-for-your-thinking-mind/practice-notes-thinking-as-scenery.mp3` },
      { title: "Guided Forgiveness Meditation For Depression — Guided Meditation by Ronna Kabatznick", src: `${AUDIO_BASE}/kindness-for-your-thinking-mind/ronna-kabatznick-forgiveness-for-depression.mp3` },
      { title: "Dharma and Depression — Week 2 — Dharma Talk by Ronna Kabatznick", src: `${AUDIO_BASE}/kindness-for-your-thinking-mind/ronna-kabatznick-dharma-and-depression-wk2.mp3` },
      { title: "Dharma and Depression — Week 3 — Dharma Talk by Ronna Kabatznick", src: `${AUDIO_BASE}/kindness-for-your-thinking-mind/ronna-kabatznick-dharma-and-depression-wk3.mp3` },
      { title: "Dharma and Depression — Week 4 — Dharma Talk by Ronna Kabatznick", src: `${AUDIO_BASE}/kindness-for-your-thinking-mind/ronna-kabatznick-dharma-and-depression-wk4.mp3` },
      { title: "Dharma and Depression — Week 5 — Dharma Talk by Ronna Kabatznick", src: `${AUDIO_BASE}/kindness-for-your-thinking-mind/ronna-kabatznick-dharma-and-depression-wk5.mp3` },
      { title: "Sickness, Depression and One's Own Virtues — Dharma Talk by Ajahn Sumedho", src: `${AUDIO_BASE}/kindness-for-your-thinking-mind/ajahn-sumedho-sickness-depression-virtues.mp3` },
      { title: "Heart Meditation: Letting Go of Judgment — Guided Meditation by Tara Brach", src: `${AUDIO_BASE}/kindness-for-your-thinking-mind/tara-brach-heart-meditation-letting-go-of-judgment.mp3` },
    ],
  },
  "power-of-acceptance": {
    heading: "Listen to the Acceptance audio series",
    intro:
      "Five guided meditations, a dharma talk, and a long-form retreat teaching on acceptance — welcoming this moment, meeting it as it is, and softening into life as it unfolds. Closes with Mindfulness as Strength (Gil Fronsdal), a short reflection on how steady, accepting awareness becomes its own kind of inner strength, and Letting Life Be Just As It Is (Tara Brach), a long-form retreat-style guided meditation on the quiet freedom of simply allowing.",
    tracks: [
      { title: "Part 1: Welcoming This Moment", src: `${AUDIO_BASE}/power-of-acceptance/welcoming-this-moment.mp3` },
      { title: "Part 2: Accepting This Present Moment As It Is", src: `${AUDIO_BASE}/power-of-acceptance/accepting-this-present-moment.mp3` },
      { title: "Part 3: I Am Capable of Meeting This Moment", src: `${AUDIO_BASE}/power-of-acceptance/capable-of-meeting-this-moment.mp3` },
      { title: "Part 4: How to Accept Life As It Unfolds", src: `${AUDIO_BASE}/power-of-acceptance/how-to-accept-life.mp3` },
      { title: "Part 5: Feeling Acceptance", src: `${AUDIO_BASE}/power-of-acceptance/feeling-acceptance.mp3` },
      { title: "Practice Notes: Mindfulness as Strength — Dharma Talk by Gil Fronsdal", src: `${AUDIO_BASE}/power-of-acceptance/mindfulness-as-strength.mp3` },
      { title: "Letting Life Be Just As It Is — Guided Meditation by Tara Brach", src: `${AUDIO_BASE}/power-of-acceptance/tara-brach-letting-life-be-just-as-it-is.mp3` },
      { title: "Dharma Talk: Nothing at Stake — Dharma Talk by Gil Fronsdal", src: `${AUDIO_BASE}/power-of-acceptance/gil-fronsdal-dharma-talk-nothing-at-stake.mp3` },
      { title: "Dharmette: Don't Pick It Up and Don't Reject It — Dharma Talk by Gil Fronsdal", src: `${AUDIO_BASE}/power-of-acceptance/gil-fronsdal-dharmette-dont-pick-it-up-dont-reject-it.mp3` },
      { title: "The Way It Is — Dharma Talk by Ajahn Sumedho", src: `${AUDIO_BASE}/power-of-acceptance/ajahn-sumedho-the-way-it-is.mp3` },
      { title: "Equanimity: The Sweet Joy of the Way — Dharma Talk by Spring Washam", src: `${AUDIO_BASE}/power-of-acceptance/spring-washam-equanimity-the-sweet-joy-of-the-way.mp3` },
    ],
  },
  "8-self-compassion-exercises-to-enhance-the-relationship-you-have-with-yourself": {
    heading: "Listen: Self-Compassion audio series",
    intro:
      "Guided meditations and long-form dharma teachings on self-compassion — 21-Day Compassion offers a steady daily practice; Nourishing Your Body With Attention turns kind, attentive presence toward the body itself; Compassion Meditation is a longer practice for opening the heart wide enough to hold both your own pain and the pain of others; Self-Compassion Meditation is an extended practice for offering yourself the same warmth and patience you'd offer a dear friend; Self-Compassion (Tara Brach) is a long-form retreat-style teaching on the radical act of meeting yourself with care; Rain of Compassion (Tara Brach) is a guided meditation in her signature RAIN practice for letting compassion soak into the hardest places; Tonglen (Tara Brach) is a Tibetan compassion practice for breathing in suffering and breathing out relief.",
    tracks: [
      { title: "21-Day Compassion — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/8-self-compassion-exercises/21-day-compassion.mp3` },
      { title: "Nourishing Your Body With Attention — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/8-self-compassion-exercises/nourishing-body-with-attention.mp3` },
      { title: "Compassion Meditation — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/8-self-compassion-exercises/compassion-meditation.mp3` },
      { title: "Self-Compassion Meditation — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/self-compassion-pause/self-compassion-meditation.mp3` },
      { title: "Self-Compassion — Dharma Talk by Tara Brach", src: `${AUDIO_BASE}/8-self-compassion-exercises/tara-brach-self-compassion.mp3` },
      { title: "Rain of Compassion — Guided Meditation by Tara Brach", src: `${AUDIO_BASE}/8-self-compassion-exercises/tara-brach-rain-of-compassion.mp3` },
      { title: "Tonglen — Compassion Practice by Tara Brach", src: `${AUDIO_BASE}/8-self-compassion-exercises/tara-brach-tonglen.mp3` },
      { title: "Dharmette: Tenderness — Dharma Talk by Gil Fronsdal", src: `${AUDIO_BASE}/8-self-compassion-exercises/gil-fronsdal-dharmette-tenderness.mp3` },
      { title: "Compassion — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/8-self-compassion-exercises-to-enhance-the-relationship-you-have-with-yourself/compassion.mp3` },
    ],
  },
  "mindfulness-body-scan-for-self-compassion": {
    heading: "Listen: Self-Compassion Body Scan audio series",
    intro:
      "Two guided body-scan meditations from Sean Fargo plus two long-form classics — How to Simply Be In The Body softens the urge to do and lets you rest into being; Body Appreciation tends to each part of you with gratitude and care; Guided Body Scan (Gil Fronsdal) is a slow, traditional body-scan practice for moving through the whole body with steady, unhurried attention; Body Scan (Ines Freedman) is a long-form retreat-style body scan for deepening the practice with patient, careful awareness.",
    tracks: [
      { title: "How to Simply Be In The Body — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/mindfulness-body-scan-for-self-compassion/how-to-simply-be-in-the-body.mp3` },
      { title: "Body Appreciation — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/mindfulness-body-scan-for-self-compassion/body-appreciation.mp3` },
      { title: "Guided Body Scan — Guided Meditation by Gil Fronsdal", src: `${AUDIO_BASE}/mindfulness-body-scan-for-stress-relief/gil-fronsdal-body-scan.mp3` },
      { title: "Body Scan — Guided Meditation by Ines Freedman", src: `${AUDIO_BASE}/mindfulness-body-scan-for-stress-relief/ines-freedman-body-scan.mp3` },
    ],
  },
  "guided-meditation-self-acceptance": {
    heading: "Listen: Self-Acceptance audio series",
    intro:
      "Guided meditations and dharma teachings on allowance — How to Allow Your Experience to Be What It Is meets whatever arises with allowance; Practice Notes: It's OK (Gil Fronsdal) is a tender reminder that this moment, too, is allowed to be exactly as it is; Letting Life Be Just As It Is (Tara Brach) is a long-form retreat-style guided meditation on the quiet freedom of simply allowing.",
    tracks: [
      { title: "How to Allow Your Experience to Be What It Is — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/guided-meditation-self-acceptance/how-to-allow-your-experience.mp3` },
      { title: "Practice Notes: It's OK — Dharma Talk by Gil Fronsdal", src: `${AUDIO_BASE}/guided-meditation-self-acceptance/practice-notes-its-ok.mp3` },
      { title: "Letting Life Be Just As It Is — Guided Meditation by Tara Brach", src: `${AUDIO_BASE}/power-of-acceptance/tara-brach-letting-life-be-just-as-it-is.mp3` },
    ],
  },
  "short-body-scan": {
    heading: "Listen: Body Scan Meditation",
    intro:
      "A grounding guided body scan — moving slowly through the body with kind, curious attention, returning you to the felt sense of being here.",
    tracks: [
      { title: "Body Scan — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/short-body-scan/body-scan-meditation.mp3` },
      { title: "Basic Body Scan and Breath Awareness — Guided Meditation by Tara Brach", src: `${AUDIO_BASE}/short-body-scan/tara-brach-basic-body-scan-and-breath-awareness.mp3` },
      { title: "Body Scan A — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/6-mindful-breathing-exercises/foundations-08-body-scan-a.mp3` },
      { title: "Body Scan B — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/6-mindful-breathing-exercises/foundations-10-body-scan-b.mp3` },
      { title: "Body Scan — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/short-body-scan/body-scan.mp3` },
    ],
  },
  "honoring-joanna-macy-a-tribute-to-a-visionary-of-interconnection-and-courage": {
    heading: "Listen: Cultivating Courage to Be With What Is",
    intro:
      "A guided meditation in the spirit of Joanna Macy's work — turning toward what is hard with steadiness and tender courage, instead of looking away.",
    tracks: [
      { title: "Cultivating Courage to Be With What Is — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/honoring-joanna-macy/cultivating-courage.mp3` },
    ],
  },
  "body-scan-advanced": {
    heading: "Listen: Sensing Into the Head and Neck",
    intro:
      "A guided body-scan meditation focused on the head and neck — softening the held tension we so often carry without noticing.",
    tracks: [
      { title: "Sensing Into the Head and Neck — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/body-scan-advanced/sensing-into-head-and-neck.mp3` },
      { title: "Body Scan A — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/6-mindful-breathing-exercises/foundations-08-body-scan-a.mp3` },
      { title: "Body Scan B — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/6-mindful-breathing-exercises/foundations-10-body-scan-b.mp3` },
    ],
  },
  "settling-into-presence": {
    heading: "Listen: Settling Into This Present Moment",
    intro:
      "A short guided meditation by Sean Fargo for letting the body, breath, and mind arrive — gently — into the simple presence of right now. Followed by a short dharma talk by Gil Fronsdal — Dharmette: A Fresh Start — on how each present moment offers a quiet chance to begin again. Plus Coming Back: Meditation Instructions with Q&A (Tara Brach) — a long-form retreat-style teaching on the simple, essential practice of returning to presence, again and again — and Mystery of Aliveness (Tara Brach), a guided meditation on resting in the bare wonder of being here. Grounded Silence (Sean Fargo) is a longer practice for letting silence itself become the anchor; Monday Night Class — Guided Meditation (Jack Kornfield) is a long-form retreat-style sit recorded live with Spirit Rock's Monday night sangha.",
    tracks: [
      { title: "Settling Into This Present Moment — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/settling-into-presence/settling-into-this-present-moment.mp3` },
      { title: "Grounded Silence — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/settling-into-presence/grounded-silence.mp3` },
      { title: "Dharmette: A Fresh Start — Dharma Talk by Gil Fronsdal", src: `${AUDIO_BASE}/settling-into-presence/dharmette-fresh-start.mp3` },
      { title: "Mystery of Aliveness — Guided Meditation by Tara Brach", src: `${AUDIO_BASE}/settling-into-presence/tara-brach-mystery-of-aliveness.mp3` },
      { title: "Coming Back: Meditation Instructions with Q&A — Dharma Talk by Tara Brach", src: `${AUDIO_BASE}/settling-into-presence/tara-brach-coming-back-meditation-instructions.mp3` },
      { title: "Monday Night Class — Guided Meditation by Jack Kornfield", src: `${AUDIO_BASE}/settling-into-presence/jack-kornfield-monday-night-class-2016-02-15.mp3` },
      { title: "Seeing Anew — Dharma Talk by Jack Kornfield", src: `${AUDIO_BASE}/settling-into-presence/jack-kornfield-seeing-anew.mp3` },
      { title: "Dharmette: Resolution to Present Details — Dharma Talk by Gil Fronsdal", src: `${AUDIO_BASE}/settling-into-presence/gil-fronsdal-resolution-to-present-details.mp3` },
      { title: "Everything Is Spiritual Practice — Dharma Talk by Sylvia Boorstein", src: `${AUDIO_BASE}/settling-into-presence/sylvia-boorstein-everything-is-spiritual-practice.mp3` },
      { title: "The Common Denominator — Dharma Talk by Will Kabat-Zinn", src: `${AUDIO_BASE}/settling-into-presence/will-kabat-zinn-the-common-denominator.mp3` },
      { title: "Awareness — Dharma Talk by Will Kabat-Zinn", src: `${AUDIO_BASE}/settling-into-presence/will-kabat-zinn-awareness.mp3` },
      { title: "Evolutionary Wisdom — Dharma Talk by Wes Nisker", src: `${AUDIO_BASE}/settling-into-presence/wes-nisker-evolutionary-wisdom.mp3` },
      { title: "The Most Important Thing — Dharma Talk by Mark Coleman", src: `${AUDIO_BASE}/settling-into-presence/mark-coleman-the-most-important-thing.mp3` },
      { title: "What's Up With Change? — Dharma Talk by Mark Coleman", src: `${AUDIO_BASE}/settling-into-presence/mark-coleman-whats-up-with-change.mp3` },
      { title: "Body and Mind Resting in One's Own Gaze — Guided Meditation by Akincano Marc Weber", src: `${AUDIO_BASE}/settling-into-presence/akincano-marc-weber-body-and-mind-resting-in-ones-own-gaze.mp3` },
      { title: "Resting the Mind — Dharma Talk by Kate Munding", src: `${AUDIO_BASE}/settling-into-presence/kate-munding-resting-the-mind.mp3` },
      { title: "The Floodlights of Awareness — Dharma Talk by Ajahn Sumedho", src: `${AUDIO_BASE}/settling-into-presence/ajahn-sumedho-floodlights-of-awareness.mp3` },
      { title: "Guided Meditation — Long-Form Retreat Practice by Jack Kornfield", src: `${AUDIO_BASE}/settling-into-presence/jack-kornfield-guided-meditation-2015-12-14.mp3` },
      { title: "Meditation: Getting Lost and Coming Back Here — Guided Meditation by Tara Brach", src: `${AUDIO_BASE}/settling-into-presence/tara-brach-meditation-getting-lost-and-coming-back-here.mp3` },
    ],
  },
  "affirmations-for-anxiety": {
    heading: "Listen: Anxiety audio series",
    intro:
      "Three guided meditations and a dharma talk for working with anxiety — Alleviating Anxiety meets anxious sensations with steady, kind awareness; Noticing The Presence of Anxiety practices simply seeing it clearly without becoming it; Befriending Anxiety invites a softer, more allowing relationship with the anxious feeling itself; Working With Fear (Joseph Goldstein) widens the lens with a longer reflection on meeting fear in practice.",
    tracks: [
      { title: "Alleviating Anxiety — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/affirmations-for-anxiety/alleviating-anxiety.mp3` },
      { title: "Noticing The Presence of Anxiety — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/affirmations-for-anxiety/noticing-presence-of-anxiety.mp3` },
      { title: "Befriending Anxiety — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/affirmations-for-anxiety/befriending-anxiety.mp3` },
      {
        title: "Working With Fear — Dharma Talk by Joseph Goldstein",
        src: `${AUDIO_BASE}/affirmations-for-anxiety/working-with-fear.mp3`,
        // Also featured on the 9-mindfulness-exercises-for-anxiety hub —
        // surface a link there for visitors who arrive here first.
        postSlug: "9-mindfulness-exercises-for-anxiety",
      },
      { title: "How to Feel Safe, Content and Connected — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/affirmations-for-anxiety/how-to-feel-safe-content-and-connected.mp3` },
      { title: "Fear and Doubt — Dharma Talk by Ajahn Sumedho", src: `${AUDIO_BASE}/affirmations-for-anxiety/ajahn-sumedho-fear-and-doubt.mp3` },
    ],
  },
  "three-60-second-meditation-techniques-for-anxiety": {
    heading: "Listen: Anxiety audio series",
    intro:
      "Guided meditations for working with anxiety — Befriending Anxiety invites a softer relationship with anxious feeling; Alleviating Tension (and an extended take) releases the held tightness it leaves behind; Standard Practice For Anxiety offers a steady, repeatable companion for harder moments; a five-part Micro-Meditation series of one- to two-minute resets; an SOS series (1, 3, and 5 minutes) for moments when anxiety spikes and you need a fast, steady anchor; and a Waiting series (1, 3, and 5 minutes) for turning the small in-between moments — lines, lobbies, traffic — into pockets of calm.",
    tracks: [
      { title: "Befriending Anxiety — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/three-60-second-anxiety/befriending-anxiety.mp3` },
      { title: "Alleviating Tension In Your Body & Mind — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/three-60-second-anxiety/alleviating-tension.mp3` },
      { title: "Alleviating Tension In Your Body & Mind (Extended Version) — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/three-60-second-anxiety/alleviating-tension-extended.mp3` },
      { title: "Standard Practice For Anxiety — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/three-60-second-anxiety/standard-practice-for-anxiety.mp3` },
      { title: "Micro-Meditation #1 — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/9-mindfulness-exercises-for-anxiety/micro-meditation-1.mp3` },
      { title: "Micro-Meditation #2 — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/9-mindfulness-exercises-for-anxiety/micro-meditation-2.mp3` },
      { title: "Micro-Meditation #3 — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/9-mindfulness-exercises-for-anxiety/micro-meditation-3.mp3` },
      { title: "Micro-Meditation #4 — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/9-mindfulness-exercises-for-anxiety/micro-meditation-4.mp3` },
      { title: "Micro-Meditation #5 — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/9-mindfulness-exercises-for-anxiety/micro-meditation-5.mp3` },
      { title: "SOS Meditation (1 Minute) — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/9-mindfulness-exercises-for-anxiety/sos-1-minute.mp3` },
      { title: "SOS Meditation (3 Minutes) — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/9-mindfulness-exercises-for-anxiety/sos-3-minutes.mp3` },
      { title: "SOS Meditation (5 Minutes) — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/9-mindfulness-exercises-for-anxiety/sos-5-minutes.mp3` },
      { title: "Waiting Meditation (1 Minute) — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/9-mindfulness-exercises-for-anxiety/waiting-1-minute.mp3` },
      { title: "Waiting Meditation (3 Minutes) — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/9-mindfulness-exercises-for-anxiety/waiting-3-minutes.mp3` },
      { title: "Waiting Meditation (5 Minutes) — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/9-mindfulness-exercises-for-anxiety/waiting-5-minutes.mp3` },
    ],
  },
  "bedtime-mindfulness": {
    heading: "Listen: Bedtime audio series",
    intro:
      "Slow, soothing guided meditations for the end of the day — Directing Your Awareness With Relaxation gently moves through the body using deep relaxation as the doorway into rest; Sleep (5 Minutes) is a short bedtime practice for the nights you just need help drifting off; Sleep (10 Minutes) is a longer wind-down for letting the day fully unwind; Sleep (15 Minutes) is an extended practice for nights when the mind is busy and you need a longer arc to fully let go.",
    tracks: [
      { title: "Directing Your Awareness With Relaxation — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/bedtime-mindfulness/directing-awareness-relaxation.mp3` },
      { title: "Sleep Meditation (5 Minutes) — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/8-sleep-meditations/sleep-5-minutes.mp3` },
      { title: "Sleep Meditation (10 Minutes) — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/8-sleep-meditations/sleep-10-minutes.mp3` },
      { title: "Sleep Meditation (15 Minutes) — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/8-sleep-meditations/sleep-15-minutes.mp3` },
    ],
  },
  "self-love-affirmations": {
    heading: "Listen: Self-Love audio series",
    intro:
      "A guided meditation plus a short dharma talk on quiet inner steadiness — Feeling Competent rests into the felt sense of your own capability; Confidence (Gil Fronsdal) is a tender reflection on the kind of confidence that doesn't need to prove anything to be true.",
    tracks: [
      { title: "Feeling Competent — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/self-love-affirmations/feeling-competent.mp3` },
      { title: "Confidence — Dharma Talk by Gil Fronsdal", src: `${AUDIO_BASE}/self-love-affirmations/confidence.mp3` },
    ],
  },
  "cultivating-joy": {
    heading: "Listen: Joy audio series",
    intro:
      "A guided meditation, a short dharma talk, and a long-form retreat practice on joy — Gratitude And Gladness softens you into the quiet gladness of being alive; Be Amazed: Wow (Gil Fronsdal) is a tender reminder of the simple wonder hiding in plain sight; Gladdening the Mind (Tara Brach) is a long-form retreat-style guided meditation on intentionally lifting the heart by remembering what's already good.",
    tracks: [
      { title: "Gratitude And Gladness — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/cultivating-joy/gratitude-and-gladness.mp3` },
      { title: "Be Amazed: Wow — Dharma Talk by Gil Fronsdal", src: `${AUDIO_BASE}/cultivating-joy/be-amazed-wow.mp3` },
      { title: "Gladdening the Mind — Guided Meditation by Tara Brach", src: `${AUDIO_BASE}/cultivating-joy/tara-brach-gladdening-the-mind.mp3` },
      { title: "Dharma Talk: Beautyful — Dharma Talk by Gil Fronsdal", src: `${AUDIO_BASE}/cultivating-joy/gil-fronsdal-dharma-talk-beautyful.mp3` },
      { title: "Dharma Talk: Drink Your Joy — Dharma Talk by Gil Fronsdal", src: `${AUDIO_BASE}/cultivating-joy/gil-fronsdal-dharma-talk-drink-your-joy.mp3` },
      { title: "Dharmette: What's Not Wrong — Dharma Talk by Gil Fronsdal", src: `${AUDIO_BASE}/cultivating-joy/gil-fronsdal-whats-not-wrong.mp3` },
      { title: "The Dharma — Dharma Talk by Miranda July", src: `${AUDIO_BASE}/cultivating-joy/miranda-july-the-dharma.mp3` },
      { title: "Heart Practices For Awakening Joy — Dharma Talk by James Baraz", src: `${AUDIO_BASE}/cultivating-joy/james-baraz-heart-practices-for-awakening-joy.mp3` },
      { title: "Awakening Joy For Kids: Bringing the Dharma to the Next Generation — Dharma Talk by James Baraz", src: `${AUDIO_BASE}/cultivating-joy/james-baraz-awakening-joy-for-kids.mp3` },
      { title: "Altruistic Joy — Dharma Talk by Howard Cohn", src: `${AUDIO_BASE}/cultivating-joy/howard-cohn-altruistic-joy.mp3` },
      { title: "Mudita — Guided Meditation by Zohar Lavie", src: `${AUDIO_BASE}/cultivating-joy/zohar-lavie-mudita-guided-meditation.mp3` },
    ],
  },
  "how-to-cultivate-an-attitude-of-gratitude-why-its-important": {
    heading: "Listen: Attitude of Gratitude audio series",
    intro:
      "Guided meditations and a long-form dharma talk on the felt sense of gratitude — Gratitude Is Not In The Words drops beneath language into the quiet warmth itself; Sharing Gratitude is a longer practice for letting appreciation move outward, into your relationships and into the world; Starting The Day With Gratitude is a morning practice for letting appreciation set the tone before anything else does; Gratitude Meditation is a fuller, ten-minute practice for sinking into appreciation as a whole-body experience; Gratitude and Generosity (Tara Brach) is a long-form retreat teaching on how appreciation naturally opens into giving.",
    tracks: [
      { title: "Gratitude Is Not In The Words — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/attitude-of-gratitude/gratitude-is-not-in-the-words.mp3` },
      { title: "Sharing Gratitude — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/how-to-cultivate-an-attitude-of-gratitude/sharing-gratitude.mp3` },
      { title: "Starting The Day With Gratitude — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/morning-affirmations/starting-the-day-with-gratitude.mp3` },
      { title: "Gratitude Meditation — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/power-of-gratitude-meditation/gratitude-meditation.mp3` },
      { title: "Gratitude and Generosity — Dharma Talk by Tara Brach", src: `${AUDIO_BASE}/power-of-gratitude-meditation/tara-brach-gratitude-and-generosity.mp3` },
      { title: "Generosity — Dharma Talk by Marcia Rose", src: `${AUDIO_BASE}/how-to-cultivate-an-attitude-of-gratitude-why-its-important/marcia-rose-generosity.mp3` },
      { title: "Generosity and Gratitude — Dharma Talk by Donald Rothberg", src: `${AUDIO_BASE}/how-to-cultivate-an-attitude-of-gratitude-why-its-important/donald-rothberg-generosity-and-gratitude.mp3` },
      { title: "Gratitude — Guided Meditation by Oren Jay Sofer", src: `${AUDIO_BASE}/how-to-cultivate-an-attitude-of-gratitude-why-its-important/oren-jay-sofer-gratitude.mp3` },
      { title: "12 Intentions of Gratitude — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/how-to-cultivate-an-attitude-of-gratitude-why-its-important/12-intentions-of-gratitude.mp3` },
      { title: "Gratitude — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/how-to-cultivate-an-attitude-of-gratitude-why-its-important/gratitude.mp3` },
      { title: "Ending The Day With Gratitude — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/how-to-cultivate-an-attitude-of-gratitude-why-its-important/ending-the-day-with-gratitude.mp3` },
      { title: "Experience of Gratitude — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/how-to-cultivate-an-attitude-of-gratitude-why-its-important/experience-of-gratitude.mp3` },
      { title: "Making Room for Gratitude — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/how-to-cultivate-an-attitude-of-gratitude-why-its-important/making-room-for-gratitude.mp3` },
    ],
  },
  "full-body-awareness": {
    heading: "Listen: Body Awareness audio series",
    intro:
      "A guided meditation plus a dharma talk on coming home to the body — Grounding uses the felt sense of contact and weight to steady the nervous system; Being Trusting In The Body (Gil Fronsdal) is a longer reflection on letting awareness rest, with confidence, in the body itself.",
    tracks: [
      { title: "Grounding — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/full-body-awareness/grounding.mp3` },
      { title: "Being Trusting In The Body — Dharma Talk by Gil Fronsdal", src: `${AUDIO_BASE}/full-body-awareness/being-trusting-in-the-body.mp3` },
      { title: "Four Domains for Mindfulness — Dharma Talk by Will Kabat-Zinn", src: `${AUDIO_BASE}/full-body-awareness/will-kabat-zinn-four-domains-for-mindfulness.mp3` },
      { title: "Directing Your Awareness With Relaxation — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/full-body-awareness/directing-your-awareness-with-relaxation.mp3` },
    ],
  },
  "power-of-gratitude-meditation-7-ways-to-cultivate-it": {
    heading: "Listen: Power of Gratitude audio series",
    intro:
      "Guided meditations and dharma talks on gratitude — Heart-Centered Gratitude opens the chest tenderly to what is already enough; The Power of Gratitude widens it into a daily way of seeing; Sharing Gratitude is a longer practice for letting appreciation flow outward; Gratitude Meditation is a fuller, ten-minute practice for sinking into appreciation as a whole-body experience; Gratitude (Gil Fronsdal) offers a contemplative reflection on gratitude as practice; Gratitude and Generosity (Tara Brach) is a long-form retreat teaching on how appreciation naturally opens into giving.",
    tracks: [
      { title: "Heart-Centered Gratitude — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/power-of-gratitude-meditation/heart-centered-gratitude.mp3` },
      { title: "The Power of Gratitude — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/power-of-gratitude-meditation/the-power-of-gratitude.mp3` },
      { title: "Sharing Gratitude — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/how-to-cultivate-an-attitude-of-gratitude/sharing-gratitude.mp3` },
      { title: "Gratitude Meditation — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/power-of-gratitude-meditation/gratitude-meditation.mp3` },
      { title: "Gratitude — Dharma Talk by Gil Fronsdal", src: `${AUDIO_BASE}/power-of-gratitude-meditation/gratitude-fronsdal.mp3` },
      { title: "Gratitude and Generosity — Dharma Talk by Tara Brach", src: `${AUDIO_BASE}/power-of-gratitude-meditation/tara-brach-gratitude-and-generosity.mp3` },
      { title: "Gratitude (Intermediate) — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/power-of-gratitude-meditation-7-ways-to-cultivate-it/gratitude-intermediate.mp3` },
    ],
  },
  "reduce-rumination-and-increase-positive-states-through-neuro-learning": {
    heading: "Listen: How To Stop Ruminating",
    intro:
      "A guided meditation for working skillfully with the looping mind — gently interrupting rumination and returning, again and again, to presence.",
    tracks: [
      { title: "How To Stop Ruminating — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/reduce-rumination/how-to-stop-ruminating.mp3` },
      { title: "Positive Future — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/reduce-rumination-and-increase-positive-states-through-neuro-learning/positive-future.mp3` },
    ],
  },
  "the-power-of-loving-kindness-how-to-cultivate-it": {
    heading: "Listen: Loving-Kindness audio series",
    intro:
      "A classic metta practice with Sean Fargo — extending warmth and goodwill first to yourself, then outward, in widening circles of care. Plus a long-form Guided Metta Meditation by Gil Fronsdal — a tender, traditional metta practice from one of the foremost Western teachers of loving-kindness. A two-part long-form retreat on the Brahmaviharas — the four boundless states of loving-kindness, compassion, sympathetic joy, and equanimity. Closes with Two Kinds of Happiness (Tara Brach), a long-form retreat teaching on the difference between the fleeting happiness of getting what we want and the steady happiness that arises from a kind, open heart.",
    tracks: [
      { title: "Loving-Kindness — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/power-of-loving-kindness/loving-kindness.mp3` },
      { title: "Loving-Kindness (Intermediate) — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/the-power-of-loving-kindness-how-to-cultivate-it/loving-kindness-intermediate.mp3` },
      { title: "Guided Metta Meditation — Guided Meditation by Gil Fronsdal", src: `${AUDIO_BASE}/the-power-of-loving-kindness-how-to-cultivate-it/gil-fronsdal-metta.mp3` },
      { title: "The Brahmaviharas, Part 1 — Long-Form Retreat Teaching", src: `${AUDIO_BASE}/the-power-of-loving-kindness-how-to-cultivate-it/brahmavihara-part-1.mp3` },
      { title: "The Brahmaviharas, Part 2 — Long-Form Retreat Teaching", src: `${AUDIO_BASE}/the-power-of-loving-kindness-how-to-cultivate-it/brahmavihara-part-2.mp3` },
      { title: "Two Kinds of Happiness — Dharma Talk by Tara Brach", src: `${AUDIO_BASE}/the-power-of-loving-kindness-how-to-cultivate-it/tara-brach-two-kinds-of-happiness.mp3` },
      { title: "Dharma Talk: Be Still and Gaze Upon Everything Kindly — Dharma Talk by Gil Fronsdal", src: `${AUDIO_BASE}/the-power-of-loving-kindness-how-to-cultivate-it/gil-fronsdal-dharma-talk-be-still-gaze-kindly.mp3` },
      { title: "Repeated Phrase A — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/6-mindful-breathing-exercises/foundations-12-repeated-phrase-a.mp3` },
      { title: "Repeated Phrase B — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/6-mindful-breathing-exercises/foundations-14-repeated-phrase-b.mp3` },
      { title: "How the Dalai Lama Did Not Say Something New — Dharma Talk by Sylvia Boorstein", src: `${AUDIO_BASE}/the-power-of-loving-kindness-how-to-cultivate-it/sylvia-boorstein-dalai-lama-not-something-new.mp3` },
      { title: "Teachings on the Calligraphy of Thich Nhat Hanh — Dharma Talk by Mark Coleman", src: `${AUDIO_BASE}/the-power-of-loving-kindness-how-to-cultivate-it/mark-coleman-calligraphy-of-thich-nhat-hanh.mp3` },
      { title: "Letting In The Love — Dharma Talk by James Baraz", src: `${AUDIO_BASE}/the-power-of-loving-kindness-how-to-cultivate-it/james-baraz-letting-in-the-love.mp3` },
      { title: "Hatred Never Ceases By Hatred — Dharma Talk by James Baraz", src: `${AUDIO_BASE}/the-power-of-loving-kindness-how-to-cultivate-it/james-baraz-hatred-never-ceases-by-hatred.mp3` },
      { title: "All About Love — Dharma Talk by Spring Washam", src: `${AUDIO_BASE}/the-power-of-loving-kindness-how-to-cultivate-it/spring-washam-all-about-love.mp3` },
      { title: "Love Is the Answer — Dharma Talk by Spring Washam", src: `${AUDIO_BASE}/the-power-of-loving-kindness-how-to-cultivate-it/spring-washam-love-is-the-answer.mp3` },
      { title: "Metta Cultivation, Concentration and Purification — Dharma Talk by Matthew Brensilver", src: `${AUDIO_BASE}/the-power-of-loving-kindness-how-to-cultivate-it/matthew-brensilver-metta-cultivation-concentration-and-purification.mp3` },
      { title: "Kindness for All Beings — Dharma Talk by Lila Kate Wheeler", src: `${AUDIO_BASE}/the-power-of-loving-kindness-how-to-cultivate-it/lila-kate-wheeler-kindness-for-all-beings.mp3` },
      { title: "Guided Metta With Forgiveness — Guided Meditation by Kamala Masters", src: `${AUDIO_BASE}/the-power-of-loving-kindness-how-to-cultivate-it/kamala-masters-guided-metta-with-forgiveness.mp3` },
      { title: "The Dharma of True Friendship — Dharma Talk by Kate Munding", src: `${AUDIO_BASE}/the-power-of-loving-kindness-how-to-cultivate-it/kate-munding-the-dharma-of-true-friendship.mp3` },
      { title: "The Fierce Heart — Dharma Talk by Spring Washam", src: `${AUDIO_BASE}/the-power-of-loving-kindness-how-to-cultivate-it/spring-washam-the-fierce-heart.mp3` },
      { title: "Purification Through Love — Dharma Talk by Spring Washam", src: `${AUDIO_BASE}/the-power-of-loving-kindness-how-to-cultivate-it/spring-washam-purification-through-love.mp3` },
    ],
  },
  "noting-your-judgments": {
    heading: "Listen: Noting & Non-Judgment audio series",
    intro:
      "Two guided meditations in the noting tradition, a long-form retreat-style heart practice, and a short companion dharmette — Noting Thinking or Feeling practices the simple distinction between thought and feeling; Resolving Judgments meets judgmental mind with steady, non-reactive awareness; Heart Meditation: Letting Go of Judgment (Tara Brach) is a tender guided meditation on softening the inner judge and returning to the kind, spacious heart underneath; Dharmette: Knowing, Noting and Calm (Gil Fronsdal) is a short reflection on how the simple practice of knowing and noting quietly steadies the heart into calm.",
    tracks: [
      { title: "Noting Thinking or Feeling — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/noting-your-judgments/noting-thinking-or-feeling.mp3` },
      { title: "Resolving Judgments — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/noting-your-judgments/resolving-judgments.mp3` },
      { title: "Heart Meditation: Letting Go of Judgment — Guided Meditation by Tara Brach", src: `${AUDIO_BASE}/noting-your-judgments/tara-brach-heart-meditation-letting-go-of-judgment.mp3` },
      { title: "Dharmette: Knowing, Noting and Calm — Dharma Talk by Gil Fronsdal", src: `${AUDIO_BASE}/noting-your-judgments/gil-fronsdal-dharmette-knowing-noting-and-calm.mp3` },
      { title: "Dharmette: Clear Seeing — Dharma Talk by Gil Fronsdal", src: `${AUDIO_BASE}/noting-your-judgments/gil-fronsdal-dharmette-clear-seeing.mp3` },
      { title: "Dharmette: Noticing — Dharma Talk by Gil Fronsdal", src: `${AUDIO_BASE}/noting-your-judgments/gil-fronsdal-dharmette-noticing.mp3` },
      { title: "Dharmette: Is That So? — Dharma Talk by Gil Fronsdal", src: `${AUDIO_BASE}/noting-your-judgments/gil-fronsdal-is-that-so.mp3` },
      { title: "Noting A — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/6-mindful-breathing-exercises/foundations-16-noting-a.mp3` },
      { title: "Noting B — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/6-mindful-breathing-exercises/foundations-17-noting-b.mp3` },
      { title: "Noting C — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/6-mindful-breathing-exercises/foundations-18-noting-c.mp3` },
      { title: "Noting Gone — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/6-mindful-breathing-exercises/foundations-19-noting-gone.mp3` },
      { title: "The Prison of Comparing — Dharma Talk by Will Kabat-Zinn", src: `${AUDIO_BASE}/noting-your-judgments/will-kabat-zinn-the-prison-of-comparing.mp3` },
      { title: "Noting With A Relaxed State of Mind — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/noting-your-judgments/noting-with-a-relaxed-state-of-mind.mp3` },
      { title: "The Tall Poppy and the Shrinking Violet — Dharma Talk by James Baraz", src: `${AUDIO_BASE}/noting-your-judgments/james-baraz-tall-poppy-and-shrinking-violet.mp3` },
      { title: "Working With The Judging Mind — Dharma Talk by James Baraz", src: `${AUDIO_BASE}/noting-your-judgments/james-baraz-working-with-the-judging-mind.mp3` },
      { title: "Working With & Transforming Judgment Mind — Dharma Talk by Donald Rothberg", src: `${AUDIO_BASE}/noting-your-judgments/donald-rothberg-working-with-transforming-judgment-mind.mp3` },
      { title: "Transforming the Judgmental Mind — Dharma Talk by Donald Rothberg", src: `${AUDIO_BASE}/noting-your-judgments/donald-rothberg-transforming-the-judgmental-mind.mp3` },
      { title: "Guided Mindfulness of Mind — Guided Meditation by Steve Armstrong", src: `${AUDIO_BASE}/noting-your-judgments/steve-armstrong-guided-mindfulness-of-mind.mp3` },
      { title: "Everybody's Crazy — Dharma Talk by Ajahn Sumedho", src: `${AUDIO_BASE}/noting-your-judgments/ajahn-sumedho-everybodys-crazy.mp3` },
    ],
  },
  "meditation-scripts-for-anxiety": {
    heading: "Listen: Observing Anxiety audio series",
    intro:
      "Two guided meditations for working with anxious mind — Observing Anxiety From A Distance steps back to watch the anxious thought from a steady, spacious distance instead of being swept inside it; Befriending Anxiety invites a softer, more allowing relationship with the anxious feeling itself.",
    tracks: [
      { title: "Observing Anxiety From A Distance — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/meditation-scripts-for-anxiety/observing-anxiety-from-a-distance.mp3` },
      { title: "Befriending Anxiety — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/meditation-scripts-for-anxiety/befriending-anxiety.mp3` },
    ],
  },
  "5-minute-meditation-script-from-mindfulness-exercises": {
    heading: "Listen: One Minute For Good",
    intro:
      "A short guided meditation — just a single minute to settle, soften, and remember the good already here.",
    tracks: [
      { title: "One Minute For Good — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/5-minute-meditation-script/one-minute-for-good.mp3` },
    ],
  },
  "awareness-of-the-five-senses": {
    heading: "Listen: Opening Your Senses",
    intro:
      "A guided meditation for arriving through the five senses — a fresh, embodied way back into the simple aliveness of right now.",
    tracks: [
      { title: "Opening Your Senses — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/awareness-of-the-five-senses/opening-your-senses.mp3` },
      { title: "Introduction to Seeing & Drawing — Dharma Talk by Marcia Rose", src: `${AUDIO_BASE}/awareness-of-the-five-senses/marcia-rose-introduction-to-seeing-drawing.mp3` },
      { title: "Introduction to Drawing Yourself — Dharma Talk by Marcia Rose", src: `${AUDIO_BASE}/awareness-of-the-five-senses/marcia-rose-introduction-to-drawing-yourself.mp3` },
      { title: "Mindful Eating — Guided Meditation by Sharon Salzberg", src: `${AUDIO_BASE}/awareness-of-the-five-senses/sharon-salzberg-mindful-eating.mp3` },
    ],
  },
  "mindfulness-body-scan-for-stress-relief": {
    heading: "Listen: Body & Stress Relief audio series",
    intro:
      "A guided body scan, a longer mindfulness-for-stress practice, and dharma teachings for softening held tension — Relaxing Your Body moves slowly through the body, region by region, into deeper rest; Mindfulness for Stress turns steady awareness toward what's tight, racing, or tense; Practice Notes: Relax The Eyes (Gil Fronsdal) turns kind attention to the small, often-overlooked tightness around the eyes that quietly carries a whole day's stress; Guided Body Scan (Gil Fronsdal) is a long-form, traditional body-scan practice for moving through the whole body with steady, unhurried attention; Body Scan (Ines Freedman) is a long-form retreat-style body scan for deepening the practice with patient, careful awareness.",
    tracks: [
      { title: "Relaxing Your Body — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/mindfulness-body-scan-for-stress-relief/relaxing-your-body.mp3` },
      { title: "Mindfulness for Stress — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/stress-quotes/mindfulness-for-stress.mp3` },
      { title: "Practice Notes: Relax The Eyes — Dharma Talk by Gil Fronsdal", src: `${AUDIO_BASE}/mindfulness-body-scan-for-stress-relief/relax-the-eyes.mp3` },
      { title: "Alleviating Tension In Body & Mind — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/mindfulness-body-scan-for-stress-relief/alleviating-tension-in-body-and-mind.mp3` },
      { title: "Basic Body Scan and Breath Awareness — Guided Meditation by Tara Brach", src: `${AUDIO_BASE}/mindfulness-body-scan-for-stress-relief/tara-brach-basic-body-scan-and-breath-awareness.mp3` },
      { title: "Guided Body Scan — Guided Meditation by Gil Fronsdal", src: `${AUDIO_BASE}/mindfulness-body-scan-for-stress-relief/gil-fronsdal-body-scan.mp3` },
      { title: "Body Scan — Guided Meditation by Ines Freedman", src: `${AUDIO_BASE}/mindfulness-body-scan-for-stress-relief/ines-freedman-body-scan.mp3` },
      { title: "Body Scan (Intermediate) — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/mindfulness-body-scan-for-stress-relief/body-scan-intermediate.mp3` },
      { title: "Finding Ease — Guided Meditation by Oren Jay Sofer", src: `${AUDIO_BASE}/mindfulness-body-scan-for-stress-relief/oren-jay-sofer-finding-ease.mp3` },
      { title: "Nine Breathing Exercises to Release Dead Energies — Guided Meditation by Anam Thubten", src: `${AUDIO_BASE}/mindfulness-body-scan-for-stress-relief/anam-thubten-nine-breathing-exercises-to-release-dead-energies.mp3` },
      { title: "Welcome Your Body Home — Guided Meditation by Spring Washam", src: `${AUDIO_BASE}/mindfulness-body-scan-for-stress-relief/spring-washam-welcome-your-body-home.mp3` },
    ],
  },
  "laying-down-meditation-visualizing-a-lake": {
    heading: "Listen: Sensing The Serenity Of A Lake",
    intro:
      "A laying-down guided visualization — letting the still, mirror-quiet of a mountain lake settle the mind and body.",
    tracks: [
      { title: "Sensing The Serenity Of A Lake — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/laying-down-meditation-visualizing-a-lake/sensing-serenity-of-a-lake.mp3` },
    ],
  },
  "morning-affirmations": {
    heading: "Listen: Morning Practice audio series",
    intro:
      "Grounding morning guided meditations plus a four-part Setting Your Intention series and a long-form retreat teaching — The Foundation For All Abundance settles into gratitude as the quiet foundation beneath every other kind of abundance; Starting The Day With Gratitude is a longer practice for letting appreciation set the tone before anything else does; Setting Your Intention (1, 3, and 5 minutes) gives you short, steady practices for naming how you want to meet the day; an alternate 5-minute take offers a second voice for the same practice; Morning Instruction and Q&R (Tara Brach) is a long-form retreat-style morning teaching with guided meditation and responses to practitioner questions.",
    tracks: [
      { title: "The Foundation For All Abundance — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/morning-affirmations/foundation-for-all-abundance.mp3` },
      { title: "Starting The Day With Gratitude — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/morning-affirmations/starting-the-day-with-gratitude.mp3` },
      { title: "Setting Your Intention (1 Minute) — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/morning-affirmations/intention-1-minute.mp3` },
      { title: "Setting Your Intention (3 Minutes) — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/morning-affirmations/intention-3-minutes.mp3` },
      { title: "Setting Your Intention (5 Minutes) — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/morning-affirmations/intention-5-minutes.mp3` },
      { title: "Setting Your Intention (5 Minutes, Alternate Take) — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/morning-affirmations/intention-5-minutes-v2.mp3` },
      { title: "Morning Instruction and Question Response — Dharma Talk by Tara Brach", src: `${AUDIO_BASE}/morning-affirmations/tara-brach-morning-instruction-and-question-response.mp3` },
    ],
  },
  "learning-the-secret-language-of-your-body-with-inna-segal": {
    heading: "Listen: Tuning Into Breath and Body",
    intro:
      "A guided meditation for listening inward — tuning the dial of attention to the quiet conversation between breath and body.",
    tracks: [
      { title: "Tuning Into Breath and Body — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/learning-the-secret-language-of-your-body/tuning-into-breath-and-body.mp3` },
    ],
  },
  "8-sleep-meditations-for-a-good-nights-rest": {
    heading: "Listen: Sleep audio series",
    intro:
      "Slow, soothing guided meditations for the end of the day — The Power of Gratitude For Sleep lets gratitude soften the body and quiet the mind; Sleep (5 Minutes) is a short bedtime practice for the nights you just need help drifting off; Sleep (10 Minutes) is a longer wind-down for letting the day fully unwind; Sleep (15 Minutes) is an extended practice for nights when the mind is busy and you need a longer arc to fully let go; Sleep Appreciation is a tender practice for settling into rest as the day's final act of self-care.",
    tracks: [
      { title: "The Power of Gratitude For Sleep — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/8-sleep-meditations/power-of-gratitude-for-sleep.mp3` },
      { title: "Sleep Meditation (5 Minutes) — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/8-sleep-meditations/sleep-5-minutes.mp3` },
      { title: "Sleep Meditation (10 Minutes) — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/8-sleep-meditations/sleep-10-minutes.mp3` },
      { title: "Sleep Meditation (15 Minutes) — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/8-sleep-meditations/sleep-15-minutes.mp3` },
      { title: "Sleep Appreciation — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/8-sleep-meditations/sleep-appreciation.mp3` },
      { title: "Lucid Dreaming Induction — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/8-sleep-meditations-for-a-good-nights-rest/lucid-dreaming-induction.mp3` },
    ],
  },
  "self-compassion-pause": {
    heading: "Listen: Self-Compassion Pause audio series",
    intro:
      "Self-compassion practices in different lengths plus long-form dharma teachings — The Voice of A Good Friend invites the same warmth, patience, and steady kindness you'd offer a close friend; Self-Compassion Meditation is an extended practice for letting that kindness sink in over a longer sit; Compassion Meditation is a longer practice for letting the heart soften into both your own pain and the pain of others; Self-Compassion (Tara Brach) is a long-form retreat-style teaching on the radical act of meeting yourself with care; Rain of Compassion (Tara Brach) is a guided meditation in her signature RAIN practice for letting compassion soak into the hardest places; Tonglen (Tara Brach) is a Tibetan compassion practice for breathing in suffering and breathing out relief.",
    tracks: [
      { title: "The Voice of A Good Friend — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/self-compassion-pause/voice-of-a-good-friend.mp3` },
      { title: "Self-Compassion Meditation — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/self-compassion-pause/self-compassion-meditation.mp3` },
      { title: "Compassion Meditation — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/8-self-compassion-exercises/compassion-meditation.mp3` },
      { title: "Self-Compassion — Dharma Talk by Tara Brach", src: `${AUDIO_BASE}/8-self-compassion-exercises/tara-brach-self-compassion.mp3` },
      { title: "Rain of Compassion — Guided Meditation by Tara Brach", src: `${AUDIO_BASE}/8-self-compassion-exercises/tara-brach-rain-of-compassion.mp3` },
      { title: "Tonglen — Compassion Practice by Tara Brach", src: `${AUDIO_BASE}/8-self-compassion-exercises/tara-brach-tonglen.mp3` },
    ],
  },
  "soft-belly": {
    heading: "Listen: Soft Belly audio series",
    intro:
      "Three grounding guided meditations using the belly and body as anchors — Touching Your Belly & Heart uses gentle touch (one hand on the belly, one on the heart) to settle the nervous system and feel held by your own presence; Soft Belly Breathing To Reduce Stress is a longer practice for softening the belly with each breath as a doorway out of fight-or-flight; Alleviating Tension In Body & Mind is a steady practice for releasing the held tightness that quietly accumulates through the day.",
    tracks: [
      { title: "Touching Your Belly & Heart — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/soft-belly/touching-your-belly-and-heart.mp3` },
      { title: "Soft Belly Breathing To Reduce Stress — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/soft-belly/soft-belly-breathing-to-reduce-stress.mp3` },
      { title: "Alleviating Tension In Body & Mind — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/soft-belly/alleviating-tension-in-body-and-mind.mp3` },
    ],
  },
  "what-the-world-needs": {
    heading: "Listen: What The World Needs",
    intro:
      "A guided meditation on offering what's most yours to give — a quiet practice of remembering that the world needs you alive, awake, and present.",
    tracks: [
      { title: "What The World Needs — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/what-the-world-needs/what-the-world-needs.mp3` },
      { title: "Climate Change: Waking Up in a Changing World — Dharma Talk by Mark Coleman", src: `${AUDIO_BASE}/what-the-world-needs/mark-coleman-climate-change-waking-up-in-a-changing-world.mp3` },
      { title: "A Life of Service — Dharma Talk by Mark Coleman", src: `${AUDIO_BASE}/what-the-world-needs/mark-coleman-a-life-of-service.mp3` },
      { title: "Peaceful Warrior In Modern Times — Dharma Talk by James Baraz", src: `${AUDIO_BASE}/what-the-world-needs/james-baraz-peaceful-warrior-in-modern-times.mp3` },
      { title: "Race, Racism and Spiritual Practice — Dharma Talk by Donald Rothberg", src: `${AUDIO_BASE}/what-the-world-needs/donald-rothberg-race-racism-and-spiritual-practice.mp3` },
      { title: "Dr. Martin Luther King, Jr., Buddhist Practice, and the Needs of Our Times — Dharma Talk by Donald Rothberg", src: `${AUDIO_BASE}/what-the-world-needs/donald-rothberg-mlk-buddhist-practice-and-the-needs-of-our-times.mp3` },
      { title: "History Is Ending Today — Dharma Talk by Matthew Brensilver", src: `${AUDIO_BASE}/what-the-world-needs/matthew-brensilver-history-is-ending-today.mp3` },
      { title: "Taking Refuge in Diversity — Dharma Talk by Spring Washam", src: `${AUDIO_BASE}/what-the-world-needs/spring-washam-taking-refuge-in-diversity.mp3` },
    ],
  },
  "loving-kindness-benefactor": {
    heading: "Listen: Wishing Care For Self and Others",
    intro:
      "A guided loving-kindness meditation by Sean Fargo — extending warm wishes of care first to yourself, then outward to a benefactor, a loved one, and beyond. Plus a long-form Guided Metta Meditation by Gil Fronsdal — a tender, traditional metta practice from one of the foremost Western teachers of loving-kindness.",
    tracks: [
      { title: "Wishing Care For Self and Others — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/loving-kindness-benefactor/wishing-care-for-self-and-others.mp3` },
      { title: "Guided Metta Meditation — Guided Meditation by Gil Fronsdal", src: `${AUDIO_BASE}/the-power-of-loving-kindness-how-to-cultivate-it/gil-fronsdal-metta.mp3` },
      { title: "Kindness for All Beings — Dharma Talk by Lila Kate Wheeler", src: `${AUDIO_BASE}/loving-kindness-benefactor/lila-kate-wheeler-kindness-for-all-beings.mp3` },
    ],
  },
  "the-importance-of-finding-quiet-time": {
    heading: "Listen: Quiet Time audio series",
    intro:
      "Three short dharma talks by Gil Fronsdal plus a long-form guided practice in silence — The Still, Quiet Place Within points to the silence that is always already here, beneath the noise of thought; Settle The Heart First is a tender reminder that before we ask the mind to settle, we tend, gently, to the heart; Dharmette: Windless Days is a short reflection on the rare, settled quality of mind that arrives — like a windless day — when the heart finally has space to be still; Grounded Silence (Sean Fargo) is an extended guided meditation on letting silence itself become the anchor.",
    tracks: [
      { title: "The Still, Quiet Place Within — Dharma Talk by Gil Fronsdal", src: `${AUDIO_BASE}/importance-of-finding-quiet-time/still-quiet-place-within.mp3` },
      { title: "Settle The Heart First — Dharma Talk by Gil Fronsdal", src: `${AUDIO_BASE}/importance-of-finding-quiet-time/settle-the-heart-first.mp3` },
      { title: "Dharmette: Windless Days — Dharma Talk by Gil Fronsdal", src: `${AUDIO_BASE}/the-importance-of-finding-quiet-time/gil-fronsdal-dharmette-windless-days.mp3` },
      { title: "Grounded Silence — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/the-importance-of-finding-quiet-time/grounded-silence.mp3` },
      { title: "Dharmette: Doing Nothing — Dharma Talk by Gil Fronsdal", src: `${AUDIO_BASE}/the-importance-of-finding-quiet-time/gil-fronsdal-dharmette-doing-nothing.mp3` },
      { title: "Dharma Talk: Pausing — Dharma Talk by Gil Fronsdal", src: `${AUDIO_BASE}/the-importance-of-finding-quiet-time/gil-fronsdal-dharma-talk-pausing.mp3` },
      { title: "It's About Time — Dharma Talk by Wes Nisker", src: `${AUDIO_BASE}/the-importance-of-finding-quiet-time/wes-nisker-its-about-time.mp3` },
      { title: "Poetry of Realization — Dharma Talk by Mark Coleman", src: `${AUDIO_BASE}/the-importance-of-finding-quiet-time/mark-coleman-poetry-of-realization.mp3` },
      { title: "Listening to the Sound of Silence — Dharma Talk by Ajahn Sumedho", src: `${AUDIO_BASE}/the-importance-of-finding-quiet-time/ajahn-sumedho-listening-to-the-sound-of-silence.mp3` },
    ],
  },
  "9-mindfulness-exercises-for-anxiety": {
    heading: "Listen: Anxiety audio series",
    intro:
      "On-the-go practices and long-form dharma teachings for working with anxiety — Working With Fear (Joseph Goldstein) is a retreat-style teaching on meeting fear with steady awareness; the Commute series offers one, three, and five-minute resets for the car, train, or sidewalk; the Micro-Meditation series gives five short resets (one to two minutes each) you can drop into anywhere; the SOS series (1, 3, and 5 minutes) is for moments when anxiety spikes and you need a fast, steady anchor; the Waiting series (1, 3, and 5 minutes) turns lines, lobbies, and traffic into pockets of calm; Breathing Anchor is a longer guided practice for steadying the mind on the rhythm of the breath when anxiety is loud; Guided Meditation (Gil Fronsdal) is a classic long-form practice for settling an unsettled mind; Paying Attention (Ajahn Sumedho) is a Theravada teaching on the simple, steadying power of attention itself; Beauty, Hope, Fear (Jack Kornfield) is a long-form retreat teaching on meeting fear within the wider field of beauty and hope.",
    tracks: [
      { title: "Working With Fear — Dharma Talk by Joseph Goldstein", src: `${AUDIO_BASE}/9-mindfulness-exercises-for-anxiety/working-with-fear.mp3` },
      { title: "Commute Meditation (1 Minute) — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/9-mindfulness-exercises-for-anxiety/commute-1-minute.mp3` },
      { title: "Commute Meditation (3 Minutes) — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/9-mindfulness-exercises-for-anxiety/commute-3-minutes.mp3` },
      { title: "Commute Meditation (5 Minutes) — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/9-mindfulness-exercises-for-anxiety/commute-5-minutes.mp3` },
      { title: "Micro-Meditation #1 — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/9-mindfulness-exercises-for-anxiety/micro-meditation-1.mp3` },
      { title: "Micro-Meditation #2 — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/9-mindfulness-exercises-for-anxiety/micro-meditation-2.mp3` },
      { title: "Micro-Meditation #3 — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/9-mindfulness-exercises-for-anxiety/micro-meditation-3.mp3` },
      { title: "Micro-Meditation #4 — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/9-mindfulness-exercises-for-anxiety/micro-meditation-4.mp3` },
      { title: "Micro-Meditation #5 — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/9-mindfulness-exercises-for-anxiety/micro-meditation-5.mp3` },
      { title: "SOS Meditation (1 Minute) — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/9-mindfulness-exercises-for-anxiety/sos-1-minute.mp3` },
      { title: "SOS Meditation (3 Minutes) — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/9-mindfulness-exercises-for-anxiety/sos-3-minutes.mp3` },
      { title: "SOS Meditation (5 Minutes) — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/9-mindfulness-exercises-for-anxiety/sos-5-minutes.mp3` },
      { title: "Waiting Meditation (1 Minute) — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/9-mindfulness-exercises-for-anxiety/waiting-1-minute.mp3` },
      { title: "Waiting Meditation (3 Minutes) — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/9-mindfulness-exercises-for-anxiety/waiting-3-minutes.mp3` },
      { title: "Waiting Meditation (5 Minutes) — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/9-mindfulness-exercises-for-anxiety/waiting-5-minutes.mp3` },
      { title: "Breathing Anchor — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/9-mindfulness-exercises-for-anxiety/breathing-anchor.mp3` },
      { title: "Guided Meditation — Long-Form Practice by Gil Fronsdal", src: `${AUDIO_BASE}/9-mindfulness-exercises-for-anxiety/gil-fronsdal-guided-meditation.mp3` },
      { title: "Paying Attention — Dharma Talk by Ajahn Sumedho", src: `${AUDIO_BASE}/9-mindfulness-exercises-for-anxiety/ajahn-sumedho-paying-attention.mp3` },
      { title: "Guided Meditation — Long-Form Retreat Practice by Joseph Goldstein", src: `${AUDIO_BASE}/9-mindfulness-exercises-for-anxiety/joseph-goldstein-guided-meditation.mp3` },
      { title: "Beauty, Hope, Fear — Dharma Talk by Jack Kornfield", src: `${AUDIO_BASE}/9-mindfulness-exercises-for-anxiety/jack-kornfield-beauty-hope-fear.mp3` },
    ],
  },
  "working-with-thoughts": {
    heading: "Listen: Working With Thought and Emotion",
    intro:
      "A dharma talk by Joseph Goldstein on meeting thoughts and emotions with awareness — seeing them clearly enough that they no longer have to run the show. Followed by two short companion dharma talks by Gil Fronsdal — Dharmette: Content vs Process on the freeing distinction between what the mind is thinking about and the simple fact that it's thinking, and Dharmette: Relating to It on the quiet shift from being inside our experience to skillfully relating to it. Plus two guided meditations: Mindfulness of Thoughts & Feelings — practicing noticing the inner weather without getting carried away — and Thoughts and Emotions, a companion practice for working skillfully with what arises.",
    tracks: [
      { title: "Working With Thought and Emotion — Dharma Talk by Joseph Goldstein", src: `${AUDIO_BASE}/working-with-thoughts/working-with-thought-and-emotion.mp3` },
      { title: "Dharmette: Content vs Process — Dharma Talk by Gil Fronsdal", src: `${AUDIO_BASE}/working-with-thoughts/dharmette-content-vs-process.mp3` },
      { title: "Dharmette: Relating to It — Dharma Talk by Gil Fronsdal", src: `${AUDIO_BASE}/working-with-thoughts/gil-fronsdal-dharmette-relating-to-it.mp3` },
      { title: "Dharmette: Resolve, Allow — Learning How to Know What's Skillful in the Moment — Dharma Talk by Gil Fronsdal", src: `${AUDIO_BASE}/working-with-thoughts/gil-fronsdal-dharmette-resolve-allow-skillful.mp3` },
      { title: "Mindfulness of Thoughts & Feelings — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/kindness-for-your-thinking-mind/mindfulness-of-thoughts-feelings.mp3` },
      { title: "Thoughts and Emotions — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/working-with-thoughts/thoughts-and-emotions.mp3` },
      { title: "Thinking — Dharma Talk by Matthew Brensilver", src: `${AUDIO_BASE}/working-with-thoughts/matthew-brensilver-thinking.mp3` },
      { title: "What Should I Think — Dharma Talk by Sylvia Boorstein", src: `${AUDIO_BASE}/working-with-thoughts/sylvia-boorstein-what-should-i-think.mp3` },
      { title: "Thinking and Reality — Dharma Talk by Will Kabat-Zinn", src: `${AUDIO_BASE}/working-with-thoughts/will-kabat-zinn-thinking-and-reality.mp3` },
      { title: "Meditation: A Sky-Like Mind — Guided Meditation by Tara Brach", src: `${AUDIO_BASE}/working-with-thoughts/tara-brach-meditation-a-sky-like-mind.mp3` },
      { title: "Meditation: Letting Thought Clouds Come and Go — Guided Meditation by Tara Brach", src: `${AUDIO_BASE}/working-with-thoughts/tara-brach-meditation-letting-thought-clouds-come-and-go.mp3` },
    ],
  },
  "guided-loving-kindness-meditation-audio": {
    heading: "Listen: The Kind Heart audio series",
    intro:
      "A dharma talk by Joseph Goldstein on metta and the kind heart — the slow, steady cultivation of friendliness toward self, others, and life itself. Plus a long-form Guided Metta Meditation by Gil Fronsdal — a tender, traditional metta practice from one of the foremost Western teachers of loving-kindness — and Monday Night Class — Guided Meditation (Jack Kornfield), a long-form retreat-style sit recorded live with Spirit Rock's Monday night sangha.",
    tracks: [
      { title: "The Kind Heart — Dharma Talk by Joseph Goldstein", src: `${AUDIO_BASE}/guided-loving-kindness-meditation-audio/the-kind-heart.mp3` },
      { title: "Guided Metta Meditation — Guided Meditation by Gil Fronsdal", src: `${AUDIO_BASE}/the-power-of-loving-kindness-how-to-cultivate-it/gil-fronsdal-metta.mp3` },
      { title: "Monday Night Class — Guided Meditation by Jack Kornfield", src: `${AUDIO_BASE}/guided-loving-kindness-meditation-audio/jack-kornfield-monday-night-class-2016-02-15.mp3` },
    ],
  },
  "reflections-on-slowing-down-self-love-and-inner-wisdom": {
    heading: "Listen: Every Moment a Chance to Restart",
    intro:
      "A short dharma talk by Gil Fronsdal — a quiet reminder that practice is never lost; every moment offers a fresh chance to begin again.",
    tracks: [
      { title: "Every Moment a Chance to Restart — Dharma Talk by Gil Fronsdal", src: `${AUDIO_BASE}/reflections-on-slowing-down/every-moment-a-chance-to-restart.mp3` },
      { title: "True Wisdom of the Eagle and Condor — Dharma Talk by Spring Washam", src: `${AUDIO_BASE}/reflections-on-slowing-down-self-love-and-inner-wisdom/spring-washam-true-wisdom-of-the-eagle-and-condor.mp3` },
    ],
  },
  "walking-meditation-worksheet-2": {
    heading: "Listen: Walking Meditation audio series",
    intro:
      "A dharma talk by Matthew Brensilver on walking meditation — instructions and reflections on bringing mindful presence into the simple act of putting one foot in front of the other. Plus a guided Walking Meditation by Sean Fargo for practicing it directly, step by step, and a companion Standing Meditation for grounding through the body before — or instead of — taking a single step. Closes with Standing and Walking Meditation Instructions (Tara Brach) — a long-form retreat-style teaching on both postures as gateways to embodied presence.",
    tracks: [
      { title: "Walking Meditation — Dharma Talk by Matthew Brensilver", src: `${AUDIO_BASE}/walking-meditation-worksheet/walking-meditation-talk.mp3` },
      { title: "Walking Meditation — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/walking-meditation-worksheet-2/walking.mp3` },
      { title: "Standing Meditation — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/walking-meditation-worksheet-2/standing.mp3` },
      { title: "Standing and Walking Meditation Instructions — Dharma Talk by Tara Brach", src: `${AUDIO_BASE}/walking-meditation-worksheet-2/tara-brach-standing-and-walking-instructions.mp3` },
      { title: "Walking Meditation — Guided Meditation by Sharon Salzberg", src: `${AUDIO_BASE}/walking-meditation-worksheet-2/sharon-salzberg-walking-meditation.mp3` },
      { title: "Walking Meditation (Long-Form Practice) — Guided Meditation by Sharon Salzberg", src: `${AUDIO_BASE}/walking-meditation-worksheet-2/sharon-salzberg-walking-meditation-long-form.mp3` },
    ],
  },
  "style-over-summit-what-dirtbag-billionaire-taught-me-about-practice": {
    heading: "Listen: Practice Notes audio series",
    intro:
      "Three short dharma talks by Gil Fronsdal — Practice Notes: Patience explores patience as the slow, steady willingness to stay with what's actually here, instead of leaning toward the next thing; Dharmette: Metaphors offers a playful look at the images and metaphors we live by, and how they quietly shape the practice itself; Choosing the Long Path of Practice is a tender reflection on the kind of practice that unfolds over years and lifetimes — choosing the long, steady path over the quick fix.",
    tracks: [
      { title: "Practice Notes: Patience — Dharma Talk by Gil Fronsdal", src: `${AUDIO_BASE}/style-over-summit/practice-notes-patience.mp3` },
      { title: "Dharmette: Metaphors — Dharma Talk by Gil Fronsdal", src: `${AUDIO_BASE}/style-over-summit/dharmette-metaphors.mp3` },
      { title: "Choosing the Long Path of Practice — Dharma Talk by Gil Fronsdal", src: `${AUDIO_BASE}/style-over-summit-what-dirtbag-billionaire-taught-me-about-practice/gil-fronsdal-choosing-the-long-path-of-practice.mp3` },
      { title: "Patience — Dharma Talk by Marcia Rose", src: `${AUDIO_BASE}/style-over-summit-what-dirtbag-billionaire-taught-me-about-practice/marcia-rose-patience.mp3` },
      { title: "The Problem With Being A Good Meditator — Dharma Talk by James Baraz", src: `${AUDIO_BASE}/style-over-summit-what-dirtbag-billionaire-taught-me-about-practice/james-baraz-the-problem-with-being-a-good-meditator.mp3` },
      { title: "The Spiritual Journey — Dharma Talk by Donald Rothberg", src: `${AUDIO_BASE}/style-over-summit-what-dirtbag-billionaire-taught-me-about-practice/donald-rothberg-the-spiritual-journey.mp3` },
      { title: "Failing Well — Dharma Talk by Matthew Brensilver", src: `${AUDIO_BASE}/style-over-summit-what-dirtbag-billionaire-taught-me-about-practice/matthew-brensilver-failing-well.mp3` },
      { title: "Practice Guided By Wisdom — Dharma Talk by Kittisaro", src: `${AUDIO_BASE}/style-over-summit-what-dirtbag-billionaire-taught-me-about-practice/kittisaro-practice-guided-by-wisdom.mp3` },
    ],
  },
  "supports-practice-audio": {
    heading: "Listen: Supports for Practice audio series",
    intro:
      "Three dharma talks by Matthew Brensilver on what holds practice up beneath the technique — Sincerity points to the quiet honesty that makes practice real; Limits of Technique reflects on where method ends and presence begins; Practice Notes: Vision turns toward the larger purpose that quietly orients a life of practice.",
    tracks: [
      { title: "Sincerity — Dharma Talk by Matthew Brensilver", src: `${AUDIO_BASE}/supports-practice-audio/sincerity.mp3` },
      { title: "Limits of Technique — Dharma Talk by Matthew Brensilver", src: `${AUDIO_BASE}/supports-practice-audio/limits-of-technique.mp3` },
      { title: "Practice Notes: Vision — Dharma Talk by Matthew Brensilver", src: `${AUDIO_BASE}/supports-practice-audio/vision.mp3` },
      { title: "Remembering Motivation — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/supports-practice-audio/remembering-motivation.mp3` },
      { title: "Wise Effort — Dharma Talk by Marcia Rose", src: `${AUDIO_BASE}/supports-practice-audio/marcia-rose-wise-effort.mp3` },
      { title: "Mindfulness With Attitude — Dharma Talk by James Baraz", src: `${AUDIO_BASE}/supports-practice-audio/james-baraz-mindfulness-with-attitude.mp3` },
      { title: "Knowing and Not Knowing — Dharma Talk by Matthew Brensilver", src: `${AUDIO_BASE}/supports-practice-audio/matthew-brensilver-knowing-and-not-knowing.mp3` },
      { title: "Morning Meditation Instructions — Guided Meditation by Joseph Goldstein", src: `${AUDIO_BASE}/supports-practice-audio/joseph-goldstein-morning-meditation-instructions.mp3` },
      { title: "Guided Mindfulness Meditation — Guided Meditation by Oren Jay Sofer", src: `${AUDIO_BASE}/supports-practice-audio/oren-jay-sofer-guided-mindfulness-meditation.mp3` },
      { title: "Guided Meditation: Exploring the Four Satipatthanas — Guided Meditation by Bhikkhu Anālayo", src: `${AUDIO_BASE}/supports-practice-audio/bhikkhu-analayo-guided-meditation-exploring-the-four-satipatthanas.mp3` },
      { title: "Guided Mindfulness of Mind — Guided Meditation by Steve Armstrong", src: `${AUDIO_BASE}/supports-practice-audio/steve-armstrong-guided-mindfulness-of-mind.mp3` },
      { title: "Faith — Dharma Talk by Kamala Masters", src: `${AUDIO_BASE}/supports-practice-audio/kamala-masters-faith.mp3` },
      { title: "Finding Ease — Guided Meditation by Oren Jay Sofer", src: `${AUDIO_BASE}/supports-practice-audio/oren-jay-sofer-finding-ease.mp3` },
      { title: "The Role of Motivation and Intention — Dharma Talk by Kate Munding", src: `${AUDIO_BASE}/supports-practice-audio/kate-munding-the-role-of-motivation-and-intention.mp3` },
      { title: "How to Feel Safe, Content and Connected — Guided Meditation by Sean Fargo", src: `${AUDIO_BASE}/supports-practice-audio/how-to-feel-safe-content-and-connected.mp3` },
      { title: "The Camel Knows the Way: Reflections on Faith — Dharma Talk by Spring Washam", src: `${AUDIO_BASE}/supports-practice-audio/spring-washam-the-camel-knows-the-way.mp3` },
    ],
  },
  "healing-stillness-aimless-love": {
    heading: "Listen: Teach Me To Care And Not To Care",
    intro:
      "A dharma talk by Gil Fronsdal taking T.S. Eliot's line as a doorway into equanimity — a love that cares deeply without grasping, and a stillness that holds it all.",
    tracks: [
      { title: "Teach Me To Care And Not To Care — Dharma Talk by Gil Fronsdal", src: `${AUDIO_BASE}/healing-stillness-aimless-love/teach-me-to-care-not-to-care.mp3` },
    ],
  },
  "is-it-selfish-to-want-happiness": {
    heading: "Listen: Practicing For Oneself Is Complicated",
    intro:
      "A short dharma talk by Matthew Brensilver — a tender, honest look at the tangled question of practicing for our own sake, and how care for self and care for others quietly fold into one another.",
    tracks: [
      { title: "Practicing For Oneself Is Complicated — Dharma Talk by Matthew Brensilver", src: `${AUDIO_BASE}/is-it-selfish-to-want-happiness/practicing-for-oneself-is-complicated.mp3` },
    ],
  },
  "20-mindfulness-lessons-i-wish-i-knew": {
    heading: "Listen: Practice Notes — Noticing What Works",
    intro:
      "A short dharma talk by Gil Fronsdal — a tender invitation to pay attention to what actually helps, and to let that quiet noticing become its own teacher.",
    tracks: [
      { title: "Practice Notes: Noticing What Works — Dharma Talk by Gil Fronsdal", src: `${AUDIO_BASE}/20-mindfulness-lessons/noticing-what-works.mp3` },
    ],
  },
  "discover-effortless-mindfulness-with-loch-kelly": {
    heading: "Listen: Practice Notes — In The Flow",
    intro:
      "A short dharma talk by Gil Fronsdal on the kind of practice that begins to move on its own — when attention, body, and breath quietly come into accord and effort softens into flow.",
    tracks: [
      { title: "Practice Notes: In The Flow — Dharma Talk by Gil Fronsdal", src: `${AUDIO_BASE}/discover-effortless-mindfulness/in-the-flow.mp3` },
    ],
  },
  "right-livelihood-and-vocation-audio": {
    heading: "Listen: Right Speech",
    intro:
      "A dharma talk by Joseph Goldstein on Right Speech — the slow, careful practice of letting our words match our deepest intentions, in everyday life as much as on the cushion.",
    tracks: [
      { title: "Right Speech — Dharma Talk by Joseph Goldstein", src: `${AUDIO_BASE}/right-livelihood-and-vocation-audio/right-speech.mp3` },
    ],
  },
  "mindfulness-meditation-and-the-space-in-between": {
    heading: "Listen: The Space In Between audio series",
    intro:
      "Three short dharma talks by Gil Fronsdal on space and ease — Practice Notes: Ease points to ease not as the absence of effort, but as the soft, spacious quality that lives in the in-between of practice; The Space Between turns toward the quiet gap between thoughts, breaths, and moments where awareness can rest; Dharmette: Space is a companion teaching on the inner roominess that opens when we stop crowding our experience. Plus a four-part long-form retreat series on Emptiness — the liberating teaching that what we take to be solid (self, thought, experience) is more open and spacious than the mind first assumes. Closes with Inner Space, Gateway to Awareness (Tara Brach) — a long-form guided meditation on resting in the spacious awareness that holds every passing experience — and Mystery of Aliveness (Tara Brach), a guided meditation on resting in the bare wonder of being here.",
    tracks: [
      { title: "Practice Notes: Ease — Dharma Talk by Gil Fronsdal", src: `${AUDIO_BASE}/mindfulness-meditation-and-the-space-in-between/ease.mp3` },
      { title: "The Space Between — Dharma Talk by Gil Fronsdal", src: `${AUDIO_BASE}/mindfulness-meditation-and-the-space-in-between/gil-fronsdal-the-space-between.mp3` },
      { title: "Dharmette: Space — Dharma Talk by Gil Fronsdal", src: `${AUDIO_BASE}/mindfulness-meditation-and-the-space-in-between/gil-fronsdal-dharmette-space.mp3` },
      { title: "Emptiness, Part 1 — Long-Form Retreat Teaching", src: `${AUDIO_BASE}/mindfulness-meditation-and-the-space-in-between/emptiness-part-1.mp3` },
      { title: "Emptiness, Part 2 — Long-Form Retreat Teaching", src: `${AUDIO_BASE}/mindfulness-meditation-and-the-space-in-between/emptiness-part-2.mp3` },
      { title: "Emptiness, Part 3 — Long-Form Retreat Teaching", src: `${AUDIO_BASE}/mindfulness-meditation-and-the-space-in-between/emptiness-part-3.mp3` },
      { title: "Emptiness, Part 4 — Long-Form Retreat Teaching", src: `${AUDIO_BASE}/mindfulness-meditation-and-the-space-in-between/emptiness-part-4.mp3` },
      { title: "Inner Space, Gateway to Awareness — Guided Meditation by Tara Brach", src: `${AUDIO_BASE}/mindfulness-meditation-and-the-space-in-between/tara-brach-inner-space-gateway-to-awareness.mp3` },
      { title: "Mystery of Aliveness — Guided Meditation by Tara Brach", src: `${AUDIO_BASE}/mindfulness-meditation-and-the-space-in-between/tara-brach-mystery-of-aliveness.mp3` },
    ],
  },
};

export function getPlaylist(slug: string | undefined): AudioPlaylist | null {
  if (!slug) return null;
  return AUDIO_PLAYLISTS[slug] ?? null;
}
