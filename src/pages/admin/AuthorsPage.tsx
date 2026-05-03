import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import {
  Plus, Trash2, Search, X, User,
  Facebook, Instagram, Twitter, Linkedin, ExternalLink,
  Eye, EyeOff, Shield, ChevronDown, ChevronUp
} from 'lucide-react';
import { ImageUploader } from '../../components/ImageUploader';

interface Author {
  id: string;
  name: string;
  designation: string;
  bio: string;
  avatar_url: string | null;
  avatar_alt: string;
  email: string | null;
  role: string;
  access_enabled: boolean;
  fb_url: string | null;
  ig_url: string | null;
  x_url: string | null;
  pinterest_url: string | null;
  linkedin_url: string | null;
  show_on_home: boolean;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

const ROLE_OPTIONS = [
  { value: 'admin', label: 'Admin', desc: 'Full access' },
  { value: 'editor', label: 'Editor', desc: 'Manage posts & media' },
  { value: 'author', label: 'Author', desc: 'Write & publish own posts' },
  { value: 'contributor', label: 'Contributor', desc: 'Write drafts only' },
];

const emptyForm = {
  name: '',
  designation: '',
  bio: '',
  avatar_url: '',
  avatar_alt: '',
  email: '',
  role: 'author',
  access_enabled: false,
  fb_url: '',
  ig_url: '',
  x_url: '',
  pinterest_url: '',
  linkedin_url: '',
  show_on_home: true,
  display_order: 0,
  is_active: true,
  new_password: '',
};

export default function AuthorsPage() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showSocial, setShowSocial] = useState(false);
  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => { loadAuthors(); }, []);

  const loadAuthors = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('authors')
      .select('*')
      .order('display_order')
      .order('created_at');
    if (!error && data) setAuthors(data);
    setLoading(false);
  };

  const handleEdit = (author: Author) => {
    setEditingAuthor(author);
    setFormData({
      name: author.name,
      designation: author.designation || '',
      bio: author.bio || '',
      avatar_url: author.avatar_url || '',
      avatar_alt: author.avatar_alt || '',
      email: author.email || '',
      role: author.role,
      access_enabled: author.access_enabled,
      fb_url: author.fb_url || '',
      ig_url: author.ig_url || '',
      x_url: author.x_url || '',
      pinterest_url: author.pinterest_url || '',
      linkedin_url: author.linkedin_url || '',
      show_on_home: author.show_on_home,
      display_order: author.display_order,
      is_active: author.is_active,
      new_password: '',
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingAuthor(null);
    setShowForm(false);
    setShowSocial(false);
    setShowPassword(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload: Record<string, any> = {
        name: formData.name,
        designation: formData.designation || null,
        bio: formData.bio || null,
        avatar_url: formData.avatar_url || null,
        avatar_alt: formData.avatar_alt || null,
        email: formData.email || null,
        role: formData.role,
        access_enabled: formData.access_enabled,
        fb_url: formData.fb_url || null,
        ig_url: formData.ig_url || null,
        x_url: formData.x_url || null,
        pinterest_url: formData.pinterest_url || null,
        linkedin_url: formData.linkedin_url || null,
        show_on_home: formData.show_on_home,
        display_order: formData.display_order,
        is_active: formData.is_active,
        updated_at: new Date().toISOString(),
      };

      if (editingAuthor) {
        const { error } = await supabase.from('authors').update(payload).eq('id', editingAuthor.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('authors').insert([payload]);
        if (error) throw error;
      }

      resetForm();
      loadAuthors();
    } catch (err: any) {
      alert(`Error saving: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this author? Posts linked to them will keep their name text but lose the author link.')) return;
    await supabase.from('authors').delete().eq('id', id);
    loadAuthors();
  };

  const toggleActive = async (author: Author) => {
    await supabase.from('authors').update({ is_active: !author.is_active }).eq('id', author.id);
    loadAuthors();
  };

  const filtered = authors.filter(a =>
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (a.designation || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 rounded w-1/4" />
          {[...Array(3)].map((_, i) => <div key={i} className="h-20 bg-slate-200 rounded" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Authors & Team</h1>
          <p className="text-slate-500 mt-1">{authors.length} members · shown on homepage team section &amp; blog posts</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-lg hover:bg-slate-800 transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          Add Author
        </button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or designation..."
            className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
          />
        </div>
      </div>

      {/* Authors grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
        {filtered.map(author => (
          <div key={author.id} className={`bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col gap-3 ${!author.is_active ? 'opacity-60' : ''}`}>
            <div className="flex items-start gap-3">
              {author.avatar_url ? (
                <img src={author.avatar_url} alt={author.avatar_alt || author.name} className="w-14 h-14 rounded-full object-cover flex-shrink-0 border-2 border-slate-100" />
              ) : (
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center flex-shrink-0">
                  <User className="w-7 h-7 text-slate-500" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-slate-900 truncate">{author.name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    author.role === 'admin' ? 'bg-red-100 text-red-700' :
                    author.role === 'editor' ? 'bg-blue-100 text-blue-700' :
                    'bg-slate-100 text-slate-600'
                  }`}>{author.role}</span>
                </div>
                <p className="text-sm text-slate-500 truncate">{author.designation}</p>
                {author.email && (
                  <p className="text-xs text-slate-400 truncate mt-0.5">{author.email}</p>
                )}
              </div>
            </div>

            {author.bio && (
              <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">{author.bio}</p>
            )}

            <div className="flex items-center gap-2 flex-wrap text-xs text-slate-500">
              {author.access_enabled && (
                <span className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-0.5 rounded-full">
                  <Shield className="w-3 h-3" /> Login enabled
                </span>
              )}
              {author.show_on_home && (
                <span className="bg-orange-50 text-orange-700 px-2 py-0.5 rounded-full">Homepage</span>
              )}
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-slate-100">
              <div className="flex items-center gap-1">
                {author.fb_url && <a href={author.fb_url} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded hover:bg-slate-100 text-blue-600"><Facebook className="w-3.5 h-3.5" /></a>}
                {author.ig_url && <a href={author.ig_url} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded hover:bg-slate-100 text-pink-600"><Instagram className="w-3.5 h-3.5" /></a>}
                {author.x_url && <a href={author.x_url} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded hover:bg-slate-100 text-sky-500"><Twitter className="w-3.5 h-3.5" /></a>}
                {author.linkedin_url && <a href={author.linkedin_url} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded hover:bg-slate-100 text-blue-700"><Linkedin className="w-3.5 h-3.5" /></a>}
                {author.pinterest_url && <a href={author.pinterest_url} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded hover:bg-slate-100 text-red-600"><ExternalLink className="w-3.5 h-3.5" /></a>}
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => toggleActive(author)} className="p-1.5 rounded hover:bg-slate-100 text-slate-500" title={author.is_active ? 'Deactivate' : 'Activate'}>
                  {author.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button onClick={() => handleEdit(author)} className="p-1.5 rounded hover:bg-slate-100 text-slate-600" title="Edit">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                </button>
                <button onClick={() => handleDelete(author.id)} className="p-1.5 rounded hover:bg-red-50 text-red-500" title="Delete">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-slate-500">No authors found</div>
      )}

      {/* ─── Author Form Modal ─── */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col my-4 overflow-hidden" style={{ maxHeight: 'calc(100vh - 2rem)' }}>
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50 flex-shrink-0">
              <div>
                <h2 className="text-lg font-bold text-slate-900">{editingAuthor ? 'Edit Author' : 'Add Author / Team Member'}</h2>
                <p className="text-xs text-slate-500 mt-0.5">Profile shown on homepage team section and blog posts</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSubmit as any}
                  disabled={saving}
                  className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors font-semibold text-sm disabled:opacity-50"
                >
                  {saving && <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                  {editingAuthor ? 'Update' : 'Save'}
                </button>
                <button type="button" onClick={resetForm} className="p-2 rounded-lg hover:bg-slate-200 text-slate-500">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Body */}
            <form onSubmit={handleSubmit} className="overflow-y-auto px-6 py-5 space-y-5">
              {/* Avatar */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Profile Photo</label>
                <ImageUploader
                  label=""
                  value={formData.avatar_url}
                  onChange={(url) => setFormData(p => ({ ...p, avatar_url: url }))}
                />
                {formData.avatar_url && (
                  <div className="mt-2">
                    <label className="block text-xs font-medium text-slate-600 mb-1">Photo Alt Text</label>
                    <input
                      type="text"
                      value={formData.avatar_alt}
                      onChange={(e) => setFormData(p => ({ ...p, avatar_alt: e.target.value }))}
                      placeholder="e.g. Sarah Johnson portrait"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent text-sm"
                    />
                  </div>
                )}
              </div>

              {/* Name & Designation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                    placeholder="Full name"
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Designation</label>
                  <input
                    type="text"
                    value={formData.designation}
                    onChange={(e) => setFormData(p => ({ ...p, designation: e.target.value }))}
                    placeholder="e.g. Graphic Designer, Author"
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent text-sm"
                  />
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData(p => ({ ...p, bio: e.target.value }))}
                  rows={3}
                  placeholder="Short biography shown on blog posts and team section..."
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent text-sm resize-none"
                />
              </div>

              {/* Display settings */}
              <div className="flex items-center gap-6 flex-wrap">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.show_on_home}
                    onChange={(e) => setFormData(p => ({ ...p, show_on_home: e.target.checked }))}
                    className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                  />
                  <span className="text-sm font-medium text-slate-700">Show on homepage team section</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData(p => ({ ...p, is_active: e.target.checked }))}
                    className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                  />
                  <span className="text-sm font-medium text-slate-700">Active</span>
                </label>
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-slate-700">Display order</label>
                  <input
                    type="number"
                    min={0}
                    value={formData.display_order}
                    onChange={(e) => setFormData(p => ({ ...p, display_order: parseInt(e.target.value) || 0 }))}
                    className="w-16 px-2 py-1 border border-slate-300 rounded-lg text-sm text-center focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Social links (collapsible) */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setShowSocial(!showSocial)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 text-left transition-colors"
                >
                  <span className="text-sm font-semibold text-slate-700">Social Media Links</span>
                  {showSocial ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                </button>
                {showSocial && (
                  <div className="px-4 py-4 space-y-3">
                    {[
                      { key: 'fb_url', label: 'Facebook', placeholder: 'https://facebook.com/...' },
                      { key: 'ig_url', label: 'Instagram', placeholder: 'https://instagram.com/...' },
                      { key: 'x_url', label: 'X (Twitter)', placeholder: 'https://x.com/...' },
                      { key: 'pinterest_url', label: 'Pinterest', placeholder: 'https://pinterest.com/...' },
                      { key: 'linkedin_url', label: 'LinkedIn', placeholder: 'https://linkedin.com/in/...' },
                    ].map(({ key, label, placeholder }) => (
                      <div key={key} className="flex items-center gap-3">
                        <label className="w-24 text-xs font-medium text-slate-600 flex-shrink-0">{label}</label>
                        <input
                          type="url"
                          value={(formData as any)[key]}
                          onChange={(e) => setFormData(p => ({ ...p, [key]: e.target.value }))}
                          placeholder={placeholder}
                          className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent text-sm"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Access control */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 text-left transition-colors"
                >
                  <div>
                    <span className="text-sm font-semibold text-slate-700">Access & Login</span>
                    <span className="text-xs text-slate-400 ml-2">WordPress-style user roles</span>
                  </div>
                  {showPassword ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                </button>
                {showPassword && (
                  <div className="px-4 py-4 space-y-4">
                    {/* Role */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Role</label>
                      <div className="grid grid-cols-2 gap-2">
                        {ROLE_OPTIONS.map(r => (
                          <label key={r.value} className={`flex items-start gap-2 p-3 border rounded-lg cursor-pointer transition-colors ${formData.role === r.value ? 'border-slate-900 bg-slate-50' : 'border-slate-200 hover:border-slate-300'}`}>
                            <input
                              type="radio"
                              name="role"
                              value={r.value}
                              checked={formData.role === r.value}
                              onChange={(e) => setFormData(p => ({ ...p, role: e.target.value }))}
                              className="mt-0.5 text-slate-900 focus:ring-slate-900"
                            />
                            <div>
                              <p className="text-sm font-medium text-slate-800">{r.label}</p>
                              <p className="text-xs text-slate-500">{r.desc}</p>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email (login username)</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
                        placeholder="author@example.com"
                        className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent text-sm"
                      />
                    </div>

                    {/* Enable login */}
                    <label className="flex items-center gap-3 cursor-pointer">
                      <button
                        type="button"
                        onClick={() => setFormData(p => ({ ...p, access_enabled: !p.access_enabled }))}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.access_enabled ? 'bg-slate-900' : 'bg-slate-200'}`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${formData.access_enabled ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                      <div>
                        <p className="text-sm font-medium text-slate-700">Enable admin panel login</p>
                        <p className="text-xs text-slate-400">When on, this author can log in to manage content</p>
                      </div>
                    </label>

                    {formData.access_enabled && (
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                          {editingAuthor ? 'New Password (leave blank to keep current)' : 'Password'}
                        </label>
                        <input
                          type="password"
                          value={formData.new_password}
                          onChange={(e) => setFormData(p => ({ ...p, new_password: e.target.value }))}
                          placeholder={editingAuthor ? 'Leave blank to keep current password' : 'Set a strong password'}
                          className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent text-sm"
                        />
                        <p className="text-xs text-slate-400 mt-1">Passwords are stored securely and not displayed</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Submit row */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-slate-900 text-white py-2.5 rounded-lg hover:bg-slate-800 transition-colors font-semibold text-sm disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                  {editingAuthor ? 'Update Author' : 'Add Author'}
                </button>
                <button type="button" onClick={resetForm} className="px-4 py-2.5 text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 text-sm font-medium">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
