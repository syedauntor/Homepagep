import { useState } from 'react';
import { Download, Printer, RefreshCw, RotateCcw, Maximize } from 'lucide-react';

interface Problem {
  num1: number;
  num2: number;
  answer: number;
}

export function AdditionGenerator() {
  const [title, setTitle] = useState('Addition Generator');
  const [difficulty, setDifficulty] = useState<'simple' | 'medium' | 'hard'>('simple');
  const [orientation, setOrientation] = useState<'horizontal' | 'vertical'>('horizontal');
  const [numProblems, setNumProblems] = useState(32);
  const [showProblemNumber, setShowProblemNumber] = useState(true);
  const [viewMode, setViewMode] = useState<'worksheet' | 'answer'>('worksheet');
  const [problems, setProblems] = useState<Problem[]>([]);

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
    setNumProblems(32);
    setShowProblemNumber(true);
    setProblems([]);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Addition Generator</h1>
          <p className="text-gray-600">Keep it to 20 items or less for best results</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Generator Settings</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Number of Digits
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none transition"
              >
                <option value="simple">Simple (1 digit)</option>
                <option value="medium">Medium (2 digits)</option>
                <option value="hard">Hard (3 digits)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Orientation
              </label>
              <select
                value={orientation}
                onChange={(e) => setOrientation(e.target.value as any)}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none transition"
              >
                <option value="horizontal">Horizontal</option>
                <option value="vertical">Vertical</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Number of Problems
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={numProblems}
                onChange={(e) => setNumProblems(Number(e.target.value))}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none transition"
              />
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="showNumbers"
                checked={showProblemNumber}
                onChange={(e) => setShowProblemNumber(e.target.checked)}
                className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
              />
              <label htmlFor="showNumbers" className="text-sm font-medium text-gray-700">
                Show Problem Number
              </label>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={handleReset}
                className="flex items-center space-x-2 px-6 py-3 border-2 border-orange-500 text-orange-500 rounded-lg hover:bg-orange-50 transition font-semibold"
              >
                <RotateCcw className="w-5 h-5" />
                <span>Reset</span>
              </button>
              <button
                onClick={generateProblems}
                className="flex items-center space-x-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-semibold shadow-md"
              >
                <RefreshCw className="w-5 h-5" />
                <span>Regenerate Addition</span>
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Worksheet Preview</h2>

            {problems.length > 0 && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('worksheet')}
                  className={`px-6 py-2 rounded-full font-semibold transition ${
                    viewMode === 'worksheet'
                      ? 'bg-pink-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Worksheet
                </button>
                <button
                  onClick={() => setViewMode('answer')}
                  className={`px-6 py-2 rounded-full font-semibold transition ${
                    viewMode === 'answer'
                      ? 'bg-pink-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Answer Key
                </button>
              </div>
            )}
          </div>

          {problems.length === 0 ? (
            <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <p className="text-gray-500 text-lg">Click Generate to create worksheet</p>
            </div>
          ) : (
            <div>
              <div className="bg-white border-2 border-gray-200 rounded-lg p-8 mb-6 a4-preview mx-auto shadow-sm">
                <div className="printable-content" id="printable-area">
                  <div className="text-center mb-8">
                    <h3 className="text-3xl font-bold text-gray-900 mb-6">{title}</h3>
                    <div className="flex justify-between text-base text-gray-600 max-w-2xl mx-auto">
                      <span>Name: _______________________________</span>
                      <span>Date: _______________________________</span>
                    </div>
                  </div>

                  <div className={`grid ${orientation === 'horizontal' ? 'grid-cols-2' : 'grid-cols-4'} gap-6 mb-12`}>
                    {problems.map((problem, index) => (
                      <div key={index} className="text-center">
                        {orientation === 'horizontal' ? (
                          <div className="flex items-center justify-center space-x-2 text-xl">
                            {showProblemNumber && (
                              <span className="text-gray-400 text-base">{index + 1}.</span>
                            )}
                            <span className="font-medium">{problem.num1}</span>
                            <span>+</span>
                            <span className="font-medium">{problem.num2}</span>
                            <span>=</span>
                            {viewMode === 'answer' ? (
                              <span className="font-bold text-orange-500">{problem.answer}</span>
                            ) : (
                              <span className="inline-block w-20 border-b-2 border-gray-400"></span>
                            )}
                          </div>
                        ) : (
                          <div className="inline-block text-right">
                            {showProblemNumber && (
                              <div className="text-left text-gray-400 text-base mb-1">{index + 1}.</div>
                            )}
                            <div className="border-2 border-gray-300 rounded p-3 inline-block min-w-[80px]">
                              <div className="text-xl font-medium">{problem.num1}</div>
                              <div className="text-xl border-t-2 border-gray-400 mt-2 pt-2 font-medium">
                                + {problem.num2}
                              </div>
                              {viewMode === 'answer' ? (
                                <div className="text-xl font-bold text-orange-500 border-t-2 border-gray-500 mt-2 pt-2">
                                  {problem.answer}
                                </div>
                              ) : (
                                <div className="border-t-2 border-gray-500 mt-2 pt-2 h-8"></div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="text-center text-xs text-gray-500 mt-12 pt-8 border-t border-gray-200">
                    <p>Find more educational worksheets at PrintAndUse.com</p>
                    <p>Copyright ©2025 - www.printanduse.com | All rights reserved</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                <button
                  onClick={handlePrint}
                  className="flex items-center justify-center space-x-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-semibold shadow-md"
                >
                  <Download className="w-5 h-5" />
                  <span>Download Worksheet</span>
                </button>

                <button
                  onClick={handlePrint}
                  className="flex items-center justify-center space-x-2 px-6 py-3 border-2 border-pink-500 text-pink-500 rounded-lg hover:bg-pink-50 transition font-semibold"
                >
                  <Download className="w-5 h-5" />
                  <span>Download Answer Key</span>
                </button>

                <button
                  onClick={() => setViewMode(viewMode === 'worksheet' ? 'answer' : 'worksheet')}
                  className="flex items-center justify-center space-x-2 px-6 py-3 border-2 border-pink-500 text-pink-500 rounded-lg hover:bg-pink-50 transition font-semibold"
                >
                  <RefreshCw className="w-5 h-5" />
                  <span>Toggle Answer</span>
                </button>

                <button
                  onClick={handlePrint}
                  className="flex items-center justify-center space-x-2 px-6 py-3 border-2 border-pink-500 text-pink-500 rounded-lg hover:bg-pink-50 transition font-semibold"
                >
                  <Printer className="w-5 h-5" />
                  <span>Print</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .a4-preview {
          width: 210mm;
          min-height: 297mm;
          background: white;
          box-sizing: border-box;
        }

        @media screen and (max-width: 768px) {
          .a4-preview {
            width: 100%;
            min-height: auto;
          }
        }

        @media print {
          body * {
            visibility: hidden;
          }
          #printable-area,
          #printable-area * {
            visibility: visible;
          }
          #printable-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 20mm;
          }
          @page {
            size: A4;
            margin: 15mm;
          }
        }
      `}</style>
    </div>
  );
}
