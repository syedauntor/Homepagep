import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Eye, User, BookOpen, Facebook, Instagram, Linkedin, Twitter, Home, ChevronRight, Search } from 'lucide-react';
import { supabase, BlogPost } from '../lib/supabase';

export function BlogPostPage() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);
  const [popularPosts, setPopularPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchPost();
      fetchSidebarPosts();
      window.scrollTo(0, 0);
    }
  }, [id]);

  async function fetchPost() {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setPost(data);
        await incrementViews(data.id);
        await fetchRelatedPosts(data.id);
      }
    } catch (error) {
      console.error('Error fetching post:', error);
    } finally {
      setLoading(false);
    }
  }

  async function incrementViews(postId: string) {
    await supabase.rpc('increment_post_views', { post_id: postId }).catch(() => {});
  }

  async function fetchRelatedPosts(currentPostId: string) {
    const { data } = await supabase
      .from('blog_posts')
      .select('*')
      .neq('id', currentPostId)
      .order('created_at', { ascending: false })
      .limit(3);

    if (data) setRelatedPosts(data);
  }

  async function fetchSidebarPosts() {
    const { data: recent } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(3);

    const { data: popular } = await supabase
      .from('blog_posts')
      .select('*')
      .order('views', { ascending: false })
      .limit(3);

    if (recent) setRecentPosts(recent);
    if (popular) setPopularPosts(popular);
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  function calculateReadTime(content: string) {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min read`;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Post Not Found</h2>
          <Link to="/blog" className="text-emerald-600 hover:text-emerald-700 font-semibold">
            Return to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="flex items-center space-x-2 text-sm mb-8">
            <Link to="/" className="text-emerald-600 hover:text-emerald-700 flex items-center">
              <Home className="w-4 h-4" />
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <Link to="/blog" className="text-emerald-600 hover:text-emerald-700">
              Blog
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600 truncate max-w-md">{post.title}</span>
          </nav>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-8 leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center justify-between flex-wrap gap-6">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                <User className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-lg">{post.author}</p>
                <p className="text-sm text-gray-500">{formatDate(post.created_at)}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-gray-700 font-semibold mr-2">Share:</span>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center justify-center transition shadow-sm"
              >
                <Facebook className="w-5 h-5 text-white fill-current" />
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${window.location.href}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-blue-700 hover:bg-blue-800 rounded-lg flex items-center justify-center transition shadow-sm"
              >
                <Linkedin className="w-5 h-5 text-white fill-current" />
              </a>
              <a
                href={`https://twitter.com/intent/tweet?url=${window.location.href}&text=${post.title}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-sky-500 hover:bg-sky-600 rounded-lg flex items-center justify-center transition shadow-sm"
              >
                <Twitter className="w-5 h-5 text-white fill-current" />
              </a>
              <a
                href={`https://www.instagram.com/`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 hover:opacity-90 rounded-lg flex items-center justify-center transition shadow-sm"
              >
                <Instagram className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ paddingTop: '20px', paddingBottom: '48px' }}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
              {post.image_url && (
                <div className="rounded-2xl overflow-hidden shadow-lg mb-8">
                  <img
                    src={post.image_url}
                    alt={post.title}
                    className="w-full h-auto"
                  />
                </div>
              )}

              <article className="mb-12">
                <div className="prose prose-lg max-w-none">
                  <p className="text-xl text-gray-700 leading-relaxed mb-8 font-medium first-letter:text-5xl first-letter:font-bold first-letter:text-emerald-600 first-letter:mr-1 first-letter:float-left">
                    {post.excerpt}
                  </p>

                  <div className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">
                    {post.content}
                  </div>
                </div>
              </article>

              <div className="border-t-2 border-gray-100 pt-8">
                <h3 className="text-3xl font-bold text-gray-900 mb-6">Writer</h3>
                <div className="flex items-start space-x-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                    <User className="w-12 h-12 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-2xl font-bold text-gray-900 mb-2">{post.author}</h4>
                    <p className="text-emerald-600 font-semibold mb-4">Content Writer</p>
                    <p className="text-gray-600 leading-relaxed mb-6 text-lg">
                      A passionate writer creating engaging content and sharing valuable insights with readers around the world.
                    </p>
                    <div className="flex items-center space-x-4">
                      <a href="#" className="text-blue-600 hover:text-blue-700 transition transform hover:scale-110">
                        <Facebook className="w-6 h-6" />
                      </a>
                      <a href="#" className="text-sky-500 hover:text-sky-600 transition transform hover:scale-110">
                        <Twitter className="w-6 h-6" />
                      </a>
                      <a href="#" className="text-pink-600 hover:text-pink-700 transition transform hover:scale-110">
                        <Instagram className="w-6 h-6" />
                      </a>
                      <a href="#" className="text-blue-700 hover:text-blue-800 transition transform hover:scale-110">
                        <Linkedin className="w-6 h-6" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              <div className="bg-white rounded-3xl shadow-xl p-6">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search here"
                    className="w-full pl-5 pr-12 py-4 rounded-full border-2 border-gray-200 focus:border-emerald-500 focus:outline-none text-gray-700 shadow-sm bg-gray-50"
                  />
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-emerald-600 hover:bg-emerald-700 text-white p-3 rounded-full font-semibold transition shadow-md">
                    <Search className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-3xl shadow-xl p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-gray-200">
                  Recent Articles
                </h3>
                <div className="space-y-6">
                  {recentPosts.map((recentPost) => (
                    <Link
                      key={recentPost.id}
                      to={`/blog/${recentPost.id}`}
                      className="block group"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="w-24 h-20 flex-shrink-0 rounded-xl overflow-hidden shadow-md">
                          {recentPost.image_url ? (
                            <img
                              src={recentPost.image_url}
                              alt={recentPost.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-emerald-200 to-teal-300 flex items-center justify-center">
                              <BookOpen className="w-8 h-8 text-white opacity-60" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 text-xs text-emerald-600 mb-2">
                            <Calendar className="w-4 h-4" />
                            <span className="font-medium">{formatDate(recentPost.created_at)}</span>
                          </div>
                          <h4 className="text-sm font-bold text-gray-900 group-hover:text-emerald-600 transition line-clamp-2 leading-snug">
                            {recentPost.title}
                          </h4>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-3xl shadow-xl p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-gray-200">
                  Popular Articles
                </h3>
                <div className="space-y-6">
                  {popularPosts.map((popularPost) => (
                    <Link
                      key={popularPost.id}
                      to={`/blog/${popularPost.id}`}
                      className="block group"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="w-24 h-20 flex-shrink-0 rounded-xl overflow-hidden shadow-md">
                          {popularPost.image_url ? (
                            <img
                              src={popularPost.image_url}
                              alt={popularPost.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-emerald-200 to-teal-300 flex items-center justify-center">
                              <BookOpen className="w-8 h-8 text-white opacity-60" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 text-xs text-emerald-600 mb-2">
                            <Eye className="w-4 h-4" />
                            <span className="font-medium">{popularPost.views.toLocaleString()} views</span>
                          </div>
                          <h4 className="text-sm font-bold text-gray-900 group-hover:text-emerald-600 transition line-clamp-2 leading-snug">
                            {popularPost.title}
                          </h4>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
