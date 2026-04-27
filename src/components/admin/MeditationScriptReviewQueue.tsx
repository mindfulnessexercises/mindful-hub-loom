import { useEffect, useMemo, useState } from "react";
import { Check, X, Search, Copy, ExternalLink, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { wp, type WPPost } from "@/lib/wp";
import { MEDITATION_SCRIPTS } from "@/lib/meditation-scripts";

/**
 * Review queue for orphan PDFs (files in /public/sample-scripts/ that don't
 * have an exact slug match in MEDITATION_SCRIPTS). For each one we suggest
 * candidate posts from the Meditation Scripts WP category and let the admin
 * approve a slug binding or skip the file. Decisions are staged in
 * localStorage; a "Copy registry patch" button emits ready-to-paste TS for
 * src/lib/meditation-scripts.ts.
 *
 * This is a client-only staging tool — it does NOT mutate source files. The
 * admin must paste the generated patch into meditation-scripts.ts to ship
 * decisions.
 */

const MEDITATION_SCRIPTS_CATEGORY_ID = 9421;
const STORAGE_KEY = "meditation-scripts:review-queue:v1";

type Decision =
  | { kind: "approved"; slug: string; postTitle?: string }
  | { kind: "skipped" };

type DecisionMap = Record<string, Decision>;

interface OrphanPdf {
  filename: string;
  bytes?: number;
}

interface Candidate {
  slug: string;
  title: string;
  score: number;
}

/** Strip extension and turn filename into a slug-shaped candidate. */
function filenameToSlug(filename: string): string {
  return filename.replace(/\.pdf$/i, "");
}

function filenameToTitle(filename: string): string {
  return filenameToSlug(filename)
    .split("-")
    .map((w) => (w.length <= 2 ? w : w[0].toUpperCase() + w.slice(1)))
    .join(" ");
}

function formatBytes(bytes?: number): string {
  if (bytes === undefined) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Token-overlap score between two slugs. Higher is better. */
function similarity(a: string, b: string): number {
  const ta = new Set(a.split(/[-\s]+/).filter((t) => t.length > 2));
  const tb = new Set(b.split(/[-\s]+/).filter((t) => t.length > 2));
  if (ta.size === 0 || tb.size === 0) return 0;
  let overlap = 0;
  ta.forEach((t) => {
    if (tb.has(t)) overlap++;
  });
  return overlap / Math.max(ta.size, tb.size);
}

function loadDecisions(): DecisionMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveDecisions(map: DecisionMap) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
    /* storage full / disabled — silent */
  }
}

interface Props {
  orphans: OrphanPdf[];
}

export default function MeditationScriptReviewQueue({ orphans }: Props) {
  const [decisions, setDecisions] = useState<DecisionMap>(() => loadDecisions());
  const [categoryPosts, setCategoryPosts] = useState<WPPost[]>([]);
  const [loadingCategory, setLoadingCategory] = useState(true);
  const [customSlugs, setCustomSlugs] = useState<Record<string, string>>({});

  const registeredSlugs = useMemo(() => new Set(Object.keys(MEDITATION_SCRIPTS)), []);

  // Pull all posts in the Meditation Scripts category once so we can suggest
  // matches without N round-trips.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const all: WPPost[] = [];
        let page = 1;
        // Cap at 5 pages * 100 = 500 posts; category currently has ~200.
        while (page <= 5) {
          const res = await wp.posts(
            { categories: MEDITATION_SCRIPTS_CATEGORY_ID, per_page: 100, page },
            { ttl: 600 },
          );
          all.push(...res.items);
          if (res.items.length < 100) break;
          page++;
        }
        if (!cancelled) setCategoryPosts(all);
      } catch {
        /* fall through; UI will show no candidates */
      } finally {
        if (!cancelled) setLoadingCategory(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  function suggestionsFor(filename: string): Candidate[] {
    const baseSlug = filenameToSlug(filename);
    return categoryPosts
      .filter((p) => !registeredSlugs.has(p.slug))
      .map((p) => ({
        slug: p.slug,
        title: p.title.rendered,
        score: similarity(baseSlug, p.slug),
      }))
      .filter((c) => c.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  }

  function setDecision(filename: string, decision: Decision | undefined) {
    setDecisions((prev) => {
      const next = { ...prev };
      if (decision) next[filename] = decision;
      else delete next[filename];
      saveDecisions(next);
      return next;
    });
  }

  const pending = orphans.filter((o) => !decisions[o.filename]);
  const approved = orphans.filter((o) => decisions[o.filename]?.kind === "approved");
  const skipped = orphans.filter((o) => decisions[o.filename]?.kind === "skipped");

  function patchTs(): string {
    const lines: string[] = [
      "// === Approved bindings from the review queue ===",
      "// Paste these inside the MEDITATION_SCRIPTS object literal.",
      "",
    ];
    for (const o of approved) {
      const d = decisions[o.filename];
      if (d?.kind !== "approved") continue;
      const title = d.postTitle?.replace(/<[^>]+>/g, "").trim() || filenameToTitle(o.filename);
      const size = o.bytes ? `${Math.round(o.bytes / 1024)} KB` : "TBD";
      lines.push(`  "${d.slug}": {`);
      lines.push(`    pdfUrl: "/sample-scripts/${o.filename}",`);
      lines.push(`    title: ${JSON.stringify(title)},`);
      lines.push(`    fileSize: "${size}",`);
      lines.push(`    flagged: true,`);
      lines.push(`  },`);
    }
    return lines.join("\n");
  }

  async function copyPatch() {
    try {
      await navigator.clipboard.writeText(patchTs());
    } catch {
      /* ignore */
    }
  }

  if (orphans.length === 0) return null;

  return (
    <Card className="mb-8">
      <CardHeader>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-muted-foreground" />
              Review queue ({pending.length} pending)
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
              PDFs without an exact slug match. Pick a candidate post or enter
              a custom slug, then approve. Decisions stage in your browser —
              hit <em>Copy registry patch</em> when done and paste into{" "}
              <code>src/lib/meditation-scripts.ts</code>.
            </p>
          </div>
          <div className="flex gap-2 items-center">
            <Badge variant="outline">{approved.length} approved</Badge>
            <Badge variant="outline">{skipped.length} skipped</Badge>
            <Button
              size="sm"
              variant="outline"
              onClick={copyPatch}
              disabled={approved.length === 0}
            >
              <Copy className="h-3.5 w-3.5 mr-1.5" />
              Copy registry patch
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {loadingCategory && (
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Loading candidate posts from the Meditation Scripts category…
          </p>
        )}

        {orphans.map((o) => {
          const decision = decisions[o.filename];
          const suggestions = suggestionsFor(o.filename);
          const custom = customSlugs[o.filename] ?? "";
          return (
            <div
              key={o.filename}
              className="border rounded-md p-4 bg-card"
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="min-w-0">
                  <div className="font-mono text-xs text-muted-foreground truncate">
                    {o.filename}
                  </div>
                  <div className="text-sm font-medium mt-0.5">
                    {filenameToTitle(o.filename)}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {formatBytes(o.bytes)}
                    {" · "}
                    <a
                      href={`/sample-scripts/${o.filename}`}
                      target="_blank"
                      rel="noopener"
                      className="underline hover:no-underline"
                    >
                      Open PDF
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {decision?.kind === "approved" && (
                    <Badge className="bg-green-100 text-green-900 hover:bg-green-100">
                      <Check className="h-3 w-3 mr-1" />
                      Approved → {decision.slug}
                    </Badge>
                  )}
                  {decision?.kind === "skipped" && (
                    <Badge variant="secondary">
                      <X className="h-3 w-3 mr-1" /> Skipped
                    </Badge>
                  )}
                  {decision && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setDecision(o.filename, undefined)}
                    >
                      Reset
                    </Button>
                  )}
                </div>
              </div>

              {!decision && (
                <div className="mt-3 space-y-2">
                  {suggestions.length > 0 ? (
                    <div className="space-y-1.5">
                      <div className="text-xs uppercase tracking-wide text-muted-foreground">
                        Candidate posts
                      </div>
                      {suggestions.map((c) => (
                        <div
                          key={c.slug}
                          className="flex items-center justify-between gap-2 text-sm border rounded px-2.5 py-1.5"
                        >
                          <div className="min-w-0 flex items-center gap-2">
                            <span
                              className="truncate"
                              dangerouslySetInnerHTML={{ __html: c.title }}
                            />
                            <span className="font-mono text-xs text-muted-foreground shrink-0">
                              {c.slug}
                            </span>
                            <a
                              href={`/${c.slug}`}
                              target="_blank"
                              rel="noopener"
                              className="text-muted-foreground shrink-0"
                              aria-label="Open post"
                            >
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-xs text-muted-foreground">
                              {Math.round(c.score * 100)}% match
                            </span>
                            <Button
                              size="sm"
                              onClick={() =>
                                setDecision(o.filename, {
                                  kind: "approved",
                                  slug: c.slug,
                                  postTitle: c.title,
                                })
                              }
                            >
                              Approve
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    !loadingCategory && (
                      <p className="text-xs text-muted-foreground">
                        No close matches in the Meditation Scripts category.
                      </p>
                    )
                  )}

                  <div className="flex items-center gap-2 pt-1">
                    <Input
                      placeholder="Custom post slug (e.g. my-post-slug)"
                      value={custom}
                      onChange={(e) =>
                        setCustomSlugs((prev) => ({
                          ...prev,
                          [o.filename]: e.target.value.trim(),
                        }))
                      }
                      className="h-8 text-sm font-mono"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={!custom}
                      onClick={() =>
                        setDecision(o.filename, {
                          kind: "approved",
                          slug: custom,
                        })
                      }
                    >
                      Use slug
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setDecision(o.filename, { kind: "skipped" })}
                    >
                      Skip
                    </Button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
