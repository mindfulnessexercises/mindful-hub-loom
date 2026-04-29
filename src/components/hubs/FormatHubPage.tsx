import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Headphones, Sparkles, Users } from "lucide-react";
import { Navbar } from "@/components/homepage/Navbar";
import { Footer } from "@/components/homepage/Footer";
import { WPSeo } from "@/components/wp/WPSeo";
import { wp, decodeHtmlEntities, getFeaturedImage, type WPPost } from "@/lib/wp";
import {
  AUDIENCE_LABELS,
  audiencesForFormat,
  entriesByFormat,
  FORMATS,
  type FormatId,
  type TopEntry,
} from "@/lib/top-content";
import { trackCtaClick } from "@/lib/analytics";

interface FormatHubPageProps {
  format: FormatId;
  /** Optional secondary format to show as a sub-section (e.g. quotes hub
   *  showing chakra recommendations). */
  alsoShow?: FormatId;
  /** Long descriptive intro shown beneath the H1. */
  intro: string;
  /** Cluster of audiences to show as filter chips. When omitted, derives
   *  from the data. Pass `[]` to hide the switcher entirely. */
  audiences?: NonNullable<TopEntry["audience"]>[];
  /** SEO meta. */
  seoTitle: string;
  seoDescription: string;
  canonical: string;
  /** Optional: WP category slug to fetch & surface as a "More posts" shelf
   *  beneath the curated grid. Useful for hubs whose top-100 picks are
   *  audience-tiles but the WP archive has many more relevant articles. */
  wpPostsCategorySlug?: string;
  /** Heading for the WP posts shelf. */
  wpPostsHeading?: string;
}

/**
 * Reusable hub page that renders all top-100 entries for a given content
 * format (Quotes, Affirmations, Meditation Scripts, …) with an audience
 * switcher when the format has audience-tagged entries.
 *
 * Why this exists: the top-100 study showed visitors arrive by FORMAT, but
 * the WP site only ever shipped per-post pages — there's no "all quotes"
 * or "all affirmations" landing. These hubs become the canonical entry
 * points from the new mega-menu and the homepage tile row, and let users
 * see related collections at a glance.
 */
export function FormatHubPage({
  format,
  alsoShow,
  intro,
  audiences,
  seoTitle,
  seoDescription,
  canonical,
}: FormatHubPageProps) {
  const meta = FORMATS[format];
  const allEntries = useMemo(() => entriesByFormat(format), [format]);
  const alsoEntries = useMemo(
    () => (alsoShow ? entriesByFormat(alsoShow) : []),
    [alsoShow],
  );
  const detectedAudiences = useMemo(
    () => audiencesForFormat(format).filter(Boolean) as NonNullable<TopEntry["audience"]>[],
    [format],
  );
  const audienceChips =
    audiences ??
    detectedAudiences.filter((a) => a !== "everyone");

  const [active, setActive] = useState<NonNullable<TopEntry["audience"]> | "all">("all");

  const visible = useMemo(() => {
    if (active === "all") return allEntries;
    return allEntries.filter((e) => e.audience === active);
  }, [active, allEntries]);

  return (
    <div className="min-h-screen bg-background">
      <WPSeo
        title={seoTitle}
        description={seoDescription}
        canonical={canonical}
      />
      <Navbar />
      <main>
        {/* Hero */}
        <section className="border-b border-border bg-[hsl(var(--section-alternate))] py-14 sm:py-20">
          <div className="container mx-auto max-w-3xl text-center">
            <p className="text-eyebrow text-primary mb-3">{meta.tagline}</p>
            <h1 className="text-section-heading font-serif text-foreground">
              {meta.label}
            </h1>
            <p className="text-body-lg mt-5 text-muted-foreground">{intro}</p>
          </div>
        </section>

        {/* Audience switcher */}
        {audienceChips.length > 0 && (
          <div className="border-b border-border bg-background">
            <div className="container mx-auto py-5">
              <p className="text-eyebrow text-muted-foreground mb-3 inline-flex items-center gap-1.5">
                <Users className="h-3 w-3" aria-hidden /> Browse by audience
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setActive("all")}
                  aria-pressed={active === "all"}
                  className={`inline-flex min-h-[44px] items-center rounded-full border px-4 py-2 text-sm font-medium transition ${
                    active === "all"
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background text-foreground/80 hover:border-primary/40"
                  }`}
                >
                  All ({allEntries.length})
                </button>
                {audienceChips.map((aud) => {
                  const count = allEntries.filter((e) => e.audience === aud).length;
                  if (count === 0) return null;
                  return (
                    <button
                      key={aud}
                      type="button"
                      onClick={() => setActive(aud)}
                      aria-pressed={active === aud}
                      className={`inline-flex min-h-[44px] items-center rounded-full border px-4 py-2 text-sm font-medium transition ${
                        active === aud
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background text-foreground/80 hover:border-primary/40"
                      }`}
                    >
                      {AUDIENCE_LABELS[aud]}{" "}
                      <span
                        className={`ml-1.5 text-xs ${active === aud ? "opacity-90" : "text-muted-foreground"}`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Entries grid */}
        <section className="container mx-auto py-12 sm:py-16">
          {visible.length === 0 ? (
            <p className="text-center text-muted-foreground py-16">
              No collections match that filter yet.
            </p>
          ) : (
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {visible.map((entry) => (
                <li key={entry.path}>
                  <Link
                    to={entry.path}
                    onClick={() =>
                      trackCtaClick({
                        cta_label: entry.title,
                        cta_destination: entry.path,
                        cta_location: `format_hub_${format}`,
                      })
                    }
                    className="group flex h-full flex-col rounded-xl border border-border bg-background p-5 transition-all hover:border-primary/40 hover:shadow-[var(--shadow-card-hover)] min-h-[44px]"
                  >
                    <div className="mb-3 flex items-center gap-2">
                      {entry.audience && entry.audience !== "everyone" && (
                        <span className="text-[10px] uppercase tracking-wide text-primary/80 bg-primary/10 px-2 py-0.5 rounded-full">
                          {AUDIENCE_LABELS[entry.audience]}
                        </span>
                      )}
                      {entry.hasAudio && (
                        <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wide text-foreground/70 bg-muted px-2 py-0.5 rounded-full">
                          <Headphones className="h-3 w-3" aria-hidden /> Audio
                        </span>
                      )}
                    </div>
                    <h2 className="text-base sm:text-lg font-semibold text-foreground leading-snug group-hover:text-primary transition-colors">
                      {entry.title}
                    </h2>
                    {entry.theme && (
                      <p className="mt-2 text-xs text-muted-foreground capitalize">
                        Theme: {entry.theme.replace(/-/g, " ")}
                      </p>
                    )}
                    <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary group-hover:gap-2 transition-all">
                      Open <ArrowRight className="h-3 w-3" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Cross-format suggestions */}
        {alsoEntries.length > 0 && (
          <section className="border-t border-border bg-[hsl(var(--section-alternate))] py-12 sm:py-16">
            <div className="container mx-auto">
              <div className="mb-6 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" aria-hidden />
                <h2 className="text-card-heading text-foreground font-serif">
                  Also in {FORMATS[alsoShow!].label}
                </h2>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {alsoEntries.map((entry) => (
                  <li key={entry.path}>
                    <Link
                      to={entry.path}
                      className="block rounded-lg border border-border bg-background p-4 hover:border-primary/40 transition-colors min-h-[44px]"
                    >
                      <h3 className="text-sm font-semibold text-foreground">
                        {entry.title}
                      </h3>
                      {entry.theme && (
                        <p className="mt-1 text-xs text-muted-foreground capitalize">
                          {entry.theme.replace(/-/g, " ")}
                        </p>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
