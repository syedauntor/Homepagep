/*
  # Add Featured Image and SEO Fields to Blog Posts

  1. Changes to blog_posts table
    - Add `featured_image` column for the main post image
    - Add `seo_title` column for custom SEO title (meta title)
    - Add `seo_description` column for meta description
    - Add `seo_keywords` column for meta keywords
    - Add `slug` column for SEO-friendly URLs
  
  2. Notes
    - All new fields are optional (nullable)
    - slug will be auto-generated from title if not provided
    - SEO fields follow WordPress best practices
*/

-- Add featured image column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blog_posts' AND column_name = 'featured_image'
  ) THEN
    ALTER TABLE blog_posts ADD COLUMN featured_image text;
  END IF;
END $$;

-- Add SEO title column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blog_posts' AND column_name = 'seo_title'
  ) THEN
    ALTER TABLE blog_posts ADD COLUMN seo_title text;
  END IF;
END $$;

-- Add SEO description column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blog_posts' AND column_name = 'seo_description'
  ) THEN
    ALTER TABLE blog_posts ADD COLUMN seo_description text;
  END IF;
END $$;

-- Add SEO keywords column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blog_posts' AND column_name = 'seo_keywords'
  ) THEN
    ALTER TABLE blog_posts ADD COLUMN seo_keywords text;
  END IF;
END $$;

-- Add slug column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blog_posts' AND column_name = 'slug'
  ) THEN
    ALTER TABLE blog_posts ADD COLUMN slug text;
  END IF;
END $$;