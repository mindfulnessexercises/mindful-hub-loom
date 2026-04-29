import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { SectionWrapper } from "@/components/homepage/SectionWrapper";
import { trackCtaClick } from "@/lib/analytics";

/**
 * Keyword-focused content block whose primary job is SEO, not conversion.
 *
 * Why this section exists separately from the existing routing strips:
 *   • The homepage previously had no body copy that *mentions* the head
 *     keyword "mindfulness exercises" beyond the H1. Google needs the
 *     phrase to appear in indexable text plus internal anchor text to
 *     keep the page ranking for it as competition grows.
 *   • The existing tile rows use stylized labels (e.g. "Browse by format")
 *     that don't carry intent-matched anchor text. This section adds keyword-
 *     rich anchors ("free mindfulness affirmations", "guided meditation
 *     videos", "mindfulness teacher certification courses") pointing at the
 *     hubs the SEO team wants strengthened: /affirmations, /videos,
 *     /free-online-mindfulness-courses, /meditation-scripts, /quotes,
 *     /audio-library, plus the highest-volume /category/* pages.
 *
 * Visual rules:
 *   • Lora serif for the H2 + H3s, DM Sans for body — matches site memory.
 *   • Generous whitespace, no chrome, no conversion CTAs (those belong to
 *     other sections). This block reads like editorial.
 *   • All anchors meet the 44px tap-target rule via `inline-block py-1`.
 *
 * Internal-link anchors are stored in one array so the link strategy is
 * easy to audit against the SEO sheet.
 */

interface IntentCluster {
  /** Keyword-driven sub-heading. Mounts as <h3>. */
  heading: string;
  /** Body copy — must mention the head term naturally, not stuff. */
  body: string;
  /** In-paragraph anchor links surfaced as a link list beneath the body. */
  links: Array<{ to: string; label: string; cta_location: string }>;
}

const CLUSTERS: IntentCluster[] = [
  {
    heading: "Free guided mindfulness exercises for daily practice",
    body: "Our library holds 3,000+ free mindfulness exercises — short audio practices, worksheets, and printable scripts you can use today. Whether you have three minutes or thirty, there is a guided practice to fit your moment.",
    links: [
      { to: "/audio-library", label: "Browse guided audio meditations", cta_location: "seo_block_audio" },
      { to: "/videos", label: "Watch guided meditation videos", cta_location: "seo_block_videos" },
      { to: "/library", label: "Open the full mindfulness library", cta_location: "seo_block_library" },
    ],
  },
  {
    heading: "Mindfulness scripts, affirmations & quotes",
    body: "Teachers, therapists, and coaches use our written practices to lead sessions, build worksheets, and design programs. Every collection is free to download and reuse with attribution.",
    links: [
      { to: "/meditation-scripts", label: "Free mindfulness meditation scripts", cta_location: "seo_block_scripts" },
      { to: "/affirmations", label: "Mindfulness affirmations by audience", cta_location: "seo_block_affirmations" },
      { to: "/quotes", label: "Curated mindfulness quotes", cta_location: "seo_block_quotes" },
    ],
  },
  {
    heading: "Mindfulness exercises for what you're feeling",
    body: "Find the right practice for the moment — whether you are managing anxiety, struggling to sleep, building a beginner's habit, or wanting to deepen compassion.",
    links: [
      { to: "/category/anxiety", label: "Mindfulness exercises for anxiety", cta_location: "seo_block_anxiety" },
      { to: "/category/sleep", label: "Mindfulness for sleep", cta_location: "seo_block_sleep" },
      { to: "/category/beginners", label: "Mindfulness for beginners", cta_location: "seo_block_beginners" },
      { to: "/category/compassion", label: "Compassion & loving-kindness practices", cta_location: "seo_block_compassion" },
      { to: "/category/mindfulness-stress-reduction", label: "Mindfulness-based stress reduction", cta_location: "seo_block_mbsr" },
      { to: "/category/gratitude", label: "Gratitude meditations", cta_location: "seo_block_gratitude" },
    ],
  },
  {
    heading: "Teach mindfulness — courses & certification",
    body: "Sean Fargo's APA-approved Mindfulness Teacher Certification trains therapists, counselors, coaches, and educators to lead evidence-based practices. Free supporting courses and worksheets accompany the program.",
    links: [
      { to: "/free-online-mindfulness-courses", label: "Free online mindfulness courses", cta_location: "seo_block_free_courses" },
      { to: "/category/mindfulness-worksheets", label: "Mindfulness worksheets for clients", cta_location: "seo_block_worksheets" },
      { to: "/category/free-mindfulness-ebooks", label: "Free mindfulness ebooks", cta_location: "seo_block_ebooks" },
    ],
  },
];

export function KeywordSeoSection() {
  return (
    <SectionWrapper
      id="explore-mindfulness-exercises"
      ariaLabel="Explore mindfulness exercises"
      background="alternate"
    >
      {/* Intro — single H2 anchors the section in the heading outline. */}
      <div className="max-w-3xl mb-14 sm:mb-16">
        <p className="text-eyebrow text-primary mb-3">Explore the library</p>
        <h2
          id="explore-mindfulness-exercises-heading"
          className="text-section-heading text-foreground"
        >
          Free mindfulness exercises for every moment & intention
        </h2>
        <p className="text-body-lg text-muted-foreground mt-5">
          Mindfulness Exercises is a free, donation-supported library of guided
          practices, scripts, worksheets, and teacher training resources. Use the
          collections below to find the right mindfulness exercise for the
          person, feeling, or context in front of you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12">
        {CLUSTERS.map((cluster) => (
          <article
            key={cluster.heading}
            className="rounded-xl border border-border/60 bg-background p-7 sm:p-8 shadow-[var(--shadow-sm)]"
          >
            <h3 className="text-card-heading font-serif text-foreground">
              {cluster.heading}
            </h3>
            <p className="text-body text-muted-foreground mt-3">
              {cluster.body}
            </p>
            <ul className="mt-5 space-y-1.5">
              {cluster.links.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    onClick={() =>
                      trackCtaClick({
                        cta_label: link.label,
                        cta_destination: link.to,
                        cta_location: link.cta_location,
                      })
                    }
                    className="group inline-flex min-h-[44px] items-center gap-1.5 py-1 text-sm font-semibold text-primary hover:underline underline-offset-4"
                  >
                    {link.label}
                    <ArrowRight
                      className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </SectionWrapper>
  );
}
