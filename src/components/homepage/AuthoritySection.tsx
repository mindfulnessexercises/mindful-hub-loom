import { motion } from "framer-motion";
import { SectionWrapper, SectionHeader } from "./SectionWrapper";

/*
  Authority pillars — keep concise. Verify claims before publishing.
*/
const pillars = [
  {
    title: "Accredited Standards",
    description:
      "Certification programs offer CE credits recognized by major professional accrediting bodies for therapists, counselors, and educators.",
    // verify before publishing — specify which accrediting bodies
    icon: (
      <svg viewBox="0 0 28 28" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 3L4 8v6c0 5.55 4.27 10.74 10 12 5.73-1.26 10-6.45 10-12V8L14 3z" />
        <path d="M10 14l2.5 2.5L18 11" />
      </svg>
    ),
  },
  {
    title: "Expert Faculty",
    description:
      "Programs are developed and taught by experienced mindfulness teachers, clinical researchers, and licensed professionals.",
    icon: (
      <svg viewBox="0 0 28 28" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="14" cy="9" r="4" />
        <path d="M6 22c0-4.42 3.58-8 8-8s8 3.58 8 8" />
        <path d="M18 5l2 2-2 2" opacity="0.4" />
      </svg>
    ),
  },
  {
    title: "Professional Outcomes",
    description:
      "Graduates apply their training in clinical therapy, education, corporate wellness, and private practice settings.",
    // verify before publishing — consider adding outcome data if available
    icon: (
      <svg viewBox="0 0 28 28" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 20l4-4 4 2 6-8 6 4" />
        <path d="M20 8h6v6" opacity="0.5" />
      </svg>
    ),
  },
  {
    title: "Depth of Library",
    description:
      "A curated collection of thousands of exercises, guided practices, and educational content — free and growing.",
    // verify before publishing — "thousands" claim
    icon: (
      <svg viewBox="0 0 28 28" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="4" width="8" height="10" rx="1" />
        <rect x="16" y="4" width="8" height="6" rx="1" />
        <rect x="4" y="18" width="8" height="6" rx="1" />
        <rect x="16" y="14" width="8" height="10" rx="1" />
      </svg>
    ),
  },
];

const pillarVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.07, ease: "easeOut" as const },
  }),
};

export function AuthoritySection() {
  return (
    <SectionWrapper background="emphasis" id="authority">
      <SectionHeader
        eyebrow="Why Professionals Choose Us"
        title="Built on credibility, grounded in practice"
        subtitle="Rigorous training, respected credentials, and a deep commitment to the field of mindfulness."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        {pillars.map((pillar, i) => (
          <motion.div
            key={pillar.title}
            custom={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-30px" }}
            variants={pillarVariants}
            className="group"
          >
            {/* Icon container */}
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 text-primary transition-colors duration-300 group-hover:bg-primary/15">
              {pillar.icon}
            </div>

            {/* Title */}
            <h3 className="font-serif text-base font-semibold text-foreground mb-2 leading-snug">
              {pillar.title}
            </h3>

            {/* Description */}
            <p className="text-body-sm text-muted-foreground leading-relaxed">
              {pillar.description}
            </p>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}
