/*
  # Add post status, scheduling, and date control fields

  1. Changes to `blog_posts`
    - `status` (text) — 'draft' | 'scheduled' | 'published', default 'published'
    - `published_at` (timestamptz) — when to publish (future = scheduled)
    - `modified_at` (timestamptz) — last modified date, editable by admin
    - `lock_modified_date` (boolean) — prevents auto-update of modified_at on save

  2. Changes to `pages`
    - `status` (text) — 'draft' | 'published', default 'published'
    - `published_at` (timestamptz)
    - `modified_at` (timestamptz)
    - `lock_modified_date` (boolean)

  3. Backfill existing rows with sensible defaults
*/

DO $$
BEGIN
  -- blog_posts columns
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='blog_posts' AND column_name='status') THEN
    ALTER TABLE blog_posts ADD COLUMN status text NOT NULL DEFAULT 'published';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='blog_posts' AND column_name='published_at') THEN
    ALTER TABLE blog_posts ADD COLUMN published_at timestamptz DEFAULT now();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='blog_posts' AND column_name='modified_at') THEN
    ALTER TABLE blog_posts ADD COLUMN modified_at timestamptz DEFAULT now();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='blog_posts' AND column_name='lock_modified_date') THEN
    ALTER TABLE blog_posts ADD COLUMN lock_modified_date boolean NOT NULL DEFAULT false;
  END IF;

  -- pages columns
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='pages' AND column_name='status') THEN
    ALTER TABLE pages ADD COLUMN status text NOT NULL DEFAULT 'published';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='pages' AND column_name='published_at') THEN
    ALTER TABLE pages ADD COLUMN published_at timestamptz DEFAULT now();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='pages' AND column_name='modified_at') THEN
    ALTER TABLE pages ADD COLUMN modified_at timestamptz DEFAULT now();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='pages' AND column_name='lock_modified_date') THEN
    ALTER TABLE pages ADD COLUMN lock_modified_date boolean NOT NULL DEFAULT false;
  END IF;
END $$;

-- Backfill blog_posts: set published_at = created_at for existing rows
UPDATE blog_posts SET published_at = created_at WHERE published_at IS NULL;
UPDATE blog_posts SET modified_at = COALESCE(updated_at, created_at) WHERE modified_at IS NULL;
