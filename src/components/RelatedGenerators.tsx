import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

interface Generator {
  name: string;
  slug: string;
  description?: string;
}

interface RelatedGeneratorsProps {
  title?: string;
  generators: Generator[];
  currentSlug?: string;
}

export function RelatedGenerators({
  title = "More Tracing Practice Generators",
  generators,
  currentSlug
}: RelatedGeneratorsProps) {
  const filteredGenerators = currentSlug
    ? generators.filter(gen => gen.slug !== currentSlug)
    : generators;

  if (filteredGenerators.length === 0) return null;

  return (
    <div className="mt-16 border-t border-gray-200 pt-12">
      <div className="flex items-center space-x-3 mb-8">
        <Sparkles className="w-8 h-8 text-pink-600" />
        <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGenerators.map((generator) => (
          <Link
            key={generator.slug}
            to={`/generator/${generator.slug}`}
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border-2 border-transparent hover:border-pink-500 group"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-pink-500 transition">
              {generator.name}
            </h3>
            <p className="text-gray-600">
              {generator.description || 'Help students practice writing and tracing skills'}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
