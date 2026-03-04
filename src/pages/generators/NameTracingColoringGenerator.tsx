import { useState, useRef } from 'react';
import { Download, Printer, Eye, RefreshCw, ChevronRight, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { RelatedGenerators } from '../../components/RelatedGenerators';

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

type TracingStyle = 'name-trace-color' | 'name-trace' | 'name-color' | 'name-cursive-trace';

const tracingPracticeGenerators = [
  { name: 'Alphabet Tracing Generator', slug: 'alphabet-tracing' },
  { name: 'Name Tracing Worksheets', slug: 'name-tracing' },
  { name: 'Name Tracing & Coloring Worksheets', slug: 'name-tracing-coloring' },
  { name: 'Telling Time Worksheet Generator', slug: 'telling-time' },
  { name: 'Picture Coloring and Tracing Worksheet', slug: 'picture-tracing' },
  { name: 'Sentence Tracing Practice Worksheet', slug: 'sentence-tracing' },
  { name: 'Word Tracing Practice Worksheet Maker', slug: 'word-tracing' },
];

export function NameTracingColoringGenerator() {
  const [name, setName] = useState('Amber Marley');
  const [fontSize, setFontSize] = useState(7);
  const [textColor, setTextColor] = useState('#000000');
  const [tracingStyle, setTracingStyle] = useState<TracingStyle>('name-trace-color');
  const [letterCase, setLetterCase] = useState<'uppercase' | 'lowercase'>('uppercase');
  const [activeNavTab, setActiveNavTab] = useState<'generator' | 'theme' | 'howto'>('generator');
  const [selectedTheme, setSelectedTheme] = useState<Theme>(themes[0]);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [title, setTitle] = useState('Name Tracing Practice');
  const [showName, setShowName] = useState(true);
  const [showDate, setShowDate] = useState(true);
  const [showTitleUnderline, setShowTitleUnderline] = useState(true);
  const worksheetRef = useRef<HTMLDivElement>(null);

  const handleGenerate = () => {
    setHasGenerated(true);
  };

  const handleReset = () => {
    setName('Amber Marley');
    setFontSize(7);
    setTextColor('#000000');
    setTracingStyle('name-trace-color');
    setLetterCase('uppercase');
    setTitle('Name Tracing Practice');
    setShowName(true);
    setShowDate(true);
    setShowTitleUnderline(true);
    setHasGenerated(false);
  };

  const handlePrint = () => {
    window.print();
  };

  const downloadWorksheet = () => {
    window.print();
  };

  const getTracingStyleLabel = (style: TracingStyle) => {
    switch (style) {
      case 'name-trace-color':
        return 'Name, Trace, Color';
      case 'name-trace':
        return 'Name, Trace';
      case 'name-color':
        return 'Name, Color';
      case 'name-cursive-trace':
        return 'Name, Cursive Trace';
    }
  };

  const renderNameSection = () => {
    const processedName = name.slice(0, 10);
    const displayName = letterCase === 'uppercase' ? processedName.toUpperCase() : processedName.toLowerCase();
    const letters = displayName.split('');
    const letterWidth = 70;
    const totalWidth = Math.max(10 * letterWidth, 700);
    const startX = (totalWidth - letters.length * letterWidth) / 2;
    const containerHeight = 120;

    const renderDirectionalArrows = (letter: string, index: number) => {
      const x = startX + index * letterWidth + letterWidth / 2;
      const arrowColor = '#EF4444';

      const upperLetter = letter.toUpperCase();

      if (upperLetter === 'A') {
        return (
          <g>
            <path d={`M ${x - 15} ${containerHeight - 20} L ${x} ${containerHeight - 60}`} stroke={arrowColor} strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" />
            <path d={`M ${x} ${containerHeight - 60} L ${x + 15} ${containerHeight - 20}`} stroke={arrowColor} strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" />
            <path d={`M ${x - 10} ${containerHeight - 42} L ${x + 10} ${containerHeight - 42}`} stroke={arrowColor} strokeWidth="2" fill="none" />
          </g>
        );
      } else if (upperLetter === 'M') {
        return (
          <g>
            <path d={`M ${x - 18} ${containerHeight - 20} L ${x - 18} ${containerHeight - 60}`} stroke={arrowColor} strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" />
            <path d={`M ${x - 18} ${containerHeight - 60} L ${x} ${containerHeight - 35}`} stroke={arrowColor} strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" />
            <path d={`M ${x} ${containerHeight - 35} L ${x + 18} ${containerHeight - 60}`} stroke={arrowColor} strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" />
            <path d={`M ${x + 18} ${containerHeight - 60} L ${x + 18} ${containerHeight - 20}`} stroke={arrowColor} strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" />
          </g>
        );
      } else if (/[BCDEFGHKLNPRTU]/.test(upperLetter)) {
        return (
          <g>
            <path d={`M ${x - 5} ${containerHeight - 60} L ${x - 5} ${containerHeight - 20}`} stroke={arrowColor} strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" />
          </g>
        );
      } else if (/[O]/.test(upperLetter)) {
        return (
          <g>
            <circle cx={x} cy={containerHeight - 40} r="20" stroke={arrowColor} strokeWidth="2" fill="none" strokeDasharray="3 3" />
            <path d={`M ${x} ${containerHeight - 60} L ${x + 3} ${containerHeight - 57}`} stroke={arrowColor} strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" />
          </g>
        );
      }
      return null;
    };

    const renderGuidelineBox = (letter: string, index: number) => {
      const x = startX + index * letterWidth;
      const boxWidth = letterWidth - 5;
      const boxHeight = 75;
      const boxY = containerHeight - boxHeight - 15;

      return (
        <g key={`guideline-${index}`}>
          <rect
            x={x + 2}
            y={boxY}
            width={boxWidth}
            height={boxHeight}
            fill="none"
            stroke="#d1d5db"
            strokeWidth="1"
          />
          <line
            x1={x + 2}
            y1={boxY + boxHeight / 3}
            x2={x + boxWidth + 2}
            y2={boxY + boxHeight / 3}
            stroke="#d1d5db"
            strokeWidth="1"
            strokeDasharray="2 2"
          />
          <line
            x1={x + 2}
            y1={boxY + (boxHeight / 3) * 2}
            x2={x + boxWidth + 2}
            y2={boxY + (boxHeight / 3) * 2}
            stroke="#d1d5db"
            strokeWidth="1"
            strokeDasharray="2 2"
          />
        </g>
      );
    };

    return (
      <div className="space-y-3 flex flex-col" style={{ height: '100%' }}>
        <div className="flex-1 flex flex-col min-h-0">
          <p className="text-xl font-bold text-gray-900 mb-2">My name is</p>
          <div className="border-2 border-gray-900 rounded p-3 bg-white flex-1 flex items-center justify-center">
            <svg width="100%" height="100%" viewBox={`0 0 ${totalWidth} 120`} preserveAspectRatio="xMidYMid meet">
              <defs>
                <style>
                  {`@import url('https://fonts.googleapis.com/css2?family=Codystar&display=swap');`}
                </style>
                <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                  <polygon points="0 0, 10 3, 0 6" fill="#EF4444" />
                </marker>
              </defs>
              {letters.map((letter, index) => (
                <text
                  key={index}
                  x={startX + index * letterWidth + letterWidth / 2}
                  y={60}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  style={{
                    fontFamily: "'Codystar', cursive",
                    fontSize: '90px',
                    fill: textColor,
                    fontWeight: '400',
                  }}
                >
                  {letter}
                </text>
              ))}
            </svg>
          </div>
        </div>

        {(tracingStyle === 'name-trace-color' || tracingStyle === 'name-trace' || tracingStyle === 'name-cursive-trace') && (
          <div className="flex-1 flex flex-col min-h-0">
            <p className="text-xl font-bold text-gray-900 mb-2">Trace the letters</p>
            <div className="border-2 border-gray-900 rounded p-3 bg-white flex-1 flex items-center justify-center">
              <svg width="100%" height="100%" viewBox={`0 0 ${totalWidth} 120`} preserveAspectRatio="xMidYMid meet">
                <defs>
                  <style>
                    {`@import url('https://fonts.googleapis.com/css2?family=Raleway&display=swap');`}
                  </style>
                </defs>
                {letters.map((letter, index) => (
                  <text
                    key={index}
                    x={startX + index * letterWidth + letterWidth / 2}
                    y={60}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    style={{
                      fontFamily: tracingStyle === 'name-cursive-trace' ? 'cursive' : "'Raleway', sans-serif",
                      fontSize: '90px',
                      fill: textColor,
                      fillOpacity: '0.3',
                      fontWeight: '400',
                      fontStyle: tracingStyle === 'name-cursive-trace' ? 'italic' : 'normal',
                    }}
                  >
                    {letter}
                  </text>
                ))}
              </svg>
            </div>
          </div>
        )}

        {(tracingStyle === 'name-trace-color' || tracingStyle === 'name-color') && (
          <div className="flex-1 flex flex-col min-h-0">
            <p className="text-xl font-bold text-gray-900 mb-2">Color the letters</p>
            <div className="border-2 border-gray-900 rounded p-3 bg-white flex-1 flex items-center justify-center">
              <svg width="100%" height="100%" viewBox={`0 0 ${totalWidth} 120`} preserveAspectRatio="xMidYMid meet">
                <defs>
                  <style>
                    {`@import url('https://fonts.googleapis.com/css2?family=Lilita+One&display=swap');`}
                  </style>
                </defs>
                {letters.map((letter, index) => (
                  <text
                    key={index}
                    x={startX + index * letterWidth + letterWidth / 2}
                    y={60}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    style={{
                      fontFamily: "'Lilita One', cursive",
                      fontSize: '90px',
                      fill: 'none',
                      stroke: textColor,
                      strokeWidth: '2',
                      fontWeight: '400',
                    }}
                  >
                    {letter}
                  </text>
                ))}
              </svg>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <Link to="/" className="hover:text-orange-500 transition">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/generators" className="hover:text-orange-500 transition">Worksheet Generator</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium">Name Tracing & Coloring Worksheets</span>
        </div>

        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Name Tracing & Coloring Worksheets</h1>
          <p className="text-gray-600">Create custom name tracing and coloring worksheets for handwriting practice</p>
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
                <h2 className="text-lg font-bold text-gray-900 mb-6">Header Options</h2>

                <div className="space-y-6">
                  <div className="flex items-center space-x-6">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showName}
                        onChange={(e) => setShowName(e.target.checked)}
                        className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                      />
                      <span className="text-gray-900 font-medium">Name</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showDate}
                        onChange={(e) => setShowDate(e.target.checked)}
                        className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                      />
                      <span className="text-gray-900 font-medium">Date</span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Worksheet Title
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none transition"
                      placeholder="Enter worksheet title"
                    />
                    <div className="flex gap-6 mt-2">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={showTitleUnderline}
                          onChange={(e) => setShowTitleUnderline(e.target.checked)}
                          className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                        />
                        <span className="text-gray-900 font-medium text-sm">Title underline</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={letterCase === 'uppercase'}
                          onChange={(e) => setLetterCase(e.target.checked ? 'uppercase' : 'lowercase')}
                          className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                        />
                        <span className="text-gray-900 font-medium text-sm">Uppercase</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={letterCase === 'lowercase'}
                          onChange={(e) => setLetterCase(e.target.checked ? 'lowercase' : 'uppercase')}
                          className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                        />
                        <span className="text-gray-900 font-medium text-sm">Lowercase</span>
                      </label>
                    </div>
                  </div>

                  <h2 className="text-lg font-bold text-gray-900 mt-8 mb-4">Name</h2>

                  <div className="flex gap-4 items-end">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none transition"
                        placeholder="Enter name"
                      />
                    </div>
                    <div className="w-32">
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Max Font Size:
                      </label>
                      <select
                        value={fontSize}
                        onChange={(e) => setFontSize(Number(e.target.value))}
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none transition appearance-none"
                      >
                        {[5, 6, 7, 8, 9, 10].map((size) => (
                          <option key={size} value={size}>{size}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Color
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                        className="w-12 h-12 border border-gray-300 rounded-lg cursor-pointer"
                      />
                      <input
                        type="text"
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                        className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-lg focus:border-pink-500 focus:ring-2 focus:ring-pink-200 focus:outline-none transition"
                      />
                    </div>
                  </div>

                  <h2 className="text-lg font-bold text-gray-900 mt-8 mb-4">Style</h2>

                  <div className="space-y-3">
                    {(['name-trace-color', 'name-trace', 'name-color', 'name-cursive-trace'] as TracingStyle[]).map((style) => (
                      <label key={style} className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name="tracingStyle"
                          checked={tracingStyle === style}
                          onChange={() => setTracingStyle(style)}
                          className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500"
                        />
                        <span className="text-gray-900 font-medium">{getTracingStyleLabel(style)}</span>
                      </label>
                    ))}
                  </div>

                  <div className="flex space-x-4 pt-4">
                    <button
                      onClick={handleReset}
                      className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 text-orange-500 rounded-lg hover:bg-orange-100 transition font-semibold"
                    >
                      <span>Reset</span>
                    </button>
                    <button
                      onClick={handleGenerate}
                      className="flex-1 flex items-center justify-center space-x-2 px-6 py-4 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition font-semibold shadow-lg"
                    >
                      <RefreshCw className="w-5 h-5" />
                      <span>Regenerate</span>
                    </button>
                  </div>
                </div>
              </>
            ) : activeNavTab === 'theme' ? (
              <>
                <h2 className="text-lg font-bold text-gray-900 mb-6">Select Worksheet Theme</h2>

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
                          borderStyle: theme.borderStyle
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
                <h2 className="text-lg font-bold text-gray-900 mb-6">How to Make Name Tracing & Coloring Worksheets</h2>
                <div className="prose prose-sm text-gray-700 space-y-4">
                  <ol className="list-decimal list-inside space-y-3">
                    <li>Enter the name you want to practice in the name field</li>
                    <li>Select the maximum font size for the name display</li>
                    <li>Choose a color for the coloring section</li>
                    <li>Select your preferred style:
                      <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                        <li><strong>Name, Trace, Color:</strong> Shows name outline, tracing practice, and coloring section</li>
                        <li><strong>Name, Trace:</strong> Shows name outline and tracing practice only</li>
                        <li><strong>Name, Color:</strong> Shows name outline and coloring section only</li>
                        <li><strong>Name, Cursive Trace:</strong> Shows name outline with cursive tracing practice</li>
                      </ul>
                    </li>
                    <li>Customize header options (show/hide name and date fields)</li>
                    <li>Select a theme/border style in the Theme tab</li>
                    <li>Click "Regenerate" to update the worksheet</li>
                    <li>Download or print your worksheet</li>
                  </ol>
                </div>
              </>
            )}
          </div>

          <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 pb-0">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Worksheet Preview</h2>
            </div>

            {!hasGenerated ? (
              <div className="flex flex-col items-center justify-center h-96 bg-gray-50 mx-6 mb-6 rounded-lg">
                <div className="w-16 h-16 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                  <Eye className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 text-lg">Click "Regenerate" to preview</p>
              </div>
            ) : (
              <div>
                <div className="preview-container bg-gray-100 flex items-center justify-center overflow-hidden" style={{ height: '700px' }}>
                  <div className="preview-scale">
                    <div
                      ref={worksheetRef}
                      className="worksheet-content bg-white shadow-xl p-8"
                    >
                      <div
                        className="flex flex-col justify-between relative p-8"
                        style={{
                          borderColor: selectedTheme.borderColor,
                          borderWidth: selectedTheme.borderWidth,
                          borderStyle: selectedTheme.borderStyle,
                          height: '100%',
                          minHeight: '100%'
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
                        <div className="text-center -mt-[10px]">
                          <div className="flex justify-between text-sm text-gray-600 mb-4">
                            {showName && <span>Name: _________________________</span>}
                            {!showName && <span></span>}
                            {showDate && <span>Date: _________________________</span>}
                          </div>
                          <h1 className={`text-3xl font-black text-gray-900 tracking-tight mb-2 ${showTitleUnderline ? 'border-b-2 border-gray-900 pb-2' : ''}`}>
                            {title}
                          </h1>
                        </div>

                        <div className="flex-1 flex flex-col py-6 mt-[15px]">
                          {renderNameSection()}
                        </div>

                        <div className="text-center text-xs text-gray-500 py-[15px]">
                          <p>worksheetsprints.com - for personal or educational use only</p>
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
          generators={tracingPracticeGenerators}
          currentSlug="name-tracing-coloring"
        />
      </div>

      <style>{`
        .worksheet-content {
          width: 210mm;
          height: 297mm;
          padding: 12mm 15mm;
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

        @media print {
          @page {
            size: A4 portrait;
            margin: 0;
          }

          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          html, body {
            width: 210mm;
            height: 297mm;
            margin: 0;
            padding: 0;
            overflow: hidden;
          }

          body * {
            visibility: hidden;
          }

          .worksheet-content,
          .worksheet-content * {
            visibility: visible;
          }

          .worksheet-content {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 210mm !important;
            height: 297mm !important;
            margin: 0 !important;
            padding: 12mm 15mm !important;
            box-shadow: none !important;
            transform: none !important;
            page-break-after: avoid !important;
            page-break-before: avoid !important;
            page-break-inside: avoid !important;
          }

          .preview-scale {
            transform: none !important;
          }

          .preview-container {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 210mm !important;
            height: 297mm !important;
            background: white !important;
            padding: 0 !important;
            margin: 0 !important;
            box-shadow: none !important;
            overflow: hidden !important;
          }
        }
      `}</style>
    </div>
  );
}
