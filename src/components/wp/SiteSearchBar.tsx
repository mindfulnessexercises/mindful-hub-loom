import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";

interface Props {
  initialValue?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  placeholder?: string;
  buttonLabel?: string;
  autoFocus?: boolean;
  onSubmitted?: () => void;
  /**
   * Identifier for analytics — where on the site this search bar lives
   * (e.g. "search_page_header", "navbar"). Used to attribute downstream
   * conversions to the upstream search intent. Defaults to "site_search".
   */
  source?: string;
}

export function SiteSearchBar({
  initialValue = "",
  className,
  size = "md",
  placeholder = "Search mindfulness exercises, articles, scripts…",
  buttonLabel = "Search",
  autoFocus,
  onSubmitted,
  source = "site_search",
}: Props) {
  const [value, setValue] = useState(initialValue);
  const navigate = useNavigate();

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const q = value.trim();
    if (!q) return;
    trackEvent("search_submitted", { query: q, source });
    navigate(`/search?q=${encodeURIComponent(q)}`);
    onSubmitted?.();
  };

  const heightClass = size === "lg" ? "h-12" : size === "sm" ? "h-9" : "h-11";
  const inputPad = size === "lg" ? "pl-11 text-base" : "pl-9 text-sm";
  const iconPos = size === "lg" ? "left-3.5 h-4.5 w-4.5" : "left-3 h-4 w-4";

  return (
    <form onSubmit={onSubmit} className={cn("flex gap-2", className)} role="search">
      <div className="relative flex-1">
        <Search className={cn("absolute top-1/2 -translate-y-1/2 text-muted-foreground", iconPos)} aria-hidden />
        <Input
          type="search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          aria-label="Search Mindfulness Exercises"
          autoFocus={autoFocus}
          className={cn("bg-card border-border", heightClass, inputPad)}
        />
      </div>
      <Button type="submit" size={size === "sm" ? "sm" : "default"} className={cn(heightClass, size === "lg" && "px-6")}>
        {buttonLabel}
      </Button>
    </form>
  );
}
