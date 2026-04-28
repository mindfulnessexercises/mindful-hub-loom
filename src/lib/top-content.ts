// Single source of truth for our top-100 highest-traffic legacy WP pages,
// classified by content format. Every Phase-1/Phase-2 IA feature
// (mega-menu, /quotes hub, /affirmations hub, format tile row, recommended
// next, /library Top-100 shelf, audience switcher) reads from this file
// so the taxonomy stays consistent and editable in one place.
//
// IMPORTANT — keep paths LEADING-SLASH and TRAILING-SLASH-FREE so they
// can be used directly with <Link to={...}> and string-compared against
// React Router pathnames.

export type FormatId =
  | "guided-meditations"
  | "quotes"
  | "affirmations"
  | "scripts"
  | "worksheets"
  | "ebooks"
  | "podcast"
  | "courses"
  | "certification"
  | "teaching"
  | "sound-frequency"
  | "chakra"
  | "teachers"
  | "lists";

export interface TopEntry {
  /** App-relative path with leading slash, no trailing slash. */
  path: string;
  /** Human title shown in tiles / hubs. */
  title: string;
  /** Short one-line description. */
  description?: string;
  format: FormatId;
  /** Audience modifier — used by the audience switcher on hubs. */
  audience?:
    | "men"
    | "women"
    | "teens"
    | "kids"
    | "work"
    | "anxiety"
    | "groups"
    | "yoga-teachers"
    | "therapists"
    | "everyone";
  /** Theme (sleep, stress, gratitude, …) — used for theme cross-links. */
  theme?: string;
  /** True when the post has a native audio playlist on it. */
  hasAudio?: boolean;
}

/** Format definitions with display copy + iconography hints. */
export const FORMATS: Record<
  FormatId,
  { label: string; tagline: string; icon: string; href: string }
> = {
  "guided-meditations": {
    label: "Guided Meditations",
    tagline: "Listen to short, free guided practices",
    icon: "Headphones",
    href: "/audio-library",
  },
  quotes: {
    label: "Mindfulness Quotes",
    tagline: "Curated collections to read & reflect on",
    icon: "Quote",
    href: "/quotes",
  },
  affirmations: {
    label: "Affirmations",
    tagline: "Words to repeat for confidence and calm",
    icon: "Sparkles",
    href: "/affirmations",
  },
  scripts: {
    label: "Meditation Scripts",
    tagline: "Free scripts for teachers & therapists",
    icon: "FileText",
    href: "/meditation-scripts",
  },
  worksheets: {
    label: "Worksheets",
    tagline: "Printable PDFs for personal & client use",
    icon: "ClipboardList",
    href: "/free-mindfulness-worksheets",
  },
  ebooks: {
    label: "Ebooks",
    tagline: "Free downloadable mindfulness ebooks",
    icon: "BookOpen",
    href: "/free-mindfulness-e-books",
  },
  podcast: {
    label: "Podcast",
    tagline: "Conversations with leading teachers",
    icon: "Mic",
    href: "/podcast",
  },
  courses: {
    label: "Free Courses",
    tagline: "Self-paced programs to deepen practice",
    icon: "GraduationCap",
    href: "/free-online-mindfulness-courses",
  },
  certification: {
    label: "Get Certified",
    tagline: "Become a mindfulness meditation teacher",
    icon: "Award",
    href: "/best-mindfulness-certification-programs",
  },
  teaching: {
    label: "How to Teach",
    tagline: "Resources for new & growing teachers",
    icon: "Users",
    href: "/how-to-teach-meditation",
  },
  "sound-frequency": {
    label: "Sound & Frequency",
    tagline: "Healing tones, delta waves, chants",
    icon: "Music2",
    href: "/audio-library?theme=sound",
  },
  chakra: {
    label: "Chakra Practice",
    tagline: "Affirmations and chants by chakra",
    icon: "Flower",
    href: "/affirmations?audience=chakra",
  },
  teachers: {
    label: "Teachers",
    tagline: "Profiles of teachers we feature",
    icon: "UserCircle",
    href: "/about-us",
  },
  lists: {
    label: "Curated Lists",
    tagline: "Hand-picked round-ups & resources",
    icon: "List",
    href: "/library?tab=posts",
  },
};

// ---------------------------------------------------------------------
// The classified top-100 list. Hand-tagged from the audit so we can wire
// recommendations + audience filtering without external data.
// ---------------------------------------------------------------------
export const TOP_ENTRIES: TopEntry[] = [
  // Quotes (14)
  { path: "/karma-quotes", title: "Karma Quotes", format: "quotes", theme: "growth", hasAudio: true },
  { path: "/silence-quotes", title: "Silence Quotes", format: "quotes", theme: "stillness" },
  { path: "/stoic-quotes", title: "Stoic Quotes", format: "quotes", theme: "resilience" },
  { path: "/healing-quotes", title: "Healing Quotes", format: "quotes", theme: "healing" },
  { path: "/self-worth-quotes", title: "Self-Worth Quotes", format: "quotes", theme: "self-love" },
  { path: "/letting-go-quotes", title: "Letting Go Quotes", format: "quotes", theme: "release" },
  { path: "/good-night-quotes", title: "Good Night Quotes", format: "quotes", theme: "sleep" },
  { path: "/empathy-quotes", title: "Empathy Quotes", format: "quotes", theme: "compassion" },
  { path: "/self-care-quotes", title: "Self-Care Quotes", format: "quotes", theme: "self-care", hasAudio: true },
  { path: "/stress-quotes", title: "Stress Quotes", format: "quotes", theme: "stress" },
  { path: "/mindset-quotes", title: "Growth Mindset Quotes", format: "quotes", theme: "growth", hasAudio: true },
  { path: "/meaningful-work/meaningful-work-quotes", title: "Meaningful Work Quotes", format: "quotes", theme: "purpose", hasAudio: true },
  { path: "/resilience-quotes", title: "Resilience Quotes", format: "quotes", theme: "resilience" },
  { path: "/meditation-quotes", title: "Meditation Quotes", format: "quotes", theme: "practice" },

  // Affirmations (11)
  { path: "/positive-affirmations-for-men", title: "Positive Affirmations for Men", format: "affirmations", audience: "men" },
  { path: "/positive-affirmations-for-women", title: "Positive Affirmations for Women", format: "affirmations", audience: "women" },
  { path: "/morning-affirmations", title: "Morning Affirmations", format: "affirmations", audience: "everyone", theme: "morning" },
  { path: "/positive-affirmations-for-teens", title: "Positive Affirmations for Teens", format: "affirmations", audience: "teens" },
  { path: "/gratitude-affirmations", title: "Gratitude Affirmations", format: "affirmations", audience: "everyone", theme: "gratitude" },
  { path: "/positive-affirmations-for-kids", title: "Positive Affirmations for Kids", format: "affirmations", audience: "kids" },
  { path: "/motivational-affirmations", title: "Motivational Affirmations", format: "affirmations", audience: "everyone", theme: "motivation" },
  { path: "/i-am-affirmations", title: "I AM Affirmations", format: "affirmations", audience: "everyone", theme: "identity" },
  { path: "/self-love-affirmations", title: "Self-Love Affirmations", format: "affirmations", audience: "everyone", theme: "self-love" },
  { path: "/positive-affirmations-for-work", title: "Affirmations for Work", format: "affirmations", audience: "work" },
  { path: "/affirmations-for-anxiety", title: "Affirmations for Anxiety", format: "affirmations", audience: "anxiety" },

  // Chakra (5) — sit alongside affirmations as a sub-bucket
  { path: "/chakra-affirmations", title: "Chakra Affirmations", format: "chakra", audience: "everyone" },
  { path: "/heart-chakra-affirmations", title: "Heart Chakra Affirmations", format: "chakra", audience: "everyone", theme: "heart" },
  { path: "/throat-chakra-affirmations", title: "Throat Chakra Affirmations", format: "chakra", audience: "everyone", theme: "throat" },
  { path: "/sacral-chakra-affirmations", title: "Sacral Chakra Affirmations", format: "chakra", audience: "everyone", theme: "sacral" },
  { path: "/7-chakras-healing-chants-chakra-seed-mantras-meditation-music", title: "7 Chakras Healing Chants & Seed Mantras", format: "chakra", theme: "music" },

  // Scripts (11)
  { path: "/free-guided-meditation-scripts", title: "Free Guided Meditation Scripts", format: "scripts", audience: "everyone" },
  { path: "/guided-meditation-scripts-for-groups", title: "Scripts for Groups", format: "scripts", audience: "groups" },
  { path: "/how-to-write-a-meditation-script", title: "How to Write a Meditation Script", format: "scripts", audience: "everyone", theme: "craft" },
  { path: "/meditation-scripts-for-kids", title: "Scripts for Kids", format: "scripts", audience: "kids" },
  { path: "/meditation-scripts-for-stress", title: "Scripts for Stress", format: "scripts", theme: "stress" },
  { path: "/7-guided-meditation-scripts-for-yoga-teachers", title: "7 Scripts for Yoga Teachers", format: "scripts", audience: "yoga-teachers" },
  { path: "/meditation-scripts-for-anxiety", title: "Scripts for Anxiety", format: "scripts", theme: "anxiety" },
  { path: "/sleep-meditation-scripts", title: "Sleep Meditation Scripts", format: "scripts", theme: "sleep" },
  { path: "/5-minute-meditation-script-from-mindfulness-exercises", title: "5-Minute Meditation Script", format: "scripts", theme: "short" },
  { path: "/how-to-record-a-meditation", title: "How to Record a Meditation", format: "scripts", theme: "craft" },
  { path: "/guided-meditation-scripts-instant-download", title: "Scripts — Instant Download Bundle", format: "scripts", theme: "bundle" },
  { path: "/9-mindfulness-scripts-for-therapists", title: "9 Scripts for Therapists", format: "scripts", audience: "therapists" },

  // Worksheets (2)
  { path: "/free-mindfulness-worksheets", title: "Free Mindfulness Worksheets", format: "worksheets", audience: "everyone" },
  { path: "/300-mindfulness-worksheets-sale", title: "300 Mindfulness Worksheets", format: "worksheets", theme: "bundle" },

  // Ebooks (1)
  { path: "/free-mindfulness-e-books", title: "Free Mindfulness Ebooks", format: "ebooks", audience: "everyone" },

  // Guided meditations (27)
  { path: "/spring-meditation", title: "Spring Meditation", format: "guided-meditations", theme: "seasonal" },
  { path: "/meditation/sexual-meditation", title: "Mindful Sexuality Meditation", format: "guided-meditations", audience: "everyone" },
  { path: "/top-guided-meditations", title: "Top Guided Meditations", format: "guided-meditations", theme: "roundup" },
  { path: "/short-body-scan", title: "Short Body Scan", format: "guided-meditations", theme: "body" },
  { path: "/free-guided-meditations-mindfulness-talks", title: "Free Guided Meditations & Talks", format: "guided-meditations", theme: "roundup" },
  { path: "/inner-child-guided-meditation", title: "Inner Child Meditation", format: "guided-meditations", theme: "healing" },
  { path: "/alleviate-stress-with-three-deep-breaths", title: "Three Deep Breaths for Stress", format: "guided-meditations", theme: "stress" },
  { path: "/self-compassion-pause", title: "Self-Compassion Pause", format: "guided-meditations", theme: "self-love" },
  { path: "/free-mindfulness-exercises", title: "Free Mindfulness Exercises", format: "guided-meditations", theme: "roundup" },
  { path: "/bringing-your-mind-back-from-thoughts", title: "Bringing Your Mind Back", format: "guided-meditations", theme: "focus" },
  { path: "/body-scan-advanced", title: "Advanced Body Scan", format: "guided-meditations", theme: "body" },
  { path: "/using-rain-for-difficult-emotions-and-thoughts", title: "RAIN for Difficult Emotions", format: "guided-meditations", theme: "emotions" },
  { path: "/visualization-to-relax-the-mind-for-deep-sleep", title: "Visualization for Deep Sleep", format: "guided-meditations", theme: "sleep" },
  { path: "/dropping-the-suitcases-of-worries-and-regrets", title: "Dropping the Suitcases", format: "guided-meditations", theme: "release" },
  { path: "/teen-meditation-to-believe-in-yourself", title: "Teen Meditation to Believe in Yourself", format: "guided-meditations", audience: "teens" },
  { path: "/visualizing-your-peaceful-and-beautiful-place", title: "Your Peaceful Place Visualization", format: "guided-meditations", theme: "calm" },
  { path: "/focusing-on-the-colors-you-see", title: "Focusing on Colors You See", format: "guided-meditations", theme: "senses" },
  { path: "/why-are-we-so-ungrateful", title: "Why Are We So Ungrateful?", format: "guided-meditations", theme: "gratitude" },
  { path: "/stress-creates-erectile-dysfunction", title: "Stress, Body & Intimacy", format: "guided-meditations", theme: "stress" },
  { path: "/perfect-10-breaths-guided-script", title: "Perfect 10 Breaths Script", format: "guided-meditations", theme: "breath" },
  { path: "/5-minutes-to-regain-calm-clarity-and-confidence", title: "5 Minutes to Regain Calm", format: "guided-meditations", theme: "short" },
  { path: "/fck-honest-meditation-video", title: "Honest Meditation (Real Talk)", format: "guided-meditations", theme: "real-talk" },
  { path: "/body-scan-intermediate", title: "Intermediate Body Scan", format: "guided-meditations", theme: "body" },
  { path: "/sleep-meditation-release-worry", title: "Sleep Meditation: Release Worry", format: "guided-meditations", theme: "sleep" },
  { path: "/self-compassion-visualization-the-blanket-of-love", title: "Blanket of Love Self-Compassion", format: "guided-meditations", theme: "self-love" },
  { path: "/short-mindfulness-quotes-processes", title: "Short Mindfulness Processes", format: "guided-meditations", theme: "short" },
  { path: "/walking-meditation-guided-script", title: "Walking Meditation Script", format: "guided-meditations", theme: "movement" },

  // Sound / frequency (3)
  { path: "/528hz-miracle-tone", title: "528 Hz Miracle Tone", format: "sound-frequency", theme: "tone" },
  { path: "/417-hz-wipes-negative-energy", title: "417 Hz — Clear Energy", format: "sound-frequency", theme: "tone" },
  { path: "/sleep-music-delta-waves", title: "Sleep Music — Delta Waves", format: "sound-frequency", theme: "sleep" },

  // Podcast (5 episodes + 1 hub)
  { path: "/mindfulness-and-meditation-podcasts", title: "Mindfulness & Meditation Podcasts (Hub)", format: "podcast", theme: "hub" },
  { path: "/podcast-episodes/the-tradition-of-loving-kindness-with-donald-rothberg", title: "Loving Kindness with Donald Rothberg", format: "podcast" },
  { path: "/podcast-episodes/dealing-with-the-inner-critic", title: "Dealing With the Inner Critic", format: "podcast" },
  { path: "/podcast-episodes/people-crave-presence-not-more-content", title: "People Crave Presence, Not More Content", format: "podcast" },
  { path: "/podcast-episodes/5-essential-skills-for-embodied-mindfulness-with-lynda-caesara", title: "5 Skills for Embodied Mindfulness — Lynda Caesara", format: "podcast" },
  { path: "/podcast-episodes/dr-gabor-mate-on-compassionate-inquiry-with-sean-fargo", title: "Dr. Gabor Maté on Compassionate Inquiry", format: "podcast" },

  // Courses (4)
  { path: "/free-online-mindfulness-courses", title: "Free Online Mindfulness Courses (Hub)", format: "courses" },
  { path: "/free-online-mindfulness-courses/28-day-mindfulness-challenge", title: "28-Day Mindfulness Challenge", format: "courses" },
  { path: "/free-online-mindfulness-courses/mindfulness-made-easy", title: "Mindfulness Made Easy", format: "courses" },
  { path: "/free-online-mindfulness-courses/10-day-vipassana-course", title: "10-Day Vipassana Course", format: "courses" },

  // Certification (2)
  { path: "/best-mindfulness-certification-programs", title: "Best Certification Programs (Comparison)", format: "certification" },
  { path: "/premium-mindfulness-meditation-trainings", title: "Premium Trainings", format: "certification" },

  // Teaching (3)
  { path: "/how-to-teach-meditation", title: "How to Teach Meditation", format: "teaching" },
  { path: "/demand-for-mindfulness-teachers-is-rising", title: "The Demand for Mindfulness Teachers", format: "teaching" },
  { path: "/how-to-teach-meditation/how-to-lead-a-guided-meditation", title: "How to Lead a Guided Meditation", format: "teaching" },

  // Lists / curated (4 not already counted under another bucket)
  { path: "/20-mindful-questions-to-ask-yourself", title: "20 Mindful Questions to Ask Yourself", format: "lists", theme: "reflection" },
  { path: "/8-mindfulness-exercises-for-beginners", title: "8 Mindfulness Exercises for Beginners", format: "lists", audience: "everyone" },
  { path: "/7-mindfulness-exercises-for-groups", title: "7 Mindfulness Exercises for Groups", format: "lists", audience: "groups" },
  { path: "/10-resources-for-how-to-teach-trauma-sensitive-mindfulness", title: "10 Resources: Trauma-Sensitive Mindfulness", format: "lists", theme: "trauma-sensitive" },

  // Teachers (2)
  { path: "/mindfulness-teacher/sean-fargo", title: "Sean Fargo", format: "teachers" },
  { path: "/mindfulness-teacher/joseph-goldstein", title: "Joseph Goldstein", format: "teachers" },
];

/** Lookup helpers used across the IA. */

const BY_PATH = new Map(TOP_ENTRIES.map((e) => [e.path, e]));

export function getTopEntry(path: string): TopEntry | undefined {
  if (!path) return undefined;
  // Normalize: strip trailing slash, ensure leading slash.
  let p = path.startsWith("/") ? path : `/${path}`;
  if (p.length > 1 && p.endsWith("/")) p = p.slice(0, -1);
  return BY_PATH.get(p);
}

export function entriesByFormat(format: FormatId): TopEntry[] {
  return TOP_ENTRIES.filter((e) => e.format === format);
}

export function entriesByAudience(
  format: FormatId,
  audience: TopEntry["audience"],
): TopEntry[] {
  return TOP_ENTRIES.filter((e) => e.format === format && e.audience === audience);
}

/** Audiences present for a given format (used to render switcher chips). */
export function audiencesForFormat(format: FormatId): TopEntry["audience"][] {
  const set = new Set<TopEntry["audience"]>();
  for (const e of TOP_ENTRIES) {
    if (e.format === format && e.audience) set.add(e.audience);
  }
  return Array.from(set);
}

export const AUDIENCE_LABELS: Record<NonNullable<TopEntry["audience"]>, string> = {
  men: "For Men",
  women: "For Women",
  teens: "For Teens",
  kids: "For Kids",
  work: "For Work",
  anxiety: "For Anxiety",
  groups: "For Groups",
  "yoga-teachers": "For Yoga Teachers",
  therapists: "For Therapists",
  everyone: "Everyone",
};

/**
 * Pick up to N related entries for "Recommended next" sidecards.
 * Strategy:
 *   1. Same format + same theme (strongest)
 *   2. Same format + any audience match
 *   3. Same format (fill the rest)
 */
export function recommendedNext(
  currentPath: string,
  limit = 4,
): TopEntry[] {
  const cur = getTopEntry(currentPath);
  if (!cur) return [];
  const pool = TOP_ENTRIES.filter((e) => e.path !== cur.path);
  const tierA = pool.filter(
    (e) => e.format === cur.format && cur.theme && e.theme === cur.theme,
  );
  const tierB = pool.filter(
    (e) =>
      e.format === cur.format &&
      cur.audience &&
      e.audience === cur.audience &&
      !tierA.includes(e),
  );
  const tierC = pool.filter(
    (e) => e.format === cur.format && !tierA.includes(e) && !tierB.includes(e),
  );
  return [...tierA, ...tierB, ...tierC].slice(0, limit);
}

/** Cross-format suggestions, e.g. on a /quotes page → matching audio + script. */
export function crossFormatBridges(currentPath: string): TopEntry[] {
  const cur = getTopEntry(currentPath);
  if (!cur || !cur.theme) return [];
  return TOP_ENTRIES.filter(
    (e) => e.path !== cur.path && e.theme === cur.theme && e.format !== cur.format,
  ).slice(0, 3);
}
