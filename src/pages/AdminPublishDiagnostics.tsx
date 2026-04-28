import { useEffect, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2, RefreshCw, Loader2 } from "lucide-react";

/**
 * Admin → Publish Diagnostics
 *
 * Surfaces signals that correlate with publish/build failures so we can tell
 * whether a logged error is STALE (already fixed in the current code) or
 * CURRENTLY REPRODUCIBLE (will fail the next publish).
 *
 * Three sources are checked:
 *  1. Live runtime errors — patches console.error/window.onerror so anything
 *     thrown in the SPA is captured here.
 *  2. Module probe — uses Vite's dev-server `/@id/` and `/@fs/` endpoints to
 *     verify a list of asset imports actually resolve right now. If a publish
 *     log says "Failed to resolve import X" and our probe says X resolves OK,
 *     the error is stale.
 *  3. Build log analyzer — paste the log from the failed publish; we extract
 *     each `Failed to resolve import "<path>"` line and re-probe it live.
 *
 * No backend; everything runs against the running Vite/preview server.
 */

type RuntimeError = {
  id: number;
  ts: number;
  message: string;
  source?: string;
};

type ProbeResult = {
  path: string;
  status: "ok" | "missing" | "checking" | "error";
  detail?: string;
};

type LogFinding = {
  raw: string;
  importPath: string;
  resolvedPath: string;
  probe: ProbeResult;
};

const FAILED_IMPORT_RE =
  /Failed to resolve import\s+"([^"]+)"\s+from\s+"([^"]+)"/g;

/** Convert an `@/...` alias or relative path into a URL Vite will serve. */
function importToUrl(importPath: string, fromFile?: string): string {
  // @/ alias → /src/
  if (importPath.startsWith("@/")) {
    return `/src/${importPath.slice(2)}`;
  }
  // Absolute /src/...
  if (importPath.startsWith("/")) return importPath;
  // Relative — resolve against fromFile if given
  if (fromFile && importPath.startsWith(".")) {
    const base = fromFile.replace(/^\/?/, "/").split("/").slice(0, -1);
    const parts = importPath.split("/");
    for (const p of parts) {
      if (p === "..") base.pop();
      else if (p !== ".") base.push(p);
    }
    return base.join("/");
  }
  return importPath;
}

async function probeUrl(url: string): Promise<ProbeResult> {
  try {
    const res = await fetch(url, { method: "GET", cache: "no-store" });
    if (res.ok) {
      return { path: url, status: "ok", detail: `HTTP ${res.status}` };
    }
    if (res.status === 404) {
      return { path: url, status: "missing", detail: "404 — file not found" };
    }
    // Vite returns 500 with HTML body for unresolved imports
    const body = await res.text();
    const truncated = body.slice(0, 200);
    if (/Failed to resolve|Cannot find|ENOENT/i.test(body)) {
      return { path: url, status: "missing", detail: truncated };
    }
    return { path: url, status: "error", detail: `HTTP ${res.status}` };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { path: url, status: "error", detail: msg };
  }
}

/** Known asset imports that have caused recent publish failures. Worth
 *  probing on page load so we have a baseline. Extend this as needed. */
const KNOWN_IMPORT_CHECKS: { label: string; url: string }[] = [
  { label: "Sean Fargo headshot", url: "/src/assets/sean-fargo-headshot.jpg" },
  { label: "Sean Fargo speaking", url: "/src/assets/sean-fargo-speaking.jpg" },
  { label: "Endorser: Rick Hanson", url: "/src/assets/endorsers/rick-hanson.jpg" },
  { label: "Endorser: Chris Germer", url: "/src/assets/endorsers/chris-germer.jpg" },
  { label: "Endorser: Jack Kornfield", url: "/src/assets/endorsers/jack-kornfield.jpg" },
  { label: "Endorser: Gabor Maté", url: "/src/assets/endorsers/gabor-mate.jpg" },
  { label: "Endorser: Sharon Salzberg", url: "/src/assets/endorsers/sharon-salzberg.jpg" },
  { label: "Endorser: Hasan Rafiq", url: "/src/assets/endorsers/hasan-rafiq.jpg" },
  { label: "Ebook cover", url: "/src/assets/ebook-cover.jpg" },
  { label: "Logo", url: "/src/assets/logo-mindfulness-exercises.png" },
];

const StatusPill = ({ status }: { status: ProbeResult["status"] }) => {
  if (status === "ok")
    return (
      <Badge className="bg-emerald-100 text-emerald-900 hover:bg-emerald-100">
        <CheckCircle2 className="mr-1 h-3 w-3" /> OK
      </Badge>
    );
  if (status === "missing")
    return (
      <Badge className="bg-rose-100 text-rose-900 hover:bg-rose-100">
        <AlertCircle className="mr-1 h-3 w-3" /> Missing
      </Badge>
    );
  if (status === "checking")
    return (
      <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100">
        <Loader2 className="mr-1 h-3 w-3 animate-spin" /> Checking
      </Badge>
    );
  return (
    <Badge className="bg-amber-100 text-amber-900 hover:bg-amber-100">
      <AlertCircle className="mr-1 h-3 w-3" /> Error
    </Badge>
  );
};

export default function AdminPublishDiagnostics() {
  const [runtimeErrors, setRuntimeErrors] = useState<RuntimeError[]>([]);
  const [probes, setProbes] = useState<Record<string, ProbeResult>>({});
  const [probing, setProbing] = useState(false);
  const [logText, setLogText] = useState("");
  const [findings, setFindings] = useState<LogFinding[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const idRef = useRef(0);

  // ── 1. Live runtime error capture ──────────────────────────────────────
  useEffect(() => {
    const origError = console.error;
    const onErr = (msg: string, source?: string) => {
      idRef.current += 1;
      setRuntimeErrors((prev) =>
        [{ id: idRef.current, ts: Date.now(), message: msg, source }, ...prev].slice(0, 50),
      );
    };

    console.error = (...args: unknown[]) => {
      const msg = args
        .map((a) => (a instanceof Error ? a.message : typeof a === "string" ? a : JSON.stringify(a)))
        .join(" ");
      onErr(msg, "console.error");
      origError.apply(console, args as []);
    };

    const handleWindowError = (e: ErrorEvent) => {
      onErr(e.message, e.filename || "window.onerror");
    };
    const handleRejection = (e: PromiseRejectionEvent) => {
      const reason = e.reason instanceof Error ? e.reason.message : String(e.reason);
      onErr(reason, "unhandledrejection");
    };
    window.addEventListener("error", handleWindowError);
    window.addEventListener("unhandledrejection", handleRejection);

    return () => {
      console.error = origError;
      window.removeEventListener("error", handleWindowError);
      window.removeEventListener("unhandledrejection", handleRejection);
    };
  }, []);

  // ── 2. Asset / module probes ───────────────────────────────────────────
  const runKnownProbes = async () => {
    setProbing(true);
    const initial: Record<string, ProbeResult> = {};
    KNOWN_IMPORT_CHECKS.forEach(({ url }) => {
      initial[url] = { path: url, status: "checking" };
    });
    setProbes(initial);

    const results = await Promise.all(
      KNOWN_IMPORT_CHECKS.map(({ url }) => probeUrl(url)),
    );
    const next: Record<string, ProbeResult> = {};
    results.forEach((r) => {
      next[r.path] = r;
    });
    setProbes(next);
    setProbing(false);
  };

  useEffect(() => {
    runKnownProbes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── 3. Log analyzer ────────────────────────────────────────────────────
  const analyzeLog = async () => {
    setAnalyzing(true);
    const matches = Array.from(logText.matchAll(FAILED_IMPORT_RE));
    if (matches.length === 0) {
      setFindings([]);
      setAnalyzing(false);
      return;
    }
    // Dedupe by import path
    const seen = new Set<string>();
    const unique: { raw: string; importPath: string; from: string }[] = [];
    for (const m of matches) {
      const key = m[1];
      if (seen.has(key)) continue;
      seen.add(key);
      unique.push({ raw: m[0], importPath: m[1], from: m[2] });
    }

    const placeholder: LogFinding[] = unique.map((u) => ({
      raw: u.raw,
      importPath: u.importPath,
      resolvedPath: importToUrl(u.importPath, u.from),
      probe: { path: importToUrl(u.importPath, u.from), status: "checking" },
    }));
    setFindings(placeholder);

    const probed = await Promise.all(
      placeholder.map(async (f) => ({ ...f, probe: await probeUrl(f.resolvedPath) })),
    );
    setFindings(probed);
    setAnalyzing(false);
  };

  const summary = useMemo(() => {
    const total = findings.length;
    const stale = findings.filter((f) => f.probe.status === "ok").length;
    const live = findings.filter((f) => f.probe.status === "missing").length;
    return { total, stale, live };
  }, [findings]);

  return (
    <>
      <Helmet>
        <title>Publish Diagnostics — Admin</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      <div className="mx-auto max-w-5xl px-4 py-10">
        <header className="mb-8">
          <h1 className="font-serif text-3xl text-foreground">Publish Diagnostics</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Distinguish stale build errors from currently reproducible ones.
            Probes hit the running dev server, so &ldquo;OK&rdquo; here means the
            import resolves <em>right now</em>.
          </p>
        </header>

        {/* ── Asset probes ───────────────────────────────────────── */}
        <Card className="mb-8 p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-serif text-xl text-foreground">Known asset imports</h2>
              <p className="text-xs text-muted-foreground">
                Imports recently involved in failed builds. All should be OK.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={runKnownProbes}
              disabled={probing}
              className="min-h-[44px]"
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${probing ? "animate-spin" : ""}`} />
              Re-check
            </Button>
          </div>
          <ul className="divide-y divide-border">
            {KNOWN_IMPORT_CHECKS.map(({ label, url }) => {
              const p = probes[url] ?? { path: url, status: "checking" as const };
              return (
                <li key={url} className="flex items-center justify-between gap-4 py-2.5">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium text-foreground">{label}</div>
                    <div className="truncate font-mono text-xs text-muted-foreground">{url}</div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <StatusPill status={p.status} />
                  </div>
                </li>
              );
            })}
          </ul>
        </Card>

        {/* ── Build log analyzer ─────────────────────────────────── */}
        <Card className="mb-8 p-6">
          <h2 className="font-serif text-xl text-foreground">Analyze a build log</h2>
          <p className="mb-3 text-xs text-muted-foreground">
            Paste the failed publish log (or a chunk of dev-server output). We
            extract every <code className="rounded bg-muted px-1">Failed to resolve import</code> line
            and re-probe it. Anything reported &ldquo;OK&rdquo; is stale.
          </p>
          <Textarea
            value={logText}
            onChange={(e) => setLogText(e.target.value)}
            placeholder='Paste log here, e.g. [vite] Internal server error: Failed to resolve import "@/assets/endorsers/rick-hanson.png" from "src/components/homepage/SocialProof.tsx"…'
            className="min-h-[160px] font-mono text-xs"
          />
          <div className="mt-3 flex items-center gap-3">
            <Button onClick={analyzeLog} disabled={analyzing || !logText.trim()} className="min-h-[44px]">
              {analyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing
                </>
              ) : (
                "Analyze log"
              )}
            </Button>
            {findings.length > 0 && (
              <div className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{summary.total}</span> unique
                import error(s) ·{" "}
                <span className="font-medium text-emerald-700">{summary.stale} stale</span> ·{" "}
                <span className="font-medium text-rose-700">{summary.live} reproducible</span>
              </div>
            )}
          </div>

          {findings.length > 0 && (
            <ul className="mt-5 divide-y divide-border">
              {findings.map((f, i) => (
                <li key={i} className="py-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate font-mono text-sm text-foreground">
                        {f.importPath}
                      </div>
                      <div className="mt-0.5 truncate font-mono text-xs text-muted-foreground">
                        probed → {f.resolvedPath}
                      </div>
                      {f.probe.detail && f.probe.status !== "ok" && (
                        <div className="mt-1 text-xs text-muted-foreground">
                          {f.probe.detail}
                        </div>
                      )}
                    </div>
                    <div className="shrink-0">
                      <StatusPill status={f.probe.status} />
                      <div className="mt-1 text-right text-[10px] uppercase tracking-wide text-muted-foreground">
                        {f.probe.status === "ok"
                          ? "stale"
                          : f.probe.status === "missing"
                            ? "reproducible"
                            : ""}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* ── Live runtime errors ────────────────────────────────── */}
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-serif text-xl text-foreground">Live runtime errors</h2>
              <p className="text-xs text-muted-foreground">
                Captured since this page loaded. Most recent first (max 50).
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setRuntimeErrors([])}
              className="min-h-[44px]"
            >
              Clear
            </Button>
          </div>
          {runtimeErrors.length === 0 ? (
            <div className="rounded-md border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
              No errors captured yet.
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {runtimeErrors.map((e) => (
                <li key={e.id} className="py-2.5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="font-mono text-xs text-foreground line-clamp-3">
                        {e.message}
                      </div>
                      <div className="mt-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
                        {new Date(e.ts).toLocaleTimeString()} · {e.source}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </>
  );
}
