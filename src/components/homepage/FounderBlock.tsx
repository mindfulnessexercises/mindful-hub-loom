import { motion } from "framer-motion";
import { SectionWrapper } from "./SectionWrapper";

export function FounderBlock() {
  return (
    <SectionWrapper background="primary" id="founder" narrow ariaLabel="About our founder">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="rounded-xl border border-border bg-card p-6 sm:p-8 lg:p-10 shadow-[var(--shadow-card)]"
      >
        <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 lg:gap-10">
          {/* Photo */}
          <div className="flex-shrink-0">
            {/* [Replace with: <img src="..." alt="[Founder name], founder of Mindfulness Exercises" width="112" height="112" loading="lazy" className="rounded-full" /> ] */}
            <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-full bg-accent border-2 border-primary/10 flex items-center justify-center shadow-[var(--shadow-md)]" role="img" aria-label="Founder photo placeholder">
              <span className="text-caption text-muted-foreground">Photo</span>
            </div>
          </div>

          {/* Credibility block */}
          <div className="text-center sm:text-left flex-1">
            <p className="text-eyebrow text-muted-foreground mb-2">Founded By</p>
            {/* [verify before publishing — replace with real founder name] */}
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-foreground mb-2 leading-snug">
              Built by practitioners, for practitioners
            </h2>
            <p className="text-body-sm text-muted-foreground max-w-lg leading-relaxed">
              {/* [verify before publishing — replace with real founder details] */}
              Mindfulness Exercises was created to bridge the gap between accessible personal practice and rigorous professional training — a platform where quality, credibility, and compassion come together.
            </p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1.5 mt-4" role="list" aria-label="Founder credentials">
              {/* [verify before publishing — replace with real credentials] */}
              {["15+ Years in Mindfulness Education", "Licensed Clinical Background", "CE Program Developer"].map((cred) => (
                <span key={cred} className="text-caption font-medium text-primary flex items-center gap-1.5" role="listitem">
                  <span className="h-1 w-1 rounded-full bg-primary/50" aria-hidden="true" />
                  {cred}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </SectionWrapper>
  );
}
