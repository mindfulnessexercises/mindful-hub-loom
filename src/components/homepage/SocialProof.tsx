import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { SectionWrapper, SectionHeader } from "./SectionWrapper";

/*
  All testimonials are placeholders — replace with real quotes,
  names, titles, and credentials before publishing.
*/
const testimonials = [
  {
    quote: "The MBSR training gave me the clinical confidence and credentials I needed to integrate mindfulness into trauma therapy. The curriculum was rigorous, the mentorship was outstanding, and I earned CE credits recognized by my licensing board.",
    name: "Dr. Sarah Mitchell",
    title: "Licensed Clinical Psychologist",
    credential: "MBSR-Certified Teacher",
    initials: "SM",
  },
  {
    quote: "I started with the free breathing exercises and was so impressed by the quality that I enrolled in the teacher certification. Six months later, I'm leading mindfulness workshops for two Fortune 500 companies.",
    name: "James Rivera",
    title: "Executive Wellness Coach",
    credential: "ICF-ACC · Certified Mindfulness Teacher",
    initials: "JR",
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
            <div className="h-9 w-9 rounded-lg bg-primary/[0.08] flex items-center justify-center mb-5" aria-hidden="true">
              <Quote className="h-4 w-4 text-primary/60" />
            </div>

            <p className="text-body text-card-foreground leading-[1.75] flex-1 mb-6">
              "{t.quote}"
            </p>

            <footer className="pt-5 border-t border-border/60">
              <div className="flex items-center gap-3">
                {/* [Replace with real photo: <img src="..." alt={t.name} width="40" height="40" className="rounded-full" loading="lazy" /> ] */}
                <div className="h-10 w-10 rounded-full bg-accent border border-border flex items-center justify-center flex-shrink-0" aria-hidden="true">
                  <span className="font-serif text-sm font-semibold text-primary/70">
                    {t.initials}
                  </span>
                </div>
                <div>
                  <p className="font-serif text-sm font-semibold text-card-foreground leading-tight">{t.name}</p>
                  <p className="text-caption text-muted-foreground mt-0.5">{t.title}</p>
                  <p className="text-caption font-medium text-primary/80 mt-0.5">{t.credential}</p>
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
