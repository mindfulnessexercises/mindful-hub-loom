import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Layers } from "lucide-react";
import { wp } from "@/lib/wp";
import { wpKeys, WP_STALE } from "@/lib/wp-cache";
import { SectionWrapper, SectionHeader } from "@/components/homepage/SectionWrapper";
import { Skeleton } from "@/components/ui/skeleton";

interface BrowseByCategoryProps {
  /** How many top categories to feature. */
  limit?: number;
  /** When true, render WITHOUT the SectionWrapper (for embedding inside other pages). */
  embedded?: boolean;
  /** Optional override for the eyebrow label. */
  eyebrow?: string;
  /** Optional override for the section title. */
  title?: string;
  /** Optional override for the subtitle. */
  subtitle?: string;
  /** Background variant when not embedded. */
  background?: "primary" | "alternate" | "emphasis" | "deep";
}

/**
 * "Browse by Category" — a tile grid surfacing the most populated WordPress
 * categories. Each tile deep-links to the Library filtered by that category,
 * giving visitors a fast on-ramp into broader topics from the homepage and a
 * complementary topical entrypoint on the Library page itself.
 */
export function BrowseByCategory({
  limit = 8,
  embedded = false,
  eyebrow = "Explore Topics",
  title = "Browse by category",
  subtitle = "Jump straight into the topics our community reads most — from meditation scripts to teacher training.",
  background = "alternate",
}: BrowseByCategoryProps) {
  const { data, isLoading, isError } = useQuery({
    queryKey: wpKeys.categories(),
    queryFn: () => wp.categories(),
    staleTime: WP_STALE.taxonomy,
    gcTime: WP_STALE.gc,
  });

  const items = (data?.items ?? [])
    .filter((c) => c.count > 0 && c.slug !== "uncategorized")
    .slice(0, limit);

  const Body = (
    <>
      {!embedded && (
        <SectionHeader
          eyebrow={eyebrow}
          title={title}
          subtitle={subtitle}
          headingId="browse-by-category"
        />
      )}
      {embedded && (
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-eyebrow text-muted-foreground mb-2">{eyebrow}</p>
            <h2 className="text-2xl sm:text-3xl font-serif text-foreground">{title}</h2>
          </div>
          <Link
            to="/library"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2 transition-all"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}

      {isLoading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {Array.from({ length: limit }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-lg" />
          ))}
        </div>
      )}

      {isError && (
        <p className="text-center text-muted-foreground py-8">
          Could not load categories right now.
        </p>
      )}

      {!isLoading && items.length > 0 && (
        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {items.map((c) => (
            <li key={c.id}>
              <Link
                to={`/library?cat=${c.id}`}
                className="group flex h-full items-start gap-3 p-4 sm:p-5 rounded-lg border border-border bg-card hover:border-primary/40 hover:shadow-[var(--shadow-card-hover)] transition-all min-h-[44px]"
              >
                <div className="shrink-0 h-9 w-9 rounded-md bg-accent text-accent-foreground inline-flex items-center justify-center">
                  <Layers className="h-4 w-4" aria-hidden />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm sm:text-base font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {c.name}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {c.count.toLocaleString()} {c.count === 1 ? "post" : "posts"}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {!embedded && (
        <div className="mt-10 text-center">
          <Link
            to="/library"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2 transition-all"
          >
            Browse the full library <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </>
  );

  if (embedded) {
    return <div className="mb-10">{Body}</div>;
  }

  return (
    <SectionWrapper background={background} id="browse-by-category" ariaLabel="Browse posts by category">
      {Body}
    </SectionWrapper>
  );
}
