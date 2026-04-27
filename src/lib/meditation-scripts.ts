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
  // Flagged: PDF is titled "Ocean Mind"; mapped to the canonical Ocean
  // Meditation post — review before relying on it.
  "experience-your-mind-like-an-ocean": {
    pdfUrl: "/sample-scripts/ocean-mind.pdf",
    title: "Ocean Mind",
    fileSize: "160 KB",
    flagged: true,
  },
  // Flagged: PDF is "Awareness When Walking"; mapped to the canonical
  // Walking Meditation script post.
  "walking-meditation-guided-script": {
    pdfUrl: "/sample-scripts/awareness-when-walking.pdf",
    title: "Awareness When Walking",
    fileSize: "182 KB",
    flagged: true,
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
};

export function getMeditationScript(slug: string): MeditationScriptEntry | null {
  return MEDITATION_SCRIPTS[slug] ?? null;
}
