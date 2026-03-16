import { motion } from "framer-motion";
import { ArrowRight, Play, FileText, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionWrapper, SectionHeader } from "./SectionWrapper";

const resources = [
  { type: "Guided Meditation", icon: Headphones, title: "Body Scan for Deep Relaxation", duration: "15 min", category: "Stress Relief" },
  { type: "Breathing Exercise", icon: Play, title: "4-7-8 Breathing Technique", duration: "5 min", category: "Anxiety" },
  { type: "Article", icon: FileText, title: "Mindfulness in the Workplace: A Practical Guide", duration: "8 min read", category: "Professional" },
  { type: "Guided Meditation", icon: Headphones, title: "Loving-Kindness Meditation", duration: "20 min", category: "Compassion" },
  { type: "Exercise", icon: Play, title: "Mindful Walking Practice", duration: "10 min", category: "Movement" },
  { type: "Article", icon: FileText, title: "How Mindfulness Supports Emotional Regulation", duration: "6 min read", category: "Research" },
];

export function FreeResourcesPreview() {
  return (
    <SectionWrapper background="primary" id="resources">
      <SectionHeader
        eyebrow="Free Resources"
        title="Start your practice today"
        subtitle="Explore a curated selection from our library of exercises, meditations, and guides — all free."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {resources.map((resource, i) => (
          <motion.a
            key={resource.title}
            href="#"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            className="group rounded-lg border border-border bg-card p-6 flex flex-col hover:shadow-card-hover hover:border-primary/20 transition-all duration-300"
          >
            <div className="flex items-center gap-2 mb-3">
              <resource.icon className="h-4 w-4 text-primary/70" />
              <span className="text-caption font-medium text-muted-foreground uppercase tracking-wider">{resource.type}</span>
            </div>

            <h3 className="font-serif text-lg font-semibold text-card-foreground mb-2 group-hover:text-primary transition-colors">
              {resource.title}
            </h3>

            <div className="flex items-center gap-3 mt-auto pt-3">
              <span className="text-caption text-muted-foreground">{resource.duration}</span>
              <span className="h-1 w-1 rounded-full bg-border" />
              <span className="text-caption text-muted-foreground">{resource.category}</span>
            </div>
          </motion.a>
        ))}
      </div>

      <div className="text-center mt-10">
        <Button variant="outline" size="lg" className="px-8">
          Explore Full Library
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </SectionWrapper>
  );
}
