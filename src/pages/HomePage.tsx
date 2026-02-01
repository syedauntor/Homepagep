import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Calendar, Eye, ArrowRight, Sparkles, TrendingUp, Star } from 'lucide-react';
import { supabase, BlogPost } from '../lib/supabase';

export function HomePage() {
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);
  const [popularPosts, setPopularPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      const { data: allPosts, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (allPosts) {
        setFeaturedPosts(allPosts.slice(0, 3));
        setRecentPosts(allPosts.slice(0, 6));

        const sorted = [...allPosts].sort((a, b) => b.views - a.views);
        setPopularPosts(sorted.slice(0, 4));
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <Sparkles className="w-8 h-8 text-pink-600" />
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900">Print & Use</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
            Free printable activity books, worksheets, and educational resources for kids and adults.
            Download, print, and use them anywhere!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/generators"
              className="bg-pink-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-pink-700 transition shadow-lg inline-flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-5 h-5" />
              <span>Create Worksheets</span>
            </Link>
            <Link
              to="/blog"
              className="bg-white text-pink-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-50 transition border-2 border-pink-600 inline-flex items-center justify-center space-x-2"
            >
              <BookOpen className="w-5 h-5" />
              <span>Browse All Posts</span>
            </Link>
          </div>
        </div>
      </section>

      {loading ? (
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
        </div>
      ) : (
        <>
          <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-12">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
                    <Star className="w-8 h-8 text-pink-600" />
                    <span>Featured Posts</span>
                  </h2>
                  <p className="text-gray-600 mt-2">Check out our most popular content</p>
                </div>
              </div>

              {featuredPosts.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-2xl">
                  <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No posts available yet</h3>
                  <p className="text-gray-600">Check back soon for new content!</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-3 gap-8">
                  {featuredPosts.map((post) => (
                    <Link
                      key={post.id}
                      to={`/blog/${post.id}`}
                      className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-2xl transition"
                    >
                      <div className="h-48 overflow-hidden relative">
                        {post.image_url ? (
                          <img
                            src={post.image_url}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                          />
                        ) : (
                          <div className="h-full bg-gradient-to-br from-pink-200 to-purple-300 flex items-center justify-center">
                            <BookOpen className="w-12 h-12 text-white opacity-50" />
                          </div>
                        )}
                      </div>
                      <div className="p-6">
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(post.created_at)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-pink-600 font-semibold">
                            <Eye className="w-4 h-4" />
                            <span>{post.views.toLocaleString()}</span>
                          </div>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-pink-600 transition line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">By {post.author}</span>
                          <span className="text-pink-600 font-semibold flex items-center space-x-2 group-hover:space-x-3 transition-all">
                            <span>Read</span>
                            <ArrowRight className="w-4 h-4" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </section>

          <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">Recent Posts</h2>
                    <Link
                      to="/blog"
                      className="text-pink-600 font-semibold hover:text-pink-700 transition flex items-center space-x-2"
                    >
                      <span>View All</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>

                  <div className="space-y-6">
                    {recentPosts.map((post) => (
                      <Link
                        key={post.id}
                        to={`/blog/${post.id}`}
                        className="bg-white rounded-xl shadow-md overflow-hidden group hover:shadow-xl transition flex flex-col sm:flex-row"
                      >
                        <div className="sm:w-64 h-48 sm:h-auto overflow-hidden relative flex-shrink-0">
                          {post.image_url ? (
                            <img
                              src={post.image_url}
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                            />
                          ) : (
                            <div className="h-full bg-gradient-to-br from-pink-200 to-purple-300 flex items-center justify-center">
                              <BookOpen className="w-12 h-12 text-white opacity-50" />
                            </div>
                          )}
                        </div>
                        <div className="p-6 flex-1">
                          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(post.created_at)}</span>
                            </div>
                            <div className="flex items-center gap-2 text-pink-600 font-semibold">
                              <Eye className="w-4 h-4" />
                              <span>{post.views.toLocaleString()}</span>
                            </div>
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-pink-600 transition line-clamp-2">
                            {post.title}
                          </h3>
                          <p className="text-gray-600 line-clamp-2 mb-3">{post.excerpt}</p>
                          <span className="text-sm text-gray-500">By {post.author}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center space-x-2 mb-8">
                    <TrendingUp className="w-6 h-6 text-pink-600" />
                    <h2 className="text-2xl font-bold text-gray-900">Most Popular</h2>
                  </div>

                  <div className="space-y-4">
                    {popularPosts.map((post, index) => (
                      <Link
                        key={post.id}
                        to={`/blog/${post.id}`}
                        className="bg-white rounded-xl p-4 shadow-md hover:shadow-xl transition group block"
                      >
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-pink-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                            {index + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-900 group-hover:text-pink-600 transition line-clamp-2 mb-2">
                              {post.title}
                            </h3>
                            <div className="flex items-center gap-3 text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                <span className="font-semibold text-pink-600">{post.views.toLocaleString()}</span>
                              </div>
                              <span>•</span>
                              <span>{formatDate(post.created_at)}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      <section className="py-16 bg-gradient-to-br from-pink-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-pink-100 mb-8 leading-relaxed">
            Create custom worksheets and activity sheets in minutes. Perfect for teachers, parents, and educators.
          </p>
          <Link
            to="/generators"
            className="bg-white text-pink-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition shadow-lg inline-flex items-center justify-center space-x-2"
          >
            <Sparkles className="w-5 h-5" />
            <span>Start Creating Now</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
