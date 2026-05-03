/*
  # Add parent_id and position to categories

  1. Changes
    - Add `parent_id` (uuid, nullable, self-referencing FK) — links a subcategory to its parent
    - Add `position` (integer, default 0) — controls display order within a parent
  2. Index
    - Index on parent_id for fast child lookups
*/

ALTER TABLE categories
  ADD COLUMN IF NOT EXISTS parent_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS position integer NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON categories(parent_id);
