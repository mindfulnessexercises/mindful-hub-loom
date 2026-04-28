import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/homepage/Navbar";
import { Footer } from "@/components/homepage/Footer";
import { Button } from "@/components/ui/button";
import { WPSeo } from "@/components/wp/WPSeo";
import { WPBreadcrumbs } from "@/components/wp/WPBreadcrumbs";
import { ShareBar } from "@/components/wp/ShareBar";
import { BuzzsproutEmbedPlayer } from "@/components/wp/BuzzsproutEmbed";
import { BuzzsproutEpisodeSections } from "@/components/wp/BuzzsproutEpisodeSections";
import { trackEvent } from "@/lib/analytics";
import type { BuzzsproutEpisodeRecord } from "@/lib/buzzsprout-lookup";

interface Props {
  record: BuzzsproutEpisodeRecord;
}

function formatDuration(seconds: number | null): string | null {
  if (!seconds || seconds <= 0) return null;
  const mins = Math.round(seconds / 60);
  return `${mins} min`;
}

function formatDate(iso: string | null): string | null {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return null;
  }
}

/**
 * Renders a podcast-episode page directly from the cached Buzzsprout row when
 * no matching WordPress post exists. Used for newly-published episodes that
 * haven't been mirrored to WP yet.
 */
export function BuzzsproutEpisodeFallback({ record }: Props) {
  const dateText = formatDate(record.publishedAt);
  const durationText = formatDuration(record.durationSeconds);
  const url =
    typeof window !== "undefined"
      ? window.location.href
      : `https://mindfulnessexercises.com/podcast-episodes/${record.slug}`;

  useEffect(() => {
    trackEvent("buzzsprout_fallback_page_viewed", {
      episode_id: record.embed.episodeId,
      post_slug: record.slug,
    });
  }, [record.embed.episodeId, record.slug]);

  const description =
    record.aiSummary?.slice(0, 160) ??
    "Listen to this Mindfulness Exercises podcast episode with Sean Fargo.";

  return (
    <div className="min-h-screen bg-background">
      <WPSeo
        title={`${record.title} — Mindfulness Exercises Podcast`}
        description={description}
        canonical={`https://mindfulnessexercises.com/podcast-episodes/${record.slug}`}
        ogImage={record.artworkUrl ?? undefined}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "PodcastEpisode",
          name: record.title,
          datePublished: record.publishedAt ?? undefined,
          description: description,
          image: record.artworkUrl ?? undefined,
          associatedMedia: {
            "@type": "MediaObject",
            contentUrl: `https://www.buzzsprout.com/${record.embed.podcastId}/episodes/${record.embed.episodeId}`,
          },
        }}
      />
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 pt-6 pb-16">
        <WPBreadcrumbs
          items={[
            { label: "Podcast", href: "/podcast" },
            { label: record.title },
          ]}
        />

        <header className="mt-4">
          <p className="text-eyebrow text-primary mb-3">New episode</p>
          <h1 className="font-serif text-4xl sm:text-5xl leading-tight text-foreground">
            {record.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-caption text-muted-foreground">
            {dateText && (
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                {dateText}
              </span>
            )}
            {durationText && (
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                {durationText}
              </span>
            )}
          </div>
        </header>

        {record.artworkUrl && (
          <img
            src={record.artworkUrl}
            alt=""
            loading="eager"
            className="mt-8 w-full max-w-md rounded-xl shadow-[var(--shadow-card)]"
          />
        )}

        <div className="mt-8">
          <BuzzsproutEmbedPlayer
            embed={record.embed}
            title={record.title}
            postSlug={record.slug}
          />
        </div>

        <div className="mt-6">
          <ShareBar title={record.title} url={url} />
        </div>

        <BuzzsproutEpisodeSections record={record} includeShowNotes />

        <div className="mt-16 border-t border-border pt-8">
          <Button asChild variant="outline" className="min-h-[44px]">
            <Link to="/podcast">
              Browse all episodes <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
