/*
  # Add image_alt column to blog_posts

  1. Changes
    - `blog_posts`: add `image_alt` (text, nullable) — stores accessibility alt text for the post image

  2. Notes
    - Safe `IF NOT EXISTS` check prevents errors on re-run
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blog_posts' AND column_name = 'image_alt'
  ) THEN
    ALTER TABLE blog_posts ADD COLUMN image_alt text;
  END IF;
END $$;
