import { useState, useRef } from 'react';
import { Download, Printer, Eye, RefreshCw, RotateCcw } from 'lucide-react';

interface Problem {
  num1: number;
  num2: number;
  answer: number;
}

export function AdditionGenerator() {
  const [title, setTitle] = useState('Addition Generator');
  const [difficulty, setDifficulty] = useState<'simple' | 'medium' | 'hard'>('simple');
  const [orientation, setOrientation] = useState<'horizontal' | 'vertical'>('horizontal');
  const [numProblems, setNumProblems] = useState(20);
  const [showProblemNumber, setShowProblemNumber] = useState(true);
  const [showAnswers, setShowAnswers] = useState(false);
  const [problems, setProblems] = useState<Problem[]>([]);
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Addition Generator</h1>
          <p className="text-gray-600">Keep it to 20 items or less for best results</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Generator Settings</h2>

            <div className="space-y-6">
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

              <div className="grid grid-cols-2 gap-4">
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
                    onChange={(e) => {
                      const newOrientation = e.target.value as 'horizontal' | 'vertical';
                      setOrientation(newOrientation);
                      if (newOrientation === 'vertical' && numProblems > 20) {
                        setNumProblems(20);
                      }
                    }}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none transition"
                  >
                    <option value="horizontal">Horizontal</option>
                    <option value="vertical">Vertical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Number of Problems {orientation === 'vertical' && <span className="text-orange-500">(Max 20 for vertical)</span>}
                </label>
                <input
                  type="number"
                  min="1"
                  max={orientation === 'vertical' ? 20 : 50}
                  value={numProblems}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    setNumProblems(orientation === 'vertical' ? Math.min(value, 20) : value);
                  }}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none transition"
                />
              </div>

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

              <div className="flex space-x-4 pt-4">
                <button
                  onClick={handleReset}
                  className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 border-2 border-orange-500 text-orange-500 rounded-lg hover:bg-orange-50 transition font-semibold"
                >
                  <RotateCcw className="w-5 h-5" />
                  <span>Reset</span>
                </button>
                <button
                  onClick={generateProblems}
                  className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-semibold shadow-md"
                >
                  <RefreshCw className="w-5 h-5" />
                  <span>Generate</span>
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-8 pb-4">
              <h2 className="text-2xl font-bold text-gray-900">Worksheet Preview</h2>
            </div>

            {problems.length === 0 ? (
              <div className="flex items-center justify-center h-96 bg-gray-50 border-2 border-dashed border-gray-300 mx-8 mb-8 rounded-lg">
                <p className="text-gray-500 text-lg">Click Generate to create worksheet</p>
              </div>
            ) : (
              <div>
                <div className="preview-container bg-gray-100 flex items-center justify-center overflow-hidden" style={{ height: '900px' }}>
                  <div className="preview-scale">
                    <div ref={worksheetRef} className="worksheet-content bg-white shadow-xl flex flex-col justify-between">
                      <div className="text-center">
                        <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
                        <div className="flex justify-between mt-2 text-sm text-gray-600">
                          <span>Name: _________________________</span>
                          <span>Date: _________________________</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-center flex-1 px-8 py-6">
                        <div className={`grid ${orientation === 'horizontal' ? 'grid-cols-2 gap-y-8 gap-x-16' : 'grid-cols-4 gap-y-8 gap-x-10'}`}>
                          {problems.map((problem, index) => (
                            <div key={index} className="text-center">
                              {orientation === 'horizontal' ? (
                                <div className="flex items-center justify-center space-x-3 text-xl">
                                  {showProblemNumber && (
                                    <span className="text-gray-400 text-base">{index + 1}.</span>
                                  )}
                                  <span>{problem.num1}</span>
                                  <span>+</span>
                                  <span>{problem.num2}</span>
                                  <span>=</span>
                                  {showAnswers ? (
                                    <span className="font-bold text-orange-500">{problem.answer}</span>
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
                                    {showAnswers ? (
                                      <div className="text-2xl font-bold text-orange-500 border-t-2 border-gray-900 mt-1 pt-1">
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

                      <div className="text-center text-xs text-gray-500">
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
                      className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-semibold shadow-md"
                    >
                      <Download className="w-5 h-5" />
                      <span>Download Worksheet</span>
                    </button>

                    <button
                      onClick={() => setShowAnswers(!showAnswers)}
                      className="w-full flex items-center justify-center space-x-2 px-6 py-3 border-2 border-orange-500 text-orange-500 rounded-lg hover:bg-orange-50 transition font-semibold"
                    >
                      <Eye className="w-5 h-5" />
                      <span>{showAnswers ? 'Hide' : 'Show'} Answers</span>
                    </button>

                    <button
                      onClick={handlePrint}
                      className="w-full flex items-center justify-center space-x-2 px-6 py-3 border-2 border-orange-500 text-orange-500 rounded-lg hover:bg-orange-50 transition font-semibold"
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
          transform: scale(0.62);
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
