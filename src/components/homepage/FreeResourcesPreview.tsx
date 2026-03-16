import { motion } from "framer-motion";
import { ArrowRight, Headphones, Play, FileText, BookOpen, Sparkles, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionWrapper, SectionHeader } from "./SectionWrapper";

const resources = [
  {
    type: "Guided Practice",
    icon: Headphones,
    category: "Stress Relief",
    title: "Body Scan for Deep Relaxation",
    description: "A 15-minute body scan building interoceptive awareness and activating the parasympathetic response.",
    duration: "15 min",
  },
  {
    type: "Breathing Exercise",
    icon: Play,
    category: "Anxiety",
    title: "4-7-8 Breathing Technique",
    description: "An evidence-informed breathing pattern used in clinical settings to reduce acute anxiety.",
    duration: "5 min",
  },
  {
    type: "Article",
    icon: FileText,
    category: "Workplace",
    title: "Mindfulness at Work: A Practical Guide",
    description: "How organizations integrate mindfulness programs to improve employee wellbeing and focus.",
    duration: "8 min read",
  },
  {
    type: "Guided Practice",
    icon: Heart,
    category: "Compassion",
    title: "Loving-Kindness Meditation",
    description: "A traditional metta practice adapted for modern practitioners — builds self-compassion and empathy.",
    duration: "20 min",
  },
  {
    type: "Exercise",
    icon: Sparkles,
    category: "Movement",
    title: "Mindful Walking Practice",
    description: "Bring mindfulness off the cushion with this walking practice designed for everyday environments.",
    duration: "10 min",
  },
  {
    type: "Research Summary",
    icon: BookOpen,
    category: "Research",
    title: "Mindfulness & Emotional Regulation",
    description: "A concise review of peer-reviewed findings on mindfulness and emotional self-regulation.",
    duration: "6 min read",
  },
];

export function FreeResourcesPreview() {
  return (
    <SectionWrapper background="primary" id="resources">
      <SectionHeader
        headingId="resources-heading"
        eyebrow="Free Resource Library"
        title="Exercises, guides, and practices — always free"
        subtitle="A curated selection from our growing library. Start a personal practice or share with clients."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
        {resources.map((resource, i) => (
          <motion.a
            key={resource.title}
            href="#"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            className="group relative rounded-xl border border-border bg-card p-5 sm:p-6 flex flex-col hover:shadow-[var(--shadow-card-hover)] hover:border-primary/25 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            aria-label={`${resource.title} — ${resource.type}, ${resource.duration}`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-2.5 py-1 text-caption font-medium text-accent-foreground">
                <resource.icon className="h-3 w-3" aria-hidden="true" />
                {resource.type}
              </span>
              <span className="text-caption font-medium text-muted-foreground">
                {resource.duration}
              </span>
            </div>

            <h3 className="text-card-heading text-card-foreground mb-2 group-hover:text-primary transition-colors duration-200">
              {resource.title}
            </h3>

            <p className="text-body-sm text-muted-foreground mb-4 flex-1 leading-relaxed">
              {resource.description}
            </p>

            <div className="flex items-center justify-between pt-3 border-t border-border/60">
              <span className="text-caption font-semibold uppercase tracking-wider text-muted-foreground/80">
                {resource.category}
              </span>
              <ArrowRight className="h-4 w-4 text-primary/50 group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-200" aria-hidden="true" />
            </div>
          </motion.a>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="text-center mt-10"
      >
        <Button size="lg" variant="outline" className="h-12 px-8 border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground transition-colors duration-200" asChild>
          <a href="#">
            Explore Full Library
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
          </a>
        </Button>
        <p className="text-caption text-muted-foreground mt-3">
          {/* [verify before publishing] */}
          3,000+ exercises · Updated weekly · Always free
        </p>
      </motion.div>
    </SectionWrapper>
  );
}
