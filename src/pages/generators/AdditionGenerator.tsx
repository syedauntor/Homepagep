import { useState, useRef } from 'react';
import { Download, Printer, Eye, RefreshCw, RotateCcw, ChevronRight, Maximize2, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

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
  { id: 'blank', name: 'Blank', borderColor: '#3B82F6', borderWidth: '3px', borderStyle: 'solid' },
  { id: 'autumn', name: 'Autumn Leaves', borderColor: '#10B981', borderWidth: '3px', borderStyle: 'solid', decoration: '🍂🍁' },
  { id: 'beep', name: 'Beep Beep', borderColor: '#F59E0B', borderWidth: '3px', borderStyle: 'solid', decoration: '🚗🚕' },
  { id: 'biking', name: 'Biking', borderColor: '#8B5CF6', borderWidth: '3px', borderStyle: 'solid', decoration: '🚴‍♂️🚴‍♀️' },
  { id: 'blue', name: 'Blue', borderColor: '#06B6D4', borderWidth: '3px', borderStyle: 'solid' },
  { id: 'green', name: 'Green', borderColor: '#10B981', borderWidth: '3px', borderStyle: 'solid' },
  { id: 'hearts', name: 'Hearts', borderColor: '#EC4899', borderWidth: '3px', borderStyle: 'solid', decoration: '❤️💕' },
  { id: 'yellow', name: 'Yellow', borderColor: '#EAB308', borderWidth: '3px', borderStyle: 'solid' },
];

export function AdditionGenerator() {
  const [title, setTitle] = useState('Addition Generator');
  const [difficulty, setDifficulty] = useState<'simple' | 'medium' | 'hard'>('simple');
  const [orientation, setOrientation] = useState<'horizontal' | 'vertical'>('horizontal');
  const [numProblems, setNumProblems] = useState(20);
  const [showProblemNumber, setShowProblemNumber] = useState(true);
  const [showAnswers, setShowAnswers] = useState(false);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [activeTab, setActiveTab] = useState<'worksheet' | 'answer'>('worksheet');
  const [activeNavTab, setActiveNavTab] = useState<'generator' | 'theme' | 'howto'>('generator');
  const [selectedTheme, setSelectedTheme] = useState<Theme>(themes[0]);
  const worksheetRef = useRef<HTMLDivElement>(null);

  const generateProblems = () => {
    const newProblems: Problem[] = [];
    let maxDigits = 1;

    switch (difficulty) {
      case 'simple':
        maxDigits = 1;
        break;
      case 'medium':
        maxDigits = 2;
        break;
      case 'hard':
        maxDigits = 3;
        break;
    }

    const max = Math.pow(10, maxDigits) - 1;
    const min = maxDigits === 1 ? 0 : Math.pow(10, maxDigits - 1);

    for (let i = 0; i < numProblems; i++) {
      const num1 = Math.floor(Math.random() * (max - min + 1)) + min;
      const num2 = Math.floor(Math.random() * (max - min + 1)) + min;
      newProblems.push({
        num1,
        num2,
        answer: num1 + num2,
      });
    }

    setProblems(newProblems);
  };

  const handleReset = () => {
    setTitle('Addition Generator');
    setDifficulty('simple');
    setOrientation('horizontal');
    setNumProblems(20);
    setShowProblemNumber(true);
    setProblems([]);
  };

  const handlePrint = () => {
    window.print();
  };

  const downloadWorksheet = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <Link to="/" className="hover:text-pink-600 transition">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/generators" className="hover:text-pink-600 transition">Worksheet Generator</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium">Addition Generator</span>
        </div>

        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Addition Generator</h1>
          <p className="text-gray-600">Keep it to 20 items or less</p>
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

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-purple-50 rounded-2xl shadow-sm p-8">
            {activeNavTab === 'generator' ? (
              <>
                <h2 className="text-lg font-bold text-gray-900 mb-6">Title</h2>

                <div className="space-y-6">
              <div>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:border-pink-500 focus:ring-2 focus:ring-pink-200 focus:outline-none transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Number of Digits
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as any)}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:border-pink-500 focus:ring-2 focus:ring-pink-200 focus:outline-none transition appearance-none"
                  >
                    <option value="simple">Simple</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Orientation
                  </label>
                  <select
                    value={orientation}
                    onChange={(e) => {
                      const newOrientation = e.target.value as 'horizontal' | 'vertical';
                      setOrientation(newOrientation);
                      if (numProblems > 20) {
                        setNumProblems(20);
                      }
                    }}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:border-pink-500 focus:ring-2 focus:ring-pink-200 focus:outline-none transition appearance-none"
                  >
                    <option value="horizontal">Horizontal</option>
                    <option value="vertical">Vertical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Number of Problems
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={numProblems}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    setNumProblems(Math.min(value, 20));
                  }}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:border-pink-500 focus:ring-2 focus:ring-pink-200 focus:outline-none transition"
                />
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
                  className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 text-pink-600 rounded-lg hover:bg-purple-100 transition font-semibold"
                >
                  <span>Reset</span>
                </button>
                <button
                  onClick={generateProblems}
                  className="flex-1 flex items-center justify-center space-x-2 px-6 py-4 bg-pink-600 text-white rounded-full hover:bg-pink-700 transition font-semibold shadow-lg"
                >
                  <RefreshCw className="w-5 h-5" />
                  <span>Regenerate Addition</span>
                </button>
              </div>
            </div>
              </>
            ) : activeNavTab === 'theme' ? (
              <>
                <h2 className="text-lg font-bold text-gray-900 mb-6">Select Addition Worksheet Theme</h2>

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
                <h2 className="text-lg font-bold text-gray-900 mb-6">How to Make Addition Worksheets</h2>
                <div className="prose prose-sm text-gray-700 space-y-4">
                  <ol className="list-decimal list-inside space-y-3">
                    <li>Choose your worksheet settings in the Generator tab</li>
                    <li>Select a theme/border style in the Theme tab</li>
                    <li>Click "Regenerate Addition" to create new problems</li>
                    <li>Preview your worksheet and answer key</li>
                    <li>Download or print your worksheet</li>
                  </ol>
                </div>
              </>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="p-8 pb-0">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Worksheet Preview</h2>

              <div className="flex space-x-2 mb-4">
                <button
                  onClick={() => setActiveTab('worksheet')}
                  className={`px-6 py-2 font-semibold transition rounded-full ${
                    activeTab === 'worksheet'
                      ? 'bg-pink-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Worksheet
                </button>
                <button
                  onClick={() => setActiveTab('answer')}
                  className={`px-6 py-2 font-semibold transition rounded-full ${
                    activeTab === 'answer'
                      ? 'bg-pink-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Answer Key
                </button>
              </div>
            </div>

            {problems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-96 bg-gray-50 mx-8 mb-8 rounded-lg">
                <div className="w-16 h-16 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                  <Eye className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 text-lg">No posts available yet.</p>
              </div>
            ) : (
              <div>
                <div className="preview-container bg-gray-100 flex items-center justify-center overflow-hidden" style={{ height: '650px' }}>
                  <div className="preview-scale">
                    <div
                      ref={worksheetRef}
                      className="worksheet-content bg-white shadow-xl flex flex-col justify-between relative py-8"
                      style={{
                        borderColor: selectedTheme.borderColor,
                        borderWidth: selectedTheme.borderWidth,
                        borderStyle: selectedTheme.borderStyle
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
                      <div className="text-center mb-12">
                        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                        <div className={`flex justify-between mt-4 text-sm text-gray-600 ${orientation === 'horizontal' ? 'px-8' : ''}`}>
                          <span>Name: _________________________</span>
                          <span>Date: _________________________</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-start flex-1 px-0 min-h-[600px]">
                        <div className={`w-full ${orientation === 'horizontal' ? 'flex flex-wrap justify-between px-8' : 'grid grid-cols-4 gap-y-12 gap-x-8 px-8'}`}>
                          {problems.map((problem, index) => (
                            <div key={index} className={orientation === 'horizontal' ? `text-left w-[47%] mb-12 ${index % 2 === 0 ? '' : ''}` : 'text-center'}>
                              {orientation === 'horizontal' ? (
                                <div className="flex items-center space-x-3 text-xl justify-start">
                                  {showProblemNumber && (
                                    <span className="text-gray-400 text-base">{index + 1}.</span>
                                  )}
                                  <span>{problem.num1}</span>
                                  <span>+</span>
                                  <span>{problem.num2}</span>
                                  <span>=</span>
                                  {activeTab === 'answer' ? (
                                    <span className="font-bold text-pink-600">{problem.answer}</span>
                                  ) : (
                                    <span className="inline-block w-20 border-b-2 border-gray-300"></span>
                                  )}
                                </div>
                              ) : (
                                <div className="inline-block text-right">
                                  {showProblemNumber && (
                                    <div className="text-left text-gray-400 text-base mb-1">{index + 1}.</div>
                                  )}
                                  <div className="inline-block min-w-[90px]">
                                    <div className="text-2xl">{problem.num1}</div>
                                    <div className="text-2xl">
                                      + {problem.num2}
                                    </div>
                                    {activeTab === 'answer' ? (
                                      <div className="text-2xl font-bold text-pink-600 border-t-2 border-gray-900 mt-1 pt-1">
                                        {problem.answer}
                                      </div>
                                    ) : (
                                      <div className="border-t-2 border-gray-900 mt-1 pt-2"></div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="text-center text-xs text-gray-500 mt-12">
                        <p>Find more educational worksheets at PrintAndUse.com</p>
                        <p>Copyright ©2025 - www.printanduse.com | All rights reserved</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-8 pt-4">
                  <div className="space-y-3">
                    <button
                      onClick={downloadWorksheet}
                      className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-pink-600 text-white rounded-full hover:bg-pink-700 transition font-semibold shadow-md"
                    >
                      <Download className="w-5 h-5" />
                      <span>Download Worksheet</span>
                    </button>

                    <button
                      onClick={downloadWorksheet}
                      className="w-full flex items-center justify-center space-x-2 px-6 py-3 border-2 border-pink-600 text-pink-600 rounded-full hover:bg-pink-50 transition font-semibold"
                    >
                      <Download className="w-5 h-5" />
                      <span>Download Answer Key</span>
                    </button>

                    <button
                      onClick={() => setActiveTab(activeTab === 'worksheet' ? 'answer' : 'worksheet')}
                      className="w-full flex items-center justify-center space-x-2 px-6 py-3 border-2 border-pink-600 text-pink-600 rounded-full hover:bg-pink-50 transition font-semibold"
                    >
                      <Eye className="w-5 h-5" />
                      <span>Toggle Answer</span>
                    </button>

                    <button
                      onClick={handlePrint}
                      className="w-full flex items-center justify-center space-x-2 px-6 py-3 border-2 border-pink-600 text-pink-600 rounded-full hover:bg-pink-50 transition font-semibold"
                    >
                      <Printer className="w-5 h-5" />
                      <span>Print</span>
                    </button>

                    <button
                      className="w-full flex items-center justify-center space-x-2 px-6 py-3 border-2 border-pink-600 text-pink-600 rounded-full hover:bg-pink-50 transition font-semibold"
                    >
                      <Maximize2 className="w-5 h-5" />
                      <span>Full Preview</span>
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
          transform: scale(0.45);
          transform-origin: center center;
        }

        .preview-container {
          padding: 15px 10px;
          position: relative;
        }

        @media print {
          @page {
            size: A4;
            margin: 0;
          }

          body * {
            visibility: hidden;
          }

          .worksheet-content,
          .worksheet-content * {
            visibility: visible;
          }

          .worksheet-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 210mm;
            height: 297mm;
            padding: 12mm 15mm;
            box-shadow: none !important;
            border-color: inherit !important;
            border-width: inherit !important;
            border-style: inherit !important;
          }

          .preview-scale {
            transform: none !important;
          }

          .preview-container {
            background: white !important;
            padding: 0 !important;
            box-shadow: none !important;
          }
        }
      `}</style>
    </div>
  );
}
