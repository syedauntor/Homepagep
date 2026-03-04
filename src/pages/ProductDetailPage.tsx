import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Check, Home, ChevronRight, FileText, Package } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useCart, Product } from '../contexts/CartContext';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    if (id) {
      fetchProduct(id);
    }
  }, [id]);

  async function fetchProduct(productId: string) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .eq('is_active', true)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        navigate('/shop');
        return;
      }

      setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
      navigate('/shop');
    } finally {
      setLoading(false);
    }
  }

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-white">
      {/* Breadcrumb Navigation */}
      <div className="bg-gradient-to-r from-orange-100 to-amber-100 py-6 border-b-2 border-orange-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm mb-2">
            <Link to="/" className="flex items-center gap-1 text-orange-600 hover:text-orange-700 transition-colors">
              <Home className="w-4 h-4" />
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <Link to="/shop" className="text-orange-600 hover:text-orange-700 transition-colors">
              Shop
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-700 font-medium">{product.title}</span>
          </nav>
          <h1 className="text-4xl font-bold text-gray-900 leading-tight">{product.title}</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8">
              {/* Product Image */}
              <div className="aspect-[4/3] bg-gradient-to-br from-orange-50 to-amber-50 relative">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-32 h-32 text-orange-300" />
                  </div>
                )}
                <div className="absolute top-6 right-6 flex gap-3">
                  <span className="bg-white/95 backdrop-blur-sm text-orange-600 px-4 py-2 rounded-full text-sm font-semibold shadow-lg flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    {product.file_type}
                  </span>
                </div>
              </div>

              {/* Product Details */}
              <div className="p-8">
                <div className="mb-6">
                  <span className="inline-block bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 px-4 py-2 rounded-full text-sm font-semibold capitalize">
                    {product.category}
                  </span>
                </div>

                <div className="prose max-w-none">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Product</h2>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Features */}
                <div className="mt-8 p-6 bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl border-2 border-orange-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Check className="w-6 h-6 text-orange-500" />
                    What You'll Get
                  </h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-orange-500 flex-shrink-0 mt-1" />
                      <span className="font-medium">Instant digital download after purchase</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-orange-500 flex-shrink-0 mt-1" />
                      <span className="font-medium">High-quality {product.file_type} file ready to print</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-orange-500 flex-shrink-0 mt-1" />
                      <span className="font-medium">Print unlimited copies for personal or classroom use</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-orange-500 flex-shrink-0 mt-1" />
                      <span className="font-medium">Perfect for home learning and teaching</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              {/* Price & Add to Cart */}
              <div className="bg-white rounded-3xl shadow-xl p-6 mb-6">
                <div className="text-center mb-6">
                  <div className="text-5xl font-bold text-orange-500 mb-2">
                    ${product.price.toFixed(2)}
                  </div>
                  <p className="text-gray-600 text-sm">One-time payment</p>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleAddToCart}
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-4 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 flex items-center justify-center gap-3 text-lg font-bold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                    disabled={added}
                  >
                    {added ? (
                      <>
                        <Check className="w-6 h-6" />
                        Added to Cart!
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-6 h-6" />
                        Add to Cart
                      </>
                    )}
                  </button>
                  <Link
                    to="/cart"
                    className="w-full bg-gray-100 text-gray-700 px-6 py-4 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center text-lg font-semibold"
                  >
                    View Cart
                  </Link>
                </div>
              </div>

              {/* Quick Info */}
              <div className="bg-white rounded-3xl shadow-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 pb-3 border-b-2 border-gray-200">
                  Quick Info
                </h3>
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">Format:</span>
                    <span className="text-gray-900 font-bold">{product.file_type}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">Category:</span>
                    <span className="text-gray-900 font-bold capitalize">{product.category}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600 font-medium">Delivery:</span>
                    <span className="text-orange-600 font-bold">Instant</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
