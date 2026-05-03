/*
  # Create authors / team members table

  1. New Tables
    - `authors`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `designation` (text) — e.g. "Graphic Designer", "Author"
      - `bio` (text) — short bio shown in blog post author box and team section
      - `avatar_url` (text) — profile photo URL
      - `avatar_alt` (text) — alt text for avatar
      - `email` (text, unique, nullable) — used for login if access_enabled
      - `password_hash` (text) — bcrypt hash stored only if access_enabled
      - `role` (text) — 'admin' | 'editor' | 'author' | 'contributor'
      - `access_enabled` (boolean, default false) — whether this person can log in
      - `fb_url`, `ig_url`, `x_url`, `pinterest_url`, `linkedin_url` (text, nullable)
      - `show_on_home` (boolean, default true) — show in homepage team section
      - `display_order` (integer, default 0) — sort order on homepage
      - `is_active` (boolean, default true)
      - `created_at`, `updated_at` (timestamptz)

  2. Security
    - Enable RLS
    - Public SELECT (needed for homepage + blog post pages)
    - Anon/authenticated can INSERT, UPDATE, DELETE (admin panel controls access)
*/

CREATE TABLE IF NOT EXISTS authors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT '',
  designation text DEFAULT '',
  bio text DEFAULT '',
  avatar_url text DEFAULT NULL,
  avatar_alt text DEFAULT '',
  email text UNIQUE DEFAULT NULL,
  password_hash text DEFAULT NULL,
  role text NOT NULL DEFAULT 'author',
  access_enabled boolean NOT NULL DEFAULT false,
  fb_url text DEFAULT NULL,
  ig_url text DEFAULT NULL,
  x_url text DEFAULT NULL,
  pinterest_url text DEFAULT NULL,
  linkedin_url text DEFAULT NULL,
  show_on_home boolean NOT NULL DEFAULT true,
  display_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE authors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read authors"
  ON authors FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anon and authenticated can insert authors"
  ON authors FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anon and authenticated can update authors"
  ON authors FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anon and authenticated can delete authors"
  ON authors FOR DELETE
  TO anon, authenticated
  USING (true);

-- Add author_id FK to blog_posts (nullable — keeps existing posts working)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blog_posts' AND column_name = 'author_id'
  ) THEN
    ALTER TABLE blog_posts ADD COLUMN author_id uuid REFERENCES authors(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Seed additional post typography settings
INSERT INTO site_settings (key, value, label, "group")
VALUES
  ('post_body_font_size', '18', 'Body Font Size (px)', 'post_settings'),
  ('post_body_line_height', '1.75', 'Body Line Height', 'post_settings'),
  ('post_heading_font_size_h1', '36', 'H1 Font Size (px)', 'post_settings'),
  ('post_heading_font_size_h2', '28', 'H2 Font Size (px)', 'post_settings'),
  ('post_heading_font_size_h3', '22', 'H3 Font Size (px)', 'post_settings'),
  ('post_font_family', 'Georgia, serif', 'Body Font Family', 'post_settings'),
  ('post_paragraph_spacing', '1.5', 'Paragraph Spacing (em)', 'post_settings')
ON CONFLICT (key) DO NOTHING;
