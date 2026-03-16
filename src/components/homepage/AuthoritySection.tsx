import { motion } from "framer-motion";
import { ShieldCheck, GraduationCap, Users, Star } from "lucide-react";
import { SectionWrapper, SectionHeader } from "./SectionWrapper";

const pillars = [
  {
    icon: ShieldCheck,
    title: "Accredited & Recognized",
    description: "Our certification programs offer CE credits recognized by major accrediting bodies for licensed professionals.",
  },
  {
    icon: GraduationCap,
    title: "Expert Faculty",
    description: "Learn from experienced mindfulness teachers, researchers, and clinicians with deep subject-matter expertise.",
  },
  {
    icon: Users,
    title: "A Global Community",
    description: "Join a growing community of professionals integrating mindfulness into therapy, education, healthcare, and coaching.",
    note: "verify before publishing",
  },
  {
    icon: Star,
    title: "Evidence-Based Approach",
    description: "Programs grounded in clinical research and established mindfulness protocols, not trends or fads.",
  },
];

export function AuthoritySection() {
  return (
    <SectionWrapper background="emphasis" id="authority">
      <SectionHeader
        eyebrow="Why Professionals Choose Us"
        title="Built on credibility, grounded in practice"
        subtitle="Professionals trust Mindfulness Exercises for rigorous training, respected credentials, and a deep commitment to the field."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {pillars.map((pillar, i) => (
          <motion.div
            key={pillar.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="text-center sm:text-left"
          >
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 mb-4">
              <pillar.icon className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-card-heading !text-lg font-semibold mb-2">{pillar.title}</h3>
            <p className="text-body-sm text-muted-foreground">{pillar.description}</p>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}
