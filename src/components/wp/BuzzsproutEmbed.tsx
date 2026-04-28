import { useCallback, useEffect, useRef } from "react";
import { ExternalLink, Headphones } from "lucide-react";
import type { BuzzsproutEmbed as BuzzsproutEmbedData } from "@/lib/buzzsprout";
import { useImpression } from "@/hooks/use-impression";
import { trackEvent } from "@/lib/analytics";

interface Props {
  embed: BuzzsproutEmbedData;
  title: string;
  /** WordPress post id of the episode — used to attribute the event. */
  postId?: number;
  /** Episode slug — easier than post id for cross-system joins. */
  postSlug?: string;
  /**
   * Heading id rendered above the player. Defaults to a stable id derived
   * from the episode so cross-page anchors / TOCs can link to it.
   */
  headingId?: string;
}

/**
 * Renders the official Buzzsprout small-player UI inside an <iframe>.
 *
 * Why an iframe (not the Buzzsprout JS): we don't want their script in our
 * document — it would bypass our design system and analytics, and on some
 * pages would render alongside the native player. The iframe preserves the
 * exact player Buzzsprout serves, including their internal play stats.
 *
 * Accessibility
 * -------------
 * - Wrapped in a real <section> with a visible <h2> ("Listen to this episode")
 *   so screen-reader heading navigation lands ON the player, not past it.
 *   The H2 is anchored via `aria-labelledby` (not aria-label) so the
 *   accessible name is owned by visible text.
 * - The iframe has a meaningful `title` (used as the accessible name by
 *   assistive tech) and an explicit visible focus ring via Tailwind ring
 *   utilities — keyboard users can SEE when focus has landed on the player.
 * - A "Open on Buzzsprout" link is rendered as a sibling: a guaranteed
 *   keyboard-reachable escape hatch when the iframe controls are awkward
 *   to drive (e.g. some screen readers don't expose the player's inner
 *   buttons reliably across browsers).
 *
 * Analytics — see component history; both events still fire here.
 */
export function BuzzsproutEmbedPlayer({
  embed,
  title,
  postId,
  postSlug,
  headingId,
}: Props) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  // Once-per-mount latch so a user clicking play / pause / seek several times
  // only fires `play_intent` once. Conversion analysis only cares about the
  // first interaction; subsequent clicks are noise.
  const intentFiredRef = useRef(false);

  const containerRef = useImpression<HTMLElement>(
    () => {
      trackEvent("buzzsprout_embed_viewed", {
        episode_id: embed.episodeId,
        podcast_id: embed.podcastId,
        post_id: postId,
        post_slug: postSlug,
      });
    },
    {
      // Stable across remounts during a session so back/forward nav doesn't
      // double-count the same episode page.
      dedupeKey: postSlug ? `buzzsprout_view:${postSlug}` : `buzzsprout_view:${embed.episodeId}`,
    },
  );

  const fireIntent = useCallback(() => {
    if (intentFiredRef.current) return;
    intentFiredRef.current = true;
    trackEvent("buzzsprout_embed_play_intent", {
      episode_id: embed.episodeId,
      podcast_id: embed.podcastId,
      post_id: postId,
      post_slug: postSlug,
    });
  }, [embed.episodeId, embed.podcastId, postId, postSlug]);

  useEffect(() => {
    const onBlur = () => {
      // Defer one tick so `document.activeElement` reflects the new focused
      // element (the iframe) rather than the previous one.
      setTimeout(() => {
        if (document.activeElement === iframeRef.current) {
          fireIntent();
        }
      }, 0);
    };
    window.addEventListener("blur", onBlur);
    return () => window.removeEventListener("blur", onBlur);
  }, [fireIntent]);

  const hId = headingId ?? `buzzsprout-heading-${embed.episodeId}`;
  const externalUrl = `https://www.buzzsprout.com/${embed.podcastId}/episodes/${embed.episodeId}`;

  return (
    <section
      ref={containerRef}
      aria-labelledby={hId}
      className="rounded-xl border border-border bg-[hsl(var(--section-emphasis))] shadow-[var(--shadow-card)] p-3 sm:p-4"
    >
      <h2
        id={hId}
        className="text-eyebrow text-primary mb-2 inline-flex items-center gap-1.5 px-1 font-sans"
      >
        <Headphones className="h-3.5 w-3.5" aria-hidden="true" /> Listen to this episode
      </h2>
      <iframe
        ref={iframeRef}
        src={embed.iframeSrc}
        title={`Buzzsprout audio player for ${title}`}
        loading="lazy"
        width="100%"
        height="200"
        frameBorder={0}
        scrolling="no"
        className="block w-full rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
        allow="autoplay"
      />
      <p className="mt-2 text-caption text-muted-foreground px-1">
        <a
          href={externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 min-h-[44px] py-2 underline underline-offset-2 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
        >
          Open this episode on Buzzsprout
          <ExternalLink className="h-3 w-3" aria-hidden="true" />
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </p>
    </section>
  );
}
