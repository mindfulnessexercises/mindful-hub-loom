import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface SectionWrapperProps {
  children: ReactNode;
  className?: string;
  background?: "primary" | "alternate" | "emphasis" | "deep";
  id?: string;
  narrow?: boolean;
  ariaLabel?: string;
}

const bgMap = {
  primary: "bg-[hsl(var(--section-primary))]",
  alternate: "bg-[hsl(var(--section-alternate))]",
  emphasis: "bg-[hsl(var(--section-emphasis))]",
  deep: "bg-[hsl(var(--section-deep))] text-primary-foreground",
};

export function SectionWrapper({
  children,
  className,
  background = "primary",
  id,
  narrow = false,
  ariaLabel,
}: SectionWrapperProps) {
  return (
    <section
      id={id}
      // `data-track-section` lets HomepageEngagementTracker observe this
      // section for impression analytics WITHOUT every section file having
      // to wire up its own observer. We use the wrapper id (or aria-label,
      // lower-cased) as the section identifier so reports stay readable.
      data-track-section={id ?? ariaLabel?.toLowerCase().replace(/\s+/g, "-")}
      data-track-section-label={ariaLabel ?? id}
      className={cn(bgMap[background], "py-16 sm:py-20 lg:py-24", className)}
      {...(ariaLabel ? { "aria-label": ariaLabel } : id ? { "aria-labelledby": `${id}-heading` } : {})}
    >
      <div className={cn("container mx-auto", narrow && "max-w-4xl")}>
        {children}
      </div>
    </section>
  );
}

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
  light?: boolean;
  headingId?: string;
}

export function SectionHeader({ eyebrow, title, subtitle, centered = true, className, light, headingId }: SectionHeaderProps) {
  return (
    <div className={cn("mb-12 sm:mb-16", centered && "text-center", className)}>
      {eyebrow && (
        <p className={cn("text-eyebrow mb-3", light ? "text-primary-foreground/70" : "text-muted-foreground")}>
          {eyebrow}
        </p>
      )}
      <h2 id={headingId} className={cn("text-section-heading", light && "text-primary-foreground")}>{title}</h2>
      {subtitle && (
        <p className={cn("text-body-lg mt-4 max-w-2xl", centered && "mx-auto", light ? "text-primary-foreground/80" : "text-muted-foreground")}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
