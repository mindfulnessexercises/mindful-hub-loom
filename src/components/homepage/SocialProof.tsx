import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { SectionWrapper, SectionHeader } from "./SectionWrapper";

import rickHanson from "@/assets/endorsers/rick-hanson.jpg";
import chrisGermer from "@/assets/endorsers/chris-germer.jpg";
import jackKornfield from "@/assets/endorsers/jack-kornfield.jpg";
import gaborMate from "@/assets/endorsers/gabor-mate.jpg";
import sharonSalzberg from "@/assets/endorsers/sharon-salzberg.jpg";
import hasanRafiq from "@/assets/endorsers/hasan-rafiq.jpg";

const testimonials = [
  {
    quote:
      "Sean is the absolute gold standard for mindfulness training and coaching. He has tremendous depth and breadth. He is also very kind, with bone-deep integrity, excellent communication and teaching skills, inclusive open-minded awareness, and a sweetly supportive manner.",
    name: "Dr. Rick Hanson",
    title: "Psychologist · New York Times Bestselling Author",
    credential: "Author of Resilient & Hardwiring Happiness",
    photo: rickHanson,
  },
  {
    quote:
      "It is a privilege to contribute to Sean Fargo's mindfulness teacher certification program. The warm and inviting atmosphere of the classes nourishes and reflects everything that is taught. This is mindfulness training in the truest sense.",
    name: "Christopher Germer, PhD",
    title: "Clinical Psychologist · Harvard Medical School Faculty",
    credential: "Co-developer of the Mindful Self-Compassion (MSC) Program",
    photo: chrisGermer,
  },
];

const endorsers = [
  { name: "Jack Kornfield", title: "Bestselling Author · Founding Teacher, Spirit Rock", photo: jackKornfield },
  { name: "Gabor Maté, MD", title: "Physician · Bestselling Author on Trauma & Addiction", photo: gaborMate },
  { name: "Sharon Salzberg", title: "NYT Bestselling Author · Co-founder, Insight Meditation Society", photo: sharonSalzberg },
  { name: "Hasan Rafiq", title: "Mindfulness Teacher · Educator", photo: hasanRafiq },
];

export function SocialProof() {
  return (
    <SectionWrapper background="alternate" id="testimonials">
      <SectionHeader
        headingId="testimonials-heading"
        eyebrow="Endorsed By Leading Teachers"
        title="What colleagues and mentors say"
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

      {/* Compact endorser strip */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="mt-10 sm:mt-12 max-w-3xl mx-auto"
      >
        <p className="text-caption text-muted-foreground text-center mb-5 uppercase tracking-wider">
          Also endorsed by
        </p>
        <div className="flex flex-wrap justify-center gap-6 sm:gap-8">
          {endorsers.map((e) => (
            <div key={e.name} className="flex items-center gap-2.5">
              <img
                src={e.photo}
                alt={e.name}
                width="36"
                height="36"
                loading="lazy"
                className="h-9 w-9 rounded-full object-cover flex-shrink-0 ring-1 ring-border"
              />
              <div>
                <p className="font-serif text-sm font-semibold text-card-foreground leading-tight">
                  {e.name}
                </p>
                <p className="text-[11px] text-muted-foreground leading-tight mt-0.5">
                  {e.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </SectionWrapper>
  );
}
