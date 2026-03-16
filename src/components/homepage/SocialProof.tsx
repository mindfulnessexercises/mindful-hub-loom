import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { SectionWrapper, SectionHeader } from "./SectionWrapper";

/*
  All testimonials are placeholders — verify before publishing.
  Replace with real testimonials, names, titles, and optional photos.
*/
const testimonials = [
  {
    quote: "The certification program gave me the confidence and credentials to integrate mindfulness into my clinical practice. The training was rigorous, supportive, and deeply practical.",
    name: "Dr. Sarah Mitchell",
    title: "Licensed Clinical Psychologist",
    credential: "MBSR-Certified",
  },
  {
    quote: "I came for the free exercises and stayed for the community. The quality of the resources here is exceptional — and the professional training took my coaching to the next level.",
    name: "James Rivera",
    title: "Executive Wellness Coach",
    credential: "ICF-ACC",
  },
  {
    quote: "As an educator, I needed evidence-based training with recognized CE credits. This platform delivered exactly that, with warmth and professionalism at every step.",
    name: "Amara Okafor",
    title: "School Counselor & Mindfulness Educator",
    credential: "M.Ed.",
  },
];

export function SocialProof() {
  return (
    <SectionWrapper background="alternate" id="testimonials">
      <SectionHeader
        headingId="testimonials-heading"
        eyebrow="What Professionals Say"
        title="Trusted by practitioners across disciplines"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 lg:gap-7 max-w-5xl mx-auto">
        {testimonials.map((t, i) => (
          <motion.blockquote
            key={t.name}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="rounded-xl border border-border bg-card p-6 sm:p-7 flex flex-col shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-shadow duration-300"
          >
            <div className="h-9 w-9 rounded-lg bg-primary/[0.08] flex items-center justify-center mb-5" aria-hidden="true">
              <Quote className="h-4 w-4 text-primary/60" />
            </div>

            <p className="text-body text-card-foreground leading-[1.7] flex-1 mb-6">
              "{t.quote}"
            </p>

            <footer className="pt-5 border-t border-border/60">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-accent border border-border flex items-center justify-center flex-shrink-0" aria-hidden="true">
                  <span className="font-serif text-sm font-semibold text-primary/70">
                    {t.name.split(" ").map(n => n[0]).join("")}
                  </span>
                </div>
                <div>
                  <p className="font-serif text-sm font-semibold text-card-foreground leading-tight">{t.name}</p>
                  <p className="text-caption text-muted-foreground mt-0.5">{t.title}</p>
                  {t.credential && (
                    <p className="text-caption font-medium text-primary/70 mt-0.5">{t.credential}</p>
                  )}
                </div>
              </div>
            </footer>
          </motion.blockquote>
        ))}
      </div>

      {/* [verify before publishing — all testimonials are placeholders] */}
    </SectionWrapper>
  );
}
