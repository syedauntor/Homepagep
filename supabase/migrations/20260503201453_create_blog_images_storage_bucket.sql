/*
  # Create blog-images storage bucket

  Creates a public storage bucket for blog post images uploaded via the rich text editor.
  Allows authenticated users to upload and anyone to read/view images.
*/

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'blog-images',
  'blog-images',
  true,
  10485760,
  ARRAY['image/jpeg','image/png','image/gif','image/webp','image/svg+xml']
)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read blog images"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'blog-images');

CREATE POLICY "Authenticated users can upload blog images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'blog-images');

CREATE POLICY "Anon can upload blog images"
  ON storage.objects FOR INSERT
  TO anon
  WITH CHECK (bucket_id = 'blog-images');
