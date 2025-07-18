import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Package, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  Eye,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { dashboardAPI } from '../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await dashboardAPI.getStats();
      const data = response.data.data;

      // Transform stats data
      const statsData = [
        {
          name: 'Total Revenue',
          value: `$${data.totalRevenue?.toLocaleString() || '0'}`,
          change: '+18.2%', // This would come from analytics API
          changeType: 'increase',
          icon: DollarSign,
          color: 'emerald'
        },
        {
          name: 'Total Orders',
          value: data.totalOrders?.toLocaleString() || '0',
          change: '+12.5%',
          changeType: 'increase',
          icon: ShoppingCart,
          color: 'blue'
        },
        {
          name: 'Total Users',
          value: data.totalUsers?.toLocaleString() || '0',
          change: '+8.1%',
          changeType: 'increase',
          icon: Users,
          color: 'purple'
        },
        {
          name: 'Total Products',
          value: data.totalProducts?.toLocaleString() || '0',
          change: '-2.4%',
          changeType: 'decrease',
          icon: Package,
          color: 'amber'
        }
      ];

      setStats(statsData);
      setRecentOrders(data.recentOrders || []);
      setTopProducts(data.topProducts || []);
      
      // For now, we'll keep low stock products as static since it's not in the API
      setLowStockProducts([
        { name: 'iPhone 15 Pro', stock: 3, category: 'Electronics', image: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=100' },
        { name: 'Nike Air Max', stock: 7, category: 'Footwear', image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=100' },
        { name: 'Samsung Galaxy Watch', stock: 2, category: 'Electronics', image: 'https://images.pexels.com/photos/393047/pexels-photo-393047.jpeg?auto=compress&cs=tinysrgb&w=100' },
        { name: 'MacBook Air M2', stock: 1, category: 'Computers', image: 'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=100' },
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-100 text-emerald-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'pending':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-600 mt-2">Welcome back! Here's what's happening with your store today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-600">{stat.name}</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{stat.value}</p>
                <div className="flex items-center mt-4">
                  {stat.changeType === 'increase' ? (
                    <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-red-500" />
                  )}
                  <span className={`ml-1 text-sm font-semibold ${
                    stat.changeType === 'increase' ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="ml-1 text-sm text-slate-500">vs last month</span>
                </div>
              </div>
              <div className={`p-3 rounded-2xl bg-${stat.color}-100`}>
                <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Recent Orders</h2>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
                View all
                <ArrowUpRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                      <span className="text-sm font-bold text-white">{order.avatar}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{order.customer}</p>
                      <p className="text-sm text-slate-500">{order.id}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-900">{order.amount}</p>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
                <h2 className="text-xl font-bold text-slate-900">Low Stock Alert</h2>
              </div>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
                View all
                <ArrowUpRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {lowStockProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-amber-50 rounded-xl border border-amber-200">
                  <div className="flex items-center space-x-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-12 w-12 rounded-xl object-cover"
                    />
                    <div>
                      <p className="font-semibold text-slate-900">{product.name}</p>
                      <p className="text-sm text-slate-500">{product.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-amber-600">
                      {product.stock} remaining
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Top Selling Products</h2>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
              View analytics
              <ArrowUpRight className="h-4 w-4 ml-1" />
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {topProducts.map((product, index) => (
              <div key={index} className="p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl font-bold text-slate-700">#{index + 1}</span>
                  {product.trend === 'up' ? (
                    <TrendingUp className="h-5 w-5 text-emerald-500" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-red-500" />
                  )}
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{product.name}</h3>
                <div className="space-y-1">
                  <p className="text-sm text-slate-600">{product.sales} sales</p>
                  <p className="text-lg font-bold text-slate-900">{product.revenue}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 