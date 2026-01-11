import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Eye, Clock, User, BookOpen, ArrowRight, Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
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
      <div className="bg-white py-12 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">{post.author}</p>
                <p className="text-sm text-gray-500">{formatDate(post.created_at)}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center transition"
              >
                <Facebook className="w-5 h-5 text-white" />
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${window.location.href}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-blue-700 hover:bg-blue-800 rounded-full flex items-center justify-center transition"
              >
                <Linkedin className="w-5 h-5 text-white" />
              </a>
              <a
                href={`https://twitter.com/intent/tweet?url=${window.location.href}&text=${post.title}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-sky-500 hover:bg-sky-600 rounded-full flex items-center justify-center transition"
              >
                <Twitter className="w-5 h-5 text-white" />
              </a>
              <a
                href={`https://www.instagram.com/`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 hover:opacity-90 rounded-full flex items-center justify-center transition"
              >
                <Instagram className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {post.image_url && (
              <div className="mb-8 rounded-2xl overflow-hidden shadow-lg">
                <img
                  src={post.image_url}
                  alt={post.title}
                  className="w-full h-auto"
                />
              </div>
            )}

            <article className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <div className="prose prose-lg max-w-none">
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  {post.excerpt}
                </p>

                <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {post.content}
                </div>
              </div>
            </article>

            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Writer</h3>
              <div className="flex items-start space-x-4">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-10 h-10 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-gray-900 mb-1">{post.author}</h4>
                  <p className="text-emerald-600 font-medium mb-3">Content Writer</p>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    A passionate writer creating engaging content and sharing valuable insights with readers around the world.
                  </p>
                  <div className="flex items-center space-x-3">
                    <a href="#" className="text-blue-600 hover:text-blue-700 transition">
                      <Facebook className="w-5 h-5" />
                    </a>
                    <a href="#" className="text-sky-500 hover:text-sky-600 transition">
                      <Twitter className="w-5 h-5" />
                    </a>
                    <a href="#" className="text-pink-600 hover:text-pink-700 transition">
                      <Instagram className="w-5 h-5" />
                    </a>
                    <a href="#" className="text-blue-700 hover:text-blue-800 transition">
                      <Linkedin className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {relatedPosts.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h3>
                <div className="space-y-6">
                  {relatedPosts.map((relatedPost) => (
                    <Link
                      key={relatedPost.id}
                      to={`/blog/${relatedPost.id}`}
                      className="flex items-start space-x-4 group"
                    >
                      <div className="w-32 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                        {relatedPost.image_url ? (
                          <img
                            src={relatedPost.image_url}
                            alt={relatedPost.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-emerald-200 to-teal-300 flex items-center justify-center">
                            <BookOpen className="w-8 h-8 text-white opacity-50" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 text-xs text-gray-500 mb-2">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(relatedPost.created_at)}</span>
                        </div>
                        <h4 className="font-bold text-gray-900 group-hover:text-emerald-600 transition line-clamp-2">
                          {relatedPost.title}
                        </h4>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Articles</h3>
                <div className="space-y-5">
                  {recentPosts.map((recentPost) => (
                    <Link
                      key={recentPost.id}
                      to={`/blog/${recentPost.id}`}
                      className="block group"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-20 h-16 flex-shrink-0 rounded-lg overflow-hidden">
                          {recentPost.image_url ? (
                            <img
                              src={recentPost.image_url}
                              alt={recentPost.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-emerald-200 to-teal-300 flex items-center justify-center">
                              <BookOpen className="w-6 h-6 text-white opacity-50" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-1 text-xs text-gray-500 mb-1">
                            <Calendar className="w-3 h-3" />
                            <span>{formatDate(recentPost.created_at)}</span>
                          </div>
                          <h4 className="text-sm font-semibold text-gray-900 group-hover:text-emerald-600 transition line-clamp-2">
                            {recentPost.title}
                          </h4>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Popular Articles</h3>
                <div className="space-y-5">
                  {popularPosts.map((popularPost) => (
                    <Link
                      key={popularPost.id}
                      to={`/blog/${popularPost.id}`}
                      className="block group"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-20 h-16 flex-shrink-0 rounded-lg overflow-hidden">
                          {popularPost.image_url ? (
                            <img
                              src={popularPost.image_url}
                              alt={popularPost.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-emerald-200 to-teal-300 flex items-center justify-center">
                              <BookOpen className="w-6 h-6 text-white opacity-50" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-1 text-xs text-gray-500 mb-1">
                            <Eye className="w-3 h-3" />
                            <span>{popularPost.views.toLocaleString()} views</span>
                          </div>
                          <h4 className="text-sm font-semibold text-gray-900 group-hover:text-emerald-600 transition line-clamp-2">
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
