/*
  # Fix Blog Posts RLS Policies
  
  1. Changes
    - Drop existing policies
    - Recreate policies with correct configuration to allow public read access
    
  2. Security
    - Allow anyone (including anonymous users) to read blog posts
    - Only authenticated users can create, update, or delete posts
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Authenticated users can create posts" ON blog_posts;
DROP POLICY IF EXISTS "Authenticated users can update posts" ON blog_posts;
DROP POLICY IF EXISTS "Authenticated users can delete posts" ON blog_posts;

-- Create new policies with correct configuration
CREATE POLICY "Anyone can view blog posts"
  ON blog_posts
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create posts"
  ON blog_posts
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update posts"
  ON blog_posts
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete posts"
  ON blog_posts
  FOR DELETE
  TO authenticated
  USING (true);