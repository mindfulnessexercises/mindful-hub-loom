
CREATE TABLE public.wp_seo (
  slug text PRIMARY KEY,
  post_type text,
  yoast_title text,
  yoast_desc text,
  yoast_canonical text,
  yoast_focus_kw text,
  og_image text,
  robots_noindex boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.wp_seo ENABLE ROW LEVEL SECURITY;

CREATE POLICY "wp_seo is publicly readable"
  ON public.wp_seo FOR SELECT
  USING (true);

CREATE TRIGGER update_wp_seo_updated_at
  BEFORE UPDATE ON public.wp_seo
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
