import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Calendar, User, BookOpen, Home, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
}

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  image_url: string | null;
  created_at: string;
  category_id: string;
  categories: {
    name: string;
    slug: string;
  };
}

export default function CategoryPage() {
  const { slug } = useParams<{ slug?: string }>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
    fetchPosts();
  }, [slug]);

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching categories:', error);
      return;
    }

    setCategories(data || []);
    if (slug) {
      const category = data?.find((cat) => cat.slug === slug);
      setSelectedCategory(category?.id || null);
    }
  };

  const fetchPosts = async () => {
    setLoading(true);
    let query = supabase
      .from('blog_posts')
      .select('*, categories(name, slug)')
      .eq('status', 'published')
      .lte('published_at', new Date().toISOString())
      .order('created_at', { ascending: false });

    if (slug) {
      const { data: categoryData } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', slug)
        .maybeSingle();

      if (categoryData) {
        query = query.eq('category_id', categoryData.id);
      }
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching posts:', error);
      setLoading(false);
      return;
    }

    setPosts(data || []);
    setLoading(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const currentCategory = categories.find((cat) => cat.slug === slug);
  const pageTitle = currentCategory ? currentCategory.name : 'All';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ paddingTop: '20px', paddingBottom: '48px' }}>
        <nav className="flex items-center space-x-2 text-sm mb-8">
          <Link to="/" className="text-orange-600 hover:text-orange-700 flex items-center">
            Home
          </Link>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <Link to="/category" className="text-orange-600 hover:text-orange-700">
            Blog
          </Link>
        </nav>

        <div className="flex items-start justify-between mb-8">
          <h1 className="text-5xl font-bold text-gray-900">{pageTitle}</h1>
          <div className="text-right">
            <p className="text-gray-600 text-lg">All Categories Show here.</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm p-6 mb-12">
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              to="/category"
              className={`px-8 py-3 rounded-full font-semibold transition text-base ${
                !slug
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </Link>
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/category/${category.slug}`}
                className={`px-8 py-3 rounded-full font-semibold transition text-base ${
                  slug === category.slug
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-xl">No posts found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => {
              const thumb = (post as any).featured_image || post.image_url;
              const href = (post as any).slug ? `/blog/${(post as any).slug}` : `/blog/${post.id}`;
              return (
              <Link
                key={post.id}
                to={href}
                className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300"
              >
                <div className="relative">
                  <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500"></div>
                  {thumb ? (
                    <img
                      src={thumb}
                      alt={post.title}
                      className="w-full h-64 object-cover group-hover:scale-105 transition duration-500"
                    />
                  ) : (
                    <div className="w-full h-64 bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center">
                      <BookOpen className="w-16 h-16 text-orange-300" />
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm text-gray-600">{post.author}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">{formatDate(post.created_at)}</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-orange-600 mb-3 group-hover:text-orange-700 transition line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-gray-600 text-sm line-clamp-3 mb-4">{post.excerpt}</p>

                  {post.categories && (
                    <div className="flex flex-wrap gap-2">
                      <span className="px-4 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">
                        {post.categories.name}
                      </span>
                    </div>
                  )}
                </div>
              </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
