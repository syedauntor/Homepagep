import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Check } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Shop
        </Link>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-8">
            <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ShoppingCart className="w-24 h-24 text-gray-300" />
                </div>
              )}
            </div>

            <div className="flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>
                <span className="text-xs bg-orange-100 text-orange-700 px-3 py-1 rounded-full">
                  {product.file_type}
                </span>
              </div>

              <div className="mb-6">
                <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                  {product.category}
                </span>
              </div>

              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                {product.description}
              </p>

              <div className="mt-auto">
                <div className="mb-6">
                  <span className="text-4xl font-bold text-orange-600">
                    ${product.price.toFixed(2)}
                  </span>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-orange-500 text-white px-8 py-4 rounded-xl hover:bg-orange-600 transition-colors flex items-center justify-center gap-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
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
                    className="bg-gray-100 text-gray-700 px-8 py-4 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center text-lg font-semibold"
                  >
                    View Cart
                  </Link>
                </div>

                <div className="mt-8 p-6 bg-orange-50 rounded-xl">
                  <h3 className="font-semibold text-gray-900 mb-3">What You'll Get:</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-orange-500 flex-shrink-0" />
                      Instant download after purchase
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-orange-500 flex-shrink-0" />
                      High-quality {product.file_type} file
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-orange-500 flex-shrink-0" />
                      Print unlimited copies for personal use
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
