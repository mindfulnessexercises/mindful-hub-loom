import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, BookOpen, ExternalLink, PlayCircle } from "lucide-react";
import { Navbar } from "@/components/homepage/Navbar";
import { Footer } from "@/components/homepage/Footer";
import { SectionWrapper, SectionHeader } from "@/components/homepage/SectionWrapper";
import { WPSeo } from "@/components/wp/WPSeo";
import { InlineEmailCapture } from "@/components/email/InlineEmailCapture";
import NotFound from "@/pages/NotFound";
import {
  getCourseDetail,
  WP_COURSE_ORIGIN,
  type CourseDetail,
  type CourseLesson,
  type Difficulty,
} from "@/lib/course-catalog";
import { cn } from "@/lib/utils";

/**
 * Native detail page for the legacy WordPress courses that are NOT exposed
 * via WP REST (Thrive Apprentice CPT). Mounted at
 * /free-online-mindfulness-courses/:slug for the slugs in COURSE_DETAILS;
 * everything else continues to fall through to WPResolver.
 *
 * Lesson links currently route off-site to the live WP /course/<slug>/ page
 * — that's where the actual lesson content (video / audio / text) still
 * lives. This page exists so the hub's "View course" CTA lands on a
 * useful, on-brand page that previews the full lesson outline instead of
 * 404-ing.
 */

const DIFFICULTY_STYLE: Record<Difficulty, string> = {
  Easy: "bg-emerald-50 text-emerald-800 border-emerald-200",
  Intermediate: "bg-amber-50 text-amber-800 border-amber-200",
  Advanced: "bg-rose-50 text-rose-900 border-rose-200",
};

function LessonRow({ lesson, index }: { lesson: CourseLesson; index: number }) {
  const href = `${WP_COURSE_ORIGIN}/course/${lesson.slug}/`;
  return (
    <li>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-start gap-4 rounded-xl border border-border bg-card p-4 sm:p-5 hover:border-primary/40 hover:shadow-card-hover transition-all min-h-[44px]"
      >
        <span
          aria-hidden="true"
          className="mt-0.5 h-9 w-9 shrink-0 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm font-semibold group-hover:bg-primary/10 group-hover:text-primary transition-colors"
        >
          {index}
        </span>
        <span className="flex-1 min-w-0">
          <span className="block text-body font-medium text-foreground leading-snug group-hover:text-primary transition-colors">
            {lesson.title}
          </span>
          <span className="mt-1 inline-flex items-center gap-1.5 text-caption text-muted-foreground">
            Open lesson
            <ExternalLink className="h-3 w-3" aria-hidden="true" />
          </span>
        </span>
      </a>
    </li>
  );
}

function LessonList({ lessons }: { lessons: readonly CourseLesson[] }) {
  // Group lessons by their preceding `groupHeading` so visually distinct
  // sections of the curriculum stay together. Lessons without a heading
  // continue the previous group.
  const groups: { heading?: string; items: { lesson: CourseLesson; index: number }[] }[] = [];
  lessons.forEach((lesson, i) => {
    if (lesson.groupHeading || groups.length === 0) {
      groups.push({ heading: lesson.groupHeading, items: [] });
    }
    groups[groups.length - 1].items.push({ lesson, index: i + 1 });
  });

  return (
    <div className="space-y-10">
      {groups.map((g, gi) => (
        <div key={gi}>
          {g.heading && (
            <h3 className="font-serif text-xl text-foreground mb-4">{g.heading}</h3>
          )}
          <ol className="space-y-3">
            {g.items.map(({ lesson, index }) => (
              <LessonRow key={lesson.slug} lesson={lesson} index={index} />
            ))}
          </ol>
        </div>
      ))}
    </div>
  );
}

function CourseBody({ course }: { course: CourseDetail }) {
  const canonical = `https://mindfulnessexercises.com/free-online-mindfulness-courses/${course.slug}`;

  return (
    <div className="min-h-screen bg-background">
      <WPSeo
        title={`${course.title} — Free Online Mindfulness Course`}
        description={course.description}
        canonical={canonical}
        type="website"
      />
      <Navbar />
      <main>
        <SectionWrapper background="primary" ariaLabel={`${course.title} introduction`}>
          <div className="max-w-3xl">
            <Link
              to="/free-online-mindfulness-courses"
              className="inline-flex items-center gap-1.5 text-body-sm text-muted-foreground hover:text-primary transition-colors mb-6 min-h-[44px]"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              All free courses
            </Link>
            <p className="text-eyebrow text-primary mb-3">Free Online Course</p>
            <h1 className="text-hero text-foreground mb-5">{course.title}</h1>
            <p className="text-body-lg text-muted-foreground mb-6">{course.intro}</p>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-eyebrow text-muted-foreground">{course.audience}</span>
              <span
                className={cn(
                  "text-caption font-medium border rounded-full px-2.5 py-0.5",
                  DIFFICULTY_STYLE[course.difficulty],
                )}
              >
                {course.difficulty}
              </span>
              <span className="inline-flex items-center gap-1.5 text-caption text-muted-foreground">
                <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
                {course.lessons.length} lessons
              </span>
            </div>
          </div>
        </SectionWrapper>

        <SectionWrapper background="emphasis" ariaLabel="Course lessons">
          <SectionHeader
            headingId="course-lessons-heading"
            eyebrow="Lesson plan"
            title="Every lesson in this course"
            subtitle="Tap any lesson to open it. The full lesson library — videos, audio, and written teachings — currently lives on our legacy site and opens in a new tab."
          />
          <div className="max-w-3xl mx-auto">
            <LessonList lessons={course.lessons} />
          </div>
        </SectionWrapper>

        {course.relatedVideoSlug && (
          <SectionWrapper background="alternate" ariaLabel="Related video collection">
            <div className="max-w-2xl mx-auto text-center">
              <p className="text-eyebrow text-muted-foreground mb-3">Watch instead</p>
              <h2 className="text-section-heading mb-4">
                {course.relatedVideoLabel ?? "A related video collection is also available"}
              </h2>
              <Link
                to={`/videos/${course.relatedVideoSlug}`}
                className="inline-flex items-center gap-2 text-body-sm font-semibold text-primary min-h-[44px]"
              >
                <PlayCircle className="h-4 w-4" aria-hidden="true" />
                Open the video collection
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </SectionWrapper>
        )}

        <SectionWrapper background="alternate" ariaLabel="Course newsletter">
          <div className="max-w-2xl mx-auto">
            <InlineEmailCapture
              track="free_resources"
              location={`course_detail_${course.slug}`}
              variant="card"
            />
          </div>
        </SectionWrapper>
      </main>
      <Footer />
    </div>
  );
}

export default function CourseDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const course = slug ? getCourseDetail(slug) : undefined;
  if (!course) return <NotFound />;
  return <CourseBody course={course} />;
}
