import { motion } from "framer-motion";
import { ArrowRight, Calendar, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionWrapper, SectionHeader } from "./SectionWrapper";

const events = [
  {
    title: "Introduction to Mindfulness-Based Stress Reduction",
    date: "April 12, 2026",
    time: "1:00 PM – 3:00 PM ET",
    format: "Live Virtual",
    description: "A free introductory session exploring MBSR foundations and how to bring mindfulness into daily life.",
    free: true,
  },
  {
    title: "CE Workshop: Trauma-Informed Mindfulness",
    date: "April 26, 2026",
    time: "10:00 AM – 4:00 PM ET",
    format: "Live Virtual",
    description: "A CE-eligible workshop on integrating trauma-sensitive mindfulness practices in clinical settings.",
    free: false,
  },
  {
    title: "Community Practice: Mindful Movement",
    date: "May 3, 2026",
    time: "9:00 AM – 10:00 AM ET",
    format: "Live Virtual",
    description: "Join our weekly community practice session focused on mindful movement and body awareness.",
    free: true,
  },
];

export function LiveEvents() {
  return (
    <SectionWrapper background="alternate" id="events">
      <SectionHeader
        eyebrow="Live Events"
        title="Learn and connect in real time"
        subtitle="Join live workshops, trainings, and community practice sessions led by experienced teachers."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {events.map((event, i) => (
          <motion.div
            key={event.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="rounded-lg border border-border bg-card p-6 flex flex-col shadow-card hover:shadow-card-hover transition-shadow duration-300"
          >
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary" className="text-caption font-medium">
                {event.format}
              </Badge>
              {event.free && (
                <Badge className="bg-primary/10 text-primary border-0 text-caption font-medium">Free</Badge>
              )}
            </div>

            <h3 className="font-serif text-lg font-semibold text-card-foreground mb-2">{event.title}</h3>
            <p className="text-body-sm text-muted-foreground mb-4 flex-1">{event.description}</p>

            <div className="space-y-1.5 mb-5">
              <div className="flex items-center gap-2 text-caption text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                {event.date} · {event.time}
              </div>
              <div className="flex items-center gap-2 text-caption text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                {event.format}
              </div>
            </div>

            <Button variant="outline" className="w-full" size="sm">
              Register
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        ))}
      </div>

      <div className="text-center mt-10">
        <Button variant="outline" size="lg" className="px-8">
          View All Events
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </SectionWrapper>
  );
}
