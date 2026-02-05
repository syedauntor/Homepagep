import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Download, Printer, Play, RefreshCw, Eye } from 'lucide-react';
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

const tracingPracticeGenerators = [
  { name: 'Alphabet Tracing Generator', slug: 'alphabet-tracing' },
  { name: 'Name Tracing Worksheets', slug: 'name-tracing' },
  { name: 'Telling Time Worksheet Generator', slug: 'telling-time' },
  { name: 'Picture Coloring and Tracing Worksheet', slug: 'picture-tracing' },
  { name: 'Sentence Tracing Practice Worksheet', slug: 'sentence-tracing' },
  { name: 'Word Tracing Practice Worksheet Maker', slug: 'word-tracing' },
];

export default function AlphabetTracingGenerator() {
  const [title, setTitle] = useState('Alphabet Tracing Practice');
  const [showName, setShowName] = useState(true);
  const [showDate, setShowDate] = useState(true);
  const [letterCase, setLetterCase] = useState<'uppercase' | 'lowercase' | 'both'>('uppercase');
  const [letterRange, setLetterRange] = useState<'all' | 'first-half' | 'second-half' | 'custom'>('all');
  const [customLetters, setCustomLetters] = useState('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
  const [fontStyle, setFontStyle] = useState('Raleway Dots');
  const [fontSize, setFontSize] = useState(60);
  const [repetitions, setRepetitions] = useState(3);
  const [letterColor, setLetterColor] = useState('#000000');
  const [showGuideLines, setShowGuideLines] = useState(true);
  const [activeNavTab, setActiveNavTab] = useState<'generator' | 'theme' | 'howto'>('generator');
  const [selectedTheme, setSelectedTheme] = useState<Theme>(themes[0]);
  const [letters, setLetters] = useState<string[]>([]);
  const printRef = useRef<HTMLDivElement>(null);

  const getMaxFontSize = React.useCallback(() => {
    if (letterCase === 'both' && letterRange === 'all') {
      return 40;
    }
    return 70;
  }, [letterCase, letterRange]);

  const getAvailableFontSizes = React.useCallback(() => {
    const maxSize = getMaxFontSize();
    const allSizes = [40, 50, 60, 70];
    return allSizes.filter(size => size <= maxSize);
  }, [getMaxFontSize]);

  const getAvailableRepetitions = () => {
    return [2, 3];
  };

  React.useEffect(() => {
    const maxSize = getMaxFontSize();
    if (fontSize > maxSize) {
      setFontSize(maxSize);
    }
  }, [letterCase, letterRange, fontSize, getMaxFontSize]);

  React.useEffect(() => {
    const maxRep = 3;
    if (repetitions > maxRep) {
      setRepetitions(maxRep);
    }
  }, [letterCase, letterRange, repetitions]);

  const getGridColumns = () => {
    if (repetitions === 2) {
      return 4;
    }
    if (repetitions === 3) {
      if (fontSize >= 60) return 3;
      return 4;
    }
    return 4;
  };

  const generateAlphabet = () => {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result: string[] = [];

    if (letterRange === 'custom') {
      const customArray = customLetters.toUpperCase().split('').filter(char => /[A-Z]/.test(char));

      if (letterCase === 'uppercase') {
        result = customArray;
      } else if (letterCase === 'lowercase') {
        result = customArray.map(c => c.toLowerCase());
      } else {
        result = customArray.flatMap(c => [c, c.toLowerCase()]);
      }
    } else {
      let baseLetters = '';

      if (letterRange === 'all') {
        baseLetters = uppercase;
      } else if (letterRange === 'first-half') {
        baseLetters = uppercase.slice(0, 13);
      } else if (letterRange === 'second-half') {
        baseLetters = uppercase.slice(13);
      }

      if (letterCase === 'uppercase') {
        result = baseLetters.split('');
      } else if (letterCase === 'lowercase') {
        result = baseLetters.toLowerCase().split('');
      } else {
        result = baseLetters.split('').flatMap(c => [c, c.toLowerCase()]);
      }
    }

    setLetters(result);
  };

  const handleReset = () => {
    setTitle('Alphabet Tracing Practice');
    setShowName(true);
    setShowDate(true);
    setLetterCase('uppercase');
    setLetterRange('all');
    setCustomLetters('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
    setFontStyle('Raleway Dots');
    setFontSize(60);
    setRepetitions(3);
    setLetterColor('#000000');
    setShowGuideLines(true);
    setLetters([]);
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
          <Link to="/" className="hover:text-orange-500 transition">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/generators" className="hover:text-orange-500 transition">Worksheet Generator</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium">Alphabet Tracing Generator</span>
        </div>

        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Alphabet Tracing Generator</h1>
          <p className="text-gray-600">Create custom A-Z tracing worksheets for handwriting practice</p>
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
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Title
                    </label>
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

                  <h2 className="text-lg font-bold text-gray-900 mt-8 mb-4">Letter Settings</h2>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Letter Case
                      </label>
                      <select
                        value={letterCase}
                        onChange={(e) => setLetterCase(e.target.value as any)}
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none transition appearance-none"
                      >
                        <option value="uppercase">Uppercase (A-Z)</option>
                        <option value="lowercase">Lowercase (a-z)</option>
                        <option value="both">Both (Aa-Zz)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Letter Range
                      </label>
                      <select
                        value={letterRange}
                        onChange={(e) => setLetterRange(e.target.value as any)}
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none transition appearance-none"
                      >
                        <option value="all">All Letters</option>
                        <option value="first-half">First Half (A-M)</option>
                        <option value="second-half">Second Half (N-Z)</option>
                        <option value="custom">Custom Selection</option>
                      </select>
                    </div>
                  </div>

                  {letterRange === 'custom' && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Custom Letters
                      </label>
                      <input
                        type="text"
                        value={customLetters}
                        onChange={(e) => setCustomLetters(e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none transition"
                        placeholder="Enter custom letters (e.g., ABCDEFGHIJKLMNOPQRSTUVWXYZ)"
                      />
                    </div>
                  )}

                  <h2 className="text-lg font-bold text-gray-900 mt-8 mb-4">Style Settings</h2>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Font Style
                      </label>
                      <select
                        value={fontStyle}
                        onChange={(e) => setFontStyle(e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none transition appearance-none"
                      >
                        <option value="Codystar">Codystar</option>
                        <option value="Raleway Dots">Raleway Dots</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Font Size
                      </label>
                      <select
                        value={fontSize}
                        onChange={(e) => setFontSize(Number(e.target.value))}
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none transition appearance-none"
                      >
                        {getAvailableFontSizes().map(size => (
                          <option key={size} value={size}>{size}px</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Repetitions per Letter
                      </label>
                      <select
                        value={repetitions}
                        onChange={(e) => setRepetitions(Number(e.target.value))}
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none transition appearance-none"
                      >
                        {getAvailableRepetitions().map(rep => (
                          <option key={rep} value={rep}>{rep} times</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Letter Color
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={letterColor}
                          onChange={(e) => setLetterColor(e.target.value)}
                          className="w-12 h-12 rounded border border-gray-300 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={letterColor}
                          onChange={(e) => setLetterColor(e.target.value)}
                          className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-lg focus:border-pink-500 focus:ring-2 focus:ring-pink-200 focus:outline-none transition"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 pt-2">
                    <input
                      type="checkbox"
                      id="showGuideLines"
                      checked={showGuideLines}
                      onChange={(e) => setShowGuideLines(e.target.checked)}
                      className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                    />
                    <label htmlFor="showGuideLines" className="text-sm font-medium text-gray-700">
                      Show Guide Lines
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
                      onClick={generateAlphabet}
                      className="flex-1 flex items-center justify-center space-x-2 px-6 py-4 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition font-semibold shadow-lg"
                    >
                      <RefreshCw className="w-5 h-5" />
                      <span>Generate Alphabet</span>
                    </button>
                  </div>
                </div>
              </>
            ) : activeNavTab === 'theme' ? (
              <>
                <h2 className="text-lg font-bold text-gray-900 mb-6">Select Alphabet Worksheet Theme</h2>

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
                <h2 className="text-lg font-bold text-gray-900 mb-6">How to Make Alphabet Tracing Worksheets</h2>
                <div className="prose prose-sm text-gray-700 space-y-4">
                  <ol className="list-decimal list-inside space-y-3">
                    <li>Choose your worksheet settings in the Generator tab</li>
                    <li>Select letter case (uppercase, lowercase, or both)</li>
                    <li>Choose letter range or create custom selection</li>
                    <li>Pick a font style and size that suits your needs</li>
                    <li>Select a theme/border style in the Theme tab</li>
                    <li>Click "Generate Alphabet" to create your worksheet</li>
                    <li>Preview your worksheet</li>
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

            {letters.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-96 bg-gray-50 mx-6 mb-6 rounded-lg">
                <div className="w-16 h-16 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                  <Eye className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 text-lg">No worksheet generated yet.</p>
              </div>
            ) : (
              <div>
                <div className="preview-container bg-gray-100 flex items-center justify-center overflow-hidden" style={{ height: '700px' }}>
                  <div className="preview-scale">
                    <div
                      ref={printRef}
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
                          <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-4">{title}</h1>
                          <div className="flex justify-between text-base text-gray-600">
                            {showName && <span>Name: _________________________</span>}
                            {!showName && <span></span>}
                            {showDate && <span>Date: _________________________</span>}
                          </div>
                        </div>

                        <div className="flex-1 flex flex-col justify-start py-6 mt-[15px] overflow-hidden">
                          <div
                            className="grid gap-x-4 gap-y-3"
                            style={{ gridTemplateColumns: `repeat(${getGridColumns()}, 1fr)` }}
                          >
                            {letters.map((letter, index) => (
                              <div
                                key={index}
                                className={`flex gap-1 items-center justify-start py-1 ${
                                  showGuideLines ? 'border-b border-dashed border-gray-300' : ''
                                }`}
                              >
                                {Array.from({ length: repetitions }).map((_, idx) => (
                                  <span
                                    key={idx}
                                    style={{
                                      fontFamily: fontStyle,
                                      fontSize: `${fontSize}px`,
                                      color: letterColor,
                                      opacity: 0.3,
                                      WebkitTextStroke: `1px ${letterColor}`,
                                      paintOrder: 'stroke fill',
                                      lineHeight: '1',
                                    }}
                                  >
                                    {letter}
                                  </span>
                                ))}
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
          currentSlug="alphabet-tracing"
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
