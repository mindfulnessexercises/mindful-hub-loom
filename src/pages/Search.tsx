import { Link, useSearchParams } from "react-router-dom";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { ArrowRight, Loader2, FileText, BookOpen } from "lucide-react";
import { Navbar } from "@/components/homepage/Navbar";
import { Footer } from "@/components/homepage/Footer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { wp, getFeaturedImage, getCategories, stripHtml, formatDate, type WPPost, type PaginatedResult } from "@/lib/wp";
import { wpKeys, WP_STALE } from "@/lib/wp-cache";
import { WPSeo } from "@/components/wp/WPSeo";
import { SiteSearchBar } from "@/components/wp/SiteSearchBar";
import { useUrlPagination } from "@/hooks/use-url-pagination";

const PER_PAGE = 50; // Per content type, when searching both

type ContentType = "all" | "posts" | "pages";

export default function Search() {
  const [params, setParams] = useSearchParams();
  const q = params.get("q") ?? "";
  const type = (params.get("type") as ContentType) || "all";
  const categoryParam = params.get("cat");
  const category = categoryParam ? Number(categoryParam) : undefined;

  const updateParam = (key: string, value?: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value); else next.delete(key);
    // Any filter change resets pagination so shared URLs are coherent.
    if (key !== "page") next.delete("page");
    setParams(next);
  };

  // ---- Posts (paginated, infinite) ----
  const postsQuery = useInfiniteQuery<PaginatedResult<WPPost>>({
    queryKey: wpKeys.postsList({ scope: "search", search: q, category, perPage: PER_PAGE }),
    queryFn: ({ pageParam = 1 }) =>
      wp.posts({
        page: pageParam as number,
        per_page: PER_PAGE,
        search: q || undefined,
        categories: category,
      }),
    getNextPageParam: (lastPage, all) => {
      const next = all.length + 1;
      return next <= lastPage.totalPages ? next : undefined;
    },
    initialPageParam: 1,
    enabled: !!q && (type === "all" || type === "posts"),
    staleTime: WP_STALE.list,
    gcTime: WP_STALE.gc,
  });

  // ---- Pages (single fetch, max 100; pages are usually fewer) ----
  const pagesQuery = useQuery({
    queryKey: wpKeys.pagesList({ search: q, perPage: 100 }),
    queryFn: () => wp.pages({ per_page: 100, search: q } as { per_page: number; search: string }),
    enabled: !!q && (type === "all" || type === "pages"),
    staleTime: WP_STALE.list,
    gcTime: WP_STALE.gc,
  });

  const catsQuery = useQuery({
    queryKey: wpKeys.categories(),
    queryFn: () => wp.categories(),
    staleTime: WP_STALE.taxonomy,
    gcTime: WP_STALE.gc,
  });

  const { loadMore } = useUrlPagination({
    loadedPages: postsQuery.data?.pages.length ?? 0,
    hasNextPage: !!postsQuery.hasNextPage,
    isFetchingNextPage: postsQuery.isFetchingNextPage,
    fetchNextPage: postsQuery.fetchNextPage,
  });

  const allPosts = postsQuery.data?.pages.flatMap((p) => p.items) ?? [];
  const postsTotal = postsQuery.data?.pages[0]?.total ?? 0;
  const pages = pagesQuery.data?.items ?? [];
  const pagesTotal = pagesQuery.data?.total ?? 0;
  const showPosts = type === "all" || type === "posts";
  const showPages = type === "all" || type === "pages";
  const grandTotal = (showPosts ? postsTotal : 0) + (showPages ? pagesTotal : 0);

  const isLoading = (showPosts && postsQuery.isLoading) || (showPages && pagesQuery.isLoading);

  return (
    <div className="min-h-screen bg-background">
      <WPSeo
        title={q ? `Search: ${q} — Mindfulness Exercises` : "Search Mindfulness Exercises"}
        description={`Search ${q ? `for "${q}" across ` : ""}1,500+ mindfulness exercises, articles, scripts, and resources from Mindfulness Exercises.`}
        canonical="https://mindfulnessexercises.com/search"
        noindex
        type="website"
      />
      <Navbar />

      <main>
        {/* Search header */}
        <section className="border-b border-border bg-[hsl(var(--section-alternate))]">
          <div className="container mx-auto py-12 lg:py-14">
            <p className="text-eyebrow text-muted-foreground mb-3">Site search</p>
            <h1 className="text-section-heading text-foreground max-w-3xl">
              {q ? <>Results for <span className="text-primary">"{q}"</span></> : "Search Mindfulness Exercises"}
            </h1>
            {q && !isLoading && (
              <p className="text-body text-muted-foreground mt-3">
                {grandTotal.toLocaleString()} {grandTotal === 1 ? "result" : "results"}
                {showPosts && showPages && grandTotal > 0 && (
                  <> · {postsTotal.toLocaleString()} {postsTotal === 1 ? "article" : "articles"} · {pagesTotal.toLocaleString()} {pagesTotal === 1 ? "page" : "pages"}</>
                )}
              </p>
            )}

            <div className="mt-6 max-w-2xl">
              <SiteSearchBar initialValue={q} size="lg" />
            </div>

            {/* Type filter */}
            {q && (
              <div className="mt-5 flex flex-wrap gap-2">
                {([
                  { id: "all", label: "All results" },
                  { id: "posts", label: `Articles${postsTotal ? ` (${postsTotal.toLocaleString()})` : ""}` },
                  { id: "pages", label: `Pages${pagesTotal ? ` (${pagesTotal.toLocaleString()})` : ""}` },
                ] as { id: ContentType; label: string }[]).map((t) => (
                  <button
                    key={t.id}
                    onClick={() => updateParam("type", t.id === "all" ? undefined : t.id)}
                    className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                      type === t.id ? "bg-primary text-primary-foreground border-primary" : "bg-card text-muted-foreground border-border hover:text-foreground"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            )}

            {/* Category filter — only relevant for posts */}
            {q && (type === "all" || type === "posts") && catsQuery.data && (
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  onClick={() => updateParam("cat", undefined)}
                  className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                    !category ? "bg-card text-muted-foreground border-border hover:text-foreground" : "bg-card text-muted-foreground border-border hover:text-foreground"
                  } ${!category ? "ring-1 ring-primary/30" : ""}`}
                >
                  All categories
                </button>
                {catsQuery.data.items
                  .filter((c) => c.count > 0 && c.slug !== "uncategorized")
                  .slice(0, 16)
                  .map((c) => (
                    <button
                      key={c.id}
                      onClick={() => updateParam("cat", String(c.id))}
                      className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                        category === c.id ? "bg-primary text-primary-foreground border-primary" : "bg-card text-muted-foreground border-border hover:text-foreground"
                      }`}
                    >
                      {c.name} <span className="opacity-60 ml-1">({c.count})</span>
                    </button>
                  ))}
              </div>
            )}
          </div>
        </section>

        {/* Results */}
        <section className="container mx-auto py-12 lg:py-14">
          {!q && (
            <p className="text-center text-muted-foreground py-12">Enter a search term above to get started.</p>
          )}

          {q && isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-[16/10] w-full rounded-lg" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          )}

          {q && !isLoading && grandTotal === 0 && (
            <div className="text-center py-16 max-w-md mx-auto">
              <p className="text-card-heading text-foreground mb-2">No results found</p>
              <p className="text-body text-muted-foreground mb-6">
                Try a different keyword or browse our full library of articles and resources.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Button asChild variant="outline">
                  <Link to="/blog">Browse all articles</Link>
                </Button>
                <Button asChild>
                  <a href="https://certify.mindfulnessexercises.com/" target="_blank" rel="noopener">
                    Get Certified <ArrowRight className="h-4 w-4 ml-1" />
                  </a>
                </Button>
              </div>
            </div>
          )}

          {/* Pages section */}
          {q && showPages && pages.length > 0 && (
            <div className={showPosts ? "mb-14" : ""}>
              {showPosts && (
                <div className="flex items-center gap-2 mb-5">
                  <BookOpen className="h-4 w-4 text-primary" aria-hidden />
                  <h2 className="text-card-heading text-foreground">Pages ({pagesTotal.toLocaleString()})</h2>
                </div>
              )}
              <ul className="divide-y divide-border border-y border-border">
                {pages.map((page) => {
                  const desc = stripHtml(page.excerpt.rendered).slice(0, 200);
                  return (
                    <li key={page.id}>
                      <Link
                        to={`/${page.slug}`}
                        className="flex items-start gap-4 py-5 hover:bg-accent/40 transition-colors px-2 -mx-2 rounded-md group"
                      >
                        <FileText className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" aria-hidden />
                        <div className="flex-1 min-w-0">
                          <p className="text-card-heading text-foreground group-hover:text-primary transition-colors" dangerouslySetInnerHTML={{ __html: page.title.rendered }} />
                          {desc && <p className="text-body-sm text-muted-foreground mt-1 line-clamp-2">{desc}</p>}
                          <p className="text-caption text-muted-foreground mt-1.5">/{page.slug}</p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0 mt-1" aria-hidden />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* Posts section */}
          {q && showPosts && allPosts.length > 0 && (
            <div>
              {showPages && (
                <div className="flex items-center gap-2 mb-5">
                  <BookOpen className="h-4 w-4 text-primary" aria-hidden />
                  <h2 className="text-card-heading text-foreground">Articles ({postsTotal.toLocaleString()})</h2>
                </div>
              )}
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
                        <h3 className="text-card-heading text-foreground mb-2">
                          <Link to={`/${post.slug}`} className="hover:text-primary transition-colors" dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
                        </h3>
                        <p className="text-body-sm text-muted-foreground line-clamp-3">{stripHtml(post.excerpt.rendered)}</p>
                      </div>
                    </article>
                  );
                })}
              </div>

              <div className="mt-10 flex flex-col items-center gap-3">
                <p className="text-body-sm text-muted-foreground">
                  Showing {allPosts.length.toLocaleString()} of {postsTotal.toLocaleString()} articles
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
                    ) : "Load more articles"}
                  </Button>
                )}
              </div>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
