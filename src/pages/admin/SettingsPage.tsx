import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import {
  Settings, Save, Loader2, Type, Menu as MenuIcon,
  Plus, Trash2, GripVertical, ExternalLink, ChevronDown
} from 'lucide-react';

/* ─── Types ─── */
interface Setting {
  id: string;
  key: string;
  value: string;
  label: string;
  group: string;
}

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

/* ─── Setting metadata ─── */
const GROUP_META: Record<string, { label: string; icon: React.ReactNode; description: string }> = {
  post_settings: {
    label: 'Post Settings',
    icon: <Type className="w-5 h-5" />,
    description: 'Control how blog posts look and behave on your site',
  },
  general: {
    label: 'General',
    icon: <Settings className="w-5 h-5" />,
    description: 'General site settings',
  },
};

const TOGGLE_KEYS = new Set(['post_featured_image_enabled']);
const NUMBER_KEYS = new Set(['post_body_font_size', 'post_heading_font_size_h1', 'post_heading_font_size_h2', 'post_heading_font_size_h3']);
const DECIMAL_KEYS = new Set(['post_body_line_height', 'post_paragraph_spacing']);
const FONT_FAMILY_KEYS = new Set(['post_font_family']);

const FONT_OPTIONS = [
  { label: 'Georgia (Serif)', value: 'Georgia, serif' },
  { label: 'Times New Roman (Serif)', value: '"Times New Roman", Times, serif' },
  { label: 'Merriweather (Serif)', value: 'Merriweather, Georgia, serif' },
  { label: 'Inter / System UI (Sans-serif)', value: 'Inter, system-ui, sans-serif' },
  { label: 'Roboto (Sans-serif)', value: 'Roboto, Arial, sans-serif' },
  { label: 'Open Sans (Sans-serif)', value: '"Open Sans", Arial, sans-serif' },
  { label: 'Lato (Sans-serif)', value: 'Lato, Arial, sans-serif' },
  { label: 'Courier New (Monospace)', value: '"Courier New", monospace' },
];

const MENU_LOCATIONS = [
  { key: 'header', label: 'Header Navigation' },
  { key: 'footer_quick_links', label: 'Footer — Quick Links' },
  { key: 'footer_categories', label: 'Footer — Categories' },
];

/* ─── Main Component ─── */
export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'settings' | 'menu'>('settings');
  const [activeGroup, setActiveGroup] = useState('post_settings');

  // Settings state
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Menu state
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [pages, setPages] = useState<Page[]>([]);
  const [loadingMenu, setLoadingMenu] = useState(true);
  const [menuSaving, setMenuSaving] = useState(false);
  const [menuSaved, setMenuSaved] = useState(false);
  const [activeMenuLoc, setActiveMenuLoc] = useState('header');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({ label: '', url: '', target: '_self' });
  const [editingMenuId, setEditingMenuId] = useState<string | null>(null);

  useEffect(() => { loadSettings(); loadMenu(); }, []);

  /* ── Settings helpers ── */
  const loadSettings = async () => {
    setLoadingSettings(true);
    const { data } = await supabase.from('site_settings').select('*').order('group').order('key');
    if (data) setSettings(data);
    setLoadingSettings(false);
  };

  const updateSetting = (key: string, value: string) => {
    setSettings(prev => prev.map(s => s.key === key ? { ...s, value } : s));
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      for (const s of settings) {
        await supabase.from('site_settings').update({ value: s.value, updated_at: new Date().toISOString() }).eq('key', s.key);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally { setSaving(false); }
  };

  const grouped = settings.reduce<Record<string, Setting[]>>((acc, s) => {
    const g = s.group || 'general';
    if (!acc[g]) acc[g] = [];
    acc[g].push(s);
    return acc;
  }, {});
  const groupKeys = Object.keys(grouped);

  /* ── Menu helpers ── */
  const loadMenu = async () => {
    setLoadingMenu(true);
    const [itemsRes, pagesRes] = await Promise.all([
      supabase.from('menu_items').select('*').order('display_order'),
      supabase.from('pages').select('id, title, slug').eq('is_published', true).order('title'),
    ]);
    if (itemsRes.data) setMenuItems(itemsRes.data);
    if (pagesRes.data) setPages(pagesRes.data);
    setLoadingMenu(false);
  };

  const locationItems = menuItems
    .filter(i => i.menu_location === activeMenuLoc && !i.parent_id)
    .sort((a, b) => a.display_order - b.display_order);

  const addMenuItem = async () => {
    if (!newItem.label || !newItem.url) return;
    const maxOrder = Math.max(0, ...locationItems.map(i => i.display_order));
    await supabase.from('menu_items').insert([{
      menu_location: activeMenuLoc, label: newItem.label, url: newItem.url, target: newItem.target, display_order: maxOrder + 1, is_active: true,
    }]);
    setNewItem({ label: '', url: '', target: '_self' });
    setShowAddForm(false);
    loadMenu();
  };

  const updateMenuItem = (id: string, changes: Partial<MenuItem>) => {
    setMenuItems(prev => prev.map(i => i.id === id ? { ...i, ...changes } : i));
  };

  const saveMenuItems = async () => {
    setMenuSaving(true);
    try {
      for (const item of menuItems) {
        await supabase.from('menu_items').update({ label: item.label, url: item.url, target: item.target, display_order: item.display_order, is_active: item.is_active }).eq('id', item.id);
      }
      setMenuSaved(true);
      setTimeout(() => setMenuSaved(false), 2000);
    } finally { setMenuSaving(false); }
  };

  const deleteMenuItem = async (id: string) => {
    if (!confirm('Remove this menu item?')) return;
    await supabase.from('menu_items').delete().eq('id', id);
    loadMenu();
  };

  const moveMenuItem = (id: string, direction: 'up' | 'down') => {
    const locItems = locationItems;
    const idx = locItems.findIndex(i => i.id === id);
    if (direction === 'up' && idx === 0) return;
    if (direction === 'down' && idx === locItems.length - 1) return;
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    const cur = locItems[idx]; const swap = locItems[swapIdx];
    setMenuItems(prev => prev.map(i => {
      if (i.id === cur.id) return { ...i, display_order: swap.display_order };
      if (i.id === swap.id) return { ...i, display_order: cur.display_order };
      return i;
    }));
  };

  /* ── Setting control renderers ── */
  const renderControl = (setting: Setting) => {
    if (TOGGLE_KEYS.has(setting.key)) {
      return (
        <button type="button" onClick={() => updateSetting(setting.key, setting.value === 'true' ? 'false' : 'true')}
          className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors ${setting.value === 'true' ? 'bg-slate-900' : 'bg-slate-200'}`}>
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${setting.value === 'true' ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
      );
    }
    if (FONT_FAMILY_KEYS.has(setting.key)) {
      return (
        <div className="flex flex-col gap-2 min-w-[260px]">
          <select value={setting.value} onChange={e => updateSetting(setting.key, e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 bg-white">
            {FONT_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
          <p className="text-xs text-slate-500" style={{ fontFamily: setting.value }}>The quick brown fox jumps over the lazy dog.</p>
        </div>
      );
    }
    if (NUMBER_KEYS.has(setting.key)) {
      const num = parseInt(setting.value) || 0;
      return (
        <div className="flex items-center gap-3">
          <input type="range" min={10} max={72} step={1} value={num} onChange={e => updateSetting(setting.key, e.target.value)} className="w-32 accent-slate-800" />
          <div className="flex items-center gap-1">
            <input type="number" min={10} max={72} value={num} onChange={e => updateSetting(setting.key, e.target.value)} className="w-16 px-2 py-1 text-sm border border-slate-300 rounded-lg text-center focus:ring-2 focus:ring-slate-900" />
            <span className="text-xs text-slate-500">px</span>
          </div>
        </div>
      );
    }
    if (DECIMAL_KEYS.has(setting.key)) {
      const val = parseFloat(setting.value) || 1;
      return (
        <div className="flex items-center gap-3">
          <input type="range" min={1} max={3} step={0.05} value={val} onChange={e => updateSetting(setting.key, parseFloat(e.target.value).toFixed(2))} className="w-32 accent-slate-800" />
          <input type="number" min={1} max={3} step={0.05} value={val} onChange={e => updateSetting(setting.key, e.target.value)} className="w-20 px-2 py-1 text-sm border border-slate-300 rounded-lg text-center focus:ring-2 focus:ring-slate-900" />
        </div>
      );
    }
    return (
      <input type="text" value={setting.value} onChange={e => updateSetting(setting.key, e.target.value)}
        className="w-48 px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900" />
    );
  };

  /* ── Loading state ── */
  if (loadingSettings && loadingMenu) {
    return (
      <div className="p-8 animate-pulse space-y-4">
        <div className="h-8 bg-slate-200 rounded w-1/4" />
        <div className="h-40 bg-slate-200 rounded" />
      </div>
    );
  }

  return (
    <div className="p-8 min-h-screen bg-slate-50">
      {/* Page header */}
      <div className="flex items-center justify-between mb-6 max-w-5xl">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Settings className="w-8 h-8 text-slate-600" />
            Settings
          </h1>
          <p className="text-slate-500 mt-1">Site-wide configuration and navigation menus</p>
        </div>
        {activeTab === 'settings' ? (
          <button onClick={saveSettings} disabled={saving}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors disabled:opacity-50 ${saved ? 'bg-green-600 text-white' : 'bg-slate-900 text-white hover:bg-slate-800'}`}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saved ? 'Saved!' : saving ? 'Saving...' : 'Save Changes'}
          </button>
        ) : (
          <button onClick={saveMenuItems} disabled={menuSaving}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors disabled:opacity-50 ${menuSaved ? 'bg-green-600 text-white' : 'bg-slate-900 text-white hover:bg-slate-800'}`}>
            {menuSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {menuSaved ? 'Saved!' : menuSaving ? 'Saving...' : 'Save Menu'}
          </button>
        )}
      </div>

      {/* Top tabs: Settings | Menu */}
      <div className="flex gap-1 mb-6 max-w-5xl border-b border-slate-200">
        <button onClick={() => setActiveTab('settings')}
          className={`px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors ${activeTab === 'settings' ? 'bg-white border border-b-white border-slate-200 text-slate-900 -mb-px' : 'text-slate-500 hover:text-slate-800'}`}>
          <span className="flex items-center gap-2"><Settings className="w-4 h-4" /> Settings</span>
        </button>
        <button onClick={() => setActiveTab('menu')}
          className={`px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors ${activeTab === 'menu' ? 'bg-white border border-b-white border-slate-200 text-slate-900 -mb-px' : 'text-slate-500 hover:text-slate-800'}`}>
          <span className="flex items-center gap-2"><MenuIcon className="w-4 h-4" /> Menu</span>
        </button>
      </div>

      {/* ── Settings Tab ── */}
      {activeTab === 'settings' && (
        <div className="flex gap-6 max-w-5xl">
          <nav className="w-48 flex-shrink-0 space-y-1">
            {groupKeys.map(group => {
              const meta = GROUP_META[group];
              return (
                <button key={group} onClick={() => setActiveGroup(group)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${activeGroup === group ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-white hover:text-slate-900'}`}>
                  {meta?.icon}
                  {meta?.label || group}
                </button>
              );
            })}
          </nav>

          <div className="flex-1">
            {groupKeys.filter(g => g === activeGroup).map(group => (
              <div key={group} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100">
                  <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                    {GROUP_META[group]?.icon}
                    {GROUP_META[group]?.label || group}
                  </h2>
                  {GROUP_META[group]?.description && (
                    <p className="text-sm text-slate-500 mt-1">{GROUP_META[group].description}</p>
                  )}
                </div>
                <div className="divide-y divide-slate-100">
                  {grouped[group]?.map(setting => (
                    <div key={setting.key} className="px-6 py-5 flex items-start justify-between gap-6">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800">{setting.label || setting.key}</p>
                        <p className="text-xs text-slate-400 mt-0.5 font-mono">{setting.key}</p>
                      </div>
                      <div className="flex-shrink-0 flex items-center">{renderControl(setting)}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Menu Tab ── */}
      {activeTab === 'menu' && (
        <div className="flex gap-6 max-w-5xl">
          {/* Menu location tabs */}
          <nav className="w-48 flex-shrink-0 space-y-1">
            {MENU_LOCATIONS.map(loc => (
              <button key={loc.key} onClick={() => setActiveMenuLoc(loc.key)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeMenuLoc === loc.key ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-white hover:text-slate-900'}`}>
                {loc.label}
              </button>
            ))}
          </nav>

          <div className="flex-1">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                <h2 className="text-base font-semibold text-slate-800">
                  {MENU_LOCATIONS.find(l => l.key === activeMenuLoc)?.label}
                </h2>
                <span className="text-xs text-slate-500">{locationItems.length} items</span>
              </div>

              <div className="divide-y divide-slate-100">
                {locationItems.length === 0 && (
                  <div className="px-6 py-8 text-center text-slate-400 text-sm">No items yet.</div>
                )}
                {locationItems.map((item, idx) => (
                  <div key={item.id} className="px-4 py-3">
                    {editingMenuId === item.id ? (
                      <div className="space-y-2">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <input type="text" value={item.label} onChange={e => updateMenuItem(item.id, { label: e.target.value })} placeholder="Label"
                            className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-slate-900" />
                          <input type="text" value={item.url} onChange={e => updateMenuItem(item.id, { url: e.target.value })} placeholder="URL"
                            className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-slate-900" />
                          <select value={item.target} onChange={e => updateMenuItem(item.id, { target: e.target.value })}
                            className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-slate-900">
                            <option value="_self">Same tab</option>
                            <option value="_blank">New tab</option>
                          </select>
                        </div>
                        {pages.length > 0 && (
                          <div>
                            <label className="text-xs text-slate-500 mb-1 block">Quick-pick a page:</label>
                            <div className="flex flex-wrap gap-1">
                              {pages.map(p => (
                                <button key={p.id} type="button" onClick={() => updateMenuItem(item.id, { label: p.title, url: `/${p.slug}` })}
                                  className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded">{p.title}</button>
                              ))}
                            </div>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <label className="flex items-center gap-1.5 text-sm text-slate-600 cursor-pointer">
                            <input type="checkbox" checked={item.is_active} onChange={e => updateMenuItem(item.id, { is_active: e.target.checked })} className="rounded border-slate-300" />
                            Active
                          </label>
                          <button onClick={() => setEditingMenuId(null)} className="text-xs bg-slate-900 text-white px-3 py-1.5 rounded-lg">Done</button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <GripVertical className="w-4 h-4 text-slate-300 flex-shrink-0" />
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <span className={`font-medium text-sm ${item.is_active ? 'text-slate-800' : 'text-slate-400 line-through'}`}>{item.label}</span>
                          <span className="text-xs text-slate-400 font-mono truncate">{item.url}</span>
                          {item.target === '_blank' && <ExternalLink className="w-3 h-3 text-slate-300 flex-shrink-0" />}
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button onClick={() => moveMenuItem(item.id, 'up')} disabled={idx === 0} className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20" title="Up">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                          </button>
                          <button onClick={() => moveMenuItem(item.id, 'down')} disabled={idx === locationItems.length - 1} className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20" title="Down">
                            <ChevronDown className="w-4 h-4" />
                          </button>
                          <button onClick={() => setEditingMenuId(item.id)} className="p-1.5 rounded hover:bg-slate-100 text-slate-500" title="Edit">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                          </button>
                          <button onClick={() => deleteMenuItem(item.id)} className="p-1.5 rounded hover:bg-red-50 text-red-400" title="Remove">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Add item */}
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100">
                {showAddForm ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <input type="text" value={newItem.label} onChange={e => setNewItem(p => ({ ...p, label: e.target.value }))} placeholder="Menu label"
                        className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-slate-900" />
                      <input type="text" value={newItem.url} onChange={e => setNewItem(p => ({ ...p, url: e.target.value }))} placeholder="URL e.g. /about"
                        className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-slate-900" />
                      <select value={newItem.target} onChange={e => setNewItem(p => ({ ...p, target: e.target.value }))}
                        className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-slate-900">
                        <option value="_self">Same tab</option>
                        <option value="_blank">New tab</option>
                      </select>
                    </div>
                    {pages.length > 0 && (
                      <div>
                        <label className="text-xs text-slate-500 mb-1 block">Quick-pick a page:</label>
                        <div className="flex flex-wrap gap-1">
                          {pages.map(p => (
                            <button key={p.id} type="button" onClick={() => setNewItem({ label: p.title, url: `/${p.slug}`, target: '_self' })}
                              className="text-xs bg-white border border-slate-200 hover:border-slate-400 text-slate-700 px-2 py-1 rounded">{p.title}</button>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <button onClick={addMenuItem} className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800">Add Item</button>
                      <button onClick={() => { setShowAddForm(false); setNewItem({ label: '', url: '', target: '_self' }); }} className="text-slate-500 px-3 py-2 text-sm hover:text-slate-700">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => setShowAddForm(true)} className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900">
                    <Plus className="w-4 h-4" /> Add menu item
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
