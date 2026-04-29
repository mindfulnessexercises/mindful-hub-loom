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
 *   1. Detects the "RELATED POSTS" (or "Related Posts") header paragraph.
 *   2. Replaces the header + the immediately-following <ul> with a wrapped
 *      block carrying a `data-related-posts` attribute and class names
 *      (`related-posts-block`, `related-posts-list`, `related-posts-item`)
 *      that prose.css styles into a card grid (border, padding, hover, arrow).
 *   3. Strips Google-Sheets paste cruft (`data-sheets-*` spans) so each <li>
 *      is just a clean anchor.
 *
 * Runs after `rewriteWpHtml` so internal href rewriting is preserved. No
 * React component is needed — keeps the prose flow and is SSR-friendly.
 */

const HEADER_RE =
  /<p\b[^>]*>\s*(?:<(?:strong|b)\b[^>]*>\s*)?related\s+posts?\s*:?\s*(?:<\/(?:strong|b)>\s*)?<\/p>\s*<ul\b[^>]*>([\s\S]*?)<\/ul>/gi;

const SHEETS_SPAN_RE = /<span\b[^>]*data-sheets-[^>]*>([\s\S]*?)<\/span>/gi;

export function transformRelatedPostsBlocks(html: string): string {
  if (!html || !/related\s+posts/i.test(html)) return html;

  return html.replace(HEADER_RE, (_match, listInner: string) => {
    // Strip Google Sheets paste wrappers so anchors stand alone.
    const cleanedItems = listInner.replace(SHEETS_SPAN_RE, "$1");

    // Drop any inline style="outline: none" on anchors — interferes with
    // our focus-visible styles. Also force target="_self" for internal
    // links so React Router's link interceptor can intercept (rewriteWpHtml
    // already converts hrefs but anchors here came in with target="_blank").
    const finalItems = cleanedItems
      .replace(/\sstyle="outline:\s*none[^"]*"/gi, "")
      .replace(/\starget="_blank"/gi, "");

    return `<aside class="related-posts-block not-prose" data-related-posts aria-label="Related posts">
  <p class="related-posts-eyebrow">Related posts</p>
  <ul class="related-posts-list">${finalItems}</ul>
</aside>`;
  });
}
