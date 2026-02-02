import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Download, Printer, Play } from 'lucide-react';

export default function AlphabetTracingGenerator() {
  const [title, setTitle] = useState('Alphabet Tracing Practice');
  const [showName, setShowName] = useState(true);
  const [showDate, setShowDate] = useState(true);
  const [letterCase, setLetterCase] = useState('uppercase');
  const [letterRange, setLetterRange] = useState('all');
  const [fontStyle, setFontStyle] = useState('Codystar');
  const [fontSize, setFontSize] = useState(60);
  const [repetitions, setRepetitions] = useState(3);
  const [letterColor, setLetterColor] = useState('#000000');
  const [showGuideLines, setShowGuideLines] = useState(true);
  const [activeTab, setActiveTab] = useState('generator');
  const printRef = useRef<HTMLDivElement>(null);

  const generateAlphabet = () => {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    return letterCase === 'uppercase' ? uppercase.split('') : lowercase.split('');
  };

  const letters = generateAlphabet();

  const handlePrint = () => {
    const printContent = printRef.current;
    if (!printContent) return;

    const printWindow = window.open('', '', 'width=800,height=600');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>${title}</title>
          <link href="https://fonts.googleapis.com/css2?family=Codystar:wght@300;400&family=Raleway+Dots&display=swap" rel="stylesheet">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: Arial, sans-serif; padding: 40px; background: white; }
            .worksheet { max-width: 800px; margin: 0 auto; }
            .header { text-align: center; margin-bottom: 30px; }
            .header h1 { font-size: 24px; font-weight: bold; margin-bottom: 20px; }
            .header-fields { display: flex; gap: 40px; justify-content: center; margin-top: 15px; }
            .field { border-bottom: 1px solid #000; padding: 5px 20px; min-width: 200px; }
            .letters-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-top: 30px; }
            .letter-row { display: flex; gap: 8px; align-items: center; padding: 10px 0; position: relative; }
            .letter-row.with-lines::after {
              content: '';
              position: absolute;
              bottom: 10px;
              left: 0;
              right: 0;
              height: 1px;
              background: #ddd;
            }
            .letter {
              font-family: ${fontStyle}, cursive;
              font-size: ${fontSize}px;
              color: ${letterColor};
              opacity: 0.3;
              -webkit-text-stroke: 1px ${letterColor};
              paint-order: stroke fill;
            }
            @media print {
              body { padding: 20px; }
              .worksheet { max-width: 100%; }
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  const handleDownload = () => {
    handlePrint();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Link to="/" className="hover:text-pink-600">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/generators" className="hover:text-pink-600">Worksheet Generator</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900">Alphabet Tracing Generator</span>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Alphabet Tracing Generator</h1>
          <p className="text-gray-600">Create custom A-Z tracing worksheets for handwriting practice</p>
        </div>

        {/* Tabs */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('generator')}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                activeTab === 'generator'
                  ? 'bg-pink-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Generator
            </button>
            <button
              onClick={() => setActiveTab('theme')}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                activeTab === 'theme'
                  ? 'bg-pink-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Theme
            </button>
          </div>
          <button className="flex items-center gap-2 text-pink-600 hover:text-pink-700 font-medium">
            How to make <Play className="w-5 h-5 fill-pink-600" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel - Settings */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="space-y-8">
              {/* Worksheet Settings */}
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4">Worksheet Settings</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showName}
                        onChange={(e) => setShowName(e.target.checked)}
                        className="w-4 h-4 text-pink-600 rounded focus:ring-pink-500"
                      />
                      <span className="text-sm text-gray-700">Show Name</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showDate}
                        onChange={(e) => setShowDate(e.target.checked)}
                        className="w-4 h-4 text-pink-600 rounded focus:ring-pink-500"
                      />
                      <span className="text-sm text-gray-700">Show Date</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Letter Settings */}
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4">Letter Settings</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Letter Case
                    </label>
                    <select
                      value={letterCase}
                      onChange={(e) => setLetterCase(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    >
                      <option value="uppercase">Uppercase (A-Z)</option>
                      <option value="lowercase">Lowercase (a-z)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Letter Range
                    </label>
                    <select
                      value={letterRange}
                      onChange={(e) => setLetterRange(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    >
                      <option value="all">All Letters (A-Z)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Style Settings */}
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4">Style Settings</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Font Style
                      </label>
                      <select
                        value={fontStyle}
                        onChange={(e) => setFontStyle(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      >
                        <option value="Codystar">Codystar</option>
                        <option value="Raleway Dots">Raleway Dots</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Font Size
                      </label>
                      <input
                        type="text"
                        value={`${fontSize}px`}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          if (!isNaN(val)) setFontSize(val);
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Repetitions per Letter
                      </label>
                      <input
                        type="text"
                        value={`${repetitions} times`}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          if (!isNaN(val)) setRepetitions(val);
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Letter Color
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={letterColor}
                          onChange={(e) => setLetterColor(e.target.value)}
                          className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={letterColor}
                          onChange={(e) => setLetterColor(e.target.value)}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showGuideLines}
                      onChange={(e) => setShowGuideLines(e.target.checked)}
                      className="w-4 h-4 text-pink-600 rounded focus:ring-pink-500"
                    />
                    <span className="text-sm text-gray-700">Show Guide Lines</span>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => {
                    setTitle('Alphabet Tracing Practice');
                    setShowName(true);
                    setShowDate(true);
                    setLetterCase('uppercase');
                    setFontStyle('Codystar');
                    setFontSize(60);
                    setRepetitions(3);
                    setLetterColor('#000000');
                    setShowGuideLines(true);
                  }}
                  className="text-pink-600 hover:text-pink-700 font-medium"
                >
                  Reset
                </button>
                <button className="flex-1 bg-pink-600 text-white py-3 rounded-full font-semibold hover:bg-pink-700 transition-colors flex items-center justify-center gap-2">
                  <span className="text-lg">↻</span>
                  Generate Alphabet
                </button>
              </div>
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Worksheet Preview</h2>
              <div className="bg-gray-50 rounded-lg p-8 min-h-[600px] overflow-auto">
                <div ref={printRef} className="worksheet bg-white p-8 rounded shadow-sm">
                  <div className="header text-center mb-8">
                    <h1 className="text-2xl font-bold mb-4">{title}</h1>
                    <div className="flex gap-8 justify-center text-sm">
                      {showName && (
                        <div className="flex items-center gap-2">
                          <span>Name:</span>
                          <div className="border-b border-gray-400 w-48 h-6"></div>
                        </div>
                      )}
                      {showDate && (
                        <div className="flex items-center gap-2">
                          <span>Date:</span>
                          <div className="border-b border-gray-400 w-32 h-6"></div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    {letters.map((letter) => (
                      <div
                        key={letter}
                        className={`flex gap-2 items-center py-2 ${
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
                            }}
                          >
                            {letter}
                          </span>
                        ))}
                      </div>
                    ))}
                  </div>
                  <div className="mt-8 text-xs text-gray-400 text-center">
                    Created with TracingWorksheet.com | Copyright © 2025 | All rights reserved
                  </div>
                </div>
              </div>
            </div>

            {/* Download and Print Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleDownload}
                className="w-full bg-pink-600 text-white py-3 rounded-full font-semibold hover:bg-pink-700 transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Download Worksheet
              </button>
              <button
                onClick={handlePrint}
                className="w-full bg-white text-gray-700 py-3 rounded-full font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 border-2 border-gray-200"
              >
                <Printer className="w-5 h-5" />
                Print
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
