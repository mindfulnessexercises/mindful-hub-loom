import { Link, useLocation } from "react-router-dom";
import { ArrowRight, Headphones, Sparkles } from "lucide-react";
import {
  AUDIENCE_LABELS,
  crossFormatBridges,
  FORMATS,
  getTopEntry,
  recommendedNext,
} from "@/lib/top-content";
import { trackCtaClick } from "@/lib/analytics";

/**
 * "Recommended next" panel powered by our top-100 taxonomy. Shown only
 * on posts that ARE in the top-100 list, since the recommendations are
 * hand-curated by format/audience/theme — not a generic algorithmic feed.
 *
 * Two stacks:
 *   1. More like this → same format, theme-matched first, then audience,
 *      then format-only fill (4 items max).
 *   2. Bridge to a different format → same theme, different format
 *      (e.g. on /karma-quotes, surface the matching guided meditation
 *      and the affirmation collection on the same theme).
 */
export function RecommendedNext() {
  const location = useLocation();
  const cur = getTopEntry(location.pathname);
  if (!cur) return null;

  const sameFormat = recommendedNext(location.pathname, 4);
  const bridges = crossFormatBridges(location.pathname);
  if (sameFormat.length === 0 && bridges.length === 0) return null;

  return (
    <aside
      aria-label="Recommended next"
      className="mt-12 rounded-xl border border-border bg-[hsl(var(--section-alternate))] p-5 sm:p-6"
    >
      {sameFormat.length > 0 && (
        <>
          <div className="mb-4 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" aria-hidden />
            <h2 className="text-card-heading font-serif text-foreground">
              More {FORMATS[cur.format].label.toLowerCase()} you might love
            </h2>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {sameFormat.map((entry) => (
              <li key={entry.path}>
                <Link
                  to={entry.path}
                  onClick={() =>
                    trackCtaClick({
                      cta_label: entry.title,
                      cta_destination: entry.path,
                      cta_location: `recommended_next_same_format_${cur.format}`,
                    })
                  }
                  className="group flex items-start justify-between gap-3 rounded-lg border border-border bg-background p-3 sm:p-4 transition-all hover:border-primary/40 hover:shadow-[var(--shadow-card-hover)] min-h-[44px]"
                >
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                      {entry.title}
                    </h3>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      {entry.audience && entry.audience !== "everyone" && (
                        <span className="text-[10px] uppercase tracking-wide text-primary/80">
                          {AUDIENCE_LABELS[entry.audience]}
                        </span>
                      )}
                      {entry.hasAudio && (
                        <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wide text-foreground/60">
                          <Headphones className="h-3 w-3" aria-hidden /> Audio
                        </span>
                      )}
                    </div>
                  </div>
                  <ArrowRight
                    className="h-4 w-4 mt-0.5 text-primary/60 group-hover:text-primary group-hover:translate-x-0.5 transition-transform"
                    aria-hidden
                  />
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}

      {bridges.length > 0 && (
        <div className={sameFormat.length > 0 ? "mt-6 pt-6 border-t border-border" : ""}>
          <p className="text-eyebrow text-muted-foreground mb-3">
            Same theme · different format
          </p>
          <ul className="flex flex-wrap gap-2">
            {bridges.map((entry) => (
              <li key={entry.path}>
                <Link
                  to={entry.path}
                  onClick={() =>
                    trackCtaClick({
                      cta_label: entry.title,
                      cta_destination: entry.path,
                      cta_location: `recommended_next_bridge_${cur.format}_to_${entry.format}`,
                    })
                  }
                  className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-primary/30 bg-primary/5 px-3 py-2 text-xs font-medium text-primary hover:bg-primary/10 transition"
                >
                  <span className="text-[10px] uppercase tracking-wide opacity-80">
                    {FORMATS[entry.format].label}
                  </span>
                  <span aria-hidden>·</span>
                  {entry.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  );
}
