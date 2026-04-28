import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ExternalLink, Loader2, RefreshCw, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface RunRow {
  id: string;
  base_url: string;
  started_at: string;
  finished_at: string | null;
  url_count: number;
  ok_count: number;
  error_count: number;
  regression_count: number;
}

interface SnapRow {
  id: string;
  run_id: string;
  path: string;
  url: string;
  http_status: number | null;
  canonical: string | null;
  title: string | null;
  meta_description: string | null;
  content_length: number | null;
  fetch_ms: number | null;
  error: string | null;
  fetched_at: string;
}

type Diff = { changed: boolean; reason: string | null };

function compare(curr: SnapRow, prev: SnapRow | undefined): Diff {
  if (!prev) return { changed: false, reason: null };
  const prevOk = (prev.http_status ?? 0) >= 200 && (prev.http_status ?? 0) < 400;
  const currOk = (curr.http_status ?? 0) >= 200 && (curr.http_status ?? 0) < 400;
  if (prevOk && !currOk)
    return { changed: true, reason: `Status ${prev.http_status} → ${curr.http_status ?? "fail"}` };
  if (!currOk) return { changed: false, reason: null };
  if (prev.canonical && !curr.canonical) return { changed: true, reason: "Canonical removed" };
  if (prev.title && !curr.title) return { changed: true, reason: "Title removed" };
  if (prev.meta_description && !curr.meta_description)
    return { changed: true, reason: "Meta description removed" };
  if (prev.title && curr.title && prev.title !== curr.title)
    return { changed: true, reason: "Title changed" };
  if (prev.canonical && curr.canonical && prev.canonical !== curr.canonical)
    return { changed: true, reason: "Canonical changed" };
  return { changed: false, reason: null };
}

export default function AdminSeoSnapshots() {
  const [runs, setRuns] = useState<RunRow[]>([]);
  const [activeRunId, setActiveRunId] = useState<string | null>(null);
  const [snapshots, setSnapshots] = useState<SnapRow[]>([]);
  const [prevSnapshots, setPrevSnapshots] = useState<SnapRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [filter, setFilter] = useState<"all" | "regressions" | "errors">("all");
  const [error, setError] = useState<string | null>(null);

  // Initial load: latest runs
  useEffect(() => {
    void loadRuns();
  }, []);

  // When the active run changes, load its snapshot rows + the previous run's rows
  useEffect(() => {
    if (!activeRunId) return;
    void loadSnapshots(activeRunId);
  }, [activeRunId, runs]);

  async function loadRuns() {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from("seo_snapshot_runs")
      .select("id, base_url, started_at, finished_at, url_count, ok_count, error_count, regression_count")
      .order("started_at", { ascending: false })
      .limit(20);
    if (error) {
      setError(error.message);
    } else {
      setRuns((data ?? []) as RunRow[]);
      if (data && data.length > 0 && !activeRunId) {
        setActiveRunId(data[0].id);
      }
    }
    setLoading(false);
  }

  async function loadSnapshots(runId: string) {
    setLoading(true);
    const { data: curr, error: e1 } = await supabase
      .from("seo_snapshots")
      .select("*")
      .eq("run_id", runId)
      .order("path", { ascending: true });
    if (e1) {
      setError(e1.message);
      setLoading(false);
      return;
    }
    setSnapshots((curr ?? []) as SnapRow[]);
    // Find previous run id (the one started before this one)
    const idx = runs.findIndex((r) => r.id === runId);
    const prevRun = runs[idx + 1];
    if (prevRun) {
      const { data: prev } = await supabase
        .from("seo_snapshots")
        .select("*")
        .eq("run_id", prevRun.id);
      setPrevSnapshots((prev ?? []) as SnapRow[]);
    } else {
      setPrevSnapshots([]);
    }
    setLoading(false);
  }

  async function triggerRun() {
    setRunning(true);
    setError(null);
    try {
      const { data, error } = await supabase.functions.invoke("seo-snapshot-run", {
        body: {},
      });
      if (error) throw error;
      console.log("snapshot run completed", data);
      await loadRuns();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setRunning(false);
    }
  }

  const prevByPath = useMemo(() => {
    const m = new Map<string, SnapRow>();
    for (const r of prevSnapshots) m.set(r.path, r);
    return m;
  }, [prevSnapshots]);

  const enriched = useMemo(
    () =>
      snapshots.map((s) => ({
        ...s,
        diff: compare(s, prevByPath.get(s.path)),
      })),
    [snapshots, prevByPath],
  );

  const visible = useMemo(() => {
    if (filter === "regressions") return enriched.filter((r) => r.diff.changed);
    if (filter === "errors")
      return enriched.filter(
        (r) => !((r.http_status ?? 0) >= 200 && (r.http_status ?? 0) < 400),
      );
    return enriched;
  }, [enriched, filter]);

  const activeRun = runs.find((r) => r.id === activeRunId) ?? null;

  useEffect(() => {
    const prev = document.title;
    document.title = "SEO Snapshots — Admin";
    return () => { document.title = prev; };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-body-sm text-muted-foreground hover:text-foreground mb-3"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to site
            </Link>
            <h1 className="font-serif text-3xl text-foreground mb-1">
              SEO snapshot dashboard
            </h1>
            <p className="text-body-sm text-muted-foreground max-w-2xl">
              Nightly capture of HTTP status, canonical URL, title, and meta description
              for the top-100 SEO pages. Regressions are diffed against the previous run.
            </p>
          </div>
          <Button onClick={triggerRun} disabled={running} className="min-h-[44px]">
            {running ? (
              <>
                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> Running…
              </>
            ) : (
              <>
                <RefreshCw className="mr-1.5 h-4 w-4" /> Run snapshot now
              </>
            )}
          </Button>
        </div>

        {error && (
          <div className="mb-4 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-body-sm text-foreground">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Run selector */}
        <section className="mb-6">
          <h2 className="text-eyebrow text-muted-foreground mb-2">Recent runs</h2>
          {runs.length === 0 ? (
            <p className="text-body-sm text-muted-foreground">
              No runs yet. Click <em>Run snapshot now</em> to create the first one.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {runs.map((r) => {
                const active = r.id === activeRunId;
                const okPct = r.url_count ? Math.round((r.ok_count / r.url_count) * 100) : 0;
                return (
                  <button
                    key={r.id}
                    onClick={() => setActiveRunId(r.id)}
                    className={`text-left rounded-md border px-3 py-2 transition-colors min-h-[44px] ${
                      active
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/40"
                    }`}
                  >
                    <div className="text-xs font-medium text-foreground">
                      {new Date(r.started_at).toLocaleString()}
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-2">
                      <span>{okPct}% OK</span>
                      {r.regression_count > 0 && (
                        <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400">
                          <ShieldAlert className="h-3 w-3" /> {r.regression_count} regression
                          {r.regression_count === 1 ? "" : "s"}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </section>

        {activeRun && (
          <section className="mb-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Stat label="URLs crawled" value={activeRun.url_count} />
            <Stat
              label="OK"
              value={activeRun.ok_count}
              tone={activeRun.ok_count === activeRun.url_count ? "good" : "warn"}
            />
            <Stat
              label="Errors"
              value={activeRun.error_count}
              tone={activeRun.error_count > 0 ? "bad" : "good"}
            />
            <Stat
              label="Regressions"
              value={activeRun.regression_count}
              tone={activeRun.regression_count > 0 ? "bad" : "good"}
            />
          </section>
        )}

        {/* Filter chips */}
        <div className="mb-3 flex flex-wrap gap-2">
          {(
            [
              { id: "all", label: `All (${enriched.length})` },
              {
                id: "regressions",
                label: `Regressions (${enriched.filter((r) => r.diff.changed).length})`,
              },
              {
                id: "errors",
                label: `Errors (${enriched.filter((r) => !((r.http_status ?? 0) >= 200 && (r.http_status ?? 0) < 400)).length})`,
              },
            ] as const
          ).map((c) => (
            <button
              key={c.id}
              onClick={() => setFilter(c.id)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors min-h-[36px] ${
                filter === c.id
                  ? "bg-primary text-primary-foreground"
                  : "border border-border text-foreground hover:border-primary/40"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Snapshot table */}
        {loading ? (
          <div className="flex items-center gap-2 text-body-sm text-muted-foreground py-8">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading snapshots…
          </div>
        ) : visible.length === 0 ? (
          <p className="text-body-sm text-muted-foreground py-8">
            No matching rows. Try a different filter.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-md border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-left">
                <tr>
                  <th className="px-3 py-2 font-medium">Status</th>
                  <th className="px-3 py-2 font-medium">Path</th>
                  <th className="px-3 py-2 font-medium">Title</th>
                  <th className="px-3 py-2 font-medium">Canonical</th>
                  <th className="px-3 py-2 font-medium">Meta description</th>
                  <th className="px-3 py-2 font-medium">Diff</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((r) => {
                  const ok = (r.http_status ?? 0) >= 200 && (r.http_status ?? 0) < 400;
                  return (
                    <tr
                      key={r.id}
                      className={`border-t border-border align-top ${
                        r.diff.changed ? "bg-amber-50 dark:bg-amber-950/20" : ""
                      }`}
                    >
                      <td className="px-3 py-2">
                        <span
                          className={`inline-flex items-center rounded px-1.5 py-0.5 text-xs font-mono ${
                            ok
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
                              : "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300"
                          }`}
                        >
                          {r.http_status ?? "fail"}
                        </span>
                      </td>
                      <td className="px-3 py-2">
                        <a
                          href={r.url}
                          target="_blank"
                          rel="noopener"
                          className="inline-flex items-center gap-1 text-primary hover:underline"
                        >
                          {r.path}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </td>
                      <td className="px-3 py-2 max-w-[240px] truncate" title={r.title ?? ""}>
                        {r.title ?? <span className="text-muted-foreground">—</span>}
                      </td>
                      <td className="px-3 py-2 max-w-[220px] truncate" title={r.canonical ?? ""}>
                        {r.canonical ? (
                          <span className="font-mono text-xs">{r.canonical}</span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td
                        className="px-3 py-2 max-w-[280px] truncate"
                        title={r.meta_description ?? ""}
                      >
                        {r.meta_description ?? (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="px-3 py-2">
                        {r.diff.changed ? (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 dark:text-amber-400">
                            <ShieldAlert className="h-3 w-3" /> {r.diff.reason}
                          </span>
                        ) : (
                          <span className="text-muted-foreground text-xs">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: number;
  tone?: "good" | "bad" | "warn" | "neutral";
}) {
  const toneClass =
    tone === "good"
      ? "text-emerald-700 dark:text-emerald-400"
      : tone === "bad"
        ? "text-red-700 dark:text-red-400"
        : tone === "warn"
          ? "text-amber-700 dark:text-amber-400"
          : "text-foreground";
  return (
    <div className="rounded-md border border-border bg-card px-4 py-3">
      <div className="text-eyebrow text-muted-foreground">{label}</div>
      <div className={`mt-1 font-serif text-2xl ${toneClass}`}>{value}</div>
    </div>
  );
}
