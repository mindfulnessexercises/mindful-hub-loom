import { motion } from "framer-motion";
import { Heart, GraduationCap, Radio, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionWrapper, SectionHeader } from "./SectionWrapper";

const paths = [
  {
    icon: Heart,
    title: "Practice Mindfulness",
    audience: "For individuals & beginners",
    benefit: "Start or deepen your personal mindfulness practice with free, expert-guided exercises.",
    bullets: [
      "Guided meditations and breathing exercises",
      "Curated collections by theme and duration",
      "New content added regularly",
    ],
    cta: "Browse Free Exercises",
    href: "#resources",
  },
  {
    icon: GraduationCap,
    title: "Become Certified",
    audience: "For professionals & practitioners",
    benefit: "Earn CE-accredited credentials and advance your career in mindfulness-based practice.",
    bullets: [
      "CE credits from accredited programs",
      "Designed for therapists, counselors, and coaches",
      "Flexible online and live training formats",
    ],
    cta: "Explore Programs",
    href: "#certification",
    featured: true,
  },
  {
    icon: Radio,
    title: "Join Live Events",
    audience: "For the curious & committed",
    benefit: "Connect with teachers and community in real-time through live workshops and trainings.",
    bullets: [
      "Interactive workshops and Q&A sessions",
      "Virtual and in-person options",
      "Expert-led with practical takeaways",
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
    transition: { duration: 0.45, delay: i * 0.1 },
  }),
};

export function ChooseYourPath() {
  return (
    <SectionWrapper background="primary" id="paths">
      <SectionHeader
        eyebrow="Choose Your Path"
        title="How would you like to begin?"
        subtitle="Whether you're here for personal growth or professional development, there's a clear path for you."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        {paths.map((path, i) => (
          <motion.div
            key={path.title}
            custom={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={cardVariants}
            className={`group relative rounded-lg border bg-card p-8 flex flex-col transition-shadow duration-300 hover:shadow-card-hover ${
              path.featured
                ? "border-primary/30 ring-1 ring-primary/10 shadow-elevated"
                : "border-border shadow-card"
            }`}
          >
            {path.featured && (
              <span className="absolute -top-3 left-6 bg-primary text-primary-foreground text-caption font-semibold px-3 py-1 rounded-full">
                Most Popular
              </span>
            )}

            <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center mb-5">
              <path.icon className="h-5 w-5 text-accent-foreground" />
            </div>

            <p className="text-eyebrow text-muted-foreground mb-2">{path.audience}</p>
            <h3 className="text-card-heading text-card-foreground mb-3">{path.title}</h3>
            <p className="text-body-sm text-muted-foreground mb-5">{path.benefit}</p>

            <ul className="space-y-2.5 mb-8 flex-1">
              {path.bullets.map((b) => (
                <li key={b} className="flex items-start gap-2 text-body-sm text-muted-foreground">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary/50 shrink-0" />
                  {b}
                </li>
              ))}
            </ul>

            <Button
              variant={path.featured ? "default" : "outline"}
              className={path.featured ? "bg-primary text-primary-foreground hover:bg-primary/90 w-full" : "w-full"}
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
