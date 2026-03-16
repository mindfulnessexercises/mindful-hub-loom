import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export function HeroSection() {
  return (
    <section className="relative bg-[hsl(var(--section-primary))] overflow-hidden">
      {/* Subtle decorative gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/40 via-transparent to-secondary/30 pointer-events-none" />

      <div className="container mx-auto relative">
        <div className="flex flex-col items-center text-center py-20 sm:py-28 lg:py-32 max-w-4xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-eyebrow text-muted-foreground mb-6"
          >
            A Trusted Mindfulness Platform
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-hero text-foreground"
          >
            Mindfulness resources for practice.{" "}
            <span className="text-primary">Training for professionals.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-body-lg text-muted-foreground mt-6 max-w-2xl"
          >
            Explore a curated library of free mindfulness exercises — or advance your career with
            CE-accredited professional certification programs.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4 mt-10"
          >
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 h-12 text-base font-medium">
              Explore Certification Programs
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="px-8 h-12 text-base font-medium border-border hover:bg-accent">
              Explore Free Resources
            </Button>
          </motion.div>

          <motion.a
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            href="#events"
            className="mt-5 text-body-sm text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors"
          >
            Join Live Events →
          </motion.a>
        </div>
      </div>
    </section>
  );
}
