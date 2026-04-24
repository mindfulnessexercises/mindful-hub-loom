import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { Navbar } from "@/components/homepage/Navbar";
import { Footer } from "@/components/homepage/Footer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { wp, getFeaturedImage, stripHtml } from "@/lib/wp";
import { WPSeo } from "@/components/wp/WPSeo";
import NotFound from "./NotFound";

const CERTIFY_URL = "https://certify.mindfulnessexercises.com/";

// Slugs handled by other dedicated routes — let them 404 here so the catch-all router handles them.
const RESERVED = new Set(["", "blog", "ce-policies"]);

export default function WPPage() {
  const { slug = "" } = useParams();

  const { data: page, isLoading, isError } = useQuery({
    queryKey: ["wp-page", slug],
    queryFn: () => wp.pageBySlug(slug),
    staleTime: 10 * 60 * 1000,
    enabled: !!slug && !RESERVED.has(slug),
  });

  if (RESERVED.has(slug)) return <NotFound />;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto max-w-3xl py-12 lg:py-20 space-y-6">
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </main>
        <Footer />
      </div>
    );
  }

  if (isError || !page) return <NotFound />;

  const img = getFeaturedImage(page);
  const description = page.yoast_head_json?.description || stripHtml(page.excerpt.rendered).slice(0, 160);
  const title = stripHtml(page.title.rendered);

  return (
    <div className="min-h-screen bg-background">
      <WPSeo
        title={`${title} — Mindfulness Exercises`}
        description={description}
        canonical={`https://mindfulnessexercises.com/${page.slug}`}
        ogImage={img?.url}
        type="website"
      />
      <Navbar />

      <main>
        <header className="border-b border-border bg-[hsl(var(--section-alternate))]">
          <div className="container mx-auto max-w-3xl py-10 lg:py-14">
            <h1 className="text-hero text-foreground" dangerouslySetInnerHTML={{ __html: page.title.rendered }} />
          </div>
        </header>

        {img && (
          <div className="container mx-auto max-w-4xl">
            <img
              src={img.url}
              alt={img.alt}
              className="w-full aspect-[16/9] object-cover rounded-lg shadow-[var(--shadow-lg)] mt-8"
              loading="eager"
            />
          </div>
        )}

        <div className="container mx-auto max-w-3xl py-10 lg:py-14">
          <div
            className="prose prose-lg prose-stone max-w-none prose-headings:font-serif prose-headings:text-foreground prose-p:text-foreground/90 prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg"
            dangerouslySetInnerHTML={{ __html: page.content.rendered }}
          />

          <aside className="mt-12 lg:mt-16 p-6 lg:p-8 rounded-lg bg-[hsl(var(--section-emphasis))] border border-border">
            <p className="text-eyebrow text-primary mb-2">Mindfulness Teacher Certification</p>
            <h2 className="text-card-heading text-foreground mb-2">Take the next step in your practice</h2>
            <p className="text-body text-muted-foreground mb-5 max-w-xl">
              Join the APA-, CPD- and IMMA-accredited certification trusted by mindfulness teachers worldwide.
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
      </main>

      <Footer />
    </div>
  );
}
