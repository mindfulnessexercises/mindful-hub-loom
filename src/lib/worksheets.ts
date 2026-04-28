// Registry mapping post slug → downloadable PDF worksheet.
// Worksheets are reflective/printable exercises (career values, time use,
// team dynamics, etc.) — distinct from guided meditation scripts but rendered
// with the same MeditationScript component using kind="worksheet".
//
// Add new entries as PDFs are uploaded to public/worksheets/.
// `flagged: true` means the slug→PDF match is a best guess (no exact post
// existed) and the placement should be reviewed before relying on it.

export interface WorksheetEntry {
  /** Path served from /public — must start with "/worksheets/". */
  pdfUrl: string;
  /** Display title shown on the worksheet card. */
  title: string;
  /** Human-readable file size, e.g. "163 KB". */
  fileSize?: string;
  /** True when the slug↔PDF mapping was inferred (needs human review). */
  flagged?: boolean;
}

/**
 * Map of post slug → single primary worksheet for that post.
 * For posts that warrant multiple worksheets, see WORKSHEET_BUNDLES below.
 */
export const WORKSHEETS: Record<string, WorksheetEntry> = {
  "appraising-career-values": {
    pdfUrl: "/worksheets/appraising-my-career-values.pdf",
    title: "Appraising My Career Values",
    fileSize: "163 KB",
  },
  "appreciating-accomplishments": {
    pdfUrl: "/worksheets/appreciating-your-accomplishments.pdf",
    title: "Appreciating Your Accomplishments",
    fileSize: "161 KB",
  },
  "assessing-contributions-team": {
    pdfUrl: "/worksheets/assessing-contributions-to-your-team.pdf",
    title: "Assessing Contributions to Your Team",
    fileSize: "161 KB",
  },
  "dealing-busy-schedules": {
    pdfUrl: "/worksheets/dealing-with-busy-schedules.pdf",
    title: "Dealing with Busy Schedules",
    fileSize: "165 KB",
  },
  "defining-meaning-success": {
    pdfUrl: "/worksheets/defining-your-meaning-of-success.pdf",
    title: "Defining Your Meaning of Success",
    fileSize: "164 KB",
  },
  "evaluating-wisely-spend-time": {
    pdfUrl: "/worksheets/evaluating-how-wisely-you-spend-your-time.pdf",
    title: "Evaluating How Wisely You Spend Your Time",
    fileSize: "162 KB",
  },
  "facilitating-learning": {
    pdfUrl: "/worksheets/facilitating-your-learning.pdf",
    title: "Facilitating Your Learning",
    fileSize: "173 KB",
  },
  "facing-challenges-others": {
    pdfUrl: "/worksheets/facing-challenges-by-others.pdf",
    title: "Facing Challenges by Others",
    fileSize: "161 KB",
  },
  "feeling-good-supporting-others": {
    pdfUrl: "/worksheets/feeling-good-about-supporting-others.pdf",
    title: "Feeling Good About Supporting Others",
    fileSize: "162 KB",
  },
  "gauging-external-contributions": {
    pdfUrl: "/worksheets/gauging-external-contributions.pdf",
    title: "Gauging External Contributions",
    fileSize: "161 KB",
  },
  "how-to-create-more-time": {
    pdfUrl: "/worksheets/how-to-create-more-time.pdf",
    title: "How to Create More Time",
    fileSize: "175 KB",
  },
  "make-important-career-changes": {
    pdfUrl: "/worksheets/how-to-make-important-career-changes.pdf",
    title: "How to Make Important Career Changes",
    fileSize: "178 KB",
  },
  "optimize-marketing-efforts": {
    pdfUrl: "/worksheets/how-to-optimize-your-marketing-efforts.pdf",
    title: "How to Optimize Your Marketing Efforts",
    fileSize: "164 KB",
  },
  "stick-plan": {
    pdfUrl: "/worksheets/how-to-stick-to-a-plan.pdf",
    title: "How to Stick to a Plan",
    fileSize: "174 KB",
  },
  "mindfulness-triggering-others": {
    pdfUrl: "/worksheets/mindfulness-of-triggering-others.pdf",
    title: "Mindfulness of Triggering Others",
    fileSize: "161 KB",
  },
  "problem-solving": {
    pdfUrl: "/worksheets/problem-solving.pdf",
    title: "Problem Solving",
    fileSize: "190 KB",
  },
  "refining-speak": {
    pdfUrl: "/worksheets/refining-how-you-speak-up.pdf",
    title: "Refining How You Speak Up",
    fileSize: "161 KB",
  },
  "self-affirmation-reduce-self-control-failure": {
    pdfUrl: "/worksheets/self-affirmation-to-reduce-self-control-failure.pdf",
    title: "Self-Affirmation to Reduce Self-Control Failure",
    fileSize: "181 KB",
  },
  "six-questions-greater-accomplishment": {
    pdfUrl: "/worksheets/six-questions-for-greater-accomplishment.pdf",
    title: "Six Questions for Greater Accomplishment",
    fileSize: "173 KB",
  },
  "art-generous-learning": {
    pdfUrl: "/worksheets/the-art-of-generous-learning.pdf",
    title: "The Art of Generous Learning",
    fileSize: "164 KB",
  },
  "time-management": {
    pdfUrl: "/worksheets/time-management.pdf",
    title: "Time Management",
    fileSize: "211 KB",
  },
  "a-new-perspective-on-emotions": {
    pdfUrl: "/worksheets/a-new-perspective-on-emotions.pdf",
    title: "A New Perspective on Emotions",
    fileSize: "216 KB",
  },
  "affirmations": {
    pdfUrl: "/worksheets/affirmations.pdf",
    title: "Affirmations",
    fileSize: "303 KB",
  },
  "becoming-comfortable-emotions": {
    pdfUrl: "/worksheets/becoming-comfortable-with-emotions.pdf",
    title: "Becoming Comfortable With Emotions",
    fileSize: "161 KB",
  },
  "breaking-patterns-self-judgement": {
    pdfUrl: "/worksheets/breaking-patterns-of-self-judgment.pdf",
    title: "Breaking Patterns of Self-Judgment",
    fileSize: "162 KB",
  },
  "building-inner-strength": {
    pdfUrl: "/worksheets/building-inner-strength.pdf",
    title: "Building Inner Strength",
    fileSize: "161 KB",
  },
  "calming-exhale-breath": {
    pdfUrl: "/worksheets/calming-exhale-breath.pdf",
    title: "Calming Exhale Breath",
    fileSize: "191 KB",
  },
  "caring-integrated-way": {
    pdfUrl: "/worksheets/caring-for-yourself-in-an-integrated-way.pdf",
    title: "Caring For Yourself in an Integrated Way",
    fileSize: "167 KB",
  },
  "clarifying-emotions": {
    pdfUrl: "/worksheets/clarifying-emotions.pdf",
    title: "Clarifying Emotions",
    fileSize: "180 KB",
  },
  "cultivating-gratitude": {
    pdfUrl: "/worksheets/cultivating-gratitude.pdf",
    title: "Cultivating Gratitude",
    fileSize: "161 KB",
  },
  "diving-core": {
    pdfUrl: "/worksheets/diving-into-your-core.pdf",
    title: "Diving Into Your Core",
    fileSize: "160 KB",
  },
};

/**
 * Some posts host multiple related worksheets (e.g. the workplace resources
 * hub). When the slug appears in this map, render every entry in order.
 *
 * Two worksheets — "Building a Network of Support" and "Discovering the
 * Concerns of Your Team" — had no dedicated post, so they're surfaced on the
 * closest topical hub. Per the audio-mapping-autonomy rule, worksheets are
 * also duplicated onto the most directly related single-post worksheets where
 * relevant.
 */
export const WORKSHEET_BUNDLES: Record<string, WorksheetEntry[]> = {
  "8-resources-for-teaching-mindfulness-at-the-workplace": [
    {
      pdfUrl: "/worksheets/building-a-network-of-support.pdf",
      title: "Building a Network of Support",
      fileSize: "193 KB",
      flagged: true,
    },
    {
      pdfUrl: "/worksheets/discovering-the-concerns-of-your-team.pdf",
      title: "Discovering the Concerns of Your Team",
      fileSize: "182 KB",
      flagged: true,
    },
  ],
  // Duplicate "Discovering the Concerns of Your Team" onto the closest
  // single-topic post (team contributions) — these go together for facilitators.
  "assessing-contributions-team": [
    {
      pdfUrl: "/worksheets/discovering-the-concerns-of-your-team.pdf",
      title: "Discovering the Concerns of Your Team",
      fileSize: "182 KB",
      flagged: true,
    },
  ],
};

export function getWorksheets(slug: string | undefined | null): WorksheetEntry[] {
  if (!slug) return [];
  const entries: WorksheetEntry[] = [];
  const single = WORKSHEETS[slug];
  if (single) entries.push(single);
  const bundle = WORKSHEET_BUNDLES[slug];
  if (bundle) entries.push(...bundle);
  return entries;
}
