import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Copy, Percent, Calendar, Users, DollarSign, Search } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { couponsAPI } from '../services/api';

export default function Coupons() {
  const { showSuccess, showError } = useToast();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCoupons, setTotalCoupons] = useState(0);
  const [formData, setFormData] = useState({
    code: '',
    discountAmount: '',
    minimumOrderAmount: '',
    expiryDate: '',
    isActive: true,
    usageLimit: ''
  });

  useEffect(() => {
    fetchCoupons();
  }, [currentPage, searchTerm, statusFilter]);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 10,
        search: searchTerm || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
      };

      const response = await couponsAPI.getCoupons(params);
      setCoupons(response.data.data.coupons);
      setTotalPages(response.data.data.pagination.totalPages);
      setTotalCoupons(response.data.data.pagination.totalRecords);
    } catch (error) {
      console.error('Error fetching coupons:', error);
      showError('Failed to fetch coupons');
    } finally {
      setLoading(false);
    }
  };

  const createCoupon = async (couponData) => {
    try {
      await couponsAPI.createCoupon(couponData);
      showSuccess('Coupon created successfully!');
      fetchCoupons();
      return true;
    } catch (error) {
      console.error('Error creating coupon:', error);
      showError(error.response?.data?.message || 'Failed to create coupon');
      return false;
    }
  };

  const updateCoupon = async (couponId, couponData) => {
    try {
      await couponsAPI.updateCoupon(couponId, couponData);
      showSuccess('Coupon updated successfully!');
      fetchCoupons();
      return true;
    } catch (error) {
      console.error('Error updating coupon:', error);
      showError(error.response?.data?.message || 'Failed to update coupon');
      return false;
    }
  };

  const deleteCoupon = async (couponId) => {
    if (!window.confirm('Are you sure you want to delete this coupon?')) {
      return;
    }

    try {
      await couponsAPI.deleteCoupon(couponId);
      showSuccess('Coupon deleted successfully!');
      fetchCoupons();
    } catch (error) {
      console.error('Error deleting coupon:', error);
      showError(error.response?.data?.message || 'Failed to delete coupon');
    }
  };

  const copyCouponCode = (code) => {
    navigator.clipboard.writeText(code);
    showSuccess('Coupon code copied to clipboard!');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const couponData = {
      code: formData.code,
      discountAmount: parseFloat(formData.discountAmount),
      minimumOrderAmount: formData.minimumOrderAmount ? parseFloat(formData.minimumOrderAmount) : 0,
      expiryDate: formData.expiryDate || null,
      isActive: formData.isActive,
      usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : null
    };

    let success = false;
    if (editingCoupon) {
      success = await updateCoupon(editingCoupon._id, couponData);
    } else {
      success = await createCoupon(couponData);
    }

    if (success) {
      setShowModal(false);
      setEditingCoupon(null);
      resetForm();
    }
  };

  const resetForm = () => {
    setFormData({
      code: '',
      discountAmount: '',
      minimumOrderAmount: '',
      expiryDate: '',
      isActive: true,
      usageLimit: ''
    });
  };

  const openEditModal = (coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      discountAmount: coupon.discountAmount.toString(),
      minimumOrderAmount: coupon.minimumOrderAmount ? coupon.minimumOrderAmount.toString() : '',
      expiryDate: coupon.expiryDate ? new Date(coupon.expiryDate).toISOString().split('T')[0] : '',
      isActive: coupon.isActive,
      usageLimit: coupon.usageLimit ? coupon.usageLimit.toString() : ''
    });
    setShowModal(true);
  };

  const openCreateModal = () => {
    setEditingCoupon(null);
    resetForm();
    setShowModal(true);
  };

  const getStatusColor = (coupon) => {
    if (!coupon.isActive) {
      return 'bg-red-100 text-red-800';
    }
    if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
      return 'bg-red-100 text-red-800';
    }
    return 'bg-emerald-100 text-emerald-800';
  };

  const getStatusText = (coupon) => {
    if (!coupon.isActive) {
      return 'Inactive';
    }
    if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
      return 'Expired';
    }
    return 'Active';
  };

  const getUsagePercentage = (usedCount, usageLimit) => {
    if (!usageLimit) return 0;
    return Math.min((usedCount / usageLimit) * 100, 100);
  };

  const totalSavings = coupons.reduce((sum, coupon) => {
    return sum + (coupon.discountAmount * coupon.usedCount);
  }, 0);

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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Coupons & Discounts</h1>
          <p className="text-slate-600 mt-2">Create and manage discount codes for your customers</p>
        </div>
        <button 
          onClick={openCreateModal}
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
              <p className="text-3xl font-bold text-slate-900 mt-2">{totalCoupons}</p>
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
                {coupons.filter(c => c.isActive && (!c.expiryDate || new Date(c.expiryDate) > new Date())).length}
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
                placeholder="Search coupons by code..."
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
            </select>
          </div>
        </div>
      </div>

      {/* Coupons Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {coupons.map((coupon) => (
          <div key={coupon._id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
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
                <div className="flex items-center gap-2">
                  <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(coupon)}`}>
                    {getStatusText(coupon)}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-sm font-medium text-slate-600">Discount</p>
                <p className="text-2xl font-bold text-slate-900">${coupon.discountAmount}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-sm font-medium text-slate-600">Used</p>
                <p className="text-2xl font-bold text-slate-900">{coupon.usedCount}</p>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Min Amount:</span>
                <span className="font-medium text-slate-900">${coupon.minimumOrderAmount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Created:</span>
                <span className="font-medium text-slate-900">{new Date(coupon.createdAt).toLocaleDateString()}</span>
              </div>
              {coupon.expiryDate && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Expires:</span>
                  <span className="font-medium text-slate-900">{new Date(coupon.expiryDate).toLocaleDateString()}</span>
                </div>
              )}
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
                onClick={() => openEditModal(coupon)}
                className="flex-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-2 rounded-lg transition-colors"
              >
                <Edit className="h-4 w-4 mx-auto" />
              </button>
              <button 
                onClick={() => deleteCoupon(coupon._id)}
                className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
              >
                <Trash2 className="h-4 w-4 mx-auto" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="text-sm text-slate-600">
            Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, totalCoupons)} of {totalCoupons} coupons
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-3 py-2 text-sm text-slate-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md">
            <div className="p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-6">
                {editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Coupon Code *
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="e.g. SAVE20"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Discount Amount ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.discountAmount}
                    onChange={(e) => setFormData({...formData, discountAmount: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="e.g. 20"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Minimum Order Amount ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.minimumOrderAmount}
                    onChange={(e) => setFormData({...formData, minimumOrderAmount: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="e.g. 50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Usage Limit
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({...formData, usageLimit: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="e.g. 100"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="isActive" className="text-sm font-semibold text-slate-700">
                    Active
                  </label>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingCoupon(null);
                      resetForm();
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