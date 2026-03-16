import { motion } from "framer-motion";
import { BookOpen, Check, ArrowRight, Lock } from "lucide-react";
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
          className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-14 items-center"
        >
          {/* Ebook visual placeholder */}
          <div className="lg:col-span-2 flex justify-center lg:justify-end order-2 lg:order-1" aria-hidden="true">
            <div className="relative w-44 sm:w-56">
              <div className="aspect-[3/4] rounded-lg bg-primary-foreground/10 border border-primary-foreground/15 backdrop-blur-sm shadow-lg flex flex-col items-center justify-center p-6 text-center">
                <div className="h-10 w-10 rounded-full bg-primary-foreground/15 flex items-center justify-center mb-4">
                  <BookOpen className="h-5 w-5 text-primary-foreground/80" />
                </div>
                <p className="font-serif text-sm font-semibold text-primary-foreground/90 leading-snug mb-1">
                  The Mindful<br />Practitioner's<br />Starter Guide
                </p>
                <p className="text-caption text-primary-foreground/50 mt-2">
                  Free · 42 pages
                </p>
                <div className="absolute left-0 top-2 bottom-2 w-1 rounded-full bg-primary-foreground/10" />
              </div>
              {/* [Replace with real ebook cover: <img src="..." alt="The Mindful Practitioner's Starter Guide ebook cover" width="224" height="299" loading="lazy" /> ] */}
            </div>
          </div>

          {/* Content + Form */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            <p className="text-eyebrow text-primary-foreground/60 mb-4">Free Download</p>

            <h2 className="text-section-heading text-primary-foreground mb-4">
              Build a sustainable mindfulness practice — guided, step by step
            </h2>

            <p className="text-body-lg text-primary-foreground/75 mb-6">
              Our free 42-page guide gives you everything you need to start or deepen your practice with confidence.
            </p>

            <ul className="space-y-3 mb-8" role="list">
              {[
                "Daily exercises designed for real schedules and busy lives",
                "Evidence-informed techniques used in clinical and professional settings",
                "A structured 4-week plan you can start today",
              ].map((benefit) => (
                <li key={benefit} className="flex items-start gap-3 text-body-sm text-primary-foreground/85">
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
              aria-label="Download free ebook"
            >
              <label htmlFor="ebook-email" className="sr-only">Email address</label>
              <Input
                id="ebook-email"
                type="email"
                placeholder="Your email address"
                autoComplete="email"
                className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40 focus-visible:ring-primary-foreground/30 h-12 flex-1"
                required
              />
              <Button
                type="submit"
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 h-12 px-6 font-semibold whitespace-nowrap shadow-md"
              >
                Get Free Guide
                <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden="true" />
              </Button>
            </form>

            <p className="flex items-center gap-1.5 text-caption text-primary-foreground/40 mt-4">
              <Lock className="h-3 w-3" aria-hidden="true" />
              No spam. Unsubscribe anytime. We respect your privacy.
            </p>
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
