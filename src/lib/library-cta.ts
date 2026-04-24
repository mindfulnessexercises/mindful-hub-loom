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
}

interface Rule {
  /** Substrings to look for in any category slug or name (lowercased). */
  match: string[];
  cta: InlineCTA;
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

const DEFAULT_POST_CTA: InlineCTA = { label: "Read article" };
const DEFAULT_PAGE_CTA: InlineCTA = { label: "View page" };

function matchBy(haystack: string): InlineCTA | undefined {
  const h = haystack.toLowerCase();
  for (const rule of RULES) {
    if (rule.match.some((kw) => h.includes(kw))) return rule.cta;
  }
  return undefined;
}

export function getPostInlineCTA(post: WPPost): InlineCTA {
  const cats: WPTerm[] = getCategories(post);
  const haystack = cats.map((c) => `${c.slug} ${c.name}`).join(" ");
  return matchBy(haystack) ?? DEFAULT_POST_CTA;
}

export function getPageInlineCTA(page: WPPage): InlineCTA {
  // Pages don't carry categories; match against slug + title text.
  const haystack = `${page.slug} ${page.title?.rendered ?? ""}`;
  return matchBy(haystack) ?? DEFAULT_PAGE_CTA;
}
