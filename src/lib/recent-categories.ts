/**
 * Lightweight session-scoped tracker for the categories the visitor has
 * recently filtered the Library by. Used as an "intent signal" to bias
 * related-content recommendations toward what the user has actually been
 * exploring this session.
 *
 * Stored in `sessionStorage` (cleared when the tab closes) — this is an
 * ephemeral personalisation hint, not a long-lived profile, so it stays out
 * of `localStorage` to avoid cross-session implications and keep the privacy
 * surface tiny.
 */

const KEY = "lib:recent-cats:v1";
const MAX = 8;

export interface RecentCategoryEntry {
  id: number;
  slug: string;
  name: string;
  /** Epoch ms; newer = stronger signal. */
  ts: number;
}

function safeRead(): RecentCategoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.sessionStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (e): e is RecentCategoryEntry =>
        e &&
        typeof e.id === "number" &&
        typeof e.slug === "string" &&
        typeof e.name === "string" &&
        typeof e.ts === "number",
    );
  } catch {
    return [];
  }
}

function safeWrite(entries: RecentCategoryEntry[]): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(KEY, JSON.stringify(entries));
  } catch {
    /* sessionStorage unavailable or quota exceeded — silently ignore. */
  }
}

/** Return recent categories, newest first, optionally excluding one id. */
export function getRecentCategories(excludeId?: number): RecentCategoryEntry[] {
  const all = safeRead().sort((a, b) => b.ts - a.ts);
  return excludeId == null ? all : all.filter((e) => e.id !== excludeId);
}

/** Record a category visit. Dedupes by id and trims to {@link MAX}. */
export function recordRecentCategory(input: { id: number; slug: string; name: string }): void {
  const now = Date.now();
  const next = [
    { ...input, ts: now },
    ...safeRead().filter((e) => e.id !== input.id),
  ].slice(0, MAX);
  safeWrite(next);
}
