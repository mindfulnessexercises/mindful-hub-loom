import { useParams, Link, Navigate, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/homepage/Navbar";
import { Footer } from "@/components/homepage/Footer";
import { SectionWrapper } from "@/components/homepage/SectionWrapper";
import { WPSeo } from "@/components/wp/WPSeo";
import { VideoPlaylist } from "@/components/video/VideoPlaylist";
import { VIDEO_COLLECTIONS } from "@/lib/video-catalog";
import { InlineEmailCapture } from "@/components/email/InlineEmailCapture";
import type { EmailCaptureTrack } from "@/lib/email-capture-tracks";
import { TrackedCTAButton } from "@/components/cta/TrackedCTAButton";

// Audience-aware copy + secondary CTA per collection. Hand-tuned so the page
// closes with the next-step that matches the collection's intent (e.g. trauma-
// sensitive course → certification, daily clips → free practices newsletter).
const COLLECTION_META: Record<
  string,
  {
    intro: string;
    captureTrack: EmailCaptureTrack;
    secondaryCta?: { destination: "free_resources" | "live_events" | "premium_training" | "certification"; audience: "individual" | "professional" | "neutral" };
  }
> = {
  "intro-to-mindfulness": {
    intro: "A 30-part beginner-friendly course covering the foundations of mindfulness — what it is, why it works, and how to build a sustainable daily practice.",
    captureTrack: "free_resources",
  },
  "sleep-course": {
    intro: "31 guided sleep meditations to help settle a busy mind, release the day, and rest deeply through the night.",
    captureTrack: "free_resources",
  },
  "28-day-challenge": {
    intro: "A four-week mindfulness challenge — one short practice per day to build the habit of presence.",
    captureTrack: "free_resources",
  },
  "living-with-gratitude": {
    intro: "A 25-part series on cultivating sustainable gratitude through formal practice and everyday reflection.",
    captureTrack: "free_resources",
  },
  "mindfulness-of-eating": {
    intro: "Nine practices for mindful eating — recognizing hunger, working with cravings, and rebuilding a healthier relationship with food.",
    captureTrack: "free_resources",
  },
  "fitmind": {
    intro: "Forty meditations from the FitMind app — concentration, awareness, and equanimity practices in short, focused sessions.",
    captureTrack: "free_resources",
  },
  "trauma-sensitive-mindfulness": {
    intro: "An eight-part certification-track training in trauma-sensitive mindfulness teaching, designed for therapists, counselors, and educators.",
    captureTrack: "certification",
    secondaryCta: { destination: "certification", audience: "professional" },
  },
  "guided-meditations": {
    intro: "Hand-picked guided meditations from senior teachers including Tara Brach, Jack Kornfield, and Sharon Salzberg.",
    captureTrack: "free_resources",
  },
  "daily-mindfulness": {
    intro: "Short, accessible daily mindfulness clips for ongoing practice — designed to slot into a busy day.",
    captureTrack: "free_resources",
  },
  "qa-calls": {
    intro: "Live Q&A calls with Sean Fargo and the Mindfulness Exercises community on personal practice, teaching, and integrating mindfulness into daily life.",
    captureTrack: "live_events",
    secondaryCta: { destination: "live_events", audience: "neutral" },
  },
  "guest-teachers": {
    intro: "Talks, panels, and workshops from leading mindfulness teachers around the world.",
    captureTrack: "live_events",
    secondaryCta: { destination: "premium_training", audience: "professional" },
  },
};

export default function VideoCollectionPage() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  if (!slug) return <Navigate to="/videos" replace />;
  const coll = VIDEO_COLLECTIONS[slug];
  if (!coll) return <Navigate to="/videos" replace />;
  const meta = COLLECTION_META[slug] ?? { intro: coll.name, captureTrack: "free_resources" as EmailCaptureTrack };
  // ?v=<provider id> deep-links straight to one video in the playlist —
  // used by site search results and newsletter links. Unknown ids fall back
  // to the first video, so stale links degrade to the plain collection page.
  const requestedVideoId = searchParams.get("v");
  const initialIndex = requestedVideoId
    ? coll.videos.findIndex((v) => v.id === requestedVideoId)
    : -1;

  return (
    <div className="min-h-screen bg-background">
      <WPSeo
        title={`${coll.name} — Mindfulness Exercises`}
        description={meta.intro}
        canonical={`https://mindfulnessexercises.com/videos/${slug}`}
        type="website"
      />
      <Navbar />
      <main>
        <SectionWrapper background="primary" ariaLabel={`${coll.name} intro`}>
          <Link
            to="/videos"
            className="inline-flex items-center gap-1.5 text-body-sm text-muted-foreground hover:text-foreground mb-5 min-h-[44px]"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            All video collections
          </Link>
          <div className="max-w-3xl">
            <p className="text-eyebrow text-primary mb-3">{coll.videos.length} guided videos</p>
            <h1 className="text-hero text-foreground mb-4">{coll.name}</h1>
            <p className="text-body-lg text-muted-foreground">{meta.intro}</p>
          </div>
        </SectionWrapper>

        <SectionWrapper background="emphasis" ariaLabel={`${coll.name} playlist`}>
          <VideoPlaylist
            videos={coll.videos}
            location={`video_collection_${slug}`}
            initialIndex={initialIndex >= 0 ? initialIndex : 0}
          />
        </SectionWrapper>

        <SectionWrapper background="alternate" ariaLabel="Next steps">
          <div className="max-w-2xl mx-auto space-y-6">
            <InlineEmailCapture
              track={meta.captureTrack}
              location={`video_collection_${slug}_inline`}
              variant="card"
            />
            {meta.secondaryCta && (
              <div className="flex justify-center">
                <TrackedCTAButton
                  destination={meta.secondaryCta.destination}
                  audience={meta.secondaryCta.audience}
                  location={`video_collection_${slug}_secondary`}
                  size="lg"
                  variant="outline"
                />
              </div>
            )}
          </div>
        </SectionWrapper>
      </main>
      <Footer />
    </div>
  );
}
