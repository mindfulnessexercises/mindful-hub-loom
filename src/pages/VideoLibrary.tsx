import { Link } from "react-router-dom";
import { ArrowRight, Video } from "lucide-react";
import { Navbar } from "@/components/homepage/Navbar";
import { Footer } from "@/components/homepage/Footer";
import { SectionWrapper, SectionHeader } from "@/components/homepage/SectionWrapper";
import { WPSeo } from "@/components/wp/WPSeo";
import { VIDEO_COLLECTIONS } from "@/lib/video-catalog";
import { InlineEmailCapture } from "@/components/email/InlineEmailCapture";

/**
 * Hub page listing every video collection (Sleep, Intro, Q&A, Guest Teachers, etc.).
 * Each card links into the per-collection page where the actual lite-load
 * playlist UI lives. Browsing the hub itself loads zero player iframes.
 *
 * Display order is intentional, not alphabetical — courses first (the most
 * structured viewing experience), then short-form clips, then the long-form
 * Q&A and Guest Teacher archives at the bottom.
 */
const COLLECTION_ORDER: ReadonlyArray<{ slug: string; tagline: string; audience: string }> = [
  { slug: "intro-to-mindfulness", tagline: "A complete beginner-friendly path into mindfulness practice.", audience: "For individuals" },
  { slug: "sleep-course", tagline: "Guided sleep meditations to settle the mind and rest deeply.", audience: "For individuals" },
  { slug: "28-day-challenge", tagline: "A 28-day mindfulness challenge — one short practice per day.", audience: "For individuals" },
  { slug: "living-with-gratitude", tagline: "A 25-part series on cultivating sustainable gratitude.", audience: "For individuals" },
  { slug: "mindfulness-of-eating", tagline: "Practices for mindful eating, hunger awareness, and food relationships.", audience: "For individuals" },
  { slug: "fitmind", tagline: "FitMind app meditations: training overviews and concentration practices.", audience: "For individuals" },
  { slug: "trauma-sensitive-mindfulness", tagline: "Certification-track training in trauma-sensitive mindfulness teaching.", audience: "For professionals" },
  { slug: "guided-meditations", tagline: "Hand-picked guided meditations from senior teachers.", audience: "For everyone" },
  { slug: "daily-mindfulness", tagline: "Short daily mindfulness clips for ongoing practice.", audience: "For everyone" },
  { slug: "qa-calls", tagline: "Live Q&A calls with Sean Fargo on practice and teaching.", audience: "For practitioners" },
  { slug: "guest-teachers", tagline: "Talks and workshops from leading mindfulness teachers worldwide.", audience: "For practitioners" },
];

export default function VideoLibrary() {
  return (
    <div className="min-h-screen bg-background">
      <WPSeo
        title="Video Library — Guided Mindfulness Videos | Mindfulness Exercises"
        description="Hundreds of guided mindfulness videos: complete courses, daily practices, Q&A calls, and talks from leading teachers worldwide."
        canonical="https://mindfulnessexercises.com/videos"
        type="website"
      />
      <Navbar />
      <main>
        <SectionWrapper background="primary" ariaLabel="Video Library introduction">
          <div className="max-w-3xl">
            <p className="text-eyebrow text-primary mb-3">Video Library</p>
            <h1 className="text-hero text-foreground mb-4">
              Guided mindfulness in your own time
            </h1>
            <p className="text-body-lg text-muted-foreground">
              {Object.values(VIDEO_COLLECTIONS).reduce((n, c) => n + c.videos.length, 0)}+
              guided videos across {Object.keys(VIDEO_COLLECTIONS).length} collections —
              complete courses, daily practices, live Q&A calls, and talks from leading
              mindfulness teachers.
            </p>
          </div>
        </SectionWrapper>

        <SectionWrapper background="emphasis" ariaLabel="Video collections">
          <SectionHeader
            headingId="video-collections-heading"
            eyebrow="Browse by collection"
            title="Pick a collection that fits your practice"
            subtitle="Course-style series for structured learning, plus open archives of Q&A, daily clips, and guest talks."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {COLLECTION_ORDER.map(({ slug, tagline, audience }) => {
              const coll = VIDEO_COLLECTIONS[slug];
              if (!coll) return null;
              return (
                <Link
                  key={slug}
                  to={`/videos/${slug}`}
                  className="group rounded-xl border border-border bg-card p-5 sm:p-6 flex flex-col shadow-card hover:shadow-card-hover hover:border-primary/20 transition-all duration-300 min-h-[44px]"
                >
                  <div className="flex items-center gap-2.5 mb-3">
                    <span className="h-9 w-9 rounded-lg bg-primary/[0.08] flex items-center justify-center shrink-0">
                      <Video className="h-4 w-4 text-primary" aria-hidden="true" />
                    </span>
                    <span className="text-eyebrow text-muted-foreground">{audience}</span>
                  </div>
                  <h2 className="font-serif text-lg font-semibold text-foreground leading-snug mb-1.5">
                    {coll.name}
                  </h2>
                  <p className="text-body-sm text-muted-foreground flex-1 mb-4">{tagline}</p>
                  <p className="inline-flex items-center gap-1.5 text-body-sm font-medium text-primary group-hover:gap-2 transition-all">
                    {coll.videos.length} videos
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </p>
                </Link>
              );
            })}
          </div>
        </SectionWrapper>

        <SectionWrapper background="alternate" ariaLabel="Video Library newsletter">
          <div className="max-w-2xl mx-auto">
            <InlineEmailCapture
              track="free_resources"
              location="video_library_inline"
              variant="card"
            />
          </div>
        </SectionWrapper>
      </main>
      <Footer />
    </div>
  );
}
