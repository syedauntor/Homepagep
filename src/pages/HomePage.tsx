import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Calendar, Eye, ArrowRight, Sparkles, Palette, GraduationCap, Download, Facebook, Instagram, Linkedin, Grid3x3, Gift, TrendingUp, Mail } from 'lucide-react';
import { supabase, BlogPost } from '../lib/supabase';

export function HomePage() {
  const [popularPosts, setPopularPosts] = useState<BlogPost[]>([]);
  const [latestPosts, setLatestPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      const { data: allPosts, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (allPosts) {
        const sorted = [...allPosts].sort((a, b) => b.views - a.views);
        setPopularPosts(sorted.slice(0, 8));
        setLatestPosts(allPosts.slice(0, 8));
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  const categories = [
    { name: 'Coloring Pages', icon: Palette, color: 'from-pink-400 to-pink-300', link: '/generators' },
    { name: 'Activity Books', icon: BookOpen, color: 'from-amber-400 to-yellow-300', link: '/generators' },
    { name: 'Education', icon: GraduationCap, color: 'from-cyan-400 to-blue-300', link: '/generators' },
    { name: 'Worksheets', icon: Download, color: 'from-lime-400 to-yellow-300', link: '/generators' },
  ];

  const team = [
    { name: 'Sarah Johnson', role: 'Graphic Designer', color: 'from-orange-400 to-orange-300' },
    { name: 'Michael Chen', role: 'Content Creator', color: 'from-blue-400 to-blue-300' },
    { name: 'Emily Davis', role: 'Education Specialist', color: 'from-green-400 to-green-300' },
  ];

  const features = [
    {
      icon: GraduationCap,
      title: 'Created by Educators',
      description: 'Our resources are developed by experienced teachers and early childhood specialists, ensuring they\'re aligned with educational standards and promote essential skills.',
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50'
    },
    {
      icon: Palette,
      title: 'Variety for Every Learner',
      description: 'Discover a diverse collection of resources catering to different learning styles, subjects, and age groups. From colorful coloring pages to challenging puzzles and brain-teasing word games.',
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Download,
      title: 'Free and Accessible',
      description: 'We believe all children deserve a chance to learn, regardless of background. That\'s why we offer our resources completely free of charge, making them accessible to everyone.',
      color: 'bg-green-500',
      bgColor: 'bg-green-50'
    },
  ];

  const exploreCategories = [
    {
      name: 'Coloring Pages',
      icon: Palette,
      description: 'Beautiful coloring pages for all ages',
      posts: '250+ Posts',
      color: 'bg-red-500',
      link: '/blog?category=Coloring+Pages'
    },
    {
      name: 'Activity Books',
      icon: BookOpen,
      description: 'Complete activity books to download',
      posts: '180+ Posts',
      color: 'bg-orange-500',
      link: '/blog?category=Activity+Books'
    },
    {
      name: 'Puzzles & Games',
      icon: Grid3x3,
      description: 'Fun puzzles and brain teasers',
      posts: '150+ Posts',
      color: 'bg-blue-500',
      link: '/blog?category=Puzzles'
    },
    {
      name: 'Educational Resources',
      icon: GraduationCap,
      description: 'Learning materials for students',
      posts: '200+ Posts',
      color: 'bg-green-500',
      link: '/blog?category=Education'
    },
    {
      name: 'Seasonal & Holidays',
      icon: Gift,
      description: 'Holiday-themed activities',
      posts: '120+ Posts',
      color: 'bg-pink-500',
      link: '/blog?category=Holidays'
    },
    {
      name: 'Trending Now',
      icon: TrendingUp,
      description: 'Most popular this month',
      posts: '85+ Posts',
      color: 'bg-amber-500',
      link: '/blog'
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm mb-6">
                <Sparkles className="w-5 h-5 text-orange-500" />
                <span className="text-gray-700 font-medium">Spark Creativity & Fun</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Free Downloadable <span className="text-orange-500">Activity Books</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Welcome to our website where you can download tons of free printable activity books, coloring pages, puzzles, and more for kids and adults!
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/blog"
                  className="bg-orange-500 text-white px-8 py-4 rounded-lg font-semibold hover:bg-orange-600 transition shadow-lg inline-flex items-center space-x-2"
                >
                  <span>Explore Resources</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/generators"
                  className="bg-white text-orange-500 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition border-2 border-orange-500 inline-flex items-center space-x-2"
                >
                  <span>View Generators</span>
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {categories.map((category) => (
                <Link
                  key={category.name}
                  to={category.link}
                  className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition group"
                >
                  <div className={`w-20 h-20 bg-gradient-to-br ${category.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition`}>
                    <category.icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">{category.name}</h3>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-orange-500 font-semibold text-sm uppercase tracking-wide mb-4">ABOUT US</p>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Your Trusted Partner in Engaging Education</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We believe that every child deserves access to fun, engaging, and effective learning resources.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className={`${feature.bgColor} rounded-3xl p-8 hover:shadow-xl transition`}>
                <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mb-6`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {loading ? (
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      ) : (
        <>
          <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <p className="text-orange-500 font-semibold text-sm uppercase tracking-wide mb-4">FRESH CONTENT</p>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Latest Blog Posts</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Discover our newest resources and creative ideas for learning and fun
                </p>
              </div>

              {latestPosts.length > 0 && (
                <>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {latestPosts.map((post) => (
                      <Link
                        key={post.id}
                        to={`/blog/${post.id}`}
                        className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-2xl transition"
                      >
                        <div className="h-48 overflow-hidden relative">
                          {post.image_url ? (
                            <img
                              src={post.image_url}
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                            />
                          ) : (
                            <div className="h-full bg-gradient-to-br from-orange-200 to-amber-300 flex items-center justify-center">
                              <BookOpen className="w-12 h-12 text-white opacity-50" />
                            </div>
                          )}
                        </div>
                        <div className="p-6">
                          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(post.created_at)}</span>
                            </div>
                            <div className="flex items-center gap-1 text-orange-500 font-semibold">
                              <Eye className="w-4 h-4" />
                              <span>{post.views.toLocaleString()}</span>
                            </div>
                          </div>
                          <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-orange-500 transition line-clamp-2">
                            {post.title}
                          </h3>
                          <p className="text-gray-600 text-sm line-clamp-2 mb-4">{post.excerpt}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">By {post.author}</span>
                            <span className="text-orange-500 font-semibold flex items-center space-x-1 text-sm">
                              <span>Read</span>
                              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>

                  <div className="text-center">
                    <Link
                      to="/blog"
                      className="inline-flex items-center space-x-2 bg-orange-500 text-white px-8 py-4 rounded-lg font-semibold hover:bg-orange-600 transition shadow-lg"
                    >
                      <span>View All Posts</span>
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                </>
              )}
            </div>
          </section>

          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <p className="text-orange-500 font-semibold text-sm uppercase tracking-wide mb-4">OUR TEAM</p>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Meet Our Amazing Team</h2>
              <p className="text-xl text-gray-600 mb-16 max-w-3xl mx-auto">
                Passionate educators and designers creating amazing resources
              </p>

              <div className="grid md:grid-cols-3 gap-8">
                {team.map((member) => (
                  <div key={member.name} className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition">
                    <div className={`w-32 h-32 bg-gradient-to-br ${member.color} rounded-full mx-auto mb-6`}></div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{member.name}</h3>
                    <p className="text-gray-600 mb-6">{member.role}</p>
                    <div className="flex justify-center space-x-4">
                      <button className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-orange-500 hover:text-white transition">
                        <Facebook className="w-5 h-5" />
                      </button>
                      <button className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-orange-500 hover:text-white transition">
                        <Instagram className="w-5 h-5" />
                      </button>
                      <button className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-orange-500 hover:text-white transition">
                        <Linkedin className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <p className="text-orange-500 font-semibold text-sm uppercase tracking-wide mb-4">MOST POPULAR</p>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Explore Our Most Read Blog Posts</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Dive into our most engaging and helpful content
                </p>
              </div>

              {popularPosts.length > 0 && (
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                  {popularPosts.map((post) => (
                    <Link
                      key={post.id}
                      to={`/blog/${post.id}`}
                      className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-2xl transition"
                    >
                      <div className="h-48 overflow-hidden relative">
                        {post.image_url ? (
                          <img
                            src={post.image_url}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                          />
                        ) : (
                          <div className="h-full bg-gradient-to-br from-orange-200 to-amber-300 flex items-center justify-center">
                            <BookOpen className="w-12 h-12 text-white opacity-50" />
                          </div>
                        )}
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(post.created_at)}</span>
                          </div>
                          <div className="flex items-center gap-1 text-orange-500 font-semibold">
                            <Eye className="w-4 h-4" />
                            <span>{post.views.toLocaleString()}</span>
                          </div>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-orange-500 transition line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-2 mb-4">{post.excerpt}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">By {post.author}</span>
                          <span className="text-orange-500 font-semibold flex items-center space-x-1 text-sm">
                            <span>Read</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </section>
        </>
      )}

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-orange-500 font-semibold text-sm uppercase tracking-wide mb-4">EXPLORE BY CATEGORY</p>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Popular Blog Categories</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Find exactly what you're looking for in our organized collections
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exploreCategories.map((category) => (
              <Link
                key={category.name}
                to={category.link}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition group border border-gray-100"
              >
                <div className={`w-16 h-16 ${category.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition`}>
                  <category.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-orange-500 transition">{category.name}</h3>
                <p className="text-gray-600 mb-4">{category.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-orange-500 font-semibold">{category.posts}</span>
                  <ArrowRight className="w-5 h-5 text-orange-500 group-hover:translate-x-1 transition" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-orange-500 to-amber-500 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Subscribe for Daily Updates</h2>
          <p className="text-xl text-orange-50 mb-8">
            Get the latest activity books and resources delivered to your inbox
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-6 py-4 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="bg-white text-orange-500 px-8 py-4 rounded-lg font-semibold hover:bg-orange-50 transition inline-flex items-center justify-center space-x-2">
              <span>Subscribe</span>
              <Mail className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
