import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://stbhsxakhczdekhrxfxg.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0YmhzeGFraGN6ZGVraHJ4ZnhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxNTQ5NDMsImV4cCI6MjA4MzczMDk0M30.k5ovpmOd-Hip1NADQ1X_wWaDY5SPY4WtmTM3jY78nQs';

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key exists:', !!supabaseAnonKey);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  image_url: string | null;
  featured_image: string | null;
  image_alt: string | null;
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string | null;
  slug: string | null;
  views: number;
  category_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image_url: string | null;
  category: string;
  file_type: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
