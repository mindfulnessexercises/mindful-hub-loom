import { motion } from "framer-motion";
import { Check, ArrowRight, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SectionWrapper } from "./SectionWrapper";
import { trackCtaClick, trackEvent } from "@/lib/analytics";
import ebookCover from "@/assets/ebook-cover.jpg";

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
          {/* Ebook cover */}
          <div className="lg:col-span-2 flex justify-center lg:justify-end order-2 lg:order-1">
            <div className="relative w-48 sm:w-56 group">
              {/* Soft glow behind cover */}
              <div className="absolute -inset-4 rounded-2xl bg-primary-foreground/[0.06] blur-2xl" />

              <img
                src={ebookCover}
                alt="Ready to Teach Mindfulness? — A Practical Orientation for Emerging Mindfulness Teachers, by Sean Fargo"
                width="224"
                height="290"
                loading="lazy"
                className="relative rounded-lg shadow-lg border border-primary-foreground/15"
              />

              {/* Shadow page behind */}
              <div className="absolute top-1.5 -right-1.5 bottom-1.5 w-full rounded-lg border border-primary-foreground/8 bg-primary-foreground/[0.03] -z-10" />
            </div>
          </div>

          {/* Content + Form */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            <p className="text-eyebrow text-primary-foreground/60 mb-3">Free Download</p>

            <h2 id="ebook-heading" className="text-section-heading text-primary-foreground mb-3">
              Are you ready to teach mindfulness?
            </h2>

            <p className="text-body-lg text-primary-foreground/80 mb-6 max-w-lg">
              This free guide helps you assess your readiness, understand the five pillars of responsible teaching, and take the next step with clarity.
            </p>

            <ul className="space-y-3 mb-7" role="list">
              {[
                "A self-assessment to evaluate your teaching readiness",
                "The five pillars of responsible mindfulness teaching",
                "Clear guidance on when — and how — to pursue formal training",
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
