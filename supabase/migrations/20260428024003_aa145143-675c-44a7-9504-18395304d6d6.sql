CREATE TABLE public.email_leads (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL,
  track text NOT NULL CHECK (track IN ('free_resources', 'live_events', 'premium_training', 'certification', 'general')),
  surface text NOT NULL CHECK (surface IN ('inline', 'sticky', 'modal', 'other')),
  source_path text,
  source_section text,
  consent boolean NOT NULL DEFAULT false,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX email_leads_email_idx ON public.email_leads (email);
CREATE INDEX email_leads_track_created_idx ON public.email_leads (track, created_at DESC);

ALTER TABLE public.email_leads ENABLE ROW LEVEL SECURITY;

-- Anyone (including anonymous visitors) can submit a lead. We deliberately
-- do NOT grant SELECT to anon/authenticated roles — leads are PII and must
-- only be readable via service role / future admin policy.
CREATE POLICY "Anyone can submit an email lead"
  ON public.email_leads
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    char_length(email) BETWEEN 3 AND 320
    AND email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  );