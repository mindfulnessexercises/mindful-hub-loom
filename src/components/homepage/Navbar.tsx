import { useEffect, useRef, useState } from "react";
import {
  Menu,
  X,
  Search as SearchIcon,
  ChevronDown,
  Headphones,
  Sparkles,
  Quote,
  FileText,
  ClipboardList,
  BookOpen,
  Mic,
  GraduationCap,
  Award,
  Users,
  Music2,
  Flower,
  List,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo-mindfulness-exercises.png";
import { SiteSearchBar } from "@/components/wp/SiteSearchBar";

// IA derived from the top-100 traffic study: visitors arrive by FORMAT
// (quotes, affirmations, scripts, guided meditations, etc.) far more than
// by topic. The mega-menu mirrors that — Practice / Teach / Listen / Learn
// — with each link pointing at the highest-ranking landing for that bucket.

interface MenuLink {
  label: string;
  href: string;
  description?: string;
  icon?: typeof Headphones;
  external?: boolean;
}

interface MenuGroup {
  label: string;
  /** Promo blurb shown on the left rail of the mega panel. */
  blurb: { title: string; body: string; href: string; cta: string };
  links: MenuLink[];
}

const MENU: MenuGroup[] = [
  {
    label: "Practice",
    blurb: {
      title: "Start a 5-minute practice",
      body: "Hand-picked guided meditations, free to listen anytime.",
      href: "/audio-library",
      cta: "Open the Audio Library →",
    },
    links: [
      { label: "Guided Meditations", href: "/audio-library", icon: Headphones, description: "Free audio practices, theme-filtered" },
      { label: "Affirmations", href: "/affirmations", icon: Sparkles, description: "By audience and intention" },
      { label: "Quotes", href: "/quotes", icon: Quote, description: "14 themed collections" },
      { label: "Sound & Frequency", href: "/528hz-miracle-tone", icon: Music2, description: "Healing tones & delta waves" },
      { label: "Chakra Practice", href: "/chakra-affirmations", icon: Flower, description: "Affirmations & chants by chakra" },
    ],
  },
  {
    label: "Teach",
    blurb: {
      title: "Built for teachers & therapists",
      body: "Scripts, worksheets, and guides used by thousands of practitioners.",
      href: "/meditation-scripts",
      cta: "Browse all scripts →",
    },
    links: [
      { label: "Meditation Scripts", href: "/meditation-scripts", icon: FileText, description: "Free, audience-tagged" },
      { label: "Worksheets", href: "/free-mindfulness-worksheets", icon: ClipboardList, description: "Printable PDFs" },
      { label: "Ebooks", href: "/free-mindfulness-e-books", icon: BookOpen, description: "Free downloadable guides" },
      { label: "How to Teach", href: "/how-to-teach-meditation", icon: Users, description: "Lead your first session" },
      { label: "Curated Lists", href: "/library?tab=posts", icon: List, description: "Round-ups for therapists & groups" },
    ],
  },
  {
    label: "Listen",
    blurb: {
      title: "The Mindfulness Exercises podcast",
      body: "Long-form interviews with leading meditation teachers.",
      href: "/podcast",
      cta: "Latest episodes →",
    },
    links: [
      { label: "Podcast", href: "/podcast", icon: Mic, description: "Conversations with teachers" },
      { label: "Audio Library", href: "/audio-library", icon: Headphones, description: "Every guided meditation, searchable" },
      { label: "Video Library", href: "/videos", icon: List, description: "Course videos, Q&As & talks" },
      { label: "Free Video Courses", href: "/free-online-mindfulness-courses", icon: GraduationCap, description: "Lesson-by-lesson playlists" },
    ],
  },
  {
    label: "Learn",
    blurb: {
      title: "Free courses with video lessons",
      body: "15 self-paced courses — beginner to advanced — with full lesson playlists you can watch in-page.",
      href: "/free-online-mindfulness-courses",
      cta: "Browse all courses →",
    },
    links: [
      { label: "All Free Courses", href: "/free-online-mindfulness-courses", icon: GraduationCap, description: "15 courses · 270+ lessons" },
      { label: "Introduction to Mindfulness", href: "/videos/intro-to-mindfulness", icon: BookOpen, description: "34-lesson beginner path" },
      { label: "28-Day Mindfulness Challenge", href: "/videos/28-day-challenge", icon: Sparkles, description: "One short practice per day" },
      { label: "Sleep Meditations", href: "/videos/sleep-course", icon: Headphones, description: "31 guided sleep practices" },
      { label: "Living With Gratitude", href: "/videos/living-with-gratitude", icon: Flower, description: "25-part gratitude series" },
      { label: "Get Certified", href: "https://certify.mindfulnessexercises.com/", external: true, icon: Award, description: "Become a teacher" },
    ],
  },
];

const FLAT_LINKS: MenuLink[] = [
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about-us" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [openMobileGroup, setOpenMobileGroup] = useState<string | null>(null);
  const closeTimer = useRef<number | null>(null);

  // Close mega panel on Escape for keyboard users.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenGroup(null);
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Slight delay before closing on mouseleave so a quick cursor wobble
  // between the trigger and panel doesn't drop the menu.
  const scheduleClose = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpenGroup(null), 120);
  };
  const cancelClose = () => {
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/92 backdrop-blur-xl">
      <nav
        className="container mx-auto flex h-14 items-center justify-between"
        aria-label="Main navigation"
        onMouseLeave={scheduleClose}
      >
        <a href="/" className="flex items-center">
          <img
            src={logo}
            alt="Mindfulness Exercises"
            width="180"
            height="32"
            className="h-7 sm:h-8 w-auto"
          />
        </a>

        {/* Desktop grouped links */}
        <ul className="hidden md:flex items-center gap-1">
          {MENU.map((group) => {
            const isOpen = openGroup === group.label;
            return (
              <li
                key={group.label}
                className="relative"
                onMouseEnter={() => {
                  cancelClose();
                  setOpenGroup(group.label);
                }}
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-haspopup="true"
                  onClick={() => setOpenGroup(isOpen ? null : group.label)}
                  className={`inline-flex items-center gap-1 rounded-md px-3 py-2 text-[0.8125rem] font-medium transition-colors min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                    isOpen
                      ? "text-foreground bg-accent/40"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/30"
                  }`}
                >
                  {group.label}
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    aria-hidden
                  />
                </button>
              </li>
            );
          })}
          {FLAT_LINKS.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="inline-flex items-center rounded-md px-3 py-2 text-[0.8125rem] font-medium text-muted-foreground hover:text-foreground hover:bg-accent/30 transition-colors min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop CTA cluster */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={() => setSearchOpen((s) => !s)}
            aria-label="Search the site"
            aria-expanded={searchOpen}
            className="h-9 w-9 inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <SearchIcon className="h-4 w-4" />
          </button>
          <Button
            variant="ghost"
            size="sm"
            className="text-[0.8125rem] font-medium h-9 px-4 text-muted-foreground hover:text-foreground min-w-[44px]"
          >
            Log In
          </Button>
          <Button
            size="sm"
            className="bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 text-xs font-semibold shadow-soft min-w-[44px]"
            asChild
          >
            <a href="https://certify.mindfulnessexercises.com/" target="_blank" rel="noopener">
              Get Certified
            </a>
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center text-foreground rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Desktop mega-menu panel — full-width below the bar so cards have room */}
      {openGroup && (
        <div
          className="hidden md:block absolute left-0 right-0 border-t border-border/50 bg-background shadow-xl"
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
        >
          {MENU.filter((g) => g.label === openGroup).map((group) => (
            <div key={group.label} className="container mx-auto px-6 py-8">
              <div className="grid grid-cols-12 gap-8">
                <aside className="col-span-4 rounded-xl bg-[hsl(var(--section-alternate))] p-6">
                  <p className="text-eyebrow text-primary mb-2">{group.label}</p>
                  <h3 className="font-serif text-xl text-foreground mb-2">
                    {group.blurb.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {group.blurb.body}
                  </p>
                  <a
                    href={group.blurb.href}
                    className="inline-flex items-center text-sm font-semibold text-primary hover:underline"
                    onClick={() => setOpenGroup(null)}
                  >
                    {group.blurb.cta}
                  </a>
                </aside>
                <ul className="col-span-8 grid grid-cols-2 gap-2">
                  {group.links.map((link) => {
                    const Icon = link.icon;
                    return (
                      <li key={link.label}>
                        <a
                          href={link.href}
                          {...(link.external
                            ? { target: "_blank", rel: "noopener" }
                            : {})}
                          onClick={() => setOpenGroup(null)}
                          className="group flex gap-3 rounded-lg p-3 hover:bg-accent/40 transition-colors min-h-[44px]"
                        >
                          {Icon && (
                            <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                              <Icon className="h-4 w-4" aria-hidden />
                            </span>
                          )}
                          <span>
                            <span className="block text-sm font-semibold text-foreground">
                              {link.label}
                            </span>
                            {link.description && (
                              <span className="block text-xs text-muted-foreground mt-0.5">
                                {link.description}
                              </span>
                            )}
                          </span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Desktop search dropdown */}
      {searchOpen && (
        <div className="hidden md:block border-t border-border/50 bg-background/95 backdrop-blur-xl">
          <div className="container mx-auto py-3">
            <SiteSearchBar
              size="md"
              autoFocus
              placeholder="Search articles, exercises, scripts…"
              onSubmitted={() => setSearchOpen(false)}
              source="navbar_desktop"
            />
          </div>
        </div>
      )}

      {/* Mobile menu — accordion groups */}
      {mobileOpen && (
        <div
          id="mobile-menu"
          className="md:hidden border-t border-border/50 bg-background px-5 pb-6 pt-4"
          role="navigation"
          aria-label="Mobile navigation"
        >
          <div className="mb-4">
            <SiteSearchBar
              size="md"
              placeholder="Search…"
              onSubmitted={() => setMobileOpen(false)}
              source="navbar_mobile"
            />
          </div>
          <ul className="space-y-1">
            {MENU.map((group) => {
              const isOpen = openMobileGroup === group.label;
              return (
                <li key={group.label} className="border-b border-border/40 last:border-0">
                  <button
                    type="button"
                    onClick={() => setOpenMobileGroup(isOpen ? null : group.label)}
                    aria-expanded={isOpen}
                    className="w-full flex items-center justify-between py-3 px-2 text-foreground text-body font-medium min-h-[44px]"
                  >
                    {group.label}
                    <ChevronDown
                      className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
                      aria-hidden
                    />
                  </button>
                  {isOpen && (
                    <ul className="pb-2 pl-2">
                      {group.links.map((link) => (
                        <li key={link.label}>
                          <a
                            href={link.href}
                            {...(link.external
                              ? { target: "_blank", rel: "noopener" }
                              : {})}
                            onClick={() => setMobileOpen(false)}
                            className="block py-2.5 px-2 text-sm text-muted-foreground hover:text-foreground min-h-[44px] flex items-center"
                          >
                            {link.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
            {FLAT_LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="block py-3 px-2 text-foreground text-body font-medium min-h-[44px] flex items-center hover:bg-accent/30 rounded-md"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-col gap-3">
            <Button variant="outline" className="w-full border-border h-11">
              Log In
            </Button>
            <Button className="w-full bg-primary text-primary-foreground shadow-elevated h-11" asChild>
              <a href="https://certify.mindfulnessexercises.com/" target="_blank" rel="noopener">
                Get Certified
              </a>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
