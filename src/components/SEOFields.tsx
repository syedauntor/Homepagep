import React from 'react';

interface SEOFieldsProps {
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  slug: string;
  onSeoTitleChange: (value: string) => void;
  onSeoDescriptionChange: (value: string) => void;
  onSeoKeywordsChange: (value: string) => void;
  onSlugChange: (value: string) => void;
}

export const SEOFields: React.FC<SEOFieldsProps> = ({
  seoTitle,
  seoDescription,
  seoKeywords,
  slug,
  onSeoTitleChange,
  onSeoDescriptionChange,
  onSeoKeywordsChange,
  onSlugChange
}) => {
  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800">SEO Settings</h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          SEO Title
        </label>
        <input
          type="text"
          value={seoTitle}
          onChange={(e) => onSeoTitleChange(e.target.value)}
          placeholder="Custom title for search engines (leave blank to use post title)"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          maxLength={60}
        />
        <p className="text-xs text-gray-500 mt-1">
          {seoTitle.length}/60 characters (recommended length)
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          URL Slug
        </label>
        <input
          type="text"
          value={slug}
          onChange={(e) => onSlugChange(e.target.value)}
          placeholder="url-friendly-slug"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-gray-500 mt-1">
          SEO-friendly URL (lowercase, use hyphens)
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Meta Description
        </label>
        <textarea
          value={seoDescription}
          onChange={(e) => onSeoDescriptionChange(e.target.value)}
          placeholder="Brief description for search engine results"
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          maxLength={160}
        />
        <p className="text-xs text-gray-500 mt-1">
          {seoDescription.length}/160 characters (recommended length)
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Meta Keywords
        </label>
        <input
          type="text"
          value={seoKeywords}
          onChange={(e) => onSeoKeywordsChange(e.target.value)}
          placeholder="keyword1, keyword2, keyword3"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-gray-500 mt-1">
          Separate keywords with commas
        </p>
      </div>
    </div>
  );
};
