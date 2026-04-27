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
  "5-minute-standing-meditation.pdf",
  "5-minutes-to-regain-calm-clarity-and-confidence.pdf",
  "awareness-of-each-of-the-five-senses.pdf",
  "awareness-of-four-elements.pdf",
  "awareness-of-people-just-like-you.pdf",
  "awareness-of-smell-while-walking.pdf",
  "awareness-of-the-bodys-points-of-contact.pdf",
  "awareness-of-what-you-like-about-yourself.pdf",
  "awareness-when-walking.pdf",
  "being-still.pdf",
  "12-intentions-of-gratitude.pdf",
  "5-minute-simple-breathing-meditation.pdf",
  "breathing-for-medium-amounts-of-stress.pdf",
  "dropping-the-suitcases-of-worries-and-regrets.pdf",
  "easing-the-mind.pdf",
  "extending-the-exhale.pdf",
  "focused-attention-to-settle-the-mind.pdf",
  "mindful-media.pdf",
  "notice-and-accept-your-body-in-the-present-moment.pdf",
  "noting-thoughts-to-see-where-the-mind-is.pdf",
  "re-relaxing-the-drifting-mind-with-a-home-base.pdf",
  "stilling-the-mind.pdf",
  "soft-belly-breathing.pdf",
  "simply-stopping.pdf",
  "relieving-stress-with-sbnrr.pdf",
  "mindfulness-of-speech.pdf",
  "mindful-speech.pdf",
  "meditation-with-a-pet.pdf",
  "whats-your-weather-like-kids.pdf",
  "sounds-and-silence-kids.pdf",
  "mindfulness-for-kids.pdf",
  "reflecting-on-a-role-model.pdf",
  "being-present-for-your-baby.pdf",
  "connecting-with-your-baby.pdf",
  "focusing-on-pregnancy-and-motherhood.pdf",
  "focusing-on-your-happy-baby.pdf",
  "gratitude-for-pregnancy.pdf",
  "teen-meditation-to-believe-in-yourself.pdf",
  "listening-and-speaking-with-a-partner.pdf",
  "mindfulness-while-speaking-with-others.pdf",
  "focused-attention-and-concentration.pdf",
  "cultivating-joyful-effort.pdf",
  "boosting-your-brainwaves.pdf",
  "get-better-at-feeling-and-noticing.pdf",
  "awareness-of-using-social-media.pdf",
  "becoming-motivated.pdf",
  "building-confidence-for-social-settings-and-meeting-new-people.pdf",
  "financial-abundance.pdf",
  "focus-extreme-concentration.pdf",
  "focus-and-eliminating-distractions.pdf",
  "focusing-on-healthy-food-choices.pdf",
  "learning-how-to-focus-by-focusing-on-the-details-of-the-day.pdf",
  "setting-goals-and-accomplishing-them.pdf",
  "bringing-energy-and-alertness-to-your-mind.pdf",
  "concentrating-your-mind.pdf",
  "feeling-strong-and-confident.pdf",
  "exploring-yourself-as-a-leader.pdf",
  "motivation-when-you-are-unmotivated.pdf",
  "the-importance-of-daily-practice.pdf",
  "restoring-confidence-when-negatively-impacted.pdf",
  "impermanence.pdf",
  "meditation-on-life-and-death.pdf",
  "your-future-potential.pdf",
  "what-the-world-needs.pdf",
  "mental-subtractions-of-positive-events.pdf",
  "higher-self-meditation.pdf",
  "imagining-your-inner-land-to-build-healthy-boundaries.pdf",
  "imagining-your-tree-of-knowledge.pdf",
  "manifestation-meditation.pdf",
  "mindfulness-while-being-creative.pdf",
  "relieving-anxiety.pdf",
  "relieving-low-amounts-of-stress.pdf",
  "stress-relief-with-breathing.pdf",
  "visualization-of-a-beach-for-well-being.pdf",
  "visualizing-stress-as-a-storm.pdf",
  "a-breathing-anchor-for-your-wandering-mind.pdf",
  "alleviate-stress-with-three-deep-breaths.pdf",
  "bedtime-mindfulness.pdf",
  "breathe-away-anxious-thoughts.pdf",
  "deep-breathing.pdf",
  "for-chaotic-times.pdf",
  "immersing-your-awareness-into-the-breath.pdf",
  "mindfulness-for-anxiety-and-stress.pdf",
  "noting-thinking-or-feeling.pdf",
  "your-peaceful-place-guided-visualization.pdf",
  "a-visualization-to-relax-the-mind-for-deep-sleep.pdf",
  "focusing-on-the-positive-moments-throughout-the-day.pdf",
  "mental-relaxation-for-sleep.pdf",
  "relaxation-for-sleep.pdf",
  "simple-sleep-meditation.pdf",
  "sleep-appreciation.pdf",
  "sleep-longer-with-more-ease.pdf",
  "total-body-relaxation-for-sleep.pdf",
  "visualization-of-a-sleepy-train-ride.pdf",
  "visualizing-a-beautiful-island-for-sleep.pdf",
  "affirmations-of-gratitude.pdf",
  "appreciating-things-in-your-life.pdf",
  "ending-the-day-with-gratitude.pdf",
  "experience-of-gratitude.pdf",
  "filling-your-cup-meditation.pdf",
  "gratitude-and-gladness.pdf",
  "gratitude-appreciating-the-simple-things.pdf",
  "gratitude-for-breath-body-and-mind.pdf",
  "gratitude-for-your-body.pdf",
  "appreciating-the-little-things.pdf",
  "gratitude-is-not-in-the-words.pdf",
  "gratitude-when-youve-got-attitude.pdf",
  "heart-centered-gratitude.pdf",
  "making-room-for-gratitude.pdf",
  "mind-appreciation-meditation.pdf",
  "sharing-gratitude.pdf",
  "starting-the-day-with-gratitude.pdf",
  "the-foundation-for-all-abundance.pdf",
  "the-power-of-gratitude-for-sleep.pdf",
  "releasing-grief-and-bringing-in-the-positive.pdf",
  "releasing-the-pressure-of-emotions.pdf",
  "rewriting-your-bad-day.pdf",
  "stopping-obsessive-thoughts-about-the-past.pdf",
  "understanding-your-emotions.pdf",
  "using-rain-for-difficult-emotions-and-thoughts.pdf",
  "alleviate-feelings-of-anger-and-resentment.pdf",
  "alleviate-your-feeling-of-loneliness.pdf",
  "attending-to-emotional-mental-or-external-difficulties.pdf",
  "build-resilience-to-your-response-to-anger.pdf",
  "clarity-of-your-emotion.pdf",
  "dealing-with-negative-thoughts.pdf",
  "emotion-as-the-object-of-focus.pdf",
  "noting-your-judgments.pdf",
  "recognizing-your-resilience-to-difficulty.pdf",
  "reducing-depression-with-someone-elses-love.pdf",
  "alleviate-depression.pdf",
  "being-mindful-and-present-with-negative-emotions.pdf",
  "classic-five-hindrances.pdf",
  "four-stages-of-meditation.pdf",
  "naming-the-feelings.pdf",
  "observe-judging-with-awareness.pdf",
  "reduce-envy-and-celebrate-others.pdf",
  "staying-with-emotions.pdf",
  "when-you-just-cant-meditate.pdf",
  "when-your-mind-wanders.pdf",
  "pleasant-vs-unpleasant.pdf",
  "several-meditations-in-1.pdf",
  "the-practice-of-smiling.pdf",
  "three-mindful-breaths.pdf",
  "using-a-trigger-for-mindfulness.pdf",
  "using-the-power-of-your-mind.pdf",
  "visualizing-your-peaceful-and-beautiful-place.pdf",
  "whole-body-breathing.pdf",
  "finding-the-breath.pdf",
  "focusing-your-attention-using-breath.pdf",
  "gladdening-the-mind.pdf",
  "growing-happiness-in-the-mind.pdf",
  "intention-to-be-happy.pdf",
  "laying-down-meditation-and-visualizing-a-lake.pdf",
  "mindfulness-while-waiting-in-line.pdf",
  "noticing-what-brings-you-joy.pdf",
  "one-complete-cycle-of-breath.pdf",
  "opening-your-awareness-to-whatever-is-arising.pdf",
  "awareness-in-three-parts-thoughts-senses-and-whole-body.pdf",
  "awareness-of-the-changing-world.pdf",
  "awareness-of-your-problem-without-fixing-it.pdf",
  "awareness-when-you-are-killing-time.pdf",
  "become-aware-then-focus-and-expand-awareness.pdf",
  "breathing-and-noting.pdf",
  "bringing-your-mind-back-from-thoughts.pdf",
  "cultivating-a-stable-mind.pdf",
  "feeling-tones-pleasant-unpleasant-neutral.pdf",
  "visualizing-your-day-as-you-wake-up.pdf",
  "body-appreciation-meditation.pdf",
  "bringing-yourself-into-the-present-moment.pdf",
  "building-abilities-to-communicate-have-patience-and-manage-time.pdf",
  "experience-your-mind-like-an-ocean.pdf",
  "feeling-your-body-and-mind-as-a-lake.pdf",
  "mindfulness-of-breath.pdf",
  "noting-without-identifying.pdf",
  "open-awareness-focus-on-the-breath.pdf",
  "three-mindful-breaths-extended.pdf",
  "what-is-open-awareness.pdf",
  "body-awareness-and-where-it-is.pdf",
  "body-scan-advanced.pdf",
  "body-scan-intermediate.pdf",
  "body-scan-meditation.pdf",
  "body-scan-with-liquid-sunlight.pdf",
  "breathing-and-meditating-for-self-healing.pdf",
  "breathing-self-compassion.pdf",
  "breathing-while-touching-your-fingers.pdf",
  "bringing-awareness-to-the-entire-body.pdf",
  "calming-the-body.pdf",
  "chocolate-meditation.pdf",
  "compassion-for-the-whole-body.pdf",
  "compassion-for-your-emotions.pdf",
  "compassion-four-infinite-thoughts.pdf",
  "concentrating-on-breath-sound-and-sight.pdf",
  "cultivating-equanimity.pdf",
  "cultivating-joy.pdf",
  "cultivating-self-care-and-extending-it-out.pdf",
  "daily-practices-for-love-and-happiness.pdf",
  "directional-compassion.pdf",
  "earth-element.pdf",
  "feeling-your-feet-throughout-the-day.pdf",
  "focusing-on-the-colors-you-see.pdf",
  "forgiveness-meditation.pdf",
  "grounding-body-scan.pdf",
  "grounding-through-body-awareness.pdf",
  "identifying-self-judgment-and-bringing-in-self-compassion.pdf",
  "intention-of-self-compassion.pdf",
  "kindness-for-your-thinking-mind.pdf",
  "letting-go-of-resentments-by-forgiving-faults.pdf",
  "loving-kindness-meditation.pdf",
  "loving-kindness-the-child.pdf",
  "loving-kindness-visualization-the-spheres.pdf",
  "mindful-bathing.pdf",
  "mindful-body.pdf",
  "mindful-cleaning.pdf",
  "mindful-cooking.pdf",
  "mindful-journaling.pdf",
  "mindfulness-of-doing-the-dishes.pdf",
  "mindfulness-of-food-and-eating.pdf",
  "mindfulness-of-the-present-moment-without-any-goals.pdf",
  "mindfulness-when-you-drive.pdf",
  "movement-meditation.pdf",
  "noticing-movement-through-breath.pdf",
  "noticing-your-helpers.pdf",
  "ocean-mind.pdf",
  "one-breath-at-a-time.pdf",
  "open-awareness-for-thoughts-and-senses.pdf",
  "ordinary-kindness.pdf",
  "outdoor-meditation.pdf",
  "power-of-acceptance.pdf",
  "puppies-meditation.pdf",
  "recognition-and-care-for-those-who-frustrate-you.pdf",
  "recognizing-what-you-need.pdf",
  "rhythm-of-the-breath-flowing-through-the-body.pdf",
  "seeing-other-people-as-human-beings.pdf",
  "self-compassion-pause.pdf",
  "self-compassion-through-the-body.pdf",
  "self-compassion-visualization-the-blanket-of-love.pdf",
  "sense-of-sound.pdf",
  "settling-your-mind-by-picturing-your-body-as-a-bowl.pdf",
  "shopping-mindfully.pdf",
  "short-body-scan.pdf",
  "two-minutes-of-mindful-breathing-extended.pdf",
  "using-sounds-as-the-object-of-your-awareness.pdf",
  "walking-meditation.pdf",
  "working-with-boredom.pdf",
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
