import { useState, useRef } from 'react';
import { Download, Printer, Eye, RefreshCw, ChevronRight, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { RelatedGenerators } from '../../components/RelatedGenerators';

interface Problem {
  num1: number;
  num2: number;
  answer: number;
}

interface Theme {
  id: string;
  name: string;
  borderColor: string;
  borderWidth: string;
  borderStyle: string;
  decoration?: string;
}

const themes: Theme[] = [
  { id: 'blank', name: 'Blank', borderColor: 'transparent', borderWidth: '0px', borderStyle: 'solid' },
  { id: 'autumn', name: 'Autumn Leaves', borderColor: '#10B981', borderWidth: '3px', borderStyle: 'solid', decoration: '🍂🍁' },
  { id: 'beep', name: 'Beep Beep', borderColor: '#F59E0B', borderWidth: '3px', borderStyle: 'solid', decoration: '🚗🚕' },
  { id: 'biking', name: 'Biking', borderColor: '#8B5CF6', borderWidth: '3px', borderStyle: 'solid', decoration: '🚴‍♂️🚴‍♀️' },
  { id: 'blue', name: 'Blue', borderColor: '#06B6D4', borderWidth: '3px', borderStyle: 'solid' },
  { id: 'green', name: 'Green', borderColor: '#10B981', borderWidth: '3px', borderStyle: 'solid' },
  { id: 'hearts', name: 'Hearts', borderColor: '#EC4899', borderWidth: '3px', borderStyle: 'solid', decoration: '❤️💕' },
  { id: 'yellow', name: 'Yellow', borderColor: '#EAB308', borderWidth: '3px', borderStyle: 'solid' },
];

const relatedGenerators = [
  { name: 'Addition Worksheet Generator', slug: 'addition' },
  { name: 'Subtraction Worksheet Generator', slug: 'subtraction' },
  { name: 'Multiplication Worksheet Generator', slug: 'multiplication' },
  { name: 'Alphabet Tracing Generator', slug: 'alphabet-tracing' },
  { name: 'Name Tracing Worksheets', slug: 'name-tracing' },
  { name: 'Sentence Tracing Practice Worksheet', slug: 'sentence-tracing' },
];

export function DivisionGenerator() {
  const [title, setTitle] = useState('Division Generator');
  const [difficulty, setDifficulty] = useState<'simple' | 'medium' | 'hard'>('simple');
  const [orientation, setOrientation] = useState<'horizontal' | 'vertical'>('horizontal');
  const [numProblems, setNumProblems] = useState(20);
  const [showProblemNumber, setShowProblemNumber] = useState(true);
  const [showName, setShowName] = useState(true);
  const [showDate, setShowDate] = useState(true);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [activeTab, setActiveTab] = useState<'worksheet' | 'answer'>('worksheet');
  const [activeNavTab, setActiveNavTab] = useState<'generator' | 'theme' | 'howto'>('generator');
  const [selectedTheme, setSelectedTheme] = useState<Theme>(themes[0]);
  const worksheetRef = useRef<HTMLDivElement>(null);

  const generateProblems = () => {
    const newProblems: Problem[] = [];

    let maxDivisor: number, minDivisor: number, maxQuotient: number, minQuotient: number;

    switch (difficulty) {
      case 'simple':
        minDivisor = 1; maxDivisor = 9;
        minQuotient = 1; maxQuotient = 9;
        break;
      case 'medium':
        minDivisor = 2; maxDivisor = 12;
        minQuotient = 2; maxQuotient = 12;
        break;
      case 'hard':
        minDivisor = 2; maxDivisor = 12;
        minQuotient = 10; maxQuotient = 99;
        break;
    }

    for (let i = 0; i < numProblems; i++) {
      const divisor = Math.floor(Math.random() * (maxDivisor - minDivisor + 1)) + minDivisor;
      const quotient = Math.floor(Math.random() * (maxQuotient - minQuotient + 1)) + minQuotient;
      const dividend = divisor * quotient;
      newProblems.push({ num1: dividend, num2: divisor, answer: quotient });
    }

    setProblems(newProblems);
  };

  const handleReset = () => {
    setTitle('Division Generator');
    setDifficulty('simple');
    setOrientation('horizontal');
    setNumProblems(20);
    setShowProblemNumber(true);
    setShowName(true);
    setShowDate(true);
    setProblems([]);
  };

  const openPrintWindow = (showAnswersOverride?: boolean) => {
    const printWindow = window.open('', '_blank', 'width=900,height=1200');
    if (!printWindow) return;

    const displayAnswers = showAnswersOverride !== undefined ? showAnswersOverride : (activeTab === 'answer');
    const colsPerRow = orientation === 'horizontal' ? 2 : 4;
    const rowCount = Math.ceil(problems.length / colsPerRow);

    const problemsHtml = orientation === 'horizontal'
      ? Array.from({ length: rowCount }, (_, rowIndex) => {
          const isLast = rowIndex === rowCount - 1;
          const cols = [0, 1].map((colIndex) => {
            const index = rowIndex * 2 + colIndex;
            if (index >= problems.length) return '<div class="problem-col"></div>';
            const p = problems[index];
            const answerPart = displayAnswers
              ? `<span style="font-weight:bold;color:#ea580c">${p.answer}</span>`
              : `<span style="display:inline-block;width:80px;border-bottom:2px solid #d1d5db"></span>`;
            return `<div class="problem-col" style="text-align:left">
              <div style="display:flex;align-items:center;gap:12px;font-size:20px">
                ${showProblemNumber ? `<span style="color:#9ca3af;font-size:14px">${index + 1}.</span>` : ''}
                <span>${p.num1}</span><span>&divide;</span><span>${p.num2}</span><span>=</span>${answerPart}
              </div>
            </div>`;
          });
          return `<div class="problem-row${isLast ? ' last-row' : ''}">${cols.join('')}</div>`;
        }).join('')
      : Array.from({ length: 5 }, (_, rowIndex) => {
          const isLast = rowIndex === 4;
          const cols = [0, 1, 2, 3].map((colIndex) => {
            const index = rowIndex * 4 + colIndex;
            if (index >= problems.length) return '<div style="visibility:hidden"><div style="min-width:90px;display:inline-block"><div style="font-size:24px;text-align:right;padding-right:4px">0</div><div style="font-size:24px;text-align:right;padding-right:4px">&divide; 0</div><div style="border-top:2px solid #111;margin-top:4px;padding-top:8px"></div></div></div>';
            const p = problems[index];
            const answerPart = displayAnswers
              ? `<div style="font-size:24px;font-weight:bold;color:#ea580c;border-top:2px solid #111;margin-top:4px;padding-top:4px;text-align:right;padding-right:4px">${p.answer}</div>`
              : `<div style="border-top:2px solid #111;margin-top:4px;padding-top:8px"></div>`;
            return `<div>
              ${showProblemNumber ? `<div style="color:#9ca3af;font-size:14px;margin-bottom:4px">${index + 1}.</div>` : ''}
              <div style="min-width:90px;display:inline-block">
                <div style="font-size:24px;text-align:right;padding-right:4px">${p.num1}</div>
                <div style="font-size:24px;text-align:right;display:flex;justify-content:flex-end">
                  <span style="margin-right:4px">&divide;</span><span style="padding-right:4px">${p.num2}</span>
                </div>
                ${answerPart}
              </div>
            </div>`;
          });
          return `<div class="problem-row${isLast ? ' last-row' : ''}" style="display:flex;justify-content:space-between;width:100%">${cols.join('')}</div>`;
        }).join('');

    const hasBorder = selectedTheme.id !== 'blank';
    const borderStyle = hasBorder
      ? `border:${selectedTheme.borderWidth} ${selectedTheme.borderStyle} ${selectedTheme.borderColor};`
      : '';

    const isVertical = orientation === 'vertical';
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <style>
    @page { size: A4 portrait; margin: ${hasBorder ? '10mm' : '0'}; }
    * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    html, body { margin: 0; padding: 0; font-family: sans-serif; background: #000; }
    .page {
      width: ${hasBorder ? '190mm' : '210mm'};
      height: ${hasBorder ? '277mm' : '297mm'};
      padding: 12mm 15mm 10mm;
      display: flex;
      flex-direction: column;
      position: relative;
      overflow: hidden;
      background: #fff;
      ${borderStyle}
    }
    .header { text-align: center; margin-bottom: 0; flex-shrink: 0; }
    .header h1 { font-size: 32px; font-weight: 900; color: #111; margin: 0; }
    .name-date { display: flex; justify-content: space-between; font-size: 15px; color: #4b5563; margin-top: 20px; padding-bottom: 4px; }
    .problems { flex: 1; padding-top: 16px; overflow: hidden; }
    .problems-wrapper { ${isVertical ? 'width:100%;' : 'width:75%; margin-left:auto; margin-right:auto;'} }
    .problem-row { margin-bottom: 0; display: flex; justify-content: space-between; }
    .problem-col { width: 33.33%; }
    .footer {
      flex-shrink: 0;
      text-align: center; font-size: 11px; color: #6b7280;
      padding: 0;
      line-height: 1.8;
    }
  </style>
</head>
<body>
  <div class="page">
    <div class="header">
      <h1>${title}</h1>
      <div class="name-date">
        ${showName ? '<span>Name: _________________________</span>' : '<span></span>'}
        ${showDate ? '<span>Date: _________________________</span>' : ''}
      </div>
    </div>
    <div class="problems"><div class="problems-wrapper">${problemsHtml}</div></div>
    <div class="footer">
      <p style="margin:0">Find more educational worksheets at PrintAndUse.com</p>
      <p style="margin:0">Copyright &copy;2025 - www.printanduse.com | All rights reserved</p>
    </div>
  </div>
  <script>
    window.onload = function() {
      var page = document.querySelector('.page');
      var header = document.querySelector('.header');
      var footer = document.querySelector('.footer');
      var rows = document.querySelectorAll('.problem-row');
      if (rows.length > 0 && page && header && footer) {
        var pageH = page.clientHeight;
        var headerH = header.offsetHeight;
        var footerH = footer.offsetHeight;
        var pagePadT = parseFloat(getComputedStyle(page).paddingTop);
        var pagePadB = parseFloat(getComputedStyle(page).paddingBottom);
        var problemsTopGap = 16;
        var totalRowH = 0;
        rows.forEach(function(r) { totalRowH += r.offsetHeight; });
        var available = pageH - pagePadT - pagePadB - headerH - footerH - problemsTopGap;
        var gap = (available - totalRowH) / rows.length;
        if (gap < 4) gap = 4;
        rows.forEach(function(r) { r.style.marginBottom = gap + 'px'; });
        document.querySelector('.problems').style.paddingTop = problemsTopGap + 'px';
      }
      window.print();
      window.onafterprint = function() { window.close(); };
    }
  <\/script>
</body>
</html>`;

    printWindow.document.write(html);
    printWindow.document.close();
  };

  const handlePrint = () => openPrintWindow();
  const downloadWorksheet = () => openPrintWindow(false);
  const downloadAnswerKey = () => openPrintWindow(true);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <Link to="/" className="hover:text-orange-500 transition">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/generators" className="hover:text-orange-500 transition">Worksheet Generator</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium">Division Generator</span>
        </div>

        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Division Generator</h1>
          <p className="text-gray-600">Keep it to 20 items or less</p>
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
                <h2 className="text-lg font-bold text-gray-900 mb-6">Worksheet Settings</h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Title</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none transition"
                      placeholder="Enter worksheet title"
                    />
                  </div>

                  <div className="flex items-center space-x-6">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showName}
                        onChange={(e) => setShowName(e.target.checked)}
                        className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                      />
                      <span className="text-gray-900 font-medium">Show Name</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showDate}
                        onChange={(e) => setShowDate(e.target.checked)}
                        className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                      />
                      <span className="text-gray-900 font-medium">Show Date</span>
                    </label>
                  </div>

                  <h2 className="text-lg font-bold text-gray-900 mt-8 mb-4">Problem Settings</h2>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Difficulty</label>
                      <select
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value as any)}
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none transition appearance-none"
                      >
                        <option value="simple">Simple (÷1–9, quotient 1–9)</option>
                        <option value="medium">Medium (÷2–12, quotient 2–12)</option>
                        <option value="hard">Hard (÷2–12, quotient 10–99)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Orientation</label>
                      <select
                        value={orientation}
                        onChange={(e) => {
                          const newOrientation = e.target.value as 'horizontal' | 'vertical';
                          setOrientation(newOrientation);
                          if (numProblems > 20) setNumProblems(20);
                        }}
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none transition appearance-none"
                      >
                        <option value="horizontal">Horizontal</option>
                        <option value="vertical">Vertical</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Number of Problems</label>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={numProblems}
                        onChange={(e) => setNumProblems(Math.min(Number(e.target.value), 20))}
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none transition"
                      />
                    </div>
                    <div></div>
                  </div>

                  <div className="flex items-center space-x-2 pt-2">
                    <input
                      type="checkbox"
                      id="showNumbers"
                      checked={showProblemNumber}
                      onChange={(e) => setShowProblemNumber(e.target.checked)}
                      className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                    />
                    <label htmlFor="showNumbers" className="text-sm font-medium text-gray-700">
                      Show Problem Number
                    </label>
                  </div>

                  <div className="flex space-x-4 pt-4">
                    <button
                      onClick={handleReset}
                      className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 text-orange-500 rounded-lg hover:bg-orange-100 transition font-semibold"
                    >
                      <span>Reset</span>
                    </button>
                    <button
                      onClick={generateProblems}
                      className="flex-1 flex items-center justify-center space-x-2 px-6 py-4 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition font-semibold shadow-lg"
                    >
                      <RefreshCw className="w-5 h-5" />
                      <span>Regenerate Division</span>
                    </button>
                  </div>
                </div>
              </>
            ) : activeNavTab === 'theme' ? (
              <>
                <h2 className="text-lg font-bold text-gray-900 mb-6">Select Division Worksheet Theme</h2>
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
                        className="w-full h-32 bg-white rounded border-2 mb-2 flex items-center justify-center relative overflow-hidden"
                        style={{
                          borderColor: theme.borderColor,
                          borderWidth: theme.borderWidth,
                          borderStyle: theme.borderStyle,
                        }}
                      >
                        {theme.decoration && (
                          <>
                            <span className="absolute top-1 left-1 text-lg">{theme.decoration.split('')[0]}</span>
                            <span className="absolute top-1 right-1 text-lg">{theme.decoration.split('')[1] || theme.decoration.split('')[0]}</span>
                            <span className="absolute bottom-1 left-1 text-lg">{theme.decoration.split('')[0]}</span>
                            <span className="absolute bottom-1 right-1 text-lg">{theme.decoration.split('')[1] || theme.decoration.split('')[0]}</span>
                          </>
                        )}
                        <span className="text-xs text-gray-400">Preview</span>
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
                <h2 className="text-lg font-bold text-gray-900 mb-6">How to Make Division Worksheets</h2>
                <div className="prose prose-sm text-gray-700 space-y-4">
                  <ol className="list-decimal list-inside space-y-3">
                    <li>Choose your worksheet settings in the Generator tab</li>
                    <li>Select a theme/border style in the Theme tab</li>
                    <li>Click "Regenerate Division" to create new problems</li>
                    <li>Preview your worksheet and answer key</li>
                    <li>Download or print your worksheet</li>
                  </ol>
                </div>
              </>
            )}
          </div>

          <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 pb-0">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Worksheet Preview</h2>

              <div className="flex space-x-1 bg-white border-2 border-gray-200 rounded-full p-1 shadow-sm mb-4">
                <button
                  onClick={() => setActiveTab('worksheet')}
                  className={`flex-1 py-2 font-semibold transition rounded-full ${
                    activeTab === 'worksheet'
                      ? 'bg-orange-500 text-white shadow-md'
                      : 'bg-transparent text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Worksheet
                </button>
                <button
                  onClick={() => setActiveTab('answer')}
                  className={`flex-1 py-2 font-semibold transition rounded-full ${
                    activeTab === 'answer'
                      ? 'bg-orange-500 text-white shadow-md'
                      : 'bg-transparent text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Answer Key
                </button>
              </div>
            </div>

            {problems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-96 bg-gray-50 mx-6 mb-6 rounded-lg">
                <div className="w-16 h-16 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                  <Eye className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 text-lg">No posts available yet.</p>
              </div>
            ) : (
              <div>
                <div
                  className="preview-container flex items-center justify-center overflow-hidden"
                  style={{ height: '700px', background: selectedTheme.id !== 'blank' ? `${selectedTheme.borderColor}22` : '#e5e7eb' }}
                >
                  <div className="preview-scale">
                    <div
                      ref={worksheetRef}
                      className="worksheet-content bg-white shadow-xl"
                      style={{ padding: selectedTheme.id !== 'blank' ? '0' : '12mm 15mm' }}
                    >
                      <div
                        className="flex flex-col relative"
                        style={{
                          borderColor: selectedTheme.borderColor,
                          borderWidth: selectedTheme.borderWidth,
                          borderStyle: selectedTheme.borderStyle,
                          padding: selectedTheme.id !== 'blank' ? '12mm 15mm' : '0',
                          height: '100%',
                          minHeight: '100%',
                        }}
                      >
                        {selectedTheme.decoration && (
                          <>
                            <span className="absolute top-4 left-4 text-3xl">{selectedTheme.decoration.split('')[0]}</span>
                            <span className="absolute top-4 right-4 text-3xl">{selectedTheme.decoration.split('')[1] || selectedTheme.decoration.split('')[0]}</span>
                            <span className="absolute bottom-4 left-4 text-3xl">{selectedTheme.decoration.split('')[0]}</span>
                            <span className="absolute bottom-4 right-4 text-3xl">{selectedTheme.decoration.split('')[1] || selectedTheme.decoration.split('')[0]}</span>
                          </>
                        )}
                        <div className="text-center">
                          <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-4">{title}</h1>
                          <div className="flex justify-between text-base text-gray-600 mt-6">
                            {showName && <span>Name: _________________________</span>}
                            {!showName && <span></span>}
                            {showDate && <span>Date: _________________________</span>}
                          </div>
                        </div>

                        <div className={`worksheet-problems flex-1 flex flex-col py-6 mt-10 ${orientation === 'vertical' ? 'justify-evenly' : 'justify-between'}`}>
                          {orientation === 'horizontal' ? (
                            <>
                              {Array.from({ length: Math.ceil(problems.length / 2) }, (_, rowIndex) => (
                                <div key={rowIndex} className="flex w-full" style={{ paddingLeft: '12.5%', paddingRight: '12.5%', justifyContent: 'space-between' }}>
                                  {[0, 1].map((colIndex) => {
                                    const index = rowIndex * 2 + colIndex;
                                    if (index >= problems.length) return <div key={colIndex} style={{ width: '33.33%' }}></div>;
                                    const problem = problems[index];
                                    return (
                                      <div key={index} className="text-left" style={{ width: '33.33%' }}>
                                        <div className="flex items-center space-x-3 text-xl justify-start">
                                          {showProblemNumber && (
                                            <span className="text-gray-400 text-base">{index + 1}.</span>
                                          )}
                                          <span>{problem.num1}</span>
                                          <span>&divide;</span>
                                          <span>{problem.num2}</span>
                                          <span>=</span>
                                          {activeTab === 'answer' ? (
                                            <span className="font-bold text-orange-600">{problem.answer}</span>
                                          ) : (
                                            <span className="inline-block w-20 border-b-2 border-gray-300"></span>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              ))}
                            </>
                          ) : (
                            <>
                              {Array.from({ length: 5 }, (_, rowIndex) => (
                                <div key={rowIndex} className="flex justify-between w-full">
                                  {[0, 1, 2, 3].map((colIndex) => {
                                    const index = rowIndex * 4 + colIndex;
                                    if (index >= problems.length) return <div key={colIndex} className="invisible"><div className="inline-block min-w-[90px]"><div className="text-2xl text-right pr-1">0</div><div className="text-2xl text-right pr-1">&divide; 0</div><div className="border-t-2 border-gray-900 mt-1 pt-2"></div></div></div>;
                                    const problem = problems[index];
                                    return (
                                      <div key={index}>
                                        <div className="inline-block">
                                          {showProblemNumber && (
                                            <div className="text-left text-gray-400 text-base mb-1">{index + 1}.</div>
                                          )}
                                          <div className="inline-block min-w-[90px]">
                                            <div className="text-2xl text-right pr-1">{problem.num1}</div>
                                            <div className="text-2xl text-right flex items-center justify-end">
                                              <span className="mr-1">&divide;</span>
                                              <span className="pr-1">{problem.num2}</span>
                                            </div>
                                            {activeTab === 'answer' ? (
                                              <div className="text-2xl font-bold text-orange-600 border-t-2 border-gray-900 mt-1 pt-1 text-right pr-1">
                                                {problem.answer}
                                              </div>
                                            ) : (
                                              <div className="border-t-2 border-gray-900 mt-1 pt-2"></div>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              ))}
                            </>
                          )}
                        </div>

                        <div className="worksheet-footer text-center text-xs text-gray-500 mt-auto pt-4">
                          <p>Find more educational worksheets at PrintAndUse.com</p>
                          <p>Copyright ©2025 - www.printanduse.com | All rights reserved</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-4">
                  <div className="space-y-3">
                    <button
                      onClick={downloadWorksheet}
                      className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition font-semibold shadow-md"
                    >
                      <Download className="w-5 h-5" />
                      <span>Download Worksheet</span>
                    </button>

                    <button
                      onClick={downloadAnswerKey}
                      className="w-full flex items-center justify-center space-x-2 px-6 py-3 border-2 border-orange-500 text-orange-500 rounded-full hover:bg-orange-50 transition font-semibold"
                    >
                      <Download className="w-5 h-5" />
                      <span>Download Answer Key</span>
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

        <RelatedGenerators generators={relatedGenerators} />
      </div>

      <style>{`
        .worksheet-content {
          width: 210mm;
          height: 297mm;
          box-sizing: border-box;
        }

        .preview-scale {
          transform: scale(0.52);
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
