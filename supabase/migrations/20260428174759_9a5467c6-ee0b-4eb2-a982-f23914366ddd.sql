ALTER TABLE public.buzzsprout_episodes
  ADD COLUMN IF NOT EXISTS ai_style TEXT,
  ADD COLUMN IF NOT EXISTS ai_style_version TEXT;