import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SectionWrapper } from "./SectionWrapper";

export function EbookCapture() {
  return (
    <SectionWrapper background="deep" id="ebook">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto text-center"
      >
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary-foreground/10 mb-6">
          <BookOpen className="h-6 w-6 text-primary-foreground" />
        </div>

        <h2 className="text-section-heading text-primary-foreground mb-4">
          A free guide to starting your mindfulness practice
        </h2>
        <p className="text-body-lg text-primary-foreground/80 mb-8">
          Download our free ebook with practical exercises, daily routines, and evidence-based
          guidance to help you build a sustainable mindfulness practice.
        </p>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
        >
          <Input
            type="email"
            placeholder="Your email address"
            className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 focus-visible:ring-primary-foreground/30 h-12"
            required
          />
          <Button
            type="submit"
            className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 h-12 px-6 font-medium whitespace-nowrap"
          >
            Get Free Ebook
          </Button>
        </form>

        <p className="text-caption text-primary-foreground/50 mt-4">
          No spam. Unsubscribe anytime. We respect your privacy.
        </p>
      </motion.div>
    </SectionWrapper>
  );
}
