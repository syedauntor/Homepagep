import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, CreditCard as Edit, Trash2, ChevronRight, FolderOpen, Folder, BookOpen, ShoppingBag } from 'lucide-react';

// ─── Blog Categories ─────────────────────────────────────────────────────────

interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parent_id: string | null;
  position: number;
}

interface BlogFormData {
  name: string;
  slug: string;
  description: string;
  parent_id: string;
  position: string;
}

// ─── Product Categories ───────────────────────────────────────────────────────

interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  position: number;
}

interface ProductFormData {
  name: string;
  slug: string;
  description: string;
  position: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const generateSlug = (name: string) =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CategoriesManagement() {
  const [activeTab, setActiveTab] = useState<'blog' | 'product'>('blog');

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Categories Management</h1>
        <p className="text-slate-600 mt-2">Manage blog and product categories</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit mb-8">
        <button
          onClick={() => setActiveTab('blog')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
            activeTab === 'blog'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Blog Categories
        </button>
        <button
          onClick={() => setActiveTab('product')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
            activeTab === 'product'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          Product Categories
        </button>
      </div>

      {activeTab === 'blog' ? <BlogCategoriesTab /> : <ProductCategoriesTab />}
    </div>
  );
}

// ─── Blog Categories Tab ──────────────────────────────────────────────────────

function BlogCategoriesTab() {
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<BlogCategory | null>(null);
  const [form, setForm] = useState<BlogFormData>({ name: '', slug: '', description: '', parent_id: '', position: '0' });

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('categories').select('*').order('position').order('name');
    setCategories(data || []);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      slug: form.slug || generateSlug(form.name),
      description: form.description || null,
      parent_id: form.parent_id || null,
      position: parseInt(form.position) || 0,
    };
    if (editing) {
      await supabase.from('categories').update(payload).eq('id', editing.id);
    } else {
      await supabase.from('categories').insert([payload]);
    }
    reset(); load();
  };

  const handleEdit = (c: BlogCategory) => {
    setEditing(c);
    setForm({ name: c.name, slug: c.slug, description: c.description || '', parent_id: c.parent_id || '', position: String(c.position) });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (categories.some((c) => c.parent_id === id)) { alert('Delete subcategories first.'); return; }
    if (!confirm('Delete this category?')) return;
    await supabase.from('categories').delete().eq('id', id);
    load();
  };

  const reset = () => {
    setForm({ name: '', slug: '', description: '', parent_id: '', position: '0' });
    setEditing(null); setShowForm(false);
  };

  const parents = categories.filter((c) => !c.parent_id);
  const ordered: BlogCategory[] = [];
  for (const p of parents) {
    ordered.push(p);
    for (const ch of categories.filter((c) => c.parent_id === p.id)) ordered.push(ch);
  }
  for (const ch of categories.filter((c) => c.parent_id && !parents.find((p) => p.id === c.parent_id))) ordered.push(ch);

  if (loading) return <LoadingSkeleton />;

  return (
    <>
      <div className="flex justify-end mb-4">
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-lg hover:bg-slate-800 transition-colors text-sm font-medium">
          <Plus className="w-4 h-4" /> Add Blog Category
        </button>
      </div>

      {showForm && (
        <Modal title={editing ? 'Edit Blog Category' : 'Add Blog Category'} onClose={reset}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Name *">
              <input type="text" value={form.name} required
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value, slug: editing ? f.slug : generateSlug(e.target.value) }))}
                className={inputCls} />
            </Field>
            <Field label="Slug *" hint="URL-friendly identifier">
              <input type="text" value={form.slug} required onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} className={inputCls} />
            </Field>
            <Field label="Parent Category" hint="Leave blank for top-level">
              <select value={form.parent_id} onChange={(e) => setForm((f) => ({ ...f, parent_id: e.target.value }))} className={inputCls}>
                <option value="">— None (top-level) —</option>
                {parents.filter((p) => p.id !== editing?.id).map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </Field>
            <Field label="Position" hint="Lower = shown first">
              <input type="number" min="0" value={form.position} onChange={(e) => setForm((f) => ({ ...f, position: e.target.value }))} className={inputCls} />
            </Field>
            <Field label="Description">
              <textarea value={form.description} rows={3} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className={inputCls} />
            </Field>
            <FormButtons onCancel={reset} editing={!!editing} />
          </form>
        </Modal>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              {['Name', 'Slug', 'Parent', 'Pos', 'Description', 'Actions'].map((h) => (
                <th key={h} className={`px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider ${h === 'Actions' ? 'text-right' : ''}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {ordered.map((c) => {
              const isChild = !!c.parent_id;
              const pName = isChild ? categories.find((x) => x.id === c.parent_id)?.name : null;
              return (
                <tr key={c.id} className={`hover:bg-slate-50 ${isChild ? 'bg-slate-50/40' : ''}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {isChild ? (<><ChevronRight className="w-3.5 h-3.5 text-slate-400 ml-4 flex-shrink-0" /><Folder className="w-4 h-4 text-orange-400 flex-shrink-0" /></>) : (<FolderOpen className="w-4 h-4 text-slate-600 flex-shrink-0" />)}
                      <span className={`font-medium ${isChild ? 'text-slate-700 text-sm' : 'text-slate-900'}`}>{c.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">{c.slug}</td>
                  <td className="px-6 py-4 text-sm">
                    {pName ? <span className="bg-orange-50 text-orange-600 text-xs font-medium px-2 py-0.5 rounded-full">{pName}</span> : <span className="text-slate-400 text-xs">Top-level</span>}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">{c.position}</td>
                  <td className="px-6 py-4 text-sm text-slate-500 max-w-xs truncate">{c.description || '—'}</td>
                  <td className="px-6 py-4 text-right">
                    <RowActions onEdit={() => handleEdit(c)} onDelete={() => handleDelete(c.id)} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {ordered.length === 0 && <EmptyState label="No blog categories yet" />}
      </div>
    </>
  );
}

// ─── Product Categories Tab ───────────────────────────────────────────────────

function ProductCategoriesTab() {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<ProductCategory | null>(null);
  const [form, setForm] = useState<ProductFormData>({ name: '', slug: '', description: '', position: '0' });

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('product_categories').select('*').order('position').order('name');
    setCategories(data || []);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      slug: form.slug || generateSlug(form.name),
      description: form.description || null,
      position: parseInt(form.position) || 0,
    };
    if (editing) {
      await supabase.from('product_categories').update(payload).eq('id', editing.id);
    } else {
      await supabase.from('product_categories').insert([payload]);
    }
    reset(); load();
  };

  const handleEdit = (c: ProductCategory) => {
    setEditing(c);
    setForm({ name: c.name, slug: c.slug, description: c.description || '', position: String(c.position) });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product category?')) return;
    await supabase.from('product_categories').delete().eq('id', id);
    load();
  };

  const reset = () => {
    setForm({ name: '', slug: '', description: '', position: '0' });
    setEditing(null); setShowForm(false);
  };

  if (loading) return <LoadingSkeleton />;

  return (
    <>
      <div className="flex justify-end mb-4">
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-lg hover:bg-slate-800 transition-colors text-sm font-medium">
          <Plus className="w-4 h-4" /> Add Product Category
        </button>
      </div>

      {showForm && (
        <Modal title={editing ? 'Edit Product Category' : 'Add Product Category'} onClose={reset}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Name *">
              <input type="text" value={form.name} required
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value, slug: editing ? f.slug : generateSlug(e.target.value) }))}
                className={inputCls} />
            </Field>
            <Field label="Slug *" hint="URL-friendly identifier">
              <input type="text" value={form.slug} required onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} className={inputCls} />
            </Field>
            <Field label="Position" hint="Lower = shown first">
              <input type="number" min="0" value={form.position} onChange={(e) => setForm((f) => ({ ...f, position: e.target.value }))} className={inputCls} />
            </Field>
            <Field label="Description">
              <textarea value={form.description} rows={3} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className={inputCls} />
            </Field>
            <FormButtons onCancel={reset} editing={!!editing} />
          </form>
        </Modal>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              {['Name', 'Slug', 'Pos', 'Description', 'Actions'].map((h) => (
                <th key={h} className={`px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider ${h === 'Actions' ? 'text-right' : ''}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {categories.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-slate-500 flex-shrink-0" />
                    <span className="font-medium text-slate-900">{c.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">{c.slug}</td>
                <td className="px-6 py-4 text-sm text-slate-500">{c.position}</td>
                <td className="px-6 py-4 text-sm text-slate-500 max-w-xs truncate">{c.description || '—'}</td>
                <td className="px-6 py-4 text-right">
                  <RowActions onEdit={() => handleEdit(c)} onDelete={() => handleDelete(c.id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {categories.length === 0 && <EmptyState label="No product categories yet" />}
      </div>
    </>
  );
}

// ─── Shared UI ────────────────────────────────────────────────────────────────

const inputCls = 'w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent text-sm';

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-slate-900 mb-5">{title}</h2>
        {children}
      </div>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      {children}
      {hint && <p className="text-xs text-slate-400 mt-1">{hint}</p>}
    </div>
  );
}

function FormButtons({ onCancel, editing }: { onCancel: () => void; editing: boolean }) {
  return (
    <div className="flex gap-3 pt-2">
      <button type="submit" className="flex-1 bg-slate-900 text-white py-2 rounded-lg hover:bg-slate-800 transition-colors font-medium text-sm">
        {editing ? 'Update' : 'Create'}
      </button>
      <button type="button" onClick={onCancel} className="flex-1 bg-slate-200 text-slate-900 py-2 rounded-lg hover:bg-slate-300 transition-colors font-medium text-sm">
        Cancel
      </button>
    </div>
  );
}

function RowActions({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="flex items-center justify-end gap-2">
      <button onClick={onEdit} className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors">
        <Edit className="w-4 h-4" />
      </button>
      <button onClick={onDelete} className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors">
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-3">
      {[...Array(4)].map((_, i) => <div key={i} className="h-14 bg-slate-200 rounded-lg" />)}
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return <div className="text-center py-12 text-slate-500 text-sm">{label}</div>;
}
