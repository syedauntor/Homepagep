import { BookOpen, Menu, X, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useCart } from '../contexts/CartContext';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { getCartCount } = useCart();
  const cartCount = getCartCount();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <BookOpen className="w-8 h-8 text-orange-500" />
            <span className="text-2xl font-bold text-gray-900">Print<span className="text-orange-500">&</span>Use</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-orange-500 transition">Home</Link>
            <Link to="/generators" className="text-gray-700 hover:text-orange-500 transition">Generators</Link>
            <Link to="/shop" className="text-gray-700 hover:text-orange-500 transition">Shop</Link>
            <Link to="/category" className="text-gray-700 hover:text-orange-500 transition">Blog</Link>
            <Link to="/about" className="text-gray-700 hover:text-orange-500 transition">About</Link>
            <Link to="/contact" className="text-gray-700 hover:text-orange-500 transition">Contact</Link>
            <Link to="/cart" className="relative text-gray-700 hover:text-orange-500 transition">
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-3">
            <Link
              to="/"
              className="block text-gray-700 hover:text-orange-500 transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/generators"
              className="block text-gray-700 hover:text-orange-500 transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Generators
            </Link>
            <Link
              to="/shop"
              className="block text-gray-700 hover:text-orange-500 transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Shop
            </Link>
            <Link
              to="/category"
              className="block text-gray-700 hover:text-orange-500 transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Blog
            </Link>
            <Link
              to="/about"
              className="block text-gray-700 hover:text-orange-500 transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              to="/contact"
              className="block text-gray-700 hover:text-orange-500 transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
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
