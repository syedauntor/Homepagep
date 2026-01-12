import { FileText, Sparkles, PuzzleIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

export function GeneratorsPage() {
  const generators = {
    mathGenerator: [
      { name: 'Addition Worksheet Generator', slug: 'addition' },
      { name: 'Subtraction Worksheet Generator', slug: 'subtraction' },
      { name: 'Multiplication Worksheet Generator', slug: 'multiplication' },
      { name: 'Division Worksheet Generator', slug: 'division' },
    ],
    tracingPractice: [
      { name: 'Telling Time Worksheet Generator', slug: 'telling-time' },
      { name: 'Picture Coloring and Tracing Worksheet', slug: 'picture-tracing' },
      { name: 'Sentence Tracing Practice Worksheet', slug: 'sentence-tracing' },
      { name: 'Word Tracing Practice Worksheet Maker', slug: 'word-tracing' },
      { name: 'Name Tracing Worksheets', slug: 'name-tracing' },
    ],
    activityGenerator: [
      { name: 'Crossword Puzzle Generator', slug: 'crossword' },
      { name: 'Sudoku Worksheet Generator', slug: 'sudoku' },
      { name: 'Cryptogram Generator', slug: 'cryptogram' },
      { name: 'Matching Lists Generator', slug: 'matching-lists' },
      { name: 'Word Scramble Generator', slug: 'word-scramble' },
      { name: 'Word Search With Images Generator', slug: 'word-search-images', featured: true },
      { name: 'Matching Lists With Images Generator', slug: 'matching-lists-images', featured: true },
      { name: 'Tartan Maker', slug: 'tartan-maker' },
      { name: 'Maze Generator', slug: 'maze' },
      { name: 'Word Search Generator', slug: 'word-search' },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Worksheet Generators
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Create custom worksheets, activities, and educational materials in seconds.
            All generators are free to use and create print-ready PDFs.
          </p>
        </div>

        <div className="space-y-16">
          <section>
            <div className="flex items-center space-x-3 mb-8">
              <FileText className="w-8 h-8 text-orange-500" />
              <h2 className="text-3xl font-bold text-gray-900">Math Generators</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {generators.mathGenerator.map((generator) => (
                <Link
                  key={generator.slug}
                  to={`/generator/${generator.slug}`}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border-2 border-transparent hover:border-orange-500 group"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-500 transition">
                    {generator.name}
                  </h3>
                  <p className="text-gray-600">
                    Create custom math worksheets with various difficulty levels
                  </p>
                </Link>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center space-x-3 mb-8">
              <Sparkles className="w-8 h-8 text-orange-500" />
              <h2 className="text-3xl font-bold text-gray-900">Tracing Practice</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {generators.tracingPractice.map((generator) => (
                <Link
                  key={generator.slug}
                  to={`/generator/${generator.slug}`}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border-2 border-transparent hover:border-orange-500 group"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-500 transition">
                    {generator.name}
                  </h3>
                  <p className="text-gray-600">
                    Help students practice writing and tracing skills
                  </p>
                </Link>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center space-x-3 mb-8">
              <PuzzleIcon className="w-8 h-8 text-orange-500" />
              <h2 className="text-3xl font-bold text-gray-900">Activity Generators</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {generators.activityGenerator.map((generator) => (
                <Link
                  key={generator.slug}
                  to={`/generator/${generator.slug}`}
                  className={`bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border-2 border-transparent hover:border-orange-500 group relative ${
                    generator.featured ? 'ring-2 ring-green-500' : ''
                  }`}
                >
                  {generator.featured && (
                    <span className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      Featured
                    </span>
                  )}
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-500 transition">
                    {generator.name}
                  </h3>
                  <p className="text-gray-600">
                    Create engaging puzzles and activities for students
                  </p>
                </Link>
              ))}
            </div>
          </section>
        </div>

        <div className="mt-16 bg-orange-100 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            More Generators Coming Soon!
          </h3>
          <p className="text-gray-700 text-lg">
            We're constantly adding new generators to help you create amazing educational materials.
            Check back often for updates!
          </p>
        </div>
      </div>
    </div>
  );
}
