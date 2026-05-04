import { BookOpen, Menu, X, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import { supabase } from '../lib/supabase';

interface MenuItem {
  id: string;
  label: string;
  url: string;
  target: string;
  display_order: number;
  is_active: boolean;
}

// Internal links use React Router Link; external use <a>
function NavLink({ item, onClick }: { item: MenuItem; onClick?: () => void }) {
  const isExternal = item.url.startsWith('http');
  const cls = 'text-gray-700 hover:text-orange-500 transition';

  if (isExternal) {
    return (
      <a href={item.url} target={item.target} rel="noopener noreferrer" className={cls} onClick={onClick}>
        {item.label}
      </a>
    );
  }
  return (
    <Link to={item.url} className={cls} onClick={onClick}>
      {item.label}
    </Link>
  );
}

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { getCartCount } = useCart();
  const cartCount = getCartCount();
  const [navItems, setNavItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    supabase
      .from('menu_items')
      .select('id, label, url, target, display_order, is_active')
      .eq('menu_location', 'header')
      .eq('is_active', true)
      .order('display_order')
      .then(({ data }) => {
        if (data && data.length > 0) setNavItems(data);
      });
  }, []);

  // Fallback to hardcoded if DB not loaded yet
  const items: MenuItem[] = navItems.length > 0 ? navItems : [
    { id: '1', label: 'Home', url: '/', target: '_self', display_order: 1, is_active: true },
    { id: '2', label: 'Generators', url: '/generators', target: '_self', display_order: 2, is_active: true },
    { id: '3', label: 'Shop', url: '/shop', target: '_self', display_order: 3, is_active: true },
    { id: '4', label: 'Blog', url: '/blog', target: '_self', display_order: 4, is_active: true },
    { id: '5', label: 'About', url: '/about', target: '_self', display_order: 5, is_active: true },
    { id: '6', label: 'Contact', url: '/contact', target: '_self', display_order: 6, is_active: true },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <BookOpen className="w-8 h-8 text-orange-500" />
            <span className="text-2xl font-bold text-gray-900">Print<span className="text-orange-500">&</span>Use</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {items.map(item => (
              <NavLink key={item.id} item={item} />
            ))}
            <Link to="/cart" className="relative text-gray-700 hover:text-orange-500 transition">
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-6 h-6 text-gray-700" /> : <Menu className="w-6 h-6 text-gray-700" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-3 border-t border-gray-100 pt-4">
            {items.map(item => (
              <div key={item.id} className="block">
                <NavLink item={item} onClick={() => setMobileMenuOpen(false)} />
              </div>
            ))}
            <Link
              to="/cart"
              className="flex items-center gap-2 text-gray-700 hover:text-orange-500 transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              <ShoppingCart className="w-5 h-5" />
              Cart {cartCount > 0 && `(${cartCount})`}
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
