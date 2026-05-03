/*
  # Fix Blog Post RLS Policies + Create Image Storage

  ## Changes
  1. **blog_posts RLS** - Add INSERT, UPDATE, DELETE policies for anon (admin uses anon key)
  2. **Storage bucket** - Create public 'media' bucket for image uploads
  3. **Storage policies** - Allow public read, anon write/delete
  4. **images table** - Track uploaded images for gallery management
*/

-- Fix blog_posts RLS: add write policies for anon/authenticated
CREATE POLICY "Anon can insert blog posts"
  ON blog_posts FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anon can update blog posts"
  ON blog_posts FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anon can delete blog posts"
  ON blog_posts FOR DELETE
  TO anon, authenticated
  USING (true);

-- Create storage bucket for media
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'media',
  'media',
  true,
  10485760,
  ARRAY['image/jpeg','image/png','image/gif','image/webp','image/svg+xml']
)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for media bucket
CREATE POLICY "Public read media"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'media');

CREATE POLICY "Anon upload media"
  ON storage.objects FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id = 'media');

CREATE POLICY "Anon update media"
  ON storage.objects FOR UPDATE
  TO anon, authenticated
  USING (bucket_id = 'media')
  WITH CHECK (bucket_id = 'media');

CREATE POLICY "Anon delete media"
  ON storage.objects FOR DELETE
  TO anon, authenticated
  USING (bucket_id = 'media');

-- Images gallery table
CREATE TABLE IF NOT EXISTS images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  filename text NOT NULL,
  storage_path text NOT NULL,
  public_url text NOT NULL,
  size integer DEFAULT 0,
  mime_type text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view images"
  ON images FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anon can insert images"
  ON images FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anon can delete images"
  ON images FOR DELETE
  TO anon, authenticated
  USING (true);
