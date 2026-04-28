import { motion } from "framer-motion";
import { Calendar, Clock, Video, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionWrapper, SectionHeader } from "./SectionWrapper";
import { InlineEmailCapture } from "@/components/email/InlineEmailCapture";

const upcomingEvents = [
  {
    date: "Every Monday",
    time: "12:00 PM PT",
    title: "Guided Mindfulness Meditation",
    format: "Live Online · Free",
    formatIcon: Video,
    description:
      "A live guided session open to all levels. Practice with an experienced teacher and a supportive community — no preparation needed.",
    cta: "Join This Session",
    href: "https://connect.mindfulnessexercises.com/c/live-mindfulness-meditations-discussions/",
  },
  {
    date: "Every Wednesday",
    time: "12:00 PM PT",
    title: "Mindful Discussion Circle",
    format: "Live Online · Free",
    formatIcon: Users,
    description:
      "An open conversation on mindfulness topics — personal practice, professional application, and evidence-based techniques. Bring your questions.",
    cta: "Join the Circle",
    href: "https://connect.mindfulnessexercises.com/c/live-mindfulness-meditations-discussions/",
  },
  {
    date: "Monthly",
    time: "Schedule varies",
    title: "CE Professional Workshop",
    format: "Live Workshop · CE-Eligible",
    formatIcon: Video,
    description:
      "In-depth continuing education workshops for licensed professionals. Earn APA-approved CE credits while deepening clinical mindfulness skills.",
    cta: "View Upcoming Workshops",
    href: "https://connect.mindfulnessexercises.com/c/live-mindfulness-meditations-discussions/",
  },
];

export function LiveEvents() {
  return (
    <SectionWrapper background="alternate" id="events">
      <SectionHeader
        headingId="events-heading"
        eyebrow="Live Sessions"
        title="Practice and learn in real time"
        subtitle="Weekly guided sessions, open discussions, and monthly CE workshops — led by experienced mindfulness teachers."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 max-w-5xl mx-auto">
        {upcomingEvents.map((event, i) => (
          <motion.article
            key={event.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="rounded-xl border border-border bg-card p-5 sm:p-6 flex flex-col shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-shadow duration-300"
          >
            {/* Date & time */}
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-lg bg-primary/[0.08] flex items-center justify-center shrink-0">
                <Calendar className="h-4.5 w-4.5 text-primary" aria-hidden="true" />
              </div>
              <div>
                <p className="text-body-sm font-semibold text-foreground leading-tight">{event.date}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Clock className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
                  <p className="text-caption text-muted-foreground">{event.time}</p>
                </div>
              </div>
            </div>

            {/* Title */}
            <h3 className="font-serif text-lg font-semibold text-foreground leading-snug mb-2">
              {event.title}
            </h3>

            {/* Format badge */}
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/15 bg-primary/[0.05] px-2.5 py-1 mb-3 w-fit">
              <event.formatIcon className="h-3 w-3 text-primary/70" aria-hidden="true" />
              <span className="text-caption font-medium text-primary">{event.format}</span>
            </div>

            {/* Description */}
            <p className="text-body-sm text-muted-foreground flex-1 mb-5">
              {event.description}
            </p>

            {/* CTA */}
            <Button
              variant="outline"
              size="sm"
              className="w-full border-border hover:bg-accent/60 hover:border-primary/20 font-medium"
              asChild
            >
              <a href={event.href} target="_blank" rel="noopener noreferrer">
                {event.cta}
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </Button>
          </motion.article>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.25 }}
        className="mt-10 max-w-2xl mx-auto"
      >
        <InlineEmailCapture
          track="live_events"
          location="homepage_live_events_inline"
          variant="compact"
          hideAudience
          hideFollowUp
        />
        <p className="text-center mt-5">
          <a
            href="https://connect.mindfulnessexercises.com/c/live-mindfulness-meditations-discussions/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-body-sm font-medium text-primary hover:text-primary/80 underline underline-offset-4 decoration-primary/30 hover:decoration-primary/60 transition-colors"
          >
            View full events calendar →
          </a>
        </p>
      </motion.div>
    </SectionWrapper>
  );
}
