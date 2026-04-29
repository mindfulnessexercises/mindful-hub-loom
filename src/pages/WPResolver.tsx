import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useRef } from "react";
import { ArrowRight, Calendar, Clock, Headphones } from "lucide-react";
import { Navbar } from "@/components/homepage/Navbar";
import { Footer } from "@/components/homepage/Footer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  wp,
  getFeaturedImage,
  getCategories,
  getAuthor,
  stripHtml,
  URL_PARENT_TO_CPT_ENDPOINT,
  CPT_URL_PARENT,
} from "@/lib/wp";
import { wpKeys, WP_STALE } from "@/lib/wp-cache";
import { WPSeo } from "@/components/wp/WPSeo";
import NotFound from "./NotFound";
import { Badge } from "@/components/ui/badge";
import { rewriteWpHtml, attachWpLinkInterceptor } from "@/lib/rewrite-wp-html";
import { isReservedSlug } from "@/lib/reserved-slugs";
import {
  estimateReadingMinutes,
  extractToc,
  extractFirstAudioUrl,
} from "@/lib/reading";
import { ReadingProgress } from "@/components/wp/ReadingProgress";
import { WPBreadcrumbs } from "@/components/wp/WPBreadcrumbs";
import { TableOfContents } from "@/components/wp/TableOfContents";
import { ShareBar } from "@/components/wp/ShareBar";
import { AuthorCard } from "@/components/wp/AuthorCard";
import { RelatedPosts } from "@/components/wp/RelatedPosts";
import { RecommendedNext } from "@/components/wp/RecommendedNext";
import { PodcastPlayer } from "@/components/wp/PodcastPlayer";
import { BuzzsproutEmbedPlayer } from "@/components/wp/BuzzsproutEmbed";
import { extractBuzzsproutEmbed } from "@/lib/buzzsprout";
import { lookupBuzzsproutBySlug } from "@/lib/buzzsprout-lookup";
import { BuzzsproutEpisodeFallback } from "@/components/wp/BuzzsproutEpisodeFallback";
import { BuzzsproutEpisodeSections } from "@/components/wp/BuzzsproutEpisodeSections";
import {
  detectPlayerInDom,
  detectPlayerInHtml,
  type DetectedPlayer,
} from "@/lib/podcast-player-detect";
import { trackEvent } from "@/lib/analytics";
import { MeditationPlayer } from "@/components/wp/MeditationPlayer";
import { MeditationScript } from "@/components/wp/MeditationScript";
import { WorksheetMindfulGuidance } from "@/components/wp/WorksheetMindfulGuidance";
import { getMeditationScript } from "@/lib/meditation-scripts";
import { getWorksheets } from "@/lib/worksheets";
import { injectInlineAudio } from "@/lib/inline-audio-sections";
import { getInlineVideos } from "@/lib/inline-video-posts";
import { LiteVideoEmbed } from "@/components/video/LiteVideoEmbed";
import { getPlaylist } from "@/lib/audio-playlists";
import { AudioPlaylistBlock } from "@/components/wp/AudioPlaylistBlock";
import { useMeditation } from "@/hooks/use-meditation";
import {
  getTemplateConfig,
  HERO_DENSITY_CLASS,
} from "@/lib/wp-template-config";

/**
 * Removes ALL third-party Elfsight embeds from rendered WP HTML — runs on
 * every post/page, not only those with a native meditation player ready,
 * because we never want the legacy Elfsight player to surface on the new
 * site (it pulls a third-party script, breaks our design system, and on
 * pages with a native player would render alongside it).
 *
 * Catches the variants we've seen in WP source:
 *   - <script src="…elfsightcdn.com…"></script>
 *   - <script src="…elfsight.com/platform/platform.js"></script>
 *   - [tcb-script src="…elfsight.com…"][/tcb-script] (Thrive Architect wrap)
 *     — including HTML-entity-escaped quotes (&#8221;, &quot;) from WP
 *   - <div class="elfsight-app-…"></div> placeholder Elfsight hydrates into
 */
function stripElfsightEmbeds(html: string): string {
  if (!html) return html;
  return html
    .replace(/<script[^>]*elfsight(?:cdn)?\.com[^>]*>\s*<\/script>/gi, "")
    .replace(/\[tcb-script[^\]]*elfsight[^\]]*\][\s\S]*?\[\/tcb-script\]/gi, "")
    .replace(/<div[^>]*class=["'][^"']*elfsight-app-[^"']*["'][^>]*>\s*<\/div>/gi, "");
}

/**
 * Aggressively cleans up legacy Thrive Architect / lead-capture cruft that
 * appears on every /downloads/* meditation page in the WP source. The old
 * pages were built by hand in Thrive and left orphan media behind once the
 * Elfsight player + email-capture form were stripped:
 *
 *   - [tcb-script …][/tcb-script] shortcodes and bare [tcb_*] tags
 *   - "Download this Audio Meditation for Free…" lead-capture line
 *   - Lonely headphone download icon (orphan once form is gone)
 *   - Creative Commons license badges (replaced by a clean footer strip)
 *   - Hint paragraphs ("Would you like to download…", "*Note:*", etc.)
 *   - Empty <p>, <div>, <figure> shells left after image/script removal
 *
 * Runs only on /downloads/* pages so blog posts keep all their formatting.
 */
function stripDownloadsLegacy(html: string): string {
  if (!html) return html;
  let out = html;

  // Thrive shortcodes — including those with HTML-entity-escaped quotes
  out = out.replace(/\[tcb-script[\s\S]*?\[\/tcb-script\]/gi, "");
  out = out.replace(/\[\/?tcb[_-][^\]]*\]/gi, "");

  // Lead-capture line. The actual WP markup is:
  //   <p>...<strong>Download this Audio Meditation for Free,&nbsp;</strong>
  //         <strong></strong>Just Enter Your First Name and Email Address:</p>
  // So we need to match the WHOLE <p> that contains this phrase anywhere
  // inside, not just at the start. Use a non-greedy lookahead approach.
  out = out.replace(
    /<p\b[^>]*>(?:(?!<\/p>)[\s\S])*?Download this Audio Meditation for Free(?:(?!<\/p>)[\s\S])*?<\/p>/gi,
    "",
  );

  // Orphan audio/headphone download icon. The actual filenames seen are
  // `audio-download-icon`, `headphone*`, etc. Strip the <img> AND any
  // wrapping <span> with no other meaningful content.
  out = out.replace(
    /<img[^>]*(?:audio-download-icon|headphone|download-icon|download_icon|headphones)[^>]*>/gi,
    "",
  );

  // The "mindfulness exercises attribution" badge that WP appends to every
  // /downloads/* page (a brand stamp, not real content). Same treatment.
  out = out.replace(
    /<img[^>]*mindfulness-exercises-attribution[^>]*>/gi,
    "",
  );

  // Creative Commons badges (linked or bare <img>).
  out = out.replace(/<a[^>]*creativecommons\.org[^>]*>[\s\S]*?<\/a>/gi, "");
  out = out.replace(
    /<img[^>]*(?:creativecommons|cc[\-_]by|by-nc-nd|cc-license)[^>]*>/gi,
    "",
  );

  // Speaker portrait that duplicates the MeditationPlayer portrait. WP often
  // appends a 400x400 headshot at the bottom of every page. Detect by:
  //   - <img> from /wp-content/uploads/ dir
  //   - explicit width/height of 400 (and they're square)
  // This is intentionally conservative — we don't strip ALL inline images.
  out = out.replace(
    /<img[^>]*\bwidth=["']400["'][^>]*\bheight=["']400["'][^>]*>/gi,
    "",
  );

  // Hint/instructional paragraphs from the old UX.
  out = out.replace(
    /<p[^>]*>\s*(?:Would you like to download|To download[^<]*right.click|\*?Note:\*?)[\s\S]*?<\/p>/gi,
    "",
  );

  // Strip empty wrappers (and wrappers whose only remaining child is empty
  // <span>s/<strong>s left behind by partial removals). Run a few passes
  // because removals can cascade.
  for (let i = 0; i < 4; i++) {
    // Wrappers with only whitespace / nbsp
    out = out.replace(
      /<(p|div|figure|figcaption|span)\b[^>]*>\s*(?:&nbsp;|\s)*<\/\1>/gi,
      "",
    );
    // Wrappers whose entire content is empty inline tags (span/strong/em/b/i)
    out = out.replace(
      /<(p|div)\b[^>]*>\s*(?:<(?:span|strong|em|b|i)\b[^>]*>\s*(?:&nbsp;|\s)*<\/(?:span|strong|em|b|i)>\s*)+<\/\1>/gi,
      "",
    );
  }

  return out;
}

/**
 * Removes the legacy lead-capture line that appears on every guided meditation
 * script post:
 *   Download "Title" by entering your name and email below:DOWNLOAD NOW
 * The phrase often appears twice in a row (the second styled as a faded
 * placeholder, sometimes with curly quotes ", ", or ", "). We strip any
 * <p>/<div>/<h*> that contains the signature phrase, plus any standalone
 * "DOWNLOAD NOW" link/button leftovers.
 */
function stripScriptLeadCapture(html: string): string {
  if (!html) return html;
  let out = html;

  // Match any block-level wrapper containing the signature lead-capture phrase.
  // The phrase: "by entering your name and email below" is unique enough to
  // safely target. Quotes around the title vary (straight, curly, smart).
  const phrase = /by\s+entering\s+your\s+name\s+and\s+email\s+below/i;
  out = out.replace(
    /<(p|div|h[1-6])\b[^>]*>(?:(?!<\/\1>)[\s\S])*?by\s+entering\s+your\s+name\s+and\s+email\s+below(?:(?!<\/\1>)[\s\S])*?<\/\1>/gi,
    "",
  );

  // Standalone "DOWNLOAD NOW" buttons/links left behind (anchor or button).
  out = out.replace(
    /<a\b[^>]*>\s*DOWNLOAD\s+NOW\s*<\/a>/gi,
    "",
  );
  out = out.replace(
    /<button\b[^>]*>\s*DOWNLOAD\s+NOW\s*<\/button>/gi,
    "",
  );

  // Bare "DOWNLOAD NOW" text inside a wrapper (e.g. <p>DOWNLOAD NOW</p>).
  out = out.replace(
    /<(p|div|span|strong)\b[^>]*>\s*DOWNLOAD\s+NOW\s*<\/\1>/gi,
    "",
  );

  // ── Ebook posts (e.g. /on-meditation) ────────────────────────────────
  // Legacy Thrive opt-in had two lingering remnants on every ebook post:
  //   1) "Enter your name and email address to download this ebook." — the
  //      stripped form's instruction, now meaningless on the new site.
  //   2) The orphan "Download Scripts" icon <img> wrapped in a <span> that
  //      sat directly above the form. After (1) is gone the icon floats
  //      alone above the PDF viewer.
  // Both are matched defensively (with optional <strong>, &nbsp;, smart
  // punctuation) to survive Gutenberg/Classic editor variations.
  out = out.replace(
    /<p\b[^>]*>(?:\s|&nbsp;|<\/?(?:strong|em|span|br)\b[^>]*>)*\s*Enter\s+your\s+name\s+and\s+email\s+address\s+to\s+download\s+this\s+ebook\.?(?:\s|&nbsp;|<\/?(?:strong|em|span|br)\b[^>]*>)*<\/p>/gi,
    "",
  );
  out = out.replace(
    /<p\b[^>]*>\s*<span\b[^>]*>\s*<img\b[^>]*Download[-_ ]Scripts[^>]*>\s*<\/span>\s*<\/p>/gi,
    "",
  );

  // Suppress unused-var warning while keeping the intent documented above.
  void phrase;

  return out;
}

const CERTIFY_URL = "https://certify.mindfulnessexercises.com/";


export default function WPResolver() {
  const params = useParams();
  const location = useLocation();
  // Use the actual pathname so we can see the parent segment for nested
  // routes mounted with a splat (e.g. <Route path="/podcast-episodes/*">),
  // where params["*"] only captures the part AFTER the parent and would lose
  // the URL parent we need to map to a CPT endpoint.
  const allSegments = location.pathname.replace(/\/+$/, "").split("/").filter(Boolean);
  const slug = allSegments[allSegments.length - 1] ?? params.slug ?? "";
  const parent = allSegments.length > 1 ? allSegments[allSegments.length - 2] : "";
  const cptEndpoint = URL_PARENT_TO_CPT_ENDPOINT[parent];
  const isPodcastEpisode = parent === "podcast-episodes";
  const navigate = useNavigate();
  const articleRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  // Resolution order: CPT (if URL parent maps to one) → post → page.
  const query = useQuery({
    queryKey: [...wpKeys.resolveSlug(slug), cptEndpoint ?? ""],
    queryFn: async () => {
      if (cptEndpoint) {
        const cpt = await wp.cptBySlug(cptEndpoint, slug);
        if (cpt) return { kind: "post" as const, data: cpt };
      }
      const post = await wp.postBySlug(slug);
      if (post) return { kind: "post" as const, data: post };
      const page = await wp.pageBySlug(slug);
      if (page) return { kind: "page" as const, data: page };
      return null;
    },
    staleTime: WP_STALE.detail,
    gcTime: WP_STALE.gc,
    enabled: !!slug && !isReservedSlug(slug),
    retry: false,
  });

  // Hooks MUST run on every render — keep above any early returns. Falls back
  // to empty string when content isn't loaded yet; the rendered <div> for
  // body content is gated by query.data below so this never paints.
  const rawContent = query.data?.data.content.rendered ?? "";
  // Two-pass HTML transform: rewrite WP-internal links, then inject TOC ids.
  // Also strips legacy Elfsight audio embeds when we have a native meditation
  // player ready to render in their place.
  const meditationQuery = useMeditation(slug);
  const meditation = meditationQuery.data;

  const isDownloadsPage = parent === "downloads";

  const { rewrittenHtml, toc } = useMemo(() => {
    let cleaned = rawContent;
    // Strip Elfsight embeds on EVERY page — never want the third-party
    // player to render on the new site, regardless of meditation row.
    cleaned = stripElfsightEmbeds(cleaned);
    if (isDownloadsPage) cleaned = stripDownloadsLegacy(cleaned);
    // Runs on every post — old script-style posts have a recurring lead
    // capture line we always want to remove.
    cleaned = stripScriptLeadCapture(cleaned);
    const linked = rewriteWpHtml(cleaned);
    // Inject inline native <audio> players beneath section headings on
    // posts configured in the inline-audio registry (e.g. teen affirmations).
    const withAudio = injectInlineAudio(linked, slug);
    const { html, items } = extractToc(withAudio);
    return { rewrittenHtml: html, toc: items };
  }, [rawContent, meditation, isDownloadsPage, slug]);

  const audioSrc = useMemo(() => extractFirstAudioUrl(rawContent), [rawContent]);
  // Old podcast-episode posts wrap a Buzzsprout JS player in a Thrive
  // `[tcb-script]` shortcode. We surface it via a native iframe (see
  // BuzzsproutEmbedPlayer) since the shortcode itself can't render here.
  const inlineBuzzsproutEmbed = useMemo(() => extractBuzzsproutEmbed(rawContent), [rawContent]);
  // Fallback for podcast-episode pages whose WP `content.rendered` is missing
  // the Buzzsprout shortcode (Thrive Architect templates inject the player at
  // render time on the legacy site). We look up the episode in the cached
  // `buzzsprout_episodes` table by slug — populated by the buzzsprout-sync
  // edge function — and synthesize the same iframe embed.
  // Always look up the cached Buzzsprout record for podcast-episode slugs.
  // We use it BOTH as a fallback player when WP content lacks the embed AND
  // as a full fallback page when no WP post exists yet (newly-published
  // episodes from the buzzsprout-sync cron).
  const buzzsproutLookupQuery = useQuery({
    queryKey: ["buzzsprout-by-slug", slug],
    queryFn: () => lookupBuzzsproutBySlug(slug ?? ""),
    enabled: isPodcastEpisode && !!slug,
    staleTime: 1000 * 60 * 60,
  });
  const buzzsproutRecord = buzzsproutLookupQuery.data ?? null;
  const buzzsproutEmbed = inlineBuzzsproutEmbed ?? buzzsproutRecord?.embed ?? null;
  // Static scan of the raw WP HTML — catches every player reference present
  // in `content.rendered` (Buzzsprout shortcodes, inline iframes, …).
  const staticPlayers = useMemo<DetectedPlayer[]>(
    () => detectPlayerInHtml(rawContent),
    [rawContent],
  );
  const readingMinutes = useMemo(() => estimateReadingMinutes(rawContent), [rawContent]);

  useEffect(
    () => attachWpLinkInterceptor(contentRef.current, navigate),
    [rewrittenHtml, navigate],
  );

  // Runtime DOM scan for podcast episodes. Thrive Architect templates inject
  // Megaphone iframes (and similar) at render time — they are NOT in the WP
  // REST `content.rendered` field, so the static scan misses them. Combine
  // both so analytics reflects what visitors actually see on the page.
  useEffect(() => {
    if (!isPodcastEpisode || !slug) return;
    if (query.isLoading || query.isError || !query.data) return;
    // Defer one frame so any template-injected iframes have a chance to mount.
    const raf = requestAnimationFrame(() => {
      const domPlayers = detectPlayerInDom(contentRef.current);
      const merged = new Map<string, DetectedPlayer>();
      [...staticPlayers, ...domPlayers].forEach((p) => {
        if (!merged.has(p.provider)) merged.set(p.provider, p);
      });
      const all = [...merged.values()];
      trackEvent("podcast_player_detected", {
        slug,
        post_id: query.data.data.id,
        has_player: all.length > 0,
        provider_count: all.length,
        providers: all.map((p) => p.provider).join(",") || "none",
        sources: all.map((p) => `${p.provider}:${p.source}`).join("|"),
        static_only: staticPlayers
          .map((p) => p.provider)
          .filter((p) => !domPlayers.find((d) => d.provider === p))
          .join(",") || "none",
        dom_only: domPlayers
          .map((p) => p.provider)
          .filter((p) => !staticPlayers.find((s) => s.provider === p))
          .join(",") || "none",
      });
    });
    return () => cancelAnimationFrame(raf);
  }, [isPodcastEpisode, slug, rewrittenHtml, staticPlayers, query.isLoading, query.isError, query.data]);

  if (isReservedSlug(slug)) return <NotFound />;

  if (query.isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto max-w-3xl py-12 lg:py-20 space-y-6">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="aspect-[16/9] w-full rounded-lg" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </main>
        <Footer />
      </div>
    );
  }

  if (query.isError || !query.data) {
    // No WP post for this slug — but if it's a podcast episode and we have a
    // cached Buzzsprout record, render the auto-generated episode page.
    if (isPodcastEpisode && buzzsproutRecord) {
      return <BuzzsproutEpisodeFallback record={buzzsproutRecord} />;
    }
    // Wait for the Buzzsprout lookup to settle before declaring 404 so we
    // don't flash a NotFound on the first frame.
    if (isPodcastEpisode && buzzsproutLookupQuery.isLoading) {
      return (
        <div className="min-h-screen bg-background">
          <Navbar />
          <main className="mx-auto max-w-3xl px-4 py-12 space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </main>
          <Footer />
        </div>
      );
    }
    return <NotFound />;
  }

  const { kind, data: doc } = query.data;
  const img = getFeaturedImage(doc);
  const description =
    doc.yoast_head_json?.description || stripHtml(doc.excerpt.rendered).slice(0, 160);
  const title = stripHtml(doc.title.rendered);
  const cats = kind === "post" ? getCategories(doc) : [];
  const primaryCategory = cats[0];
  const author = kind === "post" ? getAuthor(doc) : null;
  const templateKind: "page" | "post" | "podcast" | "download" =
    kind === "page"
      ? "page"
      : isPodcastEpisode
        ? "podcast"
        : isDownloadsPage
          ? "download"
          : "post";
  const tpl = getTemplateConfig(doc.slug, templateKind);
  const attachedWorksheets = getWorksheets(doc.slug);
  const hasWorksheets = attachedWorksheets.length > 0;
  // Posts in the legacy "eBooks" category (id 159, slug `free-mindfulness-ebooks`)
  // are PDF-viewer pages whose WP "featured image" is a broken placeholder
  // shutter graphic from the old Thrive opt-in template. Detect them so we
  // can suppress that image and render a small intro card instead.
  const EBOOK_CATEGORY_ID = 159;
  const isEbookPost = kind === "post" && cats.some((c) => c.id === EBOOK_CATEGORY_ID);
  const canonicalSlugPath = cptEndpoint
    ? `/${CPT_URL_PARENT[cptEndpoint]}/${doc.slug}`
    : `/${doc.slug}`;
  const canonicalUrl = `https://mindfulnessexercises.com${canonicalSlugPath}`;
  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}${canonicalSlugPath}`
      : canonicalUrl;

  const breadcrumbItems = [
    ...(kind === "post"
      ? isPodcastEpisode
        ? [{ label: "Podcast", href: "/podcast" }]
        : [{ label: "Blog", href: "/blog" }]
      : []),
    ...(primaryCategory && !isPodcastEpisode
      ? [{ label: stripHtml(primaryCategory.name), href: `/category/${primaryCategory.slug}` }]
      : []),
    { label: title },
  ];

  const jsonLd =
    kind === "post"
      ? {
          "@context": "https://schema.org",
          "@type": isPodcastEpisode ? "PodcastEpisode" : "Article",
          headline: title,
          description,
          image: img?.url ? [img.url] : undefined,
          datePublished: doc.date,
          dateModified: doc.modified,
          author: author
            ? { "@type": "Person", name: author.name }
            : { "@type": "Organization", name: "Mindfulness Exercises" },
          publisher: {
            "@type": "Organization",
            name: "Mindfulness Exercises",
            url: "https://mindfulnessexercises.com",
          },
          mainEntityOfPage: canonicalUrl,
          ...(audioSrc
            ? {
                associatedMedia: { "@type": "MediaObject", contentUrl: audioSrc },
              }
            : {}),
        }
      : undefined;

  return (
    <div className="min-h-screen bg-background">
      <WPSeo
        title={`${title} — Mindfulness Exercises`}
        description={description}
        canonical={canonicalUrl}
        ogImage={img?.url}
        type={kind === "post" ? "article" : "website"}
        jsonLd={jsonLd}
      />
      <ReadingProgress targetRef={articleRef} />
      <Navbar />

      <main>
        <article ref={articleRef}>
          {/* Hero: breadcrumbs, title, byline. No featured image inside the
              header — it slots in below so the eye lands on the title first. */}
          <header className="border-b border-border bg-[hsl(var(--section-alternate))]">
            <div className={`container mx-auto max-w-3xl ${HERO_DENSITY_CLASS[tpl.heroDensity]}`}>
              <div className="mb-3">
                <WPBreadcrumbs items={breadcrumbItems} />
              </div>

              {cats.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {cats.slice(0, 3).map((c) => (
                    <Link key={c.id} to={`/category/${c.slug}`}>
                      <Badge
                        variant="secondary"
                        className="hover:bg-primary/10 transition-colors"
                      >
                        {stripHtml(c.name)}
                      </Badge>
                    </Link>
                  ))}
                </div>
              )}

              <h1
                className="text-section-heading text-foreground mb-4 text-balance"
                dangerouslySetInnerHTML={{ __html: doc.title.rendered }}
              />

              {kind === "post" && (
                <div className="flex flex-wrap items-center justify-between gap-3 mt-3">
                  {author ? (
                    <AuthorCard
                      author={author}
                      publishedAt={doc.date}
                      readingMinutes={readingMinutes}
                    />
                  ) : (
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-body-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(doc.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" /> {readingMinutes} min read
                      </span>
                    </div>
                  )}
                </div>
              )}
              {kind === "page" && readingMinutes > 0 && (
                <div className="text-body-sm text-muted-foreground inline-flex items-center gap-1.5 mt-2">
                  <Clock className="h-3.5 w-3.5" /> {readingMinutes} min read
                </div>
              )}
            </div>
          </header>

          {meditation && (
            <div className={`container mx-auto max-w-3xl ${isDownloadsPage ? "mt-4" : "mt-8"}`}>
              <MeditationPlayer
                src={meditation.audio_url}
                title={meditation.title}
                speaker={meditation.speaker ?? undefined}
                portraitUrl={meditation.portrait_url ?? img?.url ?? undefined}
                durationSeconds={meditation.duration_seconds ?? undefined}
                downloadUrl={meditation.audio_url}
                meditationId={meditation.slug}
                hideTitle={
                  isDownloadsPage &&
                  meditation.title.trim().toLowerCase() === title.trim().toLowerCase()
                }
              />
            </div>
          )}


          {img && tpl.featuredImage !== "hidden" && !isDownloadsPage && !hasWorksheets && !isEbookPost && (() => {
            const w = img.width ?? 0;
            const h = img.height ?? 0;
            const ratio = w && h ? w / h : 0;
            // Logo-like = small or near-square. When autoDetectLogo is on,
            // downgrade `hero` placement to `inline` so we don't get a giant
            // empty band around a square logo.
            const isLogoLike = !w || !h || w < 1000 || ratio < 1.4;
            const placement =
              tpl.featuredImage === "hero" && tpl.autoDetectLogo && isLogoLike
                ? "inline"
                : tpl.featuredImage;

            if (placement === "hero") {
              return (
                <div className="container mx-auto max-w-4xl">
                  <img
                    src={img.url}
                    alt={img.alt}
                    width={w}
                    height={h}
                    className="w-full aspect-[16/9] object-cover rounded-lg shadow-[var(--shadow-lg)] mt-8"
                    loading="eager"
                  />
                </div>
              );
            }
            // inline / header-icon both render as a centered, capped image.
            // header-icon uses tighter spacing so it sits closer to the title.
            const isIcon = placement === "header-icon";
            return (
              <div
                className={`container mx-auto max-w-3xl flex justify-center ${
                  isIcon ? "mt-2" : "mt-6"
                }`}
              >
                <img
                  src={img.url}
                  alt={img.alt}
                  width={w || undefined}
                  height={h || undefined}
                  style={{ maxHeight: tpl.featuredMaxHeightPx }}
                  className="w-auto object-contain rounded-md"
                  loading="eager"
                />
              </div>
            );
          })()}

          {/* Two-column body: sticky TOC on lg+, content + share rail. */}
          <div className={`container mx-auto max-w-6xl ${tpl.heroDensity === "compact" ? "py-6 lg:py-10" : "py-10 lg:py-14"}`}>
            <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_220px] lg:gap-12 xl:gap-16">
              <div className="max-w-3xl mx-auto lg:mx-0 w-full min-w-0">
                {!meditation && buzzsproutEmbed && (
                  <div className="mb-8">
                    <BuzzsproutEmbedPlayer
                      embed={buzzsproutEmbed}
                      title={title}
                      postId={doc.id}
                      postSlug={slug}
                    />
                  </div>
                )}
                {!meditation && !buzzsproutEmbed && audioSrc && (
                  <div className="mb-8">
                    <h2
                      id="podcast-player-heading"
                      className="text-eyebrow text-primary mb-2 inline-flex items-center gap-1.5 font-sans"
                    >
                      <Headphones className="h-3.5 w-3.5" aria-hidden="true" /> Listen to this episode
                    </h2>
                    <PodcastPlayer
                      src={audioSrc}
                      title={title}
                      episodeId={doc.id}
                      headingId="podcast-player-heading"
                    />
                  </div>
                )}

                {(() => {
                  const script = getMeditationScript(slug);
                  if (!script) return null;
                  return (
                    <div className="mb-8">
                      <MeditationScript
                        variant="inline"
                        pdfUrl={script.pdfUrl}
                        title={script.title}
                        fileSize={script.fileSize}
                        meditationId={slug}
                      />
                    </div>
                  );
                })()}

                {(() => {
                  const worksheets = attachedWorksheets;
                  if (worksheets.length === 0) return null;
                  return (
                    <div className="mb-8 space-y-6">
                      {worksheets.map((ws) => (
                        <div key={ws.pdfUrl}>
                          <MeditationScript
                            kind="worksheet"
                            variant="collapsible"
                            pdfUrl={ws.pdfUrl}
                            title={ws.title}
                            fileSize={ws.fileSize}
                            meditationId={slug}
                          />
                          <WorksheetMindfulGuidance title={ws.title} />
                        </div>
                      ))}
                    </div>
                  );
                })()}

                {(() => {
                  const playlist = getPlaylist(slug);
                  if (!playlist) return null;
                  return <AudioPlaylistBlock playlist={playlist} hostSlug={slug} />;
                })()}

                {(() => {
                  const videos = getInlineVideos(slug);
                  if (videos.length === 0) return null;
                  return (
                    <div className="my-8 space-y-6 not-prose">
                      {videos.map((v, i) => (
                        <figure
                          key={`${v.provider}-${v.id}-${i}`}
                          className="space-y-2"
                        >
                          <LiteVideoEmbed
                            provider={v.provider}
                            id={v.id}
                            hash={v.hash}
                            title={v.title}
                            duration={v.duration}
                            location={`wp_post_${slug}_inline_video`}
                          />
                          <figcaption className="text-caption text-muted-foreground text-center">
                            {v.title}
                          </figcaption>
                        </figure>
                      ))}
                    </div>
                  );
                })()}

                <div
                  ref={contentRef}
                  className="prose prose-lg prose-stone max-w-none prose-headings:font-serif prose-headings:scroll-mt-24 prose-headings:text-foreground prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3 prose-p:text-foreground/90 prose-p:leading-[1.75] prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-a:underline-offset-4 prose-blockquote:border-l-primary prose-blockquote:bg-[hsl(var(--section-alternate))] prose-blockquote:py-1 prose-blockquote:px-5 prose-blockquote:rounded-r-md prose-blockquote:not-italic prose-img:rounded-lg prose-img:shadow-[var(--shadow-card)] prose-figure:my-8 prose-figcaption:text-center prose-figcaption:text-muted-foreground prose-figcaption:text-sm prose-li:marker:text-primary"
                  dangerouslySetInnerHTML={{ __html: rewrittenHtml }}
                />

                {/* Map cached Buzzsprout description into structured podcast
                    sections (summary, takeaways, reflection questions). The
                    show-notes block is suppressed when WP `content.rendered`
                    is non-trivial to avoid duplicating editorial copy. */}
                {isPodcastEpisode && buzzsproutRecord && (
                  <BuzzsproutEpisodeSections
                    record={buzzsproutRecord}
                    includeShowNotes={stripHtml(rawContent).trim().length < 400}
                  />
                )}
                {/* Inline share rail — appears at the natural end of the read. */}
                <div className="mt-10 pt-6 border-t border-border">
                  <ShareBar
                    title={title}
                    url={shareUrl}
                    kind={isPodcastEpisode ? "podcast" : kind}
                  />
                </div>

                <aside className="mt-12 lg:mt-16 p-6 lg:p-8 rounded-lg bg-[hsl(var(--section-emphasis))] border border-border">
                  <p className="text-eyebrow text-primary mb-2">
                    Mindfulness Teacher Certification
                  </p>
                  <h2 className="text-card-heading text-foreground mb-2">
                    {kind === "post"
                      ? "Ready to teach mindfulness exercises with confidence?"
                      : "Take the next step in your practice"}
                  </h2>
                  <p className="text-body text-muted-foreground mb-5 max-w-xl">
                    Join the APA-, CPD- and IMMA-accredited Mindfulness Teacher
                    Certification trusted by mindfulness teachers worldwide.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Button asChild size="lg" className="h-11">
                      <a href={CERTIFY_URL} target="_blank" rel="noopener">
                        Get certified <ArrowRight className="h-4 w-4 ml-1" />
                      </a>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="h-11">
                      <Link to={isPodcastEpisode ? "/podcast" : "/blog"}>
                        {isPodcastEpisode ? "Browse episodes" : "Browse the blog"}
                      </Link>
                    </Button>
                  </div>
                </aside>

                {primaryCategory && kind === "post" && (
                  <RelatedPosts
                    categoryId={primaryCategory.id}
                    excludeId={doc.id}
                    endpoint={cptEndpoint}
                  />
                )}

                {/* Hand-curated cross-sell powered by the top-100 taxonomy.
                    Self-hides on posts that aren't in the top-100 list. */}
                <RecommendedNext />
              </div>

              {/* Sticky sidebar — only renders when there's a meaningful TOC. */}
              {toc.length >= 3 && (
                <aside
                  className="hidden lg:block"
                  aria-label="Article navigation sidebar"
                >
                  <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-2">
                    <TableOfContents items={toc} />
                  </div>
                </aside>
              )}
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
