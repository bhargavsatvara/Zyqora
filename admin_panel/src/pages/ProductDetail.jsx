import React, { useState, useEffect } from 'react';
import { ArrowLeft, Edit, Trash2, Package, Tag, Calendar, DollarSign, TrendingUp } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { productsAPI } from '../services/api';
import { useToast } from '../contexts/ToastContext';
import ConfirmModal from '../components/ConfirmModal';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
const FILE_BASE_URL = API_BASE_URL.replace(/\/api$/, '');

export default function ProductDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { showSuccess, showError } = useToast();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getProduct(id);
      setProduct(response.data);
    } catch (error) {
      console.error('Error fetching product:', error);
      showError('Error fetching product: ' + (error.response?.data?.message || error.message));
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await productsAPI.deleteProduct(id);
      showSuccess('Product deleted successfully!');
      navigate('/products');
    } catch (error) {
      showError('Error deleting product: ' + (error.response?.data?.message || error.message));
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price || 0);
  };

  const getStockStatus = (stockQty) => {
    if (stockQty === 0) return { status: 'out_of_stock', color: 'bg-red-100 text-red-800', text: 'Out of Stock' };
    if (stockQty <= 10) return { status: 'low_stock', color: 'bg-amber-100 text-amber-800', text: 'Low Stock' };
    return { status: 'active', color: 'bg-emerald-100 text-emerald-800', text: 'In Stock' };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-slate-900">Product not found</h3>
        <p className="text-slate-500 mt-2">The product you're looking for doesn't exist.</p>
      </div>
    );
  }

  const stockStatus = getStockStatus(product.stock_qty);
  let imageUrl = product.image
    ? product.image.startsWith('/uploads/')
      ? FILE_BASE_URL + product.image
      : product.image
    : 'https://via.placeholder.com/400x300?text=No+Image';

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/products')}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{product.name}</h1>
            <p className="text-slate-600 mt-2">Product Details</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate(`/products/edit/${product._id}`)}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            Edit
          </button>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Product Image */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Product Image</h2>
            <div className="aspect-w-16 aspect-h-9">
              <img
                src={imageUrl}
                alt={product.name}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          </div>

          {/* Basic Information */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Product Name</label>
                <p className="text-slate-900 font-medium">{product.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">SKU</label>
                <p className="text-slate-900">{product.sku || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Department</label>
                <p className="text-slate-900">{product.department_id?.name || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Category</label>
                <p className="text-slate-900">{product.category_id?.name || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Brand</label>
                <p className="text-slate-900">{product.brand_id?.name || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Size Chart</label>
                <p className="text-slate-900">{product.size_chart_id?.title || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Price</label>
                <p className="text-slate-900 font-bold text-lg">{formatPrice(product.price)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Stock Quantity</label>
                <div className="flex items-center gap-2">
                  <p className="text-slate-900">{product.stock_qty || 0}</p>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${stockStatus.color}`}>
                    {stockStatus.text}
                  </span>
                </div>
              </div>
            </div>

            {product.description && (
              <div className="mt-6">
                <label className="block text-sm font-medium text-slate-600 mb-2">Description</label>
                <p className="text-slate-900 whitespace-pre-wrap">{product.description}</p>
              </div>
            )}
          </div>

          {/* Product Attributes */}
          {product.attributes && product.attributes.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Product Attributes</h2>
              <div className="space-y-4">
                {product.attributes.map((attribute, index) => (
                  <div key={index} className="border border-slate-200 rounded-lg p-4">
                    <h3 className="font-medium text-slate-900 mb-2">{attribute.attribute_name}</h3>
                    <div className="flex flex-wrap gap-2">
                      {attribute.attribute_values.map((value, valueIndex) => (
                        <span
                          key={valueIndex}
                          className="inline-flex px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                        >
                          {value}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Product Stats */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Product Stats</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-100">
                    <Package className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600">Stock Level</p>
                    <p className="text-lg font-bold text-slate-900">{product.stock_qty || 0}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-100">
                    <DollarSign className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600">Price</p>
                    <p className="text-lg font-bold text-slate-900">{formatPrice(product.price)}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-100">
                    <Tag className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600">Attributes</p>
                    <p className="text-lg font-bold text-slate-900">{product.attributes?.length || 0}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-orange-100">
                    <Calendar className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600">Created</p>
                    <p className="text-lg font-bold text-slate-900">
                      {new Date(product.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Quick Actions</h2>
            <div className="space-y-3">
              <button
                onClick={() => navigate(`/products/edit/${product._id}`)}
                className="w-full bg-blue-600 text-white px-4 py-3 rounded-xl hover:bg-blue-700 flex items-center justify-center gap-2"
              >
                <Edit className="h-4 w-4" />
                Edit Product
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="w-full bg-red-600 text-white px-4 py-3 rounded-xl hover:bg-red-700 flex items-center justify-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Delete Product
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
} 