import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export function HeroSection() {
  return (
    <section className="relative bg-[hsl(var(--section-primary))] overflow-hidden">
      {/* Soft ambient gradient — warm, not decorative */}
      <div className="absolute inset-0 bg-gradient-to-b from-accent/30 via-transparent to-transparent pointer-events-none" />

      <div className="container mx-auto relative">
        <div className="flex flex-col items-center text-center py-20 sm:py-28 lg:py-32 max-w-3xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-eyebrow text-muted-foreground mb-5"
          >
            A Trusted Mindfulness Platform
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="text-hero text-foreground"
          >
            Free mindfulness resources.{" "}
            <span className="text-primary">CE-accredited training for professionals.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.16 }}
            className="text-body-lg text-muted-foreground mt-6 max-w-2xl"
          >
            Whether you're beginning a personal practice or pursuing professional certification,
            Mindfulness Exercises offers the resources, training, and community to support your path.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.24 }}
            className="flex flex-col sm:flex-row items-center gap-4 mt-10"
          >
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 h-12 text-base font-medium shadow-elevated"
            >
              Explore Certification Programs
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="px-8 h-12 text-base font-medium border-border hover:bg-accent hover:border-primary/20"
            >
              Explore Free Resources
            </Button>
          </motion.div>

          <motion.a
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.36 }}
            href="#events"
            className="mt-5 text-body-sm text-muted-foreground hover:text-foreground underline underline-offset-4 decoration-muted-foreground/40 hover:decoration-foreground/60 transition-colors"
          >
            Join Live Events →
          </motion.a>
        </div>
      </div>
    </section>
  );
}
