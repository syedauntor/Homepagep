import { BookOpen, Menu, X, ShoppingCart, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useCart } from '../contexts/CartContext';
import { menuApi, MenuItem } from '../lib/api';

function NavAnchor({ url, target, className, onClick, children }: {
  url: string; target: string; className: string; onClick?: () => void; children: React.ReactNode;
}) {
  if (url.startsWith('http')) {
    return <a href={url} target={target} rel="noopener noreferrer" className={className} onClick={onClick}>{children}</a>;
  }
  return <Link to={url} className={className} onClick={onClick}>{children}</Link>;
}

function DropdownItem({ item, onClick }: { item: MenuItem; onClick?: () => void }) {
  return (
    <NavAnchor
      url={item.url}
      target={item.target}
      className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
      onClick={onClick}
    >
      {item.label}
    </NavAnchor>
  );
}

function NavItemWithDropdown({ item, children, mobileOpen, onMobileToggle, onLinkClick }: {
  item: MenuItem;
  children: MenuItem[];
  mobileOpen: boolean;
  onMobileToggle: () => void;
  onLinkClick: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Mobile: render as accordion
  if (onLinkClick === undefined) return null;

  const linkCls = 'text-gray-700 hover:text-orange-500 transition';

  if (children.length === 0) {
    return (
      <NavAnchor url={item.url} target={item.target} className={linkCls} onClick={onLinkClick}>
        {item.label}
      </NavAnchor>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className={`${linkCls} flex items-center gap-1 font-[inherit] text-[inherit]`}
      >
        {item.label}
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50 animate-in fade-in slide-in-from-top-1">
          {/* Optionally link the parent itself */}
          {item.url && item.url !== '#' && (
            <NavAnchor
              url={item.url}
              target={item.target}
              className="block px-4 py-2.5 text-sm font-medium text-gray-800 hover:bg-orange-50 hover:text-orange-600 border-b border-gray-100 transition-colors"
              onClick={() => { setOpen(false); onLinkClick(); }}
            >
              All {item.label}
            </NavAnchor>
          )}
          {children.map(child => (
            <DropdownItem key={child.id} item={child} onClick={() => { setOpen(false); onLinkClick(); }} />
          ))}
        </div>
      )}
    </div>
  );
}

function MobileNavItem({ item, children, onLinkClick }: {
  item: MenuItem;
  children: MenuItem[];
  onLinkClick: () => void;
}) {
  const [open, setOpen] = useState(false);
  const linkCls = 'text-gray-700 hover:text-orange-500 transition text-base';

  if (children.length === 0) {
    return (
      <NavAnchor url={item.url} target={item.target} className={linkCls} onClick={onLinkClick}>
        {item.label}
      </NavAnchor>
    );
  }

  return (
    <div>
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center justify-between w-full text-gray-700 hover:text-orange-500 transition text-base"
      >
        {item.label}
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="ml-4 mt-2 space-y-2 border-l-2 border-orange-100 pl-3">
          {item.url && item.url !== '#' && (
            <NavAnchor url={item.url} target={item.target} className="block text-sm text-gray-600 hover:text-orange-500 transition" onClick={onLinkClick}>
              All {item.label}
            </NavAnchor>
          )}
          {children.map(child => (
            <NavAnchor key={child.id} url={child.url} target={child.target} className="block text-sm text-gray-600 hover:text-orange-500 transition" onClick={onLinkClick}>
              {child.label}
            </NavAnchor>
          ))}
        </div>
      )}
    </div>
  );
}

const FALLBACK: MenuItem[] = [
  { id: '1', label: 'Home', url: '/', target: '_self', display_order: 1, parent_id: null, is_active: true },
  { id: '2', label: 'Generators', url: '/generators', target: '_self', display_order: 2, parent_id: null, is_active: true },
  { id: '3', label: 'Shop', url: '/shop', target: '_self', display_order: 3, parent_id: null, is_active: true },
  { id: '4', label: 'Blog', url: '/blog', target: '_self', display_order: 4, parent_id: null, is_active: true },
  { id: '5', label: 'About', url: '/about', target: '_self', display_order: 5, parent_id: null, is_active: true },
  { id: '6', label: 'Contact', url: '/contact', target: '_self', display_order: 6, parent_id: null, is_active: true },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { getCartCount } = useCart();
  const cartCount = getCartCount();
  const [allItems, setAllItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    menuApi.list({ location: 'header', is_active: true })
      .then(data => { if (data && data.length > 0) setAllItems(data); })
      .catch(() => {});
  }, []);

  const source = allItems.length > 0 ? allItems : FALLBACK;
  const parents = source.filter(i => !i.parent_id).sort((a, b) => a.display_order - b.display_order);
  const childrenOf = (id: string) => source.filter(i => i.parent_id === id).sort((a, b) => a.display_order - b.display_order);

  const closeMobile = () => setMobileMenuOpen(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <BookOpen className="w-8 h-8 text-orange-500" />
            <span className="text-2xl font-bold text-gray-900">Print<span className="text-orange-500">&</span>Use</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center space-x-8">
            {parents.map(item => (
              <NavItemWithDropdown
                key={item.id}
                item={item}
                children={childrenOf(item.id)}
                mobileOpen={false}
                onMobileToggle={() => {}}
                onLinkClick={closeMobile}
              />
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

        {/* Mobile nav */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-3 border-t border-gray-100 pt-4">
            {parents.map(item => (
              <MobileNavItem
                key={item.id}
                item={item}
                children={childrenOf(item.id)}
                onLinkClick={closeMobile}
              />
            ))}
            <Link
              to="/cart"
              className="flex items-center gap-2 text-gray-700 hover:text-orange-500 transition"
              onClick={closeMobile}
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
