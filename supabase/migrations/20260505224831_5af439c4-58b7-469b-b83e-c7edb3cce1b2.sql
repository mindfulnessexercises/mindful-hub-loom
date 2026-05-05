-- Column already exists (added in prior migration), but ensure default+nullability
ALTER TABLE public.wp_seo ALTER COLUMN robots_noindex SET DEFAULT false;
ALTER TABLE public.wp_seo ALTER COLUMN robots_noindex SET NOT NULL;