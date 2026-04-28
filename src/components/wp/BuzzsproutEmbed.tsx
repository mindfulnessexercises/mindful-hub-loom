import { useCallback, useEffect, useRef } from "react";
import { Headphones } from "lucide-react";
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
}

/**
 * Renders the official Buzzsprout small-player UI inside an <iframe>.
 *
 * Why an iframe (not the Buzzsprout JS): we don't want their script in our
 * document — it would bypass our design system and analytics, and on some
 * pages would render alongside the native player. The iframe preserves the
 * exact player Buzzsprout serves, including their internal play stats.
 *
 * Analytics
 * ---------
 * Cross-origin iframes block us from reading `play` / `ended` events directly
 * (Buzzsprout doesn't expose a postMessage API on the small player). So we
 * instrument the two signals we CAN measure reliably:
 *
 *   1. `buzzsprout_embed_viewed`        — 50%-visible-for-400ms impression,
 *                                          deduped across mounts via slug.
 *   2. `buzzsprout_embed_play_intent`   — fires when the user clicks INSIDE
 *                                          the iframe. Detected via the
 *                                          window-blur + activeElement check:
 *                                          when an iframe takes focus, the
 *                                          parent window loses focus and the
 *                                          iframe becomes `document.activeElement`.
 *                                          Honest naming — we can't confirm
 *                                          playback started, only that the
 *                                          user interacted with the player.
 */
export function BuzzsproutEmbedPlayer({ embed, title, postId, postSlug }: Props) {
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

  return (
    <section
      ref={containerRef}
      aria-label={`Listen to ${title}`}
      className="rounded-xl border border-border bg-[hsl(var(--section-emphasis))] shadow-[var(--shadow-card)] p-3 sm:p-4"
    >
      <p className="text-eyebrow text-primary mb-2 inline-flex items-center gap-1.5 px-1">
        <Headphones className="h-3.5 w-3.5" /> Listen to this episode
      </p>
      <iframe
        ref={iframeRef}
        src={embed.iframeSrc}
        title={`Buzzsprout player — ${title}`}
        loading="lazy"
        width="100%"
        height="200"
        frameBorder={0}
        scrolling="no"
        className="block w-full rounded-md"
        sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
      />
    </section>
  );
}
