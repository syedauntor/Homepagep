import { Users, Sparkles, GraduationCap, Palette, Download, ArrowRight, Mail, BookOpen, Grid, Gift, TrendingUp, Clock, Eye, Calendar, Facebook, Instagram, Linkedin } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase, BlogPost } from '../lib/supabase';

export function HomePage() {
  const [latestPosts, setLatestPosts] = useState<BlogPost[]>([]);
  const [popularPosts, setPopularPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  async function fetchBlogPosts() {
    try {
      const { data: latest } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(4);

      const { data: popular } = await supabase
        .from('blog_posts')
        .select('*')
        .order('views', { ascending: false })
        .limit(3);

      if (latest) setLatestPosts(latest);
      if (popular) setPopularPosts(popular);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    } finally {
      setLoading(false);
    }
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  return (
    <div>
      <section className="relative bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-400 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm mb-6">
                <Sparkles className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium text-gray-700">Spark Creativity & Fun</span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Free Downloadable <span className="text-emerald-600">Activity Books</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Welcome to our website where you can download tons of free printable activity books, coloring pages, puzzles, and more for kids and adults!
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-emerald-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-emerald-700 transition shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 group">
                  <span>Explore Resources</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
                </button>
                <button className="bg-white text-emerald-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition shadow-md border-2 border-emerald-600">
                  View Generators
                </button>
              </div>
              <div className="mt-12 flex items-center space-x-3">
                <div className="flex -space-x-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 border-2 border-white"></div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 border-2 border-white"></div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 border-2 border-white"></div>
                </div>
                <div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-5 h-5 text-emerald-600" />
                    <span className="font-bold text-2xl text-gray-900">1.5M+</span>
                  </div>
                  <p className="text-sm text-gray-600">Happy Users</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="bg-white rounded-2xl shadow-xl p-4 transform hover:scale-105 transition">
                    <div className="aspect-[3/4] bg-gradient-to-br from-pink-200 to-rose-300 rounded-xl flex items-center justify-center">
                      <Palette className="w-16 h-16 text-white" />
                    </div>
                    <p className="text-sm font-semibold text-gray-900 mt-3">Coloring Pages</p>
                  </div>
                  <div className="bg-white rounded-2xl shadow-xl p-4 transform hover:scale-105 transition">
                    <div className="aspect-[3/4] bg-gradient-to-br from-blue-200 to-cyan-300 rounded-xl flex items-center justify-center">
                      <GraduationCap className="w-16 h-16 text-white" />
                    </div>
                    <p className="text-sm font-semibold text-gray-900 mt-3">Learning Activities</p>
                  </div>
                </div>
                <div className="space-y-4 mt-8">
                  <div className="bg-white rounded-2xl shadow-xl p-4 transform hover:scale-105 transition">
                    <div className="aspect-[3/4] bg-gradient-to-br from-amber-200 to-orange-300 rounded-xl flex items-center justify-center">
                      <BookOpen className="w-16 h-16 text-white" />
                    </div>
                    <p className="text-sm font-semibold text-gray-900 mt-3">Activity Books</p>
                  </div>
                  <div className="bg-white rounded-2xl shadow-xl p-4 transform hover:scale-105 transition">
                    <div className="aspect-[3/4] bg-gradient-to-br from-yellow-200 to-amber-300 rounded-xl flex items-center justify-center">
                      <Sparkles className="w-16 h-16 text-white" />
                    </div>
                    <p className="text-sm font-semibold text-gray-900 mt-3">Puzzles & Games</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Your Trusted Partner in Engaging Education</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We believe that every child deserves access to fun, engaging, and effective learning resources.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-8 rounded-2xl hover:shadow-xl transition group">
              <div className="w-16 h-16 bg-emerald-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Created by Educators</h3>
              <p className="text-gray-600 leading-relaxed">
                Our resources are developed by experienced teachers and early childhood specialists, ensuring they're aligned with educational standards and promote essential skills.
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-8 rounded-2xl hover:shadow-xl transition group">
              <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
                <Palette className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Variety for Every Learner</h3>
              <p className="text-gray-600 leading-relaxed">
                Discover a diverse collection of resources catering to different learning styles, subjects, and age groups. From colorful coloring pages to challenging puzzles and brain-teasing word games.
              </p>
            </div>

            <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-8 rounded-2xl hover:shadow-xl transition group">
              <div className="w-16 h-16 bg-rose-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
                <Download className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Free and Accessible</h3>
              <p className="text-gray-600 leading-relaxed">
                We believe all children deserve a chance to learn, regardless of background. That's why we offer our resources completely free of charge, making them accessible to everyone.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-emerald-600 font-semibold text-sm tracking-wider uppercase">Fresh Content</span>
            <h2 className="text-4xl font-bold text-gray-900 mb-4 mt-2">Latest Blog Posts</h2>
            <p className="text-xl text-gray-600">
              Discover our newest resources and creative ideas for learning and fun
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {latestPosts.map((post) => (
                <Link key={post.id} to={`/blog/${post.id}`} className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-2xl transition">
                  <div className="h-48 overflow-hidden">
                    {post.image_url ? (
                      <img
                        src={post.image_url}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                      />
                    ) : (
                      <div className="h-full bg-gradient-to-br from-emerald-200 to-teal-300 flex items-center justify-center">
                        <BookOpen className="w-12 h-12 text-white opacity-50" />
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{formatDate(post.created_at)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Eye className="w-3 h-3" />
                        <span>{post.views}</span>
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{post.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">By {post.author}</span>
                      <span className="text-emerald-600 font-semibold text-sm flex items-center space-x-1 group-hover:space-x-2 transition-all">
                        <span>Read</span>
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/blog" className="bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition shadow-lg inline-flex items-center space-x-2">
              <span>View All Posts</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Amazing Team</h2>
            <p className="text-xl text-gray-600">Passionate educators and designers creating amazing resources</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Sarah Johnson", role: "Graphic Designer", gradient: "from-emerald-400 to-teal-500" },
              { name: "Michael Chen", role: "Content Creator", gradient: "from-blue-400 to-cyan-500" },
              { name: "Emily Davis", role: "Education Specialist", gradient: "from-pink-400 to-rose-500" }
            ].map((member, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-2xl transition group">
                <div className={`w-32 h-32 mx-auto rounded-full bg-gradient-to-br ${member.gradient} mb-6 group-hover:scale-110 transition`}></div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-gray-600 mb-6">{member.role}</p>
                <div className="flex justify-center space-x-4">
                  <button className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-emerald-600 hover:text-white transition group">
                    <Facebook className="w-5 h-5" />
                  </button>
                  <button className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-emerald-600 hover:text-white transition">
                    <Instagram className="w-5 h-5" />
                  </button>
                  <button className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-emerald-600 hover:text-white transition">
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
            <span className="text-emerald-600 font-semibold text-sm tracking-wider uppercase">Most Popular</span>
            <h2 className="text-4xl font-bold text-gray-900 mb-4 mt-2">Explore Our Most Read Blog Posts</h2>
            <p className="text-xl text-gray-600">
              Challenge your mind and have a blast with our most sought-after content.
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {popularPosts.map((post, index) => (
                <Link key={post.id} to={`/blog/${post.id}`} className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-2xl transition relative">
                  <div className="absolute top-4 left-4 z-10">
                    <div className="bg-emerald-600 text-white px-3 py-1 rounded-full flex items-center space-x-1 shadow-lg">
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-sm font-bold">#{index + 1}</span>
                    </div>
                  </div>
                  <div className="h-56 overflow-hidden">
                    {post.image_url ? (
                      <img
                        src={post.image_url}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                      />
                    ) : (
                      <div className="h-full bg-gradient-to-br from-emerald-200 to-teal-300 flex items-center justify-center">
                        <BookOpen className="w-16 h-16 text-white opacity-50" />
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(post.created_at)}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-emerald-600 font-semibold">
                        <Eye className="w-4 h-4" />
                        <span>{post.views.toLocaleString()} views</span>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-emerald-600 transition line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">By {post.author}</span>
                      <span className="text-emerald-600 font-semibold flex items-center space-x-2 group-hover:space-x-3 transition-all">
                        <span>Read More</span>
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-emerald-600 font-semibold text-sm tracking-wider uppercase">Explore by Category</span>
            <h2 className="text-4xl font-bold text-gray-900 mb-4 mt-2">Popular Blog Categories</h2>
            <p className="text-xl text-gray-600">
              Find exactly what you're looking for in our organized collections
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: "Coloring Pages",
                count: "250+ Posts",
                gradient: "from-pink-500 to-rose-500",
                icon: Palette,
                description: "Beautiful coloring pages for all ages"
              },
              {
                name: "Activity Books",
                count: "180+ Posts",
                gradient: "from-emerald-500 to-teal-500",
                icon: BookOpen,
                description: "Complete activity books to download"
              },
              {
                name: "Puzzles & Games",
                count: "150+ Posts",
                gradient: "from-blue-500 to-cyan-500",
                icon: Grid,
                description: "Fun puzzles and brain teasers"
              },
              {
                name: "Educational Resources",
                count: "200+ Posts",
                gradient: "from-amber-500 to-orange-500",
                icon: GraduationCap,
                description: "Learning materials for students"
              },
              {
                name: "Seasonal & Holidays",
                count: "120+ Posts",
                gradient: "from-orange-500 to-red-500",
                icon: Gift,
                description: "Holiday-themed activities"
              },
              {
                name: "Trending Now",
                count: "85+ Posts",
                gradient: "from-red-500 to-pink-500",
                icon: TrendingUp,
                description: "Most popular this month"
              }
            ].map((category, index) => {
              const IconComponent = category.icon;
              return (
                <div key={index} className="bg-white rounded-2xl p-6 hover:shadow-2xl transition group cursor-pointer relative overflow-hidden">
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${category.gradient} rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition`}></div>
                  <div className="relative">
                    <div className={`w-14 h-14 bg-gradient-to-br ${category.gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition`}>
                      <IconComponent className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{category.name}</h3>
                    <p className="text-gray-600 text-sm mb-3">{category.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-emerald-600 font-semibold text-sm">{category.count}</span>
                      <ArrowRight className="w-5 h-5 text-emerald-600 group-hover:translate-x-1 transition" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-emerald-600 to-teal-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <h2 className="text-4xl font-bold text-white mb-6">Subscribe for Daily Updates</h2>
          <p className="text-xl text-emerald-50 mb-8">Get the latest activity books and resources delivered to your inbox</p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-6 py-4 rounded-lg focus:outline-none focus:ring-4 focus:ring-emerald-300"
            />
            <button className="bg-white text-emerald-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition shadow-lg flex items-center justify-center space-x-2">
              <span>Subscribe</span>
              <Mail className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
