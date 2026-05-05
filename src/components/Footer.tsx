import { BookOpen, Phone, Mail, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { menuApi, MenuItem } from '../lib/api';

function FooterLink({ item }: { item: MenuItem }) {
  const isExternal = item.url.startsWith('http');
  if (isExternal) {
    return <a href={item.url} target={item.target} rel="noopener noreferrer" className="hover:text-orange-500 transition">{item.label}</a>;
  }
  return <Link to={item.url} className="hover:text-orange-500 transition">{item.label}</Link>;
}

const FALLBACK_QUICK: MenuItem[] = [
  { id: '1', label: 'Home', url: '/', target: '_self', display_order: 1 },
  { id: '2', label: 'Generators', url: '/generators', target: '_self', display_order: 2 },
  { id: '3', label: 'Blog', url: '/blog', target: '_self', display_order: 3 },
  { id: '4', label: 'About', url: '/about', target: '_self', display_order: 4 },
  { id: '5', label: 'Contact', url: '/contact', target: '_self', display_order: 5 },
];

const FALLBACK_CATS: MenuItem[] = [
  { id: '1', label: 'All Generators', url: '/generators', target: '_self', display_order: 1 },
  { id: '2', label: 'Math Generators', url: '/generators#math', target: '_self', display_order: 2 },
  { id: '3', label: 'Tracing Practice', url: '/generators#tracing', target: '_self', display_order: 3 },
  { id: '4', label: 'Activity Generators', url: '/generators#activities', target: '_self', display_order: 4 },
];

export function Footer() {
  const [quickLinks, setQuickLinks] = useState<MenuItem[]>([]);
  const [catLinks, setCatLinks] = useState<MenuItem[]>([]);

  useEffect(() => {
    menuApi.list({ is_active: true }).then(data => {
      if (data) {
        setQuickLinks(data.filter(i => i.menu_location === 'footer_quick_links'));
        setCatLinks(data.filter(i => i.menu_location === 'footer_categories'));
      }
    }).catch(() => {});
  }, []);

  const quick = quickLinks.length > 0 ? quickLinks : FALLBACK_QUICK;
  const cats = catLinks.length > 0 ? catLinks : FALLBACK_CATS;

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
              {quick.map(item => (
                <li key={item.id}><FooterLink item={item} /></li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg mb-4">Generator Categories</h3>
            <ul className="space-y-2">
              {cats.map(item => (
                <li key={item.id}><FooterLink item={item} /></li>
              ))}
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
            <Link to="/privacy-policy" className="hover:text-orange-500 transition">Privacy Policy</Link>
            <Link to="/terms-of-use" className="hover:text-orange-500 transition">Terms of Use</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
