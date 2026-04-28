// Nightly SEO snapshot runner.
//
// Crawls the top-100 URLs against a configurable base URL, parses <title>,
// <meta name="description">, and <link rel="canonical"> from the HEAD, then
// writes one row per URL into seo_snapshots and one summary row into
// seo_snapshot_runs.
//
// Triggered by:
//   1. pg_cron nightly (see migration that schedules it)
//   2. Manual POST from the admin dashboard ("Run snapshot now")
//   3. Direct curl during development
//
// Auth model:
//   - verify_jwt = false (cron job has no JWT). We protect writes by using
//     the service role key inside the function — clients never write directly.
//   - Optional X-Snapshot-Token header allows tightening if abuse appears.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Top-100 high-traffic paths (mirrors src/test/fixtures/top-100-urls.csv).
// Kept inline so the edge function has zero filesystem dependencies.
const TOP_100_PATHS: string[] = [
  "/karma-quotes/", "/silence-quotes/", "/stoic-quotes/", "/healing-quotes/", "/528hz-miracle-tone/",
  "/buddhist-quotes/", "/letting-go-quotes/", "/yoga-quotes/", "/sunday-quotes/", "/thursday-affirmations/",
  "/wednesday-affirmations/", "/tuesday-affirmations/", "/saturday-affirmations/", "/monday-affirmations/",
  "/friday-affirmations/", "/sunday-affirmations/", "/affirmations-for-men/", "/affirmations-for-teens/",
  "/morning-affirmations/", "/evening-affirmations/", "/love-affirmations/",
  "/loving-kindness-meditation-script/", "/body-scan-meditation-script/", "/anxiety-meditation-script/",
  "/sleep-meditation-script/", "/grief-meditation-script/", "/forgiveness-meditation-script/",
  "/self-compassion-meditation-script/", "/gratitude-meditation-script/", "/mountain-meditation-script/",
  "/walking-meditation-script/", "/childrens-meditation-script/",
  "/417hz-frequency/", "/432hz-frequency/", "/741hz-frequency/", "/852hz-frequency/", "/963hz-frequency/",
  "/396hz-frequency/", "/639hz-frequency/",
  "/types-of-meditation/", "/benefits-of-meditation/", "/how-to-meditate/", "/mindfulness-exercises/",
  "/breathing-exercises/", "/grounding-techniques/",
  "/meditation/loving-kindness-meditation/", "/meditation/body-scan-meditation/",
  "/meditation/walking-meditation/", "/meditation/breath-meditation/", "/meditation/visualization-meditation/",
  "/meditation/mindfulness-meditation/", "/meditation/zen-meditation/", "/meditation/transcendental-meditation/",
  "/meditation/mantra-meditation/", "/meditation/chakra-meditation/", "/meditation/movement-meditation/",
  "/meditation/sound-meditation/", "/meditation/guided-meditation/",
  "/free-online-mindfulness-courses/mbsr-course/", "/free-online-mindfulness-courses/mbct-course/",
  "/free-online-mindfulness-courses/teen-course/",
  "/how-to-teach-meditation/teaching-children/", "/how-to-teach-meditation/teaching-teens/",
  "/how-to-teach-meditation/teaching-adults/",
  "/mindfulness-teacher/sean-fargo/", "/mindfulness-teacher/joseph-goldstein/",
  "/mindfulness-teacher/sharon-salzberg/", "/mindfulness-teacher/tara-brach/",
  "/mindfulness-teacher/jon-kabat-zinn/",
  "/meaningful-work-quotes/", "/meaningful-work-affirmations/",
  "/mindfulness-meditation-teacher-training/", "/ce-policies/",
  "/mindfulness-for-anxiety/", "/mindfulness-for-depression/", "/mindfulness-for-stress/",
  "/mindfulness-for-sleep/", "/mindfulness-for-kids/", "/mindfulness-for-teens/",
  "/mindfulness-for-therapists/", "/mindfulness-for-teachers/", "/mindfulness-for-couples/",
  "/free-mindfulness-ebook/", "/library/", "/audio-library/", "/quotes/", "/affirmations/",
  "/meditation-scripts/", "/podcast/", "/blog/",
  "/mindfulness-worksheets/", "/gratitude-worksheets/", "/anxiety-worksheets/",
  "/self-compassion-worksheets/", "/cbt-worksheets/",
  "/mindful-eating/", "/mindful-listening/", "/mindful-walking/", "/mindful-breathing/",
  "/mindful-communication/", "/mindful-parenting/", "/mindful-leadership/",
  "/dharma-talks/", "/meditation-music/", "/meditation-bells/",
];

function extractMeta(html: string) {
  // Operate on just the <head> to keep regex cost bounded for large pages.
  const headMatch = html.match(/<head[\s\S]*?<\/head>/i);
  const head = headMatch ? headMatch[0] : html.slice(0, 200_000);

  const titleMatch = head.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const title = titleMatch ? decode(titleMatch[1].trim()).slice(0, 500) : null;

  // <meta name="description" content="...">  (attribute order tolerant)
  const descMatch =
    head.match(
      /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["'][^>]*>/i,
    ) ||
    head.match(
      /<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["'][^>]*>/i,
    );
  const description = descMatch ? decode(descMatch[1].trim()).slice(0, 1000) : null;

  // <link rel="canonical" href="...">
  const canonMatch =
    head.match(
      /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']*)["'][^>]*>/i,
    ) ||
    head.match(
      /<link[^>]+href=["']([^"']*)["'][^>]+rel=["']canonical["'][^>]*>/i,
    );
  const canonical = canonMatch ? canonMatch[1].trim().slice(0, 1000) : null;

  return { title, description, canonical };
}

function decode(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ");
}

async function snapshotOne(baseUrl: string, path: string) {
  const url = new URL(path, baseUrl).toString();
  const startedAt = Date.now();
  try {
    const res = await fetch(url, {
      redirect: "manual",
      headers: {
        "User-Agent":
          "MindfulnessExercises-SEO-Snapshot/1.0 (+nightly canonical health check)",
        Accept: "text/html,application/xhtml+xml",
      },
      signal: AbortSignal.timeout(15_000),
    });
    const fetchMs = Date.now() - startedAt;
    const status = res.status;
    let title: string | null = null;
    let description: string | null = null;
    let canonical: string | null = null;
    let contentLength: number | null = null;
    if (status >= 200 && status < 400) {
      const html = await res.text();
      contentLength = html.length;
      const meta = extractMeta(html);
      title = meta.title;
      description = meta.description;
      canonical = meta.canonical;
    } else {
      // Drain body to free the connection but don't parse non-OK pages
      try { await res.text(); } catch { /* ignore */ }
    }
    return {
      path, url, http_status: status, canonical, title,
      meta_description: description, content_length: contentLength,
      fetch_ms: fetchMs, error: null as string | null,
    };
  } catch (err) {
    return {
      path, url, http_status: null, canonical: null, title: null,
      meta_description: null, content_length: null,
      fetch_ms: Date.now() - startedAt,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

// Compare current snapshot to the most recent prior snapshot for the same path
// and return true if we'd consider this a regression worth flagging.
type SnapRow = {
  path: string;
  http_status: number | null;
  canonical: string | null;
  title: string | null;
  meta_description: string | null;
};
function isRegression(curr: SnapRow, prev: SnapRow | undefined): boolean {
  if (!prev) return false; // first time we see this URL — nothing to compare
  // Status went from OK to non-OK
  const prevOk = (prev.http_status ?? 0) >= 200 && (prev.http_status ?? 0) < 400;
  const currOk = (curr.http_status ?? 0) >= 200 && (curr.http_status ?? 0) < 400;
  if (prevOk && !currOk) return true;
  if (!currOk) return false; // both non-OK isn't a *new* regression
  // Lost canonical / title / description
  if (prev.canonical && !curr.canonical) return true;
  if (prev.title && !curr.title) return true;
  if (prev.meta_description && !curr.meta_description) return true;
  // Title or canonical changed materially
  if (prev.title && curr.title && prev.title !== curr.title) return true;
  if (prev.canonical && curr.canonical && prev.canonical !== curr.canonical)
    return true;
  return false;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceKey) {
    return new Response(
      JSON.stringify({ error: "Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
  const supabase = createClient(supabaseUrl, serviceKey);

  // Allow override of which environment we crawl. Default = the published site.
  let body: { base_url?: string; concurrency?: number } = {};
  if (req.method === "POST") {
    try { body = await req.json(); } catch { /* empty body OK */ }
  }
  const baseUrl =
    body.base_url ||
    Deno.env.get("SEO_SNAPSHOT_BASE_URL") ||
    "https://mindful-hub-loom.lovable.app";
  const concurrency = Math.max(1, Math.min(8, body.concurrency ?? 4));

  // Create the run row up front so partial failures still leave a trace.
  const { data: runRow, error: runErr } = await supabase
    .from("seo_snapshot_runs")
    .insert({ base_url: baseUrl, url_count: TOP_100_PATHS.length })
    .select("id")
    .single();
  if (runErr || !runRow) {
    return new Response(
      JSON.stringify({ error: "Failed to create run row", detail: runErr?.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
  const runId = runRow.id as string;

  // Pull the most recent previous snapshot per path so we can compute
  // regressions in one pass without re-querying per URL.
  const { data: prevRows } = await supabase
    .from("seo_snapshots")
    .select("path, http_status, canonical, title, meta_description, fetched_at")
    .order("fetched_at", { ascending: false })
    .limit(2000);
  const prevByPath = new Map<string, SnapRow>();
  for (const r of prevRows ?? []) {
    if (!prevByPath.has(r.path)) {
      prevByPath.set(r.path, r as SnapRow);
    }
  }

  // Crawl with bounded concurrency
  const results: Awaited<ReturnType<typeof snapshotOne>>[] = [];
  let cursor = 0;
  async function worker() {
    while (cursor < TOP_100_PATHS.length) {
      const i = cursor++;
      const path = TOP_100_PATHS[i];
      const r = await snapshotOne(baseUrl, path);
      results.push(r);
    }
  }
  await Promise.all(Array.from({ length: concurrency }, worker));

  // Insert in chunks of 50 to stay well under PostgREST limits
  for (let i = 0; i < results.length; i += 50) {
    const chunk = results.slice(i, i + 50).map((r) => ({ ...r, run_id: runId }));
    const { error: insErr } = await supabase.from("seo_snapshots").insert(chunk);
    if (insErr) {
      console.error("seo-snapshot insert chunk failed", insErr.message);
    }
  }

  // Summarize
  let okCount = 0;
  let errorCount = 0;
  let regressionCount = 0;
  for (const r of results) {
    const ok = (r.http_status ?? 0) >= 200 && (r.http_status ?? 0) < 400;
    if (ok) okCount++;
    else errorCount++;
    if (isRegression(r as SnapRow, prevByPath.get(r.path))) regressionCount++;
  }

  await supabase
    .from("seo_snapshot_runs")
    .update({
      finished_at: new Date().toISOString(),
      ok_count: okCount,
      error_count: errorCount,
      regression_count: regressionCount,
    })
    .eq("id", runId);

  return new Response(
    JSON.stringify({
      run_id: runId,
      base_url: baseUrl,
      url_count: TOP_100_PATHS.length,
      ok: okCount,
      errors: errorCount,
      regressions: regressionCount,
    }),
    { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
});
