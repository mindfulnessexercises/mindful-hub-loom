import { motion } from "framer-motion";
import { SectionWrapper, SectionHeader } from "./SectionWrapper";

export function LiveEvents() {
  return (
    <SectionWrapper background="alternate" id="events">
      <SectionHeader
        headingId="events-heading"
        eyebrow="Upcoming Events"
        title="Learn and connect in real time"
        subtitle="Live workshops, trainings, and community sessions led by experienced mindfulness teachers."
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto rounded-xl border border-border bg-card overflow-hidden shadow-[var(--shadow-card)]"
      >
        <iframe
          src="https://connect.mindfulnessexercises.com/c/live-mindfulness-meditations-discussions/?iframe=true"
          title="Live Mindfulness Events Calendar"
          className="w-full border-0"
          style={{ height: "70vh", minHeight: "500px" }}
          loading="lazy"
        />
      </motion.div>
    </SectionWrapper>
  );
}
