import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, CreditCard as Edit, Trash2, ChevronRight, FolderOpen, Folder } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parent_id: string | null;
  position: number;
  created_at: string;
}

interface FormData {
  name: string;
  slug: string;
  description: string;
  parent_id: string;
  position: string;
}

export default function CategoriesManagement() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    slug: '',
    description: '',
    parent_id: '',
    position: '0',
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('position')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (name: string) =>
    name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const categoryData = {
        name: formData.name,
        slug: formData.slug || generateSlug(formData.name),
        description: formData.description || null,
        parent_id: formData.parent_id || null,
        position: parseInt(formData.position) || 0,
      };

      if (editingCategory) {
        const { error } = await supabase
          .from('categories')
          .update(categoryData)
          .eq('id', editingCategory.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('categories').insert([categoryData]);
        if (error) throw error;
      }

      resetForm();
      loadCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Error saving category');
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      parent_id: category.parent_id || '',
      position: String(category.position),
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    const hasChildren = categories.some((c) => c.parent_id === id);
    if (hasChildren) {
      alert('Cannot delete: this category has subcategories. Delete them first.');
      return;
    }
    if (!confirm('Delete this category? Related blog posts may be affected.')) return;

    try {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) throw error;
      loadCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Error deleting category');
    }
  };

  const resetForm = () => {
    setFormData({ name: '', slug: '', description: '', parent_id: '', position: '0' });
    setEditingCategory(null);
    setShowForm(false);
  };

  // Build tree: parents first, then children indented beneath
  const parents = categories.filter((c) => !c.parent_id);
  const children = categories.filter((c) => c.parent_id);

  const parentName = (id: string | null) =>
    id ? categories.find((c) => c.id === id)?.name ?? '—' : null;

  // Flat ordered list: parent → its children → next parent ...
  const ordered: Category[] = [];
  for (const p of parents) {
    ordered.push(p);
    for (const ch of children.filter((c) => c.parent_id === p.id)) {
      ordered.push(ch);
    }
  }
  // orphan children (parent deleted)
  for (const ch of children.filter((c) => !parents.find((p) => p.id === c.parent_id))) {
    ordered.push(ch);
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 rounded w-1/4"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-slate-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Categories Management</h1>
          <p className="text-slate-600 mt-2">Manage blog categories and subcategories</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Category
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setFormData((f) => ({
                      ...f,
                      name,
                      slug: editingCategory ? f.slug : generateSlug(name),
                    }));
                  }}
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Slug *</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData((f) => ({ ...f, slug: e.target.value }))}
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                />
                <p className="text-xs text-slate-400 mt-1">URL-friendly identifier</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Parent Category</label>
                <select
                  value={formData.parent_id}
                  onChange={(e) => setFormData((f) => ({ ...f, parent_id: e.target.value }))}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                >
                  <option value="">— None (top-level) —</option>
                  {parents
                    .filter((p) => p.id !== editingCategory?.id)
                    .map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                </select>
                <p className="text-xs text-slate-400 mt-1">Leave blank to make this a top-level category</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Position</label>
                <input
                  type="number"
                  min="0"
                  value={formData.position}
                  onChange={(e) => setFormData((f) => ({ ...f, position: e.target.value }))}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                />
                <p className="text-xs text-slate-400 mt-1">Lower number = displayed first</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData((f) => ({ ...f, description: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-slate-900 text-white py-2 rounded-lg hover:bg-slate-800 transition-colors font-medium"
                >
                  {editingCategory ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-slate-200 text-slate-900 py-2 rounded-lg hover:bg-slate-300 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Slug</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Parent</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider w-20">Pos</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {ordered.map((category) => {
                const isChild = !!category.parent_id;
                const pName = parentName(category.parent_id);
                return (
                  <tr key={category.id} className={`hover:bg-slate-50 ${isChild ? 'bg-slate-50/50' : ''}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {isChild ? (
                          <>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-400 ml-4 flex-shrink-0" />
                            <Folder className="w-4 h-4 text-orange-400 flex-shrink-0" />
                          </>
                        ) : (
                          <FolderOpen className="w-4 h-4 text-slate-600 flex-shrink-0" />
                        )}
                        <span className={`font-medium ${isChild ? 'text-slate-700 text-sm' : 'text-slate-900'}`}>
                          {category.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">{category.slug}</td>
                    <td className="px-6 py-4 text-sm">
                      {pName ? (
                        <span className="inline-flex items-center gap-1 text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full text-xs font-medium">
                          {pName}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs">Top-level</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">{category.position}</td>
                    <td className="px-6 py-4 text-sm text-slate-500 max-w-xs truncate">
                      {category.description || '—'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(category)}
                          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(category.id)}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {categories.length === 0 && (
        <div className="text-center py-12 text-slate-500">No categories found</div>
      )}
    </div>
  );
}
