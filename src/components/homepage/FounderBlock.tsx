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
        className="flex flex-col md:flex-row items-center gap-8 md:gap-12"
      >
        {/* Photo */}
        <div className="flex-shrink-0">
          {/* [Replace with: <img src="..." alt="[Founder name], founder of Mindfulness Exercises" width="128" height="128" loading="lazy" class="rounded-full" /> ] */}
          <div className="h-28 w-28 md:h-32 md:w-32 rounded-full bg-accent border-2 border-primary/10 flex items-center justify-center shadow-[var(--shadow-md)]" role="img" aria-label="Founder photo placeholder">
            <span className="text-caption text-muted-foreground">Photo</span>
          </div>
        </div>

        {/* Credibility block */}
        <div className="text-center md:text-left">
          <p className="text-eyebrow text-muted-foreground mb-3">Our Founder</p>
          <h2 className="font-serif text-xl sm:text-2xl font-semibold text-foreground mb-3 leading-snug">
            {/* [verify before publishing — replace with real founder name] */}
            Built by practitioners, for practitioners
          </h2>
          <p className="text-body text-muted-foreground max-w-xl mb-3">
            {/* [verify before publishing — replace with real founder details] */}
            Mindfulness Exercises was founded to bridge the gap between accessible personal practice and
            rigorous professional training — creating a platform where quality, credibility, and compassion
            come together.
          </p>
          <ul className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1 mt-4" role="list" aria-label="Founder credentials">
            {/* [verify before publishing — replace with real credentials] */}
            {["15+ Years in Mindfulness Education", "Licensed Clinical Background", "CE Program Developer"].map((cred) => (
              <li key={cred} className="text-caption font-medium text-primary/80 flex items-center gap-1.5">
                <span className="h-1 w-1 rounded-full bg-primary/40" aria-hidden="true" />
                {cred}
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </SectionWrapper>
  );
}
