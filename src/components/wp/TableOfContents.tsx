import { useEffect, useState } from "react";
import { List } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TocItem } from "@/lib/reading";

/**
 * Auto-generated table of contents from the H2/H3 ids injected by
 * `extractToc`. Highlights the section currently in view via an
 * IntersectionObserver, and smooth-scrolls on click while updating the URL
 * hash so deep links work.
 */
export function TableOfContents({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = useState<string | null>(items[0]?.id ?? null);

  useEffect(() => {
    if (items.length === 0) return;
    const headings = items
      .map((i) => document.getElementById(i.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (headings.length === 0) return;

    // Margin offsets keep "active" tied to the heading nearest the top of
    // the reading viewport, not whatever happens to be intersecting at all.
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: [0, 1] },
    );
    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [items]);

  if (items.length < 3) return null;

  return (
    <nav aria-label="Table of contents" className="text-sm">
      <p className="text-eyebrow text-muted-foreground mb-3 inline-flex items-center gap-1.5">
        <List className="h-3.5 w-3.5" aria-hidden /> On this page
      </p>
      <ul className="space-y-1.5 border-l border-border">
        {items.map((item) => {
          const isActive = item.id === activeId;
          return (
            <li key={item.id} className={cn(item.level === 3 && "pl-3")}>
              <a
                href={`#${item.id}`}
                onClick={(e) => {
                  const target = document.getElementById(item.id);
                  if (!target) return;
                  e.preventDefault();
                  const top =
                    target.getBoundingClientRect().top + window.scrollY - 80;
                  window.scrollTo({ top, behavior: "smooth" });
                  history.replaceState(null, "", `#${item.id}`);
                  setActiveId(item.id);
                }}
                className={cn(
                  "block -ml-px border-l-2 pl-3 py-1 transition-colors leading-snug",
                  isActive
                    ? "border-primary text-foreground font-medium"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-border",
                )}
              >
                {item.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
