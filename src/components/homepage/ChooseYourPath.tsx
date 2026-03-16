import { motion } from "framer-motion";
import { Leaf, GraduationCap, Radio, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionWrapper, SectionHeader } from "./SectionWrapper";
import { cn } from "@/lib/utils";

const paths = [
  {
    icon: Leaf,
    title: "Practice Mindfulness",
    audience: "For individuals & beginners",
    benefit: "Access a curated library of free exercises, guided meditations, and breathing practices to support your daily well-being.",
    bullets: [
      "Guided meditations, body scans, and breathing exercises",
      "Curated by theme: stress, sleep, focus, compassion",
      "New practices and teachers added regularly",
    ],
    cta: "Browse Free Exercises",
    href: "#resources",
  },
  {
    icon: GraduationCap,
    title: "Become Certified",
    audience: "For therapists, counselors & coaches",
    benefit: "Earn recognized CE credits and professional credentials through accredited mindfulness training programs.",
    bullets: [
      "CE-accredited certification programs",
      "Designed for licensed professionals and educators",
      "Flexible formats: self-paced, live, and hybrid",
    ],
    cta: "Explore Programs",
    href: "#certification",
    featured: true,
  },
  {
    icon: Radio,
    title: "Join Live Events",
    audience: "For practitioners & professionals",
    benefit: "Learn in real time with expert-led workshops, community practice sessions, and professional trainings.",
    bullets: [
      "Live workshops with experienced teachers",
      "Free community sessions and CE-eligible trainings",
      "Virtual and in-person formats",
    ],
    cta: "View Upcoming Events",
    href: "#events",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.1, ease: "easeOut" as const },
  }),
};

export function ChooseYourPath() {
  return (
    <SectionWrapper background="primary" id="paths">
      <SectionHeader
        eyebrow="Choose Your Path"
        title="How would you like to begin?"
        subtitle="Whether you're starting a personal practice, pursuing professional credentials, or looking to learn in community — there's a clear path for you."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        {paths.map((path, i) => (
          <motion.div
            key={path.title}
            custom={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={cardVariants}
            className={cn(
              "group relative rounded-lg border bg-card p-7 sm:p-8 flex flex-col transition-all duration-300",
              "hover:shadow-card-hover hover:border-primary/20",
              path.featured
                ? "border-primary/25 shadow-elevated ring-1 ring-primary/8"
                : "border-border shadow-card"
            )}
          >
            {/* Icon */}
            <div
              className={cn(
                "h-11 w-11 rounded-lg flex items-center justify-center mb-5",
                path.featured ? "bg-primary/10" : "bg-accent"
              )}
            >
              <path.icon
                className={cn(
                  "h-5 w-5",
                  path.featured ? "text-primary" : "text-accent-foreground"
                )}
              />
            </div>

            {/* Audience label */}
            <p className="text-eyebrow text-muted-foreground mb-2">{path.audience}</p>

            {/* Title */}
            <h3 className="text-card-heading text-card-foreground mb-3">{path.title}</h3>

            {/* Benefit */}
            <p className="text-body-sm text-muted-foreground mb-5 leading-relaxed">{path.benefit}</p>

            {/* Bullets */}
            <ul className="space-y-2.5 mb-8 flex-1">
              {path.bullets.map((b) => (
                <li key={b} className="flex items-start gap-2.5 text-body-sm text-muted-foreground">
                  <span
                    className={cn(
                      "mt-1.5 h-1.5 w-1.5 rounded-full shrink-0",
                      path.featured ? "bg-primary/60" : "bg-muted-foreground/30"
                    )}
                  />
                  {b}
                </li>
              ))}
            </ul>

            {/* CTA */}
            <Button
              variant={path.featured ? "default" : "outline"}
              className={cn(
                "w-full",
                path.featured
                  ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-soft"
                  : "hover:bg-accent hover:border-primary/20"
              )}
              asChild
            >
              <a href={path.href}>
                {path.cta}
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}
