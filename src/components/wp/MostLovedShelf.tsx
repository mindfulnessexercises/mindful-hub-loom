import { Link } from "react-router-dom";
import { ArrowRight, Flame, Headphones } from "lucide-react";
import {
  AUDIENCE_LABELS,
  FORMATS,
  TOP_ENTRIES,
  type FormatId,
} from "@/lib/top-content";
import { trackCtaClick } from "@/lib/analytics";

// Curated "most-loved" shelf for the top of /library, drawn from the
// top-100 traffic study. Surfaces 8 high-intent posts that are otherwise
// buried beneath the WP date-sorted feed. We pick a representative spread
// across formats so the shelf doesn't read as one-note.

const FEATURED_PATHS: string[] = [
  "/karma-quotes",
  "/positive-affirmations-for-women",
  "/free-guided-meditation-scripts",
  "/short-body-scan",
  "/free-mindfulness-worksheets",
  "/free-mindfulness-e-books",
  "/8-mindfulness-exercises-for-beginners",
  "/free-online-mindfulness-courses/28-day-mindfulness-challenge",
];

const PATH_INDEX = new Map(TOP_ENTRIES.map((e) => [e.path, e]));

export function MostLovedShelf() {
  const items = FEATURED_PATHS.map((p) => PATH_INDEX.get(p)).filter(
    (e): e is NonNullable<ReturnType<typeof PATH_INDEX.get>> => !!e,
  );
  if (items.length === 0) return null;

  return (
    <section
      aria-label="Most-loved on Mindfulness Exercises"
      className="container mx-auto pt-10 lg:pt-12"
    >
      <div className="mb-5 flex items-center gap-2">
        <Flame className="h-4 w-4 text-primary" aria-hidden />
        <h2 className="text-card-heading font-serif text-foreground">
          Most-loved on the site
        </h2>
      </div>
      <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {items.map((entry) => (
          <li key={entry.path}>
            <Link
              to={entry.path}
              onClick={() =>
                trackCtaClick({
                  cta_label: entry.title,
                  cta_destination: entry.path,
                  cta_location: "library_most_loved_shelf",
                })
              }
              className="group flex h-full flex-col rounded-lg border border-border bg-background p-4 transition-all hover:border-primary/40 hover:shadow-[var(--shadow-card-hover)] min-h-[44px]"
            >
              <span className="text-[10px] uppercase tracking-wide text-primary/80 mb-2">
                {FORMATS[entry.format as FormatId].label}
              </span>
              <h3 className="text-sm font-semibold text-foreground leading-snug group-hover:text-primary transition-colors flex-1">
                {entry.title}
              </h3>
              <div className="mt-3 flex items-center justify-between">
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary group-hover:gap-2 transition-all">
                  Open <ArrowRight className="h-3 w-3" />
                </span>
                {entry.hasAudio && (
                  <Headphones className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />
                )}
                {entry.audience && entry.audience !== "everyone" && (
                  <span className="text-[10px] text-muted-foreground">
                    {AUDIENCE_LABELS[entry.audience]}
                  </span>
                )}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
