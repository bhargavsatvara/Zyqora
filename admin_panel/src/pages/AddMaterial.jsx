import React, { useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { materialsAPI } from '../services/api';
import { useToast } from '../contexts/ToastContext';

export default function AddMaterial() {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const [form, setForm] = useState({ name: '', description: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError('Material name is required');
      return;
    }
    setLoading(true);
    try {
      await materialsAPI.createMaterial(form);
      showSuccess('Material added successfully!');
      navigate('/materials');
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-8">
      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={() => navigate('/materials')}
          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-3xl font-bold text-slate-900">Add Material</h1>
      </div>
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Material Name *</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border rounded-xl border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-4 py-3 border rounded-xl border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Optional description..."
          />
        </div>
        {error && <div className="text-red-600 text-sm font-medium mt-2">{error}</div>}
        <div className="flex gap-3 mt-4">
          <button
            type="button"
            onClick={() => navigate('/materials')}
            className="flex-1 px-4 py-2 border border-slate-200 rounded-lg bg-slate-50 hover:bg-slate-100 font-medium text-slate-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Save className="h-4 w-4" /> Add Material
          </button>
        </div>
      </form>
    </div>
  );
} 