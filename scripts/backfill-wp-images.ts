// One-shot bulk image rehost.
//
// Crawls every published WP post/page/CPT via the wp-proxy edge function,
// extracts every <img src> + featured_media URL, dedupes, then sends them
// to the rehost-images function in batches. Also pulls portrait_url from
// the meditations table.
//
// Run:
//   bun run scripts/backfill-wp-images.ts
//   bun run scripts/backfill-wp-images.ts --dry-run     # discover only
//   bun run scripts/backfill-wp-images.ts --types=posts,pages
//   bun run scripts/backfill-wp-images.ts --batch=20 --concurrency=2
//
// Reads SUPABASE_URL + SUPABASE_PUBLISHABLE_KEY from .env automatically.

import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import path from "node:path";

// ---------- env ----------
function loadEnv() {
  const envPath = path.resolve(process.cwd(), ".env");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
  }
}
loadEnv();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL ?? process.env.SUPABASE_URL;
const SUPABASE_KEY =
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? process.env.SUPABASE_PUBLISHABLE_KEY;
if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY in .env");
  process.exit(1);
}

const FUNCTIONS_BASE = `${SUPABASE_URL}/functions/v1`;
const WP_PROXY = `${FUNCTIONS_BASE}/wp-proxy`;
const REHOST = `${FUNCTIONS_BASE}/rehost-images`;
const AUTH_HEADERS = { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` };

// ---------- args ----------
const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, "").split("=");
    return [k, v ?? "true"];
  }),
);
const DRY_RUN = args["dry-run"] === "true";
const BATCH = Math.max(1, Math.min(100, Number(args.batch ?? 25)));
const CONCURRENCY = Math.max(1, Math.min(8, Number(args.concurrency ?? 2)));
const TYPES = (args.types ?? "posts,pages,downloads,podcast-episodes,courses,lessons")
  .split(",").map((s) => s.trim()).filter(Boolean);

// ---------- WP host filter ----------
const ALLOWED_HOSTS = new Set([
  "mindfulnessexercises.com",
  "www.mindfulnessexercises.com",
]);
const ALLOWED_EXT = /\.(jpe?g|png|gif|webp|svg|avif)(?:$|\?)/i;

function isWpImage(raw: string): boolean {
  try {
    const u = new URL(raw);
    return ALLOWED_HOSTS.has(u.hostname.toLowerCase()) && ALLOWED_EXT.test(u.pathname);
  } catch {
    return false;
  }
}

// Extract every src/srcset URL from raw HTML
function extractImages(html: string): string[] {
  if (!html) return [];
  const out = new Set<string>();
  // src="..."
  for (const m of html.matchAll(/<img\b[^>]*?\bsrc=["']([^"']+)["']/gi)) {
    if (isWpImage(m[1])) out.add(m[1]);
  }
  // srcset="url 1x, url 2x"
  for (const m of html.matchAll(/\bsrcset=["']([^"']+)["']/gi)) {
    for (const part of m[1].split(",")) {
      const url = part.trim().split(/\s+/)[0];
      if (url && isWpImage(url)) out.add(url);
    }
  }
  // background-image style attrs
  for (const m of html.matchAll(/url\((['"]?)(https?:\/\/[^)'"]+)\1\)/gi)) {
    if (isWpImage(m[2])) out.add(m[2]);
  }
  return [...out];
}

// ---------- WP crawl ----------
async function fetchJson(url: string): Promise<{ body: any; totalPages: number }> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  const totalPages = Number(res.headers.get("X-WP-TotalPages") ?? "1");
  return { body: await res.json(), totalPages };
}

async function crawlType(type: string, urls: Set<string>): Promise<number> {
  let count = 0;
  let page = 1;
  // First page tells us totalPages
  const first = `${WP_PROXY}?path=/wp/v2/${encodeURIComponent(type)}&per_page=100&page=1&_fields=id,content,excerpt,featured_media,_links,_embedded&_embed=wp:featuredmedia`;
  let { body, totalPages } = await fetchJson(first);
  const handle = (items: any[]) => {
    for (const item of items ?? []) {
      const html = (item?.content?.rendered ?? "") + (item?.excerpt?.rendered ?? "");
      for (const u of extractImages(html)) urls.add(u);
      const fm = item?._embedded?.["wp:featuredmedia"]?.[0];
      const fmUrl = fm?.source_url;
      if (typeof fmUrl === "string" && isWpImage(fmUrl)) urls.add(fmUrl);
      // Also pull every size from media_details
      const sizes = fm?.media_details?.sizes;
      if (sizes && typeof sizes === "object") {
        for (const s of Object.values(sizes) as any[]) {
          if (s?.source_url && isWpImage(s.source_url)) urls.add(s.source_url);
        }
      }
      count++;
    }
  };
  handle(body);
  for (page = 2; page <= totalPages; page++) {
    const url = `${WP_PROXY}?path=/wp/v2/${encodeURIComponent(type)}&per_page=100&page=${page}&_fields=id,content,excerpt,featured_media,_links,_embedded&_embed=wp:featuredmedia`;
    try {
      const { body: b } = await fetchJson(url);
      handle(b);
      console.log(`  ${type} page ${page}/${totalPages} (running images: ${urls.size})`);
    } catch (e) {
      console.warn(`  ${type} page ${page} failed: ${(e as Error).message}`);
    }
  }
  return count;
}

// ---------- DB sources ----------
async function pullDbImages(urls: Set<string>) {
  const supabase = createClient(SUPABASE_URL!, SUPABASE_KEY!);
  const { data, error } = await supabase.from("meditations").select("portrait_url");
  if (error) {
    console.warn(`meditations query failed: ${error.message}`);
    return;
  }
  for (const row of data ?? []) {
    const u = (row as { portrait_url: string | null }).portrait_url;
    if (u && isWpImage(u)) urls.add(u);
  }
}

// ---------- Rehost ----------
async function rehostBatch(urls: string[]): Promise<{ rehosted: number; errors: number; details: any }> {
  const res = await fetch(REHOST, {
    method: "POST",
    headers: { ...AUTH_HEADERS, "Content-Type": "application/json" },
    body: JSON.stringify({ urls }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`rehost ${res.status}: ${text.slice(0, 200)}`);
  }
  return await res.json();
}

async function runWithConcurrency<T>(items: T[][], workers: number, fn: (chunk: T[], idx: number) => Promise<void>) {
  let i = 0;
  await Promise.all(
    Array.from({ length: workers }, async () => {
      while (i < items.length) {
        const idx = i++;
        await fn(items[idx], idx);
      }
    }),
  );
}

// ---------- main ----------
(async () => {
  console.log(`Backfill (dry-run=${DRY_RUN}, batch=${BATCH}, concurrency=${CONCURRENCY})`);
  console.log(`Types: ${TYPES.join(", ")}`);

  const urls = new Set<string>();

  console.log("\n→ Crawling WP REST...");
  for (const t of TYPES) {
    try {
      const n = await crawlType(t, urls);
      console.log(`  ${t}: ${n} items scanned`);
    } catch (e) {
      console.warn(`  ${t} failed: ${(e as Error).message}`);
    }
  }

  console.log("\n→ Pulling DB image fields...");
  await pullDbImages(urls);

  const all = [...urls];
  console.log(`\nDiscovered ${all.length} unique WP image URLs.`);
  if (all.length === 0) return;

  // Write discovery report so it's auditable
  const reportPath = "/mnt/documents/wp-image-backfill.txt";
  fs.mkdirSync("/mnt/documents", { recursive: true });
  fs.writeFileSync(reportPath, all.join("\n"));
  console.log(`Wrote URL list → ${reportPath}`);

  if (DRY_RUN) {
    console.log("\nDry run — not calling rehost-images.");
    return;
  }

  // Chunk into batches
  const chunks: string[][] = [];
  for (let i = 0; i < all.length; i += BATCH) chunks.push(all.slice(i, i + BATCH));
  console.log(`\n→ Rehosting in ${chunks.length} batches of up to ${BATCH}...`);

  let totalRehosted = 0;
  let totalErrors = 0;
  const errorSamples: Record<string, string> = {};

  await runWithConcurrency(chunks, CONCURRENCY, async (chunk, idx) => {
    try {
      const r = await rehostBatch(chunk);
      const rehosted = Number(r.rehosted ?? 0);
      const errs = Number(r.errors_count ?? 0);
      totalRehosted += rehosted;
      totalErrors += errs;
      if (r.errors && typeof r.errors === "object") {
        for (const [k, v] of Object.entries(r.errors as Record<string, string>)) {
          if (Object.keys(errorSamples).length < 20) errorSamples[k] = v;
        }
      }
      console.log(`  batch ${idx + 1}/${chunks.length}: rehosted=${rehosted}, errors=${errs}`);
    } catch (e) {
      totalErrors += chunk.length;
      console.warn(`  batch ${idx + 1} crashed: ${(e as Error).message}`);
    }
  });

  console.log(`\n✓ Done. Rehosted ${totalRehosted}/${all.length}. Errors: ${totalErrors}.`);
  if (Object.keys(errorSamples).length) {
    console.log("Sample errors:");
    for (const [k, v] of Object.entries(errorSamples)) console.log(`  ${v}  ${k}`);
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
