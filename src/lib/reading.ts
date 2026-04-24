// Reading-time + table-of-contents helpers shared by WPResolver.
// Pure functions so they're trivial to test and reuse.

const WORDS_PER_MINUTE = 220;

export function estimateReadingMinutes(html: string): number {
  if (!html) return 0;
  const text = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  if (!text) return 0;
  const words = text.split(" ").length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

export interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

/**
 * Slugify a heading's text into a stable, readable id. Falls back to a hash
 * of the position when the text is empty (rare, but possible for icon-only
 * headings).
 */
function slugifyHeading(text: string, fallback: number): string {
  const slug = text
    .toLowerCase()
    .replace(/<[^>]*>/g, " ")
    .replace(/&[a-z]+;/g, " ")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 60);
  return slug || `section-${fallback}`;
}

/**
 * Walks an HTML string and returns:
 *   1. The HTML with `id` attributes injected into every <h2>/<h3> so anchor
 *      navigation works.
 *   2. A flat list of TocItem entries in document order.
 *
 * Skips headings inside <aside>/<nav>/<figure> so chrome doesn't pollute the
 * outline.
 */
export function extractToc(html: string): { html: string; items: TocItem[] } {
  if (!html || typeof window === "undefined" || typeof DOMParser === "undefined") {
    return { html, items: [] };
  }
  const doc = new DOMParser().parseFromString(html, "text/html");
  const headings = Array.from(doc.querySelectorAll("h2, h3")) as HTMLHeadingElement[];
  const items: TocItem[] = [];
  const seen = new Set<string>();

  headings.forEach((h, idx) => {
    if (h.closest("aside, nav, figure")) return;
    const text = (h.textContent ?? "").trim();
    if (!text) return;
    let id = h.getAttribute("id") || slugifyHeading(text, idx);
    // Ensure unique ids when WP repeats headings.
    let suffix = 2;
    while (seen.has(id)) id = `${id}-${suffix++}`;
    seen.add(id);
    h.setAttribute("id", id);
    items.push({ id, text, level: h.tagName === "H2" ? 2 : 3 });
  });

  return { html: doc.body.innerHTML, items };
}

/**
 * Find the first <audio> source URL in HTML — used to surface a sticky
 * podcast player above the WordPress-rendered content.
 */
export function extractFirstAudioUrl(html: string): string | null {
  if (!html || typeof window === "undefined" || typeof DOMParser === "undefined") {
    return null;
  }
  const doc = new DOMParser().parseFromString(html, "text/html");
  const audio = doc.querySelector("audio source[src], audio[src]") as
    | HTMLSourceElement
    | HTMLAudioElement
    | null;
  if (!audio) {
    // Some WP plugins emit a Powerpress shortcode → <a href="...mp3"> link.
    const link = Array.from(doc.querySelectorAll("a[href]")).find((a) =>
      /\.(mp3|m4a|wav)(\?|$)/i.test(a.getAttribute("href") || ""),
    );
    return link ? (link.getAttribute("href") || null) : null;
  }
  return audio.getAttribute("src");
}
