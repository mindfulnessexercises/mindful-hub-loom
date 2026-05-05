import { Link } from "react-router-dom";
import { BookOpen, Mail, CalendarDays, GraduationCap } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

type Audience = "individuals" | "professionals";

interface IntentPill {
  id: string;
  label: string;
  icon: typeof BookOpen;
  paths: Record<Audience, string>;
}

const PILLS: IntentPill[] = [
  {
    id: "free-resources",
    label: "Free Resources",
    icon: BookOpen,
    paths: {
      individuals: "/library?audience=individuals",
      professionals: "/library?audience=professionals",
    },
  },
  {
    id: "email-signup",
    label: "Email Signup",
    icon: Mail,
    paths: {
      individuals: "/free-mindfulness-e-books",
      professionals: "/free-mindfulness-e-books",
    },
  },
  {
    id: "live-events",
    label: "Live Events",
    icon: CalendarDays,
    paths: {
      individuals: "/#events",
      professionals: "/#events",
    },
  },
  {
    id: "certification",
    label: "Certification",
    icon: GraduationCap,
    paths: {
      individuals: "/best-mindfulness-certification-programs",
      professionals: "/best-mindfulness-certification-programs",
    },
  },
];

const handleClick = (pillId: string, audience: Audience, destination: string) => {
  try {
    trackEvent("intent_router_click", {
      pill_id: pillId,
      audience,
      destination,
    });
  } catch {
    /* no-op */
  }
};

export const IntentRouterStrip = () => {
  return (
    <section
      aria-label="Quick links by audience"
      className="border-y border-border/60 bg-muted/30"
    >
      <div className="container mx-auto px-4 py-6 md:py-8">
        <p className="mb-4 text-center font-sans text-xs uppercase tracking-[0.18em] text-muted-foreground md:text-sm">
          Jump to what you need
        </p>
        <ul className="mx-auto grid max-w-5xl grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {PILLS.map(({ id, label, icon: Icon, paths }) => (
            <li
              key={id}
              className="rounded-2xl border border-border/70 bg-background/80 p-3 shadow-sm backdrop-blur-sm transition-colors hover:border-primary/40"
            >
              <div className="mb-2 flex items-center gap-2 text-foreground">
                <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
                <span className="font-serif text-sm font-medium md:text-base">
                  {label}
                </span>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Link
                  to={paths.individuals}
                  onClick={() => handleClick(id, "individuals", paths.individuals)}
                  className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-full border border-border bg-background px-3 py-2 text-xs font-medium text-foreground transition-colors hover:border-primary hover:bg-primary/5 hover:text-primary md:text-sm"
                >
                  For me
                </Link>
                <Link
                  to={paths.professionals}
                  onClick={() => handleClick(id, "professionals", paths.professionals)}
                  className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-full bg-primary px-3 py-2 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 md:text-sm"
                >
                  For pros
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default IntentRouterStrip;
