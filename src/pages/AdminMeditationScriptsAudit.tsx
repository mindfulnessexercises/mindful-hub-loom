import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  RefreshCcw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ExternalLink,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  MEDITATION_SCRIPTS,
  type MeditationScriptEntry,
} from "@/lib/meditation-scripts";
import { wp } from "@/lib/wp";
import MeditationScriptReviewQueue from "@/components/admin/MeditationScriptReviewQueue";

/**
 * Internal admin page that audits every meditation-script PDF in
 * /public/sample-scripts/ to verify:
 *   1. The PDF itself is reachable and its served byte size matches the
 *      `fileSize` declared in the MEDITATION_SCRIPTS registry.
 *   2. The registered slug resolves to a real WordPress post (so the embed
 *      will actually render somewhere).
 *   3. PDFs sitting on disk that aren't wired into the registry are
 *      surfaced as "orphans" so we don't ship dead assets.
 *
 * Noindex via meta tag — internal tooling.
 */

// Source of truth for "what's on disk". Update when you add/remove a PDF in
// public/sample-scripts/. Audit will flag any mismatch with the registry.
const PDF_FILES_ON_DISK = [
  "awareness-of-each-of-the-five-senses.pdf",
  "awareness-of-people-just-like-you.pdf",
  "awareness-of-what-you-like-about-yourself.pdf",
  "body-appreciation-meditation.pdf",
  "body-scan-advanced.pdf",
  "body-scan-meditation.pdf",
  "breathing-self-compassion.pdf",
  "chocolate-meditation.pdf",
  "compassion-for-the-whole-body.pdf",
  "compassion-for-your-emotions.pdf",
  "compassion-four-infinite-thoughts.pdf",
  "cultivating-self-care-and-extending-it-out.pdf",
  "daily-practices-for-love-and-happiness.pdf",
  "directional-compassion.pdf",
  "forgiveness-meditation.pdf",
  "grounding-through-body-awareness.pdf",
  "identifying-self-judgment-and-bringing-in-self-compassion.pdf",
  "intention-of-self-compassion.pdf",
  "kindness-for-your-thinking-mind.pdf",
  "letting-go-of-resentments-by-forgiving-faults.pdf",
  "loving-kindness-meditation.pdf",
  "loving-kindness-the-child.pdf",
  "loving-kindness-visualization-the-spheres.pdf",
  "mindfulness-of-food-and-eating.pdf",
  "movement-meditation.pdf",
  "noticing-your-helpers.pdf",
  "ordinary-kindness.pdf",
  "outdoor-meditation.pdf",
  "puppies-meditation.pdf",
  "recognition-and-care-for-those-who-frustrate-you.pdf",
  "recognizing-what-you-need.pdf",
  "seeing-other-people-as-human-beings.pdf",
  "self-compassion-pause.pdf",
  "self-compassion-through-the-body.pdf",
  "self-compassion-visualization-the-blanket-of-love.pdf",
  "writing-meditation.pdf",
] as const;

type PdfStatus = "pending" | "ok" | "size-mismatch" | "missing";
type PostStatus = "pending" | "found" | "not-found" | "error";

interface AuditRow {
  slug: string;
  entry: MeditationScriptEntry;
  pdfStatus: PdfStatus;
  postStatus: PostStatus;
  servedBytes?: number;
  declaredBytes?: number;
  postTitle?: string;
  error?: string;
}

interface OrphanPdf {
  filename: string;
  bytes?: number;
}

/** "199 KB" → 199 * 1024 (rough — Content-Length comparison is loose). */
function parseDeclaredBytes(label?: string): number | undefined {
  if (!label) return undefined;
  const m = label.match(/^([\d.]+)\s*(KB|MB|B)$/i);
  if (!m) return undefined;
  const n = parseFloat(m[1]);
  const unit = m[2].toUpperCase();
  if (unit === "B") return n;
  if (unit === "KB") return Math.round(n * 1024);
  if (unit === "MB") return Math.round(n * 1024 * 1024);
  return undefined;
}

function formatBytes(bytes?: number): string {
  if (bytes === undefined) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Allow ±10% drift before flagging a size mismatch. */
function sizesAgree(served?: number, declared?: number): boolean {
  if (served === undefined || declared === undefined) return false;
  const drift = Math.abs(served - declared) / Math.max(declared, 1);
  return drift <= 0.1;
}

const StatusBadge = ({
  ok,
  warn,
  fail,
  pendingLabel,
  okLabel,
  warnLabel,
  failLabel,
  state,
}: {
  state: "pending" | "ok" | "warn" | "fail";
  ok?: boolean;
  warn?: boolean;
  fail?: boolean;
  pendingLabel: string;
  okLabel: string;
  warnLabel: string;
  failLabel: string;
}) => {
  void ok; void warn; void fail;
  if (state === "pending") return <Badge variant="secondary">{pendingLabel}</Badge>;
  if (state === "ok") {
    return (
      <Badge className="bg-green-100 text-green-900 hover:bg-green-100">
        <CheckCircle2 className="h-3 w-3 mr-1" /> {okLabel}
      </Badge>
    );
  }
  if (state === "warn") {
    return (
      <Badge className="bg-amber-100 text-amber-900 hover:bg-amber-100">
        <AlertTriangle className="h-3 w-3 mr-1" /> {warnLabel}
      </Badge>
    );
  }
  return (
    <Badge variant="destructive">
      <XCircle className="h-3 w-3 mr-1" /> {failLabel}
    </Badge>
  );
};

export default function AdminMeditationScriptsAudit() {
  const [rows, setRows] = useState<AuditRow[]>([]);
  const [orphans, setOrphans] = useState<OrphanPdf[]>([]);
  const [running, setRunning] = useState(false);
  const [runId, setRunId] = useState(0);

  const registrySlugs = useMemo(() => Object.keys(MEDITATION_SCRIPTS), []);

  useEffect(() => {
    let cancelled = false;
    const seed: AuditRow[] = registrySlugs.map((slug) => ({
      slug,
      entry: MEDITATION_SCRIPTS[slug],
      pdfStatus: "pending",
      postStatus: "pending",
      declaredBytes: parseDeclaredBytes(MEDITATION_SCRIPTS[slug].fileSize),
    }));
    setRows(seed);

    const usedFilenames = new Set<string>(
      registrySlugs.map((s) =>
        MEDITATION_SCRIPTS[s].pdfUrl.replace(/^\/sample-scripts\//, ""),
      ),
    );
    const orphanFilenames = PDF_FILES_ON_DISK.filter(
      (f) => !usedFilenames.has(f),
    );
    setOrphans(orphanFilenames.map((filename) => ({ filename })));
    setRunning(true);

    async function checkPdf(row: AuditRow): Promise<Partial<AuditRow>> {
      try {
        const res = await fetch(row.entry.pdfUrl, { method: "HEAD" });
        if (!res.ok) {
          return { pdfStatus: "missing", error: `HTTP ${res.status}` };
        }
        const len = res.headers.get("content-length");
        const served = len ? parseInt(len, 10) : undefined;
        const declared = row.declaredBytes;
        const ok =
          declared === undefined || sizesAgree(served, declared) ? "ok" : "size-mismatch";
        return { pdfStatus: ok, servedBytes: served };
      } catch (e) {
        return { pdfStatus: "missing", error: e instanceof Error ? e.message : String(e) };
      }
    }

    async function checkPost(row: AuditRow): Promise<Partial<AuditRow>> {
      try {
        const post = await wp.postBySlug(row.slug);
        if (!post) return { postStatus: "not-found" };
        return { postStatus: "found", postTitle: post.title.rendered };
      } catch (e) {
        return {
          postStatus: "error",
          error: e instanceof Error ? e.message : String(e),
        };
      }
    }

    async function checkOrphan(filename: string): Promise<OrphanPdf> {
      try {
        const res = await fetch(`/sample-scripts/${filename}`, {
          method: "HEAD",
        });
        const len = res.headers.get("content-length");
        return { filename, bytes: len ? parseInt(len, 10) : undefined };
      } catch {
        return { filename };
      }
    }

    (async () => {
      // Run all checks in parallel, write results into state as each settles.
      const updates = seed.map(async (row) => {
        const [pdf, post] = await Promise.all([checkPdf(row), checkPost(row)]);
        if (cancelled) return;
        setRows((prev) =>
          prev.map((r) =>
            r.slug === row.slug ? { ...r, ...pdf, ...post } : r,
          ),
        );
      });
      const orphanUpdates = orphanFilenames.map(async (f) => {
        const result = await checkOrphan(f);
        if (cancelled) return;
        setOrphans((prev) =>
          prev.map((o) => (o.filename === f ? result : o)),
        );
      });
      await Promise.all([...updates, ...orphanUpdates]);
      if (!cancelled) setRunning(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [registrySlugs, runId]);

  const summary = useMemo(() => {
    const total = rows.length;
    const pdfOk = rows.filter((r) => r.pdfStatus === "ok").length;
    const pdfWarn = rows.filter((r) => r.pdfStatus === "size-mismatch").length;
    const pdfFail = rows.filter((r) => r.pdfStatus === "missing").length;
    const postOk = rows.filter((r) => r.postStatus === "found").length;
    const postFail = rows.filter(
      (r) => r.postStatus === "not-found" || r.postStatus === "error",
    ).length;
    return { total, pdfOk, pdfWarn, pdfFail, postOk, postFail };
  }, [rows]);

  return (
    <div className="min-h-screen bg-background">
      <head>
        <meta name="robots" content="noindex,nofollow" />
        <title>Meditation Scripts Audit — Admin</title>
      </head>

      <main className="container mx-auto max-w-6xl px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Button asChild variant="ghost" size="sm" className="mb-2 -ml-2">
              <Link to="/" className="inline-flex items-center gap-1.5">
                <ArrowLeft className="h-4 w-4" /> Home
              </Link>
            </Button>
            <h1 className="font-serif text-3xl text-foreground">
              Meditation Scripts Audit
            </h1>
            <p className="text-muted-foreground mt-1 max-w-2xl">
              Verifies every PDF in the registry is reachable, that its served
              size matches what we declare, and that the slug resolves to a
              live WordPress post.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => setRunId((n) => n + 1)}
            disabled={running}
          >
            <RefreshCcw className={`h-4 w-4 mr-2 ${running ? "animate-spin" : ""}`} />
            Re-run
          </Button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground font-normal">
                Registered
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-serif">{summary.total}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground font-normal">
                PDFs OK
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-serif text-green-700">
                {summary.pdfOk}
              </p>
              {summary.pdfWarn + summary.pdfFail > 0 && (
                <p className="text-xs text-muted-foreground mt-1">
                  {summary.pdfWarn} size drift · {summary.pdfFail} missing
                </p>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground font-normal">
                Post matches
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-serif text-green-700">
                {summary.postOk}
              </p>
              {summary.postFail > 0 && (
                <p className="text-xs text-destructive mt-1">
                  {summary.postFail} unresolved
                </p>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground font-normal">
                Orphan PDFs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-serif">
                {orphans.length === 0 ? (
                  <span className="text-green-700">0</span>
                ) : (
                  <span className="text-amber-700">{orphans.length}</span>
                )}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                On disk, not in registry
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Registered embeds</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>PDF title</TableHead>
                  <TableHead>Post slug</TableHead>
                  <TableHead>PDF</TableHead>
                  <TableHead>Size (declared / served)</TableHead>
                  <TableHead>Live post</TableHead>
                  <TableHead className="text-right">Open</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => {
                  const flagged = row.entry.flagged;
                  const pdfState: "pending" | "ok" | "warn" | "fail" =
                    row.pdfStatus === "pending"
                      ? "pending"
                      : row.pdfStatus === "ok"
                        ? "ok"
                        : row.pdfStatus === "size-mismatch"
                          ? "warn"
                          : "fail";
                  const postState: "pending" | "ok" | "warn" | "fail" =
                    row.postStatus === "pending"
                      ? "pending"
                      : row.postStatus === "found"
                        ? "ok"
                        : "fail";
                  return (
                    <TableRow key={row.slug}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                          <span>{row.entry.title}</span>
                          {flagged && (
                            <Badge variant="outline" className="text-amber-700 border-amber-300">
                              Flagged
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {row.slug}
                      </TableCell>
                      <TableCell>
                        <StatusBadge
                          state={pdfState}
                          pendingLabel="Checking…"
                          okLabel="OK"
                          warnLabel="Size drift"
                          failLabel="Missing"
                        />
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                        {row.entry.fileSize ?? "—"}
                        {" / "}
                        {formatBytes(row.servedBytes)}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <StatusBadge
                            state={postState}
                            pendingLabel="Resolving…"
                            okLabel="Found"
                            warnLabel="Drift"
                            failLabel={row.postStatus === "error" ? "Error" : "Not found"}
                          />
                          {row.postTitle && (
                            <div
                              className="text-xs text-muted-foreground truncate max-w-[18rem]"
                              dangerouslySetInnerHTML={{ __html: row.postTitle }}
                            />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="inline-flex gap-1">
                          <Button asChild variant="ghost" size="sm">
                            <a href={row.entry.pdfUrl} target="_blank" rel="noopener">
                              PDF <ExternalLink className="h-3 w-3 ml-1" />
                            </a>
                          </Button>
                          <Button asChild variant="ghost" size="sm">
                            <Link to={`/${row.slug}`}>
                              Post <ExternalLink className="h-3 w-3 ml-1" />
                            </Link>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <MeditationScriptReviewQueue orphans={orphans} />
      </main>
    </div>
  );
}
