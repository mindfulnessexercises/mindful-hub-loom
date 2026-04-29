// Per-post registry mapping section headings → ebook recommendation cards.
// Used by WPResolver to inject a styled "Free eBook" card directly beneath
// matching <h2>/<h3>/<h4> headings inside long-form posts.
//
// Mirrors the inline-audio-sections pattern (heading-text matched, native
// HTML rendered). Unlike audio, the rendered card is a clickable link to
// an existing ebook post on the site (e.g. /meditation-an-outline). This
// is how we replace generic stock photos in high-value SEO pages with
// genuinely useful, on-topic content.
//
// To add support for another post:
//   1. Pick an ebook slug that already lives at /<slug> on the site
//   2. Add an entry below keyed by the host post slug
//   3. `match` is compared (case-insensitive, punctuation-stripped)
//      against heading text; first match wins.

export interface InlineEbookCard {
  /** Substring that must appear in the heading text (case-insensitive). */
  match: string;
  /** Display title of the ebook. */
  title: string;
  /** Author / attribution line (e.g. "Ajahn Sumedho"). */
  author?: string;
  /** Internal app path to the ebook post (leading slash, no trailing). */
  href: string;
  /** Short blurb shown on the card. */
  blurb: string;
  /** Visible eyebrow label (defaults to "Free eBook"). */
  eyebrow?: string;
}

export const INLINE_EBOOK_SECTIONS: Record<string, InlineEbookCard[]> = {
  // /how-to-teach-meditation: replaces the generic "man meditating outside"
  // stock photo (which sat between the "Provide Resources" h3 and the
  // Sean Fargo section) with a directly relevant teaching ebook.
  "how-to-teach-meditation": [
    {
      match: "provide resources",
      eyebrow: "Recommended free eBook",
      title: "Meditation: An Outline",
      author: "Ajahn Sumedho",
      href: "/meditation-an-outline",
      blurb:
        "A concise primer on the foundations of meditation practice — the kind of clear, structured overview to share with new students after their first session.",
    },
  ],
};

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/&[a-z]+;/g, " ")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Injects a styled "Free eBook" recommendation card directly after any
 * heading (h2/h3/h4) whose text matches a configured ebook for the given
 * slug. Returns the original HTML when no slug entry exists (zero overhead
 * for the vast majority of posts).
 *
 * The card uses inline styles + the same design tokens already in the WP
 * prose so it inherits the page's serene look without depending on Tailwind
 * class survival through the WP HTML rewriter.
 */
export function injectInlineEbook(
  html: string,
  slug: string | undefined,
): string {
  if (!html || !slug) return html;
  const cards = INLINE_EBOOK_SECTIONS[slug];
  if (!cards || cards.length === 0) return html;

  return html.replace(
    /<(h[2-4])([^>]*)>([\s\S]*?)<\/\1>/gi,
    (full, _tag, _attrs, inner) => {
      const text = normalize(inner.replace(/<[^>]+>/g, ""));
      if (!text) return full;
      const card = cards.find((c) => text.includes(normalize(c.match)));
      if (!card) return full;

      const eyebrow = card.eyebrow ?? "Free eBook";
      const block = `
<aside class="inline-ebook-card my-8 not-prose" data-ebook-slug="${slug}">
  <a href="${card.href}" class="group flex flex-col gap-2 rounded-xl border border-border bg-[hsl(var(--section-alternate))] p-5 sm:p-6 no-underline transition-colors hover:border-primary/40 hover:bg-[hsl(var(--section-emphasis))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
    <span class="text-xs font-medium uppercase tracking-wider text-primary inline-flex items-center gap-1.5">
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path></svg>
      ${eyebrow}
    </span>
    <h3 class="text-xl font-serif text-foreground m-0">${card.title}${card.author ? ` <span class="text-base font-sans font-normal text-muted-foreground">— ${card.author}</span>` : ""}</h3>
    <p class="text-base text-muted-foreground m-0 leading-relaxed">${card.blurb}</p>
    <span class="mt-1 inline-flex items-center gap-1 text-sm font-medium text-primary">
      Read it free
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="transition-transform group-hover:translate-x-0.5"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
    </span>
  </a>
</aside>`;
      return `${full}\n${block}`;
    },
  );
}
