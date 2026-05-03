import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Settings, Save, Loader2, Type, Image as ImageIcon } from 'lucide-react';

interface Setting {
  id: string;
  key: string;
  value: string;
  label: string;
  group: string;
}

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

// Keys that render as toggles
const TOGGLE_KEYS = new Set(['post_featured_image_enabled']);

// Keys that render as number sliders / inputs
const NUMBER_KEYS = new Set([
  'post_body_font_size',
  'post_heading_font_size_h1',
  'post_heading_font_size_h2',
  'post_heading_font_size_h3',
]);

// Keys that render as decimal step inputs
const DECIMAL_KEYS = new Set([
  'post_body_line_height',
  'post_paragraph_spacing',
]);

// Keys that render as font family selects
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

export default function SettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeGroup, setActiveGroup] = useState('post_settings');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .order('group')
      .order('key');
    if (!error && data) setSettings(data);
    setLoading(false);
  };

  const updateSetting = (key: string, value: string) => {
    setSettings(prev => prev.map(s => s.key === key ? { ...s, value } : s));
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      for (const setting of settings) {
        await supabase
          .from('site_settings')
          .update({ value: setting.value, updated_at: new Date().toISOString() })
          .eq('key', setting.key);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error('Error saving settings:', err);
    } finally {
      setSaving(false);
    }
  };

  const grouped = settings.reduce<Record<string, Setting[]>>((acc, s) => {
    const g = s.group || 'general';
    if (!acc[g]) acc[g] = [];
    acc[g].push(s);
    return acc;
  }, {});

  const groupKeys = Object.keys(grouped);

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 rounded w-1/4" />
          <div className="h-40 bg-slate-200 rounded" />
        </div>
      </div>
    );
  }

  const renderControl = (setting: Setting) => {
    if (TOGGLE_KEYS.has(setting.key)) {
      return (
        <button
          type="button"
          onClick={() => updateSetting(setting.key, setting.value === 'true' ? 'false' : 'true')}
          className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none ${
            setting.value === 'true' ? 'bg-slate-900' : 'bg-slate-200'
          }`}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${
            setting.value === 'true' ? 'translate-x-6' : 'translate-x-1'
          }`} />
        </button>
      );
    }

    if (FONT_FAMILY_KEYS.has(setting.key)) {
      return (
        <div className="flex flex-col gap-2 min-w-[260px]">
          <select
            value={setting.value}
            onChange={(e) => updateSetting(setting.key, e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent bg-white"
          >
            {FONT_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <p className="text-xs text-slate-500" style={{ fontFamily: setting.value }}>
            The quick brown fox jumps over the lazy dog.
          </p>
        </div>
      );
    }

    if (NUMBER_KEYS.has(setting.key)) {
      const num = parseInt(setting.value) || 0;
      return (
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={10}
            max={72}
            step={1}
            value={num}
            onChange={(e) => updateSetting(setting.key, e.target.value)}
            className="w-32 accent-slate-800"
          />
          <div className="flex items-center gap-1">
            <input
              type="number"
              min={10}
              max={72}
              value={num}
              onChange={(e) => updateSetting(setting.key, e.target.value)}
              className="w-16 px-2 py-1 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent text-center"
            />
            <span className="text-xs text-slate-500">px</span>
          </div>
        </div>
      );
    }

    if (DECIMAL_KEYS.has(setting.key)) {
      const val = parseFloat(setting.value) || 1;
      return (
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={1}
            max={3}
            step={0.05}
            value={val}
            onChange={(e) => updateSetting(setting.key, parseFloat(e.target.value).toFixed(2))}
            className="w-32 accent-slate-800"
          />
          <input
            type="number"
            min={1}
            max={3}
            step={0.05}
            value={val}
            onChange={(e) => updateSetting(setting.key, e.target.value)}
            className="w-20 px-2 py-1 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent text-center"
          />
        </div>
      );
    }

    return (
      <input
        type="text"
        value={setting.value}
        onChange={(e) => updateSetting(setting.key, e.target.value)}
        className="w-48 px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
      />
    );
  };

  return (
    <div className="p-8 min-h-screen bg-slate-50">
      <div className="flex items-center justify-between mb-8 max-w-5xl">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Settings className="w-8 h-8 text-slate-600" />
            Settings
          </h1>
          <p className="text-slate-500 mt-1">Manage your site-wide configuration</p>
        </div>
        <button
          onClick={saveSettings}
          disabled={saving}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors disabled:opacity-50 ${
            saved
              ? 'bg-green-600 text-white'
              : 'bg-slate-900 text-white hover:bg-slate-800'
          }`}
        >
          {saving
            ? <Loader2 className="w-4 h-4 animate-spin" />
            : <Save className="w-4 h-4" />
          }
          {saved ? 'Saved!' : saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="flex gap-6 max-w-5xl">
        {/* Sidebar nav */}
        <nav className="w-48 flex-shrink-0">
          <div className="space-y-1">
            {groupKeys.map(group => {
              const meta = GROUP_META[group];
              return (
                <button
                  key={group}
                  onClick={() => setActiveGroup(group)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
                    activeGroup === group
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:bg-white hover:text-slate-900'
                  }`}
                >
                  {meta?.icon}
                  {meta?.label || group}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Settings panel */}
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
                {grouped[group]?.map((setting) => (
                  <div key={setting.key} className="px-6 py-5 flex items-start justify-between gap-6">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800">{setting.label || setting.key}</p>
                      <p className="text-xs text-slate-400 mt-0.5 font-mono">{setting.key}</p>
                    </div>
                    <div className="flex-shrink-0 flex items-center">
                      {renderControl(setting)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
