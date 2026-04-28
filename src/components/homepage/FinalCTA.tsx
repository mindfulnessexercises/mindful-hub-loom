import { SectionWrapper } from "./SectionWrapper";
import { motion } from "framer-motion";
import { TrackedCTAButton } from "@/components/cta/TrackedCTAButton";

export function FinalCTA() {
  return (
    <SectionWrapper background="deep" ariaLabel="Get started with mindfulness training">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-2xl mx-auto"
      >
        <h2 className="text-section-heading text-primary-foreground mb-4">
          Practice today — or get certified to teach mindfulness
        </h2>
        <p className="text-body-lg text-primary-foreground/80 mb-8">
          Explore 3,000+ free mindfulness exercises for personal practice, or enroll in our APA-approved Mindfulness Teacher Certification. Choose the path that fits.
        </p>

        <div
          className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4"
          data-track-cta="final_cta_buttons"
          data-track-cta-label="Final CTA — Get certified / Browse free"
          data-track-cta-location="homepage_final_cta"
        >
          <TrackedCTAButton
            destination="certification"
            audience="professional"
            location="homepage_final_cta_primary"
            label="Get Certified to Teach Mindfulness"
            size="lg"
            className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 px-8 min-h-[44px] h-12 text-sm font-semibold shadow-md"
          />
          <TrackedCTAButton
            destination="free_resources"
            audience="individual"
            location="homepage_final_cta_secondary"
            label="Browse Free Mindfulness Exercises"
            size="lg"
            variant="outline"
            hideArrow
            className="px-8 min-h-[44px] h-12 text-sm font-medium border-primary-foreground/25 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent"
          />
        </div>

        <a
          href="#events"
          className="inline-block mt-5 text-body-sm text-primary-foreground/55 hover:text-primary-foreground/85 underline underline-offset-4 decoration-primary-foreground/20 hover:decoration-primary-foreground/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground/50 rounded-sm py-1 min-h-[44px] flex items-center justify-center"
        >
          Or join a live session this week →
        </a>
      </motion.div>
    </SectionWrapper>
  );
}
