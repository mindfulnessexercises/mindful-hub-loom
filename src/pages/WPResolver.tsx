import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { Navbar } from "@/components/homepage/Navbar";
import { Footer } from "@/components/homepage/Footer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { wp, getFeaturedImage, getCategories, getAuthor, stripHtml, formatDate, URL_PARENT_TO_CPT_ENDPOINT } from "@/lib/wp";
import { wpKeys, WP_STALE } from "@/lib/wp-cache";
import { WPSeo } from "@/components/wp/WPSeo";
import NotFound from "./NotFound";
import { Calendar, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { rewriteWpHtml, attachWpLinkInterceptor } from "@/lib/rewrite-wp-html";

import { isReservedSlug } from "@/lib/reserved-slugs";

const CERTIFY_URL = "https://certify.mindfulnessexercises.com/";

export default function WPResolver() {
  const params = useParams();
  // Supports both /:slug and nested /*. For nested URLs (e.g.
  // /course/foo, /podcast-episodes/bar), WP's permalink for the leaf is the
  // last path segment — that's what we look up.
  const rawPath = (params["*"] ?? params.slug ?? "").replace(/\/+$/, "");
  const segments = rawPath.split("/").filter(Boolean);
  const slug = segments[segments.length - 1] ?? "";
  // For nested URLs the parent segment tells us which CPT endpoint to try.
  // e.g. /podcast-episodes/<slug> → /wp/v2/podcast-episodes; /downloads/<slug>
  // → /wp/v2/downloads. Single-segment URLs have no parent.
  const parent = segments.length > 1 ? segments[segments.length - 2] : "";
  const cptEndpoint = URL_PARENT_TO_CPT_ENDPOINT[parent];
  const navigate = useNavigate();
  const contentRef = useRef<HTMLDivElement | null>(null);

  // Resolution order: CPT (if URL parent maps to one) → post → page. Matches
  // WordPress's own permalink resolution while extending it to surface CPT
  // entries (podcast episodes, downloads) under their nested URLs.
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
  const rewrittenHtml = useMemo(() => rewriteWpHtml(rawContent), [rawContent]);
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
  const description = doc.yoast_head_json?.description || stripHtml(doc.excerpt.rendered).slice(0, 160);
  const title = stripHtml(doc.title.rendered);
  const cats = kind === "post" ? getCategories(doc) : [];
  const author = kind === "post" ? getAuthor(doc) : null;

  const jsonLd = kind === "post"
    ? {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: title,
        description,
        image: img?.url ? [img.url] : undefined,
        datePublished: doc.date,
        dateModified: doc.modified,
        author: author ? { "@type": "Person", name: author.name } : { "@type": "Organization", name: "Mindfulness Exercises" },
        publisher: {
          "@type": "Organization",
          name: "Mindfulness Exercises",
          url: "https://mindfulnessexercises.com",
        },
        mainEntityOfPage: `https://mindfulnessexercises.com/${doc.slug}`,
      }
    : undefined;

  return (
    <div className="min-h-screen bg-background">
      <WPSeo
        title={`${title} — Mindfulness Exercises`}
        description={description}
        canonical={`https://mindfulnessexercises.com/${doc.slug}`}
        ogImage={img?.url}
        type={kind === "post" ? "article" : "website"}
        jsonLd={jsonLd}
      />
      <Navbar />

      <main>
        <article>
          <header className="border-b border-border bg-[hsl(var(--section-alternate))]">
            <div className="container mx-auto max-w-3xl py-10 lg:py-14">
              {kind === "post" && (
                <Link to="/blog" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-6">
                  <ArrowLeft className="h-3.5 w-3.5" /> All articles
                </Link>
              )}

              {cats.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  {cats.slice(0, 3).map((c) => (
                    <Link key={c.id} to={`/category/${c.slug}`}>
                      <Badge variant="secondary" className="hover:bg-primary/10 transition-colors">{c.name}</Badge>
                    </Link>
                  ))}
                </div>
              )}

              <h1 className="text-hero text-foreground mb-5" dangerouslySetInnerHTML={{ __html: doc.title.rendered }} />

              {kind === "post" && (
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-body-sm text-muted-foreground">
                  {author && <span>By {author.name}</span>}
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" /> {formatDate(doc.date)}
                  </span>
                </div>
              )}
            </div>
          </header>

          {img && (
            <div className="container mx-auto max-w-4xl">
              <img
                src={img.url}
                alt={img.alt}
                width={img.width}
                height={img.height}
                className="w-full aspect-[16/9] object-cover rounded-lg shadow-[var(--shadow-lg)] mt-8"
                loading="eager"
              />
            </div>
          )}

          <div className="container mx-auto max-w-3xl py-10 lg:py-14">
            <div
              ref={contentRef}
              className="prose prose-lg prose-stone max-w-none prose-headings:font-serif prose-headings:text-foreground prose-p:text-foreground/90 prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg prose-img:shadow-[var(--shadow-card)]"
              dangerouslySetInnerHTML={{ __html: rewrittenHtml }}
            />

            <aside className="mt-12 lg:mt-16 p-6 lg:p-8 rounded-lg bg-[hsl(var(--section-emphasis))] border border-border">
              <p className="text-eyebrow text-primary mb-2">Mindfulness Teacher Certification</p>
              <h2 className="text-card-heading text-foreground mb-2">
                {kind === "post" ? "Ready to teach mindfulness exercises with confidence?" : "Take the next step in your practice"}
              </h2>
              <p className="text-body text-muted-foreground mb-5 max-w-xl">
                Join the APA-, CPD- and IMMA-accredited Mindfulness Teacher Certification trusted by mindfulness teachers worldwide.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg" className="h-11">
                  <a href={CERTIFY_URL} target="_blank" rel="noopener">
                    Get certified <ArrowRight className="h-4 w-4 ml-1" />
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg" className="h-11">
                  <Link to="/blog">Browse the blog</Link>
                </Button>
              </div>
            </aside>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
