import { Link } from "react-router-dom";
import {
  ArrowRight,
  Brain,
  Heart,
  Moon,
  Smile,
  Sparkles,
  Users,
  Wind,
  Pencil,
  Mic,
  Download,
  Clock,
} from "lucide-react";
import { trackEvent } from "@/lib/analytics";

/**
 * Designed hero + curated grid that REPLACES the legacy WP intro on
 * /free-guided-meditation-scripts.
 *
 * The original WP page opened with a flat, unstyled list of script titles
 * followed by six oversized stock-photo banners — visually heavy, slow to
 * scan, and noisy on mobile. This component delivers the same routing
 * intent with semantic tokens, no images, and a clear hierarchy:
 *
 *   1. Audience grid (the primary user task: "find scripts for my context")
 *   2. Quick-access featured scripts (the next most common task)
 *
 * The long-form SEO prose ("Benefits of...", "Tips for guiding...") still
 * renders below this, untouched. See WPResolver.tsx for the slug match.
 */

interface AudienceCard {
  href: string;
  title: string;
  blurb: string;
  Icon: typeof Brain;
  count: string;
}

const AUDIENCES: AudienceCard[] = [
  {
    href: "/9-mindfulness-scripts-for-therapists",
    title: "For Therapists",
    blurb: "Clinical-friendly scripts for one-on-one and group sessions.",
    Icon: Brain,
    count: "9 scripts",
  },
  {
    href: "/meditation-scripts-for-kids",
    title: "For Kids",
    blurb: "Playful, age-appropriate practices that hold attention.",
    Icon: Smile,
    count: "7 scripts",
  },
  {
    href: "/7-guided-meditation-scripts-for-yoga-teachers",
    title: "For Yoga Teachers",
    blurb: "Body-aware scripts to weave into asana and savasana.",
    Icon: Wind,
    count: "7 scripts",
  },
  {
    href: "/meditation-scripts-for-stress",
    title: "For Stress",
    blurb: "Calm the nervous system in five minutes or less.",
    Icon: Heart,
    count: "Curated set",
  },
  {
    href: "/sleep-meditation-scripts",
    title: "For Sleep",
    blurb: "Slow-paced scripts to help listeners drift off.",
    Icon: Moon,
    count: "Curated set",
  },
  {
    href: "/guided-meditation-scripts-for-groups",
    title: "For Groups",
    blurb: "Workshop, classroom, and corporate-ready scripts.",
    Icon: Users,
    count: "Curated set",
  },
];

interface FeaturedScript {
  href: string;
  title: string;
  meta: string;
  Icon: typeof Sparkles;
}

const FEATURED: FeaturedScript[] = [
  {
    href: "/meditation-scripts-for-anxiety",
    title: "Scripts for Anxiety",
    meta: "Grounding · Self-soothing",
    Icon: Sparkles,
  },
  {
    href: "/5-minute-meditation-script-from-mindfulness-exercises",
    title: "5-Minute Meditation",
    meta: "Short · For busy days",
    Icon: Clock,
  },
  {
    href: "/guided-meditation-scripts-instant-download",
    title: "Instant Download Bundle",
    meta: "All scripts in one PDF",
    Icon: Download,
  },
  {
    href: "/how-to-write-a-meditation-script",
    title: "How to Write a Script",
    meta: "Craft guide",
    Icon: Pencil,
  },
  {
    href: "/how-to-record-a-meditation",
    title: "How to Record a Meditation",
    meta: "Studio basics",
    Icon: Mic,
  },
  {
    href: "/meditation-scripts",
    title: "Browse all scripts",
    meta: "Full library + filters",
    Icon: ArrowRight,
  },
];

function track(label: string, href: string) {
  trackEvent("free_scripts_hub_click", { label, href });
}

export function FreeScriptsHero() {
  return (
    <div className="not-prose space-y-12">
      {/* Intro */}
      <div className="max-w-2xl">
        <p className="text-eyebrow text-primary mb-3">
          Free library · No signup required
        </p>
        <p className="text-body-lg text-foreground/90 leading-relaxed">
          A growing collection of free, professionally written meditation
          scripts you can read aloud, adapt for your students, or use to
          guide your own practice. Choose your context below — every script
          downloads as a clean PDF.
        </p>
      </div>

      {/* Audience grid */}
      <section aria-labelledby="scripts-audiences">
        <div className="flex items-baseline justify-between mb-5">
          <h2
            id="scripts-audiences"
            className="text-card-heading font-serif text-foreground"
          >
            Find scripts for your setting
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {AUDIENCES.map(({ href, title, blurb, Icon, count }) => (
            <Link
              key={href}
              to={href}
              onClick={() => track("audience", href)}
              className="group flex flex-col rounded-xl border border-border bg-card p-5 min-h-[160px] transition-all hover:border-primary/40 hover:shadow-[var(--shadow-card)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[hsl(var(--section-emphasis))] text-primary">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="text-caption text-muted-foreground">
                  {count}
                </span>
              </div>
              <h3 className="text-lg font-serif text-foreground mb-1">
                {title}
              </h3>
              <p className="text-body-sm text-muted-foreground flex-1">
                {blurb}
              </p>
              <span className="mt-3 inline-flex items-center gap-1 text-body-sm text-primary font-medium">
                Open
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured / quick links */}
      <section aria-labelledby="scripts-featured">
        <div className="flex items-baseline justify-between mb-5">
          <h2
            id="scripts-featured"
            className="text-card-heading font-serif text-foreground"
          >
            Popular scripts &amp; craft guides
          </h2>
          <Link
            to="/meditation-scripts"
            onClick={() => track("featured_view_all", "/meditation-scripts")}
            className="text-body-sm text-primary font-medium hover:underline underline-offset-4 inline-flex items-center gap-1 min-h-[44px]"
          >
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {FEATURED.map(({ href, title, meta, Icon }) => (
            <Link
              key={href}
              to={href}
              onClick={() => track("featured", href)}
              className="group flex items-center gap-4 rounded-lg border border-border bg-card p-4 min-h-[64px] transition-colors hover:border-primary/40 hover:bg-[hsl(var(--section-alternate))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[hsl(var(--section-emphasis))] text-primary">
                <Icon className="h-4 w-4" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-body font-medium text-foreground truncate">
                  {title}
                </div>
                <div className="text-caption text-muted-foreground truncate">
                  {meta}
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
