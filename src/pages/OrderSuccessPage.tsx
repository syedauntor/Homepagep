import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Download, Mail } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Order {
  id: string;
  customer_email: string;
  customer_name: string;
  total_amount: number;
  status: string;
  created_at: string;
}

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  products: {
    title: string;
    file_type: string;
  };
}

export default function OrderSuccessPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      fetchOrder(orderId);
    }
  }, [orderId]);

  async function fetchOrder(id: string) {
    try {
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (orderError) throw orderError;

      const { data: itemsData, error: itemsError } = await supabase
        .from('order_items')
        .select('*, products(title, file_type)')
        .eq('order_id', id);

      if (itemsError) throw itemsError;

      setOrder(orderData);
      setOrderItems(itemsData || []);
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Order not found</p>
          <Link
            to="/shop"
            className="mt-4 inline-block text-orange-600 hover:text-orange-700"
          >
            Return to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Placed Successfully!</h1>
          <p className="text-gray-600 mb-8">
            Thank you for your order, {order.customer_name}! We've sent a confirmation email to{' '}
            <span className="font-semibold">{order.customer_email}</span>
          </p>

          <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Mail className="w-5 h-5 text-orange-600" />
              <h3 className="font-semibold text-orange-900">Next Steps</h3>
            </div>
            <p className="text-orange-800 text-sm">
              Once payment is processed, you'll receive download links for your printables via
              email. This is currently a demo, so payments need to be processed manually.
            </p>
          </div>

          <div className="border-t pt-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Order Details</h2>
            <div className="text-left space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Order ID:</span>
                <span className="font-mono text-sm">{order.id.slice(0, 8)}...</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Status:</span>
                <span className="capitalize font-medium">{order.status}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Total:</span>
                <span className="font-bold text-orange-600">
                  ${order.total_amount.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold text-gray-900 mb-3">Items Ordered:</h3>
              <div className="space-y-2">
                {orderItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm text-gray-600">
                    <span>
                      {item.products.title} ({item.products.file_type})
                    </span>
                    <span>x{item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/shop"
              className="bg-orange-500 text-white px-8 py-3 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Continue Shopping
            </Link>
            <Link
              to="/"
              className="bg-gray-100 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
