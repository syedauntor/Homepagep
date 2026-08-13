import { useState } from 'react';
import { Download, Printer, ChevronRight, Hourglass, RotateCcw, Palette, Settings2, HelpCircle, Target, Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';
import { RelatedGenerators } from '../../components/RelatedGenerators';

interface Theme {
  id: string;
  name: string;
  accent: string;
  bg: string;
  cellBg: string;
  headerBg: string;
  targetBg: string;
  decoration?: string;
}

const themes: Theme[] = [
  { id: 'clean', name: 'Clean', accent: '#F97316', bg: '#ffffff', cellBg: '#FFF7ED', headerBg: '#FFEDD5', targetBg: '#F97316' },
  { id: 'autumn', name: 'Autumn', accent: '#D97706', bg: '#FEF6E4', cellBg: '#FFFBF0', headerBg: '#FDE68A', targetBg: '#D97706', decoration: '🍂' },
  { id: 'ocean', name: 'Ocean', accent: '#0891B2', bg: '#ECFEFF', cellBg: '#E0F7FA', headerBg: '#CFFAFE', targetBg: '#0891B2', decoration: '🌊' },
  { id: 'forest', name: 'Forest', accent: '#059669', bg: '#ECFDF5', cellBg: '#D1FAE5', headerBg: '#A7F3D0', targetBg: '#059669', decoration: '🌿' },
  { id: 'rose', name: 'Rose', accent: '#E11D48', bg: '#FFF1F2', cellBg: '#FFE4E6', headerBg: '#FECDD3', targetBg: '#E11D48', decoration: '🌹' },
  { id: 'sunshine', name: 'Sunshine', accent: '#CA8A04', bg: '#FEFCE8', cellBg: '#FEF9C3', headerBg: '#FEF08A', targetBg: '#CA8A04', decoration: '☀️' },
  { id: 'lavender', name: 'Lavender', accent: '#7C3AED', bg: '#F5F3FF', cellBg: '#EDE9FE', headerBg: '#DDD6FE', targetBg: '#7C3AED', decoration: '🌸' },
  { id: 'slate', name: 'Slate', accent: '#475569', bg: '#F8FAFC', cellBg: '#F1F5F9', headerBg: '#E2E8F0', targetBg: '#475569' },
  { id: 'coral', name: 'Coral', accent: '#F43F5E', bg: '#FFF1F2', cellBg: '#FFE4E6', headerBg: '#FDA4AF', targetBg: '#F43F5E', decoration: '🐚' },
  { id: 'mint', name: 'Mint', accent: '#10B981', bg: '#F0FDF4', cellBg: '#DCFCE7', headerBg: '#BBF7D0', targetBg: '#10B981', decoration: '🍃' },
];

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const dayNamesFull = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const dayNamesMonStart = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const calendarGenerators = [
  { name: 'Monthly Calendar Generator', slug: 'monthly-calendar' },
  { name: 'Countdown Calendar Generator', slug: 'countdown-calendar' },
];

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfWeek(year: number, month: number, weekStartsOn: number): number {
  const jsDay = new Date(year, month, 1).getDay();
  return (jsDay - weekStartsOn + 7) % 7;
}
function formatDate(date: Date): string {
  return `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}
function diffInDays(from: Date, to: Date): number {
  const ms = to.getTime() - from.getTime();
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}

export function CountdownCalendarGenerator() {
  const now = new Date();
  const defaultTarget = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 30);

  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [weekStartsOn, setWeekStartsOn] = useState<0 | 1>(0);
  const [theme, setTheme] = useState<Theme>(themes[0]);
  const [title, setTitle] = useState('');
  const [targetDate, setTargetDate] = useState(defaultTarget.toISOString().split('T')[0]);
  const [shape, setShape] = useState<'circle' | 'square' | 'star'>('circle');
  const [showCount, setShowCount] = useState(true);
  const [activePanel, setActivePanel] = useState<'settings' | 'theme' | 'help'>('settings');

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfWeek(year, month, weekStartsOn);
  const dayLabels = weekStartsOn === 0 ? dayNamesFull : dayNamesMonStart;

  const target = new Date(targetDate + 'T00:00:00');
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const daysLeft = diffInDays(today, target);
  const displayTitle = title || `Countdown to ${formatDate(target)}`;
  const targetDay = target.getFullYear() === year && target.getMonth() === month ? target.getDate() : null;

  const handleReset = () => {
    setYear(now.getFullYear());
    setMonth(now.getMonth());
    setWeekStartsOn(0);
    setTheme(themes[0]);
    setTitle('');
    setTargetDate(defaultTarget.toISOString().split('T')[0]);
    setShape('circle');
    setShowCount(true);
  };

  const shapeStyle = (isTarget: boolean): React.CSSProperties => {
    const base: React.CSSProperties = {
      width: isTarget ? '46px' : '38px',
      height: isTarget ? '46px' : '38px',
      background: isTarget ? theme.targetBg : theme.cellBg,
      border: isTarget ? `3px solid ${theme.accent}` : `1.5px solid ${theme.headerBg}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: isTarget ? `0 0 0 4px ${theme.accent}22` : 'none',
    };
    if (shape === 'circle') return { ...base, borderRadius: '50%' };
    if (shape === 'square') return { ...base, borderRadius: '8px' };
    return { ...base, clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)', borderRadius: '0', border: 'none' };
  };

  const buildPrintHTML = () => {
    const shapeCSSStr = shape === 'circle' ? 'border-radius:50%;' : shape === 'square' ? 'border-radius:8px;' : 'clip-path:polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%);border:none;';
    const cells: string[] = [];
    for (let i = 0; i < firstDay; i++) cells.push('<div class="cell empty"></div>');
    for (let d = 1; d <= daysInMonth; d++) {
      const isTarget = d === targetDay;
      const sw = isTarget ? '46px' : '38px';
      const sh = isTarget ? '46px' : '38px';
      const bg = isTarget ? theme.targetBg : theme.cellBg;
      const bd = isTarget ? `3px solid ${theme.accent}` : `1.5px solid ${theme.headerBg}`;
      const bx = isTarget ? `0 0 0 4px ${theme.accent}22` : 'none';
      const numColor = isTarget ? '#fff' : '#1f2937';
      const numSize = isTarget ? '16px' : '14px';
      const badge = isTarget ? '<div class="badge">TARGET</div>' : '';
      cells.push(`<div class="cell"><div class="shape" style="${shapeCSSStr}width:${sw};height:${sh};background:${bg};border:${bd};box-shadow:${bx}"><span class="num" style="color:${numColor};font-size:${numSize}">${d}</span></div>${badge}</div>`);
    }
    const fillCount = cells.length <= 35 ? 35 : 42;
    while (cells.length < fillCount) cells.push('<div class="cell empty"></div>');

    const dayHeaderHTML = dayLabels.map((d) => `<div class="dh">${d}</div>`).join('');
    const bannerHTML = showCount && targetDay !== null ? `<div class="banner"><span class="banner-num">${daysLeft}</span><span class="banner-lbl">days to go</span></div>` : '';

    return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${displayTitle}</title>
<style>
@page{size:A4 portrait;margin:10mm}
*{box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact}
html,body{margin:0;padding:0;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}
.page{width:190mm;min-height:277mm;display:flex;flex-direction:column;background:#fff}
.cal-header{background:${theme.headerBg};border-radius:12px 12px 0 0;padding:14px 20px;text-align:center}
.cal-header h1{font-size:26px;font-weight:900;color:${theme.accent};margin:0;letter-spacing:.5px}
.cal-header .sub{font-size:12px;color:#6b7280;margin-top:3px}
.banner{text-align:center;padding:10px;margin:8px 4px;border-radius:10px;background:${theme.accent}10}
.banner-num{font-size:28px;font-weight:900;color:${theme.accent}}
.banner-lbl{font-size:13px;color:#6b7280;margin-left:8px}
.cal-body{padding:0 4px}
.days-row{display:grid;grid-template-columns:repeat(7,1fr);gap:3px;margin:6px 0}
.dh{text-align:center;font-size:12px;font-weight:800;color:${theme.accent};padding:6px 0;text-transform:uppercase;letter-spacing:1.5px}
.grid{display:grid;grid-template-columns:repeat(7,1fr);gap:6px}
.cell{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:6px 0;min-height:52px}
.cell.empty{min-height:0}
.shape{display:flex;align-items:center;justify-content:center}
.num{font-weight:700;line-height:1}
.badge{font-size:7px;font-weight:800;color:${theme.accent};margin-top:3px;letter-spacing:.5px}
.footer{text-align:center;font-size:10px;color:#9ca3af;padding:10px 0}
</style></head><body>
<div class="page">
<div class="cal-header"><h1>${displayTitle}</h1><div class="sub">Target: ${formatDate(target)}</div></div>
${bannerHTML}
<div class="cal-body">
<div class="days-row">${dayHeaderHTML}</div>
<div class="grid">${cells.join('')}</div>
</div>
<div class="footer"><p>Find more printable resources at PrintAndUse.com</p><p>Copyright &copy;2025 - www.printanduse.com | All rights reserved</p></div>
</div>
<script>window.onload=function(){window.print();window.onafterprint=function(){window.close()}}</script>
</body></html>`;
  };

  const openPrint = () => {
    const w = window.open('', '_blank', 'width=900,height=1200');
    if (!w) return;
    w.document.write(buildPrintHTML());
    w.document.close();
  };

  const allCells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) allCells.push(null);
  for (let d = 1; d <= daysInMonth; d++) allCells.push(d);
  const fillTotal = allCells.length <= 35 ? 35 : 42;
  while (allCells.length < fillTotal) allCells.push(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-orange-50/30">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-orange-600 transition">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/generators" className="hover:text-orange-600 transition">Generators</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-gray-900 font-medium">Countdown Calendar</span>
        </nav>

        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center">
              <Hourglass className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">Countdown Calendar Generator</h1>
              <p className="text-gray-500 mt-0.5">Cross off each day until your special event arrives</p>
            </div>
          </div>
        </div>

        {/* Days remaining card */}
        {daysLeft > 0 && (
          <div className="mb-6 flex items-center gap-4 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl px-6 py-4 text-white shadow-lg">
            <Target className="w-8 h-8 flex-shrink-0" />
            <div>
              <p className="text-sm opacity-90">Counting down to {formatDate(target)}</p>
              <p className="text-2xl font-black">{daysLeft} days to go!</p>
            </div>
          </div>
        )}

        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {([
            { id: 'settings' as const, label: 'Settings', icon: Settings2 },
            { id: 'theme' as const, label: 'Themes', icon: Palette },
            { id: 'help' as const, label: 'How it works', icon: HelpCircle },
          ]).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActivePanel(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition whitespace-nowrap ${
                activePanel === tab.id
                  ? 'bg-gray-900 text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-[380px_1fr] gap-6">
          {/* Left: controls */}
          <div className="space-y-4">
            {activePanel === 'settings' && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Custom Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-100 focus:outline-none transition text-gray-900"
                    placeholder="e.g. Countdown to Vacation"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Target Date</label>
                  <input
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-100 focus:outline-none transition text-gray-900 font-medium"
                  />
                  {daysLeft > 0 && (
                    <p className="text-xs text-orange-600 mt-2 font-semibold">{daysLeft} days from today</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Month</label>
                    <select
                      value={month}
                      onChange={(e) => setMonth(Number(e.target.value))}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-100 focus:outline-none transition appearance-none text-gray-900 font-medium"
                    >
                      {monthNames.map((m, i) => <option key={m} value={i}>{m}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Year</label>
                    <input
                      type="number"
                      value={year}
                      min={2000}
                      max={2100}
                      onChange={(e) => setYear(Number(e.target.value))}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-100 focus:outline-none transition text-gray-900 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Week Starts</label>
                  <div className="grid grid-cols-2 gap-2">
                    {([
                      { val: 0 as const, label: 'Sunday' },
                      { val: 1 as const, label: 'Monday' },
                    ]).map((opt) => (
                      <button
                        key={opt.val}
                        onClick={() => setWeekStartsOn(opt.val)}
                        className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
                          weekStartsOn === opt.val
                            ? 'bg-orange-500 text-white shadow-sm'
                            : 'bg-gray-50 text-gray-600 border border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Day Marker Shape</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['circle', 'square', 'star'] as const).map((s) => (
                      <button
                        key={s}
                        onClick={() => setShape(s)}
                        className={`px-3 py-2.5 rounded-xl text-sm font-semibold capitalize transition ${
                          shape === s
                            ? 'bg-orange-500 text-white shadow-sm'
                            : 'bg-gray-50 text-gray-600 border border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Days-Remaining Banner</label>
                  <button
                    onClick={() => setShowCount(!showCount)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition ${
                      showCount ? 'bg-orange-50 border border-orange-200' : 'bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <span className="font-semibold text-gray-900 text-sm">{showCount ? 'Shown' : 'Hidden'}</span>
                    <div className={`w-10 h-6 rounded-full transition ${showCount ? 'bg-orange-500' : 'bg-gray-300'}`}>
                      <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform mt-0.5 ${showCount ? 'translate-x-4' : 'translate-x-0.5'}`} />
                    </div>
                  </button>
                </div>

                <button
                  onClick={handleReset}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 text-gray-500 rounded-xl hover:bg-gray-50 transition font-semibold text-sm border border-gray-200"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset all
                </button>
              </div>
            )}

            {activePanel === 'theme' && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Palette className="w-4 h-4 text-orange-500" />
                  <h2 className="text-sm font-bold text-gray-900">Pick a theme</h2>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {themes.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTheme(t)}
                      className={`rounded-xl p-3 transition-all text-left ${
                        theme.id === t.id
                          ? 'ring-2 ring-orange-500 ring-offset-1'
                          : 'ring-1 ring-gray-200 hover:ring-gray-300'
                      }`}
                    >
                      <div
                        className="h-20 rounded-lg flex flex-col items-center justify-center gap-1 mb-2"
                        style={{ background: t.bg }}
                      >
                        <div className="flex gap-1.5 items-center">
                          <div className="w-7 h-7 rounded-full" style={{ background: t.targetBg }} />
                          <div className="w-7 h-7 rounded-md border" style={{ background: t.cellBg, borderColor: t.headerBg }} />
                        </div>
                        {t.decoration && <span className="text-lg">{t.decoration}</span>}
                      </div>
                      <p className="text-xs font-bold text-gray-900">{t.name}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activePanel === 'help' && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="text-sm font-bold text-gray-900 mb-4">How it works</h2>
                <ol className="space-y-3">
                  {[
                    'Set your target date — the event you are counting down to',
                    'Pick which month to display on the calendar',
                    'Choose a marker shape: circles, squares, or stars',
                    'Toggle the days-remaining banner on or off',
                    'Switch to Themes to pick a color palette',
                    'Download or print — then cross off each day!',
                  ].map((step, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 text-orange-600 text-xs font-bold flex items-center justify-center">
                        {i + 1}
                      </span>
                      <span className="text-sm text-gray-700">{step}</span>
                    </li>
                  ))}
                </ol>
                <div className="mt-4 p-4 bg-orange-50 rounded-xl">
                  <p className="text-sm text-gray-700">
                    The target day is highlighted with a solid marker. Every other day shows an
                    outline marker that can be colored in or crossed off as each day passes.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right: live preview */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h2 className="text-sm font-bold text-gray-900">Live Preview</h2>
                <span className="text-xs text-gray-400">A4 Portrait</span>
              </div>

              <div className="p-8 bg-stone-100 flex justify-center">
                <div
                  className="rounded-2xl overflow-hidden shadow-lg"
                  style={{ width: '460px', background: theme.bg, fontFamily: 'Inter, sans-serif' }}
                >
                  {/* Header bar */}
                  <div className="text-center py-4 px-5" style={{ background: theme.headerBg }}>
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <Rocket className="w-4 h-4" style={{ color: theme.accent }} />
                    </div>
                    <h3 className="text-xl font-black tracking-tight" style={{ color: theme.accent }}>
                      {displayTitle}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">Target: {formatDate(target)}</p>
                  </div>

                  {/* Days remaining banner */}
                  {showCount && targetDay !== null && (
                    <div className="mx-4 my-3 rounded-xl py-3 text-center" style={{ background: `${theme.accent}10` }}>
                      <span className="text-2xl font-black" style={{ color: theme.accent }}>{daysLeft}</span>
                      <span className="text-sm text-gray-500 ml-2">days to go</span>
                    </div>
                  )}

                  {/* Day headers */}
                  <div className="grid grid-cols-7 gap-1 px-3 pt-2">
                    {dayLabels.map((d, i) => (
                      <div
                        key={i}
                        className="text-center py-2 text-xs font-bold uppercase tracking-wider"
                        style={{ color: theme.accent }}
                      >
                        {d}
                      </div>
                    ))}
                  </div>

                  {/* Calendar grid */}
                  <div className="grid grid-cols-7 gap-1.5 px-3 pb-4">
                    {allCells.map((cell, i) => {
                      if (cell === null) {
                        return <div key={i} className="flex items-center justify-center py-2 min-h-[48px]" />;
                      }
                      const isTarget = cell === targetDay;
                      return (
                        <div key={i} className="flex flex-col items-center justify-center py-1.5 min-h-[48px]">
                          <div style={shapeStyle(isTarget)}>
                            <span
                              className="font-bold leading-none"
                              style={{
                                fontSize: isTarget ? '16px' : '14px',
                                color: isTarget ? '#ffffff' : '#1f2937',
                              }}
                            >
                              {cell}
                            </span>
                          </div>
                          {isTarget && (
                            <span
                              className="text-[7px] font-extrabold mt-1 tracking-wide"
                              style={{ color: theme.accent }}
                            >
                              TARGET
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Footer */}
                  <div className="text-center py-3 border-t border-gray-100">
                    <p className="text-[10px] text-gray-400">PrintAndUse.com · Copyright ©2025</p>
                  </div>
                </div>
              </div>

              {/* Action bar */}
              <div className="flex gap-3 p-6 border-t border-gray-100 bg-gray-50">
                <button
                  onClick={openPrint}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition font-bold shadow-sm"
                >
                  <Download className="w-5 h-5" />
                  Download
                </button>
                <button
                  onClick={openPrint}
                  className="flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition font-bold border border-gray-200"
                >
                  <Printer className="w-5 h-5" />
                  Print
                </button>
              </div>
            </div>
          </div>
        </div>

        <RelatedGenerators
          title="More Calendar Generators"
          generators={calendarGenerators}
          currentSlug="countdown-calendar"
        />
      </div>
    </div>
  );
}
