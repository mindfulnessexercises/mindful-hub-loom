const footerLinks = {
  Resources: ["Guided Meditations", "Breathing Exercises", "Mindfulness Articles", "Free Ebook"],
  Training: ["Certification Programs", "MBSR Training", "CE Credits", "For Organizations"],
  Community: ["Live Events", "Teacher Directory", "Blog", "Newsletter"],
  Company: ["About Us", "Contact", "Privacy Policy", "Terms of Service"],
};

export function Footer() {
  return (
    <footer className="border-t border-border bg-[hsl(var(--section-alternate))]">
      <div className="container mx-auto py-14">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <a href="/" className="font-serif text-lg font-semibold text-foreground">
              Mindfulness Exercises
            </a>
            <p className="text-body-sm text-muted-foreground mt-3">
              Free mindfulness resources and professional training for a more mindful world.
            </p>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-sans text-sm font-semibold text-foreground mb-4">{category}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-body-sm text-muted-foreground hover:text-foreground transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-caption text-muted-foreground">
            © {new Date().getFullYear()} Mindfulness Exercises. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-caption text-muted-foreground hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="text-caption text-muted-foreground hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="text-caption text-muted-foreground hover:text-foreground transition-colors">Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
