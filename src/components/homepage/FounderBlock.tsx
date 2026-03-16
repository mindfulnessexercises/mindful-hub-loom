import { motion } from "framer-motion";
import { SectionWrapper } from "./SectionWrapper";

export function FounderBlock() {
  return (
    <SectionWrapper background="alternate" id="founder">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto text-center"
      >
        <p className="text-eyebrow text-muted-foreground mb-4">Our Mission</p>

        {/* Placeholder for founder photo */}
        <div className="mx-auto h-20 w-20 rounded-full bg-accent border-2 border-primary/10 mb-6 flex items-center justify-center">
          <span className="text-body-sm text-muted-foreground">Photo</span>
        </div>

        <h2 className="text-card-heading text-foreground mb-4">
          Built by practitioners, for practitioners
        </h2>

        <p className="text-body-lg text-muted-foreground max-w-2xl mx-auto mb-3">
          Mindfulness Exercises was founded to make high-quality mindfulness training accessible to
          everyone — from individuals beginning their practice to professionals seeking meaningful credentials.
        </p>
        <p className="text-body text-muted-foreground max-w-2xl mx-auto">
          {/* verify before publishing — replace with real founder details */}
          Our team of teachers, clinicians, and researchers is committed to evidence-based programs,
          professional rigor, and the deep human value of mindful awareness.
        </p>
      </motion.div>
    </SectionWrapper>
  );
}
