import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

/**
 * Compact, semantic breadcrumb trail used at the top of every WP-rendered
 * post and page. The last item is the current page (no link).
 */
export function WPBreadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground">
      <ol className="flex flex-wrap items-center gap-1.5">
        <li>
          <Link
            to="/"
            className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
          >
            <Home className="h-3 w-3" aria-hidden /> Home
          </Link>
        </li>
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={`${item.label}-${idx}`} className="flex items-center gap-1.5">
              <ChevronRight className="h-3 w-3 text-muted-foreground/60" aria-hidden />
              {item.href && !isLast ? (
                <Link
                  to={item.href}
                  className="hover:text-foreground transition-colors line-clamp-1 max-w-[200px]"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className="text-foreground font-medium line-clamp-1 max-w-[260px]"
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
