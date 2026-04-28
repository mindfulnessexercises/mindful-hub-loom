// Podcast player detection.
//
// Two complementary scanners:
//
//  1. detectPlayerInHtml(html): static scan over an HTML string. Catches any
//     known player URL — including iframes injected by Thrive Architect
//     templates (e.g. `playlist.megaphone.fm`) that `extractBuzzsproutEmbed`
//     was deliberately scoped to ignore.
//
//  2. detectPlayerInDom(root): runtime scan over a live DOM subtree. Used
//     after the article HTML has been rendered (and any template-injected
//     iframes have hydrated) so we can audit actual on-page coverage rather
//     than only what is present in the raw WordPress REST content field.
//
// Both scanners share the same provider list so results stay consistent.

export type PodcastPlayerProvider =
  | "buzzsprout"
  | "megaphone"
  | "spotify_embed"
  | "apple_embed"
  | "soundcloud"
  | "libsyn"
  | "simplecast"
  | "podbean"
  | "art19"
  | "omny"
  | "anchor"
  | "blubrry"
  | "html5_audio";

export interface DetectedPlayer {
  provider: PodcastPlayerProvider;
  /** Where it was found — useful for analytics & debugging. */
  source: "iframe" | "audio" | "script" | "shortcode";
  /** Best-effort URL/identifier we matched on. */
  url?: string;
}

interface ProviderRule {
  provider: PodcastPlayerProvider;
  /** Matches a fully-decoded URL string (iframe src, script src, anchor, …). */
  pattern: RegExp;
}

// Order matters loosely — more specific providers first so we attribute
// `playlist.megaphone.fm` to Megaphone before any generic catch-all.
const URL_RULES: ProviderRule[] = [
  { provider: "megaphone",     pattern: /(?:playlist\.|player\.)?megaphone\.fm/i },
  { provider: "buzzsprout",    pattern: /(?:www\.)?buzzsprout\.com/i },
  { provider: "spotify_embed", pattern: /open\.spotify\.com\/embed\//i },
  { provider: "apple_embed",   pattern: /embed\.podcasts\.apple\.com/i },
  { provider: "soundcloud",    pattern: /(?:w\.|api\.)?soundcloud\.com\/(?:player|tracks)/i },
  { provider: "libsyn",        pattern: /(?:html5-player\.)?libsyn\.com/i },
  { provider: "simplecast",    pattern: /player\.simplecast\.com/i },
  { provider: "podbean",       pattern: /(?:www\.)?podbean\.com\/(?:player|media\/player)/i },
  { provider: "art19",         pattern: /art19\.com\/shows\/[^"']+\/episodes\/[^"']+\/embed/i },
  { provider: "omny",          pattern: /omny\.fm\/shows\/[^"']+\/embed/i },
  { provider: "anchor",        pattern: /anchor\.fm\/[^"']+\/embed/i },
  { provider: "blubrry",       pattern: /blubrry\.com\/[^"']+\/(?:player|embed)/i },
];

function decodeEntities(s: string): string {
  return s
    .replace(/&#8220;|&#8221;|&#8243;|&quot;|&ldquo;|&rdquo;/g, '"')
    .replace(/&#8216;|&#8217;|&#8242;|&apos;|&lsquo;|&rsquo;/g, "'")
    .replace(/&amp;/g, "&");
}

function classifyUrl(url: string, source: DetectedPlayer["source"]): DetectedPlayer | null {
  for (const { provider, pattern } of URL_RULES) {
    if (pattern.test(url)) return { provider, source, url };
  }
  return null;
}

/**
 * Static HTML scan. Walks <iframe>, <audio>, <source>, <script src>, and the
 * `[tcb-script]` Thrive shortcode body. Returns every distinct provider hit
 * (de-duplicated by `provider`).
 */
export function detectPlayerInHtml(html: string | null | undefined): DetectedPlayer[] {
  if (!html) return [];
  const decoded = decodeEntities(html);
  const found = new Map<PodcastPlayerProvider, DetectedPlayer>();

  const consider = (hit: DetectedPlayer | null) => {
    if (hit && !found.has(hit.provider)) found.set(hit.provider, hit);
  };

  // iframe src
  for (const m of decoded.matchAll(/<iframe\b[^>]*\bsrc=["']([^"']+)["']/gi)) {
    consider(classifyUrl(m[1], "iframe"));
  }

  // <audio src> and <source src>
  if (/<audio\b[^>]*\bsrc=/i.test(decoded) || /<source\b[^>]*\.mp3/i.test(decoded)) {
    consider({ provider: "html5_audio", source: "audio" });
  }

  // <script src> (Buzzsprout small player JS, simplecast embed JS, etc.)
  for (const m of decoded.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["']/gi)) {
    consider(classifyUrl(m[1], "script"));
  }

  // Thrive `[tcb-script src="…"]` shortcodes — same URL classifier
  for (const m of decoded.matchAll(/\[tcb-script[^\]]*\bsrc=["']([^"']+)["']/gi)) {
    consider(classifyUrl(m[1], "shortcode"));
  }

  return [...found.values()];
}

/**
 * Live DOM scan. Inspects an element subtree (e.g. the rendered article body)
 * and returns providers actually present in the rendered output. This catches
 * template-injected iframes (Thrive Architect / Megaphone) that never appear
 * in the WordPress REST `content.rendered` field.
 */
export function detectPlayerInDom(root: Element | Document | null | undefined): DetectedPlayer[] {
  if (!root) return [];
  const found = new Map<PodcastPlayerProvider, DetectedPlayer>();
  const consider = (hit: DetectedPlayer | null) => {
    if (hit && !found.has(hit.provider)) found.set(hit.provider, hit);
  };

  root.querySelectorAll("iframe[src]").forEach((el) => {
    consider(classifyUrl((el as HTMLIFrameElement).src, "iframe"));
  });
  root.querySelectorAll("audio[src], audio source[src]").forEach(() => {
    consider({ provider: "html5_audio", source: "audio" });
  });
  root.querySelectorAll("script[src]").forEach((el) => {
    consider(classifyUrl((el as HTMLScriptElement).src, "script"));
  });

  return [...found.values()];
}
