import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useInfiniteQuery } from "@tanstack/react-query";
import { ArrowRight, Search, X } from "lucide-react";
import {
  wp,
  getFeaturedImage,
  stripHtml,
  formatDate,
  type WPPost,
  type PaginatedResult,
} from "@/lib/wp";
import { wpKeys, WP_STALE } from "@/lib/wp-cache";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LoadMoreSection, PostCardSkeletonGrid } from "@/components/wp/LoadMoreSection";
import { trackEvent } from "@/lib/analytics";

/**
 * Full searchable + theme-filterable index of every meditation-script post in
 * the `meditation-scripts` WP category (id=9421, ~231 posts). Mirrors the
 * card layout of /category/meditation-scripts (featured image, date, badge,
 * excerpt) but adds in-page theme chips and search so visitors on the
 * /free-guided-meditation-scripts hub can actually find an individual script.
 *
 * Loads via infinite query in 100-post pages (3 pages cover the full set),
 * with client-side filtering on already-loaded posts. Theme chips are
 * derived from each title with a simple keyword map — no per-post tagging.
 */

const CATEGORY_ID = 9421; // meditation-scripts
const PER_PAGE = 100;

interface ThemeDef {
  key: string;
  label: string;
  match: RegExp;
}

const THEMES: ThemeDef[] = [
  { key: "anxiety", label: "Anxiety", match: /anxi|worry|panic|fear|nervous/i },
  { key: "stress", label: "Stress", match: /stress|overwhelm|burnout|tension/i },
  { key: "sleep", label: "Sleep", match: /sleep|insomnia|bedtime|night|drift|rest/i },
  { key: "breath", label: "Breath", match: /breath|breathing|inhale|exhale|pranayama/i },
  { key: "body", label: "Body Scan", match: /body scan|body[- ]?awareness|somatic|sensation/i },
  { key: "kids", label: "Kids & Teens", match: /kid|child|teen|youth|young/i },
  { key: "compassion", label: "Compassion", match: /compassion|loving[- ]?kindness|metta|kindness/i },
  { key: "gratitude", label: "Gratitude", match: /gratitude|grateful|thank/i },
  { key: "self", label: "Self-Love", match: /self[- ]?love|self[- ]?compassion|self[- ]?worth|self[- ]?esteem|inner/i },
  { key: "nature", label: "Nature", match: /nature|forest|ocean|tree|mountain|garden|earth|element/i },
  { key: "walking", label: "Walking", match: /walk/i },
  { key: "visualization", label: "Visualization", match: /visuali[sz]|imag(?:ery|ine)|picture/i },
  { key: "morning", label: "Morning", match: /morning|wake|start the day/i },
  { key: "short", label: "Short (≤10 min)", match: /\b(?:1|2|3|5|10)[- ]?minute\b|short|quick/i },
  { key: "groups", label: "Groups", match: /group|workshop|class|team|workplace|corporate/i },
  { key: "grief", label: "Grief & Loss", match: /grief|loss|mourn/i },
  { key: "pain", label: "Pain", match: /pain|chronic|illness/i },
];

function deriveThemes(text: string): string[] {
  const out: string[] = [];
  for (const t of THEMES) if (t.match.test(text)) out.push(t.key);
  return out;
}

export function ScriptsBrowser() {
  const postsQuery = useInfiniteQuery<PaginatedResult<WPPost>>({
    queryKey: wpKeys.postsList({
      scope: "scripts-hub",
      category: CATEGORY_ID,
      perPage: PER_PAGE,
    }),
    queryFn: ({ pageParam = 1 }) =>
      wp.posts({
        page: pageParam as number,
        per_page: PER_PAGE,
        categories: CATEGORY_ID,
        orderby: "title",
        order: "asc",
      }),
    getNextPageParam: (lastPage, all) => {
      const next = all.length + 1;
      return next <= lastPage.totalPages ? next : undefined;
    },
    initialPageParam: 1,
    staleTime: WP_STALE.list,
    gcTime: WP_STALE.gc,
  });

  const allPosts = postsQuery.data?.pages.flatMap((p) => p.items) ?? [];
  const total = postsQuery.data?.pages[0]?.total ?? 231;

  const [search, setSearch] = useState("");
  const [activeTheme, setActiveTheme] = useState<string | null>(null);

  // Pre-compute themes per post once, memoized.
  const enriched = useMemo(
    () =>
      allPosts.map((p) => {
        const title = stripHtml(p.title.rendered);
        const excerpt = stripHtml(p.excerpt.rendered).replace(/\s+/g, " ").trim();
        return {
          post: p,
          title,
          excerpt,
          themes: deriveThemes(`${title} ${excerpt}`),
        };
      }),
    [allPosts],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return enriched.filter((e) => {
      if (activeTheme && !e.themes.includes(activeTheme)) return false;
      if (q && !(e.title.toLowerCase().includes(q) || e.excerpt.toLowerCase().includes(q))) return false;
      return true;
    });
  }, [enriched, search, activeTheme]);

  // Only show theme chips that match ≥3 already-loaded scripts.
  const availableThemes = useMemo(() => {
    const counts = new Map<string, number>();
    for (const e of enriched) for (const k of e.themes) counts.set(k, (counts.get(k) ?? 0) + 1);
    return THEMES.filter((t) => (counts.get(t.key) ?? 0) >= 3);
  }, [enriched]);

  return (
    <section aria-labelledby="scripts-browser" className="not-prose space-y-6">
      <div className="flex flex-col gap-2">
        <h2 id="scripts-browser" className="text-card-heading font-serif text-foreground">
          Browse all guided meditation scripts
        </h2>
        <p className="text-body-sm text-muted-foreground max-w-2xl">
          Search the full library of {total.toLocaleString()} free scripts, or filter by theme.
          Every script opens as a clean, printable page.
        </p>
      </div>

      {/* Search + filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search scripts (e.g. anxiety, sleep, gratitude)…"
            aria-label="Search scripts"
            className="w-full min-h-[44px] rounded-lg border border-border bg-card pl-10 pr-10 py-2.5 text-body text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveTheme(null)}
            className={`min-h-[36px] rounded-full border px-3 py-1.5 text-body-sm transition-colors ${
              activeTheme === null
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-foreground hover:border-primary/40"
            }`}
          >
            All themes
          </button>
          {availableThemes.map((t) => {
            const active = activeTheme === t.key;
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => {
                  setActiveTheme(active ? null : t.key);
                  if (!active) trackEvent("scripts_browser_filter", { theme: t.key });
                }}
                className={`min-h-[36px] rounded-full border px-3 py-1.5 text-body-sm transition-colors ${
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-foreground hover:border-primary/40"
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Loading first page */}
      {postsQuery.isLoading && <PostCardSkeletonGrid count={9} />}

      {postsQuery.isError && (
        <p className="text-body-sm text-muted-foreground">
          We couldn't load the script index right now. Please refresh in a moment.
        </p>
      )}

      {allPosts.length > 0 && (
        <>
          <p className="text-caption text-muted-foreground" aria-live="polite">
            Showing {filtered.length.toLocaleString()} of {allPosts.length.toLocaleString()} loaded
            {activeTheme ? ` · ${THEMES.find((t) => t.key === activeTheme)?.label}` : ""}
            {search ? ` · matching "${search}"` : ""}
          </p>

          {filtered.length === 0 ? (
            <div className="text-center py-10 space-y-3">
              <p className="text-body text-foreground/80">
                No loaded scripts match those filters.
              </p>
              {postsQuery.hasNextPage && (
                <Button
                  variant="outline"
                  onClick={() => postsQuery.fetchNextPage()}
                  disabled={postsQuery.isFetchingNextPage}
                  className="min-h-[44px]"
                >
                  Load more scripts to search
                </Button>
              )}
              {!postsQuery.hasNextPage && (
                <Button variant="ghost" onClick={() => { setSearch(""); setActiveTheme(null); }}>
                  Clear filters
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {filtered.map(({ post, title, excerpt }) => {
                const img = getFeaturedImage(post);
                return (
                  <article
                    key={post.id}
                    className="group flex flex-col bg-card rounded-lg overflow-hidden border border-border shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-shadow duration-300"
                  >
                    <Link
                      to={`/${post.slug}`}
                      onClick={() => trackEvent("scripts_browser_open", { slug: post.slug })}
                      className="block aspect-[16/10] bg-muted overflow-hidden"
                    >
                      {img ? (
                        <img
                          src={img.url}
                          alt={img.alt || title}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-[hsl(var(--accent))]" />
                      )}
                    </Link>
                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-center gap-2 text-caption text-muted-foreground mb-2">
                        <Badge variant="secondary" className="font-medium">Script</Badge>
                        <span>{formatDate(post.date)}</span>
                      </div>
                      <h3 className="text-card-heading text-foreground mb-2">
                        <Link
                          to={`/${post.slug}`}
                          onClick={() => trackEvent("scripts_browser_open", { slug: post.slug })}
                          className="hover:text-primary transition-colors"
                        >
                          {title}
                        </Link>
                      </h3>
                      {excerpt && (
                        <p className="text-body-sm text-muted-foreground line-clamp-3 flex-1">
                          {excerpt}
                        </p>
                      )}
                      <span className="mt-4 inline-flex items-center gap-1 text-body-sm text-primary font-medium">
                        Read script
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          <LoadMoreSection
            loaded={allPosts.length}
            total={total}
            hasNext={!!postsQuery.hasNextPage}
            isFetching={postsQuery.isFetchingNextPage}
            onClick={() => postsQuery.fetchNextPage()}
            label="scripts"
            pendingSkeleton={<PostCardSkeletonGrid count={6} />}
          />
        </>
      )}
    </section>
  );
}
