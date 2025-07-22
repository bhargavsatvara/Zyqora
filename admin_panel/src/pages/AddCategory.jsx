import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { categoriesAPI } from '../services/api';
import { departmentsAPI } from '../services/api';
import Toast from '../components/Toast';

export default function AddCategory() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    department_ids: []
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => setToast({ ...toast, show: false }), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const fetchDepartments = async () => {
    try {
      const response = await departmentsAPI.getDepartments({ limit: 100 });
      console.log('Departments API response:', response);
      // Try both possible structures for now
      if (response.data && response.data.departments) {
        setDepartments(response.data.departments);
      } else if (response.data) {
        setDepartments(response.data);
      } else {
        setDepartments([]);
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleDepartmentChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setFormData(prev => ({ ...prev, department_ids: selectedOptions }));
    if (errors.department_ids) {
      setErrors(prev => ({ ...prev, department_ids: '' }));
    }
  };

  const uploadImage = async (file) => {
    const data = new FormData();
    data.append('image', file);
    const response = await fetch('http://localhost:4000/api/upload/category-image', {
      method: 'POST',
      body: data,
    });
    const result = await response.json();
    return result.path;
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const imagePath = await uploadImage(file);
      setFormData(prev => ({ ...prev, image: imagePath }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Category name is required';
    if (!formData.department_ids.length) newErrors.department_ids = 'At least one department is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setSubmitError('');
    try {
      await categoriesAPI.createCategory(formData);
      setToast({ show: true, message: 'Category created successfully!', type: 'success' });
      setTimeout(() => navigate('/categories'), 1500);
    } catch (error) {
      setToast({ show: true, message: error.response?.data?.message || error.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mt-10">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/categories')}
          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-2xl font-bold text-slate-900">Add New Category</h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {toast.show && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast({ ...toast, show: false })}
          />
        )}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Category Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.name ? 'border-red-300' : 'border-slate-200'}`}
            placeholder="Enter category name"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Category Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          {formData.image && (
            <img src={formData.image} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded-lg border" />
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Departments * (Hold Ctrl/Cmd to select multiple)</label>
          <select
            name="department_ids"
            multiple
            value={formData.department_ids}
            onChange={handleDepartmentChange}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all min-h-[120px] ${errors.department_ids ? 'border-red-300' : 'border-slate-200'}`}
          >
            {Array.isArray(departments) && departments.map(dept => (
              <option key={dept._id} value={dept._id}>{dept.name}</option>
            ))}
          </select>
          {errors.department_ids && <p className="text-red-500 text-sm mt-1">{errors.department_ids}</p>}
          <p className="text-xs text-slate-500 mt-1">Selected: {formData.department_ids.length} department(s)</p>
        </div>
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
                Creating...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Create Category
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
} 