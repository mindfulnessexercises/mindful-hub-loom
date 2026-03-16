import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden" aria-labelledby="hero-heading">
      {/* Layered background */}
      <div className="absolute inset-0 bg-[hsl(var(--section-primary))]" />
      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--accent)/.4)] via-transparent to-[hsl(var(--secondary)/.25)]" />
      <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23000\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[hsl(var(--section-primary))] to-transparent" />

      <div className="container mx-auto relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-center py-12 sm:py-14 lg:py-16">
          {/* Left: Copy */}
          <div className="max-w-xl">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/[0.06] px-4 py-1.5 mb-5"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" aria-hidden="true" />
              <span className="text-caption font-medium text-primary">
                CE-Accredited Professional Training
              </span>
            </motion.div>

            <motion.h1
              id="hero-heading"
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
              className="text-body-lg text-muted-foreground mt-4 max-w-lg"
            >
              A curated library of exercises for personal practice —
              and recognized certification programs for therapists, counselors, and educators.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.18 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-7"
            >
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-7 h-12 sm:h-11 text-sm font-medium shadow-elevated tracking-wide"
                asChild
              >
                <a href="#certification">
                  Explore Certification Programs
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-7 h-12 sm:h-11 text-sm font-medium border-border hover:bg-accent/60 hover:border-primary/20"
                asChild
              >
                <a href="#resources">
                  Explore Free Resources
                </a>
              </Button>
            </motion.div>

            <motion.a
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.28 }}
              href="#events"
              className="inline-block mt-3.5 text-body-sm text-muted-foreground hover:text-foreground underline underline-offset-4 decoration-muted-foreground/40 hover:decoration-foreground/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm py-1"
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
            aria-hidden="true"
          >
            {/*
              PLACEHOLDER: Replace with real teacher/community photography.
              Use: <img src="..." alt="Mindfulness teacher guiding a small group practice" width="600" height="450" loading="eager" />
            */}
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-prominent">
              <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--accent))] via-[hsl(var(--sage-light))] to-[hsl(var(--secondary))]" />
              <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--primary)/.18)] to-transparent" />
              <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 30% 40%, hsl(var(--primary)) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

              <div className="absolute inset-5 rounded-lg border border-[hsl(var(--primary)/.12)] bg-card/40 backdrop-blur-sm flex flex-col items-center justify-center gap-3 p-6">
                <div className="w-16 h-16 rounded-full bg-primary/[0.08] border border-primary/10 flex items-center justify-center">
                  <svg viewBox="0 0 32 32" fill="none" className="w-8 h-8 text-primary/70" stroke="currentColor" strokeWidth="1" aria-hidden="true">
                    <circle cx="16" cy="16" r="4" />
                    <ellipse cx="16" cy="10" rx="3" ry="6" />
                    <ellipse cx="16" cy="22" rx="3" ry="6" />
                    <ellipse cx="10" cy="16" rx="6" ry="3" />
                    <ellipse cx="22" cy="16" rx="6" ry="3" />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="text-eyebrow text-primary/60 mb-0.5">Brand Imagery</p>
                  <p className="text-caption text-muted-foreground max-w-[180px]">
                    Replace with professional teacher or community photo
                  </p>
                </div>
              </div>

              <div className="absolute bottom-3.5 left-3.5 right-3.5 rounded-lg bg-card/85 backdrop-blur-md border border-border/60 p-3.5 shadow-elevated">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 border border-primary/10 flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5 text-primary" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M10 2L3 6v4.5c0 4.3 3 8.3 7 9.5 4-1.2 7-5.2 7-9.5V6L10 2z" />
                      <path d="M7.5 10.5L9 12l3.5-4" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[0.8125rem] font-semibold text-foreground font-serif leading-tight">Trusted by professionals</p>
                    <p className="text-caption text-muted-foreground">Therapists, counselors & educators</p>
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
