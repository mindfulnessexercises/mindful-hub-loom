import { motion } from "framer-motion";
import { Shield, Users, BookOpen, Award } from "lucide-react";

const trustItems = [
  { icon: BookOpen, label: "3,000+ Exercises", note: "verify before publishing" },
  { icon: Users, label: "200+ Expert Teachers", note: "verify before publishing" },
  { icon: Shield, label: "CE-Accredited Programs" },
  { icon: Award, label: "Trusted by Professionals Worldwide", note: "verify before publishing" },
];

export function TrustRibbon() {
  return (
    <div className="border-y border-border/60 bg-[hsl(var(--section-alternate))]">
      <div className="container mx-auto py-5">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4"
        >
          {trustItems.map((item) => (
            <div key={item.label} className="flex items-center gap-2.5 text-muted-foreground">
              <item.icon className="h-4 w-4 text-primary/70 shrink-0" />
              <span className="text-body-sm font-medium whitespace-nowrap">{item.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
