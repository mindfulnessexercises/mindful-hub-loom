import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Search, ArrowRight, Loader2, FileText, BookOpen, X } from "lucide-react";
import { Navbar } from "@/components/homepage/Navbar";
import { Footer } from "@/components/homepage/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { LoadMoreSection, PostCardSkeletonGrid, PageRowSkeletonList } from "@/components/wp/LoadMoreSection";
import { ClientFilterBar, useClientPostFilter } from "@/components/wp/ClientFilterBar";
import { BrowseByCategory } from "@/components/homepage/BrowseByCategory";
import { MobileLibraryFilters } from "@/components/wp/MobileLibraryFilters";
import { LibrarySortSelect, sortToWpParams, type LibrarySort } from "@/components/wp/LibrarySortSelect";
import { SparseCategoryHelper } from "@/components/wp/SparseCategoryHelper";
import { ActiveFilterBanner } from "@/components/wp/ActiveFilterBanner";
import { FeaturedFromOtherCategories } from "@/components/wp/FeaturedFromOtherCategories";
import { CategoriesAvailableSummary } from "@/components/wp/CategoriesAvailableSummary";
import { CategoryExploration } from "@/components/wp/CategoryExploration";
import { MoreLikeThis } from "@/components/wp/MoreLikeThis";
import { trackCtaClick } from "@/lib/analytics";
import { recordRecentCategory } from "@/lib/recent-categories";
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
import { getPostInlineCTA, getPageInlineCTA } from "@/lib/library-cta";
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
  // Sort is shareable: persisted as ?sort=... so deep links re-create the
  // same ordering. Defaults to "newest" (matches WP REST default of date desc).
  const sortParam = (params.get("sort") ?? "newest") as LibrarySort;
  const validSorts: LibrarySort[] = ["newest", "oldest", "relevance", "popular", "title"];
  const sort: LibrarySort = validSorts.includes(sortParam) ? sortParam : "newest";
  const [searchInput, setSearchInput] = useState(search);

  useEffect(() => { setSearchInput(search); }, [search]);

  // Translate the URL `sort` to WP REST orderby/order. "popular" only applies
  // to posts (comment_count); pages fall back to date desc for it.
  const postsSortParams = sortToWpParams(sort, !!search);
  const pagesSort: LibrarySort = sort === "popular" ? "newest" : sort;
  const pagesSortParams = sortToWpParams(pagesSort, !!search);

  // ----- Posts (infinite) -----
  const postsQuery = useInfiniteQuery<PaginatedResult<WPPost>>({
    queryKey: [...wpKeys.postsList({ scope: "library", search, category, perPage: PER_PAGE }), { sort }],
    queryFn: ({ pageParam = 1 }) =>
      wp.posts({
        page: pageParam as number,
        per_page: PER_PAGE,
        search: search || undefined,
        categories: category,
        orderby: postsSortParams.orderby,
        order: postsSortParams.order,
      }),
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
    queryKey: ["wp", "pages", "list-infinite", { q: search, pp: PER_PAGE, scope: "library", sort: pagesSort }],
    queryFn: ({ pageParam = 1 }) =>
      wp.pages({
        page: pageParam as number,
        per_page: PER_PAGE,
        search: search || undefined,
        orderby: pagesSortParams.orderby as "date" | "title" | "relevance",
        order: pagesSortParams.order,
      }),
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

  // Record the active category as a "recent visit" so MoreLikeThis can use
  // the user's browsing trail this session as an additional intent signal.
  useEffect(() => {
    if (!category || !catsQuery.data) return;
    const cat = catsQuery.data.items.find((c) => c.id === category);
    if (!cat) return;
    recordRecentCategory({ id: cat.id, slug: cat.slug, name: cat.name });
  }, [category, catsQuery.data]);


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

  const onSortChange = (next: LibrarySort) => {
    // Default = "newest" → drop param to keep URLs clean & canonical.
    updateParam("sort", next === "newest" ? undefined : next);
  };

  // Commit mobile-sheet filter changes back to the URL in a single transition
  // so the resulting view stays shareable (search + tab + cat + sort all in the URL).
  const onMobileFiltersApply = ({
    tab: nextTab,
    search: nextSearch,
    category: nextCategory,
    sort: nextSort,
  }: { tab: "posts" | "pages"; search: string; category?: number; sort: LibrarySort }) => {
    const next = new URLSearchParams(params);
    if (nextTab === "pages") next.set("tab", "pages"); else next.delete("tab");
    if (nextSearch) next.set("q", nextSearch); else next.delete("q");
    if (nextTab === "posts" && nextCategory !== undefined) {
      next.set("cat", String(nextCategory));
    } else {
      next.delete("cat");
    }
    if (nextSort && nextSort !== "newest") next.set("sort", nextSort); else next.delete("sort");
    next.delete("page");
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

            {/* Desktop search — on mobile users open the bottom-sheet (below) */}
            <form onSubmit={onSearch} className="mt-8 hidden sm:flex flex-row gap-3 max-w-2xl">
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
          <BrowseByCategory
            embedded
            limit={8}
            eyebrow="Jump to a topic"
            title="Browse by category"
          />

          {/* Transparent inventory of every available category with counts —
              collapsible to keep the page compact, with one-click filtering. */}
          {catsQuery.data && (
            <CategoriesAvailableSummary
              categories={catsQuery.data.items.filter(
                (c) => c.count > 0 && c.slug !== "uncategorized",
              )}
              activeCategoryId={category}
              totalPages={pagesTotal || undefined}
            />
          )}
          {/* Mobile sticky filter bar — opens a bottom-sheet that batches tab/search/category
              edits before committing to the URL. Hidden on >=sm where the inline UI fits. */}
          <div className="sm:hidden sticky top-16 z-30 -mx-4 px-4 py-3 bg-background/95 backdrop-blur-sm border-b border-border mb-6">
            <MobileLibraryFilters
              tab={tab}
              search={search}
              category={category}
              sort={sort}
              categories={(catsQuery.data?.items ?? []).filter((c) => c.count > 0 && c.slug !== "uncategorized")}
              onApply={onMobileFiltersApply}
            />
          </div>

          <Tabs value={tab} onValueChange={onTabChange}>
            {/* Desktop tabs row + sort. On mobile the bottom-sheet owns both. */}
            <div className="mb-8 hidden sm:flex sm:items-center sm:justify-between sm:gap-4">
              <TabsList className="h-auto p-1">
                <TabsTrigger value="posts" className="gap-2 px-4 py-2 min-h-[44px]">
                  <FileText className="h-4 w-4" aria-hidden />
                  Articles {postsTotal > 0 && <span className="opacity-60 text-xs">({postsTotal.toLocaleString()})</span>}
                </TabsTrigger>
                <TabsTrigger value="pages" className="gap-2 px-4 py-2 min-h-[44px]">
                  <BookOpen className="h-4 w-4" aria-hidden />
                  Pages {pagesTotal > 0 && <span className="opacity-60 text-xs">({pagesTotal.toLocaleString()})</span>}
                </TabsTrigger>
              </TabsList>
              <LibrarySortSelect
                value={sort}
                onChange={onSortChange}
                hasSearch={!!search}
                includePopular={tab === "posts"}
              />
            </div>

            {/* ---- POSTS TAB ---- */}
            <TabsContent value="posts" className="mt-0">
              {/* Category filter — single horizontally-scrollable row */}
              {catsQuery.data && (() => {
                const visibleCats = catsQuery.data.items
                  .filter((c) => c.count > 0 && c.slug !== "uncategorized");
                const activeCat = category ? visibleCats.find((c) => c.id === category) : undefined;
                return (
                  <div className="mb-6 space-y-3 hidden sm:block">
                    <div
                      role="tablist"
                      aria-label="Filter articles by category"
                      className="flex flex-nowrap gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0"
                    >
                      <button
                        role="tab"
                        aria-selected={!category}
                        onClick={() => updateParam("cat", undefined)}
                        className={`shrink-0 text-xs font-medium px-3 py-2 min-h-[36px] rounded-full border transition-colors ${
                          !category
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-card text-muted-foreground border-border hover:text-foreground"
                        }`}
                      >
                        All categories
                      </button>
                      {visibleCats.map((c) => (
                        <button
                          key={c.id}
                          role="tab"
                          aria-selected={category === c.id}
                          onClick={() => updateParam("cat", String(c.id))}
                          className={`shrink-0 text-xs font-medium px-3 py-2 min-h-[36px] rounded-full border transition-colors ${
                            category === c.id
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-card text-muted-foreground border-border hover:text-foreground"
                          }`}
                        >
                          {c.name} <span className="opacity-60 ml-1">({c.count})</span>
                        </button>
                      ))}
                    </div>

                    {/* Active filter chips + clear-all */}
                    {(activeCat || search) && (
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-caption text-muted-foreground mr-1">Active:</span>
                        {search && (
                          <FilterChip
                            label={`Search: "${search}"`}
                            onRemove={() => updateParam("q", undefined)}
                          />
                        )}
                        {activeCat && (
                          <FilterChip
                            label={`Category: ${activeCat.name}`}
                            onRemove={() => updateParam("cat", undefined)}
                          />
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            const next = new URLSearchParams(params);
                            next.delete("q");
                            next.delete("cat");
                            next.delete("page");
                            setParams(next);
                          }}
                          className="ml-1 text-xs font-semibold text-primary hover:underline underline-offset-4 min-h-[36px] inline-flex items-center"
                        >
                          Clear all
                        </button>
                      </div>
                    )}
                  </div>
                );
              })()}

              {postsQuery.isLoading && <PostCardSkeletonGrid count={9} />}
              {postsQuery.isError && <EmptyState message="Could not load articles. Please try again." />}

              {/* Sparse / empty category helper — surfaces when a category filter is active
                  and yields zero or only a handful of results. Suggests related categories
                  (token overlap + popularity) and clear next actions. */}
              {!postsQuery.isLoading && !postsQuery.isError && category && catsQuery.data && (() => {
                const visibleCats = catsQuery.data.items.filter(
                  (c) => c.count > 0 && c.slug !== "uncategorized",
                );
                const activeCat = visibleCats.find((c) => c.id === category);
                if (!activeCat) return null;
                return (
                  <SparseCategoryHelper
                    activeCategory={activeCat}
                    allCategories={visibleCats}
                    resultCount={postsTotal}
                    search={search || undefined}
                    onClearCategory={() => updateParam("cat", undefined)}
                    onClearAll={() => {
                      const next = new URLSearchParams(params);
                      next.delete("q");
                      next.delete("cat");
                      next.delete("page");
                      setParams(next);
                    }}
                    onSelectCategory={(id) => updateParam("cat", String(id))}
                  />
                );
              })()}

              {/* No-category empty state — also use the rich helper so users get
                  category tiles + intent topics instead of a dead-end message. */}
              {!postsQuery.isLoading && !postsQuery.isError && allPosts.length === 0 && !category && catsQuery.data && (
                <SparseCategoryHelper
                  allCategories={catsQuery.data.items.filter(
                    (c) => c.count > 0 && c.slug !== "uncategorized",
                  )}
                  resultCount={0}
                  search={search || undefined}
                  onClearCategory={() => updateParam("cat", undefined)}
                  onClearAll={() => {
                    const next = new URLSearchParams(params);
                    next.delete("q");
                    next.delete("cat");
                    next.delete("page");
                    setParams(next);
                  }}
                  onSelectCategory={(id) => updateParam("cat", String(id))}
                />
              )}

              {allPosts.length > 0 && (
                <>
                  <div className="mb-6 lg:mb-8">
                    <ClientFilterBar
                      query={postsFilter}
                      onChange={setPostsFilter}
                      loadedCount={allPosts.length}
                      filteredCount={visiblePosts.length}
                      noun="articles"
                    />
                  </div>
                  {postsFilter && visiblePosts.length === 0 ? (
                    <p className="text-center text-muted-foreground py-12">
                      No loaded articles match "{postsFilter}". Try Load more, or clear the filter.
                    </p>
                  ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {visiblePosts.map((post) => {
                      const img = getFeaturedImage(post);
                      const cats = getCategories(post);
                      // Contextual inline CTA derived from the post's category — e.g. a
                      // "Meditation Scripts" post gets "Get the free script" instead of
                      // the generic "Read article". Keeps the link target on the post
                      // unless the rule supplies an in-app `href`.
                      const cta = getPostInlineCTA(post);
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
                            <div className="mt-4 flex items-center justify-between gap-3 pt-4 border-t border-border/60">
                              <Link
                                to={cta.href ?? `/${post.slug}`}
                                onClick={() =>
                                  trackCtaClick({
                                    cta_label: cta.label,
                                    cta_destination: cta.href ?? `/${post.slug}`,
                                    cta_location: "library_post_card",
                                    post_id: post.id,
                                    category_id: cta.matchedCategory?.id ?? cats[0]?.id,
                                    category_slug: cta.matchedCategory?.slug ?? cats[0]?.slug,
                                    matched: cta.matched,
                                    match_source: cta.matchSource,
                                  })
                                }
                                className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2 transition-all min-h-[36px]"
                              >
                                {cta.label} <ArrowRight className="h-3.5 w-3.5" />
                              </Link>
                              {cta.href && (
                                <Link
                                  to={`/${post.slug}`}
                                  onClick={() =>
                                    trackCtaClick({
                                      cta_label: "Read article",
                                      cta_destination: `/${post.slug}`,
                                      cta_location: "library_post_card_secondary",
                                      post_id: post.id,
                                      category_id: cats[0]?.id,
                                      category_slug: cats[0]?.slug,
                                      matched: false,
                                    })
                                  }
                                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                                  aria-label={`Read article: ${stripHtml(post.title.rendered)}`}
                                >
                                  Read article
                                </Link>
                              )}
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                  )}

                  <LoadMoreSection
                    loaded={allPosts.length}
                    total={postsTotal}
                    hasNext={!!postsQuery.hasNextPage}
                    isFetching={postsQuery.isFetchingNextPage}
                    onClick={postsPagination.loadMore}
                    label="articles"
                    pendingSkeleton={<PostCardSkeletonGrid count={6} />}
                  />

                  {/* When the user has narrowed to a single category, surface a
                      cross-category discovery row to encourage broader browsing. */}
                  {category && catsQuery.data && (
                    <FeaturedFromOtherCategories
                      activeCategoryId={category}
                      allCategories={catsQuery.data.items.filter(
                        (c) => c.count > 0 && c.slug !== "uncategorized",
                      )}
                      onClearCategory={() => updateParam("cat", undefined)}
                    />
                  )}

                  {/* Similarity-driven recommendations — only when a category
                      is active. Mixes posts from related categories with related pages. */}
                  {category && catsQuery.data && (() => {
                    const visibleCats = catsQuery.data.items.filter(
                      (c) => c.count > 0 && c.slug !== "uncategorized",
                    );
                    const activeCat = visibleCats.find((c) => c.id === category);
                    if (!activeCat) return null;
                    return (
                      <MoreLikeThis
                        activeCategory={activeCat}
                        allCategories={visibleCats}
                        search={search || undefined}
                      />
                    );
                  })()}

                  {/* Wide-net category exploration — appears on every posts view
                      (filtered or not) to keep discovery surfaces consistent.
                      Lazy-expands and previews recent posts per topic. */}
                  {catsQuery.data && (
                    <CategoryExploration
                      categories={catsQuery.data.items.filter(
                        (c) => c.count > 0 && c.slug !== "uncategorized",
                      )}
                      excludeCategoryId={category}
                    />
                  )}
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
                    {allPages.map((p) => {
                      // Pages get a slug/title-based CTA (no categories on pages).
                      const cta = getPageInlineCTA(p);
                      return (
                        <li key={p.id}>
                          <div className="group flex items-start gap-4 p-5 rounded-lg border border-border bg-card hover:border-primary/30 hover:shadow-[var(--shadow-card-hover)] transition-all">
                            <Link
                              to={`/${p.slug}`}
                              className="shrink-0 mt-1 h-9 w-9 rounded-md bg-accent text-accent-foreground inline-flex items-center justify-center"
                              aria-hidden
                              tabIndex={-1}
                            >
                              <BookOpen className="h-4 w-4" />
                            </Link>
                            <div className="flex-1 min-w-0">
                              <h2 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                                <Link
                                  to={`/${p.slug}`}
                                  className="hover:text-primary transition-colors"
                                  dangerouslySetInnerHTML={{ __html: p.title.rendered }}
                                />
                              </h2>
                              {p.excerpt?.rendered && (
                                <p className="mt-1 text-body-sm text-muted-foreground line-clamp-2">
                                  {stripHtml(p.excerpt.rendered)}
                                </p>
                              )}
                              <div className="mt-3 flex items-center gap-3 flex-wrap">
                                <Link
                                  to={cta.href ?? `/${p.slug}`}
                                  onClick={() =>
                                    trackCtaClick({
                                      cta_label: cta.label,
                                      cta_destination: cta.href ?? `/${p.slug}`,
                                      cta_location: "library_page_card",
                                      page_id: p.id,
                                      matched: cta.matched,
                                      match_source: cta.matchSource,
                                    })
                                  }
                                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:gap-2 transition-all min-h-[36px]"
                                >
                                  {cta.label} <ArrowRight className="h-3 w-3" />
                                </Link>
                                {cta.href && (
                                  <Link
                                    to={`/${p.slug}`}
                                    onClick={() =>
                                      trackCtaClick({
                                        cta_label: "View page",
                                        cta_destination: `/${p.slug}`,
                                        cta_location: "library_page_card_secondary",
                                        page_id: p.id,
                                        matched: false,
                                      })
                                    }
                                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                                  >
                                    View page
                                  </Link>
                                )}
                              </div>
                            </div>
                          </div>
                        </li>
                      );
                    })}
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

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 pl-3 pr-1.5 py-1 rounded-full bg-accent text-accent-foreground border border-border text-xs font-medium">
      {label}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove filter ${label}`}
        className="inline-flex items-center justify-center h-6 w-6 rounded-full hover:bg-background/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}
