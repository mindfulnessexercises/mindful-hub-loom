import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Search, ArrowRight, Loader2, FileText, BookOpen } from "lucide-react";
import { Navbar } from "@/components/homepage/Navbar";
import { Footer } from "@/components/homepage/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { LoadMoreSection, PostCardSkeletonGrid, PageRowSkeletonList } from "@/components/wp/LoadMoreSection";
import { ClientFilterBar, useClientPostFilter } from "@/components/wp/ClientFilterBar";
import {
  wp,
  getFeaturedImage,
  getCategories,
  stripHtml,
  formatDate,
  type WPPost,
  type WPPage,
  type PaginatedResult,
} from "@/lib/wp";
import { wpKeys, WP_STALE } from "@/lib/wp-cache";
import { useUrlPagination } from "@/hooks/use-url-pagination";
import { WPSeo } from "@/components/wp/WPSeo";
import { buildPaginatedSeo } from "@/lib/seo-pagination";

const PER_PAGE = 100;
type Tab = "posts" | "pages";

export default function Library() {
  const [params, setParams] = useSearchParams();
  const tab = (params.get("tab") === "pages" ? "pages" : "posts") as Tab;
  const search = params.get("q") ?? "";
  const categoryParam = params.get("cat");
  const category = categoryParam ? Number(categoryParam) : undefined;
  const pageParam = Math.max(1, Number(params.get("page") ?? "1"));
  const [searchInput, setSearchInput] = useState(search);

  useEffect(() => { setSearchInput(search); }, [search]);

  // ----- Posts (infinite) -----
  const postsQuery = useInfiniteQuery<PaginatedResult<WPPost>>({
    queryKey: wpKeys.postsList({ scope: "library", search, category, perPage: PER_PAGE }),
    queryFn: ({ pageParam = 1 }) =>
      wp.posts({ page: pageParam as number, per_page: PER_PAGE, search: search || undefined, categories: category }),
    getNextPageParam: (lastPage, all) =>
      all.length + 1 <= lastPage.totalPages ? all.length + 1 : undefined,
    initialPageParam: 1,
    staleTime: WP_STALE.list,
    gcTime: WP_STALE.gc,
    enabled: tab === "posts",
  });

  const postsPagination = useUrlPagination({
    loadedPages: postsQuery.data?.pages.length ?? 0,
    hasNextPage: !!postsQuery.hasNextPage,
    isFetchingNextPage: postsQuery.isFetchingNextPage,
    fetchNextPage: postsQuery.fetchNextPage,
  });

  // ----- Pages (infinite) -----
  const pagesQuery = useInfiniteQuery<PaginatedResult<WPPage>>({
    queryKey: ["wp", "pages", "list-infinite", { q: search, pp: PER_PAGE, scope: "library" }],
    queryFn: ({ pageParam = 1 }) =>
      wp.pages({ page: pageParam as number, per_page: PER_PAGE, search: search || undefined }),
    getNextPageParam: (lastPage, all) =>
      all.length + 1 <= lastPage.totalPages ? all.length + 1 : undefined,
    initialPageParam: 1,
    staleTime: WP_STALE.list,
    gcTime: WP_STALE.gc,
    enabled: tab === "pages",
  });

  const pagesPagination = useUrlPagination({
    loadedPages: pagesQuery.data?.pages.length ?? 0,
    hasNextPage: !!pagesQuery.hasNextPage,
    isFetchingNextPage: pagesQuery.isFetchingNextPage,
    fetchNextPage: pagesQuery.fetchNextPage,
  });

  // ----- Categories (only used for posts tab) -----
  const catsQuery = useQuery({
    queryKey: wpKeys.categories(),
    queryFn: () => wp.categories(),
    staleTime: WP_STALE.taxonomy,
    gcTime: WP_STALE.gc,
  });

  const updateParam = (key: string, value?: string, opts: { resetPage?: boolean } = { resetPage: true }) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value); else next.delete(key);
    if (opts.resetPage && key !== "page") next.delete("page");
    setParams(next);
  };

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateParam("q", searchInput.trim() || undefined);
  };

  const onTabChange = (value: string) => {
    const next = new URLSearchParams(params);
    if (value === "pages") next.set("tab", "pages"); else next.delete("tab");
    next.delete("page");
    next.delete("cat"); // category only applies to posts
    setParams(next);
  };

  const allPosts = useMemo(
    () => postsQuery.data?.pages.flatMap((p) => p.items) ?? [],
    [postsQuery.data],
  );
  const postsTotal = postsQuery.data?.pages[0]?.total ?? 0;
  const { query: postsFilter, setQuery: setPostsFilter, filtered: visiblePosts } = useClientPostFilter(allPosts);

  const allPages = useMemo(
    () => pagesQuery.data?.pages.flatMap((p) => p.items) ?? [],
    [pagesQuery.data],
  );
  const pagesTotal = pagesQuery.data?.pages[0]?.total ?? 0;

  // SEO: canonical preserves the active tab + page so Google indexes each
  // distinct surface (Articles vs Pages, page 1 vs N). User-typed search
  // queries are noindexed to avoid endless filter permutations being crawled.
  const activeTotalPages =
    tab === "posts"
      ? postsQuery.data?.pages[0]?.totalPages ?? 1
      : pagesQuery.data?.pages[0]?.totalPages ?? 1;
  const { canonical, prevUrl, nextUrl } = buildPaginatedSeo({
    path: "/library",
    page: pageParam,
    totalPages: activeTotalPages,
    filters: {
      tab: tab === "pages" ? "pages" : undefined,
      cat: tab === "posts" ? category : undefined,
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <WPSeo
        title={
          search
            ? `Search "${search}" — Library · Mindfulness Exercises`
            : tab === "pages"
              ? "Resource Pages — Library · Mindfulness Exercises"
              : "Articles — Library · Mindfulness Exercises"
        }
        description="Browse the complete Mindfulness Exercises library: 1,500+ articles and dozens of resource pages including free meditations, scripts, and certification info."
        canonical={canonical}
        prevUrl={prevUrl}
        nextUrl={nextUrl}
        noindex={!!search}
        type="website"
      />
      <Navbar />

      <main>
        {/* Header */}
        <section className="border-b border-border bg-[hsl(var(--section-alternate))]">
          <div className="container mx-auto py-12 lg:py-16">
            <p className="text-eyebrow text-muted-foreground mb-3">Library · Browse Everything</p>
            <h1 className="text-section-heading text-foreground max-w-3xl">
              The full Mindfulness Exercises library
            </h1>
            <p className="text-body-lg text-muted-foreground mt-4 max-w-2xl">
              Search and filter every article and resource page in one place.
            </p>

            <form onSubmit={onSearch} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-2xl">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden />
                <Input
                  type="search"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder={tab === "posts" ? "Search articles…" : "Search pages…"}
                  aria-label={tab === "posts" ? "Search articles" : "Search pages"}
                  className="pl-9 h-11 bg-card"
                />
              </div>
              <Button type="submit" className="h-11">Search</Button>
            </form>
          </div>
        </section>

        <section className="container mx-auto py-12 lg:py-16">
          <Tabs value={tab} onValueChange={onTabChange}>
            <TabsList className="mb-8 h-auto p-1">
              <TabsTrigger value="posts" className="gap-2 px-4 py-2 min-h-[44px]">
                <FileText className="h-4 w-4" aria-hidden />
                Articles {postsTotal > 0 && <span className="opacity-60 text-xs">({postsTotal.toLocaleString()})</span>}
              </TabsTrigger>
              <TabsTrigger value="pages" className="gap-2 px-4 py-2 min-h-[44px]">
                <BookOpen className="h-4 w-4" aria-hidden />
                Pages {pagesTotal > 0 && <span className="opacity-60 text-xs">({pagesTotal.toLocaleString()})</span>}
              </TabsTrigger>
            </TabsList>

            {/* ---- POSTS TAB ---- */}
            <TabsContent value="posts" className="mt-0">
              {/* Category filter */}
              {catsQuery.data && (
                <div className="mb-8 flex flex-wrap gap-2">
                  <button
                    onClick={() => updateParam("cat", undefined)}
                    className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                      !category ? "bg-primary text-primary-foreground border-primary" : "bg-card text-muted-foreground border-border hover:text-foreground"
                    }`}
                  >
                    All categories
                  </button>
                  {catsQuery.data.items
                    .filter((c) => c.count > 0 && c.slug !== "uncategorized")
                    .slice(0, 20)
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

              {postsQuery.isLoading && <PostCardSkeletonGrid count={9} />}
              {postsQuery.isError && <EmptyState message="Could not load articles. Please try again." />}
              {!postsQuery.isLoading && allPosts.length === 0 && (
                <EmptyState message="No articles match your filters." />
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
                            <Link to={`/${post.slug}`} className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2 transition-all">
                              Read article <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                          </div>
                        </article>
                      );
                    })}
                  </div>

                  <LoadMoreSection
                    loaded={allPosts.length}
                    total={postsTotal}
                    hasNext={!!postsQuery.hasNextPage}
                    isFetching={postsQuery.isFetchingNextPage}
                    onClick={postsPagination.loadMore}
                    label="articles"
                    pendingSkeleton={<PostCardSkeletonGrid count={6} />}
                  />
                </>
              )}
            </TabsContent>

            {/* ---- PAGES TAB ---- */}
            <TabsContent value="pages" className="mt-0">
              {pagesQuery.isLoading && <PageRowSkeletonList count={8} />}
              {pagesQuery.isError && <EmptyState message="Could not load pages. Please try again." />}
              {!pagesQuery.isLoading && allPages.length === 0 && (
                <EmptyState message="No pages match your search." />
              )}

              {allPages.length > 0 && (
                <>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {allPages.map((p) => (
                      <li key={p.id}>
                        <Link
                          to={`/${p.slug}`}
                          className="group flex items-start gap-4 p-5 rounded-lg border border-border bg-card hover:border-primary/30 hover:shadow-[var(--shadow-card-hover)] transition-all min-h-[44px]"
                        >
                          <div className="shrink-0 mt-1 h-9 w-9 rounded-md bg-accent text-accent-foreground inline-flex items-center justify-center">
                            <BookOpen className="h-4 w-4" aria-hidden />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h2
                              className="text-base font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2"
                              dangerouslySetInnerHTML={{ __html: p.title.rendered }}
                            />
                            {p.excerpt?.rendered && (
                              <p className="mt-1 text-body-sm text-muted-foreground line-clamp-2">
                                {stripHtml(p.excerpt.rendered)}
                              </p>
                            )}
                            <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-primary">
                              View page <ArrowRight className="h-3 w-3" />
                            </span>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>

                  <LoadMoreSection
                    loaded={allPages.length}
                    total={pagesTotal}
                    hasNext={!!pagesQuery.hasNextPage}
                    isFetching={pagesQuery.isFetchingNextPage}
                    onClick={pagesPagination.loadMore}
                    label="pages"
                    pendingSkeleton={<PageRowSkeletonList count={4} />}
                  />
                </>
              )}
            </TabsContent>
          </Tabs>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return <p className="text-center text-muted-foreground py-12">{message}</p>;
}
