import { motion } from "framer-motion";
import { SectionWrapper } from "./SectionWrapper";
import { InlineEmailCapture } from "@/components/email/InlineEmailCapture";
import ebookCover from "@/assets/ebook-cover.jpg";

/**
 * Homepage section 8 — Ebook Lead Magnet (per the documented homepage
 * architecture). Targets professionals exploring whether to formally teach,
 * so it uses the `premium_training` track copy.
 *
 * Visual is preserved (cover image, deep background, two-column layout)
 * but the form, copy, validation, persistence, and analytics now flow
 * through the shared `InlineEmailCapture` so every capture surface on
 * the site behaves identically.
 */
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
              <div className="absolute -inset-4 rounded-2xl bg-primary-foreground/[0.06] blur-2xl" />
              <img
                src={ebookCover}
                alt="Ready to Teach Mindfulness? — A Practical Orientation for Emerging Mindfulness Teachers, by Sean Fargo"
                width="224"
                height="290"
                loading="lazy"
                className="relative rounded-lg shadow-lg border border-primary-foreground/15"
              />
              <div className="absolute top-1.5 -right-1.5 bottom-1.5 w-full rounded-lg border border-primary-foreground/8 bg-primary-foreground/[0.03] -z-10" />
            </div>
          </div>

          {/* Capture */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            <InlineEmailCapture
              track="premium_training"
              location="homepage_ebook_section"
              variant="on-dark"
              headlineOverride="Are you ready to teach mindfulness?"
              hideFollowUp
            />
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
