/*
  # Allow Anonymous Blog Post Creation
  
  1. Changes
    - Update blog_posts INSERT policy to allow anonymous users
    - Update blog_posts UPDATE policy to allow anonymous users
    - Update blog_posts DELETE policy to allow anonymous users
    
  2. Purpose
    - Enable admin interface to create/manage blog posts without authentication
    - Maintain public read access for all users
    
  3. Security Notes
    - In production, you should add authentication and restrict these policies
    - This is for development/manual content management
*/

-- Drop existing policies for INSERT, UPDATE, DELETE
DROP POLICY IF EXISTS "Authenticated users can create posts" ON blog_posts;
DROP POLICY IF EXISTS "Authenticated users can update posts" ON blog_posts;
DROP POLICY IF EXISTS "Authenticated users can delete posts" ON blog_posts;

-- Allow anyone to create blog posts (for admin interface)
CREATE POLICY "Anyone can create blog posts"
  ON blog_posts
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow anyone to update blog posts (for admin interface)
CREATE POLICY "Anyone can update blog posts"
  ON blog_posts
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Allow anyone to delete blog posts (for admin interface)
CREATE POLICY "Anyone can delete blog posts"
  ON blog_posts
  FOR DELETE
  TO anon, authenticated
  USING (true);
