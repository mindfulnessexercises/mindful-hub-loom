import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Free Resources", href: "#resources" },
  { label: "Training & Certification", href: "#certification" },
  { label: "Live Events", href: "#events" },
  { label: "About", href: "#authority" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/90 backdrop-blur-lg">
      <nav className="container mx-auto flex h-14 items-center justify-between">
        {/* Logo */}
        <a href="/" className="font-serif text-base font-semibold text-foreground tracking-tight">
          Mindfulness Exercises
        </a>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="text-body-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" size="sm" className="text-body-sm h-8">
            Log In
          </Button>
          <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 h-8 text-xs font-medium">
            Explore Programs
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border/40 bg-background px-5 pb-6 pt-4">
          <ul className="space-y-4">
            {navLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="text-body text-foreground block"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-col gap-3">
            <Button variant="outline" className="w-full">Log In</Button>
            <Button className="w-full bg-primary text-primary-foreground">Explore Programs</Button>
          </div>
        </div>
      )}
    </header>
  );
}
