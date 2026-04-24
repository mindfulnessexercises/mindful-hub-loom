import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { SectionWrapper, SectionHeader } from "./SectionWrapper";

/*
  Top endorsements — featured prominently above the fold of the
  certification path. Portrait URLs reuse assets already published by
  certify.* and scripts.* product sites (no extra hosting required).
*/
const endorsements = [
  {
    quote:
      "Sean is a wonderful teacher, well practiced in the teachings of mindfulness and compassion, dedicated and thoughtful.",
    author: "Jack Kornfield",
    role: "Renowned Mindfulness Teacher · Founder, Spirit Rock Meditation Center",
    image: "https://scripts.mindfulnessexercises.com/assets/jack-BrsJ41Pt.png",
  },
  {
    quote:
      "Having collaborated with Sean Fargo, I can attest that he is a visionary who brings scope, insight and compassion to his teaching and support of others on the path of meditation. Along with many, I, too, have personally witnessed his unstinting kindness.",
    author: "Gabor Maté",
    role: "M.D., Author, The Myth of Normal: Trauma, Illness and Healing in a Toxic Culture",
    image: "https://certify.mindfulnessexercises.com/assets/gabor-mate-BQza_1r2.png",
  },
];

export function TopEndorsements() {
  return (
    <SectionWrapper
      background="alternate"
      id="top-endorsements"
      ariaLabel="Endorsed by leaders in mindfulness"
    >
      <SectionHeader
        eyebrow="Endorsed by Leaders in Mindfulness"
        title="Trusted by the teachers who shaped the field"
        subtitle="World-renowned authors and meditation teachers on Sean Fargo's work."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 max-w-6xl mx-auto">
        {endorsements.map((e, i) => (
          <motion.figure
            key={e.author}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
            className="group flex flex-col sm:flex-row gap-5 sm:gap-6 bg-card border border-border rounded-xl p-5 sm:p-6 shadow-card hover:shadow-card-hover transition-shadow duration-300"
          >
            <div className="relative shrink-0 self-start">
              <img
                src={e.image}
                alt={`Portrait of ${e.author}`}
                loading="lazy"
                className="w-32 h-32 sm:w-40 sm:h-40 object-cover rounded-lg bg-muted"
              />
              <div className="absolute bottom-2 right-2 w-8 h-8 rounded-md bg-primary/90 flex items-center justify-center shadow-md">
                <Quote className="w-4 h-4 text-primary-foreground" aria-hidden="true" />
              </div>
            </div>

            <div className="flex flex-col justify-center flex-1 min-w-0">
              <blockquote className="font-serif text-lg sm:text-xl leading-relaxed text-card-foreground mb-4">
                “{e.quote}”
              </blockquote>
              <figcaption>
                <p className="font-sans text-base sm:text-lg font-semibold text-foreground">
                  — {e.author}
                </p>
                <p className="text-body-sm text-muted-foreground mt-1">{e.role}</p>
              </figcaption>
            </div>
          </motion.figure>
        ))}
      </div>
    </SectionWrapper>
  );
}
