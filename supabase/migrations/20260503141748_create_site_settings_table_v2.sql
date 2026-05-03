/*
  # Create site_settings table (v2 - idempotent)

  Creates the site_settings table if not already present and seeds defaults.
*/

CREATE TABLE IF NOT EXISTS site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text NOT NULL DEFAULT 'true',
  label text NOT NULL DEFAULT '',
  "group" text NOT NULL DEFAULT 'general',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add missing columns if table already existed without them
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='site_settings' AND column_name='label') THEN
    ALTER TABLE site_settings ADD COLUMN label text NOT NULL DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='site_settings' AND column_name='group') THEN
    ALTER TABLE site_settings ADD COLUMN "group" text NOT NULL DEFAULT 'general';
  END IF;
END $$;

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='site_settings' AND policyname='Anyone can read settings') THEN
    EXECUTE 'CREATE POLICY "Anyone can read settings" ON site_settings FOR SELECT TO public USING (true)';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='site_settings' AND policyname='Anon and authenticated can update settings') THEN
    EXECUTE 'CREATE POLICY "Anon and authenticated can update settings" ON site_settings FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true)';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='site_settings' AND policyname='Anon and authenticated can insert settings') THEN
    EXECUTE 'CREATE POLICY "Anon and authenticated can insert settings" ON site_settings FOR INSERT TO anon, authenticated WITH CHECK (true)';
  END IF;
END $$;

INSERT INTO site_settings (key, value, label, "group")
VALUES ('post_featured_image_enabled', 'true', 'Show Featured Image on Posts', 'post_settings')
ON CONFLICT (key) DO NOTHING;
