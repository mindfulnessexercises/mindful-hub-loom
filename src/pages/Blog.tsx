import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Search, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/homepage/Navbar";
import { Footer } from "@/components/homepage/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { wp, getFeaturedImage, getCategories, stripHtml, formatDate } from "@/lib/wp";
import { WPSeo } from "@/components/wp/WPSeo";

export default function Blog() {
  const [params, setParams] = useSearchParams();
  const page = Number(params.get("page") ?? "1");
  const search = params.get("q") ?? "";
  const categoryParam = params.get("cat");
  const category = categoryParam ? Number(categoryParam) : undefined;
  const [searchInput, setSearchInput] = useState(search);

  const postsQuery = useQuery({
    queryKey: ["wp-posts", page, search, category],
    queryFn: () => wp.posts({ page, per_page: 12, search: search || undefined, categories: category }),
    staleTime: 5 * 60 * 1000,
  });

  const catsQuery = useQuery({
    queryKey: ["wp-categories"],
    queryFn: () => wp.categories(),
    staleTime: 60 * 60 * 1000,
  });

  const updateParam = (key: string, value?: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value); else next.delete(key);
    if (key !== "page") next.delete("page");
    setParams(next);
  };

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateParam("q", searchInput.trim() || undefined);
  };

  const totalPages = postsQuery.data?.totalPages ?? 1;
  const total = postsQuery.data?.total ?? 0;

  return (
    <div className="min-h-screen bg-background">
      <WPSeo
        title="Mindfulness Exercises Blog — Practices, Research & Teaching Insights"
        description="Browse 1,200+ articles on mindfulness exercises, meditation scripts, MBSR techniques, and teaching practice from Mindfulness Exercises."
        canonical={`https://mindfulnessexercises.com/blog${page > 1 ? `?page=${page}` : ""}`}
        type="website"
      />
      <Navbar />

      <main>
        {/* Header */}
        <section className="border-b border-border bg-[hsl(var(--section-alternate))]">
          <div className="container mx-auto py-12 lg:py-16">
            <p className="text-eyebrow text-muted-foreground mb-3">Blog · Mindfulness Exercises</p>
            <h1 className="text-section-heading text-foreground max-w-3xl">
              Mindfulness exercises, scripts, and teaching insights
            </h1>
            <p className="text-body-lg text-muted-foreground mt-4 max-w-2xl">
              {total > 0 ? `${total.toLocaleString()} articles` : "A growing library of articles"} on practice, research, and the craft of teaching mindfulness.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 max-w-2xl">
              <form onSubmit={onSearch} className="flex-1 flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden />
                  <Input
                    type="search"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Search articles…"
                    aria-label="Search articles"
                    className="pl-9 h-11 bg-card"
                  />
                </div>
                <Button type="submit" className="h-11">Search</Button>
              </form>
            </div>

            {catsQuery.data && (
              <div className="mt-5 flex flex-wrap gap-2">
                <button
                  onClick={() => updateParam("cat", undefined)}
                  className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                    !category ? "bg-primary text-primary-foreground border-primary" : "bg-card text-muted-foreground border-border hover:text-foreground"
                  }`}
                >
                  All
                </button>
                {catsQuery.data.items.slice(0, 12).map((c) => (
                  <button
                    key={c.id}
                    onClick={() => updateParam("cat", String(c.id))}
                    className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                      category === c.id ? "bg-primary text-primary-foreground border-primary" : "bg-card text-muted-foreground border-border hover:text-foreground"
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            )}
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
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          )}

          {postsQuery.isError && (
            <p className="text-center text-muted-foreground py-12">Could not load articles. Please try again.</p>
          )}

          {postsQuery.data && postsQuery.data.items.length === 0 && (
            <p className="text-center text-muted-foreground py-12">No articles found.</p>
          )}

          {postsQuery.data && postsQuery.data.items.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {postsQuery.data.items.map((post) => {
                const img = getFeaturedImage(post);
                const cats = getCategories(post);
                return (
                  <article key={post.id} className="group flex flex-col bg-card rounded-lg overflow-hidden border border-border shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-shadow duration-300">
                    <Link to={`/blog/${post.slug}`} className="block aspect-[16/10] bg-muted overflow-hidden">
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
                        {cats[0] && <Badge variant="secondary" className="font-medium">{cats[0].name}</Badge>}
                        <span>{formatDate(post.date)}</span>
                      </div>
                      <h2 className="text-card-heading text-foreground mb-2">
                        <Link to={`/blog/${post.slug}`} className="hover:text-primary transition-colors" dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
                      </h2>
                      <p className="text-body-sm text-muted-foreground line-clamp-3">
                        {stripHtml(post.excerpt.rendered)}
                      </p>
                      <Link to={`/blog/${post.slug}`} className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2 transition-all">
                        Read article <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <nav className="mt-12 flex items-center justify-center gap-2" aria-label="Pagination">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => updateParam("page", String(page - 1))}
              >
                <ChevronLeft className="h-4 w-4" /> Previous
              </Button>
              <span className="text-body-sm text-muted-foreground px-4">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => updateParam("page", String(page + 1))}
              >
                Next <ChevronRight className="h-4 w-4" />
              </Button>
            </nav>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
