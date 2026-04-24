// Rewrites links inside WordPress-rendered HTML so anything pointing back to
// mindfulnessexercises.com that we ALSO render here on Lovable becomes an
// in-app relative path. Anything we don't own (commerce, account, admin,
// subdomains, files) is left alone and forced to open in a new tab so the
// user clearly knows they're leaving.
//
// Usage:
//   const html = rewriteWpHtml(post.content.rendered);
//   <div dangerouslySetInnerHTML={{ __html: html }} />
//
// Pair with `attachWpLinkInterceptor` on the same container so rewritten
// internal links use SPA navigation instead of full page reloads.

import type { NavigateFunction } from "react-router-dom";
import { isReservedSlug } from "./reserved-slugs";

const WP_HOSTS = new Set([
  "mindfulnessexercises.com",
  "www.mindfulnessexercises.com",
]);

// Path prefixes we explicitly do NOT own — leave external.
const EXTERNAL_PREFIXES = [
  "/cart",
  "/checkout",
  "/my-account",
  "/account",
  "/wp-admin",
  "/wp-login",
  "/wp-content", // assets (images/PDFs) live here
  "/wp-json",
  "/shop",
  "/product",
  "/product-category",
  "/feed",
  "/sitemap",
];

// File-extension test — keep media/document links external.
const FILE_EXT_RE = /\.(?:pdf|zip|mp3|mp4|wav|m4a|jpg|jpeg|png|gif|svg|webp|doc|docx|xls|xlsx|ppt|pptx)(?:$|\?)/i;

/**
 * Map a mindfulnessexercises.com URL path to an in-app relative path, or
 * return null to keep it external. Pure function — easy to unit test.
 */
export function mapWpPathToAppPath(pathname: string): string | null {
  // Normalize: ensure leading slash, strip trailing slash (except root).
  let p = pathname || "/";
  if (!p.startsWith("/")) p = "/" + p;
  if (p.length > 1 && p.endsWith("/")) p = p.slice(0, -1);

  if (FILE_EXT_RE.test(p)) return null;
  for (const prefix of EXTERNAL_PREFIXES) {
    if (p === prefix || p.startsWith(prefix + "/")) return null;
  }

  // Root → home
  if (p === "" || p === "/") return "/";

  // /blog or /blog/<slug>
  if (p === "/blog") return "/blog";
  if (p.startsWith("/blog/")) {
    const slug = p.slice("/blog/".length).split("/")[0];
    return slug ? `/${slug}` : "/blog";
  }

  // /category/<slug>[/...]
  if (p.startsWith("/category/")) {
    const slug = p.slice("/category/".length).split("/")[0];
    return slug ? `/category/${slug}` : null;
  }

  // /library passthrough
  if (p === "/library" || p.startsWith("/library/")) return p;

  // Otherwise treat as a top-level slug (post or page) — but only if it's a
  // single segment AND not a reserved app route (those are handled above).
  const segments = p.slice(1).split("/").filter(Boolean);
  if (segments.length === 1) {
    const slug = segments[0];
    if (isReservedSlug(slug)) return `/${slug}`;
    return `/${slug}`;
  }

  // Multi-segment path we don't recognize — leave external to be safe.
  return null;
}

/**
 * Walks an HTML string and rewrites <a href> attributes. Internal links get
 * relative hrefs (and `data-internal="1"` so the click interceptor can
 * recognize them); external WP links get `target="_blank"` + `rel`.
 */
export function rewriteWpHtml(html: string): string {
  if (!html || typeof window === "undefined" || typeof DOMParser === "undefined") {
    return html;
  }
  const doc = new DOMParser().parseFromString(html, "text/html");
  const anchors = doc.querySelectorAll("a[href]");
  anchors.forEach((a) => {
    const raw = a.getAttribute("href") ?? "";
    if (!raw || raw.startsWith("#") || raw.startsWith("mailto:") || raw.startsWith("tel:")) return;

    let url: URL | null = null;
    try {
      url = new URL(raw, "https://mindfulnessexercises.com");
    } catch {
      return;
    }
    if (!WP_HOSTS.has(url.hostname.toLowerCase())) return;

    const mapped = mapWpPathToAppPath(url.pathname);
    if (mapped) {
      const internal = mapped + url.search + url.hash;
      a.setAttribute("href", internal);
      a.setAttribute("data-internal", "1");
      a.removeAttribute("target");
    } else {
      // External — make it explicit.
      a.setAttribute("target", "_blank");
      const rel = (a.getAttribute("rel") || "").split(/\s+/).filter(Boolean);
      if (!rel.includes("noopener")) rel.push("noopener");
      if (!rel.includes("noreferrer")) rel.push("noreferrer");
      a.setAttribute("rel", rel.join(" "));
    }
  });
  return doc.body.innerHTML;
}

/**
 * Attaches a delegated click handler that intercepts rewritten internal
 * links inside `container` and routes them through React Router. Returns
 * a teardown function suitable for a `useEffect` cleanup.
 */
export function attachWpLinkInterceptor(
  container: HTMLElement | null,
  navigate: NavigateFunction,
): () => void {
  if (!container) return () => {};
  const onClick = (e: MouseEvent) => {
    // Respect modifier keys / non-primary clicks so users can still open in new tab.
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const target = (e.target as HTMLElement | null)?.closest?.("a[data-internal='1']") as HTMLAnchorElement | null;
    if (!target) return;
    const href = target.getAttribute("href");
    if (!href || !href.startsWith("/")) return;
    e.preventDefault();
    navigate(href);
  };
  container.addEventListener("click", onClick);
  return () => container.removeEventListener("click", onClick);
}
