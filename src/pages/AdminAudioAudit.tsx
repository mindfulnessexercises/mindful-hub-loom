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
import { supabase } from "@/integrations/supabase/client";
import { INLINE_AUDIO_SECTIONS } from "@/lib/inline-audio-sections";

/**
 * Internal admin page that audits audio_url mappings across three sources:
 *
 *   1. `meditations` table rows — flags missing/empty audio_url and HEAD-checks
 *      every URL to surface broken (404) or non-audio responses.
 *   2. Inline audio registry (`INLINE_AUDIO_SECTIONS`) — HEAD-checks every
 *      track src referenced from a WP post slug.
 *   3. Storage bucket `meditation-audio` — recursively lists every object and
 *      reports files that are NOT referenced by either source above
 *      ("unmapped" / orphan uploads).
 *
 * Noindex via meta tag — internal tooling.
 */

const SUPABASE_URL = "https://glpbynaneshuhmjtbpsa.supabase.co";
const BUCKET = "meditation-audio";
const PUBLIC_PREFIX = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/`;

type CheckStatus = "pending" | "ok" | "missing" | "broken" | "wrong-type";

interface MeditationRow {
  slug: string;
  title: string;
  audio_url: string | null;
  status: CheckStatus;
  httpStatus?: number;
  contentType?: string | null;
  error?: string;
}

interface InlineRow {
  postSlug: string;
  label: string;
  match: string;
  src: string;
  status: CheckStatus;
  httpStatus?: number;
}

interface StorageFile {
  path: string;
  publicUrl: string;
  sizeBytes?: number;
  mimeType?: string | null;
  referencedBy: string[]; // human-readable list of where it's referenced
}

async function headCheck(url: string): Promise<{ status: CheckStatus; httpStatus?: number; contentType?: string | null }> {
  try {
    const res = await fetch(url, { method: "HEAD" });
    const ct = res.headers.get("content-type");
    if (!res.ok) return { status: "broken", httpStatus: res.status, contentType: ct };
    if (ct && !ct.includes("audio") && !ct.includes("octet-stream") && !ct.includes("mpeg")) {
      return { status: "wrong-type", httpStatus: res.status, contentType: ct };
    }
    return { status: "ok", httpStatus: res.status, contentType: ct };
  } catch (e) {
    return { status: "broken", httpStatus: undefined, contentType: null };
  }
}

async function listAllStorageFiles(prefix = ""): Promise<StorageFile[]> {
  const { data, error } = await supabase.storage.from(BUCKET).list(prefix, {
    limit: 1000,
    sortBy: { column: "name", order: "asc" },
  });
  if (error || !data) return [];

  const out: StorageFile[] = [];
  for (const item of data) {
    // Folders have id === null in supabase storage list responses
    const isFolder = (item as any).id === null;
    const subPath = prefix ? `${prefix}${item.name}` : item.name;
    if (isFolder) {
      const nested = await listAllStorageFiles(`${subPath}/`);
      out.push(...nested);
    } else {
      const meta = (item as any).metadata ?? {};
      out.push({
        path: subPath,
        publicUrl: `${PUBLIC_PREFIX}${subPath}`,
        sizeBytes: meta.size,
        mimeType: meta.mimetype ?? null,
        referencedBy: [],
      });
    }
  }
  return out;
}

function StatusBadge({ status }: { status: CheckStatus }) {
  if (status === "ok") return <Badge variant="outline" className="border-green-500/40 text-green-700 dark:text-green-400"><CheckCircle2 className="mr-1 h-3 w-3" />OK</Badge>;
  if (status === "missing") return <Badge variant="outline" className="border-red-500/40 text-red-700 dark:text-red-400"><XCircle className="mr-1 h-3 w-3" />Missing</Badge>;
  if (status === "broken") return <Badge variant="outline" className="border-red-500/40 text-red-700 dark:text-red-400"><XCircle className="mr-1 h-3 w-3" />Broken</Badge>;
  if (status === "wrong-type") return <Badge variant="outline" className="border-amber-500/40 text-amber-700 dark:text-amber-400"><AlertTriangle className="mr-1 h-3 w-3" />Wrong type</Badge>;
  return <Badge variant="outline">…</Badge>;
}

function formatBytes(n?: number) {
  if (!n) return "—";
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(2)} MB`;
}

export default function AdminAudioAudit() {
  const [loading, setLoading] = useState(true);
  const [meditations, setMeditations] = useState<MeditationRow[]>([]);
  const [inlineRows, setInlineRows] = useState<InlineRow[]>([]);
  const [storage, setStorage] = useState<StorageFile[]>([]);
  const [runId, setRunId] = useState(0);

  useEffect(() => {
    document.title = "Audio Mapping Audit · Admin";
    const meta = document.querySelector('meta[name="robots"]');
    if (meta) meta.setAttribute("content", "noindex,nofollow");
    else {
      const m = document.createElement("meta");
      m.name = "robots";
      m.content = "noindex,nofollow";
      document.head.appendChild(m);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setLoading(true);

      // 1. Pull meditations
      const { data: medsData } = await supabase
        .from("meditations")
        .select("slug,title,audio_url")
        .order("slug");

      const meds: MeditationRow[] = (medsData ?? []).map((m) => ({
        slug: m.slug,
        title: m.title,
        audio_url: m.audio_url,
        status: m.audio_url ? "pending" : "missing",
      }));

      // 2. Build inline rows
      const inline: InlineRow[] = [];
      for (const [postSlug, tracks] of Object.entries(INLINE_AUDIO_SECTIONS)) {
        for (const t of tracks) {
          inline.push({
            postSlug,
            label: t.label,
            match: t.match,
            src: t.src,
            status: "pending",
          });
        }
      }

      // 3. List storage
      const files = await listAllStorageFiles();

      if (cancelled) return;
      setMeditations(meds);
      setInlineRows(inline);
      setStorage(files);

      // 4. HEAD-check every URL in parallel (capped concurrency)
      const checkedMeds = await Promise.all(
        meds.map(async (m) => {
          if (!m.audio_url) return m;
          const r = await headCheck(m.audio_url);
          return { ...m, ...r };
        }),
      );

      const checkedInline = await Promise.all(
        inline.map(async (r) => {
          const c = await headCheck(r.src);
          return { ...r, status: c.status, httpStatus: c.httpStatus };
        }),
      );

      // 5. Cross-reference storage files vs. references
      const refIndex = new Map<string, string[]>();
      const addRef = (url: string, label: string) => {
        if (!url || !url.startsWith(PUBLIC_PREFIX)) return;
        const path = url.slice(PUBLIC_PREFIX.length).split("?")[0];
        const list = refIndex.get(path) ?? [];
        list.push(label);
        refIndex.set(path, list);
      };
      for (const m of checkedMeds) if (m.audio_url) addRef(m.audio_url, `meditations:${m.slug}`);
      for (const r of checkedInline) addRef(r.src, `inline:${r.postSlug}#${r.match}`);

      const annotatedStorage = files.map((f) => ({
        ...f,
        referencedBy: refIndex.get(f.path) ?? [],
      }));

      if (cancelled) return;
      setMeditations(checkedMeds);
      setInlineRows(checkedInline);
      setStorage(annotatedStorage);
      setLoading(false);
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [runId]);

  const summary = useMemo(() => {
    const medMissing = meditations.filter((m) => m.status === "missing").length;
    const medBroken = meditations.filter((m) => m.status === "broken" || m.status === "wrong-type").length;
    const inlineBroken = inlineRows.filter((r) => r.status === "broken" || r.status === "wrong-type").length;
    const unmapped = storage.filter((f) => f.referencedBy.length === 0).length;
    return { medMissing, medBroken, inlineBroken, unmapped, totalFiles: storage.length };
  }, [meditations, inlineRows, storage]);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-14">
        <div className="mb-8 flex items-center justify-between gap-4">
          <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to site
          </Link>
          <Button variant="outline" size="sm" onClick={() => setRunId((n) => n + 1)} disabled={loading}>
            <RefreshCcw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Re-run
          </Button>
        </div>

        <header className="mb-10">
          <h1 className="font-serif text-4xl tracking-tight md:text-5xl">Audio Mapping Audit</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Cross-references the <code className="rounded bg-muted px-1">meditations</code> table, inline audio
            registry, and the <code className="rounded bg-muted px-1">{BUCKET}</code> storage bucket to surface
            missing, broken, or orphan audio files.
          </p>
        </header>

        {/* Summary cards */}
        <section className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard label="Meditations w/o audio_url" value={summary.medMissing} tone={summary.medMissing ? "warn" : "ok"} />
          <SummaryCard label="Meditations w/ broken URL" value={summary.medBroken} tone={summary.medBroken ? "bad" : "ok"} />
          <SummaryCard label="Inline tracks broken" value={summary.inlineBroken} tone={summary.inlineBroken ? "bad" : "ok"} />
          <SummaryCard label={`Unmapped files (of ${summary.totalFiles})`} value={summary.unmapped} tone={summary.unmapped ? "warn" : "ok"} />
        </section>

        {/* 1. meditations table */}
        <Card className="mb-10">
          <CardHeader>
            <CardTitle className="font-serif text-2xl">Meditations table</CardTitle>
            <p className="text-sm text-muted-foreground">
              Every row in <code className="rounded bg-muted px-1">public.meditations</code> with a HEAD-check on{" "}
              <code className="rounded bg-muted px-1">audio_url</code>.
            </p>
          </CardHeader>
          <CardContent>
            {loading && meditations.length === 0 ? (
              <Skeleton className="h-32 w-full" />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Slug</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>HTTP</TableHead>
                    <TableHead>Audio URL</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {meditations.map((m) => (
                    <TableRow key={m.slug}>
                      <TableCell className="font-mono text-xs">{m.slug}</TableCell>
                      <TableCell className="max-w-xs truncate">{m.title}</TableCell>
                      <TableCell><StatusBadge status={m.status} /></TableCell>
                      <TableCell className="text-xs">{m.httpStatus ?? "—"}</TableCell>
                      <TableCell className="max-w-md truncate text-xs">
                        {m.audio_url ? (
                          <a href={m.audio_url} target="_blank" rel="noreferrer" className="inline-flex items-center text-primary hover:underline">
                            {m.audio_url.replace(PUBLIC_PREFIX, "…/")} <ExternalLink className="ml-1 h-3 w-3" />
                          </a>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* 2. inline registry */}
        <Card className="mb-10">
          <CardHeader>
            <CardTitle className="font-serif text-2xl">Inline audio registry</CardTitle>
            <p className="text-sm text-muted-foreground">
              Per-section players defined in <code className="rounded bg-muted px-1">src/lib/inline-audio-sections.ts</code>.
            </p>
          </CardHeader>
          <CardContent>
            {loading && inlineRows.length === 0 ? (
              <Skeleton className="h-32 w-full" />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Post slug</TableHead>
                    <TableHead>Heading match</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>HTTP</TableHead>
                    <TableHead>Source</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inlineRows.map((r) => (
                    <TableRow key={`${r.postSlug}-${r.match}`}>
                      <TableCell className="font-mono text-xs">
                        <Link to={`/${r.postSlug}`} className="text-primary hover:underline">{r.postSlug}</Link>
                      </TableCell>
                      <TableCell className="text-xs">{r.match}</TableCell>
                      <TableCell><StatusBadge status={r.status} /></TableCell>
                      <TableCell className="text-xs">{r.httpStatus ?? "—"}</TableCell>
                      <TableCell className="max-w-md truncate text-xs">
                        <a href={r.src} target="_blank" rel="noreferrer" className="inline-flex items-center text-primary hover:underline">
                          {r.src.replace(PUBLIC_PREFIX, "…/")} <ExternalLink className="ml-1 h-3 w-3" />
                        </a>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* 3. storage files */}
        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-2xl">Storage bucket: {BUCKET}</CardTitle>
            <p className="text-sm text-muted-foreground">
              Every object in the bucket. Rows highlighted in amber are <strong>unmapped</strong> — they exist in
              storage but are not referenced from the meditations table or the inline registry.
            </p>
          </CardHeader>
          <CardContent>
            {loading && storage.length === 0 ? (
              <Skeleton className="h-32 w-full" />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Path</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>MIME</TableHead>
                    <TableHead>Referenced by</TableHead>
                    <TableHead>Open</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {storage.map((f) => {
                    const unmapped = f.referencedBy.length === 0;
                    return (
                      <TableRow key={f.path} className={unmapped ? "bg-amber-500/5" : undefined}>
                        <TableCell className="font-mono text-xs">{f.path}</TableCell>
                        <TableCell className="text-xs">{formatBytes(f.sizeBytes)}</TableCell>
                        <TableCell className="text-xs">{f.mimeType ?? "—"}</TableCell>
                        <TableCell className="text-xs">
                          {unmapped ? (
                            <Badge variant="outline" className="border-amber-500/40 text-amber-700 dark:text-amber-400">
                              <AlertTriangle className="mr-1 h-3 w-3" /> Unmapped
                            </Badge>
                          ) : (
                            <ul className="space-y-0.5">
                              {f.referencedBy.map((r) => (
                                <li key={r} className="font-mono">{r}</li>
                              ))}
                            </ul>
                          )}
                        </TableCell>
                        <TableCell>
                          <a href={f.publicUrl} target="_blank" rel="noreferrer" className="inline-flex items-center text-xs text-primary hover:underline">
                            Open <ExternalLink className="ml-1 h-3 w-3" />
                          </a>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function SummaryCard({ label, value, tone }: { label: string; value: number; tone: "ok" | "warn" | "bad" }) {
  const toneClass =
    tone === "ok"
      ? "border-green-500/30"
      : tone === "warn"
        ? "border-amber-500/40"
        : "border-red-500/40";
  return (
    <Card className={toneClass}>
      <CardContent className="p-5">
        <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
        <div className="mt-1 font-serif text-3xl">{value}</div>
      </CardContent>
    </Card>
  );
}
