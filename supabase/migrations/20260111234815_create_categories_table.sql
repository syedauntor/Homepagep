/*
  # Create Categories Table

  1. New Tables
    - `categories`
      - `id` (uuid, primary key)
      - `name` (text, unique) - Category name
      - `slug` (text, unique) - URL-friendly version of name
      - `description` (text, nullable) - Category description
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Changes to Existing Tables
    - Add `category_id` column to `blog_posts` table
    - Add foreign key constraint linking to categories

  3. Security
    - Enable RLS on `categories` table
    - Add policy for public read access to categories
    - Update blog_posts policies to handle category relationship

  4. Sample Data
    - Insert default categories (Coloring Pages, Activities, DIY Projects)
*/

CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view categories"
  ON categories
  FOR SELECT
  TO public
  USING (true);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blog_posts' AND column_name = 'category_id'
  ) THEN
    ALTER TABLE blog_posts ADD COLUMN category_id uuid REFERENCES categories(id);
  END IF;
END $$;

INSERT INTO categories (name, slug, description) VALUES
  ('Coloring Pages', 'coloring-pages', 'Fun and creative coloring pages for kids and adults'),
  ('Activities', 'activities', 'Engaging activities and worksheets'),
  ('DIY Projects', 'diy-projects', 'Creative DIY projects and crafts')
ON CONFLICT (slug) DO NOTHING;
