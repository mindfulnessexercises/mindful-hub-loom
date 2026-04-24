import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { SectionWrapper, SectionHeader } from "./SectionWrapper";

/*
  Intent-based callouts — each card opens with the visitor's *goal*
  (verb-led question), then routes to the correct paid landing page.
  Distinct from MoreWaysToGrow (which is product-led) by leading with intent.
*/
const callouts = [
  {
    intent: "I want to teach mindfulness",
    label: "Get Certified",
    description:
      "Earn a recognized teaching credential through our APA-approved certification — CPD, IMMA & IMTA accredited.",
    href: "https://certify.mindfulnessexercises.com/",
    cta: "Start Certification",
  },
  {
    intent: "I need ready-to-teach material",
    label: "Get the Curriculum",
    description:
      "10 done-for-you sessions with 400+ brandable slides, scripts, and student workbooks — start teaching this week.",
    href: "https://curriculum.mindfulnessexercises.com/",
    cta: "Browse the Curriculum",
  },
  {
    intent: "I want to teach trauma-sensitively",
    label: "Trauma-Sensitive Training",
    description:
      "A 15-hour certification to recognize trauma responses, modify practices, and teach within ethical scope.",
    href: "https://trauma.mindfulnessexercises.com/",
    cta: "View Trauma Training",
  },
  {
    intent: "I just need meditation scripts",
    label: "Get the Scripts",
    description:
      "200 expert-written guided meditation scripts across 12 categories — open, read, guide. Commercial license included.",
    href: "https://scripts.mindfulnessexercises.com/",
    cta: "Get the Script Library",
  },
];

const variants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.06, ease: "easeOut" as const },
  }),
};

export function ProductCallouts() {
  return (
    <SectionWrapper background="primary" id="product-callouts" ariaLabel="Find the right program for your goal">
      <SectionHeader
        eyebrow="Find Your Next Step"
        title="What are you here to do?"
        subtitle="Pick the goal that fits — we'll point you to the program built for it."
      />

      <div
        className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5"
        data-track-cta="product_callouts"
        data-track-cta-location="homepage_product_callouts"
      >
        {callouts.map((c, i) => (
          <motion.a
            key={c.intent}
            href={c.href}
            target="_blank"
            rel="noopener noreferrer"
            custom={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={variants}
            data-track-cta-label={c.label}
            className="group flex flex-col sm:flex-row sm:items-center gap-5 p-6 lg:p-7 bg-card border border-border rounded-xl hover:border-primary/40 hover:shadow-card-hover transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <div className="flex-1">
              <p className="text-eyebrow text-primary mb-2">{c.label}</p>
              <h3 className="font-serif text-xl font-semibold text-card-foreground leading-snug mb-2">
                “{c.intent}”
              </h3>
              <p className="text-body-sm text-muted-foreground leading-relaxed">
                {c.description}
              </p>
            </div>

            <div className="shrink-0 sm:self-center">
              <span className="inline-flex items-center gap-2 text-sm font-medium text-primary group-hover:gap-3 transition-all">
                {c.cta}
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
              </span>
            </div>
          </motion.a>
        ))}
      </div>
    </SectionWrapper>
  );
}
