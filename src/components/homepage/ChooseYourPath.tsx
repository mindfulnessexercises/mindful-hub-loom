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
      "Access guided meditations, breathing exercises, and mindfulness practices — all free, all evidence-informed.",
    bullets: [
      "Guided meditations, body scans & breathing exercises",
      "Organized by theme: stress, sleep, focus, compassion",
      "New practices added weekly",
    ],
    cta: "Browse Free Exercises",
    href: "#resources",
    icon: (
      <svg viewBox="0 0 28 28" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 4c3.5 0 7 2 7 6 0 3-2 5.5-4 7.5S14 22 14 24c0-2-1-2.5-3-4.5S7 13 7 10c0-4 3.5-6 7-6z" />
        <path d="M14 4c-1.5 3-1 6 0 8s2 4.5 0 8" opacity="0.4" />
      </svg>
    ),
  },
  {
    title: "Become Certified",
    audience: "For therapists, counselors & coaches",
    benefit:
      "Earn CE credits and professional credentials through accredited mindfulness teacher training.",
    bullets: [
      "CE-accredited certification programs",
      "Designed for licensed professionals",
      "Self-paced, live & hybrid formats",
    ],
    cta: "Explore Programs",
    href: "#certification",
    featured: true,
    icon: (
      <svg viewBox="0 0 28 28" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="6" width="20" height="14" rx="2" />
        <path d="M4 10h20" />
        <path d="M14 20v4" />
        <path d="M10 24h8" />
        <circle cx="14" cy="14" r="2" opacity="0.5" />
      </svg>
    ),
  },
  {
    title: "Join Live Events",
    audience: "For practitioners & professionals",
    benefit:
      "Learn in real time with expert-led workshops, community sessions, and CE-eligible trainings.",
    bullets: [
      "Live workshops with experienced teachers",
      "Free community sessions & CE-eligible events",
      "Virtual and in-person formats",
    ],
    cta: "View Upcoming Events",
    href: "#events",
    icon: (
      <svg viewBox="0 0 28 28" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
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
        eyebrow="Choose Your Path"
        title="How would you like to begin?"
        subtitle="Start a personal practice, earn professional credentials, or learn alongside a community of practitioners."
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

            <div className="p-6 sm:p-7 flex flex-col flex-1">
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

              <ul className="space-y-2.5 mb-7 flex-1">
                {path.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2.5 text-body-sm text-foreground/80">
                    <span
                      className={cn(
                        "mt-[7px] h-1.5 w-1.5 rounded-full shrink-0",
                        path.featured ? "bg-primary/60" : "bg-muted-foreground/40"
                      )}
                    />
                    {b}
                  </li>
                ))}
              </ul>

              <Button
                variant={path.featured ? "default" : "outline"}
                className={cn(
                  "w-full h-11 text-sm font-medium",
                  path.featured
                    ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-elevated"
                    : "border-border hover:bg-accent/70 hover:border-primary/20 text-foreground"
                )}
                asChild
              >
                <a href={path.href}>
                  {path.cta}
                  <ArrowRight className="ml-2 h-3.5 w-3.5" />
                </a>
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}
