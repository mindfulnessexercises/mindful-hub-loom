const footerLinks = {
  "Free Resources": [
    { label: "Guided Meditations", href: "#resources" },
    { label: "Breathing Exercises", href: "#resources" },
    { label: "Mindfulness Articles", href: "#resources" },
    { label: "Free Ebook", href: "#ebook" },
    { label: "Full Library", href: "#resources" },
  ],
  "Professional Training": [
    { label: "Mindfulness Teacher Certification", href: "https://certify.mindfulnessexercises.com/" },
    { label: "MBSR-Informed Training", href: "https://certify.mindfulnessexercises.com/" },
    { label: "CE Credits & Policies", href: "/ce-policies" },
    { label: "For Organizations", href: "https://certify.mindfulnessexercises.com/" },
  ],
  Community: [
    { label: "Live Events", href: "#events" },
    { label: "Teacher Directory", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Newsletter", href: "#ebook" },
  ],
  About: [
    { label: "Our Mission", href: "#founder" },
    { label: "Faculty", href: "#authority" },
    { label: "Contact Us", href: "#" },
    { label: "Careers", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border bg-[hsl(var(--section-alternate))]" role="contentinfo">
      <div className="container mx-auto py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 lg:gap-10">
          {/* Brand column */}
          <div className="col-span-2">
            <a href="/" className="font-serif text-lg font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm inline-block">
              Mindfulness Exercises
            </a>
            <p className="text-body-sm text-muted-foreground mt-3 max-w-xs">
              Free mindfulness practices and APA-approved professional training — for a more mindful world.
            </p>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <nav key={category} aria-label={`${category} links`}>
              <p className="font-sans text-sm font-semibold text-foreground mb-4">{category}</p>
              <ul className="space-y-2.5" role="list">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-body-sm text-muted-foreground hover:text-foreground transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm py-1 inline-flex items-center min-h-[32px]"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="border-t border-border mt-10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-caption text-muted-foreground">
            © {new Date().getFullYear()} Mindfulness Exercises. All rights reserved.
          </p>
          <nav aria-label="Legal links" className="flex items-center gap-6">
            {[
              { label: "Privacy Policy", href: "#" },
              { label: "Terms of Service", href: "#" },
              { label: "Accessibility", href: "#" },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-caption text-muted-foreground hover:text-foreground transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm py-1"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
