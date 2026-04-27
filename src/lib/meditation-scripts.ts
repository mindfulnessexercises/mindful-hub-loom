// Registry mapping post/meditation slug → downloadable PDF script.
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
  // Best-guess match for "Breathing Self-Compassion" PDF — the post combines
  // breath awareness with cultivating self-compassion, which mirrors the PDF
  // intro: "combines awareness of the breath with compassion for the self".
  "intention-of-self-compassion": {
    pdfUrl: "/sample-scripts/breathing-self-compassion.pdf",
    title: "Breathing Self-Compassion",
    fileSize: "196 KB",
    flagged: true,
  },
};

export function getMeditationScript(slug: string): MeditationScriptEntry | null {
  return MEDITATION_SCRIPTS[slug] ?? null;
}
