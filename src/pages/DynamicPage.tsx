import { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
  seo_title: string | null;
  seo_description: string | null;
  is_published: boolean;
}

export function DynamicPage() {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (slug) fetchPage(slug);
  }, [slug]);

  async function fetchPage(pageSlug: string) {
    setLoading(true);
    const { data } = await supabase
      .from('pages')
      .select('*')
      .eq('slug', pageSlug)
      .eq('is_published', true)
      .maybeSingle();

    if (data) {
      setPage(data);
      if (data.seo_title) document.title = data.seo_title;
      else if (data.title) document.title = data.title + ' | Print&Use';
    } else {
      setNotFound(true);
    }
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound) {
    return <Navigate to="/" replace />;
  }

  if (!page) return null;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-50 to-slate-100 py-16 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900">{page.title}</h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="blog-content prose prose-lg max-w-none text-slate-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        </div>
      </section>
    </div>
  );
}
