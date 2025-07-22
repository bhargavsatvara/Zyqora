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
      setStats([]); // You can keep your stats logic or update as needed
      setRecentOrders(data.recentOrders || []);
      setLowStockProducts(data.lowStockProducts || []);
      setTopProducts(data.topProducts || []);
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
                <div key={order._id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                      <span className="text-sm font-bold text-white">{order.user_id?.name?.charAt(0) || '?'}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{order.user_id?.name || 'Unknown'}</p>
                      <p className="text-sm text-slate-500">{order._id}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-900">${order.total_amount?.$numberDecimal || '0.00'}</p>
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
                <div key={product._id} className="flex items-center justify-between p-4 bg-amber-50 rounded-xl border border-amber-200">
                  <div className="flex items-center space-x-4">
                    <img
                      src={product.image?.startsWith('/uploads') ? `http://localhost:4000${product.image}` : product.image}
                      alt={product.name}
                      className="h-12 w-12 rounded-xl object-cover"
                    />
                    <div>
                      <p className="font-semibold text-slate-900">{product.name}</p>
                      <p className="text-sm text-slate-500">Stock: {product.stock_qty}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-amber-600">
                      {product.stock_qty} remaining
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
              <div key={product._id} className="p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl font-bold text-slate-700">#{index + 1}</span>
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{product.name}</h3>
                <img
                  src={product.image?.startsWith('/uploads') ? `http://localhost:4000${product.image}` : product.image}
                  alt={product.name}
                  className="h-16 w-16 rounded-xl object-cover mb-2"
                />
                <div className="space-y-1">
                  {/* You can add sales info if you return it from backend */}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 