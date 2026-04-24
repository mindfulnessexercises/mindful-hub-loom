// Maps a card's categories (or page slug) to a contextual inline CTA shown
// inside Library cards. Goal: lift CTR by replacing the generic "Read article"
// affordance with an action that matches the resource's intent.
//
// Match priority (first match wins):
//   1. Category slug/name keyword match  (most specific — taxonomy-driven)
//   2. Title keyword match               (fallback — useful when WP categories
//                                         are missing, generic, or "uncategorized")
//   3. Default ("Read article" / "View page")
//
// Keyword lists are intentionally broad and lowercased — WP taxonomies vary
// across sites, so we use loose substring matches. Order in RULES matters.

import type { WPPost, WPPage, WPTerm } from "@/lib/wp";
import { getCategories, stripHtml } from "@/lib/wp";

export interface InlineCTA {
  /** Text shown on the inline link inside the card. */
  label: string;
  /** Optional in-app destination. When set, the CTA links here instead of the resource itself. */
  href?: string;
  /** Whether a category-rule produced this CTA (false → default fallback). Used by analytics. */
  matched: boolean;
  /** Where the match came from: "category", "title", or "default" — surfaced to analytics. */
  matchSource: "category" | "title" | "default";
  /** Category that triggered the rule, if any — surfaced to analytics. */
  matchedCategory?: { id: number; slug: string };
}

interface Rule {
  /** Substrings to look for in any category slug/name OR post title (lowercased). */
  match: string[];
  cta: Omit<InlineCTA, "matched" | "matchedCategory" | "matchSource">;
}

/**
 * Rules ordered most-specific → least-specific. The first matching rule wins,
 * so put narrow intents (certification, events) above broad ones (practice).
 */
const RULES: Rule[] = [
  // ── Certification & teacher training ────────────────────────────────────
  {
    match: [
      "certif", "teacher-training", "training", "teacher-certif",
      "become-a-teacher", "yoga-alliance", "ce-credit", "continuing-education",
      "accredit", "credential",
    ],
    cta: { label: "Explore certification", href: "/teacher-certification" },
  },

  // ── Live events / cohort programs ───────────────────────────────────────
  {
    match: [
      "live", "event", "retreat", "workshop", "webinar", "summit",
      "cohort", "live-session", "online-event", "conference", "training-call",
    ],
    cta: { label: "Join a live session", href: "/live-events" },
  },

  // ── Audio (separate from generic scripts so we can use a stronger verb) ─
  {
    match: [
      "audio", "mp3", "podcast", "soundtrack", "recording", "guided-audio",
      "listen",
    ],
    cta: { label: "Listen now" },
  },

  // ── Video content ───────────────────────────────────────────────────────
  {
    match: ["video", "youtube", "watch", "film"],
    cta: { label: "Watch the video" },
  },

  // ── Scripts (text-based guided practice) ────────────────────────────────
  {
    match: [
      "script", "guided", "meditation-script", "guided-script",
      "guided-meditation", "read-aloud", "facilitator-script",
    ],
    cta: { label: "Get the free script" },
  },

  // ── Worksheets, PDFs, downloads ─────────────────────────────────────────
  {
    match: [
      "worksheet", "pdf", "download", "handout", "printable", "template",
      "workbook", "checklist", "journal-prompt", "journal-prompts",
    ],
    cta: { label: "Download resource" },
  },

  // ── Courses & structured learning ───────────────────────────────────────
  {
    match: [
      "course", "lesson", "module", "curriculum", "syllabus",
      "online-course", "self-paced", "masterclass",
    ],
    cta: { label: "Start learning" },
  },

  // ── Research & academic content ─────────────────────────────────────────
  {
    match: [
      "research", "study", "studies", "science", "evidence", "neuroscience",
      "clinical", "peer-review", "peer-reviewed", "meta-analysis",
    ],
    cta: { label: "Read the research" },
  },

  // ── Practices / exercises (generic — keep last among "do" intents) ──────
  {
    match: [
      "practice", "exercise", "meditation", "breath", "breathing", "mindful",
      "mindfulness", "body-scan", "loving-kindness", "metta", "self-compassion",
      "compassion", "visualization", "grounding", "relaxation",
    ],
    cta: { label: "Get free practice" },
  },

  // ── Audience-specific content ───────────────────────────────────────────
  {
    match: ["kids", "children", "teen", "teens", "youth", "schools", "classroom"],
    cta: { label: "Try with kids" },
  },
  {
    match: ["sleep", "insomnia", "bedtime", "night"],
    cta: { label: "Try a sleep practice" },
  },
  {
    match: ["anxiety", "stress", "burnout", "overwhelm", "panic"],
    cta: { label: "Try a calming practice" },
  },
  {
    match: ["grief", "loss", "trauma", "ptsd"],
    cta: { label: "Find gentle support" },
  },
  {
    match: ["beginner", "getting-started", "intro", "introduction", "101", "basics"],
    cta: { label: "Start here" },
  },
];

const DEFAULT_POST_CTA: Omit<InlineCTA, "matched" | "matchedCategory" | "matchSource"> = {
  label: "Read article",
};
const DEFAULT_PAGE_CTA: Omit<InlineCTA, "matched" | "matchedCategory" | "matchSource"> = {
  label: "View page",
};

/** Test a single haystack string against every rule, returning the first match. */
function findRule(haystack: string): Rule | undefined {
  const h = haystack.toLowerCase();
  for (const rule of RULES) {
    if (rule.match.some((kw) => h.includes(kw))) return rule;
  }
  return undefined;
}

export function getPostInlineCTA(post: WPPost): InlineCTA {
  // 1. Category-based match (most reliable when WP taxonomy is curated).
  //    Iterate per-category so we can attribute the matched category id/slug
  //    to analytics — useful when one post has multiple categories.
  const cats: WPTerm[] = getCategories(post);
  for (const cat of cats) {
    const rule = findRule(`${cat.slug} ${cat.name}`);
    if (rule) {
      return {
        ...rule.cta,
        matched: true,
        matchSource: "category",
        matchedCategory: { id: cat.id, slug: cat.slug },
      };
    }
  }

  // 2. Title fallback — covers posts in "Uncategorized" or with generic
  //    categories like "Blog". Strip HTML so entities and tags don't break
  //    the substring match.
  const titleText = stripHtml(post.title?.rendered ?? "");
  if (titleText) {
    const rule = findRule(titleText);
    if (rule) {
      return { ...rule.cta, matched: true, matchSource: "title" };
    }
  }

  // 3. Default fallback.
  return { ...DEFAULT_POST_CTA, matched: false, matchSource: "default" };
}

export function getPageInlineCTA(page: WPPage): InlineCTA {
  // Pages don't carry categories; match slug first (curated, stable),
  // then fall back to the rendered title text.
  const slugRule = findRule(page.slug);
  if (slugRule) {
    return { ...slugRule.cta, matched: true, matchSource: "category" };
  }

  const titleText = stripHtml(page.title?.rendered ?? "");
  if (titleText) {
    const titleRule = findRule(titleText);
    if (titleRule) {
      return { ...titleRule.cta, matched: true, matchSource: "title" };
    }
  }

  return { ...DEFAULT_PAGE_CTA, matched: false, matchSource: "default" };
}
