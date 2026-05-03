import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import {
  Plus, CreditCard as Edit, Trash2, Search, Eye, X,
  ChevronDown, ChevronUp, Images
} from 'lucide-react';
import { RichTextEditor } from '../../components/RichTextEditor';
import { ImageUploader } from '../../components/ImageUploader';
import { SEOFields } from '../../components/SEOFields';
import ImageGallery from './ImageGallery';

interface BlogPost {
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
}

interface Category {
  id: string;
  name: string;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function generateExcerpt(title: string, content: string, maxLength = 160): string {
  const plainContent = stripHtml(content);
  const source = plainContent.length > 20 ? plainContent : title;
  if (source.length <= maxLength) return source;
  const cut = source.lastIndexOf(' ', maxLength);
  return source.slice(0, cut > 0 ? cut : maxLength) + '...';
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export default function BlogManagement() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [excerptManuallyEdited, setExcerptManuallyEdited] = useState(false);
  const [showSEO, setShowSEO] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    author: '',
    // featured_image and image_url are the same — one image serves both
    image: '',
    image_alt: '',
    seo_title: '',
    seo_description: '',
    seo_keywords: '',
    slug: '',
    category_id: '',
  });

  useEffect(() => { loadData(); }, []);

  const updateFormField = useCallback((field: string, value: string) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      if (field === 'title' || field === 'content') {
        if (!excerptManuallyEdited) {
          updated.excerpt = generateExcerpt(
            field === 'title' ? value : prev.title,
            field === 'content' ? value : prev.content
          );
        }
        if (field === 'title' && !editingPost) {
          updated.slug = generateSlug(value);
        }
      }
      return updated;
    });
  }, [excerptManuallyEdited, editingPost]);

  const loadData = async () => {
    try {
      const [postsResult, categoriesResult] = await Promise.all([
        supabase.from('blog_posts').select('*').order('created_at', { ascending: false }),
        supabase.from('categories').select('*').order('name'),
      ]);
      if (postsResult.error) throw postsResult.error;
      if (categoriesResult.error) throw categoriesResult.error;
      setPosts(postsResult.data || []);
      setCategories(categoriesResult.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const postData = {
        title: formData.title,
        content: formData.content,
        excerpt: formData.excerpt || generateExcerpt(formData.title, formData.content),
        author: formData.author || 'Admin',
        // both image_url and featured_image point to the same image
        image_url: formData.image || null,
        featured_image: formData.image || null,
        image_alt: formData.image_alt || null,
        seo_title: formData.seo_title || null,
        seo_description: formData.seo_description || null,
        seo_keywords: formData.seo_keywords || null,
        slug: formData.slug || null,
        category_id: formData.category_id || null,
      };

      if (editingPost) {
        const { error } = await supabase.from('blog_posts').update(postData).eq('id', editingPost.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('blog_posts').insert([postData]);
        if (error) throw error;
      }

      resetForm();
      loadData();
    } catch (error: any) {
      console.error('Error saving post:', error);
      alert(`Error saving blog post: ${error.message || 'Unknown error'}`);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setExcerptManuallyEdited(true);
    setFormData({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      author: post.author,
      image: post.featured_image || post.image_url || '',
      image_alt: post.image_alt || '',
      seo_title: post.seo_title || '',
      seo_description: post.seo_description || '',
      seo_keywords: post.seo_keywords || '',
      slug: post.slug || '',
      category_id: post.category_id || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this blog post?')) return;
    const { error } = await supabase.from('blog_posts').delete().eq('id', id);
    if (error) { alert('Error deleting post'); return; }
    loadData();
  };

  const resetForm = () => {
    setFormData({ title: '', content: '', excerpt: '', author: '', image: '', image_alt: '', seo_title: '', seo_description: '', seo_keywords: '', slug: '', category_id: '' });
    setEditingPost(null);
    setExcerptManuallyEdited(false);
    setShowSEO(false);
    setShowForm(false);
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 rounded w-1/4"></div>
          {[...Array(5)].map((_, i) => <div key={i} className="h-20 bg-slate-200 rounded"></div>)}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Blog Management</h1>
          <p className="text-slate-500 mt-1">{posts.length} posts total</p>
        </div>
        <button
          onClick={() => { setExcerptManuallyEdited(false); setShowForm(true); }}
          className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-lg hover:bg-slate-800 transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          Add New Post
        </button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search posts by title or author..."
            className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
          />
        </div>
      </div>

      {/* ─────────────── EDIT / CREATE MODAL ─────────────── */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center">
          <div className="bg-white rounded-2xl w-full max-w-6xl shadow-2xl flex flex-col my-4 mx-4"
               style={{ height: 'calc(100vh - 2rem)', maxHeight: 900 }}>

            {/* ── Sticky Modal Header ── */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50 rounded-t-2xl flex-shrink-0">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {editingPost ? 'Edit Blog Post' : 'Add New Blog Post'}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {editingPost ? 'Edit and update your post' : 'Fill in details to create a new post'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSubmit as any}
                  disabled={saving}
                  className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2 rounded-lg hover:bg-slate-800 transition-colors font-semibold text-sm disabled:opacity-50"
                >
                  {saving && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                  {editingPost ? 'Update' : 'Publish'}
                </button>
                <button type="button" onClick={resetForm} className="p-2 rounded-lg hover:bg-slate-200 text-slate-500">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* ── Scrollable Body ── */}
            <form
              onSubmit={handleSubmit}
              className="flex flex-col lg:flex-row flex-1 min-h-0 overflow-hidden"
            >
              {/* Main column — scrollable */}
              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Post Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => updateFormField('title', e.target.value)}
                    required
                    placeholder="Enter a compelling title..."
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent text-lg font-medium placeholder-slate-400"
                  />
                </div>

                {/* Featured Image (= Thumbnail) */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-sm font-semibold text-slate-700">
                      Featured Image <span className="text-xs font-normal text-slate-400 ml-1">· also used as thumbnail</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowGallery(true)}
                      className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 transition-colors"
                    >
                      <Images className="w-3.5 h-3.5" />
                      Pick from gallery
                    </button>
                  </div>
                  <ImageUploader
                    label=""
                    value={formData.image}
                    onChange={(url) => setFormData(prev => ({ ...prev, image: url }))}
                  />
                  {/* Alt text — shown below when image is set */}
                  {formData.image && (
                    <div className="mt-2">
                      <label className="block text-xs font-medium text-slate-600 mb-1">Alt Text</label>
                      <input
                        type="text"
                        value={formData.image_alt}
                        onChange={(e) => setFormData(p => ({ ...p, image_alt: e.target.value }))}
                        placeholder="Describe the image for accessibility..."
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent text-sm"
                      />
                    </div>
                  )}
                </div>

                {/* Content Editor */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Content</label>
                  <RichTextEditor
                    content={formData.content}
                    onChange={(content) => updateFormField('content', content)}
                  />
                </div>

                {/* SEO (collapsible) */}
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setShowSEO(!showSEO)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
                  >
                    <span className="font-semibold text-slate-700 text-sm">SEO Settings</span>
                    {showSEO ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                  </button>
                  {showSEO && (
                    <div className="px-4 py-4">
                      <SEOFields
                        seoTitle={formData.seo_title}
                        seoDescription={formData.seo_description}
                        seoKeywords={formData.seo_keywords}
                        slug={formData.slug}
                        onSeoTitleChange={(v) => setFormData(p => ({ ...p, seo_title: v }))}
                        onSeoDescriptionChange={(v) => setFormData(p => ({ ...p, seo_description: v }))}
                        onSeoKeywordsChange={(v) => setFormData(p => ({ ...p, seo_keywords: v }))}
                        onSlugChange={(v) => setFormData(p => ({ ...p, slug: v }))}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Sidebar — scrollable */}
              <div className="lg:w-72 border-t lg:border-t-0 lg:border-l border-slate-200 overflow-y-auto px-5 py-5 space-y-4 bg-slate-50/60 flex-shrink-0">

                {/* Author */}
                <div className="bg-white border border-slate-200 rounded-xl p-4">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Author</label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData(p => ({ ...p, author: e.target.value }))}
                    placeholder="Admin"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent text-sm"
                  />
                </div>

                {/* Category */}
                <div className="bg-white border border-slate-200 rounded-xl p-4">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => setFormData(p => ({ ...p, category_id: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent text-sm bg-white"
                  >
                    <option value="">No category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                {/* URL Slug */}
                {formData.slug && (
                  <div className="bg-white border border-slate-200 rounded-xl p-4">
                    <label className="block text-sm font-semibold text-slate-700 mb-1">URL Slug</label>
                    <div className="text-xs font-mono text-slate-500 bg-slate-50 px-2 py-1.5 rounded border border-slate-200 break-all">
                      /{formData.slug}
                    </div>
                  </div>
                )}

                {/* Bottom publish/cancel */}
                <div className="space-y-2 pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full bg-slate-900 text-white py-2.5 rounded-lg hover:bg-slate-800 transition-colors font-semibold text-sm disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {saving && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                    {editingPost ? 'Update Post' : 'Publish Post'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="w-full bg-white text-slate-600 py-2.5 rounded-lg hover:bg-slate-100 transition-colors font-medium text-sm border border-slate-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─────────────── GALLERY PICKER MODAL ─────────────── */}
      {showGallery && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col overflow-hidden" style={{ height: '80vh' }}>
            <ImageGallery
              onPick={(url) => {
                setFormData(p => ({ ...p, image: url }));
                setShowGallery(false);
              }}
              onClose={() => setShowGallery(false)}
            />
          </div>
        </div>
      )}

      {/* ─────────────── POSTS TABLE ─────────────── */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Post</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Author</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Views</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredPosts.map((post) => (
                <tr key={post.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {(post.featured_image || post.image_url) ? (
                        <img src={post.featured_image || post.image_url!} alt={post.image_alt || post.title} className="w-12 h-12 object-cover rounded-lg flex-shrink-0" />
                      ) : (
                        <div className="w-12 h-12 bg-slate-100 rounded-lg flex-shrink-0" />
                      )}
                      <div>
                        <div className="font-medium text-slate-900 line-clamp-1">{post.title}</div>
                        <div className="text-sm text-slate-500 truncate max-w-xs mt-0.5">{post.excerpt}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-900">{post.author}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-sm text-slate-900">
                      <Eye className="w-4 h-4 text-slate-400" />
                      {post.views.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {new Date(post.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleEdit(post)} className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors" title="Edit">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(post.id)} className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-500">No blog posts found</p>
        </div>
      )}
    </div>
  );
}
