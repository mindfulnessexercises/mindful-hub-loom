import { Link, useParams } from "react-router-dom";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { ArrowRight, Loader2 } from "lucide-react";
import { Navbar } from "@/components/homepage/Navbar";
import { Footer } from "@/components/homepage/Footer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { wp, getFeaturedImage, getCategories, stripHtml, formatDate, type WPPost, type PaginatedResult } from "@/lib/wp";
import { WPSeo } from "@/components/wp/WPSeo";
import { useUrlPagination } from "@/hooks/use-url-pagination";
import NotFound from "./NotFound";

const PER_PAGE = 100;
const CERTIFY_URL = "https://certify.mindfulnessexercises.com/";

export default function Category() {
  const { slug = "" } = useParams();

  const catQuery = useQuery({
    queryKey: ["wp-cat", slug],
    queryFn: () => wp.categoryBySlug(slug),
    staleTime: 30 * 60 * 1000,
    enabled: !!slug,
    retry: false,
  });

  const postsQuery = useInfiniteQuery<PaginatedResult<WPPost>>({
    queryKey: ["wp-cat-posts", catQuery.data?.id],
    queryFn: ({ pageParam = 1 }) =>
      wp.posts({ page: pageParam as number, per_page: PER_PAGE, categories: catQuery.data!.id }),
    getNextPageParam: (lastPage, all) => {
      const next = all.length + 1;
      return next <= lastPage.totalPages ? next : undefined;
    },
    initialPageParam: 1,
    enabled: !!catQuery.data?.id,
    staleTime: 5 * 60 * 1000,
  });

  const { loadMore } = useUrlPagination({
    loadedPages: postsQuery.data?.pages.length ?? 0,
    hasNextPage: !!postsQuery.hasNextPage,
    isFetchingNextPage: postsQuery.isFetchingNextPage,
    fetchNextPage: postsQuery.fetchNextPage,
  });

  if (catQuery.isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto py-12 lg:py-16 space-y-6">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-12 w-2/3" />
          <Skeleton className="h-6 w-full max-w-xl" />
        </main>
        <Footer />
      </div>
    );
  }

  if (catQuery.isError || !catQuery.data) return <NotFound />;

  const cat = catQuery.data;
  const allPosts = postsQuery.data?.pages.flatMap((p) => p.items) ?? [];
  const total = postsQuery.data?.pages[0]?.total ?? cat.count;
  const description = cat.description
    ? stripHtml(cat.description)
    : `Browse ${cat.count.toLocaleString()} mindfulness exercises and articles in the ${cat.name} category from Mindfulness Exercises.`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${cat.name} — Mindfulness Exercises`,
    description,
    url: `https://mindfulnessexercises.com/category/${cat.slug}`,
  };

  return (
    <div className="min-h-screen bg-background">
      <WPSeo
        title={`${cat.name} — Mindfulness Exercises`}
        description={description.slice(0, 160)}
        canonical={`https://mindfulnessexercises.com/category/${cat.slug}`}
        type="website"
        jsonLd={jsonLd}
      />
      <Navbar />

      <main>
        {/* Header */}
        <section className="border-b border-border bg-[hsl(var(--section-alternate))]">
          <div className="container mx-auto py-12 lg:py-16">
            <nav aria-label="Breadcrumb" className="text-caption text-muted-foreground mb-3">
              <Link to="/" className="hover:text-foreground">Home</Link>
              <span className="mx-2">/</span>
              <Link to="/blog" className="hover:text-foreground">Blog</Link>
              <span className="mx-2">/</span>
              <span className="text-foreground">{cat.name}</span>
            </nav>
            <p className="text-eyebrow text-muted-foreground mb-3">Category · Mindfulness Exercises</p>
            <h1 className="text-section-heading text-foreground max-w-3xl">{cat.name}</h1>
            <p className="text-body-lg text-muted-foreground mt-4 max-w-2xl">
              {description}
            </p>
            <p className="text-body-sm text-muted-foreground mt-4">
              {cat.count.toLocaleString()} {cat.count === 1 ? "article" : "articles"} in this category
            </p>
          </div>
        </section>

        {/* Grid */}
        <section className="container mx-auto py-12 lg:py-16">
          {postsQuery.isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-[16/10] w-full rounded-lg" />
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-6 w-full" />
                </div>
              ))}
            </div>
          )}

          {!postsQuery.isLoading && allPosts.length === 0 && (
            <p className="text-center text-muted-foreground py-12">No articles in this category yet.</p>
          )}

          {allPosts.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {allPosts.map((post) => {
                  const img = getFeaturedImage(post);
                  const cats = getCategories(post);
                  return (
                    <article key={post.id} className="group flex flex-col bg-card rounded-lg overflow-hidden border border-border shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-shadow duration-300">
                      <Link to={`/${post.slug}`} className="block aspect-[16/10] bg-muted overflow-hidden">
                        {img ? (
                          <img src={img.url} alt={img.alt} loading="lazy" className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full bg-[hsl(var(--accent))]" />
                        )}
                      </Link>
                      <div className="p-5 flex flex-col flex-1">
                        <div className="flex items-center gap-2 text-caption text-muted-foreground mb-2">
                          {cats[0] && <Badge variant="secondary" className="font-medium">{cats[0].name}</Badge>}
                          <span>{formatDate(post.date)}</span>
                        </div>
                        <h2 className="text-card-heading text-foreground mb-2">
                          <Link to={`/${post.slug}`} className="hover:text-primary transition-colors" dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
                        </h2>
                        <p className="text-body-sm text-muted-foreground line-clamp-3">{stripHtml(post.excerpt.rendered)}</p>
                      </div>
                    </article>
                  );
                })}
              </div>

              <div className="mt-12 flex flex-col items-center gap-3">
                <p className="text-body-sm text-muted-foreground">
                  Showing {allPosts.length.toLocaleString()} of {total.toLocaleString()}
                </p>
                {postsQuery.hasNextPage && (
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-11 min-w-[200px]"
                    onClick={loadMore}
                    disabled={postsQuery.isFetchingNextPage}
                  >
                    {postsQuery.isFetchingNextPage ? (
                      <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Loading…</>
                    ) : "Load more"}
                  </Button>
                )}
              </div>

              {/* Funnel CTA */}
              <aside className="mt-16 p-6 lg:p-8 rounded-lg bg-[hsl(var(--section-emphasis))] border border-border max-w-3xl mx-auto">
                <p className="text-eyebrow text-primary mb-2">For Practitioners</p>
                <h2 className="text-card-heading text-foreground mb-2">Teach {cat.name.toLowerCase()} with confidence</h2>
                <p className="text-body text-muted-foreground mb-5">
                  Our APA-, CPD- and IMMA-accredited Mindfulness Teacher Certification gives you the framework to share these practices skillfully.
                </p>
                <Button asChild size="lg" className="h-11">
                  <a href={CERTIFY_URL} target="_blank" rel="noopener">
                    Explore certification <ArrowRight className="h-4 w-4 ml-1" />
                  </a>
                </Button>
              </aside>
            </>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
