import { motion } from "framer-motion";
import { ArrowRight, Clock, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionWrapper, SectionHeader } from "./SectionWrapper";

const events = [
  {
    title: "Introduction to Mindfulness-Based Stress Reduction",
    date: "Apr 12",
    year: "2026",
    day: "Saturday",
    time: "1:00 – 3:00 PM ET",
    format: "Live Virtual Workshop",
    description: "A free introductory session exploring MBSR foundations — how to integrate mindfulness into daily life and professional practice.",
    free: true,
  },
  {
    title: "CE Workshop: Trauma-Informed Mindfulness in Clinical Settings",
    date: "Apr 26",
    year: "2026",
    day: "Saturday",
    time: "10:00 AM – 4:00 PM ET",
    format: "Live Virtual · CE-Eligible",
    description: "A CE-eligible deep-dive into trauma-sensitive mindfulness for therapists, counselors, and healthcare professionals.",
    free: false,
  },
  {
    title: "Community Practice: Mindful Movement & Body Awareness",
    date: "May 3",
    year: "2026",
    day: "Sunday",
    time: "9:00 – 10:00 AM ET",
    format: "Live Virtual · Open to All",
    description: "A weekly community session focused on mindful movement, suitable for all experience levels.",
    free: true,
  },
];

export function LiveEvents() {
  return (
    <SectionWrapper background="alternate" id="events">
      <SectionHeader
        headingId="events-heading"
        eyebrow="Upcoming Events"
        title="Learn and connect in real time"
        subtitle="Live workshops, trainings, and community sessions led by experienced mindfulness teachers."
      />

      <div className="space-y-4 max-w-4xl mx-auto">
        {events.map((event, i) => (
          <motion.article
            key={event.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="group rounded-xl border border-border bg-card overflow-hidden shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-shadow duration-300"
          >
            <div className="flex flex-col sm:flex-row">
              {/* Date block */}
              <div className="sm:w-28 lg:w-32 flex-shrink-0 bg-primary/[0.08] flex flex-row sm:flex-col items-center justify-center gap-1 px-4 py-3 sm:py-5 border-b sm:border-b-0 sm:border-r border-border/60">
                <span className="text-eyebrow text-primary/80">{event.day}</span>
                <time className="font-serif text-2xl sm:text-3xl font-bold text-primary leading-none" dateTime={`2026-${event.date.includes('Apr') ? '04' : '05'}-${event.date.split(' ')[1]}`}>
                  {event.date}
                </time>
                <span className="text-caption text-muted-foreground">{event.year}</span>
              </div>

              {/* Content */}
              <div className="flex-1 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-0.5 text-caption font-medium text-accent-foreground">
                      <Video className="h-3 w-3" aria-hidden="true" />
                      {event.format}
                    </span>
                    {event.free && (
                      <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-caption font-semibold text-primary">
                        Free
                      </span>
                    )}
                  </div>
                  <h3 className="font-serif text-base sm:text-lg font-semibold text-card-foreground mb-1 group-hover:text-primary transition-colors duration-200 leading-snug">
                    {event.title}
                  </h3>
                  <p className="text-body-sm text-muted-foreground line-clamp-2">
                    {event.description}
                  </p>
                  <div className="flex items-center gap-3 mt-1.5 text-caption text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3 w-3" aria-hidden="true" />
                      <time>{event.time}</time>
                    </span>
                  </div>
                </div>

                <div className="flex-shrink-0">
                  <Button
                    variant="outline"
                    className="min-h-[44px] h-11 sm:h-10 w-full sm:w-auto px-5 border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground transition-colors duration-200 whitespace-nowrap"
                    asChild
                  >
                    <a href="#">
                      Register
                      <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden="true" />
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="text-center mt-8"
      >
        <Button size="lg" variant="outline" className="min-h-[44px] h-12 px-8 border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground transition-colors duration-200" asChild>
          <a href="#">
            View All Events
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
          </a>
        </Button>
      </motion.div>
    </SectionWrapper>
  );
}
