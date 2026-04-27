// Registry mapping post slug → downloadable PDF script.
// Add new entries as PDFs are uploaded to public/sample-scripts/.
// `flagged: true` means the slug→PDF match is a best guess and should be
// reviewed before relying on it in production.

export interface MeditationScriptEntry {
  /** Path served from /public — must start with "/sample-scripts/". */
  pdfUrl: string;
  /** Display title shown in the script card. */
  title: string;
  /** Human-readable file size, e.g. "26 KB". */
  fileSize?: string;
  /** True when the slug↔PDF mapping was inferred (needs human review). */
  flagged?: boolean;
}

export const MEDITATION_SCRIPTS: Record<string, MeditationScriptEntry> = {
  // Exact slug + title match — promoting from flagged-guess on
  // intention-of-self-compassion to its own dedicated post.
  "breathing-self-compassion": {
    pdfUrl: "/sample-scripts/breathing-self-compassion.pdf",
    title: "Breathing Self-Compassion",
    fileSize: "196 KB",
  },
  "intention-of-self-compassion": {
    pdfUrl: "/sample-scripts/intention-of-self-compassion.pdf",
    title: "Intention of Self-Compassion",
    fileSize: "225 KB",
  },
  "self-compassion-through-the-body": {
    pdfUrl: "/sample-scripts/self-compassion-through-the-body.pdf",
    title: "Self-Compassion Through the Body",
    fileSize: "268 KB",
  },
  "self-compassion-visualization-the-blanket-of-love": {
    pdfUrl: "/sample-scripts/self-compassion-visualization-the-blanket-of-love.pdf",
    title: "Self-Compassion Visualization: The Blanket of Love",
    fileSize: "206 KB",
  },
  "identifying-self-judgment-and-bringing-in-self-compassion": {
    pdfUrl: "/sample-scripts/identifying-self-judgment-and-bringing-in-self-compassion.pdf",
    title: "Identifying Self-Judgment and Bringing in Self-Compassion",
    fileSize: "260 KB",
  },
  "directional-compassion": {
    pdfUrl: "/sample-scripts/directional-compassion.pdf",
    title: "Directional Compassion",
    fileSize: "282 KB",
  },
  "cultivating-self-care-and-extending-it-out": {
    pdfUrl: "/sample-scripts/cultivating-self-care-and-extending-it-out.pdf",
    title: "Cultivating Self-Care and Extending It Out",
    fileSize: "214 KB",
  },
  // PDF title is "Self-Compassion Pause"; live post slug is the "-2" variant.
  "self-compassion-pause-2": {
    pdfUrl: "/sample-scripts/self-compassion-pause.pdf",
    title: "Self-Compassion Pause",
    fileSize: "199 KB",
  },
  "puppies-meditation": {
    pdfUrl: "/sample-scripts/puppies-meditation.pdf",
    title: "Puppies Meditation",
    fileSize: "150 KB",
  },
  // Primary loving-kindness PDF — matches the canonical post.
  "loving-kindness-meditation-script": {
    pdfUrl: "/sample-scripts/loving-kindness-meditation.pdf",
    title: "Loving Kindness Meditation",
    fileSize: "333 KB",
  },
  // Second LK PDF is the "spheres of radiant light" visualization variant.
  "loving-kindness-visualization-the-spheres": {
    pdfUrl: "/sample-scripts/loving-kindness-visualization-the-spheres.pdf",
    title: "Loving Kindness Visualization — The Spheres",
    fileSize: "153 KB",
  },
  "loving-kindness-the-child": {
    pdfUrl: "/sample-scripts/loving-kindness-the-child.pdf",
    title: "Loving Kindness — The Child",
    fileSize: "158 KB",
  },
  "kindness-for-your-thinking-mind": {
    pdfUrl: "/sample-scripts/kindness-for-your-thinking-mind.pdf",
    title: "Kindness for Your Thinking Mind",
    fileSize: "197 KB",
  },
  "compassion-for-your-emotions": {
    pdfUrl: "/sample-scripts/compassion-for-your-emotions.pdf",
    title: "Compassion for Your Emotions",
    fileSize: "212 KB",
  },
  "compassion-for-the-whole-body": {
    pdfUrl: "/sample-scripts/compassion-for-the-whole-body.pdf",
    title: "Compassion for the Whole Body",
    fileSize: "235 KB",
  },
  "noticing-your-helpers": {
    pdfUrl: "/sample-scripts/noticing-your-helpers.pdf",
    title: "Noticing Your Helpers",
    fileSize: "149 KB",
  },
  // Live post slug differs from the rest of the family ("meditation-script-"
  // prefix) — kept intentionally so this maps to the canonical Forgiveness
  // Meditation post.
  "meditation-script-forgiveness-meditation": {
    pdfUrl: "/sample-scripts/forgiveness-meditation.pdf",
    title: "Forgiveness Meditation",
    fileSize: "200 KB",
  },
  "letting-go-of-resentments-by-forgiving-faults": {
    pdfUrl: "/sample-scripts/letting-go-of-resentments-by-forgiving-faults.pdf",
    title: "Letting Go of Resentments by Forgiving Faults",
    fileSize: "196 KB",
  },
  "recognition-and-care-for-those-who-frustrate-you": {
    pdfUrl: "/sample-scripts/recognition-and-care-for-those-who-frustrate-you.pdf",
    title: "Recognition and Care for Those Who Frustrate You",
    fileSize: "195 KB",
  },
  "recognizing-what-you-need": {
    pdfUrl: "/sample-scripts/recognizing-what-you-need.pdf",
    title: "Recognizing What You Need",
    fileSize: "182 KB",
  },
  "seeing-other-people-as-human-beings": {
    pdfUrl: "/sample-scripts/seeing-other-people-as-human-beings.pdf",
    title: "Seeing Other People as Human Beings Rather Than Labels",
    fileSize: "180 KB",
  },
  // Body / sensory awareness family
  "awareness-of-the-five-senses": {
    pdfUrl: "/sample-scripts/awareness-of-each-of-the-five-senses.pdf",
    title: "Awareness of Each of the Five Senses",
    fileSize: "123 KB",
  },
  "body-scan-advanced": {
    pdfUrl: "/sample-scripts/body-scan-advanced.pdf",
    title: "Advanced Body Scan Meditation",
    fileSize: "130 KB",
  },
  "grounding-through-body-awareness": {
    pdfUrl: "/sample-scripts/grounding-through-body-awareness.pdf",
    title: "Grounding Through Body Awareness",
    fileSize: "171 KB",
  },
  "movement-meditation": {
    pdfUrl: "/sample-scripts/movement-meditation.pdf",
    title: "Movement Meditation",
    fileSize: "159 KB",
  },
  "outdoor-meditation": {
    pdfUrl: "/sample-scripts/outdoor-meditation.pdf",
    title: "Outdoor Meditation",
    fileSize: "147 KB",
  },
  "writing-meditation": {
    pdfUrl: "/sample-scripts/writing-meditation.pdf",
    title: "Writing Meditation",
    fileSize: "155 KB",
  },
  "chocolate-meditation": {
    pdfUrl: "/sample-scripts/chocolate-meditation.pdf",
    title: "Chocolate Meditation",
    fileSize: "163 KB",
  },
  "grounding-body-scan": {
    pdfUrl: "/sample-scripts/grounding-body-scan.pdf",
    title: "Grounding Body Scan",
    fileSize: "185 KB",
  },
  "awareness-of-the-four-elements": {
    pdfUrl: "/sample-scripts/awareness-of-four-elements.pdf",
    title: "Awareness of Four Elements — Earth, Air, Water, and Fire",
    fileSize: "178 KB",
  },
  // Canonical PDF "Experience Your Mind Like an Ocean" — replaces prior
  // flagged "Ocean Mind" guess (which is now in the orphan review queue).
  "experience-your-mind-like-an-ocean": {
    pdfUrl: "/sample-scripts/experience-your-mind-like-an-ocean.pdf",
    title: "Experience Your Mind Like an Ocean",
    fileSize: "194 KB",
  },
  // Canonical PDF for the Walking Meditation Script post.
  "walking-meditation-guided-script": {
    pdfUrl: "/sample-scripts/walking-meditation.pdf",
    title: "Walking Meditation",
    fileSize: "181 KB",
  },
  "body-scan-intermediate": {
    pdfUrl: "/sample-scripts/body-scan-intermediate.pdf",
    title: "Body Scan Intermediate",
    fileSize: "183 KB",
  },
  "feeling-your-feet-throughout-the-day": {
    pdfUrl: "/sample-scripts/feeling-your-feet-throughout-the-day.pdf",
    title: "Feeling Your Feet Throughout the Day",
    fileSize: "180 KB",
  },
  "focusing-on-the-colors-you-see": {
    pdfUrl: "/sample-scripts/focusing-on-the-colors-you-see.pdf",
    title: "Focusing on the Colors You See",
    fileSize: "180 KB",
  },
  "mindful-bathing": {
    pdfUrl: "/sample-scripts/mindful-bathing.pdf",
    title: "Mindful Bathing",
    fileSize: "180 KB",
  },
  "mindful-cleaning": {
    pdfUrl: "/sample-scripts/mindful-cleaning.pdf",
    title: "Mindful Cleaning",
    fileSize: "181 KB",
  },
  "mindful-cooking": {
    pdfUrl: "/sample-scripts/mindful-cooking.pdf",
    title: "Mindful Cooking",
    fileSize: "180 KB",
  },
  "mindful-journaling": {
    pdfUrl: "/sample-scripts/mindful-journaling.pdf",
    title: "Mindful Journaling",
    fileSize: "179 KB",
  },
  "mindfulness-of-doing-the-dishes": {
    pdfUrl: "/sample-scripts/mindfulness-of-doing-the-dishes.pdf",
    title: "Mindfulness of Doing the Dishes",
    fileSize: "180 KB",
  },
  "mindfulness-when-you-drive": {
    pdfUrl: "/sample-scripts/mindfulness-when-you-drive.pdf",
    title: "Mindfulness When You Drive",
    fileSize: "180 KB",
  },
  "open-awareness-for-thoughts-and-senses": {
    pdfUrl: "/sample-scripts/open-awareness-for-thoughts-and-senses.pdf",
    title: "Open Awareness for Thoughts and Senses",
    fileSize: "184 KB",
  },
  "using-sounds-as-the-object-of-your-awareness": {
    pdfUrl: "/sample-scripts/using-sounds-as-the-object-of-your-awareness.pdf",
    title: "Using Sounds as the Object of Your Awareness",
    fileSize: "179 KB",
  },
  "rhythm-of-the-breath-flowing-through-the-body": {
    pdfUrl: "/sample-scripts/rhythm-of-the-breath-flowing-through-the-body.pdf",
    title: "The Rhythm of the Breath Flowing Through the Body",
    fileSize: "187 KB",
  },
  "short-body-scan": {
    pdfUrl: "/sample-scripts/short-body-scan.pdf",
    title: "Short Body Scan",
    fileSize: "177 KB",
  },
  "shopping-mindfully": {
    pdfUrl: "/sample-scripts/shopping-mindfully.pdf",
    title: "Shopping Mindfully",
    fileSize: "178 KB",
  },
  "working-with-boredom": {
    pdfUrl: "/sample-scripts/working-with-boredom.pdf",
    title: "Working with Boredom",
    fileSize: "148 KB",
  },
  "power-of-acceptance": {
    pdfUrl: "/sample-scripts/power-of-acceptance.pdf",
    title: "Power of Acceptance",
    fileSize: "149 KB",
  },
  "cultivating-joy": {
    pdfUrl: "/sample-scripts/cultivating-joy.pdf",
    title: "Cultivating Joy",
    fileSize: "148 KB",
  },
  "cultivating-equanimity": {
    pdfUrl: "/sample-scripts/cultivating-equanimity.pdf",
    title: "Cultivating Equanimity",
    fileSize: "149 KB",
  },
  // PDF is "Being Still"; canonical post slug uses "-meditation" suffix.
  "being-still-meditation": {
    pdfUrl: "/sample-scripts/being-still.pdf",
    title: "Being Still",
    fileSize: "146 KB",
  },
  "5-minute-standing-meditation": {
    pdfUrl: "/sample-scripts/5-minute-standing-meditation.pdf",
    title: "5 Minute Standing Meditation",
    fileSize: "148 KB",
  },
  "one-breath-at-a-time": {
    pdfUrl: "/sample-scripts/one-breath-at-a-time.pdf",
    title: "One Breath at a Time",
    fileSize: "154 KB",
  },
  "5-minutes-to-regain-calm-clarity-and-confidence": {
    pdfUrl: "/sample-scripts/5-minutes-to-regain-calm-clarity-and-confidence.pdf",
    title: "5 Minutes to Regain Calm, Clarity, and Confidence",
    fileSize: "189 KB",
  },
  "mindfulness-of-the-present-moment-without-any-goals": {
    pdfUrl: "/sample-scripts/mindfulness-of-the-present-moment-without-any-goals.pdf",
    title: "Mindfulness of the Present Moment Without Any Goals",
    fileSize: "191 KB",
  },
  "three-mindful-breaths-extended": {
    pdfUrl: "/sample-scripts/three-mindful-breaths-extended.pdf",
    title: "Three Mindful Breaths (Extended)",
    fileSize: "183 KB",
  },
  "what-is-open-awareness": {
    pdfUrl: "/sample-scripts/what-is-open-awareness.pdf",
    title: "What is Open Awareness?",
    fileSize: "181 KB",
  },
  "open-awareness-focus-on-the-breath": {
    pdfUrl: "/sample-scripts/open-awareness-focus-on-the-breath.pdf",
    title: "Open Awareness: Focus on the Breath",
    fileSize: "179 KB",
  },
  "noting-without-identifying": {
    pdfUrl: "/sample-scripts/noting-without-identifying.pdf",
    title: "Noting Without Identifying",
    fileSize: "184 KB",
  },
  "5-minute-simple-breathing-meditation": {
    pdfUrl: "/sample-scripts/5-minute-simple-breathing-meditation.pdf",
    title: "5-Minute Simple Breathing Meditation",
    fileSize: "192 KB",
  },
  "bringing-yourself-into-the-present-moment": {
    pdfUrl: "/sample-scripts/bringing-yourself-into-the-present-moment.pdf",
    title: "Bringing Yourself into the Present Moment",
    fileSize: "191 KB",
  },
  "building-abilities-to-communicate-have-patience-and-manage-time": {
    pdfUrl: "/sample-scripts/building-abilities-to-communicate-have-patience-and-manage-time.pdf",
    title: "Building Abilities to Communicate, Have Patience, and Manage Time",
    fileSize: "220 KB",
  },
  "feeling-your-body-and-mind-as-a-lake": {
    pdfUrl: "/sample-scripts/feeling-your-body-and-mind-as-a-lake.pdf",
    title: "Feeling Your Body and Mind as a Lake",
    fileSize: "194 KB",
  },
  "mindfulness-of-breath": {
    pdfUrl: "/sample-scripts/mindfulness-of-breath.pdf",
    title: "Mindfulness of Breath",
    fileSize: "181 KB",
  },
  "visualizing-your-day-as-you-wake-up": {
    pdfUrl: "/sample-scripts/visualizing-your-day-as-you-wake-up.pdf",
    title: "Visualizing Your Day as You Wake Up",
    fileSize: "217 KB",
  },
  "awareness-in-three-parts-thoughts-senses-and-whole-body": {
    pdfUrl: "/sample-scripts/awareness-in-three-parts-thoughts-senses-and-whole-body.pdf",
    title: "Awareness in Three Parts: Thoughts, Senses, and Whole Body",
    fileSize: "199 KB",
  },
  "awareness-of-the-changing-world": {
    pdfUrl: "/sample-scripts/awareness-of-the-changing-world.pdf",
    title: "Awareness of the Changing World",
    fileSize: "180 KB",
  },
  "awareness-of-your-problem-without-fixing-it": {
    pdfUrl: "/sample-scripts/awareness-of-your-problem-without-fixing-it.pdf",
    title: "Awareness of Your Problem Without Fixing It",
    fileSize: "194 KB",
  },
  "awareness-when-you-are-killing-time": {
    pdfUrl: "/sample-scripts/awareness-when-you-are-killing-time.pdf",
    title: "Awareness When You Are Killing Time",
    fileSize: "180 KB",
  },
  "become-aware-then-focus-and-expand-awareness": {
    pdfUrl: "/sample-scripts/become-aware-then-focus-and-expand-awareness.pdf",
    title: "Become Aware, then Focus and Expand Awareness",
    fileSize: "199 KB",
  },
  "bringing-your-mind-back-from-thoughts": {
    pdfUrl: "/sample-scripts/bringing-your-mind-back-from-thoughts.pdf",
    title: "Bringing Your Mind Back from Thoughts",
    fileSize: "186 KB",
  },
  "breathing-and-noting": {
    pdfUrl: "/sample-scripts/breathing-and-noting.pdf",
    title: "Breathing and Noting",
    fileSize: "178 KB",
  },
  "cultivating-a-stable-mind": {
    pdfUrl: "/sample-scripts/cultivating-a-stable-mind.pdf",
    title: "Cultivating a Stable Mind",
    fileSize: "193 KB",
  },
  "feeling-tones-pleasant-unpleasant-neutral": {
    pdfUrl: "/sample-scripts/feeling-tones-pleasant-unpleasant-neutral.pdf",
    title: "Feeling Tones: Pleasant, Unpleasant, Neutral",
    fileSize: "177 KB",
  },
  "finding-the-breath": {
    pdfUrl: "/sample-scripts/finding-the-breath.pdf",
    title: "Finding the Breath",
    fileSize: "184 KB",
  },
  "focusing-your-attention-using-breath": {
    pdfUrl: "/sample-scripts/focusing-your-attention-using-breath.pdf",
    title: "Focusing Your Attention Using Breath",
    fileSize: "179 KB",
  },
  "gladdening-the-mind": {
    pdfUrl: "/sample-scripts/gladdening-the-mind.pdf",
    title: "Gladdening the Mind",
    fileSize: "188 KB",
  },
  "growing-happiness-in-the-mind": {
    pdfUrl: "/sample-scripts/growing-happiness-in-the-mind.pdf",
    title: "Growing Happiness in the Mind",
    fileSize: "194 KB",
  },
  "intention-to-be-happy": {
    pdfUrl: "/sample-scripts/intention-to-be-happy.pdf",
    title: "Intention to be Happy",
    fileSize: "192 KB",
  },
  "laying-down-meditation-and-visualizing-a-lake": {
    pdfUrl: "/sample-scripts/laying-down-meditation-and-visualizing-a-lake.pdf",
    title: "Laying Down Meditation and Visualizing a Lake",
    fileSize: "186 KB",
  },
  "mindfulness-while-waiting-in-line": {
    pdfUrl: "/sample-scripts/mindfulness-while-waiting-in-line.pdf",
    title: "Mindfulness While Waiting in Line",
    fileSize: "150 KB",
  },
  "noticing-what-brings-you-joy": {
    pdfUrl: "/sample-scripts/noticing-what-brings-you-joy.pdf",
    title: "Noticing What Brings You Joy",
    fileSize: "182 KB",
  },
  "one-complete-cycle-of-breath": {
    pdfUrl: "/sample-scripts/one-complete-cycle-of-breath.pdf",
    title: "One Complete Cycle of Breath",
    fileSize: "177 KB",
  },
  "opening-your-awareness-to-whatever-is-arising": {
    pdfUrl: "/sample-scripts/opening-your-awareness-to-whatever-is-arising.pdf",
    title: "Opening Your Awareness to Whatever is Arising",
    fileSize: "179 KB",
  },
  "whole-body-breathing": {
    pdfUrl: "/sample-scripts/whole-body-breathing.pdf",
    title: "Whole Body Breathing",
    fileSize: "177 KB",
  },
  "visualizing-your-peaceful-and-beautiful-place": {
    pdfUrl: "/sample-scripts/visualizing-your-peaceful-and-beautiful-place.pdf",
    title: "Visualizing Your Peaceful and Beautiful Place",
    fileSize: "194 KB",
  },
  "using-the-power-of-your-mind": {
    pdfUrl: "/sample-scripts/using-the-power-of-your-mind.pdf",
    title: "Using the Power of Your Mind",
    fileSize: "181 KB",
  },
  "using-a-trigger-for-mindfulness": {
    pdfUrl: "/sample-scripts/using-a-trigger-for-mindfulness.pdf",
    title: "Using a Trigger for Mindfulness",
    fileSize: "193 KB",
  },
  "three-mindful-breaths": {
    pdfUrl: "/sample-scripts/three-mindful-breaths.pdf",
    title: "Three Mindful Breaths",
    fileSize: "181 KB",
  },
  "the-practice-of-smiling": {
    pdfUrl: "/sample-scripts/the-practice-of-smiling.pdf",
    title: "The Practice of Smiling",
    fileSize: "180 KB",
  },
  "several-meditations-in-1": {
    pdfUrl: "/sample-scripts/several-meditations-in-1.pdf",
    title: "Several Meditations in 1",
    fileSize: "462 KB",
  },
  "pleasant-vs-unpleasant": {
    pdfUrl: "/sample-scripts/pleasant-vs-unpleasant.pdf",
    title: "Pleasant vs Unpleasant",
    fileSize: "191 KB",
  },
  "classic-five-hindrances": {
    pdfUrl: "/sample-scripts/classic-five-hindrances.pdf",
    title: "Classic Five Hindrances",
    fileSize: "151 KB",
  },
  "four-stages-of-meditation": {
    pdfUrl: "/sample-scripts/four-stages-of-meditation.pdf",
    title: "Four Stages of Meditation",
    fileSize: "150 KB",
  },
  "when-you-just-cant-meditate": {
    pdfUrl: "/sample-scripts/when-you-just-cant-meditate.pdf",
    title: "When You Just Can't Meditate",
    fileSize: "148 KB",
  },
  "naming-the-feelings": {
    pdfUrl: "/sample-scripts/naming-the-feelings.pdf",
    title: "Naming the Feelings",
    fileSize: "151 KB",
  },
  "staying-with-emotions": {
    pdfUrl: "/sample-scripts/staying-with-emotions.pdf",
    title: "Staying with Emotions",
    fileSize: "160 KB",
  },
  "being-mindful-and-present-with-negative-emotions": {
    pdfUrl: "/sample-scripts/being-mindful-and-present-with-negative-emotions.pdf",
    title: "Being Mindful and Present with Negative Emotions",
    fileSize: "193 KB",
  },
  "when-your-mind-wanders": {
    pdfUrl: "/sample-scripts/when-your-mind-wanders.pdf",
    title: "When Your Mind Wanders",
    fileSize: "184 KB",
  },
  "observe-judging-with-awareness": {
    pdfUrl: "/sample-scripts/observe-judging-with-awareness.pdf",
    title: "Observe Judging with Awareness",
    fileSize: "194 KB",
  },
  "reduce-envy-and-celebrate-others": {
    pdfUrl: "/sample-scripts/reduce-envy-and-celebrate-others.pdf",
    title: "Reduce Envy and Celebrate Others",
    fileSize: "194 KB",
  },
  "alleviate-depression": {
    pdfUrl: "/sample-scripts/alleviate-depression.pdf",
    title: "Alleviate Depression",
    fileSize: "200 KB",
  },
  "alleviate-your-feeling-of-loneliness": {
    pdfUrl: "/sample-scripts/alleviate-your-feeling-of-loneliness.pdf",
    title: "Alleviate Your Feeling of Loneliness",
    fileSize: "192 KB",
  },
  "alleviate-feelings-of-anger-and-resentment": {
    pdfUrl: "/sample-scripts/alleviate-feelings-of-anger-and-resentment.pdf",
    title: "Alleviate Feelings of Anger and Resentment",
    fileSize: "200 KB",
  },
  "attending-to-emotional-mental-or-external-difficulties": {
    pdfUrl: "/sample-scripts/attending-to-emotional-mental-or-external-difficulties.pdf",
    title: "Attending to Emotional, Mental, or External Difficulties",
    fileSize: "190 KB",
  },
  "build-resilience-to-your-response-to-anger": {
    pdfUrl: "/sample-scripts/build-resilience-to-your-response-to-anger.pdf",
    title: "Build Resilience to Your Response to Anger",
    fileSize: "146 KB",
  },
  "clarity-of-your-emotion": {
    pdfUrl: "/sample-scripts/clarity-of-your-emotion.pdf",
    title: "Clarity of Your Emotion",
    fileSize: "180 KB",
  },
  "dealing-with-negative-thoughts": {
    pdfUrl: "/sample-scripts/dealing-with-negative-thoughts.pdf",
    title: "Dealing with Negative Thoughts",
    fileSize: "180 KB",
  },
  "noting-your-judgments": {
    pdfUrl: "/sample-scripts/noting-your-judgments.pdf",
    title: "Noting Your Judgments",
    fileSize: "188 KB",
  },
  "recognizing-your-resilience-to-difficulty": {
    pdfUrl: "/sample-scripts/recognizing-your-resilience-to-difficulty.pdf",
    title: "Recognizing Your Resilience to Difficulty",
    fileSize: "182 KB",
  },
  "reducing-depression-with-someone-elses-love": {
    pdfUrl: "/sample-scripts/reducing-depression-with-someone-elses-love.pdf",
    title: "Reducing Depression with Someone Else's Love",
    fileSize: "206 KB",
  },
  "emotion-as-the-object-of-focus": {
    pdfUrl: "/sample-scripts/emotion-as-the-object-of-focus.pdf",
    title: "Emotion as the Object of Focus",
    fileSize: "186 KB",
  },
  "releasing-grief-and-bringing-in-the-positive": {
    pdfUrl: "/sample-scripts/releasing-grief-and-bringing-in-the-positive.pdf",
    title: "Releasing Grief and Bringing in the Positive",
    fileSize: "200 KB",
  },
  "releasing-the-pressure-of-emotions": {
    pdfUrl: "/sample-scripts/releasing-the-pressure-of-emotions.pdf",
    title: "Releasing the Pressure of Emotions",
    fileSize: "181 KB",
  },
  "using-rain-for-difficult-emotions-and-thoughts": {
    pdfUrl: "/sample-scripts/using-rain-for-difficult-emotions-and-thoughts.pdf",
    title: "Using R.A.I.N. for Difficult Emotions and Thoughts",
    fileSize: "180 KB",
  },
  "understanding-your-emotions": {
    pdfUrl: "/sample-scripts/understanding-your-emotions.pdf",
    title: "Understanding Your Emotions",
    fileSize: "181 KB",
  },
  "stopping-obsessive-thoughts-about-the-past": {
    pdfUrl: "/sample-scripts/stopping-obsessive-thoughts-about-the-past.pdf",
    title: "Stopping Obsessive Thoughts About the Past",
    fileSize: "194 KB",
  },
  "rewriting-your-bad-day": {
    pdfUrl: "/sample-scripts/rewriting-your-bad-day.pdf",
    title: "Rewriting Your Bad Day",
    fileSize: "196 KB",
  },
  "appreciating-the-little-things": {
    pdfUrl: "/sample-scripts/appreciating-the-little-things.pdf",
    title: "Appreciating the Little Things",
    fileSize: "173 KB",
  },
  "gratitude-when-youve-got-attitude": {
    pdfUrl: "/sample-scripts/gratitude-when-youve-got-attitude.pdf",
    title: "Gratitude When You've Got Attitude",
    fileSize: "160 KB",
  },
  "the-power-of-gratitude-for-sleep": {
    pdfUrl: "/sample-scripts/the-power-of-gratitude-for-sleep.pdf",
    title: "The Power of Gratitude for Sleep",
    fileSize: "181 KB",
  },
  "the-foundation-for-all-abundance": {
    pdfUrl: "/sample-scripts/the-foundation-for-all-abundance.pdf",
    title: "The Foundation for All Abundance",
    fileSize: "180 KB",
  },
  "starting-the-day-with-gratitude": {
    pdfUrl: "/sample-scripts/starting-the-day-with-gratitude.pdf",
    title: "Starting the Day with Gratitude",
    fileSize: "188 KB",
  },
  "sharing-gratitude": {
    pdfUrl: "/sample-scripts/sharing-gratitude.pdf",
    title: "Sharing Gratitude",
    fileSize: "187 KB",
  },
  "mind-appreciation-meditation": {
    pdfUrl: "/sample-scripts/mind-appreciation-meditation.pdf",
    title: "Mind Appreciation Meditation",
    fileSize: "184 KB",
  },
  "making-room-for-gratitude": {
    pdfUrl: "/sample-scripts/making-room-for-gratitude.pdf",
    title: "Making Room for Gratitude",
    fileSize: "183 KB",
  },
  "heart-centered-gratitude": {
    pdfUrl: "/sample-scripts/heart-centered-gratitude.pdf",
    title: "Heart-Centered Gratitude",
    fileSize: "179 KB",
  },
  "gratitude-is-not-in-the-words": {
    pdfUrl: "/sample-scripts/gratitude-is-not-in-the-words.pdf",
    title: "Gratitude Is Not in the Words",
    fileSize: "179 KB",
  },
  "gratitude-appreciating-the-simple-things": {
    pdfUrl: "/sample-scripts/gratitude-appreciating-the-simple-things.pdf",
    title: "Gratitude - Appreciating the Simple Things",
    fileSize: "187 KB",
  },
  "gratitude-and-gladness": {
    pdfUrl: "/sample-scripts/gratitude-and-gladness.pdf",
    title: "Gratitude and Gladness",
    fileSize: "181 KB",
  },
  "filling-your-cup-meditation": {
    pdfUrl: "/sample-scripts/filling-your-cup-meditation.pdf",
    title: "Filling Your Cup Meditation",
    fileSize: "188 KB",
  },
  "experience-of-gratitude": {
    pdfUrl: "/sample-scripts/experience-of-gratitude.pdf",
    title: "Experience of Gratitude",
    fileSize: "182 KB",
  },
  "ending-the-day-with-gratitude": {
    pdfUrl: "/sample-scripts/ending-the-day-with-gratitude.pdf",
    title: "Ending the Day with Gratitude",
    fileSize: "188 KB",
  },
  "affirmations-of-gratitude": {
    pdfUrl: "/sample-scripts/affirmations-of-gratitude.pdf",
    title: "Affirmations of Gratitude",
    fileSize: "179 KB",
  },
  "12-intentions-of-gratitude": {
    pdfUrl: "/sample-scripts/12-intentions-of-gratitude.pdf",
    title: "12 Intentions of Gratitude",
    fileSize: "183 KB",
  },
  "gratitude-for-your-body": {
    pdfUrl: "/sample-scripts/gratitude-for-your-body.pdf",
    title: "Gratitude for Your Body",
    fileSize: "466 KB",
  },
  "gratitude-for-breath-body-and-mind": {
    pdfUrl: "/sample-scripts/gratitude-for-breath-body-and-mind.pdf",
    title: "Gratitude for Breath, Body, and Mind",
    fileSize: "180 KB",
  },
  "appreciating-things-in-your-life": {
    pdfUrl: "/sample-scripts/appreciating-things-in-your-life.pdf",
    title: "Appreciating Things in Your Life",
    fileSize: "189 KB",
  },
  "focusing-on-the-positive-moments-throughout-the-day": {
    pdfUrl: "/sample-scripts/focusing-on-the-positive-moments-throughout-the-day.pdf",
    title: "Focusing on the Positive Moments Throughout the Day",
    fileSize: "181 KB",
  },
  "sleep-longer-with-more-ease": {
    pdfUrl: "/sample-scripts/sleep-longer-with-more-ease.pdf",
    title: "Sleep Longer with More Ease",
    fileSize: "197 KB",
  },
  "sleep-appreciation": {
    pdfUrl: "/sample-scripts/sleep-appreciation.pdf",
    title: "Sleep Appreciation",
    fileSize: "182 KB",
  },
  "a-visualization-to-relax-the-mind-for-deep-sleep": {
    pdfUrl: "/sample-scripts/a-visualization-to-relax-the-mind-for-deep-sleep.pdf",
    title: "A Visualization to Relax the Mind for Deep Sleep",
    fileSize: "203 KB",
  },
  "mental-relaxation-for-sleep": {
    pdfUrl: "/sample-scripts/mental-relaxation-for-sleep.pdf",
    title: "Mental Relaxation for Sleep",
    fileSize: "204 KB",
  },
  "relaxation-for-sleep": {
    pdfUrl: "/sample-scripts/relaxation-for-sleep.pdf",
    title: "Relaxation for Sleep",
    fileSize: "196 KB",
  },
  "simple-sleep-meditation": {
    pdfUrl: "/sample-scripts/simple-sleep-meditation.pdf",
    title: "Simple Sleep Meditation",
    fileSize: "195 KB",
  },
  "total-body-relaxation-for-sleep": {
    pdfUrl: "/sample-scripts/total-body-relaxation-for-sleep.pdf",
    title: "Total Body Relaxation for Sleep",
    fileSize: "196 KB",
  },
  "visualization-of-a-sleepy-train-ride": {
    pdfUrl: "/sample-scripts/visualization-of-a-sleepy-train-ride.pdf",
    title: "Visualization of a Sleepy Train Ride",
    fileSize: "206 KB",
  },
  "visualizing-a-beautiful-island-for-sleep": {
    pdfUrl: "/sample-scripts/visualizing-a-beautiful-island-for-sleep.pdf",
    title: "Visualizing a Beautiful Island for Sleep",
    fileSize: "215 KB",
  },
  "bedtime-mindfulness": {
    pdfUrl: "/sample-scripts/bedtime-mindfulness.pdf",
    title: "Bedtime Mindfulness",
    fileSize: "178 KB",
  },
  "your-peaceful-place-guided-visualization": {
    pdfUrl: "/sample-scripts/your-peaceful-place-guided-visualization.pdf",
    title: "Your Peaceful Place - Guided Visualization",
    fileSize: "188 KB",
  },
  "a-breathing-anchor-for-your-wandering-mind": {
    pdfUrl: "/sample-scripts/a-breathing-anchor-for-your-wandering-mind.pdf",
    title: "A Breathing Anchor for Your Wandering Mind",
    fileSize: "135 KB",
  },
  "deep-breathing": {
    pdfUrl: "/sample-scripts/deep-breathing.pdf",
    title: "Deep Breathing",
    fileSize: "168 KB",
  },
  "for-chaotic-times": {
    pdfUrl: "/sample-scripts/for-chaotic-times.pdf",
    title: "For Chaotic Times",
    fileSize: "151 KB",
  },
  "immersing-your-awareness-into-the-breath": {
    pdfUrl: "/sample-scripts/immersing-your-awareness-into-the-breath.pdf",
    title: "Immersing Your Awareness into the Breath",
    fileSize: "198 KB",
  },
  "noting-thinking-or-feeling": {
    pdfUrl: "/sample-scripts/noting-thinking-or-feeling.pdf",
    title: "Noting Thinking or Feeling",
    fileSize: "185 KB",
  },
  "mindfulness-for-anxiety-and-stress": {
    pdfUrl: "/sample-scripts/mindfulness-for-anxiety-and-stress.pdf",
    title: "Mindfulness for Anxiety and Stress",
    fileSize: "188 KB",
  },
  "alleviate-stress-with-three-deep-breaths": {
    pdfUrl: "/sample-scripts/alleviate-stress-with-three-deep-breaths.pdf",
    title: "Alleviate Stress with Three Deep Breaths",
    fileSize: "215 KB",
  },
  "breathe-away-anxious-thoughts": {
    pdfUrl: "/sample-scripts/breathe-away-anxious-thoughts.pdf",
    title: "Breathe Away Anxious Thoughts",
    fileSize: "186 KB",
  },
  "breathing-for-medium-amounts-of-stress": {
    pdfUrl: "/sample-scripts/breathing-for-medium-amounts-of-stress.pdf",
    title: "Breathing for Medium Amounts of Stress",
    fileSize: "197 KB",
  },
  "dropping-the-suitcases-of-worries-and-regrets": {
    pdfUrl: "/sample-scripts/dropping-the-suitcases-of-worries-and-regrets.pdf",
    title: "Dropping The Suitcases of Worries and Regrets",
    fileSize: "189 KB",
  },
  "relieving-anxiety": {
    pdfUrl: "/sample-scripts/relieving-anxiety.pdf",
    title: "Relieving Anxiety",
    fileSize: "191 KB",
  },
  "relieving-low-amounts-of-stress": {
    pdfUrl: "/sample-scripts/relieving-low-amounts-of-stress.pdf",
    title: "Relieving Low Amounts of Stress",
    fileSize: "202 KB",
  },
  "stress-relief-with-breathing": {
    pdfUrl: "/sample-scripts/stress-relief-with-breathing.pdf",
    title: "Stress Relief with Breathing",
    fileSize: "190 KB",
  },
  "visualization-of-a-beach-for-well-being": {
    pdfUrl: "/sample-scripts/visualization-of-a-beach-for-well-being.pdf",
    title: "Visualization of a Beach for Well-Being",
    fileSize: "185 KB",
  },
  "visualizing-stress-as-a-storm": {
    pdfUrl: "/sample-scripts/visualizing-stress-as-a-storm.pdf",
    title: "Visualizing Stress as a Storm",
    fileSize: "200 KB",
  },
  "extending-the-exhale": {
    pdfUrl: "/sample-scripts/extending-the-exhale.pdf",
    title: "Extending the Exhale",
    fileSize: "179 KB",
  },
  "easing-the-mind": {
    pdfUrl: "/sample-scripts/easing-the-mind.pdf",
    title: "Easing the Mind",
    fileSize: "187 KB",
  },
  "focused-attention-to-settle-the-mind": {
    pdfUrl: "/sample-scripts/focused-attention-to-settle-the-mind.pdf",
    title: "Focused Attention to Settle the Mind",
    fileSize: "178 KB",
  },
  "mindful-media": {
    pdfUrl: "/sample-scripts/mindful-media.pdf",
    title: "Mindful Media",
    fileSize: "179 KB",
  },
  "notice-and-accept-your-body-in-the-present-moment": {
    pdfUrl: "/sample-scripts/notice-and-accept-your-body-in-the-present-moment.pdf",
    title: "Notice and Accept Your Body in the Present Moment",
    fileSize: "197 KB",
  },
  "noting-thoughts-to-see-where-the-mind-is": {
    pdfUrl: "/sample-scripts/noting-thoughts-to-see-where-the-mind-is.pdf",
    title: "Noting Thoughts to See Where the Mind Is",
    fileSize: "178 KB",
  },
  "re-relaxing-the-drifting-mind-with-a-home-base": {
    pdfUrl: "/sample-scripts/re-relaxing-the-drifting-mind-with-a-home-base.pdf",
    title: "Re-relaxing the Drifting Mind with a Home Base",
    fileSize: "207 KB",
  },
  "stilling-the-mind": {
    pdfUrl: "/sample-scripts/stilling-the-mind.pdf",
    title: "Stilling the Mind",
    fileSize: "180 KB",
  },
  "soft-belly-breathing": {
    pdfUrl: "/sample-scripts/soft-belly-breathing.pdf",
    title: "Soft Belly Breathing",
    fileSize: "188 KB",
  },
  "simply-stopping": {
    pdfUrl: "/sample-scripts/simply-stopping.pdf",
    title: "Simply Stopping",
    fileSize: "181 KB",
  },
  "relieving-stress-with-sbnrr": {
    pdfUrl: "/sample-scripts/relieving-stress-with-sbnrr.pdf",
    title: "Relieving Stress With SBNRR",
    fileSize: "186 KB",
  },
  "mindfulness-of-speech": {
    pdfUrl: "/sample-scripts/mindfulness-of-speech.pdf",
    title: "Mindfulness of Speech",
    fileSize: "149 KB",
  },
  "mindful-speech": {
    pdfUrl: "/sample-scripts/mindful-speech.pdf",
    title: "Mindful Speech",
    fileSize: "164 KB",
  },
  "meditation-with-a-pet": {
    pdfUrl: "/sample-scripts/meditation-with-a-pet.pdf",
    title: "Meditation with a Pet",
    fileSize: "143 KB",
  },
  "whats-your-weather-like-kids": {
    pdfUrl: "/sample-scripts/whats-your-weather-like-kids.pdf",
    title: "What's Your Weather Like? (Kids)",
    fileSize: "161 KB",
  },
  "sounds-and-silence-kids": {
    pdfUrl: "/sample-scripts/sounds-and-silence-kids.pdf",
    title: "Sounds and Silence (Kids)",
    fileSize: "162 KB",
  },
  "mindfulness-for-kids": {
    pdfUrl: "/sample-scripts/mindfulness-for-kids.pdf",
    title: "Mindfulness for Kids",
    fileSize: "184 KB",
  },
  "reflecting-on-a-role-model": {
    pdfUrl: "/sample-scripts/reflecting-on-a-role-model.pdf",
    title: "Reflecting on a Role Model",
    fileSize: "184 KB",
  },
  "being-present-for-your-baby": {
    pdfUrl: "/sample-scripts/being-present-for-your-baby.pdf",
    title: "Being Present For Your Baby",
    fileSize: "190 KB",
  },
  "connecting-with-your-baby": {
    pdfUrl: "/sample-scripts/connecting-with-your-baby.pdf",
    title: "Connecting with Your Baby",
    fileSize: "186 KB",
  },
  "focusing-on-pregnancy-and-motherhood": {
    pdfUrl: "/sample-scripts/focusing-on-pregnancy-and-motherhood.pdf",
    title: "Focusing on Pregnancy and Motherhood",
    fileSize: "193 KB",
  },
  "focusing-on-your-happy-baby": {
    pdfUrl: "/sample-scripts/focusing-on-your-happy-baby.pdf",
    title: "Focusing on Your Happy Baby",
    fileSize: "186 KB",
  },
  "gratitude-for-pregnancy": {
    pdfUrl: "/sample-scripts/gratitude-for-pregnancy.pdf",
    title: "Gratitude for Pregnancy",
    fileSize: "186 KB",
  },
  "teen-meditation-to-believe-in-yourself": {
    pdfUrl: "/sample-scripts/teen-meditation-to-believe-in-yourself.pdf",
    title: "Teen Meditation to Believe in Yourself",
    fileSize: "191 KB",
  },
  "listening-and-speaking-with-a-partner": {
    pdfUrl: "/sample-scripts/listening-and-speaking-with-a-partner.pdf",
    title: "Listening and Speaking with a Partner",
    fileSize: "181 KB",
  },
  "mindfulness-while-speaking-with-others": {
    pdfUrl: "/sample-scripts/mindfulness-while-speaking-with-others.pdf",
    title: "Mindfulness While Speaking with Others",
    fileSize: "182 KB",
  },
};

export function getMeditationScript(slug: string): MeditationScriptEntry | null {
  return MEDITATION_SCRIPTS[slug] ?? null;
}
