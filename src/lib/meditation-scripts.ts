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
};

export function getMeditationScript(slug: string): MeditationScriptEntry | null {
  return MEDITATION_SCRIPTS[slug] ?? null;
}
