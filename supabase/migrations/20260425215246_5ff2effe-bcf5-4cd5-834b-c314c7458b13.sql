CREATE TABLE public.meditations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  speaker TEXT,
  portrait_url TEXT,
  audio_url TEXT NOT NULL,
  original_audio_url TEXT,
  duration_seconds INTEGER,
  elfsight_app_id TEXT,
  rehosted BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_meditations_slug ON public.meditations(slug);

ALTER TABLE public.meditations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Meditations are publicly readable"
  ON public.meditations
  FOR SELECT
  USING (true);

INSERT INTO storage.buckets (id, name, public)
VALUES ('meditation-audio', 'meditation-audio', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Meditation audio is publicly accessible"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'meditation-audio');