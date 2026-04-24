import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Users, FileText, Award, Quote } from "lucide-react";
import { SectionWrapper, SectionHeader } from "./SectionWrapper";

/*
  Intent-led callouts with a proof block directly under each CTA.
  Proof = audience, outcomes, curriculum/licensing details, and a real
  testimonial sourced from each product's landing page.
  Cert is featured (98% of revenue) and shown wider/first.
*/
type Product = {
  intent: string;
  label: string;
  description: string;
  href: string;
  cta: string;
  proof: {
    audience: string[];
    outcomes: string[];
    details: string[];
    review: { quote: string; author: string; role: string; image?: string };
  };
  featured?: boolean;
};

const products: Product[] = [
  {
    intent: "I want to teach mindfulness",
    label: "Get Certified",
    description:
      "Earn the Certified Mindfulness Meditation Teacher (CMMT) credential — APA-approved CE, CPD, IMMA & IMTA accredited.",
    href: "https://certify.mindfulnessexercises.com/",
    cta: "Start Certification — from $2,497",
    featured: true,
    proof: {
      audience: [
        "Therapists, counselors, coaches, yoga teachers, educators",
        "2,000+ certified graduates across 30+ countries",
      ],
      outcomes: [
        "Use 'CMMT' after your name with a verified LinkedIn badge",
        "Lead MBSR-informed programs in clinical, corporate & community settings",
        "Listed on the public graduate directory",
      ],
      details: [
        "40 hours · self-paced · lifetime access · no renewal fees",
        "10-week curriculum + 30 training videos + workbook + 200 scripts",
        "Monthly live workshops with Gabor Maté, Sharon Salzberg, Rick Hanson & more",
      ],
      review: {
        quote:
          "Sean is a wonderful teacher, well practiced in the teachings of mindfulness and compassion, dedicated and thoughtful.",
        author: "Jack Kornfield",
        role: "Renowned Mindfulness Teacher · Founder, Spirit Rock",
        image: "https://scripts.mindfulnessexercises.com/assets/jack-BrsJ41Pt.png",
      },
    },
  },
  {
    intent: "I need ready-to-teach material",
    label: "Get the Curriculum",
    description:
      "10 done-for-you sessions with 400+ brandable slides, scripts, and workbooks — start teaching this week.",
    href: "https://curriculum.mindfulnessexercises.com/",
    cta: "Browse the Curriculum",
    proof: {
      audience: [
        "Therapists, coaches, yoga teachers, corporate facilitators",
        "No certification required to teach with these materials",
      ],
      outcomes: [
        "Run multi-week group programs or standalone workshops",
        "Brand every slide and workbook with your own logo",
        "Save weeks of session-prep time",
      ],
      details: [
        "10 facilitator scripts · 400+ slides · 10 student workbooks",
        "Plus: 200 meditation scripts, 300 worksheets, 10 teacher deep-dives",
        "Commercial license · fully editable · lifetime access · Adult/Teen/Bundle",
      ],
      review: {
        quote:
          "I went from feeling unsure to leading group sessions confidently within a week. The scripts gave me structure while still letting me bring my own voice.",
        author: "Sarah A.",
        role: "Therapist",
      },
    },
  },
  {
    intent: "I want to teach trauma-sensitively",
    label: "Trauma-Sensitive Training",
    description:
      "A 15-hour certification to recognize trauma responses, modify practices, and teach within ethical scope.",
    href: "https://trauma.mindfulnessexercises.com/",
    cta: "Begin Trauma Training — $297",
    proof: {
      audience: [
        "Mindfulness & yoga teachers, coaches, therapists, healthcare educators",
        "Anyone with a regular practice who wants to support others responsibly",
      ],
      outcomes: [
        "Recognize hyperarousal, hypoarousal & dissociation in real time",
        "Modify body scans, breath work & sits with opt-out language",
        "Make confident referrals — knowing exactly when to refer out",
      ],
      details: [
        "4 expert-led modules · 62-page workbook · 3 ready-to-use scripts",
        "Masterclasses with David Treleaven, Willoughby Britton & Chris Germer",
        "CPD & IMMA accredited · 30-day guarantee · no renewal fees",
      ],
      review: {
        quote:
          "Having collaborated with Sean Fargo, I can attest that he is a visionary who brings scope, insight and compassion to his teaching and support of others on the path of meditation.",
        author: "Gabor Maté",
        role: "M.D. · Author, The Myth of Normal",
        image: "https://certify.mindfulnessexercises.com/assets/gabor-mate-BQza_1r2.png",
      },
    },
  },
  {
    intent: "I just need meditation scripts",
    label: "Get the Scripts",
    description:
      "200 expert-written guided meditation scripts across 12 categories — open, read, guide.",
    href: "https://scripts.mindfulnessexercises.com/",
    cta: "Get the Script Library — $97",
    proof: {
      audience: [
        "Therapists, coaches, yoga instructors, retreat & workshop leaders",
        "Trusted by 10,000+ professionals · 4.9/5 rating",
      ],
      outcomes: [
        "Save 2+ hours per week on session prep",
        "Guide with confidence in 1:1, group, corporate or retreat settings",
        "Use in paid sessions, recordings, courses & email sequences",
      ],
      details: [
        "200 PDFs across 12 categories · 3–30 min sessions · trauma-informed",
        "Commercial-use license included · master index · natural pacing built in",
        "One-time payment · 60-day refund · lifetime updates",
      ],
      review: {
        quote:
          "I save 2+ hours every week on session prep. Last month's anxiety series got the most positive feedback I've ever received.",
        author: "Veronica Lebednik",
        role: "Yoga Teacher · Guides 10-min meditations in class",
      },
    },
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.06, ease: "easeOut" as const },
  }),
};

function ProofList({
  icon: Icon,
  label,
  items,
}: {
  icon: typeof Users;
  label: string;
  items: string[];
}) {
  return (
    <div>
      <p className="flex items-center gap-2 text-eyebrow text-muted-foreground mb-2">
        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
        {label}
      </p>
      <ul className="space-y-1.5" role="list">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-body-sm text-foreground/80 leading-relaxed">
            <CheckCircle2 className="h-3.5 w-3.5 mt-1 text-primary/70 shrink-0" aria-hidden="true" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ProductCallouts() {
  return (
    <SectionWrapper
      background="primary"
      id="product-callouts"
      ariaLabel="Find the right program for your goal"
    >
      <SectionHeader
        eyebrow="Find Your Next Step"
        title="What are you here to do?"
        subtitle="Pick the goal that fits — see the proof, then go straight to the program built for it."
      />

      <div
        className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6"
        data-track-cta="product_callouts"
        data-track-cta-location="homepage_product_callouts"
      >
        {products.map((p, i) => (
          <motion.article
            key={p.intent}
            custom={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={cardVariants}
            className={`group flex flex-col bg-card border rounded-xl overflow-hidden transition-all duration-200 hover:shadow-card-hover ${
              p.featured
                ? "border-primary/30 ring-1 ring-primary/[0.08] shadow-elevated"
                : "border-border hover:border-primary/30"
            }`}
          >
            {/* Header / primary CTA */}
            <a
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              data-track-cta-label={p.label}
              className="p-6 lg:p-7 border-b border-border hover:bg-accent/30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <p className="text-eyebrow text-primary mb-2">{p.label}</p>
              <h3 className="font-serif text-xl lg:text-2xl font-semibold text-card-foreground leading-snug mb-2">
                “{p.intent}”
              </h3>
              <p className="text-body-sm text-muted-foreground leading-relaxed mb-4">
                {p.description}
              </p>
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary group-hover:gap-3 transition-all">
                {p.cta}
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
              </span>
            </a>

            {/* Proof block — directly under the primary CTA */}
            <div className="p-6 lg:p-7 space-y-5 bg-[hsl(var(--section-alternate))]/40">
              <ProofList icon={Users} label="Who it's for" items={p.proof.audience} />
              <ProofList icon={Award} label="What you'll achieve" items={p.proof.outcomes} />
              <ProofList icon={FileText} label="What's included" items={p.proof.details} />

              <figure className="flex gap-3 border-l-2 border-primary/40 pl-4 mt-1">
                {p.proof.review.image && (
                  <img
                    src={p.proof.review.image}
                    alt={`Portrait of ${p.proof.review.author}`}
                    loading="lazy"
                    className="w-14 h-14 rounded-full object-cover bg-muted shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <Quote className="h-4 w-4 text-primary/50 mb-1.5" aria-hidden="true" />
                  <blockquote className="text-body-sm text-foreground/85 italic leading-relaxed">
                    “{p.proof.review.quote}”
                  </blockquote>
                  <figcaption className="mt-2 text-caption text-muted-foreground">
                    <span className="font-medium text-foreground/80">{p.proof.review.author}</span>
                    <span className="mx-1.5">·</span>
                    {p.proof.review.role}
                  </figcaption>
                </div>
              </figure>
            </div>
          </motion.article>
        ))}
      </div>
    </SectionWrapper>
  );
}
