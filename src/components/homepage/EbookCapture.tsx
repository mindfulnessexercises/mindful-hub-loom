import { motion } from "framer-motion";
import { BookOpen, Check, ArrowRight, Lock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SectionWrapper } from "./SectionWrapper";

export function EbookCapture() {
  return (
    <SectionWrapper background="deep" id="ebook" ariaLabel="Free ebook download">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14 items-center"
        >
          {/* Ebook cover — premium visual treatment */}
          <div className="lg:col-span-2 flex justify-center lg:justify-end order-2 lg:order-1" aria-hidden="true">
            <div className="relative w-48 sm:w-56 group">
              {/* Soft glow behind cover */}
              <div className="absolute -inset-4 rounded-2xl bg-primary-foreground/[0.06] blur-2xl" />

              {/* Cover */}
              <div className="relative aspect-[3/4] rounded-lg border border-primary-foreground/15 bg-gradient-to-br from-primary-foreground/[0.12] to-primary-foreground/[0.04] backdrop-blur-sm shadow-lg overflow-hidden">
                {/* Spine accent */}
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-primary-foreground/20 via-primary-foreground/10 to-primary-foreground/20" />

                {/* Top decorative strip */}
                <div className="absolute top-0 left-1.5 right-0 h-px bg-gradient-to-r from-primary-foreground/20 via-primary-foreground/10 to-transparent" />

                <div className="relative flex flex-col items-center justify-center h-full px-6 py-8 text-center">
                  {/* Icon */}
                  <div className="h-12 w-12 rounded-full bg-primary-foreground/10 border border-primary-foreground/15 flex items-center justify-center mb-4">
                    <Sparkles className="h-5 w-5 text-primary-foreground/70" aria-hidden="true" />
                  </div>

                  {/* Title */}
                  <p className="font-serif text-base sm:text-lg font-semibold text-primary-foreground/95 leading-snug mb-1.5">
                    The Mindful<br />Practitioner's<br />Starter Guide
                  </p>

                  {/* Author line */}
                  <p className="text-caption text-primary-foreground/45 mb-4">
                    By Sean Fargo
                  </p>

                  {/* Divider */}
                  <div className="w-10 h-px bg-primary-foreground/15 mb-4" />

                  <p className="text-caption text-primary-foreground/40">
                    Free · 42 pages
                  </p>
                </div>

                {/* Bottom accent */}
                <div className="absolute bottom-0 left-1.5 right-0 h-px bg-gradient-to-r from-primary-foreground/15 via-primary-foreground/8 to-transparent" />
              </div>

              {/* Shadow page behind */}
              <div className="absolute top-1.5 -right-1.5 bottom-1.5 w-full rounded-lg border border-primary-foreground/8 bg-primary-foreground/[0.03] -z-10" />

              {/* NOTE: Replace this entire cover block with: <img src="..." alt="The Mindful Practitioner's Starter Guide ebook cover" width="224" height="299" loading="lazy" className="rounded-lg shadow-lg" /> */}
            </div>
          </div>

          {/* Content + Form */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            <p className="text-eyebrow text-primary-foreground/60 mb-3">Free Download</p>

            <h2 id="ebook-heading" className="text-section-heading text-primary-foreground mb-3">
              Build a sustainable mindfulness practice
            </h2>

            <p className="text-body-lg text-primary-foreground/80 mb-6 max-w-lg">
              Our free 42-page guide gives you a structured path to start or deepen your practice with confidence.
            </p>

            <ul className="space-y-3 mb-7" role="list">
              {[
                "Daily exercises designed for real schedules and busy lives",
                "Evidence-informed techniques used in clinical settings",
                "A structured 4-week plan you can start today",
              ].map((benefit) => (
                <li key={benefit} className="flex items-start gap-3 text-body-sm text-primary-foreground/90">
                  <span className="flex-shrink-0 mt-0.5 h-5 w-5 rounded-full bg-primary-foreground/15 flex items-center justify-center" aria-hidden="true">
                    <Check className="h-3 w-3 text-primary-foreground/80" />
                  </span>
                  {benefit}
                </li>
              ))}
            </ul>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex flex-col sm:flex-row gap-3 max-w-lg"
              aria-labelledby="ebook-heading"
            >
              <label htmlFor="ebook-email" className="sr-only">Email address</label>
              <Input
                id="ebook-email"
                type="email"
                placeholder="Your email address"
                autoComplete="email"
                className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40 focus-visible:ring-primary-foreground/30 min-h-[44px] h-12 flex-1"
                required
                aria-required="true"
              />
              <Button
                type="submit"
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 min-h-[44px] h-12 px-6 font-semibold whitespace-nowrap shadow-md"
              >
                Get Free Guide
                <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden="true" />
              </Button>
            </form>

            <p className="flex items-center gap-1.5 text-caption text-primary-foreground/45 mt-3">
              <Lock className="h-3 w-3" aria-hidden="true" />
              No spam. Unsubscribe anytime. We respect your privacy.
            </p>
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
