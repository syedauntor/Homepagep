import { useEffect, useState } from 'react';
import { menuApi, pagesApi, MenuItem, Page } from '../../lib/api';
import {
  Plus, Trash2, GripVertical, ExternalLink,
  ChevronDown, Menu as MenuIcon, Save, Loader2, ChevronRight
} from 'lucide-react';

const MENU_LOCATIONS = [
  { key: 'header', label: 'Header Navigation' },
  { key: 'footer_quick_links', label: 'Footer — Quick Links' },
  { key: 'footer_categories', label: 'Footer — Categories' },
];

const emptyNew = { label: '', url: '', target: '_self' };

export default function MenuSettings() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeMenu, setActiveMenu] = useState('header');

  // Add top-level item
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState(emptyNew);

  // Add sub-menu item
  const [addingSubFor, setAddingSubFor] = useState<string | null>(null);
  const [newSubItem, setNewSubItem] = useState(emptyNew);

  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    setLoading(true);
    const [menuData, pagesData] = await Promise.all([
      menuApi.list(),
      pagesApi.list(true),
    ]).catch(() => [[], []]) as [MenuItem[], Page[]];
    setItems(menuData);
    setPages(pagesData);
    setLoading(false);
  };

  const parentItems = items
    .filter(i => i.menu_location === activeMenu && !i.parent_id)
    .sort((a, b) => a.display_order - b.display_order);

  const childrenOf = (parentId: string) =>
    items
      .filter(i => i.parent_id === parentId)
      .sort((a, b) => a.display_order - b.display_order);

  const addTopLevel = async () => {
    if (!newItem.label || !newItem.url) return;
    const maxOrder = Math.max(0, ...parentItems.map(i => i.display_order));
    await menuApi.create({
      menu_location: activeMenu,
      label: newItem.label,
      url: newItem.url,
      target: newItem.target,
      display_order: maxOrder + 1,
      is_active: true,
    });
    setNewItem(emptyNew);
    setShowAddForm(false);
    loadAll();
  };

  const addSubItem = async (parentId: string) => {
    if (!newSubItem.label || !newSubItem.url) return;
    const siblings = childrenOf(parentId);
    const maxOrder = Math.max(0, ...siblings.map(i => i.display_order));
    await menuApi.create({
      menu_location: activeMenu,
      label: newSubItem.label,
      url: newSubItem.url,
      target: newSubItem.target,
      display_order: maxOrder + 1,
      parent_id: parentId,
      is_active: true,
    });
    setNewSubItem(emptyNew);
    setAddingSubFor(null);
    loadAll();
  };

  const updateItem = (id: string, changes: Partial<MenuItem>) =>
    setItems(prev => prev.map(i => i.id === id ? { ...i, ...changes } : i));

  const saveItems = async () => {
    setSaving(true);
    try {
      for (const item of items) {
        await menuApi.update(item.id, {
          label: item.label,
          url: item.url,
          target: item.target,
          display_order: item.display_order,
          is_active: item.is_active,
        });
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  const deleteItem = async (id: string) => {
    // Also delete children
    const kids = childrenOf(id);
    if (kids.length > 0 && !confirm(`This item has ${kids.length} sub-menu item(s). Delete all?`)) return;
    if (kids.length === 0 && !confirm('Remove this menu item?')) return;
    for (const kid of kids) {
      await menuApi.delete(kid.id);
    }
    await menuApi.delete(id);
    loadAll();
  };

  const moveItem = (id: string, direction: 'up' | 'down', siblings: MenuItem[]) => {
    const idx = siblings.findIndex(i => i.id === id);
    if (direction === 'up' && idx === 0) return;
    if (direction === 'down' && idx === siblings.length - 1) return;
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    const current = siblings[idx];
    const swap = siblings[swapIdx];
    setItems(prev => prev.map(i => {
      if (i.id === current.id) return { ...i, display_order: swap.display_order };
      if (i.id === swap.id) return { ...i, display_order: current.display_order };
      return i;
    }));
  };

  const inputCls = 'px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-slate-900 focus:border-transparent';

  const PagePicker = ({ onPick }: { onPick: (label: string, url: string) => void }) =>
    pages.length > 0 ? (
      <div>
        <label className="text-xs text-slate-500 mb-1 block">Quick-pick a page:</label>
        <div className="flex flex-wrap gap-1">
          {pages.map(p => (
            <button key={p.id} type="button"
              onClick={() => onPick(p.title, `/${p.slug}`)}
              className="text-xs bg-white border border-slate-200 hover:border-slate-400 text-slate-700 px-2 py-1 rounded transition-colors">
              {p.title}
            </button>
          ))}
        </div>
      </div>
    ) : null;

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
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors disabled:opacity-50 ${saved ? 'bg-green-600 text-white' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      <div className="flex gap-6">
        {/* Location sidebar */}
        <nav className="w-52 flex-shrink-0 space-y-1">
          {MENU_LOCATIONS.map(loc => (
            <button key={loc.key} onClick={() => setActiveMenu(loc.key)}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeMenu === loc.key ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}>
              {loc.label}
            </button>
          ))}
        </nav>

        {/* Editor */}
        <div className="flex-1">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-800">
                {MENU_LOCATIONS.find(l => l.key === activeMenu)?.label}
              </h2>
              <span className="text-xs text-slate-500">{parentItems.length} top-level items</span>
            </div>

            <div className="divide-y divide-slate-100">
              {parentItems.length === 0 && (
                <div className="px-6 py-8 text-center text-slate-400 text-sm">No items yet. Add one below.</div>
              )}

              {parentItems.map((item, idx) => {
                const children = childrenOf(item.id);
                return (
                  <div key={item.id}>
                    {/* ── Parent row ── */}
                    <div className="px-4 py-3">
                      {editingId === item.id ? (
                        <div className="space-y-2">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            <input type="text" value={item.label} onChange={e => updateItem(item.id, { label: e.target.value })} placeholder="Label" className={inputCls} />
                            <input type="text" value={item.url} onChange={e => updateItem(item.id, { url: e.target.value })} placeholder="URL" className={inputCls} />
                            <select value={item.target} onChange={e => updateItem(item.id, { target: e.target.value })} className={`${inputCls} bg-white`}>
                              <option value="_self">Same tab</option>
                              <option value="_blank">New tab</option>
                            </select>
                          </div>
                          <PagePicker onPick={(label, url) => updateItem(item.id, { label, url })} />
                          <div className="flex items-center gap-2">
                            <label className="flex items-center gap-1.5 text-sm text-slate-600 cursor-pointer">
                              <input type="checkbox" checked={item.is_active} onChange={e => updateItem(item.id, { is_active: e.target.checked })} className="rounded border-slate-300" />
                              Active
                            </label>
                            <button onClick={() => setEditingId(null)} className="text-xs bg-slate-900 text-white px-3 py-1.5 rounded-lg hover:bg-slate-800">Done</button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <GripVertical className="w-4 h-4 text-slate-300 flex-shrink-0 cursor-grab" />
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <span className={`font-medium text-sm ${item.is_active ? 'text-slate-800' : 'text-slate-400 line-through'}`}>{item.label}</span>
                            <span className="text-xs text-slate-400 font-mono truncate">{item.url}</span>
                            {item.target === '_blank' && <ExternalLink className="w-3 h-3 text-slate-300 flex-shrink-0" />}
                            {children.length > 0 && (
                              <span className="text-xs bg-orange-100 text-orange-600 font-medium px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                                <ChevronDown className="w-3 h-3" />{children.length} sub
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <button onClick={() => moveItem(item.id, 'up', parentItems)} disabled={idx === 0} className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20" title="Move up">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                            </button>
                            <button onClick={() => moveItem(item.id, 'down', parentItems)} disabled={idx === parentItems.length - 1} className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20" title="Move down">
                              <ChevronDown className="w-4 h-4" />
                            </button>
                            <button onClick={() => setEditingId(item.id)} className="p-1.5 rounded hover:bg-slate-100 text-slate-500 hover:text-slate-900" title="Edit">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                            </button>
                            <button
                              onClick={() => { setAddingSubFor(addingSubFor === item.id ? null : item.id); setNewSubItem(emptyNew); }}
                              className="p-1.5 rounded hover:bg-orange-50 text-orange-500 hover:text-orange-700"
                              title="Add sub-menu item"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>
                            <button onClick={() => deleteItem(item.id)} className="p-1.5 rounded hover:bg-red-50 text-red-400 hover:text-red-600" title="Remove">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* ── Child rows ── */}
                    {children.length > 0 && (
                      <div className="bg-slate-50/60 border-t border-slate-100">
                        {children.map((child, cIdx) => (
                          <div key={child.id} className="pl-10 pr-4 py-2.5 border-b border-slate-100 last:border-b-0">
                            {editingId === child.id ? (
                              <div className="space-y-2">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                  <input type="text" value={child.label} onChange={e => updateItem(child.id, { label: e.target.value })} placeholder="Label" className={inputCls} />
                                  <input type="text" value={child.url} onChange={e => updateItem(child.id, { url: e.target.value })} placeholder="URL" className={inputCls} />
                                  <select value={child.target} onChange={e => updateItem(child.id, { target: e.target.value })} className={`${inputCls} bg-white`}>
                                    <option value="_self">Same tab</option>
                                    <option value="_blank">New tab</option>
                                  </select>
                                </div>
                                <PagePicker onPick={(label, url) => updateItem(child.id, { label, url })} />
                                <div className="flex items-center gap-2">
                                  <label className="flex items-center gap-1.5 text-sm text-slate-600 cursor-pointer">
                                    <input type="checkbox" checked={child.is_active} onChange={e => updateItem(child.id, { is_active: e.target.checked })} className="rounded border-slate-300" />
                                    Active
                                  </label>
                                  <button onClick={() => setEditingId(null)} className="text-xs bg-slate-900 text-white px-3 py-1.5 rounded-lg hover:bg-slate-800">Done</button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center gap-3">
                                <ChevronRight className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />
                                <GripVertical className="w-4 h-4 text-slate-300 flex-shrink-0 cursor-grab" />
                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                  <span className={`text-sm ${child.is_active ? 'text-slate-700' : 'text-slate-400 line-through'}`}>{child.label}</span>
                                  <span className="text-xs text-slate-400 font-mono truncate">{child.url}</span>
                                  {child.target === '_blank' && <ExternalLink className="w-3 h-3 text-slate-300" />}
                                </div>
                                <div className="flex items-center gap-1 flex-shrink-0">
                                  <button onClick={() => moveItem(child.id, 'up', children)} disabled={cIdx === 0} className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20" title="Move up">
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                                  </button>
                                  <button onClick={() => moveItem(child.id, 'down', children)} disabled={cIdx === children.length - 1} className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20" title="Move down">
                                    <ChevronDown className="w-3.5 h-3.5" />
                                  </button>
                                  <button onClick={() => setEditingId(child.id)} className="p-1.5 rounded hover:bg-slate-100 text-slate-500 hover:text-slate-900" title="Edit">
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                  </button>
                                  <button onClick={() => { if (confirm('Remove this sub-item?')) { menuApi.delete(child.id).then(() => loadAll()); } }} className="p-1.5 rounded hover:bg-red-50 text-red-400 hover:text-red-600" title="Remove">
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* ── Add sub-item form ── */}
                    {addingSubFor === item.id && (
                      <div className="pl-10 pr-4 py-3 bg-orange-50/40 border-t border-orange-100 space-y-2">
                        <p className="text-xs font-medium text-orange-700">Add sub-menu item under <strong>{item.label}</strong></p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <input type="text" value={newSubItem.label} onChange={e => setNewSubItem(p => ({ ...p, label: e.target.value }))} placeholder="Sub label" className={inputCls} />
                          <input type="text" value={newSubItem.url} onChange={e => setNewSubItem(p => ({ ...p, url: e.target.value }))} placeholder="URL e.g. /shop/worksheets" className={inputCls} />
                          <select value={newSubItem.target} onChange={e => setNewSubItem(p => ({ ...p, target: e.target.value }))} className={`${inputCls} bg-white`}>
                            <option value="_self">Same tab</option>
                            <option value="_blank">New tab</option>
                          </select>
                        </div>
                        <PagePicker onPick={(label, url) => setNewSubItem({ label, url, target: '_self' })} />
                        <div className="flex items-center gap-2">
                          <button onClick={() => addSubItem(item.id)} className="bg-orange-500 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-orange-600">Add Sub-item</button>
                          <button onClick={() => { setAddingSubFor(null); setNewSubItem(emptyNew); }} className="text-slate-500 px-3 py-1.5 text-sm hover:text-slate-700">Cancel</button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Add top-level item */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100">
              {showAddForm ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input type="text" value={newItem.label} onChange={e => setNewItem(p => ({ ...p, label: e.target.value }))} placeholder="Menu label" className={inputCls} />
                    <input type="text" value={newItem.url} onChange={e => setNewItem(p => ({ ...p, url: e.target.value }))} placeholder="URL e.g. /privacy-policy" className={inputCls} />
                    <select value={newItem.target} onChange={e => setNewItem(p => ({ ...p, target: e.target.value }))} className={`${inputCls} bg-white`}>
                      <option value="_self">Same tab</option>
                      <option value="_blank">New tab</option>
                    </select>
                  </div>
                  <PagePicker onPick={(label, url) => setNewItem({ label, url, target: '_self' })} />
                  <div className="flex items-center gap-2">
                    <button onClick={addTopLevel} className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800">Add Item</button>
                    <button onClick={() => { setShowAddForm(false); setNewItem(emptyNew); }} className="text-slate-500 px-3 py-2 text-sm hover:text-slate-700">Cancel</button>
                  </div>
                </div>
              ) : (
                <button onClick={() => setShowAddForm(true)} className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                  <Plus className="w-4 h-4" />
                  Add menu item
                </button>
              )}
            </div>
          </div>

          <p className="text-xs text-slate-400 mt-3">
            Tip: Click the <ChevronRight className="inline w-3 h-3 text-orange-500" /> button on any item to add a dropdown sub-menu beneath it.
          </p>
        </div>
      </div>
    </div>
  );
}
