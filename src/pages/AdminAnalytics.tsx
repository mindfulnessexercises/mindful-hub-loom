import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, RefreshCcw } from "lucide-react";

/**
 * Public, read-only analytics dashboard.
 *
 * Reads from the `analytics_events` table populated by `trackEvent` calls
 * across the app and rolls up the most useful funnel views in-page:
 *   • Headline counts: clicks, signups submitted/succeeded/failed, conversion %.
 *   • CTA clicks broken down by location, by matched category slug,
 *     and by destination URL — three angles on the same event stream.
 *   • Top recent events (last 50) for spot-checking the data pipeline.
 *
 * Performance notes:
 *   • Pulls a capped number of rows for the selected window (default 7d) so
 *     a chatty session can't hang the page. We over-fetch slightly so the
 *     "showing N of total" hint is accurate up to the cap.
 *   • All aggregation is client-side over the fetched window — fine at the
 *     scale this dashboard targets (≤ low-tens-of-thousands of events).
 *   • The Lovable Cloud insert path is fire-and-forget (rAF-batched in
 *     `analytics.ts`) so collection itself never blocks UX.
 */

type RangePreset = "24h" | "7d" | "30d";
type MatchSourceFilter = "all" | "category" | "title" | "default";

const MATCH_SOURCE_FILTERS: { value: MatchSourceFilter; label: string }[] = [
  { value: "all", label: "All sources" },
  { value: "category", label: "Category match" },
  { value: "title", label: "Title match" },
  { value: "default", label: "Default (no match)" },
];

/**
 * Read the CTA rule's match_source from JSONB props. Only `cta_clicked`
 * events carry this — signup events have no match source so they bypass
 * the filter and always count toward conversion totals.
 */
function getMatchSource(row: AnalyticsRow): string | null {
  const props = (row.props ?? {}) as Record<string, unknown>;
  const v = props.match_source;
  return typeof v === "string" ? v : null;
}

const RANGES: Record<RangePreset, { label: string; ms: number }> = {
  "24h": { label: "Last 24 hours", ms: 24 * 60 * 60 * 1000 },
  "7d":  { label: "Last 7 days",   ms: 7 * 24 * 60 * 60 * 1000 },
  "30d": { label: "Last 30 days",  ms: 30 * 24 * 60 * 60 * 1000 },
};

const ROW_CAP = 5000;

interface AnalyticsRow {
  id: string;
  name: string;
  props: Record<string, unknown> | null;
  cta_location: string | null;
  category_slug: string | null;
  cta_destination: string | null;
  form_id: string | null;
  occurred_at: string;
}

interface BreakdownRow {
  key: string;
  clicks: number;
  signups_submitted: number;
  signups_succeeded: number;
  signups_failed: number;
  /** percent (0-100) */
  signup_conversion: number | null;
}

function aggregate(
  rows: AnalyticsRow[],
  field: "cta_location" | "category_slug" | "cta_destination",
): BreakdownRow[] {
  const map = new Map<string, BreakdownRow>();
  for (const row of rows) {
    // For signup events the CTA breakdown fields aren't always populated,
    // so we fall back to `form_id` for the location grouping. This keeps
    // the EbookCapture form visible alongside CTA clicks in one table.
    let key: string | null;
    if (field === "cta_location") {
      key = row.cta_location ?? row.form_id ?? null;
    } else {
      key = row[field];
    }
    if (!key) continue;
    let bucket = map.get(key);
    if (!bucket) {
      bucket = {
        key,
        clicks: 0,
        signups_submitted: 0,
        signups_succeeded: 0,
        signups_failed: 0,
        signup_conversion: null,
      };
      map.set(key, bucket);
    }
    if (row.name === "cta_clicked") bucket.clicks++;
    else if (row.name === "email_signup_submitted") bucket.signups_submitted++;
    else if (row.name === "email_signup_succeeded") bucket.signups_succeeded++;
    else if (row.name === "email_signup_failed") bucket.signups_failed++;
  }
  for (const b of map.values()) {
    b.signup_conversion = b.signups_submitted > 0
      ? Math.round((b.signups_succeeded / b.signups_submitted) * 1000) / 10
      : null;
  }
  return Array.from(map.values()).sort((a, b) => {
    // Sort by total interactions desc so the most active rows surface.
    const ta = a.clicks + a.signups_submitted;
    const tb = b.clicks + b.signups_submitted;
    return tb - ta;
  });
}

function formatRelative(iso: string): string {
  const now = Date.now();
  const t = new Date(iso).getTime();
  const diff = Math.max(0, now - t);
  if (diff < 60_000) return `${Math.round(diff / 1000)}s ago`;
  if (diff < 3_600_000) return `${Math.round(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.round(diff / 3_600_000)}h ago`;
  return `${Math.round(diff / 86_400_000)}d ago`;
}

function truncate(s: string, n = 60): string {
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
}

interface BreakdownTableProps {
  title: string;
  description: string;
  rows: BreakdownRow[];
  /** Visible label for the leftmost column. */
  keyLabel: string;
  /** Optional renderer to format the key (e.g. shorten URLs). */
  formatKey?: (key: string) => React.ReactNode;
}

const BreakdownTable = ({ title, description, rows, keyLabel, formatKey }: BreakdownTableProps) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-card-heading font-serif">{title}</CardTitle>
      <p className="text-body-sm text-muted-foreground">{description}</p>
    </CardHeader>
    <CardContent>
      {rows.length === 0 ? (
        <p className="text-body-sm text-muted-foreground py-6 text-center">
          No data in the selected range.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-body-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="py-2 pr-4 font-medium">{keyLabel}</th>
                <th className="py-2 pr-4 font-medium text-right">Clicks</th>
                <th className="py-2 pr-4 font-medium text-right">Submitted</th>
                <th className="py-2 pr-4 font-medium text-right">Succeeded</th>
                <th className="py-2 pr-4 font-medium text-right">Failed</th>
                <th className="py-2 font-medium text-right">Conv. %</th>
              </tr>
            </thead>
            <tbody>
              {rows.slice(0, 50).map((r) => (
                <tr key={r.key} className="border-b border-border/50 last:border-0">
                  <td className="py-2 pr-4 font-mono text-xs">{formatKey ? formatKey(r.key) : r.key}</td>
                  <td className="py-2 pr-4 text-right tabular-nums">{r.clicks}</td>
                  <td className="py-2 pr-4 text-right tabular-nums">{r.signups_submitted}</td>
                  <td className="py-2 pr-4 text-right tabular-nums text-primary">{r.signups_succeeded}</td>
                  <td className="py-2 pr-4 text-right tabular-nums text-destructive">{r.signups_failed}</td>
                  <td className="py-2 text-right tabular-nums">
                    {r.signup_conversion == null ? "—" : `${r.signup_conversion}%`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {rows.length > 50 && (
            <p className="text-caption text-muted-foreground mt-3">
              Showing top 50 of {rows.length} rows.
            </p>
          )}
        </div>
      )}
    </CardContent>
  </Card>
);

const StatCard = ({ label, value, hint }: { label: string; value: string | number; hint?: string }) => (
  <Card>
    <CardContent className="pt-6">
      <p className="text-eyebrow text-muted-foreground">{label}</p>
      <p className="mt-2 font-serif text-3xl text-foreground tabular-nums">{value}</p>
      {hint && <p className="text-caption text-muted-foreground mt-1">{hint}</p>}
    </CardContent>
  </Card>
);

export default function AdminAnalytics() {
  const [range, setRange] = useState<RangePreset>("7d");
  const [matchSource, setMatchSource] = useState<MatchSourceFilter>("all");
  const [rows, setRows] = useState<AnalyticsRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const since = new Date(Date.now() - RANGES[range].ms).toISOString();
    supabase
      .from("analytics_events")
      .select(
        "id,name,props,cta_location,category_slug,cta_destination,form_id,occurred_at",
      )
      .gte("occurred_at", since)
      .order("occurred_at", { ascending: false })
      .limit(ROW_CAP)
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) {
          setError(error.message);
          setRows([]);
        } else {
          setRows((data as AnalyticsRow[]) ?? []);
        }
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [range, refreshKey]);

  // Apply match_source segmentation to CTA click events. Non-click events
  // (signups, upstream intent) are kept as-is so conversion math stays honest.
  const filteredRows = useMemo(() => {
    if (matchSource === "all" || rows == null) return rows ?? [];
    return rows.filter((r) => {
      if (r.name !== "cta_clicked") return true;
      return getMatchSource(r) === matchSource;
    });
  }, [rows, matchSource]);

  const headline = useMemo(() => {
    const data = filteredRows;
    const counts = {
      clicks: 0,
      submitted: 0,
      succeeded: 0,
      failed: 0,
    };
    for (const r of data) {
      if (r.name === "cta_clicked") counts.clicks++;
      else if (r.name === "email_signup_submitted") counts.submitted++;
      else if (r.name === "email_signup_succeeded") counts.succeeded++;
      else if (r.name === "email_signup_failed") counts.failed++;
    }
    const conversion = counts.submitted > 0
      ? Math.round((counts.succeeded / counts.submitted) * 1000) / 10
      : null;
    return { ...counts, conversion };
  }, [filteredRows]);

  const byLocation = useMemo(() => aggregate(filteredRows, "cta_location"), [filteredRows]);
  const byCategory = useMemo(() => aggregate(filteredRows, "category_slug"), [filteredRows]);
  const byDestination = useMemo(() => aggregate(filteredRows, "cta_destination"), [filteredRows]);

  // CTA clicks broken down by which rule produced the label/destination.
  // This is the headline view for spotting whether default fallbacks are
  // outperforming targeted matches (a sign the rule set has gaps).
  const byMatchSource = useMemo(() => {
    const buckets = new Map<string, { clicks: number }>();
    for (const r of rows ?? []) {
      if (r.name !== "cta_clicked") continue;
      const src = getMatchSource(r) ?? "unknown";
      const b = buckets.get(src) ?? { clicks: 0 };
      b.clicks++;
      buckets.set(src, b);
    }
    const total = Array.from(buckets.values()).reduce((s, b) => s + b.clicks, 0);
    return Array.from(buckets.entries())
      .map(([source, b]) => ({
        source,
        clicks: b.clicks,
        share: total > 0 ? Math.round((b.clicks / total) * 1000) / 10 : 0,
      }))
      .sort((a, b) => b.clicks - a.clicks);
  }, [rows]);

  // Upstream intent counters: these events sit BEFORE a CTA click in the
  // funnel — they tell us how the user shaped what they were looking at when
  // the CTA was eventually shown. We pull `source` from JSONB props so we can
  // see e.g. how many searches came from the navbar vs the search page itself.
  const upstreamIntent = useMemo(() => {
    type Bucket = { searches: number; sortChanges: number; categoryChanges: number; tabChanges: number; loadMores: number };
    const map = new Map<string, Bucket>();
    const ensure = (k: string): Bucket => {
      let b = map.get(k);
      if (!b) {
        b = { searches: 0, sortChanges: 0, categoryChanges: 0, tabChanges: 0, loadMores: 0 };
        map.set(k, b);
      }
      return b;
    };
    for (const row of rows ?? []) {
      const props = (row.props ?? {}) as Record<string, unknown>;
      const source = typeof props.source === "string" ? props.source : null;
      if (!source) continue;
      if (row.name === "search_submitted") ensure(source).searches++;
      else if (row.name === "sort_changed") ensure(source).sortChanges++;
      else if (row.name === "category_filter_changed") ensure(source).categoryChanges++;
      else if (row.name === "library_tab_changed" || row.name === "search_type_changed") ensure(source).tabChanges++;
      else if (row.name === "pagination_load_more") ensure(source).loadMores++;
    }
    return Array.from(map.entries())
      .map(([source, b]) => ({ source, ...b, total: b.searches + b.sortChanges + b.categoryChanges + b.tabChanges + b.loadMores }))
      .sort((a, b) => b.total - a.total);
  }, [rows]);

  const recent = (rows ?? []).slice(0, 50);
  const showingCapHint = (rows?.length ?? 0) >= ROW_CAP;

  // Set the document title + a noindex meta tag without pulling in helmet.
  useEffect(() => {
    const prevTitle = document.title;
    document.title = "Analytics — Internal dashboard";
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
            <h1 className="text-section-heading font-serif text-foreground">Analytics</h1>
            <p className="text-body-sm text-muted-foreground mt-1 max-w-2xl">
              CTA clicks and email signups, broken down by where they happened.
              Updated as events arrive — give it a few seconds after firing.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setRefreshKey((k) => k + 1)}
            disabled={loading}
            className="gap-2"
          >
            <RefreshCcw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </header>

      <main className="container mx-auto py-8 lg:py-12 space-y-8">
        {/* Range selector */}
        <div className="flex flex-wrap gap-2">
          {(Object.keys(RANGES) as RangePreset[]).map((r) => (
            <Button
              key={r}
              variant={range === r ? "default" : "outline"}
              size="sm"
              onClick={() => setRange(r)}
              className="min-h-[36px]"
            >
              {RANGES[r].label}
            </Button>
          ))}
          {showingCapHint && (
            <Badge variant="secondary" className="self-center">
              Capped at {ROW_CAP.toLocaleString()} events
            </Badge>
          )}
        </div>

        {/* Match-source segmentation: filters cta_clicked events by which rule
            (category / title / default) produced the CTA. Signup events are
            unaffected so conversion totals stay comparable across segments. */}
        <div className="flex flex-wrap items-center gap-2" aria-label="Match source filter">
          <span className="text-eyebrow text-muted-foreground mr-1">Segment CTA clicks:</span>
          {MATCH_SOURCE_FILTERS.map((opt) => (
            <Button
              key={opt.value}
              variant={matchSource === opt.value ? "default" : "outline"}
              size="sm"
              onClick={() => setMatchSource(opt.value)}
              className="min-h-[36px]"
            >
              {opt.label}
            </Button>
          ))}
          {matchSource !== "all" && (
            <Badge variant="secondary" className="self-center">
              Filtering by match_source = {matchSource}
            </Badge>
          )}
        </div>

        {error && (
          <Card>
            <CardContent className="pt-6">
              <p className="text-body-sm text-destructive">Failed to load events: {error}</p>
            </CardContent>
          </Card>
        )}

        {/* Headline stats */}
        <section aria-label="Headline metrics" className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {loading && rows === null ? (
            Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-28" />)
          ) : (
            <>
              <StatCard label="CTA clicks" value={headline.clicks.toLocaleString()} />
              <StatCard label="Signups submitted" value={headline.submitted.toLocaleString()} />
              <StatCard label="Signups succeeded" value={headline.succeeded.toLocaleString()} />
              <StatCard label="Signups failed" value={headline.failed.toLocaleString()} />
              <StatCard
                label="Conversion"
                value={headline.conversion == null ? "—" : `${headline.conversion}%`}
                hint={headline.submitted > 0 ? `${headline.succeeded} of ${headline.submitted}` : undefined}
              />
            </>
          )}
        </section>

        {/* CTA clicks by match_source — always shows the full window
            (unfiltered) so you can see the segment shares at a glance even
            while drilling into one segment above. */}
        <section>
          <Card>
            <CardHeader>
              <CardTitle className="text-card-heading font-serif">CTA clicks by match source</CardTitle>
              <p className="text-body-sm text-muted-foreground">
                Which rule produced the CTA — category match, title match, or default fallback.
                Use this to see whether targeted rules are doing the work.
              </p>
            </CardHeader>
            <CardContent>
              {byMatchSource.length === 0 ? (
                <p className="text-body-sm text-muted-foreground py-6 text-center">
                  No CTA clicks in the selected range.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-body-sm">
                    <thead>
                      <tr className="border-b border-border text-left text-muted-foreground">
                        <th className="py-2 pr-4 font-medium">Match source</th>
                        <th className="py-2 pr-4 font-medium text-right">Clicks</th>
                        <th className="py-2 pr-4 font-medium text-right">Share</th>
                        <th className="py-2 font-medium text-right">Filter</th>
                      </tr>
                    </thead>
                    <tbody>
                      {byMatchSource.map((r) => (
                        <tr key={r.source} className="border-b border-border/50 last:border-0">
                          <td className="py-2 pr-4 font-mono text-xs">{r.source}</td>
                          <td className="py-2 pr-4 text-right tabular-nums">{r.clicks}</td>
                          <td className="py-2 pr-4 text-right tabular-nums">{r.share}%</td>
                          <td className="py-2 text-right">
                            {(r.source === "category" || r.source === "title" || r.source === "default") && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 px-2 text-xs"
                                onClick={() => setMatchSource(r.source as MatchSourceFilter)}
                              >
                                Drill in
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <BreakdownTable
            title="By CTA location"
            description="Where the CTA appears on the site (e.g. homepage_hero, library_post_card). Email signups also appear here, grouped by form id."
            rows={byLocation}
            keyLabel="Location"
          />
          <BreakdownTable
            title="By matched category"
            description="The category slug that produced the CTA copy/destination. Empty when no rule matched."
            rows={byCategory}
            keyLabel="Category slug"
          />
        </section>

        <section>
          <BreakdownTable
            title="By destination"
            description="The href / route the CTA pointed at. Use this to spot the most-clicked offers and check redirect targets."
            rows={byDestination}
            keyLabel="Destination"
            formatKey={(k) => <span title={k}>{truncate(k, 80)}</span>}
          />
        </section>

        {/* Upstream intent — events that happen BEFORE a CTA click and shape
            what the user was looking at. Pair with the breakdowns above to
            see whether refinement (search/sort/filter) precedes conversion. */}
        <section>
          <Card>
            <CardHeader>
              <CardTitle className="text-card-heading font-serif">Upstream intent by source</CardTitle>
              <p className="text-body-sm text-muted-foreground">
                Filter changes, search submissions, and pagination — grouped by where
                the user was when they made the change. Use it to see which surfaces
                drive deep refinement before a CTA click.
              </p>
            </CardHeader>
            <CardContent>
              {upstreamIntent.length === 0 ? (
                <p className="text-body-sm text-muted-foreground py-6 text-center">
                  No upstream events in the selected range.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-body-sm">
                    <thead>
                      <tr className="border-b border-border text-left text-muted-foreground">
                        <th className="py-2 pr-4 font-medium">Source</th>
                        <th className="py-2 pr-4 font-medium text-right">Searches</th>
                        <th className="py-2 pr-4 font-medium text-right">Sort changes</th>
                        <th className="py-2 pr-4 font-medium text-right">Category changes</th>
                        <th className="py-2 pr-4 font-medium text-right">Tab / type changes</th>
                        <th className="py-2 pr-4 font-medium text-right">Load more</th>
                        <th className="py-2 font-medium text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {upstreamIntent.slice(0, 50).map((r) => (
                        <tr key={r.source} className="border-b border-border/50 last:border-0">
                          <td className="py-2 pr-4 font-mono text-xs">{r.source}</td>
                          <td className="py-2 pr-4 text-right tabular-nums">{r.searches}</td>
                          <td className="py-2 pr-4 text-right tabular-nums">{r.sortChanges}</td>
                          <td className="py-2 pr-4 text-right tabular-nums">{r.categoryChanges}</td>
                          <td className="py-2 pr-4 text-right tabular-nums">{r.tabChanges}</td>
                          <td className="py-2 pr-4 text-right tabular-nums">{r.loadMores}</td>
                          <td className="py-2 text-right tabular-nums font-semibold">{r.total}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Recent feed for spot-checking */}
        <section>
          <Card>
            <CardHeader>
              <CardTitle className="text-card-heading font-serif">Recent events</CardTitle>
              <p className="text-body-sm text-muted-foreground">
                Last 50 events in the selected window — useful to confirm new tracking is firing.
              </p>
            </CardHeader>
            <CardContent>
              {recent.length === 0 ? (
                <p className="text-body-sm text-muted-foreground py-6 text-center">
                  No events recorded in the selected range.
                </p>
              ) : (
                <ul className="divide-y divide-border">
                  {recent.map((r) => (
                    <li key={r.id} className="py-2.5 flex items-center justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <p className="text-body-sm font-medium text-foreground truncate">
                          {r.name}
                        </p>
                        <p className="text-caption text-muted-foreground truncate">
                          {[
                            r.cta_location ?? r.form_id,
                            r.category_slug,
                            r.cta_destination,
                          ]
                            .filter(Boolean)
                            .join(" · ") || "—"}
                        </p>
                      </div>
                      <span className="text-caption text-muted-foreground whitespace-nowrap">
                        {formatRelative(r.occurred_at)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </section>

        <footer className="text-caption text-muted-foreground border-t border-border pt-6">
          This dashboard is public per product decision. Events are append-only
          and never edited or deleted. Source: <code>public.analytics_events</code>.
        </footer>
      </main>
    </div>
  );
}
