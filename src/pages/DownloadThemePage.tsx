import { useState } from 'react';
import { Download, FileArchive, CheckCircle, Loader2 } from 'lucide-react';

export function DownloadThemePage() {
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState('');

  async function handleDownload() {
    setDownloading(true);
    setError('');
    try {
      const res = await fetch('/printanduse.zip');
      if (!res.ok) throw new Error('File not found');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'printanduse.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      setError('Download failed. Please try opening the preview in a new browser tab and try again.');
    } finally {
      setDownloading(false);
    }
  }
  const files = [
    { label: 'Core Theme', items: ['style.css', 'functions.php', 'header.php', 'footer.php'] },
    { label: 'Page Templates', items: ['front-page.php', 'single.php', 'archive.php', 'page.php', '404.php'] },
    { label: 'Generator Pages (7)', items: ['Addition', 'Subtraction', 'Multiplication', 'Division', 'Name Tracing', 'Alphabet Tracing', 'Name Tracing + Coloring'] },
    { label: 'JavaScript Generators (7)', items: ['addition-generator.js', 'subtraction-generator.js', 'multiplication-generator.js', 'division-generator.js', 'name-tracing-generator.js', 'alphabet-tracing-generator.js', 'name-tracing-coloring-generator.js'] },
    { label: 'Inc/ Helpers', items: ['custom-post-types.php', 'theme-options.php', 'template-functions.php', 'woocommerce.php'] },
    { label: 'Assets', items: ['assets/css/main.css', 'assets/js/main.js', 'template-parts/post-card.php'] },
  ];

  const steps = [
    'WordPress Admin-এ যান → Appearance → Themes',
    '"Add New" বাটনে ক্লিক করুন',
    '"Upload Theme" বাটনে ক্লিক করুন',
    'printanduse.zip ফাইলটি select করুন',
    '"Install Now" → "Activate" করুন',
    'Pages তৈরি করুন, প্রতিটিতে সঠিক Template assign করুন',
    'Appearance → Menus থেকে navigation menu set করুন',
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-100 rounded-2xl mb-6">
            <FileArchive className="w-10 h-10 text-orange-500" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3">PrintAndUse WordPress Theme</h1>
          <p className="text-gray-500 text-lg">Complete WordPress theme — 34 files, ready to install</p>
        </div>

        {/* Download Button */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8 text-center">
          <p className="text-gray-600 mb-6 text-base">
            নিচের বাটনে ক্লিক করুন — file আপনার computer-এ save হবে।
          </p>
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="inline-flex items-center gap-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-70 text-white font-bold text-lg px-10 py-4 rounded-xl transition-colors shadow-lg shadow-orange-200 cursor-pointer"
          >
            {downloading
              ? <><Loader2 className="w-6 h-6 animate-spin" /> Downloading...</>
              : <><Download className="w-6 h-6" /> printanduse.zip ডাউনলোড করুন</>
            }
          </button>
          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
              {error}
            </div>
          )}
          <p className="text-gray-400 text-sm mt-4">File size: ~84 KB</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">

          {/* File List */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Theme-এ কী কী আছে</h2>
            <div className="space-y-4">
              {files.map((group) => (
                <div key={group.label}>
                  <p className="text-xs font-bold text-orange-500 uppercase tracking-wide mb-1">{group.label}</p>
                  <ul className="space-y-0.5">
                    {group.items.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Install Steps */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">WordPress-এ Install করবেন কীভাবে</h2>
            <ol className="space-y-3">
              {steps.map((step, i) => (
                <li key={i} className="flex gap-3 text-sm text-gray-700">
                  <span className="flex-shrink-0 w-6 h-6 bg-orange-100 text-orange-600 rounded-full text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>

            <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-xs text-blue-700 font-semibold mb-1">Generator Pages-এর জন্য Template List:</p>
              <ul className="text-xs text-blue-600 space-y-0.5">
                <li>Addition → <code className="bg-blue-100 px-1 rounded">Generator - Addition</code></li>
                <li>Name Tracing → <code className="bg-blue-100 px-1 rounded">Generator - Name Tracing</code></li>
                <li>Alphabet → <code className="bg-blue-100 px-1 rounded">Generator - Alphabet Tracing</code></li>
                <li>About → <code className="bg-blue-100 px-1 rounded">About Page</code></li>
                <li>Contact → <code className="bg-blue-100 px-1 rounded">Contact Page</code></li>
                <li>Generators List → <code className="bg-blue-100 px-1 rounded">Generators Page</code></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Requirements */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
          <h3 className="font-bold text-amber-800 mb-2">Requirements</h3>
          <ul className="text-sm text-amber-700 space-y-1">
            <li>• WordPress 6.0 বা তার উপরে</li>
            <li>• PHP 7.4+ (8.x recommended)</li>
            <li>• WooCommerce plugin (shop features-এর জন্য, optional)</li>
          </ul>
        </div>

      </div>
    </div>
  );
}
