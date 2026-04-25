/**
 * Per-template visual config for WP-rendered pages/posts/CPTs.
 *
 * Lets you tune hero spacing and featured-image placement per slug or
 * template kind to avoid pages with empty space (e.g. /about-us where the
 * "featured image" is really a logo, not an editorial photo).
 *
 * Resolution order (first match wins):
 *   1. SLUG_OVERRIDES[slug]
 *   2. KIND_DEFAULTS[kind]   (kind = 'page' | 'post' | 'podcast')
 *   3. BASE_DEFAULTS
 */

export type FeaturedImagePlacement =
  | "hero" // Full-width 16:9 cropped band below the header (editorial photo).
  | "inline" // Compact, centered, natural-aspect, capped height.
  | "header-icon" // Small icon/logo rendered inside the header above the title.
  | "hidden"; // Don't render the featured image at all.

export type HeroDensity = "compact" | "default" | "spacious";

export interface TemplateConfig {
  /** Vertical padding density for the hero header block. */
  heroDensity: HeroDensity;
  /** Where/how the featured image renders. */
  featuredImage: FeaturedImagePlacement;
  /**
   * Hard cap (px) for the rendered height of inline / header-icon images.
   * Prevents large square logos from creating huge empty bands.
   */
  featuredMaxHeightPx: number;
  /**
   * If true, auto-detect "logo-like" images (small or near-square) and
   * downgrade hero → inline. Useful default for `page` kind.
   */
  autoDetectLogo: boolean;
}

const BASE_DEFAULTS: TemplateConfig = {
  heroDensity: "default",
  featuredImage: "hero",
  featuredMaxHeightPx: 256,
  autoDetectLogo: true,
};

const KIND_DEFAULTS: Record<"page" | "post" | "podcast" | "download", Partial<TemplateConfig>> = {
  // Static pages rarely benefit from a giant hero photo. Default to inline +
  // compact spacing, and aggressively detect logos so they don't dominate.
  page: {
    heroDensity: "compact",
    featuredImage: "inline",
    featuredMaxHeightPx: 200,
    autoDetectLogo: true,
  },
  // Editorial blog posts get the full hero treatment.
  post: {
    heroDensity: "default",
    featuredImage: "hero",
    autoDetectLogo: true,
  },
  // Podcasts lead with audio; the featured image is usually show artwork.
  podcast: {
    heroDensity: "compact",
    featuredImage: "inline",
    featuredMaxHeightPx: 220,
    autoDetectLogo: false,
  },
  // Audio downloads: the user came to listen. Hero is dense, featured image
  // is hidden (it gets pulled into the MeditationPlayer's portrait slot
  // instead). Player should appear within the first viewport on desktop.
  download: {
    heroDensity: "compact",
    featuredImage: "hidden",
    autoDetectLogo: false,
  },
};

const SLUG_OVERRIDES: Record<string, Partial<TemplateConfig>> = {
  // /about-us uses the brand logo as featured image. Hide it entirely —
  // the navbar already shows the brand. Compact header, content-first.
  "about-us": {
    heroDensity: "compact",
    featuredImage: "hidden",
  },
};

export function getTemplateConfig(
  slug: string,
  kind: "page" | "post" | "podcast" | "download",
): TemplateConfig {
  return {
    ...BASE_DEFAULTS,
    ...KIND_DEFAULTS[kind],
    ...(SLUG_OVERRIDES[slug] ?? {}),
  };
}

export const HERO_DENSITY_CLASS: Record<HeroDensity, string> = {
  compact: "py-4 lg:py-6",
  default: "py-6 lg:py-10",
  spacious: "py-10 lg:py-16",
};
