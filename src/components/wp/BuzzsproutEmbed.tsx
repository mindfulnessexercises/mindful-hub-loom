import { Headphones } from "lucide-react";
import type { BuzzsproutEmbed as BuzzsproutEmbedData } from "@/lib/buzzsprout";

interface Props {
  embed: BuzzsproutEmbedData;
  title: string;
}

/**
 * Renders the official Buzzsprout small-player UI inside an <iframe>.
 * Avoids loading the Buzzsprout JS into our document (which would bypass
 * our design system + analytics) while preserving the exact player the
 * episode pages have always used — same play stats, same audio source.
 */
export function BuzzsproutEmbedPlayer({ embed, title }: Props) {
  return (
    <section
      aria-label={`Listen to ${title}`}
      className="rounded-xl border border-border bg-[hsl(var(--section-emphasis))] shadow-[var(--shadow-card)] p-3 sm:p-4"
    >
      <p className="text-eyebrow text-primary mb-2 inline-flex items-center gap-1.5 px-1">
        <Headphones className="h-3.5 w-3.5" /> Listen to this episode
      </p>
      <iframe
        src={embed.iframeSrc}
        title={`Buzzsprout player — ${title}`}
        loading="lazy"
        width="100%"
        height="200"
        frameBorder={0}
        scrolling="no"
        className="block w-full rounded-md"
        // Buzzsprout serves the embed over https; allow-same-origin lets the
        // player communicate with buzzsprout.com for play stats.
        sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
      />
    </section>
  );
}
