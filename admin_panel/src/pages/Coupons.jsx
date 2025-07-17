import React, { useState } from 'react';
import { Plus, Edit, Trash2, Copy, Percent, Calendar, Users, DollarSign, Search } from 'lucide-react';

const mockCoupons = [
  {
    id: '1',
    code: 'WELCOME20',
    type: 'percentage',
    value: 20,
    minAmount: 100,
    maxDiscount: 50,
    usageLimit: 1000,
    usedCount: 234,
    status: 'active',
    startDate: '2024-01-01',
    endDate: '2024-03-31',
    description: 'Welcome discount for new customers',
    createdBy: 'Admin'
  },
  {
    id: '2',
    code: 'SAVE10',
    type: 'fixed',
    value: 10,
    minAmount: 50,
    maxDiscount: null,
    usageLimit: 500,
    usedCount: 89,
    status: 'active',
    startDate: '2024-01-15',
    endDate: '2024-02-15',
    description: 'Fixed $10 discount',
    createdBy: 'Admin'
  },
  {
    id: '3',
    code: 'SUMMER2024',
    type: 'percentage',
    value: 15,
    minAmount: 75,
    maxDiscount: 25,
    usageLimit: 2000,
    usedCount: 1567,
    status: 'expired',
    startDate: '2024-06-01',
    endDate: '2024-08-31',
    description: 'Summer sale discount',
    createdBy: 'Admin'
  },
  {
    id: '4',
    code: 'FIRSTBUY',
    type: 'percentage',
    value: 25,
    minAmount: 200,
    maxDiscount: 100,
    usageLimit: null,
    usedCount: 45,
    status: 'active',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    description: 'First-time buyer discount',
    createdBy: 'Admin'
  },
  {
    id: '5',
    code: 'FLASH50',
    type: 'percentage',
    value: 50,
    minAmount: 300,
    maxDiscount: 150,
    usageLimit: 100,
    usedCount: 78,
    status: 'active',
    startDate: '2024-01-20',
    endDate: '2024-01-25',
    description: 'Flash sale - 50% off',
    createdBy: 'Admin'
  },
  {
    id: '6',
    code: 'LOYALTY15',
    type: 'percentage',
    value: 15,
    minAmount: 150,
    maxDiscount: 75,
    usageLimit: 500,
    usedCount: 12,
    status: 'paused',
    startDate: '2024-01-10',
    endDate: '2024-06-10',
    description: 'Loyalty program discount',
    createdBy: 'Admin'
  }
];

export default function Coupons() {
  const [coupons, setCoupons] = useState(mockCoupons);
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredCoupons = coupons.filter(coupon => {
    const matchesSearch = coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         coupon.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || coupon.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const deleteCoupon = (couponId) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      setCoupons(prev => prev.filter(coupon => coupon.id !== couponId));
    }
  };

  const copyCouponCode = (code) => {
    navigator.clipboard.writeText(code);
    // You would typically show a toast notification here
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-100 text-emerald-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'paused':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const formatValue = (type, value) => {
    return type === 'percentage' ? `${value}%` : `$${value}`;
  };

  const getUsagePercentage = (usedCount, usageLimit) => {
    if (!usageLimit) return 0;
    return Math.min((usedCount / usageLimit) * 100, 100);
  };

  const totalSavings = coupons.reduce((sum, coupon) => {
    if (coupon.type === 'fixed') {
      return sum + (coupon.value * coupon.usedCount);
    } else {
      // Estimate for percentage discounts (assuming average order value)
      return sum + (coupon.usedCount * 50 * (coupon.value / 100));
    }
  }, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Coupons & Discounts</h1>
          <p className="text-slate-600 mt-2">Create and manage discount codes for your customers</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 flex items-center gap-2 shadow-lg transition-all"
        >
          <Plus className="h-4 w-4" />
          Create Coupon
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Coupons</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{coupons.length}</p>
            </div>
            <div className="p-3 rounded-2xl bg-blue-100">
              <Percent className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Active Coupons</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">
                {coupons.filter(c => c.status === 'active').length}
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-100">
              <Calendar className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Usage</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">
                {coupons.reduce((sum, c) => sum + c.usedCount, 0)}
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-purple-100">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Savings</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">${totalSavings.toLocaleString()}</p>
            </div>
            <div className="p-3 rounded-2xl bg-amber-100">
              <DollarSign className="h-6 w-6 text-amber-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search coupons by code or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 w-full border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="scheduled">Scheduled</option>
              <option value="paused">Paused</option>
            </select>
          </div>
        </div>
      </div>

      {/* Coupons Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCoupons.map((coupon) => (
          <div key={coupon.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-lg font-mono font-bold text-slate-900 bg-slate-100 px-3 py-1 rounded-lg">
                    {coupon.code}
                  </span>
                  <button 
                    onClick={() => copyCouponCode(coupon.code)}
                    className="text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-sm text-slate-600 mb-3">{coupon.description}</p>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(coupon.status)}`}>
                    {coupon.status}
                  </span>
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    {coupon.type}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-sm font-medium text-slate-600">Discount</p>
                <p className="text-2xl font-bold text-slate-900">{formatValue(coupon.type, coupon.value)}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-sm font-medium text-slate-600">Used</p>
                <p className="text-2xl font-bold text-slate-900">{coupon.usedCount}</p>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Min Amount:</span>
                <span className="font-medium text-slate-900">${coupon.minAmount}</span>
              </div>
              {coupon.maxDiscount && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Max Discount:</span>
                  <span className="font-medium text-slate-900">${coupon.maxDiscount}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Valid Period:</span>
                <span className="font-medium text-slate-900">{coupon.startDate} - {coupon.endDate}</span>
              </div>
            </div>

            {coupon.usageLimit && (
              <div className="mb-4">
                <div className="flex justify-between text-xs text-slate-600 mb-1">
                  <span>Usage</span>
                  <span>{coupon.usedCount} / {coupon.usageLimit}</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${getUsagePercentage(coupon.usedCount, coupon.usageLimit)}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex items-center gap-2">
              <button 
                onClick={() => {
                  setEditingCoupon(coupon);
                  setShowModal(true);
                }}
                className="flex-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-2 rounded-lg transition-colors"
              >
                <Edit className="h-4 w-4 mx-auto" />
              </button>
              <button 
                onClick={() => deleteCoupon(coupon.id)}
                className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
              >
                <Trash2 className="h-4 w-4 mx-auto" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md">
            <div className="p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-6">
                {editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}
              </h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Coupon Code
                  </label>
                  <input
                    type="text"
                    defaultValue={editingCoupon?.code || ''}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="e.g. SAVE20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Discount Type
                  </label>
                  <select
                    defaultValue={editingCoupon?.type || 'percentage'}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Discount Value
                  </label>
                  <input
                    type="number"
                    defaultValue={editingCoupon?.value || ''}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="e.g. 20"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      defaultValue={editingCoupon?.startDate || ''}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      defaultValue={editingCoupon?.endDate || ''}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Description
                  </label>
                  <textarea
                    defaultValue={editingCoupon?.description || ''}
                    rows={3}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter coupon description"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingCoupon(null);
                    }}
                    className="px-6 py-3 text-sm font-semibold text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg"
                  >
                    {editingCoupon ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 