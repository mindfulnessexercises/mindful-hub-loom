import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Search, FileText, X } from "lucide-react";
import { wp, stripHtml } from "@/lib/wp";
import { WP_STALE } from "@/lib/wp-cache";
import { Skeleton } from "@/components/ui/skeleton";
import { trackEvent } from "@/lib/analytics";

/**
 * Browseable, filterable index of every meditation-script post in the
 * `meditation-scripts` WP category (id=9421, ~231 posts). Renders inside the
 * /free-guided-meditation-scripts hub so visitors can actually find an
 * individual script — the legacy WP intro buried them in a flat link list.
 *
 * Fetches all pages once (3 calls of 100), then does fast in-memory search +
 * theme-chip filtering. Themes are derived from each title with a simple
 * keyword map, so no per-post manual tagging is required.
 */

const CATEGORY_ID = 9421; // meditation-scripts
const PER_PAGE = 100;

type ScriptItem = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  themes: string[];
};

interface ThemeDef {
  key: string;
  label: string;
  match: RegExp;
}

const THEMES: ThemeDef[] = [
  { key: "anxiety", label: "Anxiety", match: /anxi|worry|panic|fear|nervous/i },
  { key: "stress", label: "Stress", match: /stress|overwhelm|burnout|tension/i },
  { key: "sleep", label: "Sleep", match: /sleep|insomnia|bedtime|night|drift|rest/i },
  { key: "breath", label: "Breath", match: /breath|breathing|inhale|exhale|pranayama/i },
  { key: "body", label: "Body Scan", match: /body scan|body[- ]?awareness|somatic|sensation/i },
  { key: "kids", label: "Kids", match: /kid|child|teen|youth|young/i },
  { key: "compassion", label: "Compassion", match: /compassion|loving[- ]?kindness|metta|kindness/i },
  { key: "gratitude", label: "Gratitude", match: /gratitude|grateful|thank/i },
  { key: "self", label: "Self", match: /self[- ]?love|self[- ]?compassion|self[- ]?worth|self[- ]?esteem|inner/i },
  { key: "nature", label: "Nature", match: /nature|forest|ocean|tree|mountain|garden|earth|element/i },
  { key: "walking", label: "Walking", match: /walk/i },
  { key: "visualization", label: "Visualization", match: /visuali[sz]|imag(?:ery|ine)|picture/i },
  { key: "morning", label: "Morning", match: /morning|wake|start the day/i },
  { key: "short", label: "5-Min & Short", match: /\b(?:1|2|3|5|10)[- ]?minute\b|short|quick/i },
  { key: "groups", label: "Groups", match: /group|workshop|class|team|workplace|corporate/i },
  { key: "grief", label: "Grief & Loss", match: /grief|loss|mourn/i },
  { key: "pain", label: "Pain", match: /pain|chronic|illness/i },
];

function deriveThemes(title: string): string[] {
  const out: string[] = [];
  for (const t of THEMES) if (t.match.test(title)) out.push(t.key);
  return out;
}

async function fetchAllScripts(): Promise<ScriptItem[]> {
  const all: ScriptItem[] = [];
  // 3 pages * 100 covers the 231-post category. Loop until we've got them all.
  for (let page = 1; page <= 5; page++) {
    const res = await wp.posts(
      { categories: CATEGORY_ID, per_page: PER_PAGE, page, orderby: "title", order: "asc" },
      { ttl: WP_STALE.list / 1000 },
    );
    for (const p of res.items) {
      const title = stripHtml(p.title.rendered);
      const excerpt = stripHtml(p.excerpt.rendered).replace(/\s+/g, " ").trim();
      all.push({
        id: p.id,
        slug: p.slug,
        title,
        excerpt,
        themes: deriveThemes(title + " " + excerpt),
      });
    }
    if (page >= res.totalPages) break;
  }
  return all;
}

export function ScriptsBrowser() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["wp", "scripts-browser", CATEGORY_ID],
    queryFn: fetchAllScripts,
    staleTime: WP_STALE.list,
    gcTime: WP_STALE.gc,
  });

  const [search, setSearch] = useState("");
  const [activeTheme, setActiveTheme] = useState<string | null>(null);
  const [visible, setVisible] = useState(24);

  const filtered = useMemo(() => {
    if (!data) return [];
    const q = search.trim().toLowerCase();
    return data.filter((s) => {
      if (activeTheme && !s.themes.includes(activeTheme)) return false;
      if (q && !(s.title.toLowerCase().includes(q) || s.excerpt.toLowerCase().includes(q))) return false;
      return true;
    });
  }, [data, search, activeTheme]);

  // Only show theme chips that actually match at least one script in current data.
  const availableThemes = useMemo(() => {
    if (!data) return [] as ThemeDef[];
    const counts = new Map<string, number>();
    for (const s of data) for (const k of s.themes) counts.set(k, (counts.get(k) ?? 0) + 1);
    return THEMES.filter((t) => (counts.get(t.key) ?? 0) >= 3);
  }, [data]);

  return (
    <section aria-labelledby="scripts-browser" className="not-prose space-y-6">
      <div className="flex flex-col gap-2">
        <h2 id="scripts-browser" className="text-card-heading font-serif text-foreground">
          Browse all guided meditation scripts
        </h2>
        <p className="text-body-sm text-muted-foreground max-w-2xl">
          Search the full library of {data?.length ?? "230+"} free scripts, or filter by theme.
          Every script opens as a clean, printable page.
        </p>
      </div>

      {/* Search + filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <input
            type="search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setVisible(24);
            }}
            placeholder="Search scripts (e.g. anxiety, sleep, gratitude)…"
            aria-label="Search scripts"
            className="w-full min-h-[44px] rounded-lg border border-border bg-card pl-10 pr-10 py-2.5 text-body text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              setActiveTheme(null);
              setVisible(24);
            }}
            className={`min-h-[36px] rounded-full border px-3 py-1.5 text-body-sm transition-colors ${
              activeTheme === null
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-foreground hover:border-primary/40"
            }`}
          >
            All
          </button>
          {availableThemes.map((t) => {
            const active = activeTheme === t.key;
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => {
                  setActiveTheme(active ? null : t.key);
                  setVisible(24);
                  if (!active) trackEvent("scripts_browser_filter", { theme: t.key });
                }}
                className={`min-h-[36px] rounded-full border px-3 py-1.5 text-body-sm transition-colors ${
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-foreground hover:border-primary/40"
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results */}
      {isLoading && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      )}

      {isError && (
        <p className="text-body-sm text-muted-foreground">
          We couldn't load the script index right now. Please refresh in a moment.
        </p>
      )}

      {data && (
        <>
          <p className="text-caption text-muted-foreground" aria-live="polite">
            {filtered.length} {filtered.length === 1 ? "script" : "scripts"}
            {activeTheme ? ` in ${THEMES.find((t) => t.key === activeTheme)?.label}` : ""}
            {search ? ` matching "${search}"` : ""}
          </p>

          {filtered.length === 0 ? (
            <p className="text-body text-foreground/80">
              No scripts match those filters. Try a different theme or search term.
            </p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.slice(0, visible).map((s) => (
                <Link
                  key={s.id}
                  to={`/${s.slug}`}
                  onClick={() => trackEvent("scripts_browser_open", { slug: s.slug })}
                  className="group flex flex-col rounded-xl border border-border bg-card p-4 min-h-[120px] transition-all hover:border-primary/40 hover:shadow-[var(--shadow-card)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <div className="flex items-center gap-2 mb-2 text-primary">
                    <FileText className="h-4 w-4" aria-hidden="true" />
                    <span className="text-caption text-muted-foreground uppercase tracking-wide">Script</span>
                  </div>
                  <h3 className="text-base font-serif text-foreground leading-snug mb-1 line-clamp-2">
                    {s.title}
                  </h3>
                  {s.excerpt && (
                    <p className="text-body-sm text-muted-foreground line-clamp-2 flex-1">
                      {s.excerpt}
                    </p>
                  )}
                  <span className="mt-3 inline-flex items-center gap-1 text-body-sm text-primary font-medium">
                    Read script
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              ))}
            </div>
          )}

          {filtered.length > visible && (
            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={() => setVisible((v) => v + 24)}
                className="min-h-[44px] rounded-lg border border-border bg-card px-5 py-2.5 text-body font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-[hsl(var(--section-alternate))]"
              >
                Show more scripts ({filtered.length - visible} remaining)
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
