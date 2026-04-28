DROP POLICY IF EXISTS "Download assets are publicly readable" ON storage.objects;

CREATE POLICY "Public can read download PDF files"
ON storage.objects
FOR SELECT
TO public
USING (
  bucket_id = 'download-assets'
  AND lower(right(name, 4)) = '.pdf'
  AND (
    name LIKE 'worksheets/%'
    OR name LIKE 'sample-scripts/%'
  )
);