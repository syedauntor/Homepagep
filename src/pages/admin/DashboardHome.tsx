import { useEffect, useState } from 'react';
import { dashboardApi } from '../../lib/api';
import { Package, FileText, ShoppingCart, MessageSquare, TrendingUp, DollarSign } from 'lucide-react';

interface Stats {
  totalProducts: number;
  totalBlogPosts: number;
  totalOrders: number;
  totalMessages: number;
  recentOrders: number;
  revenue: number;
}

export default function DashboardHome() {
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    totalBlogPosts: 0,
    totalOrders: 0,
    totalMessages: 0,
    recentOrders: 0,
    revenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await dashboardApi.stats();
      const lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - 7);
      const recentOrders = data.recent_orders.filter(o => new Date(o.created_at) >= lastWeek).length;
      setStats({
        totalProducts: data.product_count,
        totalBlogPosts: data.blog_count,
        totalOrders: data.order_count,
        totalMessages: data.message_count,
        recentOrders,
        revenue: data.total_revenue,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      icon: Package,
      label: 'Total Products',
      value: stats.totalProducts,
      color: 'bg-blue-500',
    },
    {
      icon: FileText,
      label: 'Blog Posts',
      value: stats.totalBlogPosts,
      color: 'bg-green-500',
    },
    {
      icon: ShoppingCart,
      label: 'Total Orders',
      value: stats.totalOrders,
      color: 'bg-purple-500',
    },
    {
      icon: MessageSquare,
      label: 'Messages',
      value: stats.totalMessages,
      color: 'bg-orange-500',
    },
    {
      icon: TrendingUp,
      label: 'Recent Orders (7 days)',
      value: stats.recentOrders,
      color: 'bg-pink-500',
    },
    {
      icon: DollarSign,
      label: 'Total Revenue',
      value: `৳${stats.revenue.toFixed(2)}`,
      color: 'bg-emerald-500',
    },
  ];

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-slate-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Dashboard Overview</h1>
        <p className="text-slate-600 mt-2">Welcome to your admin panel</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4">
                <div className={`${card.color} rounded-lg p-3`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">{card.label}</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{card.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
