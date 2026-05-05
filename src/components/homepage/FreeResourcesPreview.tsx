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
    description: "A 15-minute body scan that builds interoceptive awareness — commonly used in MBSR and clinical stress reduction programs.",
    duration: "15 min",
    href: "/short-body-scan",
  },
  {
    type: "Breathing Exercise",
    icon: Play,
    category: "Anxiety",
    title: "Three Deep Breaths",
    description: "A short, structured breathing practice shown to activate the parasympathetic response. Used in therapy and self-care for acute stress.",
    duration: "5 min",
    href: "/alleviate-stress-with-three-deep-breaths",
  },
  {
    type: "Article",
    icon: FileText,
    category: "Scripts",
    title: "Free Guided Meditation Scripts",
    description: "Hundreds of clinician-reviewed scripts you can read aloud or share with clients — sorted by theme and length.",
    duration: "Browse",
    href: "/free-guided-meditation-scripts",
  },
  {
    type: "Guided Practice",
    icon: Heart,
    category: "Compassion",
    title: "Self-Compassion Pause",
    description: "A short metta-inspired practice — clinically studied for its effects on self-compassion and emotional resilience.",
    duration: "10 min",
    href: "/self-compassion-pause",
  },
  {
    type: "Exercise",
    icon: Sparkles,
    category: "Movement",
    title: "Walking Meditation",
    description: "Take mindfulness off the cushion. A guided walking practice for parks, hallways, or any everyday environment.",
    duration: "10 min",
    href: "/walking-meditation-guided-script",
  },
  {
    type: "Worksheets",
    icon: BookOpen,
    category: "Tools",
    title: "Free Mindfulness Worksheets",
    description: "Printable worksheets and exercises for personal practice or use with clients — always free to download.",
    duration: "Browse",
    href: "/free-mindfulness-worksheets",
  },
];

export function FreeResourcesPreview() {
  return (
    <SectionWrapper background="primary" id="resources">
      <SectionHeader
        headingId="resources-heading"
        eyebrow="Free Resource Library"
        title="Guided practices, articles, and tools — always free"
        subtitle="Clinician-reviewed resources you can use personally or share with clients. New content added weekly."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
        {resources.map((resource, i) => (
          <motion.a
            key={resource.title}
            href={resource.href}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            className="group relative h-full rounded-xl border border-border bg-card p-5 sm:p-6 flex flex-col hover:shadow-[var(--shadow-card-hover)] hover:border-primary/25 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
        <Button size="lg" variant="outline" className="min-h-[44px] h-12 px-8 border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground transition-colors duration-200" asChild>
          <a href="/library">
            Browse Full Library
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
          </a>
        </Button>
        <p className="text-caption text-muted-foreground mt-3">
          {/* [verify before publishing — exact counts] */}
          3,000+ free practices · Updated weekly · No account required
        </p>
      </motion.div>
    </SectionWrapper>
  );
}
