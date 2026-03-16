import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { SectionWrapper, SectionHeader } from "./SectionWrapper";

import rickHanson from "@/assets/endorsers/rick-hanson.png";
import chrisGermer from "@/assets/endorsers/chris-germer.png";

const testimonials = [
  {
    quote:
      "Sean is the absolute gold standard for mindfulness training and coaching. He has tremendous depth and breadth. He is also very kind, with bone-deep integrity, excellent communication and teaching skills, inclusive open-minded awareness, and a sweetly supportive manner.",
    name: "Dr. Rick Hanson",
    title: "New York Times Bestselling Author",
    credential: "Author of Resilient & Hardwiring Happiness",
    photo: rickHanson,
  },
  {
    quote:
      "It is a privilege to contribute to Sean Fargo's mindfulness teacher certification program. The warm and inviting atmosphere of the classes nourishes and reflects everything that is taught. This is mindfulness training in the truest sense.",
    name: "Christopher Germer, PhD",
    title: "Clinical Psychologist, Harvard Medical School",
    credential: "Founder of the Mindful Self-Compassion Program",
    photo: chrisGermer,
  },
];

export function SocialProof() {
  return (
    <SectionWrapper background="alternate" id="testimonials">
      <SectionHeader
        headingId="testimonials-heading"
        eyebrow="Endorsed By Leading Voices"
        title="What world-renowned teachers say"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 lg:gap-8 max-w-4xl mx-auto">
        {testimonials.map((t, i) => (
          <motion.blockquote
            key={t.name}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="rounded-xl border border-border bg-card p-5 sm:p-7 flex flex-col shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-shadow duration-300"
          >
            <div
              className="h-9 w-9 rounded-lg bg-primary/[0.08] flex items-center justify-center mb-5"
              aria-hidden="true"
            >
              <Quote className="h-4 w-4 text-primary/60" />
            </div>

            <p className="text-body text-card-foreground leading-[1.75] flex-1 mb-6">
              "{t.quote}"
            </p>

            <footer className="pt-5 border-t border-border/60">
              <div className="flex items-center gap-3">
                <img
                  src={t.photo}
                  alt={t.name}
                  width="40"
                  height="40"
                  loading="lazy"
                  className="h-10 w-10 rounded-full object-cover flex-shrink-0"
                />
                <div>
                  <p className="font-serif text-sm font-semibold text-card-foreground leading-tight">
                    {t.name}
                  </p>
                  <p className="text-caption text-muted-foreground mt-0.5">
                    {t.title}
                  </p>
                  <p className="text-caption font-medium text-primary/80 mt-0.5">
                    {t.credential}
                  </p>
                </div>
              </div>
            </footer>
          </motion.blockquote>
        ))}
      </div>
    </SectionWrapper>
  );
}
