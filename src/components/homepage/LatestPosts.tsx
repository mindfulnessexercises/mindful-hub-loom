import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { wp, getFeaturedImage, getCategories, stripHtml, formatDate } from "@/lib/wp";

export function LatestPosts() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["wp-latest-posts"],
    queryFn: () => wp.posts({ per_page: 6 }),
    staleTime: 10 * 60 * 1000,
  });

  if (isError) return null;

  return (
    <section
      className="py-16 lg:py-20 bg-[hsl(var(--section-primary))]"
      aria-labelledby="latest-posts-heading"
    >
      <div className="container mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div className="max-w-2xl">
            <p className="text-eyebrow text-muted-foreground mb-3">From the Blog</p>
            <h2 id="latest-posts-heading" className="text-section-heading text-foreground">
              Latest mindfulness exercises &amp; insights
            </h2>
            <p className="text-body-lg text-muted-foreground mt-3">
              Fresh practices, scripts, and teaching guidance — drawn from our library of 1,500+ articles.
            </p>
          </div>
          <Button asChild variant="outline" className="h-11 self-start sm:self-end shrink-0">
            <Link to="/blog">
              Browse all articles <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-[16/10] w-full rounded-lg" />
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        )}

        {data?.items && data.items.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {data.items.map((post) => {
              const img = getFeaturedImage(post);
              const cats = getCategories(post);
              return (
                <article
                  key={post.id}
                  className="group flex flex-col bg-card rounded-lg overflow-hidden border border-border shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-shadow duration-300"
                >
                  <Link to={`/${post.slug}`} className="block aspect-[16/10] bg-muted overflow-hidden">
                    {img ? (
                      <img
                        src={img.url}
                        alt={img.alt}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-[hsl(var(--accent))]" />
                    )}
                  </Link>
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-2 text-caption text-muted-foreground mb-2">
                      {cats[0] && (
                        <Link to={`/category/${cats[0].slug}`}>
                          <Badge variant="secondary" className="font-medium hover:bg-primary/10 transition-colors">
                            {cats[0].name}
                          </Badge>
                        </Link>
                      )}
                      <span>{formatDate(post.date)}</span>
                    </div>
                    <h3 className="text-card-heading text-foreground mb-2">
                      <Link
                        to={`/${post.slug}`}
                        className="hover:text-primary transition-colors"
                        dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                      />
                    </h3>
                    <p className="text-body-sm text-muted-foreground line-clamp-2">
                      {stripHtml(post.excerpt.rendered)}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
