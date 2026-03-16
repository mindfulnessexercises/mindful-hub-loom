import { motion } from "framer-motion";
import { SectionWrapper } from "./SectionWrapper";
import seanPhoto from "@/assets/sean-fargo-headshot.jpg";
import { Award, BookOpen, GraduationCap } from "lucide-react";

const credentials = [
  { icon: GraduationCap, label: "Former Buddhist Monk" },
  { icon: Award, label: "UC Berkeley Trained" },
  { icon: BookOpen, label: "CPD & IMMA Accredited Programs" },
];

export function FounderBlock() {
  return (
    <SectionWrapper background="primary" id="founder" ariaLabel="About our founder">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <div className="rounded-xl border border-border bg-card shadow-[var(--shadow-card)] overflow-hidden">
          <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] items-stretch">
            {/* Photo column */}
            <div className="flex items-center justify-center sm:justify-start p-6 sm:p-8 lg:p-10">
              <div className="relative">
                <img
                  src={seanPhoto}
                  alt="Sean Fargo, founder of Mindfulness Exercises"
                  width="128"
                  height="128"
                  loading="lazy"
                  className="h-28 w-28 sm:h-32 sm:w-32 rounded-full object-cover border-2 border-primary/10 shadow-[var(--shadow-md)]"
                />
                <div className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-card border-2 border-border flex items-center justify-center shadow-sm">
                  <Award className="h-4 w-4 text-primary" aria-hidden="true" />
                </div>
              </div>
            </div>

            {/* Content column */}
            <div className="px-6 pb-6 sm:py-8 sm:pr-8 lg:py-10 lg:pr-10 sm:pl-0 text-center sm:text-left">
              <p className="text-eyebrow text-muted-foreground mb-2">Founded By</p>
              <h2
                id="founder-heading"
                className="font-serif text-xl sm:text-2xl font-semibold text-foreground mb-2.5 leading-snug"
              >
                Sean Fargo
              </h2>
              <p className="text-body-sm text-muted-foreground max-w-lg leading-relaxed mb-5">
                A former Buddhist monk trained at UC Berkeley, Sean built Mindfulness Exercises to make
                evidence-based mindfulness accessible for personal practice and rigorous enough for
                professional certification — serving over 50,000 practitioners to date.
                {/* [verify practitioner count before publishing] */}
              </p>

              {/* Credential badges */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5" role="list" aria-label="Founder credentials">
                {credentials.map((cred) => (
                  <span
                    key={cred.label}
                    className="inline-flex items-center gap-1.5 rounded-full border border-primary/12 bg-primary/[0.04] px-3 py-1.5 text-caption font-medium text-primary"
                    role="listitem"
                  >
                    <cred.icon className="h-3 w-3" aria-hidden="true" />
                    {cred.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </SectionWrapper>
  );
}
