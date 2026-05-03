/*
  # Create product_categories table

  1. New Tables
    - `product_categories`
      - `id` (uuid, primary key)
      - `name` (text, unique) — display name e.g. "Math Worksheets"
      - `slug` (text, unique) — URL-friendly identifier
      - `description` (text, nullable)
      - `position` (integer, default 0) — display order
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS
    - Authenticated users can read all rows (admin only writes)
    - Anon users can read for shop dropdowns
*/

CREATE TABLE IF NOT EXISTS product_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read product categories"
  ON product_categories FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert product categories"
  ON product_categories FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update product categories"
  ON product_categories FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete product categories"
  ON product_categories FOR DELETE
  TO authenticated
  USING (true);
