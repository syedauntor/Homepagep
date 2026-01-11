import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Eye, ArrowLeft, Clock, User, Share2, BookOpen, ArrowRight } from 'lucide-react';
import { supabase, BlogPost } from '../lib/supabase';

export function BlogPostPage() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchPost();
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
    <div className="min-h-screen bg-white">
      <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/blog"
            className="inline-flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 font-semibold mb-8 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition" />
            <span>Back to Blog</span>
          </Link>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-gray-600">
            <div className="flex items-center space-x-2">
              <User className="w-5 h-5 text-emerald-600" />
              <span className="font-medium">{post.author}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-emerald-600" />
              <span>{formatDate(post.created_at)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-emerald-600" />
              <span>{calculateReadTime(post.content)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Eye className="w-5 h-5 text-emerald-600" />
              <span>{post.views.toLocaleString()} views</span>
            </div>
          </div>
        </div>
      </div>

      {post.image_url && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16">
          <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl">
            <img
              src={post.image_url}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-lg max-w-none">
          <p className="text-xl text-gray-700 leading-relaxed mb-8 font-medium">
            {post.excerpt}
          </p>

          <div className="text-gray-700 leading-relaxed whitespace-pre-line">
            {post.content}
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <button className="inline-flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 font-semibold">
            <Share2 className="w-5 h-5" />
            <span>Share this post</span>
          </button>
        </div>
      </article>

      {relatedPosts.length > 0 && (
        <section className="bg-gray-50 py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Related Posts</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  to={`/blog/${relatedPost.id}`}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-2xl transition"
                >
                  <div className="h-48 overflow-hidden">
                    {relatedPost.image_url ? (
                      <img
                        src={relatedPost.image_url}
                        alt={relatedPost.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                      />
                    ) : (
                      <div className="h-full bg-gradient-to-br from-emerald-200 to-teal-300 flex items-center justify-center">
                        <BookOpen className="w-12 h-12 text-white opacity-50" />
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center space-x-2 text-sm text-gray-500 mb-3">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(relatedPost.created_at)}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-emerald-600 transition line-clamp-2">
                      {relatedPost.title}
                    </h3>
                    <p className="text-gray-600 line-clamp-2 mb-4">{relatedPost.excerpt}</p>
                    <span className="text-emerald-600 font-semibold flex items-center space-x-2 group-hover:space-x-3 transition-all">
                      <span>Read More</span>
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
