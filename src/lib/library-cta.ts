// Maps a card's categories (or page slug) to a contextual inline CTA shown
// inside Library cards. Goal: lift CTR by replacing the generic "Read article"
// affordance with an action that matches the resource's intent.
//
// Matching is done by category slug *contains* keywords — WordPress taxonomies
// vary, so we use loose matches and fall back to a sensible default. Order
// matters: the FIRST matching rule wins.

import type { WPPost, WPPage, WPTerm } from "@/lib/wp";
import { getCategories } from "@/lib/wp";

export interface InlineCTA {
  /** Text shown on the inline link inside the card. */
  label: string;
  /** Optional in-app destination. When set, the CTA links here instead of the resource itself. */
  href?: string;
  /** Whether a category-rule produced this CTA (false → default fallback). Used by analytics. */
  matched: boolean;
  /** Category that triggered the rule, if any — surfaced to analytics. */
  matchedCategory?: { id: number; slug: string };
}

interface Rule {
  /** Substrings to look for in any category slug or name (lowercased). */
  match: string[];
  cta: Omit<InlineCTA, "matched" | "matchedCategory">;
}

const RULES: Rule[] = [
  {
    match: ["certif", "teacher-training", "training"],
    cta: { label: "Explore certification", href: "/teacher-certification" },
  },
  {
    match: ["live", "event", "retreat", "workshop", "webinar"],
    cta: { label: "Join a live session", href: "/live-events" },
  },
  {
    match: ["script", "guided", "meditation-script"],
    cta: { label: "Get the free script" },
  },
  {
    match: ["practice", "exercise", "meditation", "breath", "mindful"],
    cta: { label: "Get free practice" },
  },
  {
    match: ["worksheet", "pdf", "download", "resource"],
    cta: { label: "Download resource" },
  },
  {
    match: ["course", "lesson", "learn"],
    cta: { label: "Start learning" },
  },
  {
    match: ["research", "study", "science"],
    cta: { label: "Read the research" },
  },
];

const DEFAULT_POST_CTA: Omit<InlineCTA, "matched" | "matchedCategory"> = { label: "Read article" };
const DEFAULT_PAGE_CTA: Omit<InlineCTA, "matched" | "matchedCategory"> = { label: "View page" };

export function getPostInlineCTA(post: WPPost): InlineCTA {
  const cats: WPTerm[] = getCategories(post);
  // Try each category in order so we can attribute the match to a specific
  // category id/slug (useful for analytics segmentation).
  for (const cat of cats) {
    const haystack = `${cat.slug} ${cat.name}`.toLowerCase();
    for (const rule of RULES) {
      if (rule.match.some((kw) => haystack.includes(kw))) {
        return { ...rule.cta, matched: true, matchedCategory: { id: cat.id, slug: cat.slug } };
      }
    }
  }
  return { ...DEFAULT_POST_CTA, matched: false };
}

export function getPageInlineCTA(page: WPPage): InlineCTA {
  // Pages don't carry categories; match against slug + title text.
  const haystack = `${page.slug} ${page.title?.rendered ?? ""}`.toLowerCase();
  for (const rule of RULES) {
    if (rule.match.some((kw) => haystack.includes(kw))) {
      return { ...rule.cta, matched: true };
    }
  }
  return { ...DEFAULT_PAGE_CTA, matched: false };
}
