import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, RefreshCcw, CheckCircle2, XCircle, AlertTriangle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  wp,
  resolveCategoryCptEndpoint,
  CATEGORY_CPT_ENDPOINT,
  CPT_PARENT_CATEGORY_ENDPOINT,
  WP_TTL,
  type WPCategory,
} from "@/lib/wp";

/**
 * Internal admin page that audits every WordPress category to verify that
 * the app routes it through the correct REST endpoint (standard /wp/v2/posts
 * or a custom post type like /wp/v2/podcast-episodes) AND that the chosen
 * endpoint actually returns ≥1 entry filtered by the category id.
 *
 * Why this exists:
 *   Categories like "Guided Meditation" live under the Podcast parent and
 *   only contain CPT entries — the wrong endpoint silently returns []. This
 *   audit catches mapping regressions before users hit empty pages.
 *
 * Status legend:
 *   pass — endpoint returned ≥1 item for this category id
 *   empty — endpoint returned 0 items (likely missing CPT mapping or genuinely empty)
 *   fail — request errored
 *
 * Noindex via meta tag — internal tooling.
 */

type CategoryStatus = "pending" | "pass" | "empty" | "fail";

interface AuditRow {
  category: WPCategory;
  endpoint: string;
  endpointKind: "posts" | "podcast-episodes" | "downloads";
  mappingReason: "default" | "slug-match" | "parent-match";
  parentSlug?: string;
  status: CategoryStatus;
  itemCount: number;
  sampleSlug?: string;
  error?: string;
}

function classifyEndpoint(endpoint: string): AuditRow["endpointKind"] {
  if (endpoint.includes("podcast-episodes")) return "podcast-episodes";
  if (endpoint.includes("downloads")) return "downloads";
  return "posts";
}

function determineMappingReason(
  category: WPCategory,
  resolved: string | undefined,
): { reason: AuditRow["mappingReason"] } {
  if (!resolved) return { reason: "default" };
  if (CATEGORY_CPT_ENDPOINT[category.slug]) return { reason: "slug-match" };
  if (category.parent && CPT_PARENT_CATEGORY_ENDPOINT[category.parent]) {
    return { reason: "parent-match" };
  }
  return { reason: "default" };
}

const StatusBadge = ({ status }: { status: CategoryStatus }) => {
  if (status === "pending") {
    return <Badge variant="secondary">Checking…</Badge>;
  }
  if (status === "pass") {
    return (
      <Badge className="bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/20 border border-emerald-500/30">
        <CheckCircle2 className="h-3 w-3 mr-1" /> Pass
      </Badge>
    );
  }
  if (status === "empty") {
    return (
      <Badge className="bg-amber-500/15 text-amber-700 hover:bg-amber-500/20 border border-amber-500/30">
        <AlertTriangle className="h-3 w-3 mr-1" /> Empty
      </Badge>
    );
  }
  return (
    <Badge variant="destructive">
      <XCircle className="h-3 w-3 mr-1" /> Fail
    </Badge>
  );
};

export default function AdminCategoryAudit() {
  const [rows, setRows] = useState<AuditRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [runId, setRunId] = useState(0);

  useEffect(() => {
    document.title = "Category Audit | Admin";
    let meta = document.querySelector('meta[name="robots"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "robots");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", "noindex,nofollow");
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setLoading(true);
      setRows([]);
      try {
        const { items: categories } = await wp.categories({ ttl: WP_TTL.short });
        if (cancelled) return;

        // Build category id → slug map so we can label parent-match rows.
        const idToSlug = new Map(categories.map((c) => [c.id, c.slug]));

        // Skip the WP "Uncategorized" bucket which is generally empty by design.
        const auditable = categories.filter((c) => c.slug !== "uncategorized");

        // Seed pending rows so the user sees progress.
        const seeded: AuditRow[] = auditable.map((category) => {
          const endpoint = resolveCategoryCptEndpoint(category) ?? "/wp/v2/posts";
          const { reason } = determineMappingReason(category, resolveCategoryCptEndpoint(category));
          return {
            category,
            endpoint,
            endpointKind: classifyEndpoint(endpoint),
            mappingReason: reason,
            parentSlug: category.parent ? idToSlug.get(category.parent) : undefined,
            status: "pending",
            itemCount: 0,
          };
        });
        setRows(seeded);

        // Verify each category in parallel-batches of 6 to be polite to the proxy.
        const concurrency = 6;
        for (let i = 0; i < seeded.length; i += concurrency) {
          if (cancelled) return;
          const batch = seeded.slice(i, i + concurrency);
          const results = await Promise.all(
            batch.map(async (row): Promise<AuditRow> => {
              try {
                const { items, total } = await wp.posts(
                  {
                    endpoint: row.endpoint,
                    categories: row.category.id,
                    per_page: 1,
                  },
                  { ttl: WP_TTL.short },
                );
                const count = total || items.length;
                return {
                  ...row,
                  status: count > 0 ? "pass" : "empty",
                  itemCount: count,
                  sampleSlug: items[0]?.slug,
                };
              } catch (err) {
                return {
                  ...row,
                  status: "fail",
                  error: err instanceof Error ? err.message : String(err),
                };
              }
            }),
          );
          if (cancelled) return;
          setRows((prev) => {
            const next = [...prev];
            results.forEach((r) => {
              const idx = next.findIndex((n) => n.category.id === r.category.id);
              if (idx !== -1) next[idx] = r;
            });
            return next;
          });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [runId]);

  const summary = useMemo(() => {
    const pass = rows.filter((r) => r.status === "pass").length;
    const empty = rows.filter((r) => r.status === "empty").length;
    const fail = rows.filter((r) => r.status === "fail").length;
    const pending = rows.filter((r) => r.status === "pending").length;
    return { pass, empty, fail, pending, total: rows.length };
  }, [rows]);

  // Surface problem rows first; "Guided Meditation" style misroutes are the
  // whole point of this page so we want them at the top, not buried.
  const sortedRows = useMemo(() => {
    const order: Record<CategoryStatus, number> = { fail: 0, empty: 1, pending: 2, pass: 3 };
    return [...rows].sort((a, b) => order[a.status] - order[b.status] || b.category.count - a.category.count);
  }, [rows]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-10 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Button variant="ghost" size="sm" asChild className="mb-3">
              <Link to="/">
                <ArrowLeft className="h-4 w-4 mr-1" /> Home
              </Link>
            </Button>
            <h1 className="text-3xl font-serif font-semibold">Category Audit</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Verifies every WordPress category resolves to the correct REST endpoint and returns ≥1 entry.
            </p>
          </div>
          <Button onClick={() => setRunId((n) => n + 1)} disabled={loading} variant="outline">
            <RefreshCcw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Re-run
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          <Card><CardContent className="py-4"><div className="text-2xl font-semibold">{summary.total}</div><div className="text-xs text-muted-foreground">Categories</div></CardContent></Card>
          <Card><CardContent className="py-4"><div className="text-2xl font-semibold text-emerald-600">{summary.pass}</div><div className="text-xs text-muted-foreground">Pass</div></CardContent></Card>
          <Card><CardContent className="py-4"><div className="text-2xl font-semibold text-amber-600">{summary.empty}</div><div className="text-xs text-muted-foreground">Empty</div></CardContent></Card>
          <Card><CardContent className="py-4"><div className="text-2xl font-semibold text-destructive">{summary.fail}</div><div className="text-xs text-muted-foreground">Fail</div></CardContent></Card>
          <Card><CardContent className="py-4"><div className="text-2xl font-semibold">{summary.pending}</div><div className="text-xs text-muted-foreground">Pending</div></CardContent></Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Results</CardTitle>
          </CardHeader>
          <CardContent>
            {rows.length === 0 ? (
              <div className="space-y-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Status</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Endpoint</TableHead>
                      <TableHead>Mapping</TableHead>
                      <TableHead className="text-right">WP count</TableHead>
                      <TableHead className="text-right">Returned</TableHead>
                      <TableHead>Sample</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedRows.map((row) => (
                      <TableRow key={row.category.id}>
                        <TableCell><StatusBadge status={row.status} /></TableCell>
                        <TableCell>
                          <div className="font-medium">{row.category.name}</div>
                          <div className="text-xs text-muted-foreground">/{row.category.slug}</div>
                        </TableCell>
                        <TableCell>
                          <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{row.endpoint}</code>
                          <div className="text-xs text-muted-foreground mt-0.5">{row.endpointKind}</div>
                        </TableCell>
                        <TableCell className="text-xs">
                          {row.mappingReason === "slug-match" && <span>Slug match</span>}
                          {row.mappingReason === "parent-match" && (
                            <span>Parent: <code>{row.parentSlug ?? row.category.parent}</code></span>
                          )}
                          {row.mappingReason === "default" && <span className="text-muted-foreground">Default</span>}
                        </TableCell>
                        <TableCell className="text-right text-sm tabular-nums">{row.category.count}</TableCell>
                        <TableCell className="text-right text-sm tabular-nums">
                          {row.status === "pending" ? "—" : row.itemCount}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground max-w-[180px] truncate">
                          {row.sampleSlug ?? (row.error ? <span className="text-destructive">{row.error}</span> : "—")}
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" asChild>
                            <Link
                              to={`/category/${row.category.slug}`}
                              target="_blank"
                              rel="noopener"
                              aria-label={`Open /category/${row.category.slug}`}
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
