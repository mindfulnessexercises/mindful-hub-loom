import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Compass,
  Search as SearchIcon,
  X,
  Sparkles,
  Moon,
  HeartPulse,
  Smile,
  ScrollText,
  CalendarDays,
  GraduationCap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { wp, type WPCategory } from "@/lib/wp";
import { wpKeys, WP_STALE } from "@/lib/wp-cache";
import { trackEvent } from "@/lib/analytics";

/**
 * Helpful panel shown when a category yields zero/few results, OR when the
 * Library has no active category but returned no results overall.
 *
 * Built around two kinds of tiles:
 *   1. Neighbor categories — picked by name token-overlap with the active
 *      category (popularity fallback). Each tile shows the live post count
 *      so the user knows clicking will load real results.
 *   2. Intent topics — a curated list of common visitor intents (Beginners,
 *      Anxiety, Sleep, Kids, Scripts, Live Events). Each maps to one or
 *      more category-name keywords; we resolve those against the live
 *      category list at render time so the tiles only appear when matching
 *      content actually exists.
 *
 * Both kinds load real results into the Library when clicked (via
 * `onSelectCategory` → `?cat=…` URL update).
 */

const FEW_THRESHOLD = 3;
const NEIGHBOR_LIMIT = 6;
const INTENT_LIMIT = 6;

export interface SparseCategoryHelperProps {
  /** Category currently selected via ?cat=… (omit when no category is active). */
  activeCategory?: WPCategory;
  /** All visible categories (already filtered to count>0 and not "uncategorized") */
  allCategories: WPCategory[];
  /** Number of posts returned for the active filter set */
  resultCount: number;
  /** Active search query, if any — drives the contextual copy */
  search?: string;
  /** Clear only the category filter (keep search if any) */
  onClearCategory: () => void;
  /** Clear all active filters (search + category) */
  onClearAll: () => void;
  /** Switch to a different category */
  onSelectCategory: (id: number) => void;
}

const STOP = new Set(["and", "the", "for", "with", "of", "in", "on", "to", "a", "an", "your", "you"]);

function tokenize(s: string): string[] {
  return Array.from(
    new Set(
      s
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, " ")
        .split(/[\s-]+/)
        .filter((t) => t.length > 2 && !STOP.has(t)),
    ),
  );
}

/** Pick categories most similar to `active` by token overlap; popularity ties. */
function pickNeighbors(
  active: WPCategory | undefined,
  all: WPCategory[],
  limit = NEIGHBOR_LIMIT,
): WPCategory[] {
  if (!active) {
    // No active category → just show the most popular ones as "neighbors".
    return [...all].filter((c) => c.count > 0).sort((a, b) => b.count - a.count).slice(0, limit);
  }
  const activeTokens = new Set(tokenize(active.name));
  const scored = all
    .filter((c) => c.id !== active.id && c.count > 0)
    .map((c) => ({
      c,
      overlap: tokenize(c.name).filter((t) => activeTokens.has(t)).length,
    }))
    .sort((a, b) => (b.overlap - a.overlap) || (b.c.count - a.c.count));
  return scored.slice(0, limit).map((s) => s.c);
}

/** A common-intent topic — resolved to a real category at render time. */
interface IntentTopic {
  id: string;
  label: string;
  description: string;
  keywords: string[]; // matched against category slug + name (lowercased)
  Icon: LucideIcon;
}

const INTENT_TOPICS: IntentTopic[] = [
  {
    id: "beginner",
    label: "Just starting out",
    description: "Mindfulness fundamentals & first practices.",
    keywords: ["beginner", "getting-started", "intro", "introduction", "101", "basics"],
    Icon: Sparkles,
  },
  {
    id: "anxiety",
    label: "Calm anxiety & stress",
    description: "Practices for stress, overwhelm, and nervous-system regulation.",
    keywords: ["anxiety", "stress", "burnout", "overwhelm", "panic"],
    Icon: HeartPulse,
  },
  {
    id: "sleep",
    label: "Better sleep",
    description: "Wind-down practices and bedtime meditations.",
    keywords: ["sleep", "insomnia", "bedtime", "night"],
    Icon: Moon,
  },
  {
    id: "kids",
    label: "Mindfulness for kids",
    description: "Family-friendly and classroom resources.",
    keywords: ["kids", "children", "teen", "teens", "youth", "schools", "classroom"],
    Icon: Smile,
  },
  {
    id: "scripts",
    label: "Guided scripts",
    description: "Read-aloud meditation scripts you can use today.",
    keywords: ["script", "guided", "meditation-script"],
    Icon: ScrollText,
  },
  {
    id: "events",
    label: "Live events",
    description: "Workshops, retreats, and live training sessions.",
    keywords: ["live", "event", "retreat", "workshop", "webinar"],
    Icon: CalendarDays,
  },
  {
    id: "certification",
    label: "Teacher certification",
    description: "Become a certified mindfulness teacher.",
    keywords: ["certif", "teacher-training", "training", "credential"],
    Icon: GraduationCap,
  },
];

/** Resolve each intent topic to the best-matching live category, if any. */
function resolveIntentTopics(
  topics: IntentTopic[],
  categories: WPCategory[],
  excludeId?: number,
): { topic: IntentTopic; category: WPCategory }[] {
  const matched: { topic: IntentTopic; category: WPCategory }[] = [];
  const seenCatIds = new Set<number>();
  for (const topic of topics) {
    // Find the best (highest count) category matching any keyword.
    const candidates = categories
      .filter((c) => c.id !== excludeId && c.count > 0 && !seenCatIds.has(c.id))
      .filter((c) => {
        const h = `${c.slug} ${c.name}`.toLowerCase();
        return topic.keywords.some((kw) => h.includes(kw));
      })
      .sort((a, b) => b.count - a.count);
    if (candidates[0]) {
      matched.push({ topic, category: candidates[0] });
      seenCatIds.add(candidates[0].id);
    }
  }
  return matched;
}

export function SparseCategoryHelper({
  activeCategory,
  allCategories,
  resultCount,
  search,
  onClearCategory,
  onClearAll,
  onSelectCategory,
}: SparseCategoryHelperProps) {
  const variant: "empty" | "sparse" = resultCount === 0 ? "empty" : "sparse";
  // Only render when results are unhelpfully few — otherwise the user can
  // browse normally without a nudge.
  if (variant === "sparse" && resultCount >= FEW_THRESHOLD) return null;

  const neighbors = useMemo(
    () => pickNeighbors(activeCategory, allCategories),
    [activeCategory, allCategories],
  );

  const intents = useMemo(
    () => resolveIntentTopics(INTENT_TOPICS, allCategories, activeCategory?.id).slice(0, INTENT_LIMIT),
    [allCategories, activeCategory?.id],
  );

  // Fetch neighbor post counts via WP `count` field (already on category) but
  // also pre-warm the first page of each so clicking is instant. Limited to
  // visible neighbor tiles to keep the request fan-out small.
  useQueries({
    queries: neighbors.map((cat) => ({
      queryKey: [...wpKeys.postsList({ scope: "neighbor-prewarm", category: cat.id, perPage: 1 })],
      queryFn: () => wp.posts({ categories: cat.id, per_page: 1 }),
      staleTime: WP_STALE.list,
      gcTime: WP_STALE.gc,
    })),
  });

  const heading = activeCategory
    ? variant === "empty"
      ? search
        ? `No matches for "${search}" in ${activeCategory.name}`
        : `Nothing here yet in ${activeCategory.name}`
      : `Only ${resultCount} ${resultCount === 1 ? "result" : "results"} in ${activeCategory.name}`
    : search
      ? `No matches for "${search}"`
      : "No matching results";

  const subheading = activeCategory
    ? variant === "empty"
      ? "Try a related topic below, jump into a common intent, or browse the full library."
      : "You might also like these neighboring topics — or pick a common intent to jump in:"
    : "Pick a topic to load real results, or try one of these common intents:";

  const onTileClick = (cat: WPCategory, source: "neighbor" | "intent", intentId?: string) => {
    trackEvent("empty_state_tile_clicked", {
      source,
      intent_id: intentId,
      category_id: cat.id,
      category_slug: cat.slug,
      from_category_id: activeCategory?.id,
      from_category_slug: activeCategory?.slug,
      variant,
    });
    onSelectCategory(cat.id);
  };

  return (
    <section
      aria-label={
        variant === "empty"
          ? "No results — suggested topics"
          : "Sparse results — neighboring topics & intents"
      }
      className="mb-8 rounded-xl border border-border bg-[hsl(var(--section-alternate))] p-6 lg:p-8"
    >
      <div className="flex items-start gap-4">
        <div className="shrink-0 h-10 w-10 rounded-md bg-accent text-accent-foreground inline-flex items-center justify-center">
          <Compass className="h-5 w-5" aria-hidden />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-card-heading text-foreground">{heading}</h2>
          <p className="mt-1 text-body-sm text-muted-foreground">{subheading}</p>

          {/* ── Neighboring categories (rich tiles) ── */}
          {neighbors.length > 0 && (
            <div className="mt-6">
              <h3 className="text-eyebrow text-muted-foreground mb-3">
                {activeCategory ? "Neighboring topics" : "Popular topics"}
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {neighbors.map((c) => (
                  <li key={c.id}>
                    <button
                      type="button"
                      onClick={() => onTileClick(c, "neighbor")}
                      className="group w-full text-left p-4 rounded-lg border border-border bg-card hover:border-primary/40 hover:shadow-[var(--shadow-card-hover)] transition-all min-h-[80px] flex items-start justify-between gap-3"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                          {c.name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Load {c.count.toLocaleString()} {c.count === 1 ? "post" : "posts"}
                        </p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" aria-hidden />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* ── Common-intent topics (icon tiles) ── */}
          {intents.length > 0 && (
            <div className="mt-6">
              <h3 className="text-eyebrow text-muted-foreground mb-3">Common intents</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {intents.map(({ topic, category }) => {
                  const Icon = topic.Icon;
                  return (
                    <li key={topic.id}>
                      <button
                        type="button"
                        onClick={() => onTileClick(category, "intent", topic.id)}
                        className="group w-full text-left p-4 rounded-lg border border-border bg-card hover:border-primary/40 hover:shadow-[var(--shadow-card-hover)] transition-all min-h-[88px] flex items-start gap-3"
                      >
                        <div className="shrink-0 h-9 w-9 rounded-md bg-accent text-accent-foreground inline-flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                          <Icon className="h-4 w-4" aria-hidden />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                            {topic.label}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                            {topic.description}
                          </p>
                          <p className="text-[10px] uppercase tracking-wide text-muted-foreground/80 mt-1.5">
                            → {category.name} ({category.count.toLocaleString()})
                          </p>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* ── Secondary actions ── */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            {activeCategory && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onClearCategory}
                className="min-h-[40px]"
              >
                <X className="h-3.5 w-3.5" /> Clear category
              </Button>
            )}
            {search && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onClearAll}
                className="min-h-[40px]"
              >
                <X className="h-3.5 w-3.5" /> Clear all filters
              </Button>
            )}
            <Link
              to="/library"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2 transition-all min-h-[40px]"
            >
              Browse the full library <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            {!search && (
              <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <SearchIcon className="h-3.5 w-3.5" /> Tip: try the search above
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
