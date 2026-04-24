import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, Calendar } from "lucide-react";
import { Navbar } from "@/components/homepage/Navbar";
import { Footer } from "@/components/homepage/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { wp, getFeaturedImage, getCategories, getAuthor, stripHtml, formatDate } from "@/lib/wp";
import { WPSeo } from "@/components/wp/WPSeo";

const CERTIFY_URL = "https://certify.mindfulnessexercises.com/";

export default function BlogPost() {
  const { slug = "" } = useParams();

  const { data: post, isLoading, isError } = useQuery({
    queryKey: ["wp-post", slug],
    queryFn: () => wp.postBySlug(slug),
    staleTime: 10 * 60 * 1000,
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto max-w-3xl py-12 lg:py-20 space-y-6">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-12 w-full" />
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

  if (isError || !post) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto max-w-3xl py-20 text-center">
          <h1 className="text-section-heading mb-4">Article not found</h1>
          <p className="text-muted-foreground mb-8">We couldn't find that article. It may have moved.</p>
          <Button asChild>
            <Link to="/blog">Back to all articles</Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  const img = getFeaturedImage(post);
  const cats = getCategories(post);
  const author = getAuthor(post);
  const description = post.yoast_head_json?.description || stripHtml(post.excerpt.rendered).slice(0, 160);
  const title = stripHtml(post.title.rendered);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    image: img?.url ? [img.url] : undefined,
    datePublished: post.date,
    dateModified: post.modified,
    author: author ? { "@type": "Person", name: author.name } : { "@type": "Organization", name: "Mindfulness Exercises" },
    publisher: {
      "@type": "Organization",
      name: "Mindfulness Exercises",
      url: "https://mindfulnessexercises.com",
    },
    mainEntityOfPage: `https://mindfulnessexercises.com/blog/${post.slug}`,
  };

  return (
    <div className="min-h-screen bg-background">
      <WPSeo
        title={`${title} — Mindfulness Exercises`}
        description={description}
        canonical={`https://mindfulnessexercises.com/blog/${post.slug}`}
        ogImage={img?.url}
        jsonLd={jsonLd}
      />
      <Navbar />

      <main>
        <article>
          {/* Header */}
          <header className="border-b border-border bg-[hsl(var(--section-alternate))]">
            <div className="container mx-auto max-w-3xl py-10 lg:py-14">
              <Link to="/blog" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-6">
                <ArrowLeft className="h-3.5 w-3.5" /> All articles
              </Link>

              <div className="flex flex-wrap items-center gap-2 mb-4">
                {cats.slice(0, 3).map((c) => (
                  <Badge key={c.id} variant="secondary">{c.name}</Badge>
                ))}
              </div>

              <h1 className="text-hero text-foreground mb-5" dangerouslySetInnerHTML={{ __html: post.title.rendered }} />

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-body-sm text-muted-foreground">
                {author && <span>By {author.name}</span>}
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" /> {formatDate(post.date)}
                </span>
              </div>
            </div>
          </header>

          {/* Featured image */}
          {img && (
            <div className="container mx-auto max-w-4xl -mt-2 lg:-mt-4">
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

          {/* Content */}
          <div className="container mx-auto max-w-3xl py-10 lg:py-14">
            <div
              className="prose prose-lg prose-stone max-w-none prose-headings:font-serif prose-headings:text-foreground prose-p:text-foreground/90 prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg prose-img:shadow-[var(--shadow-card)]"
              dangerouslySetInnerHTML={{ __html: post.content.rendered }}
            />

            {/* Funnel CTA */}
            <aside className="mt-12 lg:mt-16 p-6 lg:p-8 rounded-lg bg-[hsl(var(--section-emphasis))] border border-border">
              <p className="text-eyebrow text-primary mb-2">For Practitioners</p>
              <h2 className="text-card-heading text-foreground mb-2">Ready to teach mindfulness exercises with confidence?</h2>
              <p className="text-body text-muted-foreground mb-5 max-w-xl">
                Our APA-, CPD- and IMMA-accredited Mindfulness Teacher Certification gives you the framework, practices, and credentials to lead with skill.
              </p>
              <Button asChild size="lg" className="h-11">
                <a href={CERTIFY_URL} target="_blank" rel="noopener">
                  Explore certification <ArrowRight className="h-4 w-4 ml-1" />
                </a>
              </Button>
            </aside>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
