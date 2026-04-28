import { Shield, Users, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import seanSpeaking from "@/assets/sean-fargo-speaking.jpg";
import { SiteSearchBar } from "@/components/wp/SiteSearchBar";
import { TrackedCTAButton } from "@/components/cta/TrackedCTAButton";

export function HeroSection() {
  return (
    <section
      className="relative overflow-hidden"
      aria-labelledby="hero-heading"
      data-track-section="hero"
      data-track-section-label="Hero"
    >
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
                APA-Approved Continuing Education
              </span>
            </motion.div>

            <motion.h1
              id="hero-heading"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.06 }}
              className="text-hero text-foreground"
            >
              Mindfulness Exercises:{" "}
              <span className="text-primary">3,000+ free practices</span>{" "}
              & accredited teacher certification.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.12 }}
              className="text-body-lg text-muted-foreground mt-4 max-w-lg"
            >
              Guided mindfulness exercises, scripts, and worksheets for personal practice — plus APA-approved Mindfulness Teacher Certification for therapists, counselors, coaches, and educators.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.18 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-7"
              data-track-cta="hero_primary_buttons"
              data-track-cta-label="Hero — Get certified / Browse free"
              data-track-cta-location="homepage_hero"
            >
              <TrackedCTAButton
                destination="certification"
                audience="professional"
                location="homepage_hero_primary"
                label="Get Certified to Teach Mindfulness"
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-7 h-12 sm:h-11 text-sm font-medium shadow-elevated tracking-wide"
              />
              <TrackedCTAButton
                destination="free_resources"
                audience="individual"
                location="homepage_hero_secondary"
                label="Browse Free Mindfulness Exercises"
                size="lg"
                variant="outline"
                hideArrow
                className="px-7 h-12 sm:h-11 text-sm font-medium border-border hover:bg-accent/60 hover:border-primary/20"
                anchorProps={{ href: "#resources" } as never}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.24 }}
              className="mt-6 max-w-lg"
            >
              <SiteSearchBar
                size="md"
                placeholder="Search 1,500+ articles & resources…"
                buttonLabel="Search"
                source="homepage_hero"
              />
            </motion.div>

            <motion.a
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.32 }}
              href="#events"
              className="inline-block mt-3.5 text-body-sm text-muted-foreground hover:text-foreground underline underline-offset-4 decoration-muted-foreground/40 hover:decoration-foreground/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm py-1"
            >
              Join a live session →
            </motion.a>
          </div>

          {/* Right: Visual anchor */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="hidden lg:block"
          >
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-prominent">
              <img
                src={seanSpeaking}
                alt="Sean Fargo speaking at a mindfulness training event"
                width="600"
                height="450"
                loading="eager"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--foreground)/.35)] via-transparent to-[hsl(var(--foreground)/.05)]" />

              {/* Floating credential strip */}
              <div className="absolute bottom-3.5 left-3.5 right-3.5 rounded-lg bg-card/90 backdrop-blur-md border border-border/60 p-3.5 shadow-[var(--shadow-lg)]">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2.5">
                    <div className="h-9 w-9 rounded-full bg-primary/10 border border-primary/10 flex items-center justify-center shrink-0">
                      <Shield className="h-4 w-4 text-primary" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-[0.8125rem] font-semibold text-foreground font-serif leading-tight">APA-Approved Provider</p>
                      <p className="text-caption text-muted-foreground">CE for psychologists & therapists</p>
                    </div>
                  </div>
                  <div className="hidden sm:block h-8 w-px bg-border/60" aria-hidden="true" />
                  <div className="hidden sm:flex items-center gap-2.5">
                    <div className="h-9 w-9 rounded-full bg-primary/10 border border-primary/10 flex items-center justify-center shrink-0">
                      <Users className="h-4 w-4 text-primary" aria-hidden="true" />
                    </div>
                    <div>
                      {/* [verify before publishing] */}
                      <p className="text-[0.8125rem] font-semibold text-foreground font-serif leading-tight">50,000+</p>
                      <p className="text-caption text-muted-foreground">Practitioners served</p>
                    </div>
                  </div>
                  <div className="hidden md:block h-8 w-px bg-border/60" aria-hidden="true" />
                  <div className="hidden md:flex items-center gap-2.5">
                    <div className="h-9 w-9 rounded-full bg-primary/10 border border-primary/10 flex items-center justify-center shrink-0">
                      <BookOpen className="h-4 w-4 text-primary" aria-hidden="true" />
                    </div>
                    <div>
                      {/* [verify before publishing] */}
                      <p className="text-[0.8125rem] font-semibold text-foreground font-serif leading-tight">3,000+</p>
                      <p className="text-caption text-muted-foreground">Free guided practices</p>
                    </div>
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
