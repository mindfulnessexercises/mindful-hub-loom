// Buzzsprout shortcode → embed extractor.
//
// Old WordPress podcast episode posts wrap a Buzzsprout JS player in a
// Thrive Architect `[tcb-script]` shortcode. Source HTML looks like:
//
//   [tcb-script src=&#8221;https://www.buzzsprout.com/2555881/episodes/18714235-gratitude-beyond-words.js?container_id=buzzsprout-player-18714235&amp;player=small&#8221; …]
//
// — note the smart-quote entities (&#8221; / &#8220;) and `&amp;` in the URL.
// We can't (and shouldn't) inject the Buzzsprout JS into our React tree, so
// instead we extract the podcast + episode IDs and render the equivalent
// `?iframe=true` embed natively. This works without any third-party script.
//
// Both `[tcb-script]` wrapping and bare `<script src="…buzzsprout.com…">`
// variants are handled.

export interface BuzzsproutEmbed {
  podcastId: string;
  episodeId: string;
  /** Ready-to-use src for an <iframe>. */
  iframeSrc: string;
}

// Decode the most common HTML entities WordPress injects inside shortcode
// attributes. We only need the handful that show up in real source — full
// entity decoding would require DOM access we don't always have here.
function decodeEntities(s: string): string {
  return s
    .replace(/&#8220;|&#8221;|&#8243;|&quot;|&ldquo;|&rdquo;/g, '"')
    .replace(/&#8216;|&#8217;|&#8242;|&apos;|&lsquo;|&rsquo;/g, "'")
    .replace(/&amp;/g, "&");
}

/**
 * Find the first Buzzsprout episode embed inside arbitrary post HTML and
 * return the podcast + episode IDs. Returns null if none found or the URL
 * shape is unexpected.
 */
export function extractBuzzsproutEmbed(html: string): BuzzsproutEmbed | null {
  if (!html) return null;
  const decoded = decodeEntities(html);
  // Match either `https://www.buzzsprout.com/<podcastId>/episodes/<episodeId>-<slug>.js`
  // or `…/<podcastId>/<episodeId>-<slug>.js` (older format) — both have been
  // seen across the catalog.
  const re = /buzzsprout\.com\/(\d+)\/(?:episodes\/)?(\d+)(?:-[a-z0-9-]*)?\.js/i;
  const m = decoded.match(re);
  if (!m) return null;
  const podcastId = m[1];
  const episodeId = m[2];
  // Buzzsprout's official embed URL — works as an <iframe> src and renders
  // the same player UI without needing to load their JS into our document.
  const iframeSrc = `https://www.buzzsprout.com/${podcastId}/episodes/${episodeId}?client_source=small_player&iframe=true&player=small`;
  return { podcastId, episodeId, iframeSrc };
}
