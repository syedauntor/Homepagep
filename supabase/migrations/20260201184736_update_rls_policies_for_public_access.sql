/*
  # Update RLS Policies for Public Access
  
  1. Changes
    - Update blog_posts policies to explicitly allow anon role
    - Update categories policies to explicitly allow anon role
    - Update contact_submissions to allow anon submissions
    
  2. Security
    - Public read access for blog posts and categories
    - Public insert for contact submissions
    - Authenticated users can manage blog posts
*/

-- Blog Posts: Allow public read access
DROP POLICY IF EXISTS "Anyone can view blog posts" ON blog_posts;
CREATE POLICY "Anyone can view blog posts"
  ON blog_posts
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Categories: Allow public read access
DROP POLICY IF EXISTS "Anyone can view categories" ON categories;
CREATE POLICY "Anyone can view categories"
  ON categories
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Contact Submissions: Allow public insert
DROP POLICY IF EXISTS "Anyone can submit contact form" ON contact_submissions;
CREATE POLICY "Anyone can submit contact form"
  ON contact_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);