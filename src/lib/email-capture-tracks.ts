/**
 * Audience-aware email capture taxonomy.
 *
 * Single source of truth for every email-capture surface on the site.
 * One entry per "next step" the visitor may want to take. Components
 * (InlineEmailCapture, StickyEmailBar, future modal) never hard-code copy
 * or destinations — they accept a `track` key and read from this map.
 *
 * Why a registry (not props per call-site)?
 *   • Copy + offer + CTA stay in lockstep so we never ship a "Get the
 *     practice library" headline above a button labelled "Reserve seat".
 *   • A/B copy tests change one map entry instead of N components.
 *   • Analytics events automatically carry the same track id everywhere.
 *
 * Adding a new track:
 *   1. Add a key to `EmailCaptureTrack`.
 *   2. Add a `TRACK_DEFINITIONS[<key>]` entry.
 *   3. (Optional) update `pickTrackForPath` so the sticky bar and any
 *      auto-binding capture can route to it from the right URL.
 */

export type EmailCaptureTrack =
  | "free_resources"
  | "live_events"
  | "premium_training"
  | "certification"
  | "general";

export interface TrackDefinition {
  /** Stable id mirrored in the DB `email_leads.track` column. */
  id: EmailCaptureTrack;
  /** Audience eyebrow shown above the headline ("For individuals", etc.). */
  audience: string;
  /** Headline — write to ONE intent only. No "and / or" hedging. */
  headline: string;
  /** Sub-line: the concrete deliverable they get for handing over an email. */
  subhead: string;
  /** 2-3 outcome bullets. Keep parallel grammar. */
  benefits: readonly string[];
  /** Form button label — verb-led, scannable, ≤4 words. */
  buttonLabel: string;
  /** What we say after a successful submit. */
  successMessage: string;
  /** Secondary CTA shown alongside / under the form. */
  followUp: {
    label: string;
    /**
     * Destination for the secondary CTA. Internal anchors (`#events`),
     * route paths (`/audio-library`), and external URLs (cert host) all OK.
     */
    href: string;
    /** External / new-tab destinations get target=_blank automatically. */
    external?: boolean;
  };
  /**
   * Primary "next step" surfaced inside the post-submit thank-you state.
   * One clear, track-appropriate button so we never strand a successful
   * subscriber on a dead-end success message.
   */
  thankYou: {
    /** Headline shown in the success card (replaces the form). */
    headline: string;
    /** Short reassurance line under the headline (what to expect / when). */
    body: string;
    /** Primary next-step CTA label — verb-led, ≤4 words. */
    ctaLabel: string;
    /** Where the primary CTA points. */
    ctaHref: string;
    /** Open in new tab when destination is offsite. */
    ctaExternal?: boolean;
    /** Optional muted secondary link (e.g. "Browse all events"). */
    secondaryLabel?: string;
    secondaryHref?: string;
    secondaryExternal?: boolean;
  };
}

const CERT_HOST = "https://certify.mindfulnessexercises.com/";

export const TRACK_DEFINITIONS: Record<EmailCaptureTrack, TrackDefinition> = {
  free_resources: {
    id: "free_resources",
    audience: "For individuals & beginners",
    headline: "Start a daily mindfulness practice — free.",
    subhead:
      "Get our weekly Practice Companion: a hand-picked guided meditation, a short script, and a printable worksheet — straight to your inbox.",
    benefits: [
      "One short guided meditation each week",
      "A printable script or worksheet you can keep",
      "No spam, unsubscribe anytime",
    ],
    buttonLabel: "Send me practices",
    successMessage:
      "You're in. Check your inbox — your first weekly practice is on the way.",
    followUp: {
      label: "Browse 3,000+ free exercises now →",
      href: "/library",
    },
    thankYou: {
      headline: "You're in. Your first practice is on the way.",
      body: "While you wait, jump straight into 3,000+ free guided meditations, scripts, and worksheets.",
      ctaLabel: "Browse the library",
      ctaHref: "/library",
      secondaryLabel: "Listen to today's audio",
      secondaryHref: "/audio-library",
    },
  },

  live_events: {
    id: "live_events",
    audience: "For practitioners & professionals",
    headline: "Be first to hear about live mindfulness sessions.",
    subhead:
      "Weekly community sittings and monthly CE-eligible workshops. Join the list and we'll send you the schedule plus reminders before each session.",
    benefits: [
      "Weekly free community meditations",
      "Monthly CE workshops for licensed professionals",
      "Calendar invites and reminders, never daily mail",
    ],
    buttonLabel: "Notify me of sessions",
    successMessage:
      "You're on the list. Watch your inbox for this week's session schedule.",
    followUp: {
      label: "See upcoming live sessions →",
      href: "#events",
    },
    thankYou: {
      headline: "You're on the list. See what's coming up.",
      body: "Calendar invites land in your inbox before each session. Here's the full schedule of upcoming live events.",
      ctaLabel: "See live events",
      ctaHref: "/live-events",
      secondaryLabel: "Add to calendar",
      secondaryHref: "/live-events#calendar",
    },
  },

  premium_training: {
    id: "premium_training",
    audience: "For teachers, coaches & helping professionals",
    headline: "Deepen your teaching with structured premium training.",
    subhead:
      "Get a free curriculum sample plus an inside look at our advanced trainings — designed for teachers, coaches, therapists, and educators who want to take their work further.",
    benefits: [
      "Free chapter from our advanced curriculum",
      "Live Q&A invitations with senior trainers",
      "Early access when new cohorts open",
    ],
    buttonLabel: "Send the sample",
    successMessage:
      "Sent. Check your inbox for the free curriculum sample and Q&A invites.",
    followUp: {
      label: "Explore advanced trainings →",
      href: "/library?cat=advanced-training",
    },
    thankYou: {
      headline: "Sample sent. Explore what's next.",
      body: "Your free curriculum sample is in your inbox. Take a deeper look at our advanced trainings while you wait.",
      ctaLabel: "Explore trainings",
      ctaHref: "/library?cat=advanced-training",
    },
  },

  certification: {
    id: "certification",
    audience: "For therapists, counselors & coaches",
    headline: "Become a certified mindfulness teacher.",
    subhead:
      "Get the full Certification Brochure — APA-approved CE, program structure, tuition options, and the path to teaching mindfulness in clinical or community settings.",
    benefits: [
      "APA-approved CE for psychologists, MFTs, LCSWs & more",
      "Live + self-paced cohorts with mentor support",
      "A recognized teaching credential",
    ],
    buttonLabel: "Send the brochure",
    successMessage:
      "On its way. Check your inbox — and feel free to book a call once you've read it.",
    followUp: {
      label: "View the certification program →",
      href: CERT_HOST,
      external: true,
    },
    thankYou: {
      headline: "Brochure sent. Ready to take the next step?",
      body: "Your brochure is on its way. When you're ready, book a 1:1 call with our admissions team to talk through your goals.",
      ctaLabel: "Book a call",
      ctaHref: CERT_HOST,
      ctaExternal: true,
      secondaryLabel: "View program details",
      secondaryHref: "/mindfulness-meditation-teacher-training",
    },
  },

  general: {
    id: "general",
    audience: "Newsletter",
    headline: "Stay in the slow lane.",
    subhead:
      "One thoughtful email a week — new practices, articles, and live sessions. Pick one or all four, unsubscribe anytime.",
    benefits: [
      "Hand-picked weekly practices",
      "First word on live sessions and CE workshops",
      "Zero promotional clutter",
    ],
    buttonLabel: "Subscribe",
    successMessage: "You're subscribed. Welcome.",
    followUp: {
      label: "Browse the library →",
      href: "/library",
    },
    thankYou: {
      headline: "You're subscribed. Welcome.",
      body: "Your first email arrives soon. In the meantime, explore the library of free practices.",
      ctaLabel: "Browse the library",
      ctaHref: "/library",
    },
  },
};

export function getTrackDefinition(track: EmailCaptureTrack): TrackDefinition {
  return TRACK_DEFINITIONS[track];
}

/**
 * Auto-pick a track from the current pathname. Used by the sticky email
 * bar and any inline capture that wants to defer choice to context. Keep
 * this list narrow — the goal is "if the page is unambiguously about X,
 * use X's copy; otherwise fall back to free_resources" (the broadest
 * top-of-funnel offer).
 */
export function pickTrackForPath(pathname: string): EmailCaptureTrack {
  const p = pathname.toLowerCase();
  if (p.startsWith("/ce-policies") || p.includes("certif")) return "certification";
  if (p.startsWith("/podcast") || p.includes("event") || p.includes("live"))
    return "live_events";
  if (
    p.startsWith("/library") ||
    p.startsWith("/audio-library") ||
    p.startsWith("/downloads") ||
    p.startsWith("/blog") ||
    p.startsWith("/category")
  )
    return "free_resources";
  return "free_resources";
}
