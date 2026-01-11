/*
  # Add increment views function

  1. Functions
    - `increment_post_views` - Safely increments the view count for a blog post
      - Takes post_id as parameter
      - Increments views by 1
      - Returns void
  
  2. Purpose
    - Provides a safe way to increment view counts without race conditions
    - Used when users view individual blog posts
*/

CREATE OR REPLACE FUNCTION increment_post_views(post_id uuid)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE blog_posts
  SET views = views + 1
  WHERE id = post_id;
END;
$$;