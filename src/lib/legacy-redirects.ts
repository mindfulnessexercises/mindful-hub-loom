/**
 * Legacy WordPress → app redirect mapping.
 *
 * Background: the site was previously hosted on WordPress at
 * mindfulnessexercises.com with a permalink structure that doesn't always line
 * up with the new app's routes. To preserve link equity from existing inbound
 * links, social shares and search results, we map known legacy URL shapes onto
 * the equivalent app route — or, when no app equivalent exists, forward the
 * visitor to the canonical legacy URL on mindfulnessexercises.com so they at
 * least land on something useful.
 *
 * Important caveat: this runs in the browser, so search engines see HTTP 200
 * + a JS redirect rather than a true HTTP 301. Google increasingly treats
 * consistent JS redirects as soft-301s, but for SEO-grade redirects you'd
 * want to wire the same map into an edge function on the legacy domain/CDN.
 * The shape of `resolveLegacyRedirect` is intentionally pure + framework-free
 * so it can be lifted into a Supabase edge function later without changes.
 *
 * Resolution order (first match wins):
 *   1. Explicit per-path overrides in EXPLICIT_REDIRECTS
 *   2. Pattern-based rules in PATTERN_RULES (regex → builder)
 *   3. Fall through (return null) — the caller renders 404
 */

const LEGACY_ORIGIN = "https://mindfulnessexercises.com";

export interface LegacyRedirect {
  /** Absolute or app-relative URL to send the visitor to. */
  target: string;
  /** Whether the target is on the new app or off-site. */
  external: boolean;
  /** Short identifier for analytics/debugging — e.g. "dated_permalink". */
  rule: string;
}

/**
 * Hand-curated one-off redirects. Add entries here when you discover specific
 * legacy URLs that need a new home. Keys are leading-slash, no trailing slash.
 *
 * Example:
 *   "/old-about-us": { target: "/about", external: false, rule: "manual" }
 */
const EXPLICIT_REDIRECTS: Record<string, LegacyRedirect> = {
  // Add per-path overrides here as you discover them.
};

interface PatternRule {
  /** Identifier surfaced in the returned redirect for analytics. */
  rule: string;
  /** Regex applied to the normalized path (leading slash, no trailing slash, no query). */
  match: RegExp;
  /** Build the target URL from the regex match + the original full path (with query). */
  build: (m: RegExpMatchArray, fullPath: string) => LegacyRedirect | null;
}

const PATTERN_RULES: PatternRule[] = [
  // /YYYY/MM/slug (and /YYYY/MM/DD/slug) → /slug — WP's date-based permalinks.
  // The app's WPResolver handles the bare slug, so we strip the date prefix
  // and let the existing /:slug route do the work.
  {
    rule: "dated_permalink",
    match: /^\/(\d{4})\/(\d{2})(?:\/(\d{2}))?\/([^/]+)$/,
    build: (m) => ({
      target: `/${m[4]}`,
      external: false,
      rule: "dated_permalink",
    }),
  },

  // /tag/<slug> — no native app equivalent yet, forward to legacy WP.
  {
    rule: "tag_archive",
    match: /^\/tag\/([^/]+)$/,
    build: (_, fullPath) => ({
      target: `${LEGACY_ORIGIN}${fullPath}`,
      external: true,
      rule: "tag_archive",
    }),
  },

  // /author/<slug> — no native app equivalent, forward to legacy WP.
  {
    rule: "author_archive",
    match: /^\/author\/([^/]+)$/,
    build: (_, fullPath) => ({
      target: `${LEGACY_ORIGIN}${fullPath}`,
      external: true,
      rule: "author_archive",
    }),
  },

  // /page/<n> at the root — WP pagination on the homepage. Send to /blog.
  {
    rule: "root_pagination",
    match: /^\/page\/(\d+)$/,
    build: (m) => ({
      target: `/blog?page=${m[1]}`,
      external: false,
      rule: "root_pagination",
    }),
  },

  // /category/<slug>/page/<n> — paginated category archive. Map to the app's
  // category page with the page query param, since the app supports ?page=N.
  {
    rule: "category_pagination",
    match: /^\/category\/([^/]+)\/page\/(\d+)$/,
    build: (m) => ({
      target: `/category/${m[1]}?page=${m[2]}`,
      external: false,
      rule: "category_pagination",
    }),
  },

  // /?p=<id> style legacy short-links arrive without a recognizable slug.
  // Caller passes the full URL; if we see ?p= we forward to the legacy site
  // which knows how to resolve it to a permalink.
  {
    rule: "shortlink_p",
    match: /^\/$/,
    build: (_, fullPath) => {
      if (!/[?&]p=\d+/.test(fullPath)) return null;
      return {
        target: `${LEGACY_ORIGIN}${fullPath}`,
        external: true,
        rule: "shortlink_p",
      };
    },
  },
];

/**
 * Normalize a pathname to a stable lookup form: leading slash, no trailing
 * slash (except root), lowercased path segments preserved as-is otherwise.
 */
function normalizePath(pathname: string): string {
  let p = pathname || "/";
  if (p.length > 1 && p.endsWith("/")) p = p.slice(0, -1);
  if (!p.startsWith("/")) p = `/${p}`;
  return p;
}

/**
 * Resolve a legacy WordPress-style URL to a redirect target, if any.
 *
 * @param pathname e.g. "/2023/05/some-post"
 * @param search   e.g. "?utm_source=newsletter" — preserved on external targets
 * @returns redirect descriptor, or null if no rule matched
 */
export function resolveLegacyRedirect(
  pathname: string,
  search = "",
): LegacyRedirect | null {
  const normalized = normalizePath(pathname);
  const fullPath = `${normalized}${search}`;

  // 1. Explicit overrides win.
  const explicit = EXPLICIT_REDIRECTS[normalized];
  if (explicit) return explicit;

  // 2. Pattern rules in declaration order.
  for (const rule of PATTERN_RULES) {
    const m = normalized.match(rule.match);
    if (!m) continue;
    const out = rule.build(m, fullPath);
    if (out) return out;
  }

  return null;
}
