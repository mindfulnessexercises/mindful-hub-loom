import { motion } from "framer-motion";
import { ArrowRight, Clock, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionWrapper, SectionHeader } from "./SectionWrapper";

const programs = [
  {
    title: "Mindfulness-Based Stress Reduction (MBSR) Teacher Training",
    audience: "Therapists, counselors, social workers, educators",
    outcome: "Qualify to lead MBSR programs in clinical and community settings",
    credits: "CE credits available",
    format: "Online, self-paced with live cohort sessions",
    featured: true,
  },
  {
    title: "Professional Mindfulness Teacher Certification",
    audience: "Coaches, wellness professionals, HR leaders",
    outcome: "Earn a recognized credential in mindfulness instruction",
    credits: "CE credits available",
    format: "Flexible online training",
  },
  {
    title: "Mindfulness in Clinical Practice",
    audience: "Licensed mental health professionals",
    outcome: "Integrate evidence-based mindfulness into therapeutic practice",
    credits: "CE credits available",
    format: "Online coursework with practicum",
  },
];

export function CertificationSpotlight() {
  return (
    <SectionWrapper background="alternate" id="certification">
      <SectionHeader
        eyebrow="Professional Training"
        title="Certification programs that advance your career"
        subtitle="CE-accredited programs designed for professionals who want to bring mindfulness into their practice."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {programs.map((prog, i) => (
          <motion.div
            key={prog.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: i * 0.1 }}
            className={`rounded-lg border bg-card p-7 flex flex-col transition-shadow duration-300 hover:shadow-card-hover ${
              prog.featured
                ? "border-primary/30 ring-1 ring-primary/10 shadow-elevated lg:scale-[1.02]"
                : "border-border shadow-card"
            }`}
          >
            {prog.featured && (
              <Badge className="self-start mb-4 bg-primary/10 text-primary border-0 font-medium text-caption">
                Featured Program
              </Badge>
            )}

            <h3 className="text-card-heading text-card-foreground mb-3 leading-snug">{prog.title}</h3>

            <p className="text-body-sm text-muted-foreground mb-1">
              <span className="font-medium text-foreground">Who it's for: </span>{prog.audience}
            </p>
            <p className="text-body-sm text-muted-foreground mb-4">
              <span className="font-medium text-foreground">Outcome: </span>{prog.outcome}
            </p>

            <div className="flex flex-wrap gap-3 mb-6 mt-auto">
              <div className="flex items-center gap-1.5 text-caption text-muted-foreground">
                <Award className="h-3.5 w-3.5" />
                {prog.credits}
              </div>
              <div className="flex items-center gap-1.5 text-caption text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                {prog.format}
              </div>
            </div>

            <Button
              variant={prog.featured ? "default" : "outline"}
              className={prog.featured ? "bg-primary text-primary-foreground hover:bg-primary/90 w-full" : "w-full"}
            >
              Learn More
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}
