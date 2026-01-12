import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Eye, User, BookOpen, Facebook, Instagram, Linkedin, Twitter, Home, ChevronRight, Search, ArrowLeft, ArrowRight, Send } from 'lucide-react';
import { supabase, BlogPost } from '../lib/supabase';

export function BlogPostPage() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);
  const [popularPosts, setPopularPosts] = useState<BlogPost[]>([]);
  const [previousPost, setPreviousPost] = useState<BlogPost | null>(null);
  const [nextPost, setNextPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [commentForm, setCommentForm] = useState({ name: '', email: '', message: '' });

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
        await fetchPreviousNextPosts(data.created_at);
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

  async function fetchPreviousNextPosts(currentPostDate: string) {
    const { data: previous } = await supabase
      .from('blog_posts')
      .select('*')
      .lt('created_at', currentPostDate)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    const { data: next } = await supabase
      .from('blog_posts')
      .select('*')
      .gt('created_at', currentPostDate)
      .order('created_at', { ascending: true })
      .limit(1)
      .maybeSingle();

    if (previous) setPreviousPost(previous);
    if (next) setNextPost(next);
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

  function handleCommentSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log('Comment submitted:', commentForm);
    setCommentForm({ name: '', email: '', message: '' });
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Post Not Found</h2>
          <Link to="/category" className="text-orange-500 hover:text-orange-600 font-semibold">
            Return to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ paddingTop: '20px', paddingBottom: '48px' }}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
              <nav className="flex items-center space-x-2 text-sm mb-6">
                <Link to="/" className="text-orange-500 hover:text-orange-600 flex items-center">
                  <Home className="w-4 h-4" />
                </Link>
                <ChevronRight className="w-4 h-4 text-gray-400" />
                <Link to="/category" className="text-orange-500 hover:text-orange-600">
                  Blog
                </Link>
                <ChevronRight className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600 truncate max-w-md">{post.title}</span>
              </nav>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                {post.title}
              </h1>

              <div className="flex items-center justify-between flex-wrap gap-6 mb-8 pb-8 border-b-2 border-gray-100">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
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
                  <a
                    href={`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(window.location.href)}&media=${encodeURIComponent(post.image_url || '')}&description=${encodeURIComponent(post.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-red-600 hover:bg-red-700 rounded-lg flex items-center justify-center transition shadow-sm"
                  >
                    <svg className="w-5 h-5 text-white fill-current" viewBox="0 0 24 24">
                      <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/>
                    </svg>
                  </a>
                </div>
              </div>
              {post.image_url && (
                <div className="rounded-2xl overflow-hidden shadow-lg mb-8 relative group">
                  <img
                    src={post.image_url}
                    alt={post.title}
                    className="w-full h-auto"
                  />
                  <a
                    href={`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(window.location.href)}&media=${encodeURIComponent(post.image_url)}&description=${encodeURIComponent(post.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute top-4 right-4 w-12 h-12 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    <svg className="w-6 h-6 text-white fill-current" viewBox="0 0 24 24">
                      <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/>
                    </svg>
                  </a>
                </div>
              )}

              <article className="mb-12">
                <div className="prose prose-lg max-w-none">
                  <p className="text-xl text-gray-700 leading-relaxed mb-8 font-medium first-letter:text-5xl first-letter:font-bold first-letter:text-orange-500 first-letter:mr-1 first-letter:float-left">
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
                  <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                    <User className="w-12 h-12 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-2xl font-bold text-gray-900 mb-2">{post.author}</h4>
                    <p className="text-orange-500 font-semibold mb-4">Content Writer</p>
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

              <div className="border-t-2 border-gray-100 pt-8 mt-8">
                <div className="flex items-center justify-between gap-4 mb-4">
                  {previousPost ? (
                    <Link
                      to={`/blog/${previousPost.id}`}
                      className="flex items-center gap-2 text-pink-600 hover:text-pink-700 font-semibold transition group"
                    >
                      <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition" />
                      <span>Previous Post</span>
                    </Link>
                  ) : (
                    <div></div>
                  )}

                  {nextPost && (
                    <Link
                      to={`/blog/${nextPost.id}`}
                      className="flex items-center gap-2 text-pink-600 hover:text-pink-700 font-semibold transition group"
                    >
                      <span>Next Post</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
                    </Link>
                  )}
                </div>

                <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {previousPost && (
                      <Link
                        to={`/blog/${previousPost.id}`}
                        className="group"
                      >
                        <div className="rounded-xl overflow-hidden shadow-lg mb-4">
                          {previousPost.image_url ? (
                            <img
                              src={previousPost.image_url}
                              alt={previousPost.title}
                              className="w-full h-40 object-cover group-hover:scale-110 transition duration-500"
                            />
                          ) : (
                            <div className="w-full h-40 bg-gradient-to-br from-pink-200 to-purple-300 flex items-center justify-center">
                              <BookOpen className="w-10 h-10 text-white opacity-60" />
                            </div>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-purple-600 mb-2">
                          <Calendar className="w-4 h-4" />
                          <span className="font-medium">{formatDate(previousPost.created_at)}</span>
                        </div>
                        <h4 className="text-sm font-bold text-gray-900 group-hover:text-pink-600 transition line-clamp-2">
                          {previousPost.title}
                        </h4>
                      </Link>
                    )}

                    {nextPost && (
                      <Link
                        to={`/blog/${nextPost.id}`}
                        className="group"
                      >
                        <div className="rounded-xl overflow-hidden shadow-lg mb-4">
                          {nextPost.image_url ? (
                            <img
                              src={nextPost.image_url}
                              alt={nextPost.title}
                              className="w-full h-40 object-cover group-hover:scale-110 transition duration-500"
                            />
                          ) : (
                            <div className="w-full h-40 bg-gradient-to-br from-pink-200 to-purple-300 flex items-center justify-center">
                              <BookOpen className="w-10 h-10 text-white opacity-60" />
                            </div>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-purple-600 mb-2">
                          <Calendar className="w-4 h-4" />
                          <span className="font-medium">{formatDate(nextPost.created_at)}</span>
                        </div>
                        <h4 className="text-sm font-bold text-gray-900 group-hover:text-pink-600 transition line-clamp-2">
                          {nextPost.title}
                        </h4>
                      </Link>
                    )}

                    {relatedPosts.slice(0, nextPost && previousPost ? 1 : 2).map((relatedPost) => (
                      <Link
                        key={relatedPost.id}
                        to={`/blog/${relatedPost.id}`}
                        className="group"
                      >
                        <div className="rounded-xl overflow-hidden shadow-lg mb-4">
                          {relatedPost.image_url ? (
                            <img
                              src={relatedPost.image_url}
                              alt={relatedPost.title}
                              className="w-full h-40 object-cover group-hover:scale-110 transition duration-500"
                            />
                          ) : (
                            <div className="w-full h-40 bg-gradient-to-br from-pink-200 to-purple-300 flex items-center justify-center">
                              <BookOpen className="w-10 h-10 text-white opacity-60" />
                            </div>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-purple-600 mb-2">
                          <Calendar className="w-4 h-4" />
                          <span className="font-medium">{formatDate(relatedPost.created_at)}</span>
                        </div>
                        <h4 className="text-sm font-bold text-gray-900 group-hover:text-pink-600 transition line-clamp-2">
                          {relatedPost.title}
                        </h4>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <div className="border-t-2 border-gray-100 pt-8 mt-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">0 Comments:</h3>

                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8">
                  <h4 className="text-xl font-bold text-gray-900 mb-6">Leave your Comment</h4>
                  <form onSubmit={handleCommentSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                        <input
                          type="text"
                          placeholder="Your name"
                          value={commentForm.name}
                          onChange={(e) => setCommentForm({ ...commentForm, name: e.target.value })}
                          className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-orange-500 focus:outline-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                        <input
                          type="email"
                          placeholder="Your email"
                          value={commentForm.email}
                          onChange={(e) => setCommentForm({ ...commentForm, email: e.target.value })}
                          className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-orange-500 focus:outline-none"
                          required
                        />
                      </div>
                    </div>
                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                      <textarea
                        placeholder="Write your message"
                        value={commentForm.message}
                        onChange={(e) => setCommentForm({ ...commentForm, message: e.target.value })}
                        rows={5}
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-pink-500 focus:outline-none resize-none"
                        required
                      ></textarea>
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-4 rounded-full transition shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                    >
                      <span>Submit Comment</span>
                      <Send className="w-5 h-5" />
                    </button>
                  </form>
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
                    className="w-full pl-5 pr-12 py-4 rounded-full border-2 border-gray-200 focus:border-orange-500 focus:outline-none text-gray-700 shadow-sm bg-gray-50"
                  />
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-full font-semibold transition shadow-md">
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
                            <div className="w-full h-full bg-gradient-to-br from-orange-200 to-amber-300 flex items-center justify-center">
                              <BookOpen className="w-8 h-8 text-white opacity-60" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 text-xs text-orange-500 mb-2">
                            <Calendar className="w-4 h-4" />
                            <span className="font-medium">{formatDate(recentPost.created_at)}</span>
                          </div>
                          <h4 className="text-sm font-bold text-gray-900 group-hover:text-orange-500 transition line-clamp-2 leading-snug">
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
                            <div className="w-full h-full bg-gradient-to-br from-orange-200 to-amber-300 flex items-center justify-center">
                              <BookOpen className="w-8 h-8 text-white opacity-60" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 text-xs text-orange-500 mb-2">
                            <Eye className="w-4 h-4" />
                            <span className="font-medium">{popularPost.views.toLocaleString()} views</span>
                          </div>
                          <h4 className="text-sm font-bold text-gray-900 group-hover:text-orange-500 transition line-clamp-2 leading-snug">
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
