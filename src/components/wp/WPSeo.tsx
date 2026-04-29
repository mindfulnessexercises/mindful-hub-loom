import { useEffect } from "react";
import { absoluteUrl } from "@/lib/site-config";

interface SeoProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  type?: "article" | "website";
  jsonLd?: Record<string, unknown>;
  /** Pagination link for the previous page in a series (rel="prev"). */
  prevUrl?: string;
  /** Pagination link for the next page in a series (rel="next"). */
  nextUrl?: string;
  /**
   * Tell crawlers not to index this view (e.g. search result pages, filtered
   * permutations, internal-only states). Defaults to false.
   */
  noindex?: boolean;
}

function setMeta(selector: string, attr: string, value: string) {
  let el = document.head.querySelector<HTMLMetaElement | HTMLLinkElement>(selector);
  if (!el) {
    if (selector.startsWith("link")) {
      el = document.createElement("link");
      const rel = selector.match(/rel="([^"]+)"/)?.[1];
      if (rel) (el as HTMLLinkElement).rel = rel;
    } else {
      el = document.createElement("meta");
      const name = selector.match(/name="([^"]+)"/)?.[1];
      const prop = selector.match(/property="([^"]+)"/)?.[1];
      if (name) (el as HTMLMetaElement).name = name;
      if (prop) (el as HTMLMetaElement).setAttribute("property", prop);
    }
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
}

/** Remove a tag entirely if it exists. Use for tags that may be absent. */
function removeMeta(selector: string) {
  const el = document.head.querySelector(selector);
  if (el) el.remove();
}

/**
 * Set or remove a <link rel="prev|next"> tag. Google deprecated rel=prev/next
 * as a strict ranking signal, but Bing and other crawlers still consume them
 * for paginated series — and they're explicit, harmless hints to indicate the
 * relationship between paginated pages.
 */
function setOrRemoveLinkRel(rel: "prev" | "next", href?: string) {
  const selector = `link[rel="${rel}"]`;
  if (href) setMeta(selector, "href", href);
  else removeMeta(selector);
}

export function WPSeo({
  title,
  description,
  canonical,
  ogImage,
  type = "article",
  jsonLd,
  prevUrl,
  nextUrl,
  noindex = false,
}: SeoProps) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title;

    setMeta('meta[name="description"]', "content", description);
    setMeta('meta[property="og:title"]', "content", title);
    setMeta('meta[property="og:description"]', "content", description);
    setMeta('meta[property="og:type"]', "content", type);
    if (ogImage) setMeta('meta[property="og:image"]', "content", ogImage);
    if (canonical) {
      // Always emit an absolute URL — Google requires it for the canonical
      // signal to be authoritative across deployments. Callers may pass a
      // root-relative path for convenience; we promote it here.
      const absCanonical = absoluteUrl(canonical);
      setMeta('link[rel="canonical"]', "href", absCanonical);
      setMeta('meta[property="og:url"]', "content", absCanonical);
    }
    setMeta('meta[name="twitter:title"]', "content", title);
    setMeta('meta[name="twitter:description"]', "content", description);
    if (ogImage) setMeta('meta[name="twitter:image"]', "content", ogImage);

    // Robots: only emit a tag when we actually want noindex; otherwise leave
    // the document at its default (indexable) state and remove any stale tag.
    if (noindex) {
      setMeta('meta[name="robots"]', "content", "noindex, follow");
    } else {
      removeMeta('meta[name="robots"]');
    }

    setOrRemoveLinkRel("prev", prevUrl);
    setOrRemoveLinkRel("next", nextUrl);

    let scriptEl: HTMLScriptElement | null = null;
    if (jsonLd) {
      scriptEl = document.createElement("script");
      scriptEl.type = "application/ld+json";
      scriptEl.text = JSON.stringify(jsonLd);
      scriptEl.setAttribute("data-wp-seo", "");
      document.head.appendChild(scriptEl);
    }

    return () => {
      document.title = prevTitle;
      if (scriptEl) scriptEl.remove();
      // Clean up tags that may not be set on the next view.
      removeMeta('link[rel="prev"]');
      removeMeta('link[rel="next"]');
      removeMeta('meta[name="robots"]');
    };
  }, [title, description, canonical, ogImage, type, jsonLd, prevUrl, nextUrl, noindex]);

  return null;
}
