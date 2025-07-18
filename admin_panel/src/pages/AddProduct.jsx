import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Upload, X, Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { productsAPI, categoriesAPI, brandsAPI } from '../services/api';
import { useToast } from '../contexts/ToastContext';

export default function AddProduct() {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category_id: '',
    brand_id: '',
    price: '',
    description: '',
    stock_qty: '',
    image: null, // single file
    imagePreview: null // preview URL
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchCategories();
    fetchBrands();
  }, []);

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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file)
      }));
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image: null, imagePreview: null }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.sku.trim()) newErrors.sku = 'SKU is required';
    if (!formData.category_id) newErrors.category_id = 'Category is required';
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'Valid price is required';
    if (!formData.stock_qty || parseInt(formData.stock_qty) < 0) newErrors.stock_qty = 'Valid stock quantity is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('sku', formData.sku);
      data.append('category_id', formData.category_id);
      data.append('brand_id', formData.brand_id);
      data.append('price', formData.price);
      data.append('description', formData.description);
      data.append('stock_qty', formData.stock_qty);
      if (formData.image) {
        data.append('image', formData.image);
      }
      await productsAPI.createProduct(data, true); // true = multipart
      showSuccess('Product created successfully!');
      navigate('/products');
    } catch (error) {
      console.error('Error creating product:', error);
      showError('Error creating product: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

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
            <h1 className="text-3xl font-bold text-slate-900">Add New Product</h1>
            <p className="text-slate-600 mt-2">Create a new product for your catalog</p>
          </div>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.name ? 'border-red-300' : 'border-slate-200'
                    }`}
                    placeholder="Enter product name"
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    SKU *
                  </label>
                  <input
                    type="text"
                    name="sku"
                    value={formData.sku}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.sku ? 'border-red-300' : 'border-slate-200'
                    }`}
                    placeholder="Enter SKU"
                  />
                  {errors.sku && <p className="text-red-500 text-sm mt-1">{errors.sku}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.category_id ? 'border-red-300' : 'border-slate-200'
                    }`}
                  >
                    <option value="">Select Category</option>
                    {Array.isArray(categories) && categories.map(category => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {errors.category_id && <p className="text-red-500 text-sm mt-1">{errors.category_id}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Brand
                  </label>
                  <select
                    name="brand_id"
                    value={formData.brand_id}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Brand</option>
                    {Array.isArray(brands) && brands.map(brand => (
                      <option key={brand._id} value={brand._id}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Price *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.price ? 'border-red-300' : 'border-slate-200'
                    }`}
                    placeholder="0.00"
                  />
                  {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    name="stock_qty"
                    value={formData.stock_qty}
                    onChange={handleInputChange}
                    min="0"
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.stock_qty ? 'border-red-300' : 'border-slate-200'
                    }`}
                    placeholder="0"
                  />
                  {errors.stock_qty && <p className="text-red-500 text-sm mt-1">{errors.stock_qty}</p>}
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter product description..."
                />
              </div>
            </div>
            {/* Image Upload */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Product Image</h2>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center">
                  <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-slate-600 mb-2">Upload product image</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
                  >
                    Choose File
                  </label>
                </div>
                {formData.imagePreview && (
                  <div className="relative w-32 h-32 mx-auto">
                    <img
                      src={formData.imagePreview}
                      alt="Product Preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Product Summary */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Product Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Name:</span>
                  <span className="text-sm font-medium text-slate-900">{formData.name || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">SKU:</span>
                  <span className="text-sm font-medium text-slate-900">{formData.sku || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Category:</span>
                  <span className="text-sm font-medium text-slate-900">
                    {Array.isArray(categories) && categories.find(c => c._id === formData.category_id)?.name || '—'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Brand:</span>
                  <span className="text-sm font-medium text-slate-900">
                    {Array.isArray(brands) && brands.find(b => b._id === formData.brand_id)?.name || '—'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Price:</span>
                  <span className="text-sm font-medium text-slate-900">
                    {formData.price ? `$${parseFloat(formData.price).toFixed(2)}` : '—'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Stock:</span>
                  <span className="text-sm font-medium text-slate-900">{formData.stock_qty || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Image:</span>
                  <span className="text-sm font-medium text-slate-900">{formData.imagePreview ? 'Uploaded' : 'Not Uploaded'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-4 pt-6 border-t border-slate-200">
          <button
            type="button"
            onClick={() => navigate('/products')}
            className="px-6 py-3 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Creating...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Create Product
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
} 