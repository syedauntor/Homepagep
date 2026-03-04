import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Check, Home, ChevronRight, FileText, Package, Star, Tag, BookOpen, Ticket } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useCart, Product } from '../contexts/CartContext';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [couponCode, setCouponCode] = useState('');
  const { addToCart } = useCart();

  // Demo images - you can replace these with actual product images
  const productImages = [
    product?.image_url || '/h1.jpg',
    '/h2.jpg',
    '/h3.jpg',
    '/h4.jpg',
    '/h5.jpg'
  ];

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
              {/* Product Image Gallery */}
              <div className="aspect-[4/3] bg-gradient-to-br from-orange-50 to-amber-50 relative">
                <img
                  src={productImages[selectedImage]}
                  alt={`${product.title} - Image ${selectedImage + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-6 right-6 flex gap-3">
                  <span className="bg-white/95 backdrop-blur-sm text-orange-600 px-4 py-2 rounded-full text-sm font-semibold shadow-lg flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    {product.file_type}
                  </span>
                </div>
              </div>

              {/* Image Thumbnails */}
              <div className="p-4 bg-gray-50 border-t border-gray-200">
                <div className="flex gap-3 overflow-x-auto">
                  {productImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === index
                          ? 'border-orange-500 ring-2 ring-orange-200'
                          : 'border-gray-300 hover:border-orange-300'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
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
            <div className="sticky top-8 space-y-6">
              {/* Reviews */}
              <div className="bg-white rounded-3xl shadow-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-5 h-5 fill-orange-400 text-orange-400" />
                    ))}
                  </div>
                  <span className="text-gray-600 text-sm font-medium">4.8 (1.9k ratings)</span>
                </div>
              </div>

              {/* Price & Add to Cart */}
              <div className="bg-white rounded-3xl shadow-xl p-6">
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

              {/* Coupon Code */}
              <div className="bg-white rounded-3xl shadow-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Ticket className="w-5 h-5 text-orange-500" />
                  Have a Coupon Code?
                </h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter code"
                    className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
                  />
                  <button className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors font-semibold">
                    Apply
                  </button>
                </div>
              </div>

              {/* Quick Info */}
              <div className="bg-white rounded-3xl shadow-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 pb-3 border-b-2 border-gray-200">
                  Quick Info
                </h3>
                <div className="space-y-4 text-sm">
                  <div className="py-3 border-b border-gray-100">
                    <div className="flex items-center gap-2 text-gray-600 font-medium mb-2">
                      <FileText className="w-4 h-4" />
                      Format:
                    </div>
                    <span className="text-gray-900 font-bold">{product.file_type}</span>
                  </div>

                  <div className="py-3 border-b border-gray-100">
                    <div className="flex items-center gap-2 text-gray-600 font-medium mb-2">
                      <Package className="w-4 h-4" />
                      Category:
                    </div>
                    <span className="text-gray-900 font-bold capitalize">{product.category}</span>
                  </div>

                  <div className="py-3 border-b border-gray-100">
                    <div className="flex items-center gap-2 text-gray-600 font-medium mb-2">
                      <BookOpen className="w-4 h-4" />
                      Pages:
                    </div>
                    <span className="text-gray-900 font-bold">42</span>
                  </div>

                  <div className="py-3 border-b border-gray-100">
                    <div className="flex items-center gap-2 text-gray-600 font-medium mb-2">
                      <Tag className="w-4 h-4" />
                      Tags:
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-semibold">
                        Multiplication
                      </span>
                      <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-semibold">
                        Math
                      </span>
                      <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-semibold">
                        Worksheets
                      </span>
                    </div>
                  </div>

                  <div className="py-3">
                    <div className="flex items-center gap-2 text-gray-600 font-medium mb-2">
                      <Check className="w-4 h-4" />
                      Delivery:
                    </div>
                    <span className="text-orange-600 font-bold">Instant Digital Download</span>
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
