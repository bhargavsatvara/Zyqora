import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { brandsAPI } from '../services/api';
import { Plus, Image as ImageIcon, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';

export default function AddBrand() {
  const [form, setForm] = useState({
    name: '',
    description: '',
    founded: '',
    country: '',
    website: '',
    status: 'active',
    logo: null,
  });
  const [logoPreview, setLogoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const fileInputRef = useRef();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'logo') {
      const file = files[0];
      setForm(f => ({ ...f, logo: file }));
      setLogoPreview(file ? URL.createObjectURL(file) : null);
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setForm(f => ({ ...f, logo: file }));
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const validate = () => {
    if (!form.name.trim()) return 'Brand name is required.';
    if (form.website && !/^https?:\/\//.test(form.website)) return 'Website must start with http:// or https://';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });
      await brandsAPI.addBrand(formData);
      setSuccess('Brand added successfully!');
      setTimeout(() => navigate('/brands'), 1200);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100 py-8 px-2">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 px-8 py-6 bg-gradient-to-r from-blue-600 to-blue-400">
          <button onClick={() => navigate('/brands')} className="text-white hover:bg-blue-700 rounded-full p-2 transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <Plus className="h-7 w-7 text-white" />
          <div>
            <h1 className="text-2xl font-bold text-white">Add Brand</h1>
            <p className="text-blue-100">Fill in the details to create a new brand.</p>
          </div>
        </div>
        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 py-8 space-y-6">
          {/* Logo Upload */}
          <div>
            <label className="block font-medium mb-2 text-slate-700">Brand Logo</label>
            <div
              className="flex flex-col items-center justify-center border-2 border-dashed border-blue-300 rounded-xl p-6 bg-blue-50 hover:bg-blue-100 cursor-pointer transition-all relative"
              onClick={() => fileInputRef.current.click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              {logoPreview ? (
                <img src={logoPreview} alt="Logo Preview" className="h-28 object-contain rounded-lg border mb-2" />
              ) : (
                <ImageIcon className="h-12 w-12 text-blue-400 mb-2" />
              )}
              <span className="text-blue-700 font-medium">{logoPreview ? 'Change Logo' : 'Drag & drop or click to upload'}</span>
              <input
                type="file"
                name="logo"
                accept="image/*"
                onChange={handleChange}
                ref={fileInputRef}
                className="hidden"
              />
            </div>
          </div>
          {/* Brand Info Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-medium mb-1 text-slate-700">Brand Name <span className="text-red-500">*</span></label>
              <input type="text" name="name" value={form.name} onChange={handleChange} required className="w-full border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 bg-slate-50" />
            </div>
            <div>
              <label className="block font-medium mb-1 text-slate-700">Founded</label>
              <input type="number" name="founded" value={form.founded} onChange={handleChange} className="w-full border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 bg-slate-50" />
            </div>
            <div>
              <label className="block font-medium mb-1 text-slate-700">Country</label>
              <input type="text" name="country" value={form.country} onChange={handleChange} className="w-full border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 bg-slate-50" />
            </div>
            <div>
              <label className="block font-medium mb-1 text-slate-700">Website</label>
              <input type="url" name="website" value={form.website} onChange={handleChange} placeholder="https://example.com" className="w-full border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 bg-slate-50" />
            </div>
            <div className="md:col-span-2">
              <label className="block font-medium mb-1 text-slate-700">Status</label>
              <select name="status" value={form.status} onChange={handleChange} className="w-full border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 bg-slate-50">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block font-medium mb-1 text-slate-700">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={3} className="w-full border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 bg-slate-50" />
          </div>
          {/* Feedback */}
          {error && (
            <div className="flex items-center gap-2 text-red-600 font-medium bg-red-50 border border-red-200 rounded-lg px-4 py-2">
              <AlertCircle className="h-5 w-5" /> {error}
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 text-green-600 font-medium bg-green-50 border border-green-200 rounded-lg px-4 py-2">
              <CheckCircle className="h-5 w-5" /> {success}
            </div>
          )}
          {/* Actions */}
          <div className="flex gap-3 mt-4">
            <button type="button" onClick={() => navigate('/brands')} className="flex-1 px-4 py-2 border border-slate-200 rounded-lg bg-slate-50 hover:bg-slate-100 font-medium text-slate-700 flex items-center justify-center gap-2">
              <ArrowLeft className="h-4 w-4" /> Cancel
            </button>
            <button type="submit" disabled={loading} className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium flex items-center justify-center gap-2">
              <Plus className="h-4 w-4" /> {loading ? 'Adding...' : 'Add Brand'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 