import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionWrapper } from "./SectionWrapper";
import { motion } from "framer-motion";

export function FinalCTA() {
  return (
    <SectionWrapper background="deep">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-2xl mx-auto"
      >
        <h2 className="text-section-heading text-primary-foreground mb-4">
          Your next step starts here
        </h2>
        <p className="text-body-lg text-primary-foreground/75 mb-8">
          Whether you're exploring mindfulness for the first time or pursuing professional certification,
          we're here to support your journey.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            size="lg"
            className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 px-8 h-12 text-sm font-semibold shadow-md"
          >
            Explore Certification Programs
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="px-8 h-12 text-sm font-medium border-primary-foreground/25 text-primary-foreground hover:bg-primary-foreground/10"
          >
            Explore Free Resources
          </Button>
        </div>

        <a
          href="#events"
          className="inline-block mt-5 text-body-sm text-primary-foreground/50 hover:text-primary-foreground/80 underline underline-offset-4 decoration-primary-foreground/20 hover:decoration-primary-foreground/50 transition-colors"
        >
          Or join an upcoming live event →
        </a>
      </motion.div>
    </SectionWrapper>
  );
}
