-- Reusable updated_at helper (no-op if it already exists)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Run-level metadata (one row per nightly crawl)
CREATE TABLE IF NOT EXISTS public.seo_snapshot_runs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  base_url TEXT NOT NULL,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  finished_at TIMESTAMPTZ,
  url_count INTEGER NOT NULL DEFAULT 0,
  ok_count INTEGER NOT NULL DEFAULT 0,
  error_count INTEGER NOT NULL DEFAULT 0,
  regression_count INTEGER NOT NULL DEFAULT 0,
  notes TEXT
);

ALTER TABLE public.seo_snapshot_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "SEO runs are publicly readable"
  ON public.seo_snapshot_runs
  FOR SELECT
  USING (true);

-- Per-URL snapshot (one row per URL per run)
CREATE TABLE IF NOT EXISTS public.seo_snapshots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  run_id UUID NOT NULL REFERENCES public.seo_snapshot_runs(id) ON DELETE CASCADE,
  path TEXT NOT NULL,
  url TEXT NOT NULL,
  http_status INTEGER,
  canonical TEXT,
  title TEXT,
  meta_description TEXT,
  content_length INTEGER,
  fetch_ms INTEGER,
  error TEXT,
  fetched_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.seo_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "SEO snapshots are publicly readable"
  ON public.seo_snapshots
  FOR SELECT
  USING (true);

CREATE INDEX IF NOT EXISTS idx_seo_snapshots_run_id ON public.seo_snapshots(run_id);
CREATE INDEX IF NOT EXISTS idx_seo_snapshots_path_fetched ON public.seo_snapshots(path, fetched_at DESC);
CREATE INDEX IF NOT EXISTS idx_seo_snapshot_runs_started ON public.seo_snapshot_runs(started_at DESC);

-- Enable extensions needed for nightly cron invocation of the edge function
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;