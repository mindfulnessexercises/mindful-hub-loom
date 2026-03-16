import { motion } from "framer-motion";
import { Shield, Users, BookOpen, Award } from "lucide-react";
import { Separator } from "@/components/ui/separator";

/* 
  NOTE: Items marked [verify before publishing] use placeholder numbers.
  Replace with real, verified figures before going live.
*/
const trustItems = [
  { icon: BookOpen, label: "3,000+ Free Exercises" },       // verify before publishing
  { icon: Users, label: "200+ Expert Teachers" },            // verify before publishing
  { icon: Shield, label: "CE-Accredited Programs" },
  { icon: Award, label: "Trusted by Professionals Worldwide" }, // verify before publishing
];

export function TrustRibbon() {
  return (
    <div className="border-y border-border/50 bg-[hsl(var(--section-alternate))]">
      <div className="container mx-auto py-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-y-3"
        >
          {trustItems.map((item, i) => (
            <div key={item.label} className="flex items-center">
              <div className="flex items-center gap-2 px-4 sm:px-5">
                <item.icon className="h-4 w-4 text-primary/60 shrink-0" />
                <span className="text-body-sm font-medium text-muted-foreground whitespace-nowrap">
                  {item.label}
                </span>
              </div>
              {i < trustItems.length - 1 && (
                <Separator orientation="vertical" className="hidden sm:block h-4 bg-border/60" />
              )}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
