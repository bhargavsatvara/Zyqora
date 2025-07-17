import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Folder, Eye, Tag, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { categoriesAPI } from '../services/api';

export default function Categories() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCategories, setTotalCategories] = useState(0);

  useEffect(() => {
    fetchCategories();
  }, [currentPage, searchTerm]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 10,
        search: searchTerm || undefined,
      };

      const response = await categoriesAPI.getCategories(params);
      console.log("response -----------",response);
      
      const { categories: categoriesData, pagination } = response.data.data;
      
      setCategories(response.data.data);
      console.log("categoriesData ---------",categoriesData);
      
      setTotalPages(pagination.total);
      setTotalCategories(pagination.totalRecords);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await categoriesAPI.deleteCategory(categoryId);
        setCategories(prev => prev.filter(category => category._id !== categoryId));
        alert('Category deleted successfully!');
      } catch (error) {
        alert('Error deleting category: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const getParentName = (parentId) => {
    if (!parentId) return 'Root';
    const parent = categories.find(cat => cat._id === parentId);
    return parent ? parent.name : 'Unknown';
  };

  const getCategoryLevel = (category) => {
    return category.parentId ? 1 : 0;
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
          <h1 className="text-3xl font-bold text-slate-900">Categories</h1>
          <p className="text-slate-600 mt-2">Organize your products into categories and subcategories</p>
        </div>
        <button 
          onClick={() => navigate('/categories/add')}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 flex items-center gap-2 shadow-lg transition-all"
        >
          <Plus className="h-4 w-4" />
          Add Category
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Categories</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{totalCategories}</p>
            </div>
            <div className="p-3 rounded-2xl bg-blue-100">
              <Folder className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Active Categories</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">
                {categories.filter(c => c.status === 'active').length}
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-100">
              <Tag className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Products</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">
                {categories.reduce((sum, c) => sum + (c.productCount || 0), 0)}
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-amber-100">
              <Tag className="h-6 w-6 text-amber-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-3 w-full border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div key={category._id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative">
              <img
                src={category.image || 'https://via.placeholder.com/300x200?text=No+Image'}
                alt={category.name}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-4 left-4">
                <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                  category.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                }`}>
                  {category.status}
                </span>
              </div>
              {category.parentId && (
                <div className="absolute top-4 right-4">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    Subcategory
                  </span>
                </div>
              )}
            </div>
            
            <div className="p-6">
              <div className="mb-4">
                <h3 className="font-bold text-slate-900 text-lg mb-2">{category.name}</h3>
                <p className="text-sm text-slate-600 mb-3">{category.description || 'No description'}</p>
                <div className="flex items-center justify-between text-sm text-slate-500">
                  <span>Slug: {category.slug}</span>
                  <span>{category.productCount || 0} products</span>
                </div>
                {category.parentId && (
                  <p className="text-xs text-slate-500 mt-1">
                    Parent: {getParentName(category.parentId)}
                  </p>
                )}
                <p className="text-xs text-slate-500 mt-1">
                  Created: {formatDate(category.createdAt)}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button className="flex-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-2 rounded-lg transition-colors">
                  <Eye className="h-4 w-4 mx-auto" />
                </button>
                <button 
                  onClick={() => navigate(`/categories/edit/${category._id}`)}
                  className="flex-1 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 p-2 rounded-lg transition-colors"
                >
                  <Edit className="h-4 w-4 mx-auto" />
                </button>
                <button 
                  onClick={() => deleteCategory(category._id)}
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
            Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, totalCategories)} of {totalCategories} categories
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


    </div>
  );
} 