import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Award, Eye, Package, Search } from 'lucide-react';
import { brandsAPI } from '../services/api';

export default function Brands() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBrands, setTotalBrands] = useState(0);

  useEffect(() => {
    fetchBrands();
  }, [currentPage, searchTerm, statusFilter]);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 10,
        search: searchTerm || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
      };

      const response = await brandsAPI.getBrands(params);
      const { brands: brandsData, pagination } = response.data.data;
      
      setBrands(brandsData);
      setTotalPages(pagination.total);
      setTotalBrands(pagination.totalRecords);
    } catch (error) {
      console.error('Error fetching brands:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteBrand = async (brandId) => {
    if (window.confirm('Are you sure you want to delete this brand?')) {
      try {
        await brandsAPI.deleteBrand(brandId);
        setBrands(prev => prev.filter(brand => brand._id !== brandId));
        alert('Brand deleted successfully!');
      } catch (error) {
        alert('Error deleting brand: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Brands</h1>
          <p className="text-slate-600 mt-2">Manage product brands and manufacturers</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 flex items-center gap-2 shadow-lg transition-all"
        >
          <Plus className="h-4 w-4" />
          Add Brand
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Brands</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{totalBrands}</p>
            </div>
            <div className="p-3 rounded-2xl bg-blue-100">
              <Award className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Active Brands</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">
                {brands.filter(b => b.status === 'active').length}
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-100">
              <Package className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Products</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">
                {brands.reduce((sum, b) => sum + (b.productCount || 0), 0)}
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-amber-100">
              <Package className="h-6 w-6 text-amber-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">New This Month</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">
                {brands.filter(b => {
                  const brandDate = new Date(b.createdAt);
                  const now = new Date();
                  return brandDate.getMonth() === now.getMonth() && brandDate.getFullYear() === now.getFullYear();
                }).length}
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-purple-100">
              <Plus className="h-6 w-6 text-purple-600" />
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
                placeholder="Search brands by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 w-full border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Brands Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {brands.map((brand) => (
          <div key={brand._id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative">
              <img
                src={brand.logo || 'https://via.placeholder.com/300x200?text=No+Logo'}
                alt={brand.name}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-4 left-4">
                <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                  brand.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                }`}>
                  {brand.status}
                </span>
              </div>
            </div>
            
            <div className="p-6">
              <div className="mb-4">
                <h3 className="font-bold text-slate-900 text-lg mb-2">{brand.name}</h3>
                <p className="text-sm text-slate-600 mb-3">{brand.description || 'No description'}</p>
                <div className="space-y-1 text-sm text-slate-500">
                  <p>Founded: {brand.founded || 'Unknown'}</p>
                  <p>Country: {brand.country || 'Unknown'}</p>
                  <p>Website: {brand.website ? (
                    <a href={brand.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {brand.website}
                    </a>
                  ) : 'Not available'}</p>
                  <p>Created: {formatDate(brand.createdAt)}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 mb-4 p-3 bg-slate-50 rounded-xl">
                <div className="text-center">
                  <p className="text-2xl font-bold text-slate-900">{brand.productCount || 0}</p>
                  <p className="text-xs text-slate-600">Products</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className="flex-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-2 rounded-lg transition-colors">
                  <Eye className="h-4 w-4 mx-auto" />
                </button>
                <button 
                  onClick={() => {
                    setEditingBrand(brand);
                    setShowModal(true);
                  }}
                  className="flex-1 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 p-2 rounded-lg transition-colors"
                >
                  <Edit className="h-4 w-4 mx-auto" />
                </button>
                <button 
                  onClick={() => deleteBrand(brand._id)}
                  className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
                >
                  <Trash2 className="h-4 w-4 mx-auto" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="text-sm text-slate-600">
            Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, totalBrands)} of {totalBrands} brands
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

      {/* Add/Edit Brand Modal would go here */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              {editingBrand ? 'Edit Brand' : 'Add Brand'}
            </h2>
            <p className="text-slate-600 mb-4">
              {editingBrand ? 'Update brand information' : 'Create a new brand'}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50"
              >
                Cancel
              </button>
              <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                {editingBrand ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 