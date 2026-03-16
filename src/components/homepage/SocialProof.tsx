import { motion } from "framer-motion";
import { SectionWrapper, SectionHeader } from "./SectionWrapper";

const testimonials = [
  {
    quote: "The certification program gave me the confidence and credentials to integrate mindfulness into my clinical practice. The training was rigorous, supportive, and deeply practical.",
    name: "Dr. Sarah Mitchell",
    title: "Licensed Clinical Psychologist",
    note: "verify before publishing — use real testimonial",
  },
  {
    quote: "I came for the free exercises and stayed for the community. The quality of the resources here is exceptional — and the professional training took my coaching to the next level.",
    name: "James Rivera",
    title: "Executive Wellness Coach",
    note: "verify before publishing — use real testimonial",
  },
  {
    quote: "As an educator, I needed evidence-based training with recognized CE credits. This platform delivered exactly that, with warmth and professionalism at every step.",
    name: "Amara Okafor",
    title: "School Counselor & Mindfulness Educator",
    note: "verify before publishing — use real testimonial",
  },
];

export function SocialProof() {
  return (
    <SectionWrapper background="primary" id="testimonials">
      <SectionHeader
        eyebrow="What Professionals Say"
        title="Trusted by practitioners across disciplines"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        {testimonials.map((t, i) => (
          <motion.blockquote
            key={t.name}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="rounded-lg border border-border bg-card p-7 flex flex-col shadow-card"
          >
            <p className="text-body text-card-foreground italic leading-relaxed flex-1 mb-6">
              "{t.quote}"
            </p>
            <footer>
              <p className="font-serif font-semibold text-card-foreground">{t.name}</p>
              <p className="text-caption text-muted-foreground mt-0.5">{t.title}</p>
            </footer>
          </motion.blockquote>
        ))}
      </div>
    </SectionWrapper>
  );
}
