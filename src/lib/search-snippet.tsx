import { Fragment, type ReactNode } from "react";

/**
 * Build a contextual snippet around the first match of `query` in `text`.
 * Returns null if no match (caller can fall back to a plain excerpt).
 *
 * - Centers ~`radius` chars around the first match.
 * - Adds ellipses when truncated at either end.
 * - Highlights ALL occurrences of any whitespace-separated term in `query`.
 */
export function buildMatchSnippet(
  text: string,
  query: string,
  opts: { radius?: number; maxLen?: number } = {}
): { node: ReactNode; matched: boolean } | null {
  const clean = (text || "").replace(/\s+/g, " ").trim();
  if (!clean) return null;

  const terms = (query || "")
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length >= 2);

  if (terms.length === 0) {
    return { node: clean.slice(0, opts.maxLen ?? 200), matched: false };
  }

  const lower = clean.toLowerCase();
  const radius = opts.radius ?? 90;
  const maxLen = opts.maxLen ?? 220;

  // Find first match position across any term.
  let firstIdx = -1;
  let firstLen = 0;
  for (const term of terms) {
    const idx = lower.indexOf(term);
    if (idx !== -1 && (firstIdx === -1 || idx < firstIdx)) {
      firstIdx = idx;
      firstLen = term.length;
    }
  }

  if (firstIdx === -1) {
    // No match — return a leading slice as a non-matched fallback.
    return { node: clean.slice(0, maxLen) + (clean.length > maxLen ? "…" : ""), matched: false };
  }

  // Window around first match.
  const start = Math.max(0, firstIdx - radius);
  const end = Math.min(clean.length, firstIdx + firstLen + radius);
  let windowText = clean.slice(start, end);
  if (start > 0) windowText = "…" + windowText;
  if (end < clean.length) windowText = windowText + "…";
  if (windowText.length > maxLen) windowText = windowText.slice(0, maxLen) + "…";

  return { node: highlightTerms(windowText, terms), matched: true };
}

/**
 * Wrap each occurrence of any term (case-insensitive) in <mark>.
 * Safe: operates on already-stripped plain text, so no HTML injection risk.
 */
export function highlightTerms(text: string, terms: string[]): ReactNode {
  const safeTerms = terms.filter(Boolean).map((t) => t.toLowerCase());
  if (safeTerms.length === 0) return text;

  // Build a single regex matching any term, escaping regex metachars.
  const escaped = safeTerms
    .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .sort((a, b) => b.length - a.length); // longer first to avoid partial overlap
  const re = new RegExp(`(${escaped.join("|")})`, "gi");

  const parts = text.split(re);
  return (
    <>
      {parts.map((part, i) => {
        if (!part) return null;
        const isMatch = safeTerms.includes(part.toLowerCase());
        return isMatch ? (
          <mark key={i} className="bg-primary/15 text-foreground rounded-sm px-0.5">
            {part}
          </mark>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        );
      })}
    </>
  );
}
