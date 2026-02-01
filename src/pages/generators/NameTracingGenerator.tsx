import { useState, useRef } from 'react';
import { Download, Printer, Eye, RefreshCw, ChevronRight, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

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

const fonts = [
  'KG Primary Dots',
  'Teaching Print',
  'Codystar',
  'Raleway Dots',
];

export function NameTracingGenerator() {
  const [text, setText] = useState('JASMINE');
  const [selectedFont, setSelectedFont] = useState('KG Primary Dots');
  const [fontSize, setFontSize] = useState(50);
  const [textColor, setTextColor] = useState('#000000');
  const [lines, setLines] = useState(7);
  const [spacing, setSpacing] = useState(2);
  const [columns, setColumns] = useState<1 | 2 | 3>(3);
  const [activeNavTab, setActiveNavTab] = useState<'generator' | 'theme' | 'howto'>('generator');
  const [selectedTheme, setSelectedTheme] = useState<Theme>(themes[0]);
  const [hasGenerated, setHasGenerated] = useState(false);
  const worksheetRef = useRef<HTMLDivElement>(null);

  const handleGenerate = () => {
    setHasGenerated(true);
  };

  const handleReset = () => {
    setText('JASMINE');
    setSelectedFont('Open Sans');
    setFontSize(50);
    setTextColor('#000000');
    setLines(7);
    setSpacing(2);
    setColumns(3);
    setHasGenerated(false);
  };

  const handlePrint = () => {
    window.print();
  };

  const downloadWorksheet = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <Link to="/" className="hover:text-pink-600 transition">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/generators" className="hover:text-pink-600 transition">Worksheet Generator</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium">Name Tracing Worksheets</span>
        </div>

        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Name Tracing Worksheets</h1>
          <p className="text-gray-600">Create custom tracing worksheets for handwriting practice</p>
        </div>

        <div className="flex justify-between items-center mb-8">
          <div className="flex space-x-1 bg-white border-2 border-gray-200 rounded-full p-1 shadow-sm">
            <button
              onClick={() => setActiveNavTab('generator')}
              className={`px-8 py-3 font-semibold transition rounded-full ${
                activeNavTab === 'generator'
                  ? 'bg-pink-600 text-white shadow-md'
                  : 'bg-transparent text-gray-700 hover:bg-gray-50'
              }`}
            >
              Generator
            </button>
            <button
              onClick={() => setActiveNavTab('theme')}
              className={`px-8 py-3 font-semibold transition rounded-full ${
                activeNavTab === 'theme'
                  ? 'bg-pink-600 text-white shadow-md'
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
              activeNavTab === 'howto' ? 'bg-white' : 'bg-pink-600'
            }`}>
              <Play className={`w-4 h-4 ${
                activeNavTab === 'howto' ? 'text-pink-600' : 'text-white'
              }`} fill="currentColor" />
            </div>
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-purple-50 rounded-2xl shadow-sm p-8">
            {activeNavTab === 'generator' ? (
              <>
                <h2 className="text-lg font-bold text-gray-900 mb-6">Text</h2>

                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:border-pink-500 focus:ring-2 focus:ring-pink-200 focus:outline-none transition"
                        placeholder="Enter text to trace"
                      />
                    </div>
                    <div>
                      <select
                        value={selectedFont}
                        onChange={(e) => setSelectedFont(e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:border-pink-500 focus:ring-2 focus:ring-pink-200 focus:outline-none transition appearance-none"
                      >
                        {fonts.map((font) => (
                          <option key={font} value={font}>{font}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Size
                      </label>
                      <select
                        value={fontSize}
                        onChange={(e) => setFontSize(Number(e.target.value))}
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:border-pink-500 focus:ring-2 focus:ring-pink-200 focus:outline-none transition appearance-none"
                      >
                        {[30, 40, 50, 60, 70, 80].map((size) => (
                          <option key={size} value={size}>{size}</option>
                        ))}
                      </select>
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
                  </div>

                  <h2 className="text-lg font-bold text-gray-900 mt-8 mb-4">Text Settings</h2>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Lines
                      </label>
                      <select
                        value={lines}
                        onChange={(e) => setLines(Number(e.target.value))}
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:border-pink-500 focus:ring-2 focus:ring-pink-200 focus:outline-none transition appearance-none"
                      >
                        {[5, 6, 7, 8, 9, 10].map((num) => (
                          <option key={num} value={num}>{num}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Spacing
                      </label>
                      <select
                        value={spacing}
                        onChange={(e) => setSpacing(Number(e.target.value))}
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:border-pink-500 focus:ring-2 focus:ring-pink-200 focus:outline-none transition appearance-none"
                      >
                        {[1, 2, 3, 4, 5].map((num) => (
                          <option key={num} value={num}>{num}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <h2 className="text-lg font-bold text-gray-900 mt-8 mb-4">Layout</h2>

                  <div className="space-y-3">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="columns"
                        checked={columns === 1}
                        onChange={() => setColumns(1)}
                        className="w-4 h-4 text-pink-600 border-gray-300 focus:ring-pink-500"
                      />
                      <span className="text-gray-900 font-medium">1 column</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="columns"
                        checked={columns === 2}
                        onChange={() => setColumns(2)}
                        className="w-4 h-4 text-pink-600 border-gray-300 focus:ring-pink-500"
                      />
                      <span className="text-gray-900 font-medium">2 columns</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="columns"
                        checked={columns === 3}
                        onChange={() => setColumns(3)}
                        className="w-4 h-4 text-pink-600 border-gray-300 focus:ring-pink-500"
                      />
                      <span className="text-gray-900 font-medium">3 columns</span>
                    </label>
                  </div>

                  <div className="flex space-x-4 pt-4">
                    <button
                      onClick={handleReset}
                      className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 text-pink-600 rounded-lg hover:bg-purple-100 transition font-semibold"
                    >
                      <span>Reset</span>
                    </button>
                    <button
                      onClick={handleGenerate}
                      className="flex-1 flex items-center justify-center space-x-2 px-6 py-4 bg-pink-600 text-white rounded-full hover:bg-pink-700 transition font-semibold shadow-lg"
                    >
                      <RefreshCw className="w-5 h-5" />
                      <span>Generate Tracing</span>
                    </button>
                  </div>
                </div>
              </>
            ) : activeNavTab === 'theme' ? (
              <>
                <h2 className="text-lg font-bold text-gray-900 mb-6">Select Tracing Worksheet Theme</h2>

                <div className="grid grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-2">
                  {themes.map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => setSelectedTheme(theme)}
                      className={`relative border-2 rounded-lg p-4 transition-all ${
                        selectedTheme.id === theme.id
                          ? 'border-pink-600 bg-pink-50'
                          : 'border-gray-200 hover:border-pink-300'
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
                        <div className="absolute top-2 right-2 w-6 h-6 bg-pink-600 rounded-full flex items-center justify-center">
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
                <h2 className="text-lg font-bold text-gray-900 mb-6">How to Make Name Tracing Worksheets</h2>
                <div className="prose prose-sm text-gray-700 space-y-4">
                  <ol className="list-decimal list-inside space-y-3">
                    <li>Enter the text you want to trace in the text field</li>
                    <li>Select font, size, and color preferences</li>
                    <li>Adjust the number of lines and spacing</li>
                    <li>Choose your layout (1, 2, or 3 columns)</li>
                    <li>Select a theme/border style in the Theme tab</li>
                    <li>Click "Generate Tracing" to create your worksheet</li>
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
                <p className="text-gray-500 text-lg">No preview available yet.</p>
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
                          height: '1050px',
                          minHeight: '1050px'
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

                        <div className="flex-1 flex flex-col py-6 mt-[15px]">
                          <div
                            className={`grid ${
                              columns === 1 ? 'grid-cols-1' :
                              columns === 2 ? 'grid-cols-2' :
                              'grid-cols-3'
                            } gap-4 h-full content-start`}
                          >
                            {Array.from({ length: lines }).map((_, index) => (
                              <div
                                key={index}
                                className="flex items-center"
                                style={{
                                  marginBottom: `${spacing * 4}px`
                                }}
                              >
                                <svg
                                  width="100%"
                                  height={fontSize * 1.5}
                                  style={{ overflow: 'visible' }}
                                >
                                  <text
                                    x="0"
                                    y={fontSize}
                                    style={{
                                      fontFamily: selectedFont,
                                      fontSize: `${fontSize}px`,
                                      fill: 'none',
                                      stroke: textColor,
                                      strokeWidth: '1.5',
                                      letterSpacing: '2px',
                                      textTransform: 'uppercase',
                                      fontWeight: '300',
                                    }}
                                  >
                                    {text.toUpperCase()}
                                  </text>
                                </svg>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="text-center text-xs text-gray-500 py-[15px]">
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
                      className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-pink-600 text-white rounded-full hover:bg-pink-700 transition font-semibold shadow-md"
                    >
                      <Download className="w-5 h-5" />
                      <span>Download Worksheet</span>
                    </button>

                    <button
                      onClick={handlePrint}
                      className="w-full flex items-center justify-center space-x-2 px-6 py-3 border-2 border-pink-600 text-pink-600 rounded-full hover:bg-pink-50 transition font-semibold"
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
