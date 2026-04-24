import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Search, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/homepage/Navbar";
import { Footer } from "@/components/homepage/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { wp, getFeaturedImage, getCategories, stripHtml, formatDate, type WPPost, type PaginatedResult } from "@/lib/wp";
import { wpKeys, WP_STALE } from "@/lib/wp-cache";
import { WPSeo } from "@/components/wp/WPSeo";
import { buildPaginatedSeo } from "@/lib/seo-pagination";
import { LoadMoreSection, PostCardSkeletonGrid } from "@/components/wp/LoadMoreSection";
import { ClientFilterBar, useClientPostFilter } from "@/components/wp/ClientFilterBar";

const PER_PAGE = 100; // WordPress REST API maximum

export default function Blog() {
  const [params, setParams] = useSearchParams();
  const search = params.get("q") ?? "";
  const categoryParam = params.get("cat");
  const category = categoryParam ? Number(categoryParam) : undefined;
  // ?page=N controls how many "Load more" pages have been loaded — makes the
  // current scroll position shareable and survives back/forward navigation.
  const pageParam = Math.max(1, Number(params.get("page") ?? "1"));
  const [searchInput, setSearchInput] = useState(search);

  // Keep the input synced when the URL changes (back/forward, shared links).
  useEffect(() => { setSearchInput(search); }, [search]);

  const postsQuery = useInfiniteQuery<PaginatedResult<WPPost>>({
    queryKey: wpKeys.postsList({ scope: "blog", search, category, perPage: PER_PAGE }),
    queryFn: ({ pageParam = 1 }) =>
      wp.posts({ page: pageParam as number, per_page: PER_PAGE, search: search || undefined, categories: category }),
    getNextPageParam: (lastPage, all) => {
      const next = all.length + 1;
      return next <= lastPage.totalPages ? next : undefined;
    },
    initialPageParam: 1,
    staleTime: WP_STALE.list,
    gcTime: WP_STALE.gc,
  });

  // Auto-fetch additional pages until we reach ?page=N (e.g. on a shared link).
  useEffect(() => {
    const loaded = postsQuery.data?.pages.length ?? 0;
    if (
      loaded > 0 &&
      loaded < pageParam &&
      postsQuery.hasNextPage &&
      !postsQuery.isFetchingNextPage
    ) {
      postsQuery.fetchNextPage();
    }
  }, [pageParam, postsQuery.data, postsQuery.hasNextPage, postsQuery.isFetchingNextPage]);

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

  const loadMore = () => {
    postsQuery.fetchNextPage();
    // Persist the new page count to the URL so the state is shareable.
    updateParam("page", String((postsQuery.data?.pages.length ?? 0) + 1), { resetPage: false });
  };

  const allPosts = postsQuery.data?.pages.flatMap((p) => p.items) ?? [];
  const total = postsQuery.data?.pages[0]?.total ?? 0;
  const totalPages = postsQuery.data?.pages[0]?.totalPages ?? 1;
  const { query: filterQuery, setQuery: setFilterQuery, filtered: visiblePosts } = useClientPostFilter(allPosts);

  // SEO: canonical reflects current filters + page so each variant self-refs.
  // Filtered views (search query or category) should NOT be indexed — they're
  // user-driven permutations that would dilute the canonical /blog page.
  const isFiltered = !!search || !!category;
  const { canonical, prevUrl, nextUrl } = buildPaginatedSeo({
    path: "/blog",
    page: pageParam,
    totalPages,
    filters: { q: search || undefined, cat: category },
  });

  return (
    <div className="min-h-screen bg-background">
      <WPSeo
        title={
          search
            ? `Search "${search}" — Blog · Mindfulness Exercises`
            : pageParam > 1
              ? `Blog — Page ${pageParam} · Mindfulness Exercises`
              : "Mindfulness Exercises Blog — Practices, Research & Teaching Insights"
        }
        description="Browse 1,500+ articles on mindfulness exercises, meditation scripts, MBSR techniques, and teaching practice from Mindfulness Exercises."
        canonical={canonical}
        prevUrl={prevUrl}
        nextUrl={nextUrl}
        noindex={isFiltered}
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
                  All articles
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
          </div>
        </section>

        {/* Grid */}
        <section className="container mx-auto py-12 lg:py-16">
          {postsQuery.isLoading && <PostCardSkeletonGrid count={9} />}

          {postsQuery.isError && (
            <p className="text-center text-muted-foreground py-12">Could not load articles. Please try again.</p>
          )}

          {!postsQuery.isLoading && allPosts.length === 0 && (
            <p className="text-center text-muted-foreground py-12">No articles found.</p>
          )}

          {allPosts.length > 0 && (
            <>
              <div className="mb-6 lg:mb-8">
                <ClientFilterBar
                  query={filterQuery}
                  onChange={setFilterQuery}
                  loadedCount={allPosts.length}
                  filteredCount={visiblePosts.length}
                  noun="articles"
                />
              </div>
              {filterQuery && visiblePosts.length === 0 ? (
                <p className="text-center text-muted-foreground py-12">
                  No loaded articles match "{filterQuery}". Try Load more, or clear the filter.
                </p>
              ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {visiblePosts.map((post) => {
                  const img = getFeaturedImage(post);
                  const cats = getCategories(post);
                  return (
                    <article key={post.id} className="group flex flex-col bg-card rounded-lg overflow-hidden border border-border shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-shadow duration-300">
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
                          {cats[0] && <Badge variant="secondary" className="font-medium">{cats[0].name}</Badge>}
                          <span>{formatDate(post.date)}</span>
                        </div>
                        <h2 className="text-card-heading text-foreground mb-2">
                          <Link to={`/${post.slug}`} className="hover:text-primary transition-colors" dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
                        </h2>
                        <p className="text-body-sm text-muted-foreground line-clamp-3">
                          {stripHtml(post.excerpt.rendered)}
                        </p>
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
                total={total}
                hasNext={!!postsQuery.hasNextPage}
                isFetching={postsQuery.isFetchingNextPage}
                onClick={loadMore}
                label="articles"
                pendingSkeleton={<PostCardSkeletonGrid count={6} />}
              />
            </>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
