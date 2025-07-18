import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Eye, Package, Star, DollarSign, Filter, CheckCircle, AlertTriangle, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { productsAPI, categoriesAPI, brandsAPI } from '../services/api';
import { useToast } from '../contexts/ToastContext';
import ConfirmModal from '../components/ConfirmModal';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
const FILE_BASE_URL = API_BASE_URL.replace(/\/api$/, '');

export default function Products() {
  const navigate = useNavigate();
  const { showSuccess, showError, showWarning } = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSearchTerm, setActiveSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [brandFilter, setBrandFilter] = useState('all');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchBrands();
  }, [currentPage, activeSearchTerm, categoryFilter, brandFilter]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 10,
        search: activeSearchTerm || undefined,
        category_id: categoryFilter !== 'all' ? categoryFilter : undefined,
        brand_id: brandFilter !== 'all' ? brandFilter : undefined,
      };

      const response = await productsAPI.getProducts(params);
      console.log('Products API response:', response);
      
      let data = response.data;
      if (data.data && data.data.products) {
        setProducts(data.data.products);
        setTotalPages(data.data.pagination?.totalPages || 1);
        setTotalProducts(data.data.pagination?.totalRecords || 0);
      } else {
        setProducts([]);
        setTotalPages(1);
        setTotalProducts(0);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
      setTotalPages(1);
      setTotalProducts(0);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getCategories();
      const categoriesData = response.data.data?.categories || response.data.data || response.data || [];
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await brandsAPI.getBrands();
      const brandsData = response.data.data?.brands || response.data.data || response.data || [];
      setBrands(brandsData);
    } catch (error) {
      console.error('Error fetching brands:', error);
    }
  };

  const toggleProductSelection = (productId) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleDeleteClick = (productId) => {
    setProductToDelete(productId);
    setShowDeleteModal(true);
  };

  const deleteProduct = async () => {
    if (!productToDelete) return;
    
    try {
      await productsAPI.deleteProduct(productToDelete);
      setProducts(prev => prev.filter(product => product._id !== productToDelete));
      setSelectedProducts(prev => prev.filter(id => id !== productToDelete));
      showSuccess('Product deleted successfully!');
    } catch (error) {
      showError('Error deleting product: ' + (error.response?.data?.message || error.message));
    } finally {
      setProductToDelete(null);
    }
  };

  const handleBulkDeleteClick = () => {
    if (selectedProducts.length === 0) {
      showWarning('Please select products to delete');
      return;
    }
    setShowBulkDeleteModal(true);
  };

  const bulkDelete = async () => {
    try {
      await productsAPI.bulkDelete(selectedProducts);
      setProducts(prev => prev.filter(product => !selectedProducts.includes(product._id)));
      setSelectedProducts([]);
      showSuccess('Products deleted successfully!');
    } catch (error) {
      showError('Error deleting products: ' + (error.response?.data?.message || error.message));
    }
  };

  const getStockStatus = (stockQty) => {
    if (stockQty === 0) return { status: 'out_of_stock', color: 'bg-red-100 text-red-800', text: 'Out of Stock' };
    if (stockQty <= 10) return { status: 'low_stock', color: 'bg-amber-100 text-amber-800', text: 'Low Stock' };
    return { status: 'active', color: 'bg-emerald-100 text-emerald-800', text: 'In Stock' };
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price || 0);
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
          <h1 className="text-3xl font-bold text-slate-900">Products</h1>
          <p className="text-slate-600 mt-2">Manage your product catalog and inventory</p>
        </div>
        <div className="flex gap-3">
          {selectedProducts.length > 0 && (
            <button
              onClick={handleBulkDeleteClick}
              className="bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete Selected ({selectedProducts.length})
            </button>
          )}
          <button 
            onClick={() => navigate('/products/add')}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 flex items-center gap-2 shadow-lg transition-all"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Products</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{totalProducts}</p>
            </div>
            <div className="p-3 rounded-2xl bg-blue-100">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">In Stock</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">
                {products.filter(p => p.stock_qty > 10).length}
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-100">
              <CheckCircle className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Low Stock</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">
                {products.filter(p => p.stock_qty > 0 && p.stock_qty <= 10).length}
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-amber-100">
              <AlertTriangle className="h-6 w-6 text-amber-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Out of Stock</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">
                {products.filter(p => p.stock_qty === 0).length}
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-red-100">
              <X className="h-6 w-6 text-red-600" />
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
                placeholder="Search products... (Press Enter to search)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    setActiveSearchTerm(searchTerm);
                    setCurrentPage(1);
                  }
                }}
                className="pl-10 pr-4 py-3 w-full border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {Array.isArray(categories) && categories.map(category => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
            <select
              value={brandFilter}
              onChange={(e) => setBrandFilter(e.target.value)}
              className="px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Brands</option>
              {Array.isArray(brands) && brands.map(brand => (
                <option key={brand._id} value={brand._id}>
                  {brand.name}
                </option>
              ))}
            </select>
            <button
              onClick={() => {
                setActiveSearchTerm(searchTerm);
                setCurrentPage(1);
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
            >
              Search
            </button>
            {activeSearchTerm && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setActiveSearchTerm('');
                  setCurrentPage(1);
                }}
                className="px-6 py-3 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 transition-colors font-medium"
              >
                Clear
              </button>
            )}
          </div>
        </div>
        {activeSearchTerm && (
          <div className="mt-3 text-sm text-slate-600">
            Searching for: <span className="font-medium">"{activeSearchTerm}"</span>
          </div>
        )}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => {
          const stockStatus = getStockStatus(product.stock_qty);
          let imageUrl = product.image
            ? product.image.startsWith('/uploads/')
              ? FILE_BASE_URL + product.image
              : product.image
            : 'https://via.placeholder.com/300x200?text=No+Image';
          return (
            <div key={product._id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative">
                <img
                  src={imageUrl}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${stockStatus.color}`}>
                    {stockStatus.text}
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(product._id)}
                    onChange={() => toggleProductSelection(product._id)}
                    className="h-4 w-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900 text-lg mb-1 line-clamp-2">{product.name}</h3>
                    <p className="text-sm text-slate-600 mb-2">{product.brand_id?.name || 'No Brand'}</p>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-800">
                        {product.category_id?.name || 'Uncategorized'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-lg font-bold text-slate-900">{formatPrice(product.price)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-600">Stock: {product.stock_qty || 0}</p>
                    <p className="text-xs text-slate-500">SKU: {product.sku || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => navigate(`/products/view/${product._id}`)}
                    className="flex-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                  >
                    <Eye className="h-4 w-4 mx-auto" />
                  </button>
                  <button 
                    onClick={() => navigate(`/products/edit/${product._id}`)}
                    className="flex-1 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 p-2 rounded-lg transition-colors"
                  >
                    <Edit className="h-4 w-4 mx-auto" />
                  </button>
                  <button 
                    onClick={() => handleDeleteClick(product._id)}
                    className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4 mx-auto" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {products.length === 0 && !loading && (
        <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-slate-200">
          <h3 className="mt-2 text-sm font-medium text-slate-900">No products found</h3>
          <p className="mt-1 text-sm text-slate-500">
            {activeSearchTerm ? 'Try adjusting your search terms.' : 'Get started by creating a new product.'}
          </p>
          {!activeSearchTerm && (
            <div className="mt-6">
              <button
                onClick={() => navigate('/products/add')}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </button>
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="text-sm text-slate-600">
            Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, totalProducts)} of {totalProducts} products
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

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={deleteProduct}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />

      {/* Bulk Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showBulkDeleteModal}
        onClose={() => setShowBulkDeleteModal(false)}
        onConfirm={bulkDelete}
        title="Delete Products"
        message={`Are you sure you want to delete ${selectedProducts.length} products? This action cannot be undone.`}
        confirmText="Delete All"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
} 