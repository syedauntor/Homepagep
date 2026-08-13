import { useState } from 'react';
import { Download, Printer, Eye, RefreshCw, ChevronRight, Play, Hourglass } from 'lucide-react';
import { Link } from 'react-router-dom';
import { RelatedGenerators } from '../../components/RelatedGenerators';

interface Theme {
  id: string;
  name: string;
  accentColor: string;
  borderColor: string;
  bgColor: string;
  cellShade: string;
  decoration?: string;
}

const themes: Theme[] = [
  { id: 'blank', name: 'Blank', accentColor: '#F97316', borderColor: 'transparent', bgColor: '#ffffff', cellShade: '#FFF7ED' },
  { id: 'autumn', name: 'Autumn Leaves', accentColor: '#10B981', borderColor: '#10B981', bgColor: '#FEF6E4', cellShade: '#ECFDF5', decoration: '🍂' },
  { id: 'beep', name: 'Beep Beep', accentColor: '#F59E0B', borderColor: '#F59E0B', bgColor: '#FFF8E1', cellShade: '#FFFBEB', decoration: '🚗' },
  { id: 'blue', name: 'Ocean Blue', accentColor: '#06B6D4', borderColor: '#06B6D4', bgColor: '#E0F7FA', cellShade: '#ECFEFF', decoration: '🌊' },
  { id: 'green', name: 'Fresh Green', accentColor: '#10B981', borderColor: '#10B981', bgColor: '#ECFDF5', cellShade: '#F0FDF4', decoration: '🌿' },
  { id: 'hearts', name: 'Hearts', accentColor: '#EC4899', borderColor: '#EC4899', bgColor: '#FDF2F8', cellShade: '#FCE7F3', decoration: '❤️' },
  { id: 'yellow', name: 'Sunny Yellow', accentColor: '#EAB308', borderColor: '#EAB308', bgColor: '#FEFCE8', cellShade: '#FEFCE8', decoration: '☀️' },
  { id: 'lavender', name: 'Lavender', accentColor: '#A78BFA', borderColor: '#A78BFA', bgColor: '#F5F3FF', cellShade: '#EDE9FE', decoration: '🌸' },
  { id: 'coral', name: 'Coral', accentColor: '#FB7185', borderColor: '#FB7185', bgColor: '#FFF1F2', cellShade: '#FFF1F2', decoration: '🐚' },
  { id: 'slate', name: 'Minimal Slate', accentColor: '#475569', borderColor: '#475569', bgColor: '#F8FAFC', cellShade: '#F1F5F9' },
];

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const dayNamesWeekStart = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

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
  const [selectedTheme, setSelectedTheme] = useState<Theme>(themes[0]);
  const [title, setTitle] = useState('');
  const [targetDate, setTargetDate] = useState(defaultTarget.toISOString().split('T')[0]);
  const [shape, setShape] = useState<'circle' | 'square' | 'star'>('circle');
  const [showCount, setShowCount] = useState(true);
  const [hasGenerated, setHasGenerated] = useState(true);
  const [activeNavTab, setActiveNavTab] = useState<'generator' | 'theme' | 'howto'>('generator');

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfWeek(year, month, weekStartsOn);
  const dayLabels = weekStartsOn === 0 ? dayNames : dayNamesWeekStart;

  const target = new Date(targetDate + 'T00:00:00');
  const daysLeft = diffInDays(new Date(now.getFullYear(), now.getMonth(), now.getDate()), target);
  const displayTitle = title || `Countdown to ${formatDate(target)}`;

  const targetDay = target.getFullYear() === year && target.getMonth() === month ? target.getDate() : null;

  const handleReset = () => {
    setYear(now.getFullYear());
    setMonth(now.getMonth());
    setWeekStartsOn(0);
    setSelectedTheme(themes[0]);
    setTitle('');
    setTargetDate(defaultTarget.toISOString().split('T')[0]);
    setShape('circle');
    setShowCount(true);
  };

  const shapeCSS = (d: number): string => {
    if (shape === 'circle') return `border-radius:50%;`;
    if (shape === 'square') return `border-radius:4px;`;
    return `clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%); border-radius:0;`;
  };

  const buildCountdownHTML = () => {
    const hasBorder = selectedTheme.id !== 'blank';
    const borderStyle = hasBorder ? `border:3px solid ${selectedTheme.borderColor};` : '';

    const cells: string[] = [];
    for (let i = 0; i < firstDay; i++) cells.push('<div class="cell empty"></div>');
    for (let d = 1; d <= daysInMonth; d++) {
      const isTarget = d === targetDay;
      const past = targetDay !== null && d < targetDay;
      const countLabel = isTarget ? '<span class="target-badge">TARGET</span>' :
        (targetDay !== null && !past && showCount) ? `<span class="count-label">${d - (targetDay! - daysLeft)}</span>` : '';
      const shapeStyle = shapeCSS(d);
      cells.push(`<div class="cell ${isTarget ? 'is-target' : ''}">
        <div class="shape ${isTarget ? 'target-shape' : ''}" style="${shapeStyle} background:${isTarget ? selectedTheme.accentColor : selectedTheme.cellShade};">
          <span class="day-num ${isTarget ? 'target-num' : ''}">${d}</span>
        </div>
        ${countLabel}
      </div>`);
    }
    const totalCells = cells.length;
    const cellsToFill = totalCells <= 35 ? 35 : totalCells <= 42 ? 42 : totalCells;
    while (cells.length < cellsToFill) cells.push('<div class="cell empty"></div>');

    const dayHeaderHTML = dayLabels.map((d) => `<div class="day-header">${d}</div>`).join('');

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${displayTitle}</title>
  <style>
    @page { size: A4 portrait; margin: ${hasBorder ? '8mm' : '0'}; }
    * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    html, body { margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #000; }
    .page {
      width: ${hasBorder ? '194mm' : '210mm'};
      height: ${hasBorder ? '279mm' : '297mm'};
      padding: ${hasBorder ? '0' : '12mm'};
      display: flex;
      flex-direction: column;
      position: relative;
      overflow: hidden;
      background: #fff;
      ${borderStyle}
    }
    .inner { padding: 12mm 15mm; display: flex; flex-direction: column; height: 100%; }
    .header { text-align: center; flex-shrink: 0; margin-bottom: 6px; }
    .header h1 { font-size: 28px; font-weight: 900; color: ${selectedTheme.accentColor}; margin: 0 0 4px; letter-spacing: 0.5px; }
    .header .sub { font-size: 14px; font-weight: 600; color: #6b7280; }
    .calendar { flex: 1; display: flex; flex-direction: column; }
    .days-row { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; margin-bottom: 6px; }
    .day-header { text-align: center; font-size: 13px; font-weight: 700; color: ${selectedTheme.accentColor}; padding: 4px 0; text-transform: uppercase; letter-spacing: 1px; }
    .grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; flex: 1; }
    .cell { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 2px; position: relative; }
    .cell.empty { border: none; }
    .shape { width: 38px; height: 38px; display: flex; align-items: center; justify-content: center; border: 1.5px solid ${selectedTheme.borderColor === 'transparent' ? '#e5e7eb' : selectedTheme.borderColor}; }
    .target-shape { width: 44px; height: 44px; border: 2.5px solid ${selectedTheme.accentColor}; box-shadow: 0 0 0 3px ${selectedTheme.accentColor}33; }
    .day-num { font-size: 14px; font-weight: 700; color: #1f2937; }
    .target-num { font-size: 16px; color: #ffffff; }
    .is-target { }
    .target-badge { font-size: 7px; font-weight: 800; color: ${selectedTheme.accentColor}; margin-top: 3px; letter-spacing: 0.5px; }
    .count-label { font-size: 8px; color: #9ca3af; margin-top: 2px; }
    .footer { flex-shrink: 0; text-align: center; font-size: 11px; color: #6b7280; padding-top: 8px; }
    .countdown-banner { text-align: center; background: ${selectedTheme.accentColor}15; border-radius: 8px; padding: 8px; margin-bottom: 10px; }
    .countdown-banner .num { font-size: 24px; font-weight: 900; color: ${selectedTheme.accentColor}; }
    .countdown-banner .lbl { font-size: 12px; color: #6b7280; }
  </style>
</head>
<body>
  <div class="page">
    <div class="inner">
      <div class="header">
        <h1>${displayTitle}</h1>
        ${targetDay !== null ? `<div class="sub">Target date: ${formatDate(target)}</div>` : `<div class="sub">Target date: ${formatDate(target)} (not in this month)</div>`}
      </div>
      ${showCount && targetDay !== null ? `<div class="countdown-banner"><span class="num">${daysLeft}</span> <span class="lbl">days to go — cross off each day!</span></div>` : ''}
      <div class="calendar">
        <div class="days-row">${dayHeaderHTML}</div>
        <div class="grid">${cells.join('')}</div>
      </div>
      <div class="footer">
        <p style="margin:0">Find more printable resources at PrintAndUse.com</p>
        <p style="margin:0">Copyright &copy;2025 - www.printanduse.com | All rights reserved</p>
      </div>
    </div>
  </div>
  <script>
    window.onload = function() {
      window.print();
      window.onafterprint = function() { window.close(); };
    }
  </script>
</body>
</html>`;
  };

  const openPrintWindow = () => {
    const printWindow = window.open('', '_blank', 'width=900,height=1200');
    if (!printWindow) return;
    printWindow.document.write(buildCountdownHTML());
    printWindow.document.close();
  };

  const handlePrint = () => openPrintWindow();
  const downloadWorksheet = () => openPrintWindow();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <Link to="/" className="hover:text-orange-500 transition">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/generators" className="hover:text-orange-500 transition">Worksheet Generator</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium">Countdown Calendar Generator</span>
        </div>

        <div className="text-center mb-6">
          <div className="inline-flex items-center space-x-2 mb-2">
            <Hourglass className="w-8 h-8 text-orange-500" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Countdown Calendar Generator</h1>
          <p className="text-gray-600">Create a visual countdown calendar to cross off each day until your special event</p>
        </div>

        <div className="flex justify-between items-center mb-8">
          <div className="flex space-x-1 bg-white border-2 border-gray-200 rounded-full p-1 shadow-sm">
            <button
              onClick={() => setActiveNavTab('generator')}
              className={`px-8 py-3 font-semibold transition rounded-full ${
                activeNavTab === 'generator' ? 'bg-orange-500 text-white shadow-md' : 'bg-transparent text-gray-700 hover:bg-gray-50'
              }`}
            >
              Generator
            </button>
            <button
              onClick={() => setActiveNavTab('theme')}
              className={`px-8 py-3 font-semibold transition rounded-full ${
                activeNavTab === 'theme' ? 'bg-orange-500 text-white shadow-md' : 'bg-transparent text-gray-700 hover:bg-gray-50'
              }`}
            >
              Theme
            </button>
          </div>

          <button
            onClick={() => setActiveNavTab('howto')}
            className={`px-8 py-3 font-semibold transition rounded-full flex items-center space-x-2 ${
              activeNavTab === 'howto' ? 'bg-pink-600 text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <span>How to make</span>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activeNavTab === 'howto' ? 'bg-white' : 'bg-orange-500'}`}>
              <Play className={`w-4 h-4 ${activeNavTab === 'howto' ? 'text-orange-500' : 'text-white'}`} fill="currentColor" />
            </div>
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-orange-50 rounded-2xl shadow-sm p-8">
            {activeNavTab === 'generator' ? (
              <>
                <h2 className="text-lg font-bold text-gray-900 mb-6">Countdown Settings</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Title (optional)</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none transition"
                      placeholder="e.g. Countdown to Vacation"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Target Date</label>
                    <input
                      type="date"
                      value={targetDate}
                      onChange={(e) => setTargetDate(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none transition"
                    />
                    {daysLeft > 0 && (
                      <p className="text-sm text-gray-500 mt-2">{daysLeft} days from today</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Calendar Month</label>
                      <select
                        value={month}
                        onChange={(e) => setMonth(Number(e.target.value))}
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none transition appearance-none"
                      >
                        {monthNames.map((m, i) => (
                          <option key={m} value={i}>{m}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Year</label>
                      <input
                        type="number"
                        value={year}
                        min={2000}
                        max={2100}
                        onChange={(e) => setYear(Number(e.target.value))}
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Week Starts On</label>
                    <div className="flex space-x-4">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="radio" name="weekStart" checked={weekStartsOn === 0} onChange={() => setWeekStartsOn(0)} className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500" />
                        <span className="text-gray-900 font-medium">Sunday</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="radio" name="weekStart" checked={weekStartsOn === 1} onChange={() => setWeekStartsOn(1)} className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500" />
                        <span className="text-gray-900 font-medium">Monday</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Day Marker Shape</label>
                    <div className="flex space-x-4">
                      {(['circle', 'square', 'star'] as const).map((s) => (
                        <label key={s} className="flex items-center space-x-2 cursor-pointer">
                          <input type="radio" name="shape" checked={shape === s} onChange={() => setShape(s)} className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500" />
                          <span className="text-gray-900 font-medium capitalize">{s}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" checked={showCount} onChange={(e) => setShowCount(e.target.checked)} className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500" />
                    <span className="text-gray-900 font-medium">Show days-remaining banner</span>
                  </label>

                  <div className="flex space-x-4 pt-4">
                    <button onClick={handleReset} className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 text-orange-500 rounded-lg hover:bg-orange-100 transition font-semibold">
                      <span>Reset</span>
                    </button>
                    <button onClick={() => setHasGenerated(true)} className="flex-1 flex items-center justify-center space-x-2 px-6 py-4 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition font-semibold shadow-lg">
                      <RefreshCw className="w-5 h-5" />
                      <span>Generate Countdown</span>
                    </button>
                  </div>
                </div>
              </>
            ) : activeNavTab === 'theme' ? (
              <>
                <h2 className="text-lg font-bold text-gray-900 mb-6">Select Countdown Theme</h2>
                <div className="grid grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-2">
                  {themes.map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => setSelectedTheme(theme)}
                      className={`relative border-2 rounded-lg p-4 transition-all ${
                        selectedTheme.id === theme.id ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-orange-300'
                      }`}
                    >
                      <div
                        className="w-full h-32 rounded border-2 mb-2 flex items-center justify-center relative overflow-hidden"
                        style={{ borderColor: theme.borderColor === 'transparent' ? '#e5e7eb' : theme.borderColor, background: theme.bgColor }}
                      >
                        {theme.decoration && <span className="absolute top-2 left-2 text-2xl">{theme.decoration}</span>}
                        <span className="text-lg font-bold" style={{ color: theme.accentColor }}>{theme.name}</span>
                        {theme.decoration && <span className="absolute bottom-2 right-2 text-2xl">{theme.decoration}</span>}
                      </div>
                      <p className="text-sm font-semibold text-gray-900">{theme.name}</p>
                      {selectedTheme.id === theme.id && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <h2 className="text-lg font-bold text-gray-900 mb-6">How to Make a Countdown Calendar</h2>
                <div className="prose prose-sm text-gray-700 space-y-4">
                  <ol className="list-decimal list-inside space-y-3">
                    <li>Set your target date — the event you're counting down to</li>
                    <li>Pick the month and year to display on the calendar</li>
                    <li>Choose a day marker shape: circles, squares, or stars</li>
                    <li>Toggle the days-remaining banner on or off</li>
                    <li>Switch to the Theme tab to pick a decorative style</li>
                    <li>Click "Generate Countdown" then download or print</li>
                  </ol>
                  <p className="text-gray-600">The target day is highlighted, and every other day shows a marker your child can color in or cross off as each day passes.</p>
                </div>
              </>
            )}
          </div>

          <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 pb-0">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Calendar Preview</h2>
            </div>

            {!hasGenerated ? (
              <div className="flex flex-col items-center justify-center h-96 bg-gray-50 mx-6 mb-6 rounded-lg">
                <div className="w-16 h-16 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                  <Eye className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 text-lg">No preview available yet.</p>
              </div>
            ) : (
              <div>
                <div
                  className="preview-container flex items-center justify-center overflow-hidden mx-6 mb-6 rounded-lg"
                  style={{ height: '650px', background: selectedTheme.id !== 'blank' ? selectedTheme.bgColor : '#e5e7eb' }}
                >
                  <div className="preview-scale">
                    <div
                      className="calendar-content bg-white"
                      style={{
                        width: '210mm',
                        height: '297mm',
                        boxSizing: 'border-box',
                        border: selectedTheme.id !== 'blank' ? `3px solid ${selectedTheme.borderColor}` : 'none',
                      }}
                    >
                      <div className="flex flex-col h-full" style={{ padding: '12mm 15mm' }}>
                        <div className="text-center mb-2">
                          <h1 className="font-black tracking-tight mb-1" style={{ fontSize: '28px', color: selectedTheme.accentColor }}>
                            {displayTitle}
                          </h1>
                          <p className="text-sm text-gray-500 font-semibold">Target date: {formatDate(target)}</p>
                        </div>

                        {showCount && targetDay !== null && (
                          <div className="text-center rounded-lg py-2 mb-2" style={{ background: `${selectedTheme.accentColor}15` }}>
                            <span className="font-black" style={{ fontSize: '24px', color: selectedTheme.accentColor }}>{daysLeft}</span>
                            <span className="text-sm text-gray-500"> days to go — cross off each day!</span>
                          </div>
                        )}

                        <div className="flex-1 flex flex-col">
                          <div className="grid grid-cols-7 gap-0.5 mb-1.5">
                            {dayLabels.map((d) => (
                              <div
                                key={d}
                                className="text-center font-bold uppercase tracking-wide py-1"
                                style={{ fontSize: '13px', color: selectedTheme.accentColor }}
                              >
                                {d}
                              </div>
                            ))}
                          </div>
                          <div className="grid grid-cols-7 gap-1 flex-1">
                            {Array.from({ length: firstDay }).map((_, i) => (
                              <div key={`e-${i}`} />
                            ))}
                            {Array.from({ length: daysInMonth }).map((_, i) => {
                              const d = i + 1;
                              const isTarget = d === targetDay;
                              const shapeClass = shape === 'circle' ? 'rounded-full' : shape === 'square' ? 'rounded' : '';
                              return (
                                <div key={`d-${i}`} className="flex flex-col items-center justify-center py-1">
                                  <div
                                    className={`flex items-center justify-center ${shapeClass}`}
                                    style={{
                                      width: isTarget ? '44px' : '38px',
                                      height: isTarget ? '44px' : '38px',
                                      background: isTarget ? selectedTheme.accentColor : selectedTheme.cellShade,
                                      border: isTarget ? `2.5px solid ${selectedTheme.accentColor}` : `1.5px solid ${selectedTheme.borderColor === 'transparent' ? '#e5e7eb' : selectedTheme.borderColor}`,
                                      ...(shape === 'star'
                                        ? { clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)', borderRadius: '0' }
                                        : {}),
                                      boxShadow: isTarget ? `0 0 0 3px ${selectedTheme.accentColor}33` : 'none',
                                    }}
                                  >
                                    <span
                                      className="font-bold leading-none"
                                      style={{
                                        fontSize: isTarget ? '16px' : '14px',
                                        color: isTarget ? '#ffffff' : '#1f2937',
                                      }}
                                    >
                                      {d}
                                    </span>
                                  </div>
                                  {isTarget && (
                                    <span className="text-[7px] font-extrabold mt-0.5 tracking-wide" style={{ color: selectedTheme.accentColor }}>
                                      TARGET
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                            {Array.from({
                              length: (firstDay + daysInMonth <= 35 ? 35 : 42) - firstDay - daysInMonth,
                            }).map((_, i) => (
                              <div key={`pad-${i}`} />
                            ))}
                          </div>
                        </div>

                        <div className="text-center text-xs text-gray-500 pt-2">
                          <p>Find more printable resources at PrintAndUse.com</p>
                          <p>Copyright &copy;2025 - www.printanduse.com | All rights reserved</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <div className="space-y-3">
                    <button
                      onClick={downloadWorksheet}
                      className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition font-semibold shadow-md"
                    >
                      <Download className="w-5 h-5" />
                      <span>Download Calendar</span>
                    </button>
                    <button
                      onClick={handlePrint}
                      className="w-full flex items-center justify-center space-x-2 px-6 py-3 border-2 border-orange-500 text-orange-500 rounded-full hover:bg-orange-50 transition font-semibold"
                    >
                      <Printer className="w-5 h-5" />
                      <span>Print</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <RelatedGenerators
          title="More Calendar Generators"
          generators={calendarGenerators}
          currentSlug="countdown-calendar"
        />
      </div>

      <style>{`
        .calendar-content {
          box-shadow: 0 10px 40px rgba(0,0,0,0.1);
        }
        .preview-scale {
          transform: scale(0.48);
          transform-origin: center center;
        }
        .preview-container {
          padding: 10px 5px;
          position: relative;
        }
      `}</style>
    </div>
  );
}
