import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import {
  Plus, Trash2, Search, Eye, X,
  ChevronDown, ChevronUp, Globe, Lock
} from 'lucide-react';
import { RichTextEditor } from '../../components/RichTextEditor';

interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string | null;
  is_system: boolean;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

const emptyForm = {
  title: '',
  slug: '',
  content: '',
  seo_title: '',
  seo_description: '',
  seo_keywords: '',
  is_published: true,
};

export default function PagesManagement() {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [showSEO, setShowSEO] = useState(false);
  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => { loadPages(); }, []);

  const loadPages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .order('created_at', { ascending: true });
    if (!error && data) setPages(data);
    setLoading(false);
  };

  const updateTitle = useCallback((title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: editingPage ? prev.slug : generateSlug(title),
    }));
  }, [editingPage]);

  const handleEdit = (page: Page) => {
    setEditingPage(page);
    setFormData({
      title: page.title,
      slug: page.slug,
      content: page.content,
      seo_title: page.seo_title || '',
      seo_description: page.seo_description || '',
      seo_keywords: page.seo_keywords || '',
      is_published: page.is_published,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        title: formData.title,
        slug: formData.slug,
        content: formData.content,
        seo_title: formData.seo_title || null,
        seo_description: formData.seo_description || null,
        seo_keywords: formData.seo_keywords || null,
        is_published: formData.is_published,
        updated_at: new Date().toISOString(),
      };

      if (editingPage) {
        const { error } = await supabase.from('pages').update(payload).eq('id', editingPage.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('pages').insert([{ ...payload, is_system: false }]);
        if (error) throw error;
      }
      resetForm();
      loadPages();
    } catch (err: any) {
      alert(`Error saving page: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (page: Page) => {
    if (page.is_system) return alert('System pages cannot be deleted. You can edit their content.');
    if (!confirm(`Delete "${page.title}"?`)) return;
    await supabase.from('pages').delete().eq('id', page.id);
    loadPages();
  };

  const togglePublished = async (page: Page) => {
    await supabase.from('pages').update({ is_published: !page.is_published }).eq('id', page.id);
    loadPages();
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingPage(null);
    setShowSEO(false);
    setShowForm(false);
  };

  const filtered = pages.filter(p =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 rounded w-1/4" />
          {[...Array(4)].map((_, i) => <div key={i} className="h-16 bg-slate-200 rounded" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Pages</h1>
          <p className="text-slate-500 mt-1">{pages.length} pages · edit content, SEO, and visibility</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-lg hover:bg-slate-800 transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          Add New Page
        </button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search pages..."
            className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
          />
        </div>
      </div>

      {/* Pages table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-8">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">URL</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((page) => (
              <tr key={page.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-900">{page.title}</div>
                </td>
                <td className="px-6 py-4">
                  <a href={`/${page.slug}`} target="_blank" rel="noopener noreferrer" className="text-sm text-slate-500 hover:text-slate-800 font-mono flex items-center gap-1">
                    /{page.slug}
                    <Eye className="w-3 h-3" />
                  </a>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => togglePublished(page)}
                    className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full transition-colors ${
                      page.is_published
                        ? 'bg-green-50 text-green-700 hover:bg-green-100'
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    }`}
                  >
                    {page.is_published ? <Globe className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                    {page.is_published ? 'Published' : 'Draft'}
                  </button>
                </td>
                <td className="px-6 py-4">
                  {page.is_system && (
                    <span className="text-xs bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full font-medium">System</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleEdit(page)}
                      className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    {!page.is_system && (
                      <button
                        onClick={() => handleDelete(page)}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-500">No pages found</div>
        )}
      </div>

      {/* ── Edit / Create Modal ── */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center">
          <div
            className="bg-white rounded-2xl w-full max-w-5xl shadow-2xl flex flex-col my-4 mx-4"
            style={{ height: 'calc(100vh - 2rem)', maxHeight: 900 }}
          >
            {/* Sticky header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50 rounded-t-2xl flex-shrink-0">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {editingPage ? `Edit: ${editingPage.title}` : 'Add New Page'}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {editingPage?.is_system ? 'System page — content only, slug is fixed' : 'Custom page with full control'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSubmit as any}
                  disabled={saving}
                  className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2 rounded-lg hover:bg-slate-800 font-semibold text-sm disabled:opacity-50"
                >
                  {saving && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                  {editingPage ? 'Update' : 'Publish'}
                </button>
                <button type="button" onClick={resetForm} className="p-2 rounded-lg hover:bg-slate-200 text-slate-500">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Scrollable body */}
            <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row flex-1 min-h-0 overflow-hidden">
              {/* Main */}
              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Page Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => updateTitle(e.target.value)}
                    required
                    placeholder="e.g. Privacy Policy"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent text-lg font-medium placeholder-slate-400"
                  />
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Content</label>
                  <RichTextEditor
                    content={formData.content}
                    onChange={(val) => setFormData(p => ({ ...p, content: val }))}
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
                    <div className="px-4 py-4 space-y-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">SEO Title</label>
                        <input type="text" value={formData.seo_title} onChange={e => setFormData(p => ({ ...p, seo_title: e.target.value }))}
                          placeholder="SEO title (defaults to page title)" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-slate-900 focus:border-transparent" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Meta Description</label>
                        <textarea value={formData.seo_description} onChange={e => setFormData(p => ({ ...p, seo_description: e.target.value }))}
                          rows={2} placeholder="Brief description for search engines..." className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-slate-900 focus:border-transparent resize-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Keywords</label>
                        <input type="text" value={formData.seo_keywords} onChange={e => setFormData(p => ({ ...p, seo_keywords: e.target.value }))}
                          placeholder="keyword1, keyword2, keyword3" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-slate-900 focus:border-transparent" />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:w-64 border-t lg:border-t-0 lg:border-l border-slate-200 overflow-y-auto px-5 py-5 space-y-4 bg-slate-50/60 flex-shrink-0">
                {/* Slug */}
                <div className="bg-white border border-slate-200 rounded-xl p-4">
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">URL Slug</label>
                  {editingPage?.is_system ? (
                    <div className="text-xs font-mono text-slate-500 bg-slate-50 px-2 py-1.5 rounded border border-slate-200">/{formData.slug}</div>
                  ) : (
                    <div className="flex items-center gap-1 border border-slate-300 rounded-lg overflow-hidden">
                      <span className="px-2 py-2 bg-slate-50 text-slate-400 text-sm border-r border-slate-300">/</span>
                      <input
                        type="text"
                        value={formData.slug}
                        onChange={e => setFormData(p => ({ ...p, slug: generateSlug(e.target.value) }))}
                        className="flex-1 px-2 py-2 text-sm font-mono focus:outline-none"
                      />
                    </div>
                  )}
                  <a href={`/${formData.slug}`} target="_blank" rel="noopener noreferrer" className="text-xs text-slate-400 hover:text-slate-600 mt-1 flex items-center gap-1">
                    <Eye className="w-3 h-3" /> Preview
                  </a>
                </div>

                {/* Published toggle */}
                <div className="bg-white border border-slate-200 rounded-xl p-4">
                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <p className="text-sm font-semibold text-slate-700">Published</p>
                      <p className="text-xs text-slate-400 mt-0.5">{formData.is_published ? 'Visible on site' : 'Hidden (draft)'}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData(p => ({ ...p, is_published: !p.is_published }))}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.is_published ? 'bg-slate-900' : 'bg-slate-200'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${formData.is_published ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </label>
                </div>

                {/* Actions */}
                <div className="space-y-2 pt-2">
                  <button type="submit" disabled={saving}
                    className="w-full bg-slate-900 text-white py-2.5 rounded-lg hover:bg-slate-800 font-semibold text-sm disabled:opacity-50 flex items-center justify-center gap-2">
                    {saving && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                    {editingPage ? 'Update Page' : 'Publish Page'}
                  </button>
                  <button type="button" onClick={resetForm}
                    className="w-full bg-white text-slate-600 py-2.5 rounded-lg hover:bg-slate-100 font-medium text-sm border border-slate-200">
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
