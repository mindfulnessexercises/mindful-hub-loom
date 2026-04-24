import { useState } from "react";
import { Check, Link2, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { trackEvent } from "@/lib/analytics";

/**
 * "Share this view" action for the Library. Builds a compact canonical URL
 * pointing at exactly the current tab/category/sort/search/page, and offers
 * one-click copy + the native Web Share sheet on supported devices.
 *
 * Why we don't use a true URL shortener:
 *   - Real shortening (e.g. bit.ly, custom redirect table) requires either a
 *     third-party API key or a server endpoint. The current site is fully
 *     client-side and we don't want to take an external dependency or stand
 *     up backend infra just for share links.
 *   - Library URLs are already short single-path query strings. To minimise
 *     them further we drop every default value (tab=posts, sort=newest,
 *     page=1) before serialising — so a "newest articles" share is just
 *     /library, and a category share is /library?cat=42. This is the
 *     shortest correct URL without a redirect.
 *
 * If you later add a backend you can swap `buildShortUrl` for an API call
 * that POSTs the canonical URL and returns a /s/:id alias.
 */

type Tab = "posts" | "pages";
type Sort = string;

export interface ShareLibraryViewProps {
  tab: Tab;
  category?: number;
  sort: Sort;
  /** Default sort value — used to omit the param when it equals default. */
  defaultSort: Sort;
  search?: string;
  page: number;
}

/**
 * Build the shortest URL that still re-creates the exact view. Param order is
 * stable so two identical views always produce identical URLs.
 */
function buildShortUrl(input: ShareLibraryViewProps): string {
  const params = new URLSearchParams();
  // Order matters for canonicalisation: tab → cat → q → sort → page.
  if (input.tab !== "posts") params.set("tab", input.tab);
  if (input.category != null) params.set("cat", String(input.category));
  if (input.search?.trim()) params.set("q", input.search.trim());
  if (input.sort && input.sort !== input.defaultSort) params.set("sort", input.sort);
  if (input.page > 1) params.set("page", String(input.page));

  const qs = params.toString();
  const path = qs ? `/library?${qs}` : "/library";
  return typeof window !== "undefined" ? `${window.location.origin}${path}` : path;
}

export function ShareLibraryView(props: ShareLibraryViewProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const url = buildShortUrl(props);

  const sharePayload = {
    title: "Mindfulness Exercises — Library",
    text: "Check out this view of the Mindfulness Exercises library.",
    url,
  };

  const trackShare = (method: string, success: boolean) => {
    trackEvent("library_view_shared", {
      method,
      success,
      tab: props.tab,
      category: props.category,
      sort: props.sort,
      has_search: Boolean(props.search?.trim()),
      page: props.page,
      url_length: url.length,
    });
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
      toast({ title: "Link copied", description: "Share it anywhere." });
      trackShare("clipboard", true);
    } catch {
      toast({
        title: "Could not copy",
        description: "Copy the link manually from the field.",
        variant: "destructive",
      });
      trackShare("clipboard", false);
    }
  };

  // Native share sheet — only show when the device actually supports it
  // (mobile + Safari mostly). Desktop falls back to the popover with copy.
  const canNativeShare =
    typeof navigator !== "undefined" && typeof navigator.share === "function";

  const nativeShare = async () => {
    try {
      await navigator.share(sharePayload);
      trackShare("native", true);
    } catch (err) {
      // User cancellation throws AbortError — don't toast in that case.
      if ((err as DOMException)?.name !== "AbortError") {
        trackShare("native", false);
      }
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-9 min-h-[36px] gap-1.5"
          aria-label="Share this Library view"
        >
          <Share2 className="h-3.5 w-3.5" aria-hidden />
          Share
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-4 space-y-3">
        <div>
          <p className="text-sm font-semibold text-foreground">Share this view</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            A direct link to exactly what you&apos;re looking at — tab, category,
            sort, search, and page.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Input
            readOnly
            value={url}
            onFocus={(e) => e.currentTarget.select()}
            className="h-9 text-xs font-mono"
            aria-label="Shareable link"
          />
          <Button
            type="button"
            size="sm"
            onClick={copy}
            className="h-9 min-h-[36px] shrink-0 gap-1.5"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5" aria-hidden /> Copied
              </>
            ) : (
              <>
                <Link2 className="h-3.5 w-3.5" aria-hidden /> Copy
              </>
            )}
          </Button>
        </div>
        {canNativeShare && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={nativeShare}
            className="w-full h-9 min-h-[36px] gap-1.5"
          >
            <Share2 className="h-3.5 w-3.5" aria-hidden /> Open share sheet…
          </Button>
        )}
      </PopoverContent>
    </Popover>
  );
}
