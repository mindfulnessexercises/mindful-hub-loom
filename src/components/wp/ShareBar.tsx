import { useState } from "react";
import { Check, Copy, Facebook, Linkedin, Mail, Share2, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";
import { useToast } from "@/hooks/use-toast";

interface ShareBarProps {
  title: string;
  url: string;
  /** "post" | "page" — surfaced in analytics so we can split engagement. */
  kind?: string;
}

/**
 * Compact share rail. Uses the native Web Share API on mobile when present,
 * and falls back to per-network buttons + copy-to-clipboard everywhere else.
 */
export function ShareBar({ title, url, kind = "post" }: ShareBarProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const fire = (network: string) =>
    trackEvent("post_shared", { network, url, kind, title });

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      fire("copy_link");
      toast({ title: "Link copied", description: "Share it anywhere." });
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      toast({
        title: "Couldn't copy",
        description: "Your browser blocked clipboard access.",
        variant: "destructive",
      });
    }
  };

  const onNativeShare = async () => {
    if (typeof navigator === "undefined" || !("share" in navigator)) return;
    try {
      await (navigator as Navigator & { share: (d: ShareData) => Promise<void> }).share({
        title,
        url,
      });
      fire("native_share");
    } catch {
      // user cancelled — ignore
    }
  };

  const enc = encodeURIComponent;
  const tw = `https://twitter.com/intent/tweet?text=${enc(title)}&url=${enc(url)}`;
  const fb = `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`;
  const li = `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`;
  const mail = `mailto:?subject=${enc(title)}&body=${enc(url)}`;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-medium text-muted-foreground mr-1">Share</span>

      {typeof navigator !== "undefined" && "share" in navigator && (
        <Button
          variant="outline"
          size="sm"
          className="h-9 sm:hidden"
          onClick={onNativeShare}
          aria-label="Share via your device"
        >
          <Share2 className="h-4 w-4" />
        </Button>
      )}

      <Button asChild variant="outline" size="sm" className="h-9 px-2.5">
        <a
          href={tw}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on X"
          onClick={() => fire("twitter")}
        >
          <Twitter className="h-4 w-4" />
        </a>
      </Button>
      <Button asChild variant="outline" size="sm" className="h-9 px-2.5">
        <a
          href={fb}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on Facebook"
          onClick={() => fire("facebook")}
        >
          <Facebook className="h-4 w-4" />
        </a>
      </Button>
      <Button asChild variant="outline" size="sm" className="h-9 px-2.5">
        <a
          href={li}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on LinkedIn"
          onClick={() => fire("linkedin")}
        >
          <Linkedin className="h-4 w-4" />
        </a>
      </Button>
      <Button asChild variant="outline" size="sm" className="h-9 px-2.5">
        <a href={mail} aria-label="Share via email" onClick={() => fire("email")}>
          <Mail className="h-4 w-4" />
        </a>
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="h-9"
        onClick={onCopy}
        aria-label="Copy link"
      >
        {copied ? (
          <>
            <Check className="h-4 w-4 mr-1.5" /> Copied
          </>
        ) : (
          <>
            <Copy className="h-4 w-4 mr-1.5" /> Copy link
          </>
        )}
      </Button>
    </div>
  );
}
