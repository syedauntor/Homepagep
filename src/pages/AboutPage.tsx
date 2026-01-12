import { Users, Target, Heart, Award, Facebook, Instagram, Linkedin, Sparkles, GraduationCap, Palette, Download } from 'lucide-react';

export function AboutPage() {
  const teamMembers = [
    {
      name: "Sarah Johnson",
      role: "Graphic Designer & Co-Founder",
      gradient: "from-pink-400 to-rose-500",
      bio: "With over 10 years of design experience, Sarah brings creativity and passion to every resource we create."
    },
    {
      name: "Michael Chen",
      role: "Content Creator & Educator",
      gradient: "from-rose-400 to-purple-500",
      bio: "Former elementary school teacher with 15 years of classroom experience, Michael ensures educational quality."
    },
    {
      name: "Emily Rodriguez",
      role: "Education Specialist",
      gradient: "from-purple-400 to-pink-500",
      bio: "Child development expert with a PhD in Early Childhood Education, Emily guides our curriculum development."
    }
  ];

  const stats = [
    { number: "1.5M+", label: "Happy Users", icon: Users },
    { number: "5,000+", label: "Free Resources", icon: Download },
    { number: "150+", label: "Countries Reached", icon: Target },
    { number: "98%", label: "Satisfaction Rate", icon: Heart }
  ];

  const values = [
    {
      icon: GraduationCap,
      title: "Educational Excellence",
      description: "Every resource is crafted by educators and aligned with learning standards to ensure quality and effectiveness.",
      gradient: "from-pink-500 to-rose-500"
    },
    {
      icon: Heart,
      title: "Accessibility for All",
      description: "We believe education should be free and accessible to everyone, regardless of background or circumstances.",
      gradient: "from-rose-500 to-purple-500"
    },
    {
      icon: Palette,
      title: "Creative Innovation",
      description: "We combine creativity with pedagogy to make learning fun, engaging, and memorable for all ages.",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: Sparkles,
      title: "Community Driven",
      description: "We listen to feedback from parents, teachers, and learners to continuously improve our offerings.",
      gradient: "from-purple-500 to-pink-500"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">About Print & Use</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We're on a mission to make quality educational resources accessible to everyone, everywhere.
            Since 2018, we've been creating free, printable activity books and learning materials that
            spark creativity and foster learning.
          </p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-100 rounded-full mb-4">
                    <IconComponent className="w-8 h-8 text-pink-600" />
                  </div>
                  <div className="text-4xl font-bold text-gray-900 mb-2">{stat.number}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-pink-600 font-semibold text-sm tracking-wider uppercase">Our Story</span>
              <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-6">How It All Started</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Print & Use was born from a simple observation: quality educational resources were often
                  expensive and inaccessible to many families and educators who needed them most.
                </p>
                <p>
                  As former teachers and parents ourselves, we understood the challenge of finding engaging,
                  well-designed learning materials that didn't break the bank. So in 2018, we decided to do
                  something about it.
                </p>
                <p>
                  What started as a small collection of coloring pages has grown into a comprehensive library
                  of thousands of resources used by millions of families and educators worldwide. But our
                  mission remains the same: to make learning accessible, engaging, and fun for everyone.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-pink-200 to-rose-300 rounded-2xl aspect-square"></div>
                  <div className="bg-gradient-to-br from-rose-200 to-purple-300 rounded-2xl aspect-[4/3]"></div>
                </div>
                <div className="space-y-4 mt-8">
                  <div className="bg-gradient-to-br from-blue-200 to-cyan-300 rounded-2xl aspect-[4/3]"></div>
                  <div className="bg-gradient-to-br from-purple-200 to-pink-300 rounded-2xl aspect-square"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-pink-600 font-semibold text-sm tracking-wider uppercase">Our Values</span>
            <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-4">What Drives Us</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our core values guide everything we do, from resource creation to community engagement
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <div key={index} className="bg-gray-50 p-8 rounded-2xl hover:shadow-xl transition">
                  <div className={`w-14 h-14 bg-gradient-to-br ${value.gradient} rounded-xl flex items-center justify-center mb-6`}>
                    <IconComponent className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-pink-600 font-semibold text-sm tracking-wider uppercase">Our Team</span>
            <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-4">Meet the People Behind Print & Use</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Passionate educators, designers, and creators dedicated to making learning accessible
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-2xl transition group">
                <div className={`w-32 h-32 mx-auto rounded-full bg-gradient-to-br ${member.gradient} mb-6 group-hover:scale-110 transition`}></div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-pink-600 font-semibold mb-4">{member.role}</p>
                <p className="text-gray-600 mb-6 leading-relaxed">{member.bio}</p>
                <div className="flex justify-center space-x-4">
                  <button className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-pink-600 hover:text-white transition">
                    <Facebook className="w-5 h-5" />
                  </button>
                  <button className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-pink-600 hover:text-white transition">
                    <Instagram className="w-5 h-5" />
                  </button>
                  <button className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-pink-600 hover:text-white transition">
                    <Linkedin className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-pink-600 to-rose-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <Award className="w-16 h-16 text-white mx-auto mb-6" />
          <h2 className="text-4xl font-bold text-white mb-6">Join Our Community</h2>
          <p className="text-xl text-pink-50 mb-8 leading-relaxed">
            Be part of our growing community of educators, parents, and learners.
            Together, we're making education accessible and fun for everyone.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-pink-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition shadow-lg">
              Start Exploring
            </button>
            <button className="bg-pink-700 text-white px-8 py-4 rounded-lg font-semibold hover:bg-pink-800 transition border-2 border-white">
              Contact Us
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
