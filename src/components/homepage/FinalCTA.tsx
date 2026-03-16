import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionWrapper } from "./SectionWrapper";
import { motion } from "framer-motion";

export function FinalCTA() {
  return (
    <SectionWrapper background="emphasis">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-2xl mx-auto"
      >
        <h2 className="text-section-heading text-foreground mb-4">
          Ready to begin?
        </h2>
        <p className="text-body-lg text-muted-foreground mb-8">
          Whether you're exploring mindfulness for the first time or pursuing professional certification, your next step starts here.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 h-12 text-base font-medium">
            Explore Certification Programs
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button size="lg" variant="outline" className="px-8 h-12 text-base font-medium">
            Browse Free Resources
          </Button>
        </div>
      </motion.div>
    </SectionWrapper>
  );
}
