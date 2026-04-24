import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, RefreshCcw, ExternalLink, AlertTriangle, CheckCircle2, XCircle, Search } from "lucide-react";
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

/**
 * Internal admin page that scans the WordPress corpus for absolute links
 * pointing back to mindfulnessexercises.com (the legacy domain) and HEAD-checks
 * each unique URL to flag broken (4xx/5xx) or "mismatched" (silently
 * redirected to a different path or host) links.
 *
 * Why this exists:
 *   We're in the middle of migrating off WordPress; legacy editorial content
 *   still contains hand-typed absolute mindfulnessexercises.com links. Some
 *   point at posts that have been renamed, others at pages that no longer
 *   exist, and a handful loop through redirects to the wrong destination.
 *   This page lets us triage them in batches without asking editors to grep
 *   the WP DB.
 *
 * How it works:
 *   - Talks to the `link-checker` edge function (server-side to avoid CORS on
 *     cross-origin HEAD requests).
 *   - Scans posts/pages a page at a time and accumulates results — keeps the
 *     UI responsive even on the 1,500+ post corpus.
 *   - "Check links" button POSTs every unique URL discovered so far to the
 *     same function in a single batch (capped at 100 server-side); results
 *     are merged back onto the link rows.
 *
 * Noindex via meta tag — this is internal tooling, not user-facing content.
 */

const PROJECT_ID = import.meta.env.VITE_SUPABASE_PROJECT_ID;
const FN_URL = `https://${PROJECT_ID}.supabase.co/functions/v1/link-checker`;
const ANON = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

type ContentType = "posts" | "pages";

interface FoundLink {
  href: string;
  url: string;
  pathname: string;
  anchorText: string;
}

interface ScanItem {
  id: number;
  type: "post" | "page";
  title: string;
  slug: string;
  link: string;
  modified: string;
  links: FoundLink[];
}

interface ScanResponse {
  type: ContentType;
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
  itemsScanned: number;
  itemsWithLinks: number;
  items: ScanItem[];
}

interface CheckResult {
  url: string;
  status: number | null;
  ok: boolean;
  redirectedTo: string | null;
  mismatch: boolean;
  mismatchReason: string | null;
  error: string | null;
  elapsedMs: number;
}

type FilterMode = "all" | "broken" | "mismatch" | "ok" | "unchecked";

const PER_PAGE = 20;

async function fetchScanPage(type: ContentType, page: number): Promise<ScanResponse> {
  const u = new URL(FN_URL);
  u.searchParams.set("mode", "scan");
  u.searchParams.set("type", type);
  u.searchParams.set("page", String(page));
  u.searchParams.set("per_page", String(PER_PAGE));
  const res = await fetch(u.toString(), {
    headers: { apikey: ANON, Authorization: `Bearer ${ANON}` },
  });
  if (!res.ok) throw new Error(`Scan failed: ${res.status}`);
  return res.json();
}

async function checkUrls(urls: string[]): Promise<CheckResult[]> {
  // Server caps at 100 per call; chunk locally so the UI can scan more.
  const out: CheckResult[] = [];
  for (let i = 0; i < urls.length; i += 100) {
    const batch = urls.slice(i, i + 100);
    const u = new URL(FN_URL);
    u.searchParams.set("mode", "check");
    const res = await fetch(u.toString(), {
      method: "POST",
      headers: {
        apikey: ANON,
        Authorization: `Bearer ${ANON}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ urls: batch }),
    });
    if (!res.ok) throw new Error(`Check failed: ${res.status}`);
    const data = (await res.json()) as { results: CheckResult[] };
    out.push(...data.results);
  }
  return out;
}

function statusBadge(check: CheckResult | undefined) {
  if (!check) {
    return (
      <Badge variant="outline" className="gap-1 text-muted-foreground">
        Unchecked
      </Badge>
    );
  }
  if (check.error) {
    return (
      <Badge variant="destructive" className="gap-1">
        <XCircle className="h-3 w-3" /> {check.error}
      </Badge>
    );
  }
  if (!check.ok) {
    return (
      <Badge variant="destructive" className="gap-1">
        <XCircle className="h-3 w-3" /> {check.status}
      </Badge>
    );
  }
  if (check.mismatch) {
    return (
      <Badge className="gap-1 bg-amber-100 text-amber-900 hover:bg-amber-100 dark:bg-amber-900/40 dark:text-amber-100">
        <AlertTriangle className="h-3 w-3" /> {check.status} mismatch
      </Badge>
    );
  }
  return (
    <Badge className="gap-1 bg-emerald-100 text-emerald-900 hover:bg-emerald-100 dark:bg-emerald-900/40 dark:text-emerald-100">
      <CheckCircle2 className="h-3 w-3" /> {check.status}
    </Badge>
  );
}

export default function AdminLinkChecker() {
  const [type, setType] = useState<ContentType>("posts");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [scanning, setScanning] = useState(false);
  const [checking, setChecking] = useState(false);
  const [items, setItems] = useState<ScanItem[]>([]);
  const [checks, setChecks] = useState<Map<string, CheckResult>>(new Map());
  const [filter, setFilter] = useState<FilterMode>("all");
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Reset accumulated state when content type changes.
  useEffect(() => {
    setItems([]);
    setChecks(new Map());
    setPage(1);
    setTotal(0);
    setTotalPages(1);
    setError(null);
  }, [type]);

  // Set noindex on mount, restore on unmount.
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    const prevTitle = document.title;
    document.title = "Link Checker · Admin";
    return () => {
      meta.remove();
      document.title = prevTitle;
    };
  }, []);

  async function loadPage(targetPage: number) {
    setScanning(true);
    setError(null);
    try {
      const data = await fetchScanPage(type, targetPage);
      setTotalPages(data.totalPages);
      setTotal(data.total);
      setItems((prev) => {
        // Dedupe by id+type, keeping the latest scan for each.
        const map = new Map<string, ScanItem>();
        for (const it of prev) map.set(`${it.type}-${it.id}`, it);
        for (const it of data.items) map.set(`${it.type}-${it.id}`, it);
        return Array.from(map.values()).sort((a, b) => a.title.localeCompare(b.title));
      });
      setPage(targetPage);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Scan failed");
    } finally {
      setScanning(false);
    }
  }

  // All unique ME URLs found across scanned pages.
  const allUrls = useMemo(() => {
    const set = new Set<string>();
    for (const it of items) for (const l of it.links) set.add(l.url);
    return Array.from(set);
  }, [items]);

  const uncheckedUrls = useMemo(
    () => allUrls.filter((u) => !checks.has(u)),
    [allUrls, checks],
  );

  async function runCheck(onlyUnchecked: boolean) {
    const targets = onlyUnchecked ? uncheckedUrls : allUrls;
    if (targets.length === 0) return;
    setChecking(true);
    setError(null);
    try {
      const results = await checkUrls(targets);
      setChecks((prev) => {
        const next = new Map(prev);
        for (const r of results) next.set(r.url, r);
        return next;
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Check failed");
    } finally {
      setChecking(false);
    }
  }

  // Counts for the summary bar.
  const stats = useMemo(() => {
    let broken = 0;
    let mismatch = 0;
    let ok = 0;
    for (const url of allUrls) {
      const c = checks.get(url);
      if (!c) continue;
      if (c.error || !c.ok) broken++;
      else if (c.mismatch) mismatch++;
      else ok++;
    }
    return { total: allUrls.length, broken, mismatch, ok, unchecked: allUrls.length - broken - mismatch - ok };
  }, [allUrls, checks]);

  // Items shown after applying filter + search.
  const visibleItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items
      .map((it) => {
        const filteredLinks = it.links.filter((l) => {
          if (q && !l.url.toLowerCase().includes(q) && !it.title.toLowerCase().includes(q) && !l.anchorText.toLowerCase().includes(q)) {
            return false;
          }
          const c = checks.get(l.url);
          switch (filter) {
            case "broken":
              return c && (c.error || !c.ok);
            case "mismatch":
              return c && c.ok && c.mismatch;
            case "ok":
              return c && c.ok && !c.mismatch;
            case "unchecked":
              return !c;
            default:
              return true;
          }
        });
        return { ...it, links: filteredLinks };
      })
      .filter((it) => it.links.length > 0);
  }, [items, checks, filter, query]);

  function exportCsv() {
    const rows: string[] = [
      ["source_type", "source_id", "source_title", "source_link", "target_url", "anchor_text", "status", "ok", "mismatch", "mismatch_reason", "redirected_to", "error"]
        .map(csvCell)
        .join(","),
    ];
    for (const it of items) {
      for (const l of it.links) {
        const c = checks.get(l.url);
        rows.push(
          [
            it.type,
            String(it.id),
            it.title,
            it.link,
            l.url,
            l.anchorText,
            c?.status != null ? String(c.status) : "",
            c ? String(c.ok) : "",
            c ? String(c.mismatch) : "",
            c?.mismatchReason ?? "",
            c?.redirectedTo ?? "",
            c?.error ?? "",
          ]
            .map(csvCell)
            .join(","),
        );
      }
    }
    const blob = new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `link-check-${type}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <Button asChild variant="ghost" size="sm" className="mb-2 -ml-2">
              <Link to="/">
                <ArrowLeft className="h-4 w-4 mr-1" /> Home
              </Link>
            </Button>
            <h1 className="text-3xl font-serif">Link Checker</h1>
            <p className="text-muted-foreground text-sm mt-1 max-w-2xl">
              Scans WordPress {type} for absolute links to{" "}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">mindfulnessexercises.com</code>{" "}
              and flags broken or mismatched URLs.
            </p>
          </div>
        </div>

        {/* Controls */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base">Scan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap items-end gap-3">
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Content type</label>
                <Select value={type} onValueChange={(v) => setType(v as ContentType)}>
                  <SelectTrigger className="w-40 min-h-[44px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="posts">Posts</SelectItem>
                    <SelectItem value="pages">Pages</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={() => loadPage(1)}
                disabled={scanning}
                className="min-h-[44px]"
              >
                <RefreshCcw className={`h-4 w-4 mr-2 ${scanning ? "animate-spin" : ""}`} />
                {items.length === 0 ? "Start scan" : "Restart scan"}
              </Button>
              {page < totalPages && (
                <Button
                  variant="outline"
                  onClick={() => loadPage(page + 1)}
                  disabled={scanning}
                  className="min-h-[44px]"
                >
                  Load next page ({page + 1}/{totalPages})
                </Button>
              )}
              <div className="text-xs text-muted-foreground ml-auto">
                Scanned {items.length} {type} with ME links
                {total > 0 && ` · ${total} total ${type} on site`}
              </div>
            </div>

            <div className="flex flex-wrap items-end gap-3 pt-2 border-t">
              <Button
                onClick={() => runCheck(true)}
                disabled={checking || uncheckedUrls.length === 0}
                variant="default"
                className="min-h-[44px]"
              >
                {checking ? "Checking…" : `Check ${uncheckedUrls.length} unchecked URL${uncheckedUrls.length === 1 ? "" : "s"}`}
              </Button>
              <Button
                onClick={() => runCheck(false)}
                disabled={checking || allUrls.length === 0}
                variant="outline"
                className="min-h-[44px]"
              >
                Re-check all ({allUrls.length})
              </Button>
              <Button
                onClick={exportCsv}
                disabled={items.length === 0}
                variant="ghost"
                className="min-h-[44px] ml-auto"
              >
                Export CSV
              </Button>
            </div>

            {/* Stats */}
            {allUrls.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2 border-t">
                <Badge variant="outline">{stats.total} unique URLs</Badge>
                <Badge className="bg-emerald-100 text-emerald-900 hover:bg-emerald-100 dark:bg-emerald-900/40 dark:text-emerald-100">
                  {stats.ok} OK
                </Badge>
                <Badge className="bg-amber-100 text-amber-900 hover:bg-amber-100 dark:bg-amber-900/40 dark:text-amber-100">
                  {stats.mismatch} mismatched
                </Badge>
                <Badge variant="destructive">{stats.broken} broken</Badge>
                <Badge variant="outline">{stats.unchecked} unchecked</Badge>
              </div>
            )}

            {error && (
              <div className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded">
                {error}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter by title, URL, or anchor text…"
              className="pl-9 min-h-[44px]"
            />
          </div>
          <Select value={filter} onValueChange={(v) => setFilter(v as FilterMode)}>
            <SelectTrigger className="w-44 min-h-[44px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All links</SelectItem>
              <SelectItem value="broken">Broken only</SelectItem>
              <SelectItem value="mismatch">Mismatched only</SelectItem>
              <SelectItem value="ok">OK only</SelectItem>
              <SelectItem value="unchecked">Unchecked only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results */}
        {scanning && items.length === 0 && (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        )}

        {!scanning && items.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="py-12 text-center text-muted-foreground">
              No scan run yet. Click <strong>Start scan</strong> to fetch the first page of {type}.
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          {visibleItems.map((it) => (
            <Card key={`${it.type}-${it.id}`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="min-w-0">
                    <CardTitle className="text-base font-serif leading-snug">
                      <a
                        href={it.link}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:underline break-words"
                      >
                        {it.title}
                      </a>
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      <Badge variant="outline" className="text-xs capitalize">
                        {it.type}
                      </Badge>
                      <code className="text-xs">/{it.slug}</code>
                      <span>·</span>
                      <span>modified {new Date(it.modified).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <Badge variant="secondary" className="shrink-0">
                    {it.links.length} link{it.links.length === 1 ? "" : "s"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="divide-y">
                  {it.links.map((l, idx) => {
                    const c = checks.get(l.url);
                    return (
                      <li key={`${l.url}-${idx}`} className="py-3 flex items-start gap-3 flex-wrap">
                        <div className="shrink-0">{statusBadge(c)}</div>
                        <div className="min-w-0 flex-1">
                          <a
                            href={l.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm font-mono text-primary hover:underline break-all inline-flex items-start gap-1"
                          >
                            {l.pathname || "/"}
                            <ExternalLink className="h-3 w-3 shrink-0 mt-0.5" />
                          </a>
                          {l.anchorText && (
                            <div className="text-xs text-muted-foreground mt-1 italic">
                              &ldquo;{l.anchorText}&rdquo;
                            </div>
                          )}
                          {c?.redirectedTo && (
                            <div className="text-xs text-muted-foreground mt-1 break-all">
                              → {c.redirectedTo}
                            </div>
                          )}
                          {c?.mismatchReason && (
                            <div className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                              {c.mismatchReason}
                            </div>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

// CSV cell escaping — wrap in quotes when needed and double internal quotes.
function csvCell(value: string): string {
  if (value === "") return "";
  if (/["\n\r]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}
