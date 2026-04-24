import { useState } from "react";
import { Menu, X, Search as SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo-mindfulness-exercises.png";
import { SiteSearchBar } from "@/components/wp/SiteSearchBar";

const navLinks = [
  { label: "Free Exercises", href: "#resources" },
  { label: "Blog", href: "/blog" },
  { label: "Get Certified", href: "https://certify.mindfulnessexercises.com/", external: true },
  { label: "Live Events", href: "#events" },
  { label: "About", href: "#authority" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/92 backdrop-blur-xl">
      <nav className="container mx-auto flex h-14 items-center justify-between" aria-label="Main navigation">
        {/* Logo */}
        <a href="/" className="flex items-center">
          <img
            src={logo}
            alt="Mindfulness Exercises"
            width="180"
            height="32"
            className="h-7 sm:h-8 w-auto"
          />
        </a>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                {...(link.external ? { target: "_blank", rel: "noopener" } : {})}
                className="text-[0.8125rem] font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm px-1 py-0.5"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={() => setSearchOpen((s) => !s)}
            aria-label="Search the site"
            aria-expanded={searchOpen}
            className="h-9 w-9 inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <SearchIcon className="h-4 w-4" />
          </button>
          <Button variant="ghost" size="sm" className="text-[0.8125rem] font-medium h-9 px-4 text-muted-foreground hover:text-foreground min-w-[44px]">
            Log In
          </Button>
          <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 text-xs font-semibold shadow-soft min-w-[44px]" asChild>
            <a href="https://certify.mindfulnessexercises.com/" target="_blank" rel="noopener">Get Certified</a>
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center text-foreground rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Desktop search dropdown */}
      {searchOpen && (
        <div className="hidden md:block border-t border-border/50 bg-background/95 backdrop-blur-xl">
          <div className="container mx-auto py-3">
            <SiteSearchBar
              size="md"
              autoFocus
              placeholder="Search articles, exercises, scripts…"
              onSubmitted={() => setSearchOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Mobile menu */}
      {mobileOpen && (
        <div id="mobile-menu" className="md:hidden border-t border-border/50 bg-background px-5 pb-6 pt-4" role="navigation" aria-label="Mobile navigation">
          <div className="mb-4">
            <SiteSearchBar
              size="md"
              placeholder="Search…"
              onSubmitted={() => setMobileOpen(false)}
            />
          </div>
          <ul className="space-y-1">
            {navLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  {...(link.external ? { target: "_blank", rel: "noopener" } : {})}
                  className="text-body text-foreground block font-medium py-3 px-2 rounded-md hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[44px] flex items-center"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-col gap-3">
            <Button variant="outline" className="w-full border-border h-11">Log In</Button>
            <Button className="w-full bg-primary text-primary-foreground shadow-elevated h-11" asChild>
              <a href="https://certify.mindfulnessexercises.com/" target="_blank" rel="noopener">Get Certified</a>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
