import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Upload, X, Folder } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { categoriesAPI } from '../services/api';

export default function EditCategory() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [parentCategories, setParentCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    slug: '',
    parentId: '',
    image: null,
    metaTitle: '',
    metaDescription: '',
    isActive: true,
    isFeatured: false,
    sortOrder: 0
  });
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (id) {
      fetchCategory();
      fetchParentCategories();
    }
  }, [id]);

  const fetchCategory = async () => {
    try {
      setInitialLoading(true);
      const response = await categoriesAPI.getCategory(id);
      const category = response.data.data || response.data;
      
      setFormData({
        name: category.name || '',
        description: category.description || '',
        slug: category.slug || '',
        parentId: category.parentId || '',
        image: null, // Reset image, will show existing in preview
        metaTitle: category.metaTitle || '',
        metaDescription: category.metaDescription || '',
        isActive: category.isActive !== undefined ? category.isActive : true,
        isFeatured: category.isFeatured || false,
        sortOrder: category.sortOrder || 0
      });

      // Set existing image preview
      if (category.image) {
        setImagePreview(category.image);
      }
    } catch (error) {
      console.error('Error fetching category:', error);
      alert('Error loading category: ' + (error.response?.data?.message || error.message));
      navigate('/categories');
    } finally {
      setInitialLoading(false);
    }
  };

  const fetchParentCategories = async () => {
    try {
      const response = await categoriesAPI.getCategories({ limit: 100 });
      const categories = response.data.data?.categories || [];
      // Filter out the current category and its children from parent options
      const parentCats = categories.filter(cat => !cat.parentId && cat._id !== id);
      setParentCategories(parentCats);
    } catch (error) {
      console.error('Error fetching parent categories:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Auto-generate slug from name (but allow manual editing)
    if (name === 'name') {
      const slug = value.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setFormData(prev => ({
        ...prev,
        slug: slug
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      image: null
    }));
    setImagePreview(null);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Category name is required';
    }

    if (!formData.slug.trim()) {
      newErrors.slug = 'Slug is required';
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Prepare form data for API
      const categoryData = {
        ...formData,
        sortOrder: parseInt(formData.sortOrder) || 0,
        parentId: formData.parentId || null
      };

      // Handle image upload (in a real app, you'd upload to cloud storage)
      if (formData.image && typeof formData.image === 'object') {
        // New image uploaded
        categoryData.image = imagePreview;
      } else if (imagePreview) {
        // Keep existing image
        categoryData.image = imagePreview;
      }

      await categoriesAPI.updateCategory(id, categoryData);
      alert('Category updated successfully!');
      navigate('/categories');
    } catch (error) {
      console.error('Error updating category:', error);
      alert('Error updating category: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/categories')}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Edit Category</h1>
            <p className="text-slate-600 mt-2">Update category information</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Information */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Basic Information</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.name ? 'border-red-300' : 'border-slate-200'
                    }`}
                    placeholder="Enter category name"
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Slug *
                  </label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.slug ? 'border-red-300' : 'border-slate-200'
                    }`}
                    placeholder="category-slug"
                  />
                  <p className="text-sm text-slate-500 mt-1">
                    URL-friendly version of the category name
                  </p>
                  {errors.slug && <p className="text-red-500 text-sm mt-1">{errors.slug}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.description ? 'border-red-300' : 'border-slate-200'
                    }`}
                    placeholder="Enter category description..."
                  />
                  {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Parent Category
                    </label>
                    <select
                      name="parentId"
                      value={formData.parentId}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">No Parent (Root Category)</option>
                      {parentCategories.map(category => (
                        <option key={category._id} value={category._id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    <p className="text-sm text-slate-500 mt-1">
                      Leave empty to create a root category
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Sort Order
                    </label>
                    <input
                      type="number"
                      name="sortOrder"
                      value={formData.sortOrder}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="0"
                    />
                    <p className="text-sm text-slate-500 mt-1">
                      Lower numbers appear first
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Category Image */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Category Image</h2>
              
              <div className="space-y-4">
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Category preview"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center">
                    <Folder className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-slate-600 mb-2">Upload category image</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
                    >
                      Choose Image
                    </label>
                  </div>
                )}
                
                {imagePreview && (
                  <div className="text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-update"
                    />
                    <label
                      htmlFor="image-update"
                      className="bg-slate-600 text-white px-4 py-2 rounded-lg hover:bg-slate-700 cursor-pointer transition-colors"
                    >
                      Change Image
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status & Settings */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Status & Settings</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-slate-700">Active Category</label>
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-slate-700">Featured Category</label>
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* SEO */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-6">SEO</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Meta Title
                  </label>
                  <input
                    type="text"
                    name="metaTitle"
                    value={formData.metaTitle}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="SEO title..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Meta Description
                  </label>
                  <textarea
                    name="metaDescription"
                    value={formData.metaDescription}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="SEO description..."
                  />
                </div>
              </div>
            </div>

            {/* Category Preview */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Preview</h2>
              
              <div className="space-y-3">
                <div className="p-4 bg-slate-50 rounded-lg">
                  <h3 className="font-semibold text-slate-900">{formData.name || 'Category Name'}</h3>
                  <p className="text-sm text-slate-600 mt-1">
                    {formData.description || 'Category description will appear here...'}
                  </p>
                  {formData.parentId && (
                    <p className="text-xs text-slate-500 mt-2">
                      Parent: {parentCategories.find(cat => cat._id === formData.parentId)?.name || 'Unknown'}
                    </p>
                  )}
                </div>
                
                <div className="text-xs text-slate-500">
                  <p>Slug: {formData.slug || 'category-slug'}</p>
                  <p>Status: {formData.isActive ? 'Active' : 'Inactive'}</p>
                  {formData.isFeatured && <p>Featured: Yes</p>}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-4 pt-6 border-t border-slate-200">
          <button
            type="button"
            onClick={() => navigate('/categories')}
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
                Updating...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Update Category
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
} 