/*
  # Create pages and menu_items tables

  1. New Tables

    ## pages
    Stores CMS pages (About, Contact, Privacy Policy, Disclaimer, etc.)
    - `id` (uuid, pk)
    - `title` (text) — page display title
    - `slug` (text, unique) — URL path, e.g. "about", "privacy-policy"
    - `content` (text) — rich HTML content from TipTap editor
    - `seo_title` (text)
    - `seo_description` (text)
    - `seo_keywords` (text)
    - `is_system` (boolean) — true for built-in pages (about, contact) that can't be deleted
    - `is_published` (boolean, default true)
    - `created_at`, `updated_at` (timestamptz)

    ## menu_items
    Stores header/footer nav items with ordering and nesting
    - `id` (uuid, pk)
    - `menu_location` (text) — 'header' | 'footer_quick_links' | 'footer_categories'
    - `label` (text) — display text
    - `url` (text) — path or full URL
    - `target` (text) — '_self' | '_blank'
    - `display_order` (integer)
    - `parent_id` (uuid, nullable FK to self) — for dropdowns
    - `is_active` (boolean, default true)
    - `created_at` (timestamptz)

  2. Security
    - RLS enabled on both tables
    - Public SELECT on pages (need to render them)
    - Anon/authenticated full CRUD (admin panel)

  3. Seed
    - Built-in pages: about, contact (is_system=true)
    - Default menu items matching current hardcoded nav
*/

-- ── pages ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT '',
  slug text UNIQUE NOT NULL,
  content text NOT NULL DEFAULT '',
  seo_title text DEFAULT NULL,
  seo_description text DEFAULT NULL,
  seo_keywords text DEFAULT NULL,
  is_system boolean NOT NULL DEFAULT false,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published pages"
  ON pages FOR SELECT
  TO public
  USING (is_published = true);

CREATE POLICY "Anon and authenticated can insert pages"
  ON pages FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anon and authenticated can update pages"
  ON pages FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anon and authenticated can delete pages"
  ON pages FOR DELETE
  TO anon, authenticated
  USING (true);

-- ── menu_items ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_location text NOT NULL DEFAULT 'header',
  label text NOT NULL DEFAULT '',
  url text NOT NULL DEFAULT '/',
  target text NOT NULL DEFAULT '_self',
  display_order integer NOT NULL DEFAULT 0,
  parent_id uuid REFERENCES menu_items(id) ON DELETE CASCADE,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active menu items"
  ON menu_items FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Anon and authenticated can insert menu items"
  ON menu_items FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anon and authenticated can update menu items"
  ON menu_items FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anon and authenticated can delete menu items"
  ON menu_items FOR DELETE
  TO anon, authenticated
  USING (true);

-- ── Seed built-in system pages ──────────────────────────
INSERT INTO pages (title, slug, content, is_system, is_published)
VALUES
  ('About', 'about', '<p>Edit this page in the admin panel.</p>', true, true),
  ('Contact', 'contact', '<p>Edit this page in the admin panel.</p>', true, true)
ON CONFLICT (slug) DO NOTHING;

-- ── Seed default header menu ─────────────────────────────
INSERT INTO menu_items (menu_location, label, url, display_order)
VALUES
  ('header', 'Home', '/', 1),
  ('header', 'Generators', '/generators', 2),
  ('header', 'Shop', '/shop', 3),
  ('header', 'Blog', '/blog', 4),
  ('header', 'About', '/about', 5),
  ('header', 'Contact', '/contact', 6)
ON CONFLICT DO NOTHING;

-- ── Seed default footer quick links ──────────────────────
INSERT INTO menu_items (menu_location, label, url, display_order)
VALUES
  ('footer_quick_links', 'Home', '/', 1),
  ('footer_quick_links', 'Generators', '/generators', 2),
  ('footer_quick_links', 'Blog', '/blog', 3),
  ('footer_quick_links', 'About', '/about', 4),
  ('footer_quick_links', 'Contact', '/contact', 5)
ON CONFLICT DO NOTHING;

-- ── Seed footer categories ────────────────────────────────
INSERT INTO menu_items (menu_location, label, url, display_order)
VALUES
  ('footer_categories', 'All Generators', '/generators', 1),
  ('footer_categories', 'Math Generators', '/generators#math', 2),
  ('footer_categories', 'Tracing Practice', '/generators#tracing', 3),
  ('footer_categories', 'Activity Generators', '/generators#activities', 4)
ON CONFLICT DO NOTHING;
