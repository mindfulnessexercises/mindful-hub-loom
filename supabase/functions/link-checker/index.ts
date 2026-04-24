// Lovable Cloud edge function: link checker for mindfulnessexercises.com.
//
// Two modes (server-side, to bypass browser CORS on cross-origin HEAD requests):
//
//   1) ?mode=scan&type=posts|pages&page=1&per_page=20
//      Pulls a page of WP posts/pages from the live WP REST API, parses the
//      rendered content for absolute links pointing at mindfulnessexercises.com
//      (or its `www.` / `http://` variants) and returns the list of source
//      pages with the external links they contain. Each link is returned with
//      its raw href, normalized pathname, and anchor text. Cheap — no upstream
//      HEAD checks happen here, so the UI can render quickly while it queues
//      check requests.
//
//   2) POST  body: { urls: string[] }   mode=check
//      Performs HEAD (with GET fallback for hosts that 405 HEAD) against each
//      URL, in bounded parallel. Returns { url, status, ok, redirectedTo,
//      mismatch, error } per URL. "mismatch" is true when:
//        - the response final URL host differs from the requested host
//        - OR the final pathname differs from the requested pathname
//          (ignoring trailing slashes / fragments)
//      That catches both broken (4xx/5xx) and silently-rewritten links.
//
// Why a separate edge function instead of folding into wp-proxy?
//   - Different cache semantics: scan results are cheap to recompute and we
//     don't want them poisoning the wp-proxy cache.
//   - Outbound HEAD checks need their own timeout/parallelism budget and
//     should never bleed into the main content path.

import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.104.1/cors";

const WP_BASE = "https://mindfulnessexercises.com/wp-json";
const TARGET_HOSTS = new Set([
  "mindfulnessexercises.com",
  "www.mindfulnessexercises.com",
]);

// Bounded outbound concurrency — we don't want to accidentally DDOS WP.
const MAX_PARALLEL_CHECKS = 6;
const CHECK_TIMEOUT_MS = 8_000;

interface FoundLink {
  href: string;            // raw href from the HTML
  url: string;             // absolute, normalized to https://mindfulnessexercises.com/...
  pathname: string;        // path only, no query/hash, trimmed
  anchorText: string;      // visible text of the <a>
}

interface ScanItem {
  id: number;
  type: "post" | "page";
  title: string;
  slug: string;
  link: string;            // canonical WP permalink
  modified: string;
  links: FoundLink[];
}

interface CheckResult {
  url: string;
  status: number | null;
  ok: boolean;
  redirectedTo: string | null;
  mismatch: boolean;       // host or pathname changed after redirect
  mismatchReason: string | null;
  error: string | null;
  elapsedMs: number;
}

// --------------------------------------------------------------------------
// HTML link extraction
// --------------------------------------------------------------------------

const A_TAG = /<a\b[^>]*?\bhref\s*=\s*("([^"]*)"|'([^']*)')[^>]*>([\s\S]*?)<\/a>/gi;

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&nbsp;/g, " ");
}

function stripTags(s: string): string {
  return decodeEntities(s.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
}

function normalizePath(pathname: string): string {
  // Drop trailing slash (except root) so /foo and /foo/ compare equal.
  if (pathname.length > 1 && pathname.endsWith("/")) return pathname.slice(0, -1);
  return pathname;
}

function extractMELinks(html: string): FoundLink[] {
  const out: FoundLink[] = [];
  const seen = new Set<string>();
  let m: RegExpExecArray | null;
  A_TAG.lastIndex = 0;
  while ((m = A_TAG.exec(html)) !== null) {
    const rawHref = decodeEntities(m[2] ?? m[3] ?? "").trim();
    if (!rawHref) continue;
    // Only absolute http(s) URLs — relative links inside WP content are not
    // "external" in any meaningful sense for this check.
    if (!/^https?:\/\//i.test(rawHref)) continue;
    let parsed: URL;
    try {
      parsed = new URL(rawHref);
    } catch {
      continue;
    }
    if (!TARGET_HOSTS.has(parsed.host.toLowerCase())) continue;
    // Canonicalize on https + no www so duplicates collapse.
    parsed.protocol = "https:";
    parsed.host = "mindfulnessexercises.com";
    const url = parsed.toString();
    const dedupeKey = `${url}|${m[4]}`;
    if (seen.has(dedupeKey)) continue;
    seen.add(dedupeKey);
    out.push({
      href: rawHref,
      url,
      pathname: normalizePath(parsed.pathname),
      anchorText: stripTags(m[4] ?? "").slice(0, 160),
    });
  }
  return out;
}

// --------------------------------------------------------------------------
// WP fetch
// --------------------------------------------------------------------------

async function fetchWPList(
  type: "posts" | "pages",
  page: number,
  perPage: number,
): Promise<{ items: ScanItem[]; totalPages: number; total: number }> {
  const u = new URL(`${WP_BASE}/wp/v2/${type}`);
  u.searchParams.set("page", String(page));
  u.searchParams.set("per_page", String(perPage));
  // Only fields we need — cuts payload size dramatically vs default.
  u.searchParams.set(
    "_fields",
    "id,slug,link,modified,title,content",
  );
  const res = await fetch(u.toString(), { headers: { Accept: "application/json" } });
  if (!res.ok) {
    throw new Error(`WP ${type} fetch failed: ${res.status}`);
  }
  const totalPages = Number(res.headers.get("x-wp-totalpages") ?? 1);
  const total = Number(res.headers.get("x-wp-total") ?? 0);
  // deno-lint-ignore no-explicit-any
  const raw = (await res.json()) as any[];
  const items: ScanItem[] = raw.map((p) => ({
    id: p.id,
    type: type === "posts" ? "post" : "page",
    title: stripTags(p.title?.rendered ?? "(untitled)"),
    slug: p.slug ?? "",
    link: p.link ?? "",
    modified: p.modified ?? "",
    links: extractMELinks(p.content?.rendered ?? ""),
  }));
  return { items, totalPages, total };
}

// --------------------------------------------------------------------------
// Outbound URL checking
// --------------------------------------------------------------------------

async function checkOne(target: string): Promise<CheckResult> {
  const started = Date.now();
  let parsed: URL;
  try {
    parsed = new URL(target);
  } catch {
    return {
      url: target,
      status: null,
      ok: false,
      redirectedTo: null,
      mismatch: false,
      mismatchReason: null,
      error: "Invalid URL",
      elapsedMs: 0,
    };
  }
  const expectedPath = normalizePath(parsed.pathname);
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), CHECK_TIMEOUT_MS);
  try {
    let res: Response;
    try {
      res = await fetch(target, { method: "HEAD", redirect: "follow", signal: ctrl.signal });
      // Some WP setups answer HEAD with 405; fall back to a tiny GET.
      if (res.status === 405 || res.status === 501) {
        res = await fetch(target, { method: "GET", redirect: "follow", signal: ctrl.signal });
      }
    } catch (err) {
      // Some hosts hang HEAD — try GET once before giving up.
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("aborted")) throw err;
      res = await fetch(target, { method: "GET", redirect: "follow", signal: ctrl.signal });
    }
    const finalUrl = res.url || target;
    let mismatch = false;
    let reason: string | null = null;
    try {
      const finalParsed = new URL(finalUrl);
      const finalHost = finalParsed.host.toLowerCase();
      const finalPath = normalizePath(finalParsed.pathname);
      if (!TARGET_HOSTS.has(finalHost)) {
        mismatch = true;
        reason = `host changed → ${finalHost}`;
      } else if (finalPath !== expectedPath) {
        mismatch = true;
        reason = `path changed → ${finalPath}`;
      }
    } catch {
      // Ignore — leave mismatch=false if we can't parse the final URL.
    }
    return {
      url: target,
      status: res.status,
      ok: res.status >= 200 && res.status < 400,
      redirectedTo: finalUrl !== target ? finalUrl : null,
      mismatch,
      mismatchReason: reason,
      error: null,
      elapsedMs: Date.now() - started,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return {
      url: target,
      status: null,
      ok: false,
      redirectedTo: null,
      mismatch: false,
      mismatchReason: null,
      error: msg.includes("aborted") ? "Timeout" : msg,
      elapsedMs: Date.now() - started,
    };
  } finally {
    clearTimeout(timer);
  }
}

async function checkBatch(urls: string[]): Promise<CheckResult[]> {
  const results: CheckResult[] = new Array(urls.length);
  let cursor = 0;
  async function worker() {
    while (true) {
      const i = cursor++;
      if (i >= urls.length) return;
      results[i] = await checkOne(urls[i]);
    }
  }
  const workers = Array.from(
    { length: Math.min(MAX_PARALLEL_CHECKS, urls.length) },
    () => worker(),
  );
  await Promise.all(workers);
  return results;
}

// --------------------------------------------------------------------------
// HTTP handler
// --------------------------------------------------------------------------

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const mode = url.searchParams.get("mode") ?? "scan";

    if (mode === "scan") {
      const type = (url.searchParams.get("type") === "pages" ? "pages" : "posts") as
        | "posts"
        | "pages";
      const page = Math.max(1, Number(url.searchParams.get("page") ?? "1") || 1);
      const perPage = Math.min(
        50,
        Math.max(1, Number(url.searchParams.get("per_page") ?? "20") || 20),
      );
      const result = await fetchWPList(type, page, perPage);
      // Only return items that actually contain ME links — keeps the UI
      // focused on what's actionable.
      const items = result.items.filter((it) => it.links.length > 0);
      return new Response(
        JSON.stringify({
          mode,
          type,
          page,
          perPage,
          total: result.total,
          totalPages: result.totalPages,
          itemsScanned: result.items.length,
          itemsWithLinks: items.length,
          items,
        }),
        {
          status: 200,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
            "Cache-Control": "public, max-age=300",
          },
        },
      );
    }

    if (mode === "check") {
      if (req.method !== "POST") {
        return new Response(
          JSON.stringify({ error: "check mode requires POST" }),
          { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      const body = await req.json().catch(() => null) as { urls?: unknown } | null;
      const urls = Array.isArray(body?.urls)
        ? (body!.urls as unknown[]).filter((u): u is string => typeof u === "string")
        : [];
      if (urls.length === 0) {
        return new Response(
          JSON.stringify({ error: "Body must be { urls: string[] }" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      // Soft cap so a runaway client can't tie up the function.
      const capped = urls.slice(0, 100);
      const results = await checkBatch(capped);
      return new Response(
        JSON.stringify({ mode, count: results.length, results }),
        {
          status: 200,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
            "Cache-Control": "no-store",
          },
        },
      );
    }

    return new Response(
      JSON.stringify({ error: `Unknown mode: ${mode}` }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("link-checker error:", message);
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
