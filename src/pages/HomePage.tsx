import { Link } from 'react-router-dom';
import { BookOpen, Printer, Download, Sparkles } from 'lucide-react';

export function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Welcome to Print & Use
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
            Create beautiful, educational worksheets and activity books for free.
            Perfect for teachers, parents, and educators.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/generators"
              className="bg-orange-500 text-white px-8 py-4 rounded-lg font-semibold hover:bg-orange-600 transition shadow-lg inline-flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-5 h-5" />
              <span>Start Creating</span>
            </Link>
            <Link
              to="/blog"
              className="bg-white text-orange-500 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition border-2 border-orange-500 inline-flex items-center justify-center space-x-2"
            >
              <BookOpen className="w-5 h-5" />
              <span>Browse Blog</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Features</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to create amazing educational materials
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-8 rounded-2xl hover:shadow-xl transition">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center mb-6">
                <Printer className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Easy to Print</h3>
              <p className="text-gray-600 leading-relaxed">
                All worksheets are optimized for printing on standard letter-size paper.
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-2xl hover:shadow-xl transition">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-6">
                <Download className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Download Instantly</h3>
              <p className="text-gray-600 leading-relaxed">
                Generate and download your custom worksheets instantly, no sign-up required.
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-2xl hover:shadow-xl transition">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-6">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Customizable</h3>
              <p className="text-gray-600 leading-relaxed">
                Choose from various themes, difficulty levels, and layouts to match your needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-orange-500 to-amber-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-orange-50 mb-8 leading-relaxed">
            Start creating beautiful worksheets in minutes. No account needed.
          </p>
          <Link
            to="/generators"
            className="bg-white text-orange-500 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition shadow-lg inline-block"
          >
            Create Your First Worksheet
          </Link>
        </div>
      </section>
    </div>
  );
}
