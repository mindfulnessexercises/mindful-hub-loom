/**
 * Transforms legacy WordPress "RELATED POSTS:" bullet lists into clearly
 * styled, scannable card-style links.
 *
 * Legacy markup found inside WP `content.rendered`:
 *
 *   <p><strong>RELATED POSTS:</strong></p>
 *   <ul>
 *     <li><span data-sheets-*…><a href="…" target="_blank">Stress Quotes</a></span></li>
 *     <li>…</li>
 *   </ul>
 *
 * The bullet list reads as paragraph text — visitors don't realise each item
 * is a link, especially on mobile (we've had explicit user feedback). This
 * transformer:
 *
 *   1. Detects the "RELATED POSTS" header paragraph + the immediately
 *      following <ul>.
 *   2. Replaces them with a `not-prose` aside that uses semantic-token
 *      Tailwind classes to render each link as a tappable card with arrow.
 *   3. Strips Google-Sheets paste cruft (`data-sheets-*` spans) and
 *      `target="_blank"` so internal links route via React Router.
 *
 * Runs after `rewriteWpHtml` so internal href rewriting is preserved.
 */

const HEADER_RE =
  /<p\b[^>]*>\s*(?:<(?:strong|b)\b[^>]*>\s*)?related\s+posts?\s*:?\s*(?:<\/(?:strong|b)>\s*)?<\/p>\s*<ul\b[^>]*>([\s\S]*?)<\/ul>/gi;

const SHEETS_SPAN_RE = /<span\b[^>]*data-sheets-[^>]*>([\s\S]*?)<\/span>/gi;
const ANCHOR_RE = /<a\b([^>]*)>([\s\S]*?)<\/a>/gi;

const ITEM_LINK_CLASS =
  "group flex items-center justify-between gap-3 min-h-[44px] rounded-lg border border-border bg-card px-4 py-3 text-foreground no-underline transition-all hover:border-primary/40 hover:bg-[hsl(var(--section-alternate))] hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary";

const ARROW_SVG = `<svg aria-hidden="true" class="h-4 w-4 shrink-0 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>`;

export function transformRelatedPostsBlocks(html: string): string {
  if (!html || !/related\s+posts/i.test(html)) return html;

  return html.replace(HEADER_RE, (_match, listInner: string) => {
    // 1. Strip Google Sheets paste wrappers.
    let items = listInner.replace(SHEETS_SPAN_RE, "$1");

    // 2. For each <a>, drop inline outline styles & external target,
    //    add the card classes + a trailing arrow.
    items = items.replace(ANCHOR_RE, (_m, attrs: string, inner: string) => {
      const cleanedAttrs = attrs
        .replace(/\sstyle="[^"]*"/gi, "")
        .replace(/\starget="_blank"/gi, "")
        .replace(/\srel="[^"]*"/gi, "")
        .replace(/\sclass="[^"]*"/gi, "");
      return `<a${cleanedAttrs} class="${ITEM_LINK_CLASS}"><span class="text-body font-medium leading-snug">${inner}</span>${ARROW_SVG}</a>`;
    });

    // 3. Clean each <li>: drop bullets via list-none, gap via grid.
    items = items.replace(/<li\b[^>]*>/gi, '<li class="list-none">');

    return `<aside class="not-prose my-8 rounded-xl border border-border bg-[hsl(var(--section-alternate))] p-5 sm:p-6" data-related-posts aria-label="Related posts">
  <p class="text-eyebrow text-primary mb-3 m-0">Related posts</p>
  <ul class="grid gap-2 sm:grid-cols-2 list-none p-0 m-0">${items}</ul>
</aside>`;
  });
}
