import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Eye, User, BookOpen, Facebook, Instagram, Linkedin, Twitter, Home, ChevronRight, Search, ArrowLeft, ArrowRight, Send, ShoppingBag } from 'lucide-react';
import { blogApi, authorsApi, productsApi, settingsApi, BlogPost, Product, Author } from '../lib/api';

interface BlogContentProps {
  html: string;
  pageUrl: string;
  pageTitle: string;
  pageDescription: string;
}

/* Parses the blog HTML and returns segments: either plain HTML strings or
   image objects that we render as React elements with a Pinterest overlay. */
interface ImgSegment { type: 'img'; src: string; alt: string; rest: string }
interface HtmlSegment { type: 'html'; content: string }
type Segment = ImgSegment | HtmlSegment;

function parseSegments(html: string): Segment[] {
  const segments: Segment[] = [];
  // Match every <img ... > tag (self-closing or not)
  const imgRe = /<img\b([^>]*?)\s*\/?>/gi;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = imgRe.exec(html)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: 'html', content: html.slice(lastIndex, match.index) });
    }
    const attrs = match[1] || '';
    const srcM = attrs.match(/\bsrc=["']([^"']+)["']/i);
    const altM = attrs.match(/\balt=["']([^"']*)["']/i);
    const src = srcM ? srcM[1] : '';
    const alt = altM ? altM[1] : '';
    // rest = all attrs except src and alt, to preserve width/class etc.
    const rest = attrs
      .replace(/\bsrc=["'][^"']*["']/i, '')
      .replace(/\balt=["'][^"']*["']/i, '')
      .trim();
    segments.push({ type: 'img', src, alt, rest });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < html.length) {
    segments.push({ type: 'html', content: html.slice(lastIndex) });
  }
  return segments;
}

function PinterestImage({
  src, alt, rest, pageUrl, pageTitle, pageDescription,
}: ImgSegment & { pageUrl: string; pageTitle: string; pageDescription: string }) {
  const [hovered, setHovered] = useState(false);
  const isHosted = src.startsWith('http');

  const desc = [alt || pageTitle, pageDescription ? pageDescription.slice(0, 120) : '']
    .filter(Boolean).join(' | ');
  const pinterestUrl = isHosted
    ? `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(pageUrl)}&media=${encodeURIComponent(src)}&description=${encodeURIComponent(desc)}`
    : '';

  return (
    <span
      style={{ position: 'relative', display: 'block', width: '100%', margin: '1.5rem 0', lineHeight: 0 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img
        src={src}
        alt={alt}
        {...(rest ? { 'data-rest': rest } : {})}
        style={{ display: 'block', width: '100%', height: 'auto', borderRadius: '8px', margin: 0 }}
      />
      {isHosted && (
        <a
          href={pinterestUrl}
          target="_blank"
          rel="noopener noreferrer"
          title="Save to Pinterest"
          aria-label="Save to Pinterest"
          onClick={e => e.stopPropagation()}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            width: '44px',
            height: '44px',
            background: '#E60023',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: hovered ? 1 : 0,
            pointerEvents: hovered ? 'auto' : 'none',
            transition: 'opacity 0.2s ease, transform 0.18s ease',
            boxShadow: '0 3px 14px rgba(0,0,0,0.4)',
            zIndex: 20,
            textDecoration: 'none',
            cursor: 'pointer',
            transform: hovered ? 'scale(1.08)' : 'scale(1)',
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" style={{ display: 'block', flexShrink: 0 }}>
            <path fill="#ffffff" d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12C24 5.373 18.627 0 12 0z" />
          </svg>
        </a>
      )}
    </span>
  );
}

function BlogContent({ html, pageUrl, pageTitle, pageDescription }: BlogContentProps) {
  const segments = parseSegments(html);

  return (
    <div className="text-gray-700 text-lg leading-relaxed blog-content">
      {segments.map((seg, i) => {
        if (seg.type === 'img') {
          return (
            <PinterestImage
              key={i}
              {...seg}
              pageUrl={pageUrl}
              pageTitle={pageTitle}
              pageDescription={pageDescription}
            />
          );
        }
        return (
          <span
            key={i}
            dangerouslySetInnerHTML={{ __html: seg.content }}
          />
        );
      })}
    </div>
  );
}

type AuthorProfile = Pick<Author, 'name' | 'designation' | 'bio' | 'avatar_url' | 'fb_url' | 'ig_url' | 'x_url' | 'linkedin_url' | 'pinterest_url'>;

export function BlogPostPage() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);
  const [popularPosts, setPopularPosts] = useState<BlogPost[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [previousPost, setPreviousPost] = useState<BlogPost | null>(null);
  const [nextPost, setNextPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [commentForm, setCommentForm] = useState({ name: '', email: '', message: '' });
  const [showFeaturedImage, setShowFeaturedImage] = useState(true);
  const [authorProfile, setAuthorProfile] = useState<AuthorProfile | null>(null);

  useEffect(() => {
    if (id) {
      fetchPost();
      fetchSidebarPosts();
      fetchProducts();
      fetchSettings();
      window.scrollTo(0, 0);
    }
  }, [id]);

  async function fetchSettings() {
    settingsApi.get('post_featured_image_enabled')
      .then(data => { if (data) setShowFeaturedImage(data.value === 'true'); })
      .catch(() => {});
  }

  async function fetchPost() {
    try {
      const data = await blogApi.get(id!);
      if (data) {
        setPost(data);
        blogApi.incrementViews(data.id).catch(() => {});
        fetchRelatedPosts(data.id);
        fetchPreviousNextPosts(data.id);
        if (data.author) fetchAuthorProfile(data.author);
      }
    } catch (error) {
      console.error('Error fetching post:', error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchAuthorProfile(authorName: string) {
    authorsApi.getByName(authorName)
      .then(data => setAuthorProfile(data))
      .catch(() => {});
  }

  async function fetchRelatedPosts(currentPostId: string) {
    blogApi.list({ limit: 4 })
      .then(data => setRelatedPosts(data.filter(p => p.id !== currentPostId).slice(0, 3)))
      .catch(() => {});
  }

  async function fetchPreviousNextPosts(postId: string) {
    blogApi.prev(postId).then(data => { if (data) setPreviousPost(data); }).catch(() => {});
    blogApi.next(postId).then(data => { if (data) setNextPost(data); }).catch(() => {});
  }

  async function fetchSidebarPosts() {
    blogApi.list({ limit: 3 }).then(setRecentPosts).catch(() => {});
    blogApi.list({ limit: 3, sort: 'views_desc' }).then(setPopularPosts).catch(() => {});
  }

  async function fetchProducts() {
    productsApi.list({ is_active: true, limit: 4 })
      .then(data => setProducts(data))
      .catch(() => {})
      .finally(() => setProductsLoading(false));
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

  useEffect(() => {
    if (!post) return;

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.title,
      description: post.excerpt || post.seo_description || '',
      image: post.featured_image || post.image_url || undefined,
      author: {
        '@type': 'Person',
        name: post.author,
      },
      publisher: {
        '@type': 'Organization',
        name: 'KidsMathWorksheets',
        logo: {
          '@type': 'ImageObject',
          url: `${window.location.origin}/image.png`,
        },
      },
      datePublished: post.created_at,
      dateModified: post.updated_at || post.created_at,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': window.location.href,
      },
    };

    const existingScript = document.getElementById('article-schema');
    if (existingScript) existingScript.remove();

    const script = document.createElement('script');
    script.id = 'article-schema';
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => {
      const s = document.getElementById('article-schema');
      if (s) s.remove();
    };
  }, [post]);

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
      <head>
        <title>{post.seo_title || post.title}</title>
        <meta name="description" content={post.seo_description || post.excerpt} />
        {post.seo_keywords && <meta name="keywords" content={post.seo_keywords} />}
        <meta property="og:title" content={post.seo_title || post.title} />
        <meta property="og:description" content={post.seo_description || post.excerpt} />
        {post.featured_image && <meta property="og:image" content={post.featured_image} />}
        <meta property="og:url" content={window.location.href} />
      </head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ paddingTop: '20px', paddingBottom: '48px' }}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-xl p-5 md:p-8 lg:p-12">
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

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 pb-8 border-b-2 border-gray-100">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                    <User className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-lg">{post.author}</p>
                    <p className="text-sm text-gray-500">{formatDate(post.created_at)}</p>
                  </div>
                </div>

                <div className="flex items-center flex-wrap gap-2">
                  <span className="text-gray-700 font-semibold mr-1">Share:</span>
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
              {showFeaturedImage && post.featured_image && (
                <div className="relative group rounded-2xl overflow-hidden shadow-lg mb-8">
                  <img
                    src={post.featured_image}
                    alt={post.image_alt || post.title}
                    className="w-full h-auto object-cover"
                  />
                  {post.featured_image.startsWith('http') && (
                    <a
                      href={`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(window.location.href)}&media=${encodeURIComponent(post.featured_image)}&description=${encodeURIComponent(post.image_alt || post.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute top-3 right-3 w-10 h-10 bg-[#E60023] rounded-lg flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 hover:bg-[#c0001c]"
                      title="Save to Pinterest"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <svg className="w-5 h-5 text-white fill-current" viewBox="0 0 24 24">
                        <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/>
                      </svg>
                    </a>
                  )}
                </div>
              )}

              <article className="mb-12">
                <BlogContent
                  html={post.content}
                  pageUrl={window.location.href}
                  pageTitle={post.title}
                  pageDescription={post.excerpt || post.seo_description || ''}
                />
              </article>

              <div className="border-t-2 border-gray-100 pt-8">
                <h3 className="text-3xl font-bold text-gray-900 mb-6">Writer</h3>
                <div className="flex items-start space-x-6">
                  {authorProfile?.avatar_url ? (
                    <img src={authorProfile.avatar_url} alt={authorProfile.name} className="w-24 h-24 rounded-full object-cover flex-shrink-0 shadow-lg" />
                  ) : (
                    <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                      <User className="w-12 h-12 text-white" />
                    </div>
                  )}
                  <div className="flex-1">
                    <h4 className="text-2xl font-bold text-gray-900 mb-2">{post.author}</h4>
                    <p className="text-orange-500 font-semibold mb-4">
                      {authorProfile?.designation || 'Content Writer'}
                    </p>
                    <p className="text-gray-600 leading-relaxed mb-6 text-lg">
                      {authorProfile?.bio || 'A passionate writer creating engaging content and sharing valuable insights with readers around the world.'}
                    </p>
                    <div className="flex items-center space-x-4">
                      {authorProfile?.fb_url && (
                        <a href={authorProfile.fb_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 transition transform hover:scale-110">
                          <Facebook className="w-6 h-6" />
                        </a>
                      )}
                      {authorProfile?.x_url && (
                        <a href={authorProfile.x_url} target="_blank" rel="noopener noreferrer" className="text-sky-500 hover:text-sky-600 transition transform hover:scale-110">
                          <Twitter className="w-6 h-6" />
                        </a>
                      )}
                      {authorProfile?.ig_url && (
                        <a href={authorProfile.ig_url} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:text-pink-700 transition transform hover:scale-110">
                          <Instagram className="w-6 h-6" />
                        </a>
                      )}
                      {authorProfile?.linkedin_url && (
                        <a href={authorProfile.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-800 transition transform hover:scale-110">
                          <Linkedin className="w-6 h-6" />
                        </a>
                      )}
                      {!authorProfile && (
                        <>
                          <a href="#" className="text-blue-600 hover:text-blue-700 transition transform hover:scale-110"><Facebook className="w-6 h-6" /></a>
                          <a href="#" className="text-sky-500 hover:text-sky-600 transition transform hover:scale-110"><Twitter className="w-6 h-6" /></a>
                          <a href="#" className="text-pink-600 hover:text-pink-700 transition transform hover:scale-110"><Instagram className="w-6 h-6" /></a>
                          <a href="#" className="text-blue-700 hover:text-blue-800 transition transform hover:scale-110"><Linkedin className="w-6 h-6" /></a>
                        </>
                      )}
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
                        <div className="flex items-center gap-2 text-xs text-purple-600 mb-2">
                          <Calendar className="w-4 h-4 flex-shrink-0" />
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
                        <div className="flex items-center gap-2 text-xs text-purple-600 mb-2">
                          <Calendar className="w-4 h-4 flex-shrink-0" />
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
                        <div className="flex items-center gap-2 text-xs text-purple-600 mb-2">
                          <Calendar className="w-4 h-4 flex-shrink-0" />
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

              {!productsLoading && products.length > 0 && (
                <div className="bg-white rounded-3xl shadow-xl p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-gray-200">
                    Relevant Products
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {products.map((product) => (
                      <Link
                        key={product.id}
                        to={`/product/${product.id}`}
                        className="group block"
                      >
                        <div className="rounded-xl overflow-hidden shadow-md mb-3">
                          {product.image_url ? (
                            <img
                              src={product.image_url}
                              alt={product.title}
                              className="w-full h-[170px] object-cover group-hover:scale-110 transition duration-500"
                            />
                          ) : (
                            <div className="w-full h-[170px] bg-gradient-to-br from-orange-200 to-amber-300 flex items-center justify-center">
                              <ShoppingBag className="w-12 h-12 text-white opacity-60" />
                            </div>
                          )}
                        </div>
                        <h4 className="text-sm font-bold text-gray-900 group-hover:text-orange-500 transition line-clamp-2 leading-snug">
                          {product.title}
                        </h4>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

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
                          <div className="flex items-center gap-2 text-xs text-orange-500 mb-2">
                            <Calendar className="w-4 h-4 flex-shrink-0" />
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
                          <div className="flex items-center gap-2 text-xs text-orange-500 mb-2">
                            <Eye className="w-4 h-4 flex-shrink-0" />
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
