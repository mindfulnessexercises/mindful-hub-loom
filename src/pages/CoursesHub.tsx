import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, PlayCircle, Sparkles } from "lucide-react";
import { Navbar } from "@/components/homepage/Navbar";
import { Footer } from "@/components/homepage/Footer";
import { SectionWrapper, SectionHeader } from "@/components/homepage/SectionWrapper";
import { WPSeo } from "@/components/wp/WPSeo";
import { InlineEmailCapture } from "@/components/email/InlineEmailCapture";
import { VIDEO_COLLECTIONS } from "@/lib/video-catalog";
import { cn } from "@/lib/utils";

/**
 * Free Online Mindfulness Courses — hub page rendered at
 * /free-online-mindfulness-courses (the legacy WP URL).
 *
 * Why we replace the WP version:
 *   The WordPress page is a flat bullet list — title + lesson count, nothing
 *   else. We have richer source material: 11 of the 16 courses already have
 *   a fully-built video playlist in VIDEO_COLLECTIONS, with per-lesson
 *   titles, durations, and lite-load Vimeo/YouTube embeds. This page surfaces
 *   that content and previews the first few lessons inline so visitors see
 *   immediately what they're getting.
 *
 * Course-to-collection mapping:
 *   `videoSlug` points at a VIDEO_COLLECTIONS key — those cards become
 *   "Start course" CTAs that route to /videos/{slug}, where the full
 *   per-lesson playlist UI lives.
 *
 *   Courses without a built collection yet (e.g. 4 Foundations, 10-Day
 *   Vipassana, Search Inside Yourself) fall through to the legacy WP page
 *   via `wpSlug` — preserves SEO continuity and the user can still reach
 *   the lesson list, just rendered through WPResolver until we build the
 *   video collection out.
 */

type Difficulty = "Easy" | "Intermediate" | "Advanced";

interface CourseEntry {
  /** Display title (overrides the collection name when set). */
  title: string;
  /** One-sentence positioning copy. */
  intro: string;
  /** Lesson count surfaced from WP — kept as the source of truth. */
  lessons: number;
  difficulty: Difficulty;
  /** Maps to VIDEO_COLLECTIONS key when we have native video content. */
  videoSlug?: string;
  /** Falls back to the legacy WP course slug when no collection exists. */
  wpSlug?: string;
  /** Tagged audience for the chip. */
  audience: "Beginners" | "Daily practice" | "Advanced practitioners" | "Teachers" | "Parents & kids" | "Workplace";
  /** Marks the highest-impact entry rows for visual emphasis. */
  featured?: boolean;
}

// Source of truth for what's on the WP page (Apr 2026), reordered for narrative
// flow: most-recommended starting points first, then daily-practice loops,
// then specialised tracks, then advanced/professional tracks at the bottom.
const COURSES: readonly CourseEntry[] = [
  {
    title: "Introduction to Mindfulness",
    intro:
      "A 34-lesson beginner-friendly path covering what mindfulness is, why it works, and how to build a daily practice that lasts.",
    lessons: 34,
    difficulty: "Easy",
    videoSlug: "intro-to-mindfulness",
    audience: "Beginners",
    featured: true,
  },
  {
    title: "The 28-Day Mindfulness Challenge",
    intro:
      "Four weeks, one short practice per day — the simplest way to turn mindfulness into a habit you actually keep.",
    lessons: 29,
    difficulty: "Easy",
    videoSlug: "28-day-challenge",
    audience: "Beginners",
    featured: true,
  },
  {
    title: "Sleep Meditations",
    intro:
      "31 guided practices to release the day, settle a busy mind, and rest more deeply — designed to be listened to in bed.",
    lessons: 31,
    difficulty: "Easy",
    videoSlug: "sleep-course",
    audience: "Daily practice",
  },
  {
    title: "Living With Gratitude",
    intro:
      "A 25-part series for cultivating sustainable gratitude through formal sits and small everyday reflections.",
    lessons: 25,
    difficulty: "Intermediate",
    videoSlug: "living-with-gratitude",
    audience: "Daily practice",
  },
  {
    title: "Mindfulness of Eating",
    intro:
      "Nine practices for recognising hunger, working with cravings, and rebuilding a calmer relationship with food.",
    lessons: 9,
    difficulty: "Easy",
    videoSlug: "mindfulness-of-eating",
    audience: "Daily practice",
  },
  {
    title: "Mindfulness Meditations for Kids",
    intro:
      "Six short, friendly meditations to share with children — gentle introductions to attention, kindness, and calm.",
    lessons: 6,
    difficulty: "Easy",
    wpSlug: "mindfulness-meditations-for-kids",
    audience: "Parents & kids",
  },
  {
    title: "The 4 Foundations of Mindfulness",
    intro:
      "A 7-lesson contemplative deep-dive into body, feeling tone, mind, and dhammas — the heart of the Satipaṭṭhāna teachings.",
    lessons: 7,
    difficulty: "Advanced",
    wpSlug: "the4-foundations-of-mindfulness",
    audience: "Advanced practitioners",
  },
  {
    title: "10-Day Vipassana Course",
    intro:
      "A 16-lesson home-retreat structure modelled on the silent Vipassana tradition — for serious practitioners ready to go deeper.",
    lessons: 16,
    difficulty: "Advanced",
    wpSlug: "10-day-vipassana-course",
    audience: "Advanced practitioners",
  },
  {
    title: "Loving-Kindness and Emptiness",
    intro:
      "Six advanced practices weaving the brahmavihārās with emptiness teachings — for practitioners with an established sit.",
    lessons: 6,
    difficulty: "Advanced",
    wpSlug: "brahmavihara-and-emptiness",
    audience: "Advanced practitioners",
  },
  {
    title: "The Work That Reconnects",
    intro:
      "A 16-lesson series on Joanna Macy's framework — meeting climate grief and ecological overwhelm with grounded practice.",
    lessons: 16,
    difficulty: "Intermediate",
    wpSlug: "the-work-that-reconnects",
    audience: "Daily practice",
  },
  // Note: "Reducing Workplace Bias" was previously listed here. The legacy
  // WP entry (/free-online-mindfulness-courses/reducing-workplace-bias) is a
  // 301 to /mindfulness-at-work, not an actual structured course — there's
  // no lesson list to render. We surface that page via the legacy redirect
  // map instead and keep the hub clean.
  {
    title: "How To Guide Mindfulness Meditations for Well-Being and Resilience",
    intro:
      "Five lessons for new and developing teachers on guiding meditations that support nervous-system safety and resilience.",
    lessons: 5,
    difficulty: "Intermediate",
    wpSlug: "how-to-guide-mindfulness-meditations-for-well-being-and-resilience",
    audience: "Teachers",
  },
  {
    title: "'Search Inside Yourself' Program Intro",
    intro:
      "An 8-lesson overview of the mindfulness and emotional-intelligence program developed at Google.",
    lessons: 8,
    difficulty: "Easy",
    wpSlug: "search-inside-yourself-program-developed-at-google",
    audience: "Workplace",
  },
  {
    title: "Mindfulness Worksheets Tutorials",
    intro:
      "20 short tutorials on using our printable worksheets — for personal practice and for client/group sessions.",
    lessons: 20,
    difficulty: "Easy",
    wpSlug: "mindfulness-worksheets-tutorials",
    audience: "Teachers",
  },
  {
    title: "UCLA's Guided Meditations",
    intro:
      "12 evidence-based guided practices from UCLA's Mindful Awareness Research Center, in English and Spanish.",
    lessons: 12,
    difficulty: "Easy",
    wpSlug: "uclas-guided-meditations-english-spanish",
    audience: "Beginners",
  },
];

const DIFFICULTY_STYLE: Record<Difficulty, string> = {
  Easy: "bg-emerald-50 text-emerald-800 border-emerald-200",
  Intermediate: "bg-amber-50 text-amber-800 border-amber-200",
  Advanced: "bg-rose-50 text-rose-900 border-rose-200",
};

function courseHref(c: CourseEntry): string {
  if (c.videoSlug) return `/videos/${c.videoSlug}`;
  return `/free-online-mindfulness-courses/${c.wpSlug}`;
}

function CourseCard({ course }: { course: CourseEntry }) {
  const collection = course.videoSlug ? VIDEO_COLLECTIONS[course.videoSlug] : undefined;
  const previewLessons = collection?.videos.slice(0, 3) ?? [];
  const hasVideos = previewLessons.length > 0;

  return (
    <article
      className={cn(
        "group rounded-2xl border bg-card flex flex-col shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden",
        course.featured ? "border-primary/30" : "border-border hover:border-primary/20",
      )}
    >
      <div className="p-6 sm:p-7 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <span className="text-eyebrow text-muted-foreground">{course.audience}</span>
          <span
            className={cn(
              "text-caption font-medium border rounded-full px-2.5 py-0.5",
              DIFFICULTY_STYLE[course.difficulty],
            )}
          >
            {course.difficulty}
          </span>
          {course.featured && (
            <span className="inline-flex items-center gap-1 text-caption font-medium text-primary">
              <Sparkles className="h-3 w-3" aria-hidden="true" />
              Recommended start
            </span>
          )}
        </div>

        <h2 className="font-serif text-xl sm:text-2xl font-semibold text-foreground leading-snug mb-2">
          <Link
            to={courseHref(course)}
            className="hover:text-primary focus-visible:text-primary outline-none"
          >
            {course.title}
          </Link>
        </h2>

        <p className="text-body-sm text-muted-foreground mb-5">{course.intro}</p>

        <div className="flex items-center gap-3 text-caption text-muted-foreground mb-5">
          <span className="inline-flex items-center gap-1.5">
            <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
            {course.lessons} lessons
          </span>
          {hasVideos && (
            <span className="inline-flex items-center gap-1.5">
              <PlayCircle className="h-3.5 w-3.5" aria-hidden="true" />
              Video lessons inside
            </span>
          )}
        </div>

        {hasVideos && (
          <ol className="border-t border-border pt-4 mb-5 space-y-2">
            {previewLessons.map((v, i) => (
              <li
                key={`${v.provider}-${v.id}-${i}`}
                className="flex items-start gap-3 text-body-sm"
              >
                <span
                  aria-hidden="true"
                  className="mt-0.5 h-6 w-6 shrink-0 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-xs font-semibold"
                >
                  {i + 1}
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block text-foreground/90 leading-snug line-clamp-1">
                    {v.title}
                  </span>
                  {v.duration && (
                    <span className="block text-caption text-muted-foreground mt-0.5">
                      {v.duration}
                    </span>
                  )}
                </span>
              </li>
            ))}
            {collection && collection.videos.length > previewLessons.length && (
              <li className="text-caption text-muted-foreground pl-9">
                + {collection.videos.length - previewLessons.length} more lessons
              </li>
            )}
          </ol>
        )}

        <div className="mt-auto">
          <Link
            to={courseHref(course)}
            className="inline-flex items-center gap-1.5 text-body-sm font-semibold text-primary group-hover:gap-2 transition-all min-h-[44px]"
          >
            {hasVideos ? "Start course" : "View course"}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function CoursesHub() {
  const totalLessons = COURSES.reduce((n, c) => n + c.lessons, 0);
  const withVideo = COURSES.filter((c) => c.videoSlug).length;

  return (
    <div className="min-h-screen bg-background">
      <WPSeo
        title="Free Online Mindfulness Courses — Lessons, Videos & Guided Practices"
        description={`${COURSES.length} free mindfulness courses with ${totalLessons}+ lessons — guided videos for sleep, gratitude, eating, kids, workplace, and advanced contemplative practice.`}
        canonical="https://mindfulnessexercises.com/free-online-mindfulness-courses"
        type="website"
      />
      <Navbar />
      <main>
        <SectionWrapper background="primary" ariaLabel="Free Online Mindfulness Courses introduction">
          <div className="max-w-3xl">
            <p className="text-eyebrow text-primary mb-3">Free Online Courses</p>
            <h1 className="text-hero text-foreground mb-4">
              Free mindfulness courses, taught lesson by lesson
            </h1>
            <p className="text-body-lg text-muted-foreground">
              {COURSES.length} courses · {totalLessons}+ lessons · {withVideo} now with built-in
              video playlists. Pick a path — beginner to advanced — and watch each lesson without
              leaving the page.
            </p>
          </div>
        </SectionWrapper>

        <SectionWrapper background="emphasis" ariaLabel="Course catalog">
          <SectionHeader
            headingId="course-catalog-heading"
            eyebrow="Pick a course"
            title="Choose a course that meets you where you are"
            subtitle="Each course opens to a player view with every lesson in order — short clips for daily practice, longer arcs for deeper study."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {COURSES.map((c) => (
              <CourseCard key={c.title} course={c} />
            ))}
          </div>
        </SectionWrapper>

        <SectionWrapper background="alternate" ariaLabel="Courses newsletter">
          <div className="max-w-2xl mx-auto">
            <InlineEmailCapture
              track="free_resources"
              location="courses_hub_inline"
              variant="card"
            />
          </div>
        </SectionWrapper>
      </main>
      <Footer />
    </div>
  );
}
