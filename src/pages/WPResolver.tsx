import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useRef } from "react";
import { ArrowRight, Calendar, ArrowLeft, Clock, Headphones } from "lucide-react";
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
import { PodcastPlayer } from "@/components/wp/PodcastPlayer";
import { MeditationPlayer } from "@/components/wp/MeditationPlayer";
import { useMeditation } from "@/hooks/use-meditation";
import {
  getTemplateConfig,
  HERO_DENSITY_CLASS,
} from "@/lib/wp-template-config";

/**
 * Removes Elfsight audio player embeds from rendered WP HTML once we have a
 * native MeditationPlayer to show instead — prevents the old player from
 * appearing alongside the new one. Targets both the lazy script tag and the
 * placeholder div Elfsight injects into.
 */
function stripElfsightEmbeds(html: string): string {
  if (!html) return html;
  return html
    .replace(/<script[^>]*elfsightcdn[^>]*><\/script>/gi, "")
    .replace(/<div[^>]*class="[^"]*elfsight-app-[^"]*"[^>]*><\/div>/gi, "");
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

  // Thrive shortcodes
  out = out.replace(/\[tcb-script[\s\S]*?\[\/tcb-script\]/gi, "");
  out = out.replace(/\[\/?tcb[_-][^\]]*\]/gi, "");

  // Lead-capture sentence (with or without <p> wrapper)
  out = out.replace(
    /<p[^>]*>\s*Download this Audio Meditation for Free[\s\S]*?<\/p>/gi,
    "",
  );
  out = out.replace(
    /Download this Audio Meditation for Free[^<]*?Email Address[^<:]*[:.]?/gi,
    "",
  );

  // Orphan headphone download icon — typically a small <img> from the WP
  // uploads dir with "headphone" or "download" in its filename, or sized
  // <200px square. Match by filename hint.
  out = out.replace(
    /<img[^>]*(?:headphone|download-icon|download_icon|headphones)[^>]*>/gi,
    "",
  );

  // Creative Commons badges (cc-by-nc-nd images and Creative Commons text)
  out = out.replace(
    /<a[^>]*creativecommons\.org[^>]*>[\s\S]*?<\/a>/gi,
    "",
  );
  out = out.replace(
    /<img[^>]*(?:creativecommons|cc[\-_]by|by-nc-nd)[^>]*>/gi,
    "",
  );

  // Hint/instructional paragraphs that referenced the old player UX
  out = out.replace(
    /<p[^>]*>\s*(?:Would you like to download|To download[^<]*right.click|\*?Note:\*?)[\s\S]*?<\/p>/gi,
    "",
  );

  // Random video thumbnails embedded as bare <img> with no player wrapper —
  // detect via filename patterns from the WP uploads (yt-thumb, video-still, etc.)
  out = out.replace(
    /<img[^>]*(?:yt[\-_]?thumb|video[\-_]still|video[\-_]thumb|youtube\.com\/vi)[^>]*>/gi,
    "",
  );

  // Strip empty wrappers left behind (run twice to catch nested empties)
  for (let i = 0; i < 3; i++) {
    out = out.replace(/<(p|div|figure|figcaption)[^>]*>\s*(?:&nbsp;|\s)*<\/\1>/gi, "");
  }

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
    if (meditation) cleaned = stripElfsightEmbeds(cleaned);
    if (isDownloadsPage) cleaned = stripDownloadsLegacy(cleaned);
    const linked = rewriteWpHtml(cleaned);
    const { html, items } = extractToc(linked);
    return { rewrittenHtml: html, toc: items };
  }, [rawContent, meditation, isDownloadsPage]);

  const audioSrc = useMemo(() => extractFirstAudioUrl(rawContent), [rawContent]);
  const readingMinutes = useMemo(() => estimateReadingMinutes(rawContent), [rawContent]);

  useEffect(
    () => attachWpLinkInterceptor(contentRef.current, navigate),
    [rewrittenHtml, navigate],
  );

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

  if (query.isError || !query.data) return <NotFound />;

  const { kind, data: doc } = query.data;
  const img = getFeaturedImage(doc);
  const description =
    doc.yoast_head_json?.description || stripHtml(doc.excerpt.rendered).slice(0, 160);
  const title = stripHtml(doc.title.rendered);
  const cats = kind === "post" ? getCategories(doc) : [];
  const primaryCategory = cats[0];
  const author = kind === "post" ? getAuthor(doc) : null;
  const templateKind: "page" | "post" | "podcast" =
    kind === "page" ? "page" : isPodcastEpisode ? "podcast" : "post";
  const tpl = getTemplateConfig(doc.slug, templateKind);
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
      ? [{ label: primaryCategory.name, href: `/category/${primaryCategory.slug}` }]
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
              <div className="mb-5">
                <WPBreadcrumbs items={breadcrumbItems} />
              </div>

              {kind === "post" && (
                <Link
                  to={isPodcastEpisode ? "/podcast" : "/blog"}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-5"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  {isPodcastEpisode ? "All episodes" : "All articles"}
                </Link>
              )}

              {cats.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  {cats.slice(0, 3).map((c) => (
                    <Link key={c.id} to={`/category/${c.slug}`}>
                      <Badge
                        variant="secondary"
                        className="hover:bg-primary/10 transition-colors"
                      >
                        {c.name}
                      </Badge>
                    </Link>
                  ))}
                </div>
              )}

              <h1
                className="text-hero text-foreground mb-6 text-balance"
                dangerouslySetInnerHTML={{ __html: doc.title.rendered }}
              />

              {kind === "post" && (
                <div className="flex flex-wrap items-center justify-between gap-4 mt-6">
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
            <div className="container mx-auto max-w-3xl mt-8">
              <MeditationPlayer
                src={meditation.audio_url}
                title={meditation.title}
                speaker={meditation.speaker ?? undefined}
                portraitUrl={meditation.portrait_url ?? undefined}
                durationSeconds={meditation.duration_seconds ?? undefined}
                downloadUrl={meditation.audio_url}
                meditationId={meditation.slug}
              />
            </div>
          )}

          {img && tpl.featuredImage !== "hidden" && (() => {
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
                {!meditation && audioSrc && (
                  <div className="mb-8">
                    <p className="text-eyebrow text-primary mb-2 inline-flex items-center gap-1.5">
                      <Headphones className="h-3.5 w-3.5" /> Listen to this episode
                    </p>
                    <PodcastPlayer src={audioSrc} title={title} episodeId={doc.id} />
                  </div>
                )}

                <div
                  ref={contentRef}
                  className="prose prose-lg prose-stone max-w-none prose-headings:font-serif prose-headings:scroll-mt-24 prose-headings:text-foreground prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3 prose-p:text-foreground/90 prose-p:leading-[1.75] prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-a:underline-offset-4 prose-blockquote:border-l-primary prose-blockquote:bg-[hsl(var(--section-alternate))] prose-blockquote:py-1 prose-blockquote:px-5 prose-blockquote:rounded-r-md prose-blockquote:not-italic prose-img:rounded-lg prose-img:shadow-[var(--shadow-card)] prose-figure:my-8 prose-figcaption:text-center prose-figcaption:text-muted-foreground prose-figcaption:text-sm prose-li:marker:text-primary"
                  dangerouslySetInnerHTML={{ __html: rewrittenHtml }}
                />

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
