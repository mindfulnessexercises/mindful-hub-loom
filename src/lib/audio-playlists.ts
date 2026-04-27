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
      "Two calming tracks designed to slow the breath and quiet a busy mind — soft wisdom for moments when stress feels louder than you do. Plus a bonus guided meditation: Relieving Stress.",
    tracks: [
      { title: "Part 1: Stress Quotes", src: `${AUDIO_BASE}/stress-quotes/part-1.mp3` },
      { title: "Part 2: Stress Quotes", src: `${AUDIO_BASE}/stress-quotes/part-2.mp3` },
      { title: "Bonus: Relieving Stress — Guided Meditation", src: `${AUDIO_BASE}/stress-quotes/relieving-stress.mp3` },
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
      "Two affirming tracks of curated quotes and mindful pauses — a quiet reminder that your worth was never something you had to earn. Plus a bonus guided meditation: Feeling Worthy, and a short dharma talk by Gil Fronsdal — Power and Worthiness — exploring how a settled sense of worth becomes its own quiet form of strength.",
    tracks: [
      { title: "Part 1: Self-Worth Quotes", src: `${AUDIO_BASE}/self-worth-quotes/part-1.mp3` },
      { title: "Part 2: Self-Worth Quotes", src: `${AUDIO_BASE}/self-worth-quotes/part-2.mp3` },
      { title: "Bonus: Feeling Worthy — Guided Meditation", src: `${AUDIO_BASE}/self-worth-quotes/feeling-worthy.mp3` },
      { title: "Power and Worthiness — Dharma Talk by Gil Fronsdal", src: `${AUDIO_BASE}/self-worth-quotes/power-and-worthiness.mp3` },
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
      { title: "Contentment for Simply Being — Guided Meditation", src: `${AUDIO_BASE}/meditation-script-contentment/contentment-for-simply-being.mp3` },
      { title: "Practice Notes: Contentment — Dharma Talk by Gil Fronsdal", src: `${AUDIO_BASE}/meditation-script-contentment/practice-notes-contentment.mp3` },
    ],
  },
  "awareness-of-the-four-elements": {
    heading: "Listen: Body Awareness audio series",
    intro:
      "Two guided meditations for inhabiting the body — Elemental Body Awareness moves through earth, water, fire, and air; How to Come Home to the Body offers a slower return to physical presence.",
    tracks: [
      { title: "Elemental Body Awareness — Guided Meditation", src: `${AUDIO_BASE}/awareness-of-the-four-elements/elemental-body-awareness.mp3` },
      { title: "How to Come Home to the Body — Guided Meditation", src: `${AUDIO_BASE}/awareness-of-the-four-elements/come-home-to-the-body.mp3` },
    ],
  },
  "how-to-practice-mindfulness-of-death-and-why-its-important": {
    heading: "Listen: Mindfulness of Death",
    intro:
      "A tender guided meditation on the truth of impermanence — not as fear, but as an invitation to live this life more awake, more honest, more grateful.",
    tracks: [
      { title: "Mindfulness of Death — Guided Meditation", src: `${AUDIO_BASE}/how-to-practice-mindfulness-of-death/mindfulness-of-death.mp3` },
    ],
  },
  "feeling-tones-pleasant-unpleasant-neutral": {
    heading: "Listen: Mindfulness of Feeling Tones",
    intro:
      "A guided meditation on vedanā — the subtle tone of pleasant, unpleasant, or neutral that colors every experience before we even notice it.",
    tracks: [
      { title: "Mindfulness of Feeling Tones — Guided Meditation", src: `${AUDIO_BASE}/feeling-tones-pleasant-unpleasant-neutral/mindfulness-of-feeling-tones.mp3` },
    ],
  },
  "10-tips-for-teaching-mindfulness-of-breathing-practices": {
    heading: "Listen: Mindfulness of Breathing",
    intro:
      "A guided meditation on the foundational practice — resting attention on the breath, returning gently each time the mind wanders.",
    tracks: [
      { title: "Mindfulness of Breathing — Guided Meditation", src: `${AUDIO_BASE}/10-tips-teaching-mindfulness-of-breathing/mindfulness-of-breathing.mp3` },
    ],
  },
  "6-mindful-breathing-exercises": {
    heading: "Listen: Mindful Breathing audio series",
    intro:
      "Four guided meditations for meeting the breath with fresh attention — from curiosity, to embodied awareness, to counting each exhale, to resting in the rhythm of the breath without judgment.",
    tracks: [
      { title: "Breathing With Curiosity — Guided Meditation", src: `${AUDIO_BASE}/6-mindful-breathing-exercises/breathing-with-curiosity.mp3` },
      { title: "Embodied Awareness of Breathing — Guided Meditation", src: `${AUDIO_BASE}/6-mindful-breathing-exercises/embodied-awareness-of-breathing.mp3` },
      { title: "Counting Each Exhale — Guided Meditation", src: `${AUDIO_BASE}/6-mindful-breathing-exercises/counting-each-exhale.mp3` },
      { title: "Rhythm Of The Breath Without Judgment — Guided Meditation", src: `${AUDIO_BASE}/6-mindful-breathing-exercises/rhythm-of-the-breath.mp3` },
    ],
  },
  "using-yoga-and-mindfulness-to-heal-trauma": {
    heading: "Listen: Finding Refuge in the Body",
    intro:
      "A trauma-sensitive guided meditation for slowly, gently rebuilding a sense of safety and belonging within your own body.",
    tracks: [
      { title: "Finding Refuge in the Body — Guided Meditation", src: `${AUDIO_BASE}/using-yoga-and-mindfulness-to-heal-trauma/finding-refuge-in-the-body.mp3` },
    ],
  },
  "cope-with-difficult-emotions-through-mindfulness": {
    heading: "Listen: Difficult Emotions audio series",
    intro:
      "A guided meditation plus a short dharma talk for working with hard feelings — Exploring Frustration turns toward the heat of it with curiosity and care; Entering Into Difficulty (Gil Fronsdal) is a tender reflection on how we step closer, instead of away, when the difficult arises.",
    tracks: [
      { title: "Exploring Frustration — Guided Meditation", src: `${AUDIO_BASE}/cope-with-difficult-emotions/exploring-frustration.mp3` },
      { title: "Entering Into Difficulty — Dharma Talk by Gil Fronsdal", src: `${AUDIO_BASE}/cope-with-difficult-emotions/entering-into-difficulty.mp3` },
    ],
  },
  "an-anti-anxiety-gratitude-practice": {
    heading: "Listen: Feeling Appreciative",
    intro:
      "A guided meditation for softening the chest with appreciation — letting gratitude land in the body as a quiet antidote to anxious mind.",
    tracks: [
      { title: "Feeling Appreciative — Guided Meditation", src: `${AUDIO_BASE}/an-anti-anxiety-gratitude-practice/feeling-appreciative.mp3` },
    ],
  },
  "meditation-inner-critic-audio": {
    heading: "Listen: The 3 Core Identities of the Critic",
    intro:
      "A short talk unpacking the three faces the inner critic tends to wear — and how seeing them clearly is the first step to loosening their grip.",
    tracks: [
      { title: "The 3 Core Identities of the Critic", src: `${AUDIO_BASE}/inner-critic/three-core-identities.mp3` },
    ],
  },
  "guided-meditation-inner-critic": {
    heading: "Listen: The 3 Core Identities of the Critic",
    intro:
      "A short talk unpacking the three faces the inner critic tends to wear — and how seeing them clearly is the first step to loosening their grip.",
    tracks: [
      { title: "The 3 Core Identities of the Critic", src: `${AUDIO_BASE}/inner-critic/three-core-identities.mp3` },
    ],
  },
  "when-mindfulness-meets-the-nervous-system": {
    heading: "Listen: Nervous System audio series",
    intro:
      "Two trauma-sensitive guided meditations — Mindfulness of Shame meets shame with steady awareness; How to Befriend Your Body, Your Emotions and Your Spirit invites a softer relationship with the whole of you.",
    tracks: [
      { title: "Mindfulness of Shame — Guided Meditation", src: `${AUDIO_BASE}/when-mindfulness-meets-the-nervous-system/mindfulness-of-shame.mp3` },
      { title: "How to Befriend Your Body, Your Emotions & Your Spirit — Guided Meditation", src: `${AUDIO_BASE}/when-mindfulness-meets-the-nervous-system/befriend-body-emotions-spirit.mp3` },
    ],
  },
  "growing-happiness-in-the-mind": {
    heading: "Listen: Happiness audio series",
    intro:
      "A guided meditation plus a dharma talk on happiness — Opening to Gladness lets small moments of joy land; Ripples of Happiness (Matthew Brensilver) explores how cultivated happiness ripples outward into relationship, work, and world.",
    tracks: [
      { title: "Opening to Gladness — Guided Meditation", src: `${AUDIO_BASE}/growing-happiness-in-the-mind/opening-to-gladness.mp3` },
      { title: "Ripples of Happiness — Dharma Talk by Matthew Brensilver", src: `${AUDIO_BASE}/growing-happiness-in-the-mind/ripples-of-happiness.mp3` },
    ],
  },
  "the-highest-form-of-happiness-rediscovering-peace": {
    heading: "Listen: Opening to Happiness",
    intro:
      "A guided meditation for softening into the kind of happiness that doesn't depend on circumstance — the steady, peaceful kind that lives beneath the noise.",
    tracks: [
      { title: "Opening to Happiness — Guided Meditation", src: `${AUDIO_BASE}/highest-form-of-happiness/opening-to-happiness.mp3` },
      { title: "Daily Practices For Love & Happiness — Guided Meditation", src: `${AUDIO_BASE}/highest-form-of-happiness/daily-practices-love-happiness.mp3` },
    ],
  },
  "visiting-your-safe-place": {
    heading: "Listen: Sensing Into Safety",
    intro:
      "A trauma-sensitive guided meditation for noticing the small signals of safety already present in the body — a gentle anchor for the nervous system.",
    tracks: [
      { title: "Sensing Into Safety — Guided Meditation", src: `${AUDIO_BASE}/visiting-your-safe-place/sensing-into-safety.mp3` },
    ],
  },
  "movement-meditation": {
    heading: "Listen: Seven Directions Meditation",
    intro:
      "A spacious guided meditation orienting awareness through the seven directions — front, back, left, right, above, below, and within — a practice of fully inhabiting your place in space.",
    tracks: [
      { title: "Seven Directions — Guided Meditation", src: `${AUDIO_BASE}/movement-meditation/seven-directions.mp3` },
    ],
  },
  "cultivating-self-care-and-extending-it-out": {
    heading: "Listen: Self-Care audio series",
    intro:
      "Two gentle guided meditations for offering kind, attentive care to yourself — Tending to the Body softens you back into physical presence; Caring Awareness for the Head brings tenderness to a busy mind.",
    tracks: [
      { title: "Tending to the Body — Guided Meditation", src: `${AUDIO_BASE}/cultivating-self-care/tending-to-the-body.mp3` },
      { title: "Caring Awareness for the Head — Guided Meditation", src: `${AUDIO_BASE}/cultivating-self-care/caring-awareness-for-the-head.mp3` },
    ],
  },
  "higher-self-meditation": {
    heading: "Listen: The Expanding Dimension of Time",
    intro:
      "A spacious guided meditation that softens the felt sense of time — opening into a wider, quieter awareness beneath the rush.",
    tracks: [
      { title: "The Expanding Dimension of Time — Guided Meditation", src: `${AUDIO_BASE}/higher-self-meditation/expanding-dimension-of-time.mp3` },
    ],
  },
  "what-rick-hansons-meditation-taught-me-about-truly-staying-present": {
    heading: "Listen: This Moment Is Like This",
    intro:
      "A grounding guided meditation for meeting whatever is here — pleasant, unpleasant, or in-between — with the simple acknowledgment: this moment is like this.",
    tracks: [
      { title: "This Moment Is Like This — Guided Meditation", src: `${AUDIO_BASE}/rick-hansons-meditation-staying-present/this-moment-is-like-this.mp3` },
    ],
  },
  "kindness-for-your-thinking-mind": {
    heading: "Listen: Kindness for the Mind audio series",
    intro:
      "A guided meditation plus a short dharma talk for meeting the mind with kindness — Three Centers grounds awareness in belly, heart, and head; Practice Notes: Soft Receptive Mind (Gil Fronsdal) invites a gentler, more open quality of attention to thinking itself.",
    tracks: [
      { title: "Three Centers — Belly, Heart & Head", src: `${AUDIO_BASE}/kindness-for-your-thinking-mind/three-centers.mp3` },
      { title: "Practice Notes: Soft Receptive Mind — Dharma Talk by Gil Fronsdal", src: `${AUDIO_BASE}/kindness-for-your-thinking-mind/soft-receptive-mind.mp3` },
    ],
  },
  "power-of-acceptance": {
    heading: "Listen to the Acceptance audio series",
    intro:
      "Five guided meditations and a dharma talk on acceptance — welcoming this moment, meeting it as it is, and softening into life as it unfolds. Closes with Mindfulness as Strength (Gil Fronsdal), a short reflection on how steady, accepting awareness becomes its own kind of inner strength.",
    tracks: [
      { title: "Part 1: Welcoming This Moment", src: `${AUDIO_BASE}/power-of-acceptance/welcoming-this-moment.mp3` },
      { title: "Part 2: Accepting This Present Moment As It Is", src: `${AUDIO_BASE}/power-of-acceptance/accepting-this-present-moment.mp3` },
      { title: "Part 3: I Am Capable of Meeting This Moment", src: `${AUDIO_BASE}/power-of-acceptance/capable-of-meeting-this-moment.mp3` },
      { title: "Part 4: How to Accept Life As It Unfolds", src: `${AUDIO_BASE}/power-of-acceptance/how-to-accept-life.mp3` },
      { title: "Part 5: Feeling Acceptance", src: `${AUDIO_BASE}/power-of-acceptance/feeling-acceptance.mp3` },
      { title: "Practice Notes: Mindfulness as Strength — Dharma Talk by Gil Fronsdal", src: `${AUDIO_BASE}/power-of-acceptance/mindfulness-as-strength.mp3` },
    ],
  },
  "8-self-compassion-exercises-to-enhance-the-relationship-you-have-with-yourself": {
    heading: "Listen: Self-Compassion audio series",
    intro:
      "Two guided meditations companion to this collection of self-compassion exercises — 21-Day Compassion offers a steady daily practice; Nourishing Your Body With Attention turns kind, attentive presence toward the body itself.",
    tracks: [
      { title: "21-Day Compassion — Guided Meditation", src: `${AUDIO_BASE}/8-self-compassion-exercises/21-day-compassion.mp3` },
      { title: "Nourishing Your Body With Attention — Guided Meditation", src: `${AUDIO_BASE}/8-self-compassion-exercises/nourishing-body-with-attention.mp3` },
    ],
  },
  "mindfulness-body-scan-for-self-compassion": {
    heading: "Listen: Self-Compassion Body Scan audio series",
    intro:
      "Two guided body-scan meditations — How to Simply Be In The Body softens the urge to do and lets you rest into being; Body Appreciation tends to each part of you with gratitude and care.",
    tracks: [
      { title: "How to Simply Be In The Body — Guided Meditation", src: `${AUDIO_BASE}/mindfulness-body-scan-for-self-compassion/how-to-simply-be-in-the-body.mp3` },
      { title: "Body Appreciation — Guided Meditation", src: `${AUDIO_BASE}/mindfulness-body-scan-for-self-compassion/body-appreciation.mp3` },
    ],
  },
  "guided-meditation-self-acceptance": {
    heading: "Listen: Self-Acceptance audio series",
    intro:
      "A guided meditation plus a short dharma talk — How to Allow Your Experience to Be What It Is meets whatever arises with allowance; Practice Notes: It's OK (Gil Fronsdal) is a tender reminder that this moment, too, is allowed to be exactly as it is.",
    tracks: [
      { title: "How to Allow Your Experience to Be What It Is — Guided Meditation", src: `${AUDIO_BASE}/guided-meditation-self-acceptance/how-to-allow-your-experience.mp3` },
      { title: "Practice Notes: It's OK — Dharma Talk by Gil Fronsdal", src: `${AUDIO_BASE}/guided-meditation-self-acceptance/practice-notes-its-ok.mp3` },
    ],
  },
  "short-body-scan": {
    heading: "Listen: Body Scan Meditation",
    intro:
      "A grounding guided body scan — moving slowly through the body with kind, curious attention, returning you to the felt sense of being here.",
    tracks: [
      { title: "Body Scan — Guided Meditation", src: `${AUDIO_BASE}/short-body-scan/body-scan-meditation.mp3` },
    ],
  },
  "honoring-joanna-macy-a-tribute-to-a-visionary-of-interconnection-and-courage": {
    heading: "Listen: Cultivating Courage to Be With What Is",
    intro:
      "A guided meditation in the spirit of Joanna Macy's work — turning toward what is hard with steadiness and tender courage, instead of looking away.",
    tracks: [
      { title: "Cultivating Courage to Be With What Is — Guided Meditation", src: `${AUDIO_BASE}/honoring-joanna-macy/cultivating-courage.mp3` },
    ],
  },
  "body-scan-advanced": {
    heading: "Listen: Sensing Into the Head and Neck",
    intro:
      "A guided body-scan meditation focused on the head and neck — softening the held tension we so often carry without noticing.",
    tracks: [
      { title: "Sensing Into the Head and Neck — Guided Meditation", src: `${AUDIO_BASE}/body-scan-advanced/sensing-into-head-and-neck.mp3` },
    ],
  },
  "settling-into-presence": {
    heading: "Listen: Settling Into This Present Moment",
    intro:
      "A short guided meditation for letting the body, breath, and mind arrive — gently — into the simple presence of right now.",
    tracks: [
      { title: "Settling Into This Present Moment — Guided Meditation", src: `${AUDIO_BASE}/settling-into-presence/settling-into-this-present-moment.mp3` },
    ],
  },
  "affirmations-for-anxiety": {
    heading: "Listen: Anxiety audio series",
    intro:
      "Two guided meditations and a dharma talk for working with anxiety — Alleviating Anxiety meets anxious sensations with steady, kind awareness; Noticing The Presence of Anxiety practices simply seeing it clearly without becoming it; Working With Fear (Joseph Goldstein) widens the lens with a longer reflection on meeting fear in practice.",
    tracks: [
      { title: "Alleviating Anxiety — Guided Meditation", src: `${AUDIO_BASE}/affirmations-for-anxiety/alleviating-anxiety.mp3` },
      { title: "Noticing The Presence of Anxiety — Guided Meditation", src: `${AUDIO_BASE}/affirmations-for-anxiety/noticing-presence-of-anxiety.mp3` },
      { title: "Working With Fear — Dharma Talk by Joseph Goldstein", src: `${AUDIO_BASE}/affirmations-for-anxiety/working-with-fear.mp3` },
    ],
  },
  "three-60-second-meditation-techniques-for-anxiety": {
    heading: "Listen: Anxiety audio series",
    intro:
      "Three guided meditations for working with anxiety — Befriending Anxiety invites a softer relationship with anxious feeling; Alleviating Tension releases the held tightness it leaves behind; Standard Practice For Anxiety offers a steady, repeatable companion for harder moments.",
    tracks: [
      { title: "Befriending Anxiety — Guided Meditation", src: `${AUDIO_BASE}/three-60-second-anxiety/befriending-anxiety.mp3` },
      { title: "Alleviating Tension In Your Body & Mind — Guided Meditation", src: `${AUDIO_BASE}/three-60-second-anxiety/alleviating-tension.mp3` },
      { title: "Standard Practice For Anxiety — Guided Meditation", src: `${AUDIO_BASE}/three-60-second-anxiety/standard-practice-for-anxiety.mp3` },
    ],
  },
  "bedtime-mindfulness": {
    heading: "Listen: Directing Your Awareness With Relaxation",
    intro:
      "A slow, soothing guided meditation for the end of the day — gently directing awareness through the body with deep relaxation as the doorway into rest.",
    tracks: [
      { title: "Directing Your Awareness With Relaxation — Guided Meditation", src: `${AUDIO_BASE}/bedtime-mindfulness/directing-awareness-relaxation.mp3` },
    ],
  },
  "self-love-affirmations": {
    heading: "Listen: Self-Love audio series",
    intro:
      "A guided meditation plus a short dharma talk on quiet inner steadiness — Feeling Competent rests into the felt sense of your own capability; Confidence (Gil Fronsdal) is a tender reflection on the kind of confidence that doesn't need to prove anything to be true.",
    tracks: [
      { title: "Feeling Competent — Guided Meditation", src: `${AUDIO_BASE}/self-love-affirmations/feeling-competent.mp3` },
      { title: "Confidence — Dharma Talk by Gil Fronsdal", src: `${AUDIO_BASE}/self-love-affirmations/confidence.mp3` },
    ],
  },
  "cultivating-joy": {
    heading: "Listen: Joy audio series",
    intro:
      "A guided meditation plus a short dharma talk on joy — Gratitude And Gladness softens you into the quiet gladness of being alive; Be Amazed: Wow (Gil Fronsdal) is a tender reminder of the simple wonder hiding in plain sight.",
    tracks: [
      { title: "Gratitude And Gladness — Guided Meditation", src: `${AUDIO_BASE}/cultivating-joy/gratitude-and-gladness.mp3` },
      { title: "Be Amazed: Wow — Dharma Talk by Gil Fronsdal", src: `${AUDIO_BASE}/cultivating-joy/be-amazed-wow.mp3` },
    ],
  },
  "how-to-cultivate-an-attitude-of-gratitude-why-its-important": {
    heading: "Listen: Gratitude Is Not In The Words",
    intro:
      "A guided meditation on the felt sense of gratitude — beneath the language, beneath the listing, into the quiet warmth itself.",
    tracks: [
      { title: "Gratitude Is Not In The Words — Guided Meditation", src: `${AUDIO_BASE}/attitude-of-gratitude/gratitude-is-not-in-the-words.mp3` },
    ],
  },
  "full-body-awareness": {
    heading: "Listen: Body Awareness audio series",
    intro:
      "A guided meditation plus a dharma talk on coming home to the body — Grounding uses the felt sense of contact and weight to steady the nervous system; Being Trusting In The Body (Gil Fronsdal) is a longer reflection on letting awareness rest, with confidence, in the body itself.",
    tracks: [
      { title: "Grounding — Guided Meditation", src: `${AUDIO_BASE}/full-body-awareness/grounding.mp3` },
      { title: "Being Trusting In The Body — Dharma Talk by Gil Fronsdal", src: `${AUDIO_BASE}/full-body-awareness/being-trusting-in-the-body.mp3` },
    ],
  },
  "power-of-gratitude-meditation-7-ways-to-cultivate-it": {
    heading: "Listen: Power of Gratitude audio series",
    intro:
      "Two guided meditations and a dharma talk on gratitude — Heart-Centered Gratitude opens the chest tenderly to what is already enough; The Power of Gratitude widens it into a daily way of seeing; Gratitude (Gil Fronsdal) offers a contemplative reflection on gratitude as practice.",
    tracks: [
      { title: "Heart-Centered Gratitude — Guided Meditation", src: `${AUDIO_BASE}/power-of-gratitude-meditation/heart-centered-gratitude.mp3` },
      { title: "The Power of Gratitude — Guided Meditation", src: `${AUDIO_BASE}/power-of-gratitude-meditation/the-power-of-gratitude.mp3` },
      { title: "Gratitude — Dharma Talk by Gil Fronsdal", src: `${AUDIO_BASE}/power-of-gratitude-meditation/gratitude-fronsdal.mp3` },
    ],
  },
  "reduce-rumination-and-increase-positive-states-through-neuro-learning": {
    heading: "Listen: How To Stop Ruminating",
    intro:
      "A guided meditation for working skillfully with the looping mind — gently interrupting rumination and returning, again and again, to presence.",
    tracks: [
      { title: "How To Stop Ruminating — Guided Meditation", src: `${AUDIO_BASE}/reduce-rumination/how-to-stop-ruminating.mp3` },
    ],
  },
  "the-power-of-loving-kindness-how-to-cultivate-it": {
    heading: "Listen: Loving-Kindness Meditation",
    intro:
      "A classic metta practice — extending warmth and goodwill first to yourself, then outward, in widening circles of care.",
    tracks: [
      { title: "Loving-Kindness — Guided Meditation", src: `${AUDIO_BASE}/power-of-loving-kindness/loving-kindness.mp3` },
    ],
  },
  "noting-your-judgments": {
    heading: "Listen: Noting & Non-Judgment audio series",
    intro:
      "Two guided meditations in the noting tradition — Noting Thinking or Feeling practices the simple distinction between thought and feeling; Resolving Judgments meets judgmental mind with steady, non-reactive awareness.",
    tracks: [
      { title: "Noting Thinking or Feeling — Guided Meditation", src: `${AUDIO_BASE}/noting-your-judgments/noting-thinking-or-feeling.mp3` },
      { title: "Resolving Judgments — Guided Meditation", src: `${AUDIO_BASE}/noting-your-judgments/resolving-judgments.mp3` },
    ],
  },
  "meditation-scripts-for-anxiety": {
    heading: "Listen: Observing Anxiety From A Distance",
    intro:
      "A guided meditation for stepping back from anxious thought — watching it from a steady, spacious distance instead of being swept inside it.",
    tracks: [
      { title: "Observing Anxiety From A Distance — Guided Meditation", src: `${AUDIO_BASE}/meditation-scripts-for-anxiety/observing-anxiety-from-a-distance.mp3` },
    ],
  },
  "5-minute-meditation-script-from-mindfulness-exercises": {
    heading: "Listen: One Minute For Good",
    intro:
      "A short guided meditation — just a single minute to settle, soften, and remember the good already here.",
    tracks: [
      { title: "One Minute For Good — Guided Meditation", src: `${AUDIO_BASE}/5-minute-meditation-script/one-minute-for-good.mp3` },
    ],
  },
  "awareness-of-the-five-senses": {
    heading: "Listen: Opening Your Senses",
    intro:
      "A guided meditation for arriving through the five senses — a fresh, embodied way back into the simple aliveness of right now.",
    tracks: [
      { title: "Opening Your Senses — Guided Meditation", src: `${AUDIO_BASE}/awareness-of-the-five-senses/opening-your-senses.mp3` },
    ],
  },
  "mindfulness-body-scan-for-stress-relief": {
    heading: "Listen: Body & Stress Relief audio series",
    intro:
      "A guided body scan plus a short dharma talk for softening held tension — Relaxing Your Body moves slowly through the body, region by region, into deeper rest; Practice Notes: Relax The Eyes (Gil Fronsdal) turns kind attention to the small, often-overlooked tightness around the eyes that quietly carries a whole day's stress.",
    tracks: [
      { title: "Relaxing Your Body — Guided Meditation", src: `${AUDIO_BASE}/mindfulness-body-scan-for-stress-relief/relaxing-your-body.mp3` },
      { title: "Practice Notes: Relax The Eyes — Dharma Talk by Gil Fronsdal", src: `${AUDIO_BASE}/mindfulness-body-scan-for-stress-relief/relax-the-eyes.mp3` },
    ],
  },
  "laying-down-meditation-visualizing-a-lake": {
    heading: "Listen: Sensing The Serenity Of A Lake",
    intro:
      "A laying-down guided visualization — letting the still, mirror-quiet of a mountain lake settle the mind and body.",
    tracks: [
      { title: "Sensing The Serenity Of A Lake — Guided Meditation", src: `${AUDIO_BASE}/laying-down-meditation-visualizing-a-lake/sensing-serenity-of-a-lake.mp3` },
    ],
  },
  "morning-affirmations": {
    heading: "Listen: The Foundation For All Abundance",
    intro:
      "A grounding morning guided meditation — settling into gratitude as the quiet foundation beneath every other kind of abundance.",
    tracks: [
      { title: "The Foundation For All Abundance — Guided Meditation", src: `${AUDIO_BASE}/morning-affirmations/foundation-for-all-abundance.mp3` },
    ],
  },
  "learning-the-secret-language-of-your-body-with-inna-segal": {
    heading: "Listen: Tuning Into Breath and Body",
    intro:
      "A guided meditation for listening inward — tuning the dial of attention to the quiet conversation between breath and body.",
    tracks: [
      { title: "Tuning Into Breath and Body — Guided Meditation", src: `${AUDIO_BASE}/learning-the-secret-language-of-your-body/tuning-into-breath-and-body.mp3` },
    ],
  },
  "8-sleep-meditations-for-a-good-nights-rest": {
    heading: "Listen: The Power of Gratitude For Sleep",
    intro:
      "A slow, soothing guided meditation for the end of the day — letting gratitude soften the body, quiet the mind, and carry you into rest.",
    tracks: [
      { title: "The Power of Gratitude For Sleep — Guided Meditation", src: `${AUDIO_BASE}/8-sleep-meditations/power-of-gratitude-for-sleep.mp3` },
    ],
  },
  "self-compassion-pause": {
    heading: "Listen: The Voice of A Good Friend",
    intro:
      "A guided self-compassion meditation — practicing offering yourself the same warmth, patience, and steady kindness you'd give a close friend.",
    tracks: [
      { title: "The Voice of A Good Friend — Guided Meditation", src: `${AUDIO_BASE}/self-compassion-pause/voice-of-a-good-friend.mp3` },
    ],
  },
  "soft-belly": {
    heading: "Listen: Touching Your Belly & Heart",
    intro:
      "A grounding guided meditation using gentle touch — one hand on the belly, one on the heart — to settle the nervous system and feel held by your own presence.",
    tracks: [
      { title: "Touching Your Belly & Heart — Guided Meditation", src: `${AUDIO_BASE}/soft-belly/touching-your-belly-and-heart.mp3` },
    ],
  },
  "what-the-world-needs": {
    heading: "Listen: What The World Needs",
    intro:
      "A guided meditation on offering what's most yours to give — a quiet practice of remembering that the world needs you alive, awake, and present.",
    tracks: [
      { title: "What The World Needs — Guided Meditation", src: `${AUDIO_BASE}/what-the-world-needs/what-the-world-needs.mp3` },
    ],
  },
  "loving-kindness-benefactor": {
    heading: "Listen: Wishing Care For Self and Others",
    intro:
      "A guided loving-kindness meditation — extending warm wishes of care first to yourself, then outward to a benefactor, a loved one, and beyond.",
    tracks: [
      { title: "Wishing Care For Self and Others — Guided Meditation", src: `${AUDIO_BASE}/loving-kindness-benefactor/wishing-care-for-self-and-others.mp3` },
    ],
  },
  "the-importance-of-finding-quiet-time": {
    heading: "Listen: Quiet Time audio series",
    intro:
      "Two short dharma talks by Gil Fronsdal — The Still, Quiet Place Within points to the silence that is always already here, beneath the noise of thought; Settle The Heart First is a tender reminder that before we ask the mind to settle, we tend, gently, to the heart.",
    tracks: [
      { title: "The Still, Quiet Place Within — Dharma Talk by Gil Fronsdal", src: `${AUDIO_BASE}/importance-of-finding-quiet-time/still-quiet-place-within.mp3` },
      { title: "Settle The Heart First — Dharma Talk by Gil Fronsdal", src: `${AUDIO_BASE}/importance-of-finding-quiet-time/settle-the-heart-first.mp3` },
    ],
  },
  "9-mindfulness-exercises-for-anxiety": {
    heading: "Listen: Working With Fear",
    intro:
      "A dharma talk by Joseph Goldstein on meeting fear with mindfulness — turning toward what frightens us with steady awareness, again and again, until the grip softens.",
    tracks: [
      { title: "Working With Fear — Dharma Talk by Joseph Goldstein", src: `${AUDIO_BASE}/9-mindfulness-exercises-for-anxiety/working-with-fear.mp3` },
    ],
  },
  "working-with-thoughts": {
    heading: "Listen: Working With Thought and Emotion",
    intro:
      "A dharma talk by Joseph Goldstein on meeting thoughts and emotions with awareness — seeing them clearly enough that they no longer have to run the show.",
    tracks: [
      { title: "Working With Thought and Emotion — Dharma Talk by Joseph Goldstein", src: `${AUDIO_BASE}/working-with-thoughts/working-with-thought-and-emotion.mp3` },
    ],
  },
  "guided-loving-kindness-meditation-audio": {
    heading: "Listen: The Kind Heart",
    intro:
      "A dharma talk by Joseph Goldstein on metta and the kind heart — the slow, steady cultivation of friendliness toward self, others, and life itself.",
    tracks: [
      { title: "The Kind Heart — Dharma Talk by Joseph Goldstein", src: `${AUDIO_BASE}/guided-loving-kindness-meditation-audio/the-kind-heart.mp3` },
    ],
  },
  "reflections-on-slowing-down-self-love-and-inner-wisdom": {
    heading: "Listen: Every Moment a Chance to Restart",
    intro:
      "A short dharma talk by Gil Fronsdal — a quiet reminder that practice is never lost; every moment offers a fresh chance to begin again.",
    tracks: [
      { title: "Every Moment a Chance to Restart — Dharma Talk by Gil Fronsdal", src: `${AUDIO_BASE}/reflections-on-slowing-down/every-moment-a-chance-to-restart.mp3` },
    ],
  },
  "walking-meditation-worksheet-2": {
    heading: "Listen: Walking Meditation",
    intro:
      "A dharma talk by Matthew Brensilver on walking meditation — instructions and reflections on bringing mindful presence into the simple act of putting one foot in front of the other.",
    tracks: [
      { title: "Walking Meditation — Dharma Talk by Matthew Brensilver", src: `${AUDIO_BASE}/walking-meditation-worksheet/walking-meditation-talk.mp3` },
    ],
  },
  "style-over-summit-what-dirtbag-billionaire-taught-me-about-practice": {
    heading: "Listen: Practice Notes — Patience",
    intro:
      "A short dharma talk by Gil Fronsdal on patience as practice — the slow, steady willingness to stay with what's actually here, instead of leaning toward the next thing.",
    tracks: [
      { title: "Practice Notes: Patience — Dharma Talk by Gil Fronsdal", src: `${AUDIO_BASE}/style-over-summit/practice-notes-patience.mp3` },
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
};

export function getPlaylist(slug: string | undefined): AudioPlaylist | null {
  if (!slug) return null;
  return AUDIO_PLAYLISTS[slug] ?? null;
}
