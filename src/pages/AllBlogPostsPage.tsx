import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, Eye, ArrowRight, BookOpen, TrendingUp, Clock, ChevronDown } from 'lucide-react';
import { blogApi, categoriesApi, BlogPost, Category } from '../lib/api';

export function AllBlogPostsPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'latest' | 'popular'>('latest');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    fetchCategories();
    fetchPosts();
  }, []);

  useEffect(() => {
    filterAndSortPosts();
  }, [posts, searchTerm, sortBy, selectedCategory]);

  async function fetchCategories() {
    categoriesApi.list().then(setCategories).catch(() => {});
  }

  async function fetchPosts() {
    try {
      const data = await blogApi.list({ status: 'published' });
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  }

  function filterAndSortPosts() {
    let result = [...posts];

    if (selectedCategory) {
      result = result.filter((post) => post.category_id === selectedCategory);
    }

    if (searchTerm) {
      result = result.filter(
        (post) =>
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sortBy === 'latest') {
      result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else {
      result.sort((a, b) => b.views - a.views);
    }

    setFilteredPosts(result);
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 text-center">Our Blog</h1>
          <p className="text-base md:text-lg text-gray-600 text-center max-w-3xl mx-auto">
            Explore our collection of articles, tutorials, and resources for education and creativity
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="bg-white rounded-2xl shadow-lg px-5 py-4">
          <div className="flex flex-wrap gap-3 items-center">
            {/* Search — flex-1 grows to fill space */}
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search posts by title, content, or author..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
              />
            </div>

            {/* Sort + Category filters */}
            <div className="flex gap-2 items-center">
              <button
                onClick={() => setSortBy('latest')}
                className={`w-28 py-2.5 rounded-lg text-sm font-semibold transition flex items-center justify-center gap-1.5 ${
                  sortBy === 'latest'
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                Latest
              </button>
              <button
                onClick={() => setSortBy('popular')}
                className={`w-28 py-2.5 rounded-lg text-sm font-semibold transition flex items-center justify-center gap-1.5 ${
                  sortBy === 'popular'
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                Popular
              </button>

              {/* Category dropdown */}
              {categories.length > 0 && (
                <>
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setDropdownOpen((o) => !o)}
                      className={`w-28 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition border ${
                        selectedCategory
                          ? 'bg-gray-800 text-white border-gray-800'
                          : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
                      }`}
                    >
                      {selectedCategory
                        ? categories.find((c) => c.id === selectedCategory)?.name
                        : 'Category'}
                      <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {dropdownOpen && (
                      <div className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                        <button
                          onClick={() => { setSelectedCategory(null); setDropdownOpen(false); }}
                          className={`w-full text-left px-4 py-2 text-sm transition ${
                            selectedCategory === null
                              ? 'bg-orange-50 text-orange-600 font-semibold'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          All Categories
                        </button>
                        {categories.map((cat) => (
                          <button
                            key={cat.id}
                            onClick={() => { setSelectedCategory(cat.id); setDropdownOpen(false); }}
                            className={`w-full text-left px-4 py-2 text-sm transition ${
                              selectedCategory === cat.id
                                ? 'bg-orange-50 text-orange-600 font-semibold'
                                : 'text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            {cat.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No posts found</h3>
            <p className="text-gray-600">Try adjusting your search or filter</p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-gray-600 text-sm">
                Showing <span className="font-semibold text-gray-900">{filteredPosts.length}</span> {filteredPosts.length === 1 ? 'post' : 'posts'}
                {selectedCategory && categories.find(c => c.id === selectedCategory) && (
                  <> in <span className="font-semibold text-orange-500">{categories.find(c => c.id === selectedCategory)?.name}</span></>
                )}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filteredPosts.map((post) => {
                const thumb = (post as any).featured_image || post.image_url;
                const href = (post as any).slug ? `/blog/${(post as any).slug}` : `/blog/${post.id}`;
                return (
                  <Link
                    key={post.id}
                    to={href}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-2xl transition"
                  >
                    <div className="h-52 overflow-hidden relative">
                      {thumb ? (
                        <img
                          src={thumb}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                        />
                      ) : (
                        <div className="h-full bg-gradient-to-br from-orange-200 to-amber-300 flex items-center justify-center">
                          <BookOpen className="w-12 h-12 text-white opacity-50" />
                        </div>
                      )}
                      {(post as any).categories?.name && (
                        <span className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                          {(post as any).categories.name}
                        </span>
                      )}
                    </div>
                    <div className="p-5">
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>{formatDate(post.created_at)}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-orange-500 font-semibold">
                          <Eye className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>{post.views.toLocaleString()}</span>
                        </div>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-orange-500 transition line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{post.excerpt}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">By {post.author}</span>
                        <span className="text-orange-500 font-semibold flex items-center gap-1 text-sm">
                          Read
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
