import { ChangeEvent, useState } from 'react';
import { Download, Printer, ChevronRight, CalendarDays, RotateCcw, Sparkles, Palette, Settings2, HelpCircle, ImagePlus, X, LayoutTemplate } from 'lucide-react';
import { Link } from 'react-router-dom';
import { RelatedGenerators } from '../../components/RelatedGenerators';

interface Theme {
  id: string;
  name: string;
  accent: string;
  bg: string;
  cellBg: string;
  headerBg: string;
  decoration?: string;
}

const themes: Theme[] = [
  { id: 'clean', name: 'Clean White', accent: '#F97316', bg: '#ffffff', cellBg: '#ffffff', headerBg: '#FFF7ED' },
  { id: 'autumn', name: 'Autumn', accent: '#D97706', bg: '#FEF6E4', cellBg: '#FFFBF0', headerBg: '#FDE68A', decoration: '🍂' },
  { id: 'ocean', name: 'Ocean', accent: '#0891B2', bg: '#ECFEFF', cellBg: '#ffffff', headerBg: '#CFFAFE', decoration: '🌊' },
  { id: 'forest', name: 'Forest', accent: '#059669', bg: '#ECFDF5', cellBg: '#ffffff', headerBg: '#A7F3D0', decoration: '🌿' },
  { id: 'rose', name: 'Rose', accent: '#E11D48', bg: '#FFF1F2', cellBg: '#ffffff', headerBg: '#FECDD3', decoration: '🌹' },
  { id: 'sunshine', name: 'Sunshine', accent: '#CA8A04', bg: '#FEFCE8', cellBg: '#ffffff', headerBg: '#FEF08A', decoration: '☀️' },
  { id: 'lavender', name: 'Lavender', accent: '#7C3AED', bg: '#F5F3FF', cellBg: '#ffffff', headerBg: '#DDD6FE', decoration: '🌸' },
  { id: 'slate', name: 'Slate', accent: '#475569', bg: '#F8FAFC', cellBg: '#ffffff', headerBg: '#E2E8F0' },
  { id: 'coral', name: 'Coral', accent: '#F43F5E', bg: '#FFF1F2', cellBg: '#ffffff', headerBg: '#FDA4AF', decoration: '🐚' },
  { id: 'mint', name: 'Mint', accent: '#10B981', bg: '#F0FDF4', cellBg: '#ffffff', headerBg: '#BBF7D0', decoration: '🍃' },
];

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const dayNamesShort = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
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

export function MonthlyCalendarGenerator() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [weekStartsOn, setWeekStartsOn] = useState<0 | 1>(0);
  const [theme, setTheme] = useState<Theme>(themes[0]);
  const [title, setTitle] = useState('');
  const [showNotes, setShowNotes] = useState(true);
  const [notesLabel, setNotesLabel] = useState('Notes');
  const [noteRows, setNoteRows] = useState(3);
  const [cellSize, setCellSize] = useState<'compact' | 'regular' | 'spacious'>('regular');
  const [showWeekend, setShowWeekend] = useState(true);
  const [activePanel, setActivePanel] = useState<'settings' | 'theme' | 'help'>('settings');
  const [bannerImage, setBannerImage] = useState('');

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfWeek(year, month, weekStartsOn);
  const dayLabels = weekStartsOn === 0 ? dayNamesFull : dayNamesMonStart;
  const displayTitle = title || `${monthNames[month]} ${year}`;

  const cellHeight = cellSize === 'compact' ? '32px' : cellSize === 'regular' ? '48px' : '68px';
  const dateFontSize = cellSize === 'compact' ? '13px' : cellSize === 'regular' ? '15px' : '17px';
  const printCellHeight = cellSize === 'compact' ? '8mm' : cellSize === 'regular' ? '11mm' : '14mm';

  const handleReset = () => {
    setYear(now.getFullYear());
    setMonth(now.getMonth());
    setWeekStartsOn(0);
    setTheme(themes[0]);
    setTitle('');
    setShowNotes(true);
    setNotesLabel('Notes');
    setNoteRows(3);
    setCellSize('regular');
    setShowWeekend(true);
    setBannerImage('');
  };

  const handleBannerUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) return;
    const reader = new FileReader();
    reader.onload = () => setBannerImage(typeof reader.result === 'string' ? reader.result : '');
    reader.readAsDataURL(file);
  };

  const buildPrintHTML = () => {
    const cells: string[] = [];
    for (let i = 0; i < firstDay; i++) cells.push('<div class="cell empty"></div>');
    for (let d = 1; d <= daysInMonth; d++) {
      const dow = (new Date(year, month, d).getDay() - weekStartsOn + 7) % 7;
      const isWeekend = dow === 5 || dow === 6;
      const weekendClass = showWeekend && isWeekend ? ' weekend' : '';
      cells.push(`<div class="cell${weekendClass}"><span class="date">${d}</span></div>`);
    }
    const fillCount = cells.length <= 35 ? 35 : 42;
    while (cells.length < fillCount) cells.push('<div class="cell empty"></div>');

    const dayHeaderHTML = dayLabels.map((d) => `<div class="dh">${d}</div>`).join('');
    const bannerHTML = bannerImage ? `<div class="photo-banner"><img src="${bannerImage}" alt="Calendar banner" /><div class="photo-overlay"><span>PRINTABLE MONTHLY PLANNER</span></div></div>` : '';
    const notesHTML = showNotes ? `<div class="notes">
      <div class="notes-label">${notesLabel}</div>
      ${Array.from({ length: noteRows }).map(() => '<div class="notes-line"></div>').join('')}
    </div>` : '';

    const ch = printCellHeight;
    const dfs = dateFontSize;
    const numRows = cells.length / 7;

    return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${displayTitle}</title>
<style>
@page{size:A4 portrait;margin:10mm}
@media print{html,body{width:190mm;min-height:277mm}.page{page-break-inside:avoid}}
*{box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact}
html,body{margin:0;padding:0;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;direction:ltr}
.page{width:190mm;min-height:277mm;display:flex;flex-direction:column;background:#fff;direction:ltr}
.photo-banner{height:90mm;flex:0 0 90mm;overflow:hidden;position:relative;background:${theme.headerBg}}
.photo-banner img{width:100%;height:100%;object-fit:cover;display:block}
.photo-overlay{position:absolute;inset:0;display:flex;align-items:flex-end;padding:12px 20px;background:linear-gradient(180deg,transparent 45%,rgba(17,24,39,.48))}
.photo-overlay span{font-size:10px;font-weight:800;letter-spacing:2px;color:#fff}
.cal-header{background:${theme.headerBg};padding:11px 20px 13px;text-align:left;border-bottom:4px solid ${theme.accent}}
.cal-header h1{font-size:28px;font-weight:900;color:#111827;margin:0;letter-spacing:-.5px}
.cal-header .sub{font-size:12px;color:#6b7280;margin-top:2px}
.cal-body{padding:0 4px;flex:0 1 auto}
.days-row{display:grid;grid-template-columns:repeat(7,1fr);gap:3px;margin:6px 0 4px}
.dh{text-align:center;font-size:12px;font-weight:800;color:${theme.accent};padding:6px 0;text-transform:uppercase;letter-spacing:1.5px}
.grid{display:grid;grid-template-columns:repeat(7,1fr);grid-template-rows:repeat(${numRows},${ch});gap:3px}
.cell{border:1px solid #e5e7eb;padding:3px 5px;display:flex;align-items:flex-start;justify-content:flex-end;background:${theme.cellBg}}
.cell.empty{border-color:#f3f4f6;background:transparent}
.cell.weekend{background:${theme.headerBg}66}
.date{font-size:${dfs};font-weight:700;color:#1f2937}
.notes{margin-top:12px;padding:0 4px;flex:0 0 auto}
.spacer{flex:1 1 auto;min-height:8px}
.notes-label{font-size:13px;font-weight:800;color:${theme.accent};margin-bottom:3px}
.notes-line{border-bottom:1px solid #d1d5db;height:18px;margin-bottom:4px}
.footer{margin-top:auto;flex:0 0 auto;text-align:center;font-size:9px;color:#9ca3af;padding:16px 0 0}.footer p{margin:2px 0}.footer p:last-child{margin-bottom:0}
</style></head><body>
<div class="page">
${bannerHTML}
<div class="cal-header"><h1>${displayTitle}</h1></div>
<div class="cal-body">
<div class="days-row">${dayHeaderHTML}</div>
<div class="grid">${cells.join('')}</div>
</div>
${notesHTML}
<div class="spacer"></div>
<div class="footer"><p>Find more printable resources at PrintAndUse.com</p><p>Copyright &copy;2025 - www.printanduse.com | All rights reserved</p></div>
</div>
<script>window.onload=function(){window.print();window.onafterprint=function(){window.close()}}</script>
</body></html>`;
  };

  const openPrint = () => {
    const html = buildPrintHTML();
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.left = '-9999px';
    iframe.style.top = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = 'none';
    document.body.appendChild(iframe);
    const doc = iframe.contentWindow?.document;
    if (!doc) { document.body.removeChild(iframe); return; }
    doc.open();
    doc.write(html);
    doc.close();
    iframe.onload = () => {
      try {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      } catch {
        const w = window.open('', '_blank');
        if (w) { w.document.write(html); w.document.close(); }
      }
      setTimeout(() => document.body.removeChild(iframe), 1000);
    };
    if (iframe.contentWindow?.document?.readyState === 'complete') {
      iframe.onload(null);
    }
  };

  const downloadHTML = () => {
    const html = buildPrintHTML();
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${displayTitle.replace(/[^a-zA-Z0-9]/g, '_')}_calendar.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const allCells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) allCells.push(null);
  for (let d = 1; d <= daysInMonth; d++) allCells.push(d);
  const fillTotal = allCells.length <= 35 ? 35 : 42;
  while (allCells.length < fillTotal) allCells.push(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-orange-50/30">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-orange-600 transition">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/generators" className="hover:text-orange-600 transition">Generators</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-gray-900 font-medium">Monthly Calendar</span>
        </nav>

        {/* Hero */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center">
              <CalendarDays className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">Monthly Calendar Generator</h1>
              <p className="text-gray-500 mt-0.5">Design a beautiful printable calendar for any month</p>
            </div>
          </div>
        </div>

        {/* Panel switcher */}
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
              <div className="bg-white rounded-3xl border border-stone-200 shadow-[0_18px_50px_rgba(28,25,23,0.08)] p-6 space-y-5">
                <div className="flex items-center justify-between gap-3 pb-1">
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.18em] text-orange-600">Build your page</p>
                    <h2 className="text-lg font-black text-stone-900">Personalise the calendar</h2>
                  </div>
                  <LayoutTemplate className="w-5 h-5 text-stone-300" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Custom Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-100 focus:outline-none transition text-gray-900"
                    placeholder="Leave empty for month name"
                  />
                </div>

                <div className="rounded-2xl border border-dashed border-stone-300 bg-stone-50 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-black text-stone-900">Add a photo banner</p>
                      <p className="text-xs leading-5 text-stone-500 mt-1">Use a family photo, classroom scene, artwork, or seasonal image.</p>
                    </div>
                    <ImagePlus className="w-5 h-5 text-orange-500 shrink-0" />
                  </div>
                  {bannerImage ? (
                    <div className="relative mt-3 overflow-hidden rounded-xl border border-stone-200 bg-white">
                      <img src={bannerImage} alt="Selected calendar banner" className="h-24 w-full object-cover" />
                      <button type="button" onClick={() => setBannerImage('')} className="absolute right-2 top-2 rounded-full bg-stone-900/80 p-1.5 text-white hover:bg-stone-900" aria-label="Remove banner image"><X className="h-3.5 w-3.5" /></button>
                    </div>
                  ) : (
                    <label className="mt-3 flex cursor-pointer items-center justify-center rounded-xl bg-white px-4 py-3 text-sm font-bold text-stone-700 shadow-sm ring-1 ring-stone-200 transition hover:-translate-y-0.5 hover:ring-orange-300">
                      <ImagePlus className="mr-2 h-4 w-4 text-orange-500" /> Choose image
                      <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleBannerUpload} className="sr-only" />
                    </label>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Month</label>
                    <div className="relative">
                      <select
                        value={month}
                        onChange={(e) => setMonth(Number(e.target.value))}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-100 focus:outline-none transition appearance-none text-gray-900 font-medium"
                      >
                        {monthNames.map((m, i) => <option key={m} value={i}>{m}</option>)}
                      </select>
                    </div>
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
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Cell Size</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['compact', 'regular', 'spacious'] as const).map((sz) => (
                      <button
                        key={sz}
                        onClick={() => setCellSize(sz)}
                        className={`px-3 py-2.5 rounded-xl text-sm font-semibold capitalize transition ${
                          cellSize === sz
                            ? 'bg-orange-500 text-white shadow-sm'
                            : 'bg-gray-50 text-gray-600 border border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Notes Section</label>
                  <button
                    onClick={() => setShowNotes(!showNotes)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition ${
                      showNotes ? 'bg-orange-50 border border-orange-200' : 'bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <span className="font-semibold text-gray-900 text-sm">{showNotes ? 'Enabled' : 'Disabled'}</span>
                    <div className={`w-10 h-6 rounded-full transition ${showNotes ? 'bg-orange-500' : 'bg-gray-300'}`}>
                      <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform mt-0.5 ${showNotes ? 'translate-x-4' : 'translate-x-0.5'}`} />
                    </div>
                  </button>
                  {showNotes && (
                    <div className="mt-3 space-y-3">
                      <input
                        type="text"
                        value={notesLabel}
                        onChange={(e) => setNotesLabel(e.target.value)}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-100 focus:outline-none transition text-sm text-gray-900"
                        placeholder="Notes label"
                      />
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Lines: {noteRows}</label>
                        <input
                          type="range"
                          min={1}
                          max={6}
                          value={noteRows}
                          onChange={(e) => setNoteRows(Number(e.target.value))}
                          className="w-full accent-orange-500"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Weekend Shading</label>
                  <button
                    onClick={() => setShowWeekend(!showWeekend)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition ${
                      showWeekend ? 'bg-orange-50 border border-orange-200' : 'bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <span className="font-semibold text-gray-900 text-sm">{showWeekend ? 'On' : 'Off'}</span>
                    <div className={`w-10 h-6 rounded-full transition ${showWeekend ? 'bg-orange-500' : 'bg-gray-300'}`}>
                      <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform mt-0.5 ${showWeekend ? 'translate-x-4' : 'translate-x-0.5'}`} />
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
                  <Sparkles className="w-4 h-4 text-orange-500" />
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
                        <div className="flex gap-1.5">
                          <div className="w-6 h-6 rounded-md" style={{ background: t.accent }} />
                          <div className="w-6 h-6 rounded-md border" style={{ background: t.headerBg }} />
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
                    'Choose a month and year for your calendar',
                    'Decide if the week starts on Sunday or Monday',
                    'Pick a cell size — compact for small calendars, spacious for writing room',
                    'Add a notes section with custom label and line count',
                    'Switch to Themes to choose a color palette',
                    'Download or print your finished calendar',
                  ].map((step, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 text-orange-600 text-xs font-bold flex items-center justify-center">
                        {i + 1}
                      </span>
                      <span className="text-sm text-gray-700">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>

          {/* Right: live preview */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <div><h2 className="text-sm font-bold text-gray-900">Live Preview</h2><p className="mt-0.5 text-xs text-stone-400">Your printable page updates as you edit</p></div>
                <span className="rounded-full bg-stone-100 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-stone-500">A4 Portrait</span>
              </div>

              <div className="p-5 sm:p-8 bg-stone-100 flex justify-center">
                <div
                  className="w-full max-w-[500px] overflow-hidden rounded-[22px] border border-stone-200 bg-white shadow-[0_22px_60px_rgba(28,25,23,0.18)] transition-transform duration-300 hover:-translate-y-1"
                  dir="ltr"
                  style={{ background: theme.bg, fontFamily: 'Inter, sans-serif', direction: 'ltr' }}
                >
                  <div className={`relative h-44 overflow-hidden sm:h-56 ${bannerImage ? 'bg-stone-200' : 'bg-[radial-gradient(circle_at_20%_20%,#fed7aa_0,#fff7ed_35%,#f5f5f4_100%)]'}`}>
                    {bannerImage ? <img src={bannerImage} alt="Calendar banner preview" className="h-full w-full object-cover" /> : <div className="flex h-full flex-col items-center justify-center gap-3 text-stone-600"><div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/80 text-orange-500 shadow-sm ring-1 ring-orange-100"><ImagePlus className="h-7 w-7" /></div><div className="text-center"><p className="text-xs font-black uppercase tracking-[0.18em]">Make it yours</p><p className="mt-1 text-[11px] text-stone-500">Add a photo banner to begin</p></div></div>}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-5 pb-4 pt-12">
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/80">Printable monthly planner</p>
                    </div>
                  </div>
                  <div className="flex items-end justify-between gap-4 border-b-4 px-5 py-4" style={{ borderColor: theme.accent, background: theme.headerBg }}>
                    <h3 className="text-2xl font-black tracking-tight text-stone-900">{displayTitle}</h3>
                    <CalendarDays className="mb-1 h-5 w-5 shrink-0" style={{ color: theme.accent }} />
                  </div>

                  {/* Day headers */}
                  <div className="grid grid-cols-7 gap-1 px-3 pt-3">
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
                  <div className="grid grid-cols-7 gap-1 px-3 pb-3">
                    {allCells.map((cell, i) => {
                      if (cell === null) {
                        return <div key={i} className="rounded-md" style={{ height: cellHeight }} />;
                      }
                      const dow = (new Date(year, month, cell).getDay() - weekStartsOn + 7) % 7;
                      const isWeekend = dow === 5 || dow === 6;
                      return (
                        <div
                          key={i}
                          className="rounded-md border flex items-start justify-end p-1.5"
                          style={{
                            height: cellHeight,
                            borderColor: '#e5e7eb',
                            background: showWeekend && isWeekend ? `${theme.headerBg}66` : theme.cellBg,
                          }}
                        >
                          <span
                            className="font-bold text-gray-800 leading-none"
                            style={{ fontSize: dateFontSize }}
                          >
                            {cell}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Notes */}
                  {showNotes && (
                    <div className="px-5 pb-3">
                      <p className="text-sm font-bold mb-1" style={{ color: theme.accent }}>{notesLabel}</p>
                      {Array.from({ length: noteRows }).map((_, i) => (
                        <div key={i} className="border-b border-gray-300 h-4 mb-1" />
                      ))}
                    </div>
                  )}

                  {/* Footer */}
                  <div className="text-center py-3 border-t border-gray-100">
                    <p className="text-[10px] text-gray-400">Made for your month · PrintAndUse.com</p>
                  </div>
                </div>
              </div>

              {/* Action bar */}
              <div className="flex flex-col gap-3 border-t border-gray-100 bg-gray-50 p-5 sm:flex-row sm:p-6">
                <button
                  onClick={downloadHTML}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-stone-900 text-white rounded-xl hover:bg-orange-600 transition font-bold shadow-sm"
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
          currentSlug="monthly-calendar"
        />
      </div>
    </div>
  );
}