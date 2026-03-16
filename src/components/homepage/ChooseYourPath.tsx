import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionWrapper, SectionHeader } from "./SectionWrapper";
import { cn } from "@/lib/utils";

const paths = [
  {
    title: "Practice Mindfulness",
    audience: "For individuals & beginners",
    benefit:
      "Start with free guided meditations, breathing exercises, and body scans — organized by theme and ready to use today.",
    bullets: [
      "Guided practices for stress, sleep, focus, and compassion",
      "Evidence-informed techniques used in clinical settings",
      "New exercises added weekly",
    ],
    cta: "Browse Free Practices",
    href: "#resources",
    icon: (
      <svg viewBox="0 0 28 28" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M14 4c3.5 0 7 2 7 6 0 3-2 5.5-4 7.5S14 22 14 24c0-2-1-2.5-3-4.5S7 13 7 10c0-4 3.5-6 7-6z" />
        <path d="M14 4c-1.5 3-1 6 0 8s2 4.5 0 8" opacity="0.4" />
      </svg>
    ),
  },
  {
    title: "Get Certified",
    audience: "For therapists, counselors & coaches",
    benefit:
      "Earn CE credits and a recognized mindfulness teaching credential through APA-approved training programs.",
    bullets: [
      "APA-approved CE for psychologists, MFTs, LCSWs & more",
      "Structured programs with live and self-paced options",
      "Graduate ready to teach in clinical or community settings",
    ],
    cta: "View Programs",
    href: "#certification",
    featured: true,
    icon: (
      <svg viewBox="0 0 28 28" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="4" y="6" width="20" height="14" rx="2" />
        <path d="M4 10h20" />
        <path d="M14 20v4" />
        <path d="M10 24h8" />
        <circle cx="14" cy="14" r="2" opacity="0.5" />
      </svg>
    ),
  },
  {
    title: "Join Live Sessions",
    audience: "For practitioners & professionals",
    benefit:
      "Practice with a live community — weekly meditations, open discussions, and CE-eligible professional workshops.",
    bullets: [
      "Weekly guided meditations and discussion circles",
      "Monthly CE workshops for licensed professionals",
      "No cost for community sessions",
    ],
    cta: "See Upcoming Sessions",
    href: "#events",
    icon: (
      <svg viewBox="0 0 28 28" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="14" cy="14" r="10" />
        <path d="M14 8v6l4 2" />
        <path d="M20 4l2 2M8 4L6 6" opacity="0.4" />
      </svg>
    ),
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

export function ChooseYourPath() {
  return (
    <SectionWrapper background="primary" id="paths">
      <SectionHeader
        headingId="paths-heading"
        eyebrow="Choose Your Path"
        title="What brings you here?"
        subtitle="Whether you're starting a personal practice, earning professional credentials, or seeking community — there's a clear path forward."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
        {paths.map((path, i) => (
          <motion.div
            key={path.title}
            custom={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={cardVariants}
            className={cn(
              "group relative rounded-xl border bg-card flex flex-col transition-all duration-300",
              "hover:shadow-card-hover hover:-translate-y-0.5",
              path.featured
                ? "border-primary/25 shadow-elevated ring-1 ring-primary/[0.08]"
                : "border-border shadow-card hover:border-primary/20"
            )}
          >
            {path.featured && (
              <div className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-primary/60 to-transparent rounded-full" />
            )}

            <div className="p-5 sm:p-7 flex flex-col flex-1">
              <div
                className={cn(
                  "h-12 w-12 rounded-xl flex items-center justify-center mb-5 border",
                  path.featured
                    ? "bg-primary/[0.1] border-primary/12 text-primary"
                    : "bg-accent/80 border-border/60 text-foreground/70"
                )}
              >
                {path.icon}
              </div>

              <p className="text-eyebrow text-muted-foreground mb-2">{path.audience}</p>
              <h3 className="text-card-heading text-card-foreground mb-2.5">{path.title}</h3>
              <p className="text-body-sm text-muted-foreground mb-5 leading-relaxed">{path.benefit}</p>

              <ul className="space-y-2.5 mb-6 flex-1" role="list">
                {path.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2.5 text-body-sm text-foreground/80">
                    <span
                      className={cn(
                        "mt-[7px] h-1.5 w-1.5 rounded-full shrink-0",
                        path.featured ? "bg-primary/60" : "bg-muted-foreground/40"
                      )}
                      aria-hidden="true"
                    />
                    {b}
                  </li>
                ))}
              </ul>

              <Button
                variant={path.featured ? "default" : "outline"}
                className={cn(
                  "w-full min-h-[44px] h-11 text-sm font-medium",
                  path.featured
                    ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-elevated"
                    : "border-border hover:bg-accent/70 hover:border-primary/20 text-foreground"
                )}
                asChild
              >
                <a href={path.href}>
                  {path.cta}
                  <ArrowRight className="ml-2 h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}
