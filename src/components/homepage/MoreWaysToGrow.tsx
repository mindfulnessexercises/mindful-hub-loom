import { motion } from "framer-motion";
import { ArrowUpRight, GraduationCap, Sparkles, FileText, ShieldCheck, LayoutTemplate } from "lucide-react";
import { SectionWrapper, SectionHeader } from "./SectionWrapper";

/*
  Secondary product grid — keeps Certification as the hero,
  while surfacing the other paid offerings in a low-key 5-card row.
  Copy was sourced directly from each product landing page.
*/
const products = [
  {
    title: "Mindfulness Teacher Certification",
    tagline: "Become a certified mindfulness meditation teacher — APA-approved CE, CPD, IMMA & IMTA accredited.",
    meta: "From $2,497 · 40 hours · 4–12 weeks avg",
    href: "https://certify.mindfulnessexercises.com/",
    icon: GraduationCap,
    cta: "Explore Certification",
  },
  {
    title: "MindfulPro AI",
    tagline: "Generate trauma-informed scripts, studio-quality audio, and client portals in minutes.",
    meta: "14-day free trial · No credit card",
    href: "https://mindfulpro.ai/",
    icon: Sparkles,
    cta: "Try Free for 14 Days",
  },
  {
    title: "200 Guided Meditation Scripts",
    tagline: "200 expert-written PDFs across 12 categories — open, read, guide. Commercial-use license included.",
    meta: "$97 · Instant download · 4.9/5 from 10,000+ pros",
    href: "https://scripts.mindfulnessexercises.com/",
    icon: FileText,
    cta: "Get the Script Library",
  },
  {
    title: "Trauma-Sensitive Mindfulness Certification",
    tagline: "A 15-hour professional certification to recognize trauma responses and teach within ethical scope.",
    meta: "$297 · CPD & IMMA accredited · 30-day guarantee",
    href: "https://trauma.mindfulnessexercises.com/",
    icon: ShieldCheck,
    cta: "View Trauma Certification",
  },
  {
    title: "The Brandable Mindfulness Curriculum",
    tagline: "10 done-for-you sessions with 400+ slides, scripts, and workbooks you can brand as your own.",
    meta: "Lifetime access · Commercial license · Fully editable",
    href: "https://curriculum.mindfulnessexercises.com/",
    icon: LayoutTemplate,
    cta: "See the Curriculum",
  },
];

export function MoreWaysToGrow() {
  return (
    <SectionWrapper id="programs" background="alternate" ariaLabel="Tools and Programs">
      <SectionHeader
        eyebrow="Tools & Programs"
        title="More ways to grow your practice"
        subtitle="Beyond the flagship certification, these are the tools, scripts, and programs trusted by mindfulness professionals worldwide."
      />

      <div className="mt-10 grid gap-5 md:gap-6 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product, idx) => {
          const Icon = product.icon;
          return (
            <motion.a
              key={product.title}
              href={product.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="group flex flex-col h-full p-5 lg:p-6 bg-card border border-border rounded-xl hover:border-primary/40 hover:shadow-md transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <Icon className="w-5 h-5" aria-hidden="true" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all duration-200" aria-hidden="true" />
              </div>

              <h3 className="font-serif text-lg font-semibold text-foreground leading-snug mb-2">
                {product.title}
              </h3>
              <p className="text-body-sm text-muted-foreground flex-1">
                {product.tagline}
              </p>

              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-caption text-muted-foreground mb-2">{product.meta}</p>
                <span className="text-sm font-medium text-primary group-hover:underline underline-offset-4">
                  {product.cta} →
                </span>
              </div>
            </motion.a>
          );
        })}
      </div>
    </SectionWrapper>
  );
}
