import { Link } from "react-router-dom";
import {
  Headphones,
  Quote,
  Sparkles,
  FileText,
  ClipboardList,
  BookOpen,
  Mic,
  GraduationCap,
} from "lucide-react";
import { SectionWrapper, SectionHeader } from "./SectionWrapper";
import { trackCtaClick } from "@/lib/analytics";

// Format-led discovery row, derived from the top-100 traffic study.
// 7 tiles cover ~75% of the site's organic-search demand, so this is
// the single biggest pickup-discovery upgrade for the homepage.
//
// Each tile points at the canonical hub for that format (existing pages
// where present, new hubs where we just built them).

interface Tile {
  label: string;
  description: string;
  href: string;
  icon: typeof Headphones;
  count?: string;
}

const TILES: Tile[] = [
  {
    label: "Guided Meditations",
    description: "Free audio practices, theme-filtered",
    href: "/audio-library",
    icon: Headphones,
    count: "27+ practices",
  },
  {
    label: "Mindfulness Quotes",
    description: "14 themed collections",
    href: "/quotes",
    icon: Quote,
    count: "14 collections",
  },
  {
    label: "Affirmations",
    description: "By audience and intention",
    href: "/affirmations",
    icon: Sparkles,
    count: "16+ collections",
  },
  {
    label: "Meditation Scripts",
    description: "Free scripts for teachers",
    href: "/meditation-scripts",
    icon: FileText,
    count: "12 scripts",
  },
  {
    label: "Worksheets",
    description: "Printable PDFs",
    href: "/free-mindfulness-worksheets",
    icon: ClipboardList,
  },
  {
    label: "Free Ebooks",
    description: "Downloadable guides",
    href: "/free-mindfulness-e-books",
    icon: BookOpen,
  },
  {
    label: "Podcast",
    description: "Conversations with teachers",
    href: "/podcast",
    icon: Mic,
  },
  {
    label: "Free Courses",
    description: "28-Day, Vipassana, & more",
    href: "/free-online-mindfulness-courses",
    icon: GraduationCap,
  },
];

export function BrowseByFormat() {
  return (
    <SectionWrapper
      background="alternate"
      id="browse-by-format"
      ariaLabel="Browse mindfulness resources by format"
    >
      <SectionHeader
        eyebrow="Browse by format"
        title="What kind of practice are you looking for?"
        subtitle="Most visitors arrive looking for a specific kind of resource — pick one to dive in."
        headingId="browse-by-format-heading"
      />
      <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {TILES.map((tile) => {
          const Icon = tile.icon;
          return (
            <li key={tile.label}>
              <Link
                to={tile.href}
                onClick={() =>
                  trackCtaClick({
                    cta_label: tile.label,
                    cta_destination: tile.href,
                    cta_location: "browse_by_format_tile",
                  })
                }
                className="group flex h-full min-h-[44px] flex-col rounded-xl border border-border bg-background p-4 sm:p-5 transition-all hover:border-primary/40 hover:shadow-[var(--shadow-card-hover)]"
              >
                <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="text-sm sm:text-base font-semibold text-foreground leading-snug">
                  {tile.label}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                  {tile.description}
                </p>
                {tile.count && (
                  <span className="mt-3 text-[10px] uppercase tracking-wide text-primary/80">
                    {tile.count}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </SectionWrapper>
  );
}
