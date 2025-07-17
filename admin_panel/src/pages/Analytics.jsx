import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Package,
  Calendar,
  Target,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

const salesData = [
  { month: 'Jan', revenue: 45000, orders: 234, customers: 156, conversion: 3.2 },
  { month: 'Feb', revenue: 52000, orders: 267, customers: 189, conversion: 3.8 },
  { month: 'Mar', revenue: 48000, orders: 245, customers: 178, conversion: 3.5 },
  { month: 'Apr', revenue: 61000, orders: 298, customers: 221, conversion: 4.1 },
  { month: 'May', revenue: 55000, orders: 276, customers: 203, conversion: 3.9 },
  { month: 'Jun', revenue: 67000, orders: 334, customers: 245, conversion: 4.3 }
];

const topProducts = [
  { name: 'iPhone 15 Pro', sales: 1234, revenue: 1233000, growth: 15.3, category: 'Electronics' },
  { name: 'Samsung Galaxy S24', sales: 987, revenue: 789600, growth: 8.7, category: 'Electronics' },
  { name: 'MacBook Air M2', sales: 456, revenue: 547200, growth: -2.1, category: 'Computers' },
  { name: 'Sony WH-1000XM4', sales: 654, revenue: 228900, growth: 23.4, category: 'Audio' },
  { name: 'iPad Pro', sales: 321, revenue: 289800, growth: 12.8, category: 'Electronics' }
];

const customerMetrics = [
  { metric: 'New Customers', value: 1234, change: 12.5, period: 'This Month', icon: Users },
  { metric: 'Returning Customers', value: 2567, change: 8.3, period: 'This Month', icon: Users },
  { metric: 'Customer Lifetime Value', value: 324, change: 15.7, period: 'Average', icon: DollarSign },
  { metric: 'Customer Retention Rate', value: 73.2, change: 4.2, period: 'This Quarter', icon: Target }
];

const trafficSources = [
  { source: 'Organic Search', visitors: 12450, percentage: 45.2, change: 8.3 },
  { source: 'Direct', visitors: 8920, percentage: 32.4, change: -2.1 },
  { source: 'Social Media', visitors: 3680, percentage: 13.4, change: 15.7 },
  { source: 'Email Marketing', visitors: 1890, percentage: 6.9, change: 22.4 },
  { source: 'Paid Ads', visitors: 560, percentage: 2.1, change: -5.8 }
];

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('30');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Analytics & Insights</h1>
          <p className="text-slate-600 mt-2">Track your business performance and growth metrics</p>
        </div>
        <div className="flex gap-2">
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
          <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg">
            Export Report
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Revenue</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">$328,500</p>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-100">
              <DollarSign className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <ArrowUpRight className="h-4 w-4 text-emerald-500" />
            <span className="ml-1 text-sm font-semibold text-emerald-600">+18.2%</span>
            <span className="ml-1 text-sm text-slate-500">vs last month</span>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Orders</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">1,654</p>
            </div>
            <div className="p-3 rounded-2xl bg-blue-100">
              <ShoppingCart className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <ArrowUpRight className="h-4 w-4 text-emerald-500" />
            <span className="ml-1 text-sm font-semibold text-emerald-600">+12.8%</span>
            <span className="ml-1 text-sm text-slate-500">vs last month</span>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">New Customers</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">423</p>
            </div>
            <div className="p-3 rounded-2xl bg-purple-100">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <ArrowDownRight className="h-4 w-4 text-red-500" />
            <span className="ml-1 text-sm font-semibold text-red-600">-3.2%</span>
            <span className="ml-1 text-sm text-slate-500">vs last month</span>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Avg Order Value</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">$198.50</p>
            </div>
            <div className="p-3 rounded-2xl bg-amber-100">
              <Target className="h-6 w-6 text-amber-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <ArrowUpRight className="h-4 w-4 text-emerald-500" />
            <span className="ml-1 text-sm font-semibold text-emerald-600">+5.7%</span>
            <span className="ml-1 text-sm text-slate-500">vs last month</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">Revenue Trend</h2>
            <Calendar className="h-5 w-5 text-slate-400" />
          </div>
          <div className="space-y-4">
            {salesData.map((data, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-12 text-sm font-medium text-slate-600">{data.month}</div>
                  <div className="flex-1 mx-4">
                    <div className="bg-slate-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all"
                        style={{ width: `${(data.revenue / 70000) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
                <div className="text-sm font-bold text-slate-900">
                  ${(data.revenue / 1000).toFixed(0)}k
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">Top Products</h2>
            <Package className="h-5 w-5 text-slate-400" />
          </div>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <span className="text-lg font-bold text-slate-700 mr-3">#{index + 1}</span>
                    <div>
                      <div className="text-sm font-bold text-slate-900">{product.name}</div>
                      <div className="text-xs text-slate-500">{product.category}</div>
                    </div>
                  </div>
                  <div className="text-xs text-slate-600">{product.sales} sales • ${(product.revenue / 1000).toFixed(0)}k revenue</div>
                </div>
                <div className="flex items-center">
                  {product.growth >= 0 ? (
                    <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-red-500" />
                  )}
                  <span className={`ml-1 text-sm font-semibold ${
                    product.growth >= 0 ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    {product.growth >= 0 ? '+' : ''}{product.growth}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Customer Analytics */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900">Customer Analytics</h2>
          <Users className="h-5 w-5 text-slate-400" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {customerMetrics.map((metric, index) => (
            <div key={index} className="text-center p-6 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
              <div className="flex justify-center mb-3">
                <div className="p-3 rounded-2xl bg-blue-100">
                  <metric.icon className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-900 mb-1">
                {metric.metric.includes('Value') || metric.metric.includes('Rate') 
                  ? `${metric.value}${metric.metric.includes('Rate') ? '%' : ''}`
                  : metric.value.toLocaleString()
                }
              </div>
              <div className="text-sm font-medium text-slate-600 mb-2">{metric.metric}</div>
              <div className="flex items-center justify-center">
                <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                <span className="ml-1 text-xs font-semibold text-emerald-600">+{metric.change}%</span>
              </div>
              <div className="text-xs text-slate-500 mt-1">{metric.period}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Traffic Sources */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-6">Traffic Sources</h2>
        <div className="space-y-4">
          {trafficSources.map((source, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-slate-900">{source.source}</span>
                  <span className="text-sm font-bold text-slate-900">{source.visitors.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="w-full bg-slate-200 rounded-full h-2 mr-4">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${source.percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-slate-600 min-w-0">{source.percentage}%</span>
                </div>
              </div>
              <div className="ml-4 flex items-center">
                {source.change >= 0 ? (
                  <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-red-500" />
                )}
                <span className={`ml-1 text-sm font-semibold ${
                  source.change >= 0 ? 'text-emerald-600' : 'text-red-600'
                }`}>
                  {source.change >= 0 ? '+' : ''}{source.change}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 