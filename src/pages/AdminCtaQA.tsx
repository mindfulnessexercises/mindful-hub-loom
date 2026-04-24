import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { ArrowLeft, RefreshCcw, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  wp,
  getCategories,
  stripHtml,
  type WPPost,
  type WPPage,
  type PaginatedResult,
} from "@/lib/wp";
import { wpKeys, WP_STALE } from "@/lib/wp-cache";
import { getPostInlineCTA, getPageInlineCTA, type InlineCTA } from "@/lib/library-cta";

/**
 * Internal QA page for the Library CTA matcher.
 *
 * Goal: let us verify that `getPostInlineCTA` / `getPageInlineCTA` are picking
 * sensible labels — and, when the rule fires off the post title rather than a
 * proper category, surface that explicitly so we can decide whether to add a
 * new category rule, broaden an existing keyword list, or live with the
 * default. This is the only place where we EVER call the matcher with the
 * intent of inspecting its decision rather than rendering it as a CTA, so the
 * page is intentionally noindexed and lives under /admin/*.
 *
 * What the table shows for each card:
 *   - Title + categories (so you can see the input the matcher worked with).
 *   - Resolved label, optional override href, and the matchSource
 *     ("category" / "title" / "default") as a coloured badge.
 *   - Filters by matchSource and a free-text query so you can quickly answer:
 *       "How many posts are still falling through to the default?"
 *       "Which titles are matching when the categories aren't?"
 *
 * Performance notes:
 *   - Pulls multiple WP pages of posts (up to ~500 by default) so spot-checks
 *     reflect a realistic slice without requesting the whole 1,500+ corpus.
 *   - All matcher work runs in the browser — the matcher is pure & cheap, so
 *     we don't memoise per-row beyond the outer `useMemo` over the list.
 */

const PER_PAGE = 100;
const DEFAULT_TARGET = 500; // posts to inspect by default; user can extend.

type CardKind = "post" | "page";
type SourceFilter = "all" | InlineCTA["matchSource"];

interface QARow {
  kind: CardKind;
  id: number;
  slug: string;
  title: string;
  categories: string;
  cta: InlineCTA;
}

function badgeVariantForSource(src: InlineCTA["matchSource"]) {
  switch (src) {
    case "category":
      // Strongest signal — use the brand "default" badge style.
      return { className: "bg-primary text-primary-foreground", label: "category" };
    case "title":
      // Weaker — flag with the secondary tone so the eye can scan for it.
      return { className: "bg-amber-500/15 text-amber-700 dark:text-amber-300", label: "title" };
    case "default":
    default:
      // Failure mode for the matcher — coloured destructively so QA notices.
      return { className: "bg-destructive/15 text-destructive", label: "default (fallback)" };
  }
}

export default function AdminCtaQA() {
  const [tab, setTab] = useState<CardKind>("post");
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>("all");
  const [query, setQuery] = useState("");
  const [target, setTarget] = useState(DEFAULT_TARGET);

  // Set the document title + a noindex meta tag without pulling in helmet.
  // This page is internal — never let it land in search results.
  useEffect(() => {
    const prevTitle = document.title;
    document.title = "Library CTA QA — Internal";
    let robots = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
    const created = !robots;
    if (!robots) {
      robots = document.createElement("meta");
      robots.name = "robots";
      document.head.appendChild(robots);
    }
    const prevContent = robots.content;
    robots.content = "noindex,nofollow";
    return () => {
      document.title = prevTitle;
      if (created) robots?.remove();
      else if (robots) robots.content = prevContent;
    };
  }, []);

  // Posts (infinite — we'll auto-fetch pages until we hit `target` or run out).
  const postsQuery = useInfiniteQuery<PaginatedResult<WPPost>>({
    queryKey: [...wpKeys.postsList({ scope: "admin-cta-qa", perPage: PER_PAGE })],
    queryFn: ({ pageParam = 1 }) => wp.posts({ page: pageParam as number, per_page: PER_PAGE }),
    getNextPageParam: (lastPage, all) =>
      all.length + 1 <= lastPage.totalPages ? all.length + 1 : undefined,
    initialPageParam: 1,
    staleTime: WP_STALE.list,
    gcTime: WP_STALE.gc,
    enabled: tab === "post",
  });

  // Auto-pull until we have enough rows to inspect, or we run out of pages.
  useEffect(() => {
    if (tab !== "post") return;
    const loaded = (postsQuery.data?.pages ?? []).reduce((n, p) => n + p.items.length, 0);
    if (loaded < target && postsQuery.hasNextPage && !postsQuery.isFetchingNextPage) {
      postsQuery.fetchNextPage();
    }
  }, [tab, target, postsQuery.data, postsQuery.hasNextPage, postsQuery.isFetchingNextPage, postsQuery]);

  // Pages: WP normally has only a few dozen, so a single max-100 fetch is fine.
  const pagesQuery = useQuery({
    queryKey: wpKeys.pagesList({ perPage: 100 }),
    queryFn: () => wp.pages({ per_page: 100 } as { per_page: number }),
    staleTime: WP_STALE.list,
    gcTime: WP_STALE.gc,
    enabled: tab === "page",
  });

  const rows: QARow[] = useMemo(() => {
    if (tab === "post") {
      const items = postsQuery.data?.pages.flatMap((p) => p.items) ?? [];
      return items.map((post) => {
        const cta = getPostInlineCTA(post);
        const cats = getCategories(post)
          .map((c) => c.name)
          .filter(Boolean)
          .join(", ");
        return {
          kind: "post" as const,
          id: post.id,
          slug: post.slug,
          title: stripHtml(post.title?.rendered ?? "(untitled)"),
          categories: cats || "—",
          cta,
        };
      });
    }
    const items = (pagesQuery.data?.items as WPPage[] | undefined) ?? [];
    return items.map((page) => {
      const cta = getPageInlineCTA(page);
      return {
        kind: "page" as const,
        id: page.id,
        slug: page.slug,
        title: stripHtml(page.title?.rendered ?? "(untitled)"),
        // Pages don't expose categories, but the slug IS the matcher input,
        // so show it in that column for visual parity with the posts table.
        categories: `slug: ${page.slug}`,
        cta,
      };
    });
  }, [tab, postsQuery.data, pagesQuery.data]);

  // Counts BEFORE filtering so the headline reflects the underlying corpus.
  const totals = useMemo(() => {
    const t = { all: 0, category: 0, title: 0, default: 0 };
    for (const r of rows) {
      t.all++;
      t[r.cta.matchSource]++;
    }
    return t;
  }, [rows]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      if (sourceFilter !== "all" && r.cta.matchSource !== sourceFilter) return false;
      if (!q) return true;
      return (
        r.title.toLowerCase().includes(q) ||
        r.slug.toLowerCase().includes(q) ||
        r.categories.toLowerCase().includes(q) ||
        r.cta.label.toLowerCase().includes(q)
      );
    });
  }, [rows, sourceFilter, query]);

  const isLoading =
    (tab === "post" && postsQuery.isLoading) || (tab === "page" && pagesQuery.isLoading);
  const isFetchingMore = tab === "post" && postsQuery.isFetchingNextPage;
  const totalAvailable =
    tab === "post"
      ? postsQuery.data?.pages[0]?.total ?? 0
      : pagesQuery.data?.total ?? 0;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-[hsl(var(--section-alternate))]">
        <div className="container mx-auto py-6 flex items-center justify-between gap-4">
          <div>
            <Link
              to="/"
              className="text-caption text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-2"
            >
              <ArrowLeft className="h-3 w-3" /> Back to site
            </Link>
            <h1 className="text-section-heading font-serif text-foreground">Library CTA QA</h1>
            <p className="text-body-sm text-muted-foreground mt-1 max-w-2xl">
              For each Library card, the resolved CTA label and which rule produced it.
              Use it to spot posts still falling back to the default and to verify
              that <code>category</code> matches outweigh <code>title</code> matches.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => (tab === "post" ? postsQuery.refetch() : pagesQuery.refetch())}
            disabled={isLoading}
            className="gap-2"
          >
            <RefreshCcw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </header>

      <main className="container mx-auto py-8 lg:py-12 space-y-8">
        {/* Controls */}
        <section className="flex flex-wrap items-end gap-3">
          <div>
            <p className="text-eyebrow text-muted-foreground mb-1.5">Content type</p>
            <div className="inline-flex rounded-md border border-border overflow-hidden">
              <button
                onClick={() => setTab("post")}
                className={`px-3 py-2 text-sm min-h-[40px] ${
                  tab === "post"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-muted-foreground hover:text-foreground"
                }`}
              >
                Articles
              </button>
              <button
                onClick={() => setTab("page")}
                className={`px-3 py-2 text-sm min-h-[40px] border-l border-border ${
                  tab === "page"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-muted-foreground hover:text-foreground"
                }`}
              >
                Pages
              </button>
            </div>
          </div>

          <div>
            <p className="text-eyebrow text-muted-foreground mb-1.5">Match source</p>
            <Select value={sourceFilter} onValueChange={(v) => setSourceFilter(v as SourceFilter)}>
              <SelectTrigger className="h-10 min-h-[40px] w-[200px] bg-card text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All ({totals.all})</SelectItem>
                <SelectItem value="category">Category ({totals.category})</SelectItem>
                <SelectItem value="title">Title ({totals.title})</SelectItem>
                <SelectItem value="default">Default fallback ({totals.default})</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 min-w-[220px]">
            <p className="text-eyebrow text-muted-foreground mb-1.5">Filter</p>
            <Input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter by title, slug, category, or CTA label…"
              className="h-10 bg-card text-sm"
            />
          </div>

          {tab === "post" && (
            <div>
              <p className="text-eyebrow text-muted-foreground mb-1.5">Inspect up to</p>
              <Select
                value={String(target)}
                onValueChange={(v) => setTarget(Number(v))}
              >
                <SelectTrigger className="h-10 min-h-[40px] w-[140px] bg-card text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="100">100 posts</SelectItem>
                  <SelectItem value="500">500 posts</SelectItem>
                  <SelectItem value="1000">1,000 posts</SelectItem>
                  <SelectItem value="5000">All posts</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </section>

        {/* Headline counts */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Inspected" value={totals.all.toLocaleString()} hint={`of ${totalAvailable.toLocaleString()} available`} />
          <StatCard
            label="Matched on category"
            value={totals.category.toLocaleString()}
            hint={percent(totals.category, totals.all)}
            tone="positive"
          />
          <StatCard
            label="Matched on title"
            value={totals.title.toLocaleString()}
            hint={percent(totals.title, totals.all)}
            tone="warn"
          />
          <StatCard
            label="Default fallback"
            value={totals.default.toLocaleString()}
            hint={percent(totals.default, totals.all)}
            tone="negative"
          />
        </section>

        {/* Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-3">
            <div>
              <CardTitle className="text-card-heading font-serif">
                Decisions {filtered.length !== totals.all && `· ${filtered.length} of ${totals.all}`}
              </CardTitle>
              <p className="text-body-sm text-muted-foreground mt-1">
                Click any title to open the live card destination in a new tab.
              </p>
            </div>
            {isFetchingMore && (
              <Badge variant="secondary" className="gap-1">
                <RefreshCcw className="h-3 w-3 animate-spin" /> Loading more…
              </Badge>
            )}
          </CardHeader>
          <CardContent>
            {isLoading && rows.length === 0 ? (
              <div className="space-y-2">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <p className="text-body-sm text-muted-foreground py-6 text-center">
                No rows match the current filters.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-body-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-muted-foreground">
                      <th className="py-2 pr-4 font-medium">Title</th>
                      <th className="py-2 pr-4 font-medium">Categories</th>
                      <th className="py-2 pr-4 font-medium">CTA label</th>
                      <th className="py-2 pr-4 font-medium">Override href</th>
                      <th className="py-2 font-medium">Match source</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((r) => {
                      const v = badgeVariantForSource(r.cta.matchSource);
                      return (
                        <tr key={`${r.kind}-${r.id}`} className="border-b border-border/50 last:border-0 align-top">
                          <td className="py-2 pr-4 max-w-[28rem]">
                            <a
                              href={`/${r.slug}`}
                              target="_blank"
                              rel="noopener"
                              className="text-foreground hover:text-primary inline-flex items-start gap-1 group"
                              title={r.title}
                            >
                              <span className="line-clamp-2">{r.title}</span>
                              <ExternalLink className="h-3 w-3 mt-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden />
                            </a>
                            <p className="text-caption text-muted-foreground mt-0.5">/{r.slug}</p>
                          </td>
                          <td className="py-2 pr-4 text-muted-foreground max-w-[18rem]">
                            <span className="line-clamp-2">{r.categories}</span>
                            {r.cta.matchedCategory && (
                              <p className="text-caption text-primary mt-0.5">
                                ↳ matched: {r.cta.matchedCategory.slug}
                              </p>
                            )}
                          </td>
                          <td className="py-2 pr-4 font-medium text-foreground">{r.cta.label}</td>
                          <td className="py-2 pr-4 font-mono text-xs text-muted-foreground">
                            {r.cta.href ?? "—"}
                          </td>
                          <td className="py-2">
                            <span className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full ${v.className}`}>
                              {v.label}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        <footer className="text-caption text-muted-foreground border-t border-border pt-6">
          Internal page — noindex/nofollow. The matcher source of truth lives at{" "}
          <code>src/lib/library-cta.ts</code>. Order of rules matters: the first
          keyword hit wins, so promote narrower intents above broader ones.
        </footer>
      </main>
    </div>
  );
}

function percent(part: number, whole: number): string {
  if (whole === 0) return "—";
  const p = Math.round((part / whole) * 1000) / 10;
  return `${p}%`;
}

function StatCard({
  label,
  value,
  hint,
  tone,
}: {
  label: string;
  value: string | number;
  hint?: string;
  tone?: "positive" | "warn" | "negative";
}) {
  const toneClass =
    tone === "positive"
      ? "text-primary"
      : tone === "warn"
        ? "text-amber-600 dark:text-amber-400"
        : tone === "negative"
          ? "text-destructive"
          : "text-foreground";
  return (
    <Card>
      <CardContent className="pt-6">
        <p className="text-eyebrow text-muted-foreground">{label}</p>
        <p className={`mt-2 font-serif text-3xl tabular-nums ${toneClass}`}>{value}</p>
        {hint && <p className="text-caption text-muted-foreground mt-1">{hint}</p>}
      </CardContent>
    </Card>
  );
}
