import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Layered background — subtle warmth gradient */}
      <div className="absolute inset-0 bg-[hsl(var(--section-primary))]" />
      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--accent)/.35)] via-transparent to-[hsl(var(--secondary)/.2)]" />
      {/* Fine texture overlay for depth */}
      <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23000\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />

      <div className="container mx-auto relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center py-14 sm:py-18 lg:py-20">
          {/* Left: Copy */}
          <div className="max-w-xl">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/60 backdrop-blur-sm px-4 py-1.5 mb-6"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-caption font-medium text-muted-foreground">
                CE-Accredited Professional Training
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.06 }}
              className="text-hero text-foreground"
            >
              Free mindfulness resources.{" "}
              <span className="text-primary">CE-accredited training</span>{" "}
              for professionals.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.12 }}
              className="text-body-lg text-muted-foreground mt-5 max-w-lg"
            >
              A curated library of exercises for personal practice —
              and recognized certification programs for therapists, counselors, and educators.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.18 }}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mt-8"
            >
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-7 h-11 text-sm font-medium shadow-elevated tracking-wide"
              >
                Explore Certification Programs
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-7 h-11 text-sm font-medium border-border hover:bg-accent/60 hover:border-primary/20"
              >
                Explore Free Resources
              </Button>
            </motion.div>

            <motion.a
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.28 }}
              href="#events"
              className="inline-block mt-4 text-body-sm text-muted-foreground hover:text-foreground underline underline-offset-4 decoration-muted-foreground/40 hover:decoration-foreground/60 transition-colors"
            >
              Join Live Events →
            </motion.a>
          </div>

          {/* Right: Visual anchor */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="hidden lg:block"
          >
            {/*
              PLACEHOLDER: Replace with real teacher/community photography.
              Ideal: Warm, natural-light image of a teacher or group practice.
              Avoid: Stock spa imagery, generic meditation poses.
            */}
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
              {/* Layered placeholder composition */}
              <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--accent))] via-[hsl(var(--sage-light))] to-[hsl(var(--secondary))]" />
              <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--primary)/.12)] to-transparent" />

              {/* Decorative inner elements suggesting depth */}
              <div className="absolute inset-6 rounded-lg border border-[hsl(var(--primary)/.08)] bg-card/30 backdrop-blur-sm flex flex-col items-center justify-center gap-4 p-8">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-primary" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 3c-4.97 0-9 3.13-9 7 0 2.38 1.56 4.47 3.93 5.74-.07.78-.58 2.26-1.93 3.26 2.07 0 4.07-1.07 5.18-2.02.59.06 1.19.02 1.82.02 4.97 0 9-3.13 9-7s-4.03-7-9-7z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="text-eyebrow text-primary/70 mb-1">Brand Imagery</p>
                  <p className="text-body-sm text-muted-foreground max-w-[200px]">
                    Replace with professional teacher or community photo
                  </p>
                </div>
              </div>

              {/* Floating accent card */}
              <div className="absolute bottom-4 left-4 right-4 rounded-lg bg-card/80 backdrop-blur-md border border-border/50 p-4 shadow-elevated">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-primary text-sm font-semibold font-serif">✦</span>
                  </div>
                  <div>
                    <p className="text-caption font-medium text-foreground">Trusted by professionals worldwide</p>
                    <p className="text-caption text-muted-foreground">Therapists, counselors & educators</p>
                    {/* verify before publishing — "worldwide" claim */}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
