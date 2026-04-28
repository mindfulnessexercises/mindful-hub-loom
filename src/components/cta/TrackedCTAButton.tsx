import { ArrowRight, type LucideIcon } from "lucide-react";
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { trackCtaClick } from "@/lib/analytics";
import { cn } from "@/lib/utils";

/**
 * Routing-aware CTA destinations. Each destination has a stable id so
 * analytics, audits, and copy variants stay in lockstep across the site.
 *
 * Adding a destination:
 *   1. Add the key + url here.
 *   2. (Optional) add a default copy variant in `DEFAULT_LABELS` per audience.
 */
export type CtaDestination =
  | "free_resources"
  | "live_events"
  | "premium_training"
  | "certification"
  | "ebook_signup";

export type CtaAudience = "individual" | "professional" | "neutral";

export const CTA_HREFS: Record<CtaDestination, { href: string; external: boolean }> = {
  free_resources: { href: "/library", external: false },
  live_events: { href: "#events", external: false },
  premium_training: { href: "/library?cat=advanced-training", external: false },
  certification: { href: "https://certify.mindfulnessexercises.com/", external: true },
  ebook_signup: { href: "#ebook", external: false },
};

/**
 * Audience-tuned default labels. The right wording per audience matters
 * more than visual variation — these are the words that move clicks.
 *   - "individual"   speaks to the practitioner / beginner
 *   - "professional" speaks to the therapist / coach / educator
 *   - "neutral"      generic top-of-page or footer placement
 */
const DEFAULT_LABELS: Record<
  CtaDestination,
  Record<CtaAudience, string>
> = {
  free_resources: {
    individual: "Browse free practices",
    professional: "Find resources for clients",
    neutral: "Browse free mindfulness exercises",
  },
  live_events: {
    individual: "Join a live session",
    professional: "See CE-eligible workshops",
    neutral: "See upcoming live sessions",
  },
  premium_training: {
    individual: "Deepen your practice",
    professional: "Explore advanced trainings",
    neutral: "Explore premium trainings",
  },
  certification: {
    individual: "Become a certified teacher",
    professional: "Get APA-approved certification",
    neutral: "Get certified to teach mindfulness",
  },
  ebook_signup: {
    individual: "Get the free ebook",
    professional: "Get the teaching readiness guide",
    neutral: "Get the free guide",
  },
};

export interface TrackedCTAButtonProps
  extends Omit<ButtonProps, "onClick" | "asChild" | "children"> {
  /** Where the click should send the user. */
  destination: CtaDestination;
  /** Which audience the surrounding section is speaking to. */
  audience?: CtaAudience;
  /**
   * Stable identifier of the section / surface ("homepage_hero",
   * "library_footer", etc.). Required for funnel attribution.
   */
  location: string;
  /** Override the default audience-tuned label when needed. */
  label?: ReactNode;
  /** Optional leading icon. */
  Icon?: LucideIcon;
  /** Hide the trailing arrow. */
  hideArrow?: boolean;
  /** Additional anchor attrs (target, rel) — leave alone for sensible defaults. */
  anchorProps?: Omit<ButtonHTMLAttributes<HTMLAnchorElement>, "href" | "onClick">;
}

/**
 * Single canonical CTA button used everywhere routing matters. Guarantees:
 *   • Correct href per destination
 *   • Audience-tuned label
 *   • External destinations get target=_blank + rel=noopener
 *   • Click fires `cta_clicked` with the right shape
 *   • The site-wide certification click tracker also fires for cert links,
 *     enabling cross-surface conversion attribution
 */
export const TrackedCTAButton = forwardRef<HTMLAnchorElement, TrackedCTAButtonProps>(
  function TrackedCTAButton(
    {
      destination,
      audience = "neutral",
      location,
      label,
      Icon,
      hideArrow,
      className,
      anchorProps,
      variant,
      size,
      ...buttonRest
    },
    ref,
  ) {
    const { href, external } = CTA_HREFS[destination];
    const text = label ?? DEFAULT_LABELS[destination][audience];

    return (
      <Button
        asChild
        variant={variant}
        size={size}
        className={cn("min-h-[44px]", className)}
        {...buttonRest}
      >
        <a
          ref={ref}
          href={href}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener" : undefined}
          data-track-cta-location={location}
          onClick={() => {
            trackCtaClick({
              cta_label: typeof text === "string" ? text : destination,
              cta_destination: href,
              cta_location: location,
              matched: true,
              match_source: `audience:${audience}`,
            });
          }}
          {...anchorProps}
        >
          {Icon && <Icon className="mr-2 h-4 w-4" aria-hidden />}
          {text}
          {!hideArrow && <ArrowRight className="ml-2 h-4 w-4" aria-hidden />}
        </a>
      </Button>
    );
  },
);
