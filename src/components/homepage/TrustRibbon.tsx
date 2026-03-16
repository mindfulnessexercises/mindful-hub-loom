import { motion } from "framer-motion";
import { Shield, Users, BookOpen, Award } from "lucide-react";

/*
  NOTE: Items marked [verify before publishing] use placeholder numbers.
  Replace with real, verified figures before going live.
*/
const trustItems = [
  { icon: BookOpen, value: "3,000+", label: "Free Exercises" },        // verify before publishing
  { icon: Users, value: "200+", label: "Expert Teachers" },             // verify before publishing
  { icon: Shield, value: "CE", label: "Accredited Programs" },
  { icon: Award, value: "15+", label: "Years of Practice" },            // verify before publishing
];

export function TrustRibbon() {
  return (
    <div className="border-y border-border/60 bg-[hsl(var(--section-alternate))]">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center py-5"
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-8 gap-y-4 sm:gap-x-14 lg:gap-x-18">
            {trustItems.map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/[0.08] border border-primary/[0.08] flex items-center justify-center shrink-0">
                  <item.icon className="h-[18px] w-[18px] text-primary/70" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-foreground leading-none tracking-tight font-serif">
                    {item.value}
                  </span>
                  <span className="text-caption text-muted-foreground mt-0.5 font-medium">
                    {item.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
