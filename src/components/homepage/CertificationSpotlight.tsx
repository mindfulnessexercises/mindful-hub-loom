import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionWrapper, SectionHeader } from "./SectionWrapper";
import { cn } from "@/lib/utils";

/*
  Program data — verify titles, CE details, and formats before publishing.
*/
const programs = [
  {
    title: "Mindfulness-Based Stress Reduction (MBSR) Teacher Training",
    audience: "Therapists, counselors, social workers & educators",
    outcomes: [
      "Qualify to lead MBSR programs in clinical and community settings",
      "Deepen personal mindfulness practice through structured training",
    ],
    accreditation: "CE credits available through accredited providers", // verify before publishing
    format: "Online · Self-paced with live cohort sessions",
    duration: "8–12 months", // verify before publishing
    cta: "Learn About MBSR Training",
    href: "#",
    featured: true,
  },
  {
    title: "Professional Mindfulness Teacher Certification",
    audience: "Coaches, wellness professionals & HR leaders",
    outcomes: [
      "Earn a recognized credential in mindfulness instruction",
      "Build confidence teaching mindfulness in professional settings",
    ],
    accreditation: "CE credits available", // verify before publishing
    format: "Online · Flexible schedule",
    duration: "Self-paced", // verify before publishing
    cta: "Explore Certification",
    href: "#",
  },
  {
    title: "Mindfulness in Clinical Practice",
    audience: "Licensed mental health professionals",
    outcomes: [
      "Integrate evidence-based mindfulness into therapeutic practice",
      "Earn CE credits for license renewal",
    ],
    accreditation: "CE credits available", // verify before publishing
    format: "Online · Coursework with practicum",
    duration: "Varies by track", // verify before publishing
    cta: "View Program Details",
    href: "#",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.08, ease: "easeOut" as const },
  }),
};

export function CertificationSpotlight() {
  return (
    <SectionWrapper background="alternate" id="certification">
      <SectionHeader
        eyebrow="Professional Training"
        title="Certification programs that advance your career"
        subtitle="CE-accredited programs designed for professionals who want to bring mindfulness into their practice with recognized credentials."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6">
        {programs.map((prog, i) => (
          <motion.div
            key={prog.title}
            custom={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={cardVariants}
            className={cn(
              "group relative rounded-xl border bg-card flex flex-col transition-all duration-300 hover:shadow-card-hover",
              prog.featured
                ? "border-primary/25 shadow-elevated ring-1 ring-primary/[0.08]"
                : "border-border shadow-card hover:border-primary/20"
            )}
          >
            {prog.featured && (
              <div className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-primary/60 to-transparent rounded-full" />
            )}

            <div className="p-6 sm:p-7 flex flex-col flex-1">
              {prog.featured && (
                <div className="inline-flex self-start items-center gap-1.5 rounded-full bg-primary/[0.08] border border-primary/12 px-3 py-1 mb-4">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary/70" />
                  <span className="text-caption font-semibold text-primary">Flagship Program</span>
                </div>
              )}

              <h3 className="text-card-heading text-foreground mb-4 leading-snug">{prog.title}</h3>

              <div className="mb-4">
                <p className="text-eyebrow text-muted-foreground mb-1">Who It's For</p>
                <p className="text-body-sm text-foreground/90">{prog.audience}</p>
              </div>

              <div className="mb-5 flex-1">
                <p className="text-eyebrow text-muted-foreground mb-2">What You'll Achieve</p>
                <ul className="space-y-2">
                  {prog.outcomes.map((outcome) => (
                    <li key={outcome} className="flex items-start gap-2 text-body-sm text-foreground/80">
                      <CheckCircle2 className="h-4 w-4 mt-[2px] text-primary/70 shrink-0" />
                      {outcome}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-border/80 pt-4 mb-5 space-y-2">
                <div className="flex items-center gap-2 text-caption text-foreground/70 font-medium">
                  <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5 shrink-0 text-primary/60" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M8 1l2 3.5L14 5l-3 3 .5 4L8 10.5 4.5 12 5 8 2 5l4-.5L8 1z" />
                  </svg>
                  <span>{prog.accreditation}</span>
                </div>
                <div className="flex items-center gap-2 text-caption text-foreground/70 font-medium">
                  <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5 shrink-0 text-primary/60" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="8" cy="8" r="6" />
                    <path d="M8 4.5V8l2.5 1.5" />
                  </svg>
                  <span>{prog.format} · {prog.duration}</span>
                </div>
              </div>

              <Button
                variant={prog.featured ? "default" : "outline"}
                className={cn(
                  "w-full h-11 text-sm font-medium",
                  prog.featured
                    ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-elevated"
                    : "border-border hover:bg-accent/70 hover:border-primary/20 text-foreground"
                )}
                asChild
              >
                <a href={prog.href}>
                  {prog.cta}
                  <ArrowRight className="ml-2 h-3.5 w-3.5" />
                </a>
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="text-center text-body-sm text-muted-foreground mt-8"
      >
        All programs include CE credits for eligible professionals.{" "}
        <a href="#" className="underline underline-offset-4 decoration-muted-foreground/40 hover:text-foreground hover:decoration-foreground/60 transition-colors font-medium">
          Compare programs →
        </a>
        {/* verify before publishing — "All programs include CE credits" */}
      </motion.p>
    </SectionWrapper>
  );
}
