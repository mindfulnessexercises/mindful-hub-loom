INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'download-assets',
  'download-assets',
  true,
  52428800,
  ARRAY['application/pdf']
)
ON CONFLICT (id) DO UPDATE
SET public = true,
    file_size_limit = 52428800,
    allowed_mime_types = ARRAY['application/pdf'];

CREATE POLICY "Download assets are publicly readable"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'download-assets');