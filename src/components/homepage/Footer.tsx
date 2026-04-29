import { Link } from "react-router-dom";

/**
 * Footer IA — rebuilt 2026-04-29.
 *
 * Previously held nine dead `#anchor` links and one bare `#` placeholder
 * (Teacher Directory). Now every link routes to a real page in the new
 * build, prioritising the highest-traffic SEO destinations from the
 * top-100 study and our four user avatars (practitioner, teacher,
 * therapist, organization).
 *
 * Internal app routes use <Link> so React Router handles them without a
 * full page reload; external Mindfulness Exercises sub-domains and
 * absolute http(s) URLs use <a target="_blank" rel="noopener">.
 */

interface FooterLink {
  label: string;
  href: string;
}

const FOOTER_GROUPS: { title: string; links: FooterLink[] }[] = [
  {
    // Practitioner avatar — what brings most organic traffic.
    title: "Practice",
    links: [
      { label: "Audio Library", href: "/audio-library" },
      { label: "Top Guided Meditations", href: "/top-guided-meditations" },
      { label: "Affirmations", href: "/affirmations" },
      { label: "Mindfulness Quotes", href: "/quotes" },
      { label: "Sound & Frequency", href: "/528hz-miracle-tone" },
      { label: "Free Online Courses", href: "/free-online-mindfulness-courses" },
    ],
  },
  {
    // Teacher / therapist avatar — second-largest traffic bucket.
    title: "Teach",
    links: [
      { label: "Free Meditation Scripts", href: "/free-guided-meditation-scripts" },
      { label: "Worksheets", href: "/free-mindfulness-worksheets" },
      { label: "Ebooks", href: "/free-mindfulness-e-books" },
      { label: "How to Teach Meditation", href: "/how-to-teach-meditation" },
      { label: "Scripts for Therapists", href: "/9-mindfulness-scripts-for-therapists" },
      { label: "Scripts for Yoga Teachers", href: "/7-guided-meditation-scripts-for-yoga-teachers" },
    ],
  },
  {
    // Listen + library hubs.
    title: "Listen & Read",
    links: [
      { label: "Podcast", href: "/podcast" },
      { label: "Blog", href: "/blog" },
      { label: "Video Library", href: "/videos" },
      { label: "Library (everything)", href: "/library" },
      { label: "Search", href: "/search" },
    ],
  },
  {
    // Programs & paid offers — drives revenue.
    title: "Programs",
    links: [
      { label: "Teacher Certification", href: "https://certify.mindfulnessexercises.com/" },
      { label: "Trauma-Sensitive Certification", href: "https://trauma.mindfulnessexercises.com/" },
      { label: "200 Meditation Scripts", href: "https://scripts.mindfulnessexercises.com/" },
      { label: "MindfulPro AI", href: "https://mindfulpro.ai/" },
      { label: "Brandable Curriculum", href: "https://curriculum.mindfulnessexercises.com/" },
      { label: "CE Credits & Policies", href: "/ce-policies" },
    ],
  },
  {
    // About + community + B2B.
    title: "About",
    links: [
      { label: "Our Mission", href: "/about-us" },
      { label: "Mindfulness Teachers", href: "/mindfulness-teachers" },
      { label: "Live Events", href: "/#live-events" },
      { label: "White Label", href: "/white-label" },
      { label: "Feedback", href: "/feedback" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms & Conditions", href: "/terms-conditions" },
      { label: "Terms of Purchase", href: "/terms-of-purchase" },
      { label: "Medical Disclaimer", href: "/medical-disclaimer" },
      { label: "Earnings Disclaimer", href: "/earnings-disclaimer" },
      { label: "Anti-Discrimination Policy", href: "/anti-discrimination-policy-statement" },
    ],
  },
];

const BOTTOM_LINKS: FooterLink[] = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms-conditions" },
  { label: "Feedback", href: "/feedback" },
];

function FooterAnchor({ link }: { link: FooterLink }) {
  const isExternal = link.href.startsWith("http");
  const className =
    "text-body-sm text-muted-foreground hover:text-foreground transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm py-1 inline-flex items-center min-h-[32px]";

  if (isExternal) {
    return (
      <a href={link.href} target="_blank" rel="noopener noreferrer" className={className}>
        {link.label}
      </a>
    );
  }
  return (
    <Link to={link.href} className={className}>
      {link.label}
    </Link>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-[hsl(var(--section-alternate))]" role="contentinfo">
      <div className="container mx-auto py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-8 lg:gap-10">
          {/* Brand column */}
          <div className="col-span-2">
            <Link
              to="/"
              className="font-serif text-lg font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm inline-block"
            >
              Mindfulness Exercises
            </Link>
            <p className="text-body-sm text-muted-foreground mt-3 max-w-xs">
              Free mindfulness practices and APA-approved professional training — for a more mindful world.
            </p>
          </div>

          {FOOTER_GROUPS.map((group) => (
            <nav key={group.title} aria-label={`${group.title} links`}>
              <p className="font-sans text-sm font-semibold text-foreground mb-4">{group.title}</p>
              <ul className="space-y-2.5" role="list">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <FooterAnchor link={link} />
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="border-t border-border mt-10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-caption text-muted-foreground">
            © {new Date().getFullYear()} Mindfulness Exercises. All rights reserved.
          </p>
          <nav aria-label="Legal links" className="flex items-center gap-6">
            {BOTTOM_LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="text-caption text-muted-foreground hover:text-foreground transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm py-1"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
