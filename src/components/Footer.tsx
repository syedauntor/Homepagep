import { BookOpen, Phone, Mail, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <BookOpen className="w-8 h-8 text-pink-500" />
              <span className="text-2xl font-bold text-white">Print<span className="text-pink-500">&</span>Use</span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Award winning full-service, creative digital agency, collaborating with brands all over the world.
            </p>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-pink-500 transition">Home</Link></li>
              <li><Link to="/category" className="hover:text-pink-500 transition">Blog</Link></li>
              <li><Link to="/about" className="hover:text-pink-500 transition">About</Link></li>
              <li><Link to="/contact" className="hover:text-pink-500 transition">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg mb-4">Services</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-pink-500 transition">Coloring Pages</a></li>
              <li><a href="#" className="hover:text-pink-500 transition">Activity Books</a></li>
              <li><a href="#" className="hover:text-pink-500 transition">Puzzles</a></li>
              <li><a href="#" className="hover:text-pink-500 transition">Generators</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <Phone className="w-5 h-5 text-pink-500" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-5 h-5 text-pink-500" />
                <span>info@printanduse.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-pink-500" />
                <span>123 Education St, NY</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400">&copy; 2025 Print and Use. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-pink-500 transition">Privacy Policy</a>
            <a href="#" className="hover:text-pink-500 transition">Terms of Use</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
