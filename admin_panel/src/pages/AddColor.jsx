import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { colorsAPI } from '../services/api';
import { Plus, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import Toast from '../components/Toast';

export default function AddColor() {
  const [form, setForm] = useState({
    name: '',
    hex_code: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const navigate = useNavigate();

  React.useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => setToast({ ...toast, show: false }), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const validate = () => {
    if (!form.name.trim()) return 'Color name is required.';
    if (form.hex_code && !/^#[0-9A-F]{6}$/i.test(form.hex_code)) return 'Hex code must be a valid color (e.g., #FF0000)';
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
      await colorsAPI.createColor(form);
      setToast({ show: true, message: 'Color added successfully!', type: 'success' });
      setTimeout(() => navigate('/colors'), 1200);
    } catch (err) {
      setToast({ show: true, message: err.response?.data?.message || err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100 py-8 px-2">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 px-8 py-6 bg-gradient-to-r from-blue-600 to-blue-400">
          <button onClick={() => navigate('/colors')} className="text-white hover:bg-blue-700 rounded-full p-2 transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <Plus className="h-7 w-7 text-white" />
          <div>
            <h1 className="text-2xl font-bold text-white">Add Color</h1>
            <p className="text-blue-100">Fill in the details to create a new color.</p>
          </div>
        </div>
        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 py-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block font-medium mb-1 text-slate-700">Color Name <span className="text-red-500">*</span></label>
              <input type="text" name="name" value={form.name} onChange={handleChange} required className="w-full border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 bg-slate-50" />
            </div>
            <div className="md:col-span-2">
              <label className="block font-medium mb-1 text-slate-700">Hex Code</label>
              <div className="flex items-center gap-3">
                <input 
                  type="color" 
                  name="hex_code" 
                  value={form.hex_code || '#000000'} 
                  onChange={handleChange} 
                  className="w-12 h-12 border border-slate-200 rounded-lg cursor-pointer" 
                />
                <input 
                  type="text" 
                  name="hex_code" 
                  value={form.hex_code} 
                  onChange={handleChange} 
                  placeholder="#000000" 
                  className="flex-1 border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 bg-slate-50" 
                />
              </div>
              <p className="text-xs text-slate-500 mt-1">Optional: Enter a hex color code (e.g., #FF0000 for red)</p>
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
            <button type="button" onClick={() => navigate('/colors')} className="flex-1 px-4 py-2 border border-slate-200 rounded-lg bg-slate-50 hover:bg-slate-100 font-medium text-slate-700 flex items-center justify-center gap-2">
              <ArrowLeft className="h-4 w-4" /> Cancel
            </button>
            <button type="submit" disabled={loading} className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium flex items-center justify-center gap-2">
              <Plus className="h-4 w-4" /> {loading ? 'Adding...' : 'Add Color'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 