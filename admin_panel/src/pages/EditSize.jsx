import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { sizesAPI } from '../services/api';
import { Save, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import Toast from '../components/Toast';

export default function EditSize() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    fetchSize();
  }, [id]);

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => setToast({ ...toast, show: false }), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const fetchSize = async () => {
    try {
      setFetching(true);
      const response = await sizesAPI.getSize(id);
      const size = response.data;
      setForm({
        name: size.name || '',
        description: size.description || '',
      });
    } catch (err) {
      setError('Failed to fetch size details.');
      console.error('Error fetching size:', err);
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const validate = () => {
    if (!form.name.trim()) return 'Size name is required.';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const validationError = validate();
    if (validationError) {
      setToast({ show: true, message: validationError, type: 'error' });
      return;
    }
    setLoading(true);
    try {
      await sizesAPI.updateSize(id, form);
      setToast({ show: true, message: 'Size updated successfully!', type: 'success' });
      setTimeout(() => navigate('/sizes'), 1200);
    } catch (err) {
      setToast({ show: true, message: err.response?.data?.message || err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100 py-8 px-2">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 px-8 py-6 bg-gradient-to-r from-blue-600 to-blue-400">
          <button onClick={() => navigate('/sizes')} className="text-white hover:bg-blue-700 rounded-full p-2 transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <Save className="h-7 w-7 text-white" />
          <div>
            <h1 className="text-2xl font-bold text-white">Edit Size</h1>
            <p className="text-blue-100">Update the size details.</p>
          </div>
        </div>
        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 py-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block font-medium mb-1 text-slate-700">Size Name <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                name="name" 
                value={form.name} 
                onChange={handleChange} 
                required 
                className="w-full border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 bg-slate-50" 
                placeholder="e.g., Small, Medium, Large, XL"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block font-medium mb-1 text-slate-700">Description</label>
              <textarea 
                name="description" 
                value={form.description} 
                onChange={handleChange} 
                rows={4}
                className="w-full border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 bg-slate-50" 
                placeholder="Optional description for this size..."
              />
            </div>
          </div>
          {/* Feedback */}
          {toast.show && (
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={() => setToast({ ...toast, show: false })}
            />
          )}
          {/* Actions */}
          <div className="flex gap-3 mt-4">
            <button 
              type="button" 
              onClick={() => navigate('/sizes')} 
              className="flex-1 px-4 py-2 border border-slate-200 rounded-lg bg-slate-50 hover:bg-slate-100 font-medium text-slate-700 flex items-center justify-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" /> Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading} 
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium flex items-center justify-center gap-2"
            >
              <Save className="h-4 w-4" /> {loading ? 'Updating...' : 'Update Size'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 