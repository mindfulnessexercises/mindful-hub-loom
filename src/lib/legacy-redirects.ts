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
  // Note: /podcast and /downloads are handled by dedicated routes that mount
  // the Category page directly (see src/App.tsx). We intentionally do NOT
  // redirect them to /category/<slug> because we want the app's URLs to match
  // the legacy WordPress URLs for those section landings.

  // The WordPress page lives at /about-us; map the shorter /about to it.
  "/about": { target: "/about-us", external: false, rule: "about_alias" },

  // ---- WP "category as top-level slug" → /category/<slug> --------------
  // The legacy WP site exposed each category at the bare slug (e.g.
  // /anxiety, /buddhist, /sleep) which collides with WPResolver's
  // /:slug post lookup and also with several app-owned routes. The full
  // mapping was generated from the WXR export — see
  // /mnt/documents/wxr-audit/redirects.csv. We intentionally OMIT the
  // entries whose bare slug is shadowed by a native app page (/blog,
  // /affirmations, /quotes, /meditation-scripts, /videos vs /video) —
  // those visitors already land on the better in-app hub.
  "/anxiety": { target: "/category/anxiety", external: false, rule: "wp_category_bare_slug" },
  "/mindfulness-worksheets": { target: "/category/mindfulness-worksheets", external: false, rule: "wp_category_bare_slug" },
  "/mindful-leadership-at-work": { target: "/category/mindful-leadership-at-work", external: false, rule: "wp_category_bare_slug" },
  "/buddhist": { target: "/category/buddhist", external: false, rule: "wp_category_bare_slug" },
  "/free-mindfulness-ebooks": { target: "/category/free-mindfulness-ebooks", external: false, rule: "wp_category_bare_slug" },
  "/happiness": { target: "/category/happiness", external: false, rule: "wp_category_bare_slug" },
  "/depression": { target: "/category/depression", external: false, rule: "wp_category_bare_slug" },
  "/video": { target: "/category/video", external: false, rule: "wp_category_bare_slug" },
  "/confidence": { target: "/category/confidence", external: false, rule: "wp_category_bare_slug" },
  "/focus": { target: "/category/focus", external: false, rule: "wp_category_bare_slug" },
  "/love": { target: "/category/love", external: false, rule: "wp_category_bare_slug" },
  "/relationships-family": { target: "/category/relationships-family", external: false, rule: "wp_category_bare_slug" },
  "/mindfulness-stress-reduction": { target: "/category/mindfulness-stress-reduction", external: false, rule: "wp_category_bare_slug" },
  "/pain": { target: "/category/pain", external: false, rule: "wp_category_bare_slug" },
  "/beginners": { target: "/category/beginners", external: false, rule: "wp_category_bare_slug" },
  "/calm": { target: "/category/calm", external: false, rule: "wp_category_bare_slug" },
  "/relaxation": { target: "/category/relaxation", external: false, rule: "wp_category_bare_slug" },
  "/integration": { target: "/category/integration", external: false, rule: "wp_category_bare_slug" },
  "/free-mindfulness-talks": { target: "/category/free-mindfulness-talks", external: false, rule: "wp_category_bare_slug" },
  "/forgiveness": { target: "/category/forgiveness", external: false, rule: "wp_category_bare_slug" },
  "/sleep": { target: "/category/sleep", external: false, rule: "wp_category_bare_slug" },
  "/motivation": { target: "/category/motivation", external: false, rule: "wp_category_bare_slug" },
  "/gratitude": { target: "/category/gratitude", external: false, rule: "wp_category_bare_slug" },
  "/contentment": { target: "/category/contentment", external: false, rule: "wp_category_bare_slug" },
  "/guided-meditations": { target: "/category/guided-meditations", external: false, rule: "wp_category_bare_slug" },
  "/compassion": { target: "/category/compassion", external: false, rule: "wp_category_bare_slug" },
  "/addiction": { target: "/category/addiction", external: false, rule: "wp_category_bare_slug" },
  "/research": { target: "/category/research", external: false, rule: "wp_category_bare_slug" },
  "/connection": { target: "/category/connection", external: false, rule: "wp_category_bare_slug" },
  "/leadership": { target: "/category/leadership", external: false, rule: "wp_category_bare_slug" },
  "/connection-guided-meditations": { target: "/category/connection-guided-meditations", external: false, rule: "wp_category_bare_slug" },
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

  // ---------------------------------------------------------------------
  // Legacy boundary: features that live on the WordPress origin only.
  // These represent ~17% of incoming traffic (auth, account, community)
  // plus ~6.5% of WP-internal asset requests. Forwarding to the legacy
  // origin keeps users out of 404s until a native React version ships.
  // ---------------------------------------------------------------------

  // Auth pages — /login, /register, /signup, /logout, /password-reset, etc.
  {
    rule: "auth_legacy",
    match: /^\/(login|logout|register|signup|sign-in|sign-up|password-reset|forgot-password|reset-password|account-recovery)(?:\/.*)?$/,
    build: (_, fullPath) => ({
      target: `${LEGACY_ORIGIN}${fullPath}`,
      external: true,
      rule: "auth_legacy",
    }),
  },

  // Member dashboard / account / billing — anything under these prefixes.
  {
    rule: "member_area_legacy",
    match: /^\/(dashboard|account|my-account|members?|profile|billing|orders|subscriptions|memberships?)(?:\/.*)?$/,
    build: (_, fullPath) => ({
      target: `${LEGACY_ORIGIN}${fullPath}`,
      external: true,
      rule: "member_area_legacy",
    }),
  },

  // Circle community — /c/<space>, /community/*.
  {
    rule: "community_legacy",
    match: /^\/(c|community|forums?|groups?)(?:\/.*)?$/,
    build: (_, fullPath) => ({
      target: `${LEGACY_ORIGIN}${fullPath}`,
      external: true,
      rule: "community_legacy",
    }),
  },

  // Course/LMS gated areas — keep on WP for now (LearnDash/Memberpress style URLs).
  {
    rule: "lms_gated_legacy",
    match: /^\/(quizzes|assignments|certificates|course-progress|profile-builder)(?:\/.*)?$/,
    build: (_, fullPath) => ({
      target: `${LEGACY_ORIGIN}${fullPath}`,
      external: true,
      rule: "lms_gated_legacy",
    }),
  },

  // Circle user profiles — /u/<username>. Not built natively yet.
  {
    rule: "user_profile_legacy",
    match: /^\/u\/([^/]+)(?:\/.*)?$/,
    build: (_, fullPath) => ({
      target: `${LEGACY_ORIGIN}${fullPath}`,
      external: true,
      rule: "user_profile_legacy",
    }),
  },

  // Teacher / author directory pages — /authors, /teachers/<slug>, etc.
  // NOTE: /mindfulness-teacher/<slug> is intentionally EXCLUDED from this
  // rule. Those are individual WP CPT pages (e.g. /mindfulness-teacher/
  // sean-fargo, /mindfulness-teacher/joseph-goldstein) that rank in our
  // top-100 and resolve in-app via WPResolver — sending them off-site
  // would forfeit their SEO equity.
  {
    rule: "teacher_directory_legacy",
    match: /^\/(authors|mindfulness-teachers|teachers?|instructors?)(?:\/.*)?$/,
    build: (_, fullPath) => ({
      target: `${LEGACY_ORIGIN}${fullPath}`,
      external: true,
      rule: "teacher_directory_legacy",
    }),
  },

  // WP geo-directory plugin pages — /<country>/<city> patterns generated by
  // the legacy directory plugin. Forward to WP which still hosts them.
  {
    rule: "geo_directory_legacy",
    match: /^\/(location|locations|directory|find-a-teacher|mindfulness-near-me)(?:\/.*)?$/,
    build: (_, fullPath) => ({
      target: `${LEGACY_ORIGIN}${fullPath}`,
      external: true,
      rule: "geo_directory_legacy",
    }),
  },

  // WordPress internals: /wp-content, /wp-admin, /wp-login.php, /wp-json, /feed,
  // /xmlrpc.php, /comments/feed, etc. These should never be served by the React
  // app. Forward to the WP origin so plugin assets and feeds keep working.
  {
    rule: "wp_internals",
    match: /^\/(wp-content|wp-admin|wp-includes|wp-json|wp-login\.php|wp-cron\.php|xmlrpc\.php|feed|comments|trackback|rss|rss2|atom)(?:\/.*)?$/,
    build: (_, fullPath) => ({
      target: `${LEGACY_ORIGIN}${fullPath}`,
      external: true,
      rule: "wp_internals",
    }),
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
