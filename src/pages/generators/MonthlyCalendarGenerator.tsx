import { useState } from 'react';
import { Download, Printer, Eye, RefreshCw, ChevronRight, Play, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { RelatedGenerators } from '../../components/RelatedGenerators';

interface Theme {
  id: string;
  name: string;
  accentColor: string;
  borderColor: string;
  decoration?: string;
  bgColor: string;
}

const themes: Theme[] = [
  { id: 'blank', name: 'Blank', accentColor: '#F97316', borderColor: 'transparent', bgColor: '#ffffff' },
  { id: 'autumn', name: 'Autumn Leaves', accentColor: '#10B981', borderColor: '#10B981', decoration: '🍂', bgColor: '#FEF6E4' },
  { id: 'beep', name: 'Beep Beep', accentColor: '#F59E0B', borderColor: '#F59E0B', decoration: '🚗', bgColor: '#FFF8E1' },
  { id: 'blue', name: 'Ocean Blue', accentColor: '#06B6D4', borderColor: '#06B6D4', decoration: '🌊', bgColor: '#E0F7FA' },
  { id: 'green', name: 'Fresh Green', accentColor: '#10B981', borderColor: '#10B981', decoration: '🌿', bgColor: '#ECFDF5' },
  { id: 'hearts', name: 'Hearts', accentColor: '#EC4899', borderColor: '#EC4899', decoration: '❤️', bgColor: '#FDF2F8' },
  { id: 'yellow', name: 'Sunny Yellow', accentColor: '#EAB308', borderColor: '#EAB308', decoration: '☀️', bgColor: '#FEFCE8' },
  { id: 'lavender', name: 'Lavender', accentColor: '#A78BFA', borderColor: '#A78BFA', decoration: '🌸', bgColor: '#F5F3FF' },
  { id: 'coral', name: 'Coral', accentColor: '#FB7185', borderColor: '#FB7185', decoration: '🐚', bgColor: '#FFF1F2' },
  { id: 'slate', name: 'Minimal Slate', accentColor: '#475569', borderColor: '#475569', bgColor: '#F8FAFC' },
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

export function MonthlyCalendarGenerator() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [weekStartsOn, setWeekStartsOn] = useState<0 | 1>(0);
  const [selectedTheme, setSelectedTheme] = useState<Theme>(themes[0]);
  const [title, setTitle] = useState('');
  const [showNote, setShowNote] = useState(true);
  const [noteText, setNoteText] = useState('Notes:');
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [hasGenerated, setHasGenerated] = useState(true);
  const [activeNavTab, setActiveNavTab] = useState<'generator' | 'theme' | 'howto'>('generator');

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfWeek(year, month, weekStartsOn);
  const dayLabels = weekStartsOn === 0 ? dayNames : dayNamesWeekStart;
  const displayTitle = title || `${monthNames[month]} ${year}`;

  const headerFontSize = fontSize === 'small' ? '26px' : fontSize === 'medium' ? '32px' : '38px';
  const dayHeaderSize = fontSize === 'small' ? '12px' : fontSize === 'medium' ? '14px' : '16px';
  const dateCellSize = fontSize === 'small' ? '30px' : fontSize === 'medium' ? '34px' : '40px';

  const handleReset = () => {
    setYear(now.getFullYear());
    setMonth(now.getMonth());
    setWeekStartsOn(0);
    setSelectedTheme(themes[0]);
    setTitle('');
    setShowNote(true);
    setNoteText('Notes:');
    setFontSize('medium');
  };

  const buildCalendarHTML = () => {
    const hasBorder = selectedTheme.id !== 'blank';
    const borderStyle = hasBorder
      ? `border:${selectedTheme.borderWidth === 'transparent' ? '3px' : '3px'} solid ${selectedTheme.borderColor};`
      : '';

    const cells: string[] = [];
    for (let i = 0; i < firstDay; i++) cells.push('<div class="cell empty"></div>');
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push(`<div class="cell"><span class="date">${d}</span></div>`);
    }
    const totalCells = cells.length;
    const cellsToFill = totalCells <= 35 ? 35 : totalCells <= 42 ? 42 : totalCells;
    while (cells.length < cellsToFill) cells.push('<div class="cell empty"></div>');

    const dayHeaderHTML = dayLabels
      .map((d) => `<div class="day-header">${d}</div>`)
      .join('');

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
    .header { text-align: center; flex-shrink: 0; margin-bottom: 8px; }
    .header h1 { font-size: ${headerFontSize}; font-weight: 900; color: ${selectedTheme.accentColor}; margin: 0; letter-spacing: 0.5px; }
    .calendar { flex: 1; display: flex; flex-direction: column; }
    .days-row { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; margin-bottom: 4px; }
    .day-header { text-align: center; font-size: ${dayHeaderSize}; font-weight: 700; color: ${selectedTheme.accentColor}; padding: 6px 0; text-transform: uppercase; letter-spacing: 1px; }
    .grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; flex: 1; }
    .cell { border: 1px solid #d1d5db; padding: 4px 6px; display: flex; flex-direction: column; align-items: flex-start; min-height: 0; }
    .cell.empty { border: 1px solid #f3f4f6; }
    .date { font-size: ${dateCellSize}; font-weight: 700; color: #1f2937; line-height: 1; }
    .notes { flex-shrink: 0; margin-top: 10px; }
    .notes-label { font-size: 13px; font-weight: 700; color: ${selectedTheme.accentColor}; }
    .notes-line { border-bottom: 1px solid #d1d5db; height: 22px; margin-bottom: 4px; }
    .footer { flex-shrink: 0; text-align: center; font-size: 11px; color: #6b7280; padding-top: 8px; }
  </style>
</head>
<body>
  <div class="page">
    <div class="inner">
      <div class="header">
        <h1>${displayTitle}</h1>
      </div>
      <div class="calendar">
        <div class="days-row">${dayHeaderHTML}</div>
        <div class="grid">${cells.join('')}</div>
      </div>
      ${showNote ? `<div class="notes">
        <div class="notes-label">${noteText}</div>
        <div class="notes-line"></div>
        <div class="notes-line"></div>
        <div class="notes-line"></div>
      </div>` : ''}
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
    printWindow.document.write(buildCalendarHTML());
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
          <span className="text-gray-900 font-medium">Monthly Calendar Generator</span>
        </div>

        <div className="text-center mb-6">
          <div className="inline-flex items-center space-x-2 mb-2">
            <Calendar className="w-8 h-8 text-orange-500" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Monthly Calendar Generator</h1>
          <p className="text-gray-600">Create beautiful printable monthly calendars with custom themes</p>
        </div>

        <div className="flex justify-between items-center mb-8">
          <div className="flex space-x-1 bg-white border-2 border-gray-200 rounded-full p-1 shadow-sm">
            <button
              onClick={() => setActiveNavTab('generator')}
              className={`px-8 py-3 font-semibold transition rounded-full ${
                activeNavTab === 'generator'
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-transparent text-gray-700 hover:bg-gray-50'
              }`}
            >
              Generator
            </button>
            <button
              onClick={() => setActiveNavTab('theme')}
              className={`px-8 py-3 font-semibold transition rounded-full ${
                activeNavTab === 'theme'
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-transparent text-gray-700 hover:bg-gray-50'
              }`}
            >
              Theme
            </button>
          </div>

          <button
            onClick={() => setActiveNavTab('howto')}
            className={`px-8 py-3 font-semibold transition rounded-full flex items-center space-x-2 ${
              activeNavTab === 'howto'
                ? 'bg-pink-600 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <span>How to make</span>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              activeNavTab === 'howto' ? 'bg-white' : 'bg-orange-500'
            }`}>
              <Play className={`w-4 h-4 ${
                activeNavTab === 'howto' ? 'text-orange-500' : 'text-white'
              }`} fill="currentColor" />
            </div>
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-orange-50 rounded-2xl shadow-sm p-8">
            {activeNavTab === 'generator' ? (
              <>
                <h2 className="text-lg font-bold text-gray-900 mb-6">Calendar Settings</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Title (optional — defaults to month and year)
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none transition"
                      placeholder="e.g. My Family Schedule"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Month</label>
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
                        <input
                          type="radio"
                          name="weekStart"
                          checked={weekStartsOn === 0}
                          onChange={() => setWeekStartsOn(0)}
                          className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500"
                        />
                        <span className="text-gray-900 font-medium">Sunday</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="weekStart"
                          checked={weekStartsOn === 1}
                          onChange={() => setWeekStartsOn(1)}
                          className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500"
                        />
                        <span className="text-gray-900 font-medium">Monday</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Font Size</label>
                    <div className="flex space-x-4">
                      {(['small', 'medium', 'large'] as const).map((sz) => (
                        <label key={sz} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="radio"
                            name="fontSize"
                            checked={fontSize === sz}
                            onChange={() => setFontSize(sz)}
                            className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500"
                          />
                          <span className="text-gray-900 font-medium capitalize">{sz}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center space-x-2 cursor-pointer mb-2">
                      <input
                        type="checkbox"
                        checked={showNote}
                        onChange={(e) => setShowNote(e.target.checked)}
                        className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                      />
                      <span className="text-gray-900 font-medium">Include Notes Section</span>
                    </label>
                    {showNote && (
                      <input
                        type="text"
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none transition"
                        placeholder="Notes label"
                      />
                    )}
                  </div>

                  <div className="flex space-x-4 pt-4">
                    <button
                      onClick={handleReset}
                      className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 text-orange-500 rounded-lg hover:bg-orange-100 transition font-semibold"
                    >
                      <span>Reset</span>
                    </button>
                    <button
                      onClick={() => setHasGenerated(true)}
                      className="flex-1 flex items-center justify-center space-x-2 px-6 py-4 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition font-semibold shadow-lg"
                    >
                      <RefreshCw className="w-5 h-5" />
                      <span>Generate Calendar</span>
                    </button>
                  </div>
                </div>
              </>
            ) : activeNavTab === 'theme' ? (
              <>
                <h2 className="text-lg font-bold text-gray-900 mb-6">Select Calendar Theme</h2>
                <div className="grid grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-2">
                  {themes.map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => setSelectedTheme(theme)}
                      className={`relative border-2 rounded-lg p-4 transition-all ${
                        selectedTheme.id === theme.id
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 hover:border-orange-300'
                      }`}
                    >
                      <div
                        className="w-full h-32 rounded border-2 mb-2 flex items-center justify-center relative overflow-hidden"
                        style={{
                          borderColor: theme.borderColor === 'transparent' ? '#e5e7eb' : theme.borderColor,
                          background: theme.bgColor,
                        }}
                      >
                        {theme.decoration && (
                          <span className="absolute top-2 left-2 text-2xl">{theme.decoration}</span>
                        )}
                        <span className="text-lg font-bold" style={{ color: theme.accentColor }}>
                          {theme.name}
                        </span>
                        {theme.decoration && (
                          <span className="absolute bottom-2 right-2 text-2xl">{theme.decoration}</span>
                        )}
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
                <h2 className="text-lg font-bold text-gray-900 mb-6">How to Make a Monthly Calendar</h2>
                <div className="prose prose-sm text-gray-700 space-y-4">
                  <ol className="list-decimal list-inside space-y-3">
                    <li>Pick the month and year for your calendar</li>
                    <li>Choose whether the week starts on Sunday or Monday</li>
                    <li>Set the font size and optionally add a notes section</li>
                    <li>Give your calendar a custom title, or leave it blank for the default</li>
                    <li>Switch to the Theme tab to pick a decorative border style</li>
                    <li>Click "Generate Calendar" then download or print</li>
                  </ol>
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
                  style={{
                    height: '650px',
                    background: selectedTheme.id !== 'blank' ? selectedTheme.bgColor : '#e5e7eb',
                  }}
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
                          <h1
                            className="font-black tracking-tight"
                            style={{ fontSize: headerFontSize, color: selectedTheme.accentColor }}
                          >
                            {displayTitle}
                          </h1>
                        </div>

                        <div className="flex-1 flex flex-col">
                          <div className="grid grid-cols-7 gap-0.5 mb-1">
                            {dayLabels.map((d) => (
                              <div
                                key={d}
                                className="text-center font-bold uppercase tracking-wide py-1.5"
                                style={{ fontSize: dayHeaderSize, color: selectedTheme.accentColor }}
                              >
                                {d}
                              </div>
                            ))}
                          </div>
                          <div className="grid grid-cols-7 gap-0.5 flex-1">
                            {Array.from({ length: firstDay }).map((_, i) => (
                              <div
                                key={`e-${i}`}
                                className="border border-gray-100"
                              />
                            ))}
                            {Array.from({ length: daysInMonth }).map((_, i) => (
                              <div
                                key={`d-${i}`}
                                className="border border-gray-300 p-1 flex items-start"
                              >
                                <span
                                  className="font-bold text-gray-800 leading-none"
                                  style={{ fontSize: dateCellSize }}
                                >
                                  {i + 1}
                                </span>
                              </div>
                            ))}
                            {Array.from({
                              length: (firstDay + daysInMonth <= 35 ? 35 : 42) - firstDay - daysInMonth,
                            }).map((_, i) => (
                              <div
                                key={`pad-${i}`}
                                className="border border-gray-100"
                              />
                            ))}
                          </div>
                        </div>

                        {showNote && (
                          <div className="mt-2">
                            <div className="font-bold text-sm mb-1" style={{ color: selectedTheme.accentColor }}>
                              {noteText}
                            </div>
                            <div className="border-b border-gray-300 h-5 mb-1" />
                            <div className="border-b border-gray-300 h-5 mb-1" />
                            <div className="border-b border-gray-300 h-5" />
                          </div>
                        )}

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
          currentSlug="monthly-calendar"
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
