import { BookOpen, Phone, Mail, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <BookOpen className="w-8 h-8 text-orange-500" />
              <span className="text-2xl font-bold text-white">Print<span className="text-orange-500">&</span>Use</span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Award winning full-service, creative digital agency, collaborating with brands all over the world.
            </p>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-orange-500 transition">Home</Link></li>
              <li><Link to="/generators" className="hover:text-orange-500 transition">Generators</Link></li>
              <li><Link to="/blog" className="hover:text-orange-500 transition">Blog</Link></li>
              <li><Link to="/about" className="hover:text-orange-500 transition">About</Link></li>
              <li><Link to="/contact" className="hover:text-orange-500 transition">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg mb-4">Generator Categories</h3>
            <ul className="space-y-2">
              <li><Link to="/generators" className="hover:text-orange-500 transition">All Generators</Link></li>
              <li><Link to="/generators#math" className="hover:text-orange-500 transition">Math Generators</Link></li>
              <li><Link to="/generators#tracing" className="hover:text-orange-500 transition">Tracing Practice</Link></li>
              <li><Link to="/generators/alphabet-tracing" className="hover:text-orange-500 transition">Alphabet Tracing Generator</Link></li>
              <li><Link to="/generators#activities" className="hover:text-orange-500 transition">Activity Generators</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <Phone className="w-5 h-5 text-orange-500" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-5 h-5 text-orange-500" />
                <span>info@printanduse.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-orange-500" />
                <span>123 Education St, NY</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-center md:text-left">&copy; 2025 Print and Use. All rights reserved.</p>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-orange-500 transition">Privacy Policy</a>
            <a href="#" className="hover:text-orange-500 transition">Terms of Use</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
