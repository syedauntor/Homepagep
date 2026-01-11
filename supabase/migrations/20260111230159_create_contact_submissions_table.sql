/*
  # Create contact submissions table

  1. New Tables
    - `contact_submissions`
      - `id` (uuid, primary key)
      - `name` (text) - Sender's name
      - `email` (text) - Sender's email address
      - `subject` (text) - Message subject
      - `message` (text) - Message content
      - `created_at` (timestamptz) - Submission timestamp
  
  2. Security
    - Enable RLS on `contact_submissions` table
    - Add policy for anyone to create submissions (public form)
    - Add policy for authenticated users to read their own submissions
*/

CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit contact form"
  ON contact_submissions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Users can read their own submissions"
  ON contact_submissions FOR SELECT
  TO authenticated
  USING (email = current_setting('request.jwt.claims', true)::json->>'email');