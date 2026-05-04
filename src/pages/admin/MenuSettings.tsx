import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import {
  Plus, Trash2, GripVertical, ExternalLink,
  ChevronDown, Menu as MenuIcon, Save, Loader2
} from 'lucide-react';

interface MenuItem {
  id: string;
  menu_location: string;
  label: string;
  url: string;
  target: string;
  display_order: number;
  parent_id: string | null;
  is_active: boolean;
}

interface Page {
  id: string;
  title: string;
  slug: string;
}

const MENU_LOCATIONS = [
  { key: 'header', label: 'Header Navigation' },
  { key: 'footer_quick_links', label: 'Footer — Quick Links' },
  { key: 'footer_categories', label: 'Footer — Categories' },
];

export default function MenuSettings() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeMenu, setActiveMenu] = useState('header');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({ label: '', url: '', target: '_self' });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    setLoading(true);
    const [itemsRes, pagesRes] = await Promise.all([
      supabase.from('menu_items').select('*').order('display_order'),
      supabase.from('pages').select('id, title, slug').eq('is_published', true).order('title'),
    ]);
    if (itemsRes.data) setItems(itemsRes.data);
    if (pagesRes.data) setPages(pagesRes.data);
    setLoading(false);
  };

  const locationItems = items
    .filter(i => i.menu_location === activeMenu && !i.parent_id)
    .sort((a, b) => a.display_order - b.display_order);

  const addItem = async () => {
    if (!newItem.label || !newItem.url) return;
    const maxOrder = Math.max(0, ...locationItems.map(i => i.display_order));
    const { error } = await supabase.from('menu_items').insert([{
      menu_location: activeMenu,
      label: newItem.label,
      url: newItem.url,
      target: newItem.target,
      display_order: maxOrder + 1,
      is_active: true,
    }]);
    if (!error) {
      setNewItem({ label: '', url: '', target: '_self' });
      setShowAddForm(false);
      loadAll();
    }
  };

  const updateItem = async (id: string, changes: Partial<MenuItem>) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, ...changes } : i));
  };

  const saveItems = async () => {
    setSaving(true);
    try {
      for (const item of items) {
        await supabase.from('menu_items').update({
          label: item.label,
          url: item.url,
          target: item.target,
          display_order: item.display_order,
          is_active: item.is_active,
        }).eq('id', item.id);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  const deleteItem = async (id: string) => {
    if (!confirm('Remove this menu item?')) return;
    await supabase.from('menu_items').delete().eq('id', id);
    loadAll();
  };

  const moveItem = (id: string, direction: 'up' | 'down') => {
    const locItems = locationItems;
    const idx = locItems.findIndex(i => i.id === id);
    if (direction === 'up' && idx === 0) return;
    if (direction === 'down' && idx === locItems.length - 1) return;

    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    const current = locItems[idx];
    const swap = locItems[swapIdx];

    setItems(prev => prev.map(i => {
      if (i.id === current.id) return { ...i, display_order: swap.display_order };
      if (i.id === swap.id) return { ...i, display_order: current.display_order };
      return i;
    }));
  };

  if (loading) {
    return (
      <div className="p-8 animate-pulse space-y-4">
        <div className="h-8 bg-slate-200 rounded w-1/4" />
        <div className="h-40 bg-slate-200 rounded" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <MenuIcon className="w-8 h-8 text-slate-600" />
            Menu Settings
          </h1>
          <p className="text-slate-500 mt-1">Manage header and footer navigation menus</p>
        </div>
        <button
          onClick={saveItems}
          disabled={saving}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors disabled:opacity-50 ${
            saved ? 'bg-green-600 text-white' : 'bg-slate-900 text-white hover:bg-slate-800'
          }`}
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      <div className="flex gap-6">
        {/* Menu location tabs (sidebar) */}
        <nav className="w-52 flex-shrink-0 space-y-1">
          {MENU_LOCATIONS.map(loc => (
            <button
              key={loc.key}
              onClick={() => setActiveMenu(loc.key)}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeMenu === loc.key
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {loc.label}
            </button>
          ))}
        </nav>

        {/* Editor panel */}
        <div className="flex-1">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-800">
                {MENU_LOCATIONS.find(l => l.key === activeMenu)?.label}
              </h2>
              <span className="text-xs text-slate-500">{locationItems.length} items</span>
            </div>

            {/* Items list */}
            <div className="divide-y divide-slate-100">
              {locationItems.length === 0 && (
                <div className="px-6 py-8 text-center text-slate-400 text-sm">No items yet. Add one below.</div>
              )}
              {locationItems.map((item, idx) => (
                <div key={item.id} className="px-4 py-3">
                  {editingId === item.id ? (
                    /* Inline edit row */
                    <div className="space-y-2">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <input
                          type="text"
                          value={item.label}
                          onChange={e => updateItem(item.id, { label: e.target.value })}
                          placeholder="Label"
                          className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                        />
                        <input
                          type="text"
                          value={item.url}
                          onChange={e => updateItem(item.id, { url: e.target.value })}
                          placeholder="URL e.g. /about or https://..."
                          className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                        />
                        <select
                          value={item.target}
                          onChange={e => updateItem(item.id, { target: e.target.value })}
                          className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                        >
                          <option value="_self">Same tab</option>
                          <option value="_blank">New tab</option>
                        </select>
                      </div>
                      {/* Quick-pick from pages */}
                      {pages.length > 0 && (
                        <div>
                          <label className="text-xs text-slate-500 mb-1 block">Or pick a page:</label>
                          <div className="flex flex-wrap gap-1">
                            {pages.map(p => (
                              <button
                                key={p.id}
                                type="button"
                                onClick={() => updateItem(item.id, { label: p.title, url: `/${p.slug}` })}
                                className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded transition-colors"
                              >
                                {p.title}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <label className="flex items-center gap-1.5 text-sm text-slate-600 cursor-pointer">
                          <input type="checkbox" checked={item.is_active} onChange={e => updateItem(item.id, { is_active: e.target.checked })}
                            className="rounded border-slate-300" />
                          Active
                        </label>
                        <button onClick={() => setEditingId(null)} className="text-xs bg-slate-900 text-white px-3 py-1.5 rounded-lg hover:bg-slate-800">Done</button>
                      </div>
                    </div>
                  ) : (
                    /* Display row */
                    <div className="flex items-center gap-3">
                      <GripVertical className="w-4 h-4 text-slate-300 flex-shrink-0 cursor-grab" />
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className={`font-medium text-sm ${item.is_active ? 'text-slate-800' : 'text-slate-400 line-through'}`}>
                          {item.label}
                        </span>
                        <span className="text-xs text-slate-400 font-mono truncate">{item.url}</span>
                        {item.target === '_blank' && <ExternalLink className="w-3 h-3 text-slate-300 flex-shrink-0" />}
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button
                          onClick={() => moveItem(item.id, 'up')}
                          disabled={idx === 0}
                          className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20"
                          title="Move up"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                        </button>
                        <button
                          onClick={() => moveItem(item.id, 'down')}
                          disabled={idx === locationItems.length - 1}
                          className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20"
                          title="Move down"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                        <button onClick={() => setEditingId(item.id)} className="p-1.5 rounded hover:bg-slate-100 text-slate-500 hover:text-slate-900" title="Edit">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </button>
                        <button onClick={() => deleteItem(item.id)} className="p-1.5 rounded hover:bg-red-50 text-red-400 hover:text-red-600" title="Remove">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Add item form */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100">
              {showAddForm ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      value={newItem.label}
                      onChange={e => setNewItem(p => ({ ...p, label: e.target.value }))}
                      placeholder="Menu label"
                      className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                    />
                    <input
                      type="text"
                      value={newItem.url}
                      onChange={e => setNewItem(p => ({ ...p, url: e.target.value }))}
                      placeholder="URL e.g. /privacy-policy"
                      className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                    />
                    <select
                      value={newItem.target}
                      onChange={e => setNewItem(p => ({ ...p, target: e.target.value }))}
                      className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                    >
                      <option value="_self">Same tab</option>
                      <option value="_blank">New tab</option>
                    </select>
                  </div>
                  {/* Quick-pick from pages */}
                  {pages.length > 0 && (
                    <div>
                      <label className="text-xs text-slate-500 mb-1 block">Quick-pick a page:</label>
                      <div className="flex flex-wrap gap-1">
                        {pages.map(p => (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => setNewItem({ label: p.title, url: `/${p.slug}`, target: '_self' })}
                            className="text-xs bg-white border border-slate-200 hover:border-slate-400 text-slate-700 px-2 py-1 rounded transition-colors"
                          >
                            {p.title}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <button onClick={addItem} className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800">Add Item</button>
                    <button onClick={() => { setShowAddForm(false); setNewItem({ label: '', url: '', target: '_self' }); }} className="text-slate-500 px-3 py-2 text-sm hover:text-slate-700">Cancel</button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add menu item
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
