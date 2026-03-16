import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionWrapper } from "./SectionWrapper";
import { motion } from "framer-motion";

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
          Start practicing today — or take your career further
        </h2>
        <p className="text-body-lg text-primary-foreground/80 mb-8">
          Free guided practices for personal use. APA-approved certification programs for professionals ready to teach. Choose the path that fits.
        </p>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4">
          <Button
            size="lg"
            className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 px-8 min-h-[44px] h-12 text-sm font-semibold shadow-md"
            asChild
          >
            <a href="#certification">
              View Certification Programs
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </a>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="px-8 min-h-[44px] h-12 text-sm font-medium border-primary-foreground/25 text-primary-foreground hover:bg-primary-foreground/10"
            asChild
          >
            <a href="#resources">
              Browse Free Practices
            </a>
          </Button>
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
