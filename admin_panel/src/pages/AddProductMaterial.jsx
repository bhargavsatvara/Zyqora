import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { productMaterialsAPI } from '../services/api';
import { useToast } from '../contexts/ToastContext';
import { productsAPI, materialsAPI } from '../services/api';

export default function AddProductMaterial() {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const [form, setForm] = useState({ product_id: '', material_ids: [] });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [materials, setMaterials] = useState([]);

  useEffect(() => {
    fetchProducts();
    fetchMaterials();
    // eslint-disable-next-line
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await productsAPI.getProducts({ limit: 100 });
      setProducts(res.data.data.products || []);
    } catch (err) {
      setProducts([]);
    }
  };
  
  const fetchMaterials = async () => {
    try {
      const res = await materialsAPI.getMaterials({ limit: 100 });
      setMaterials(res.data.data.materials || []);
    } catch (err) {
      setMaterials([]);
    }
  };

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleMaterialChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setForm(prev => ({ ...prev, material_ids: selectedOptions }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.product_id) {
      setError('Product is required');
      return;
    }
    if (!form.material_ids.length) {
      setError('At least one material is required');
      return;
    }
    setLoading(true);
    try {
      await productMaterialsAPI.createProductMaterial(form);
      showSuccess('Product materials association added successfully!');
      navigate('/product-materials');
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
          onClick={() => navigate('/product-materials')}
          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-3xl font-bold text-slate-900">Add Product Materials</h1>
      </div>
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Product *</label>
          <select
            name="product_id"
            value={form.product_id}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border rounded-xl border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Select product</option>
            {products.map((p) => (
              <option key={p._id} value={p._id}>{p.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Materials * (Hold Ctrl/Cmd to select multiple)</label>
          <select
            name="material_ids"
            multiple
            value={form.material_ids}
            onChange={handleMaterialChange}
            className="w-full px-4 py-3 border rounded-xl border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[120px]"
            required
          >
            {materials.map((m) => (
              <option key={m._id} value={m._id}>{m.name}</option>
            ))}
          </select>
          <p className="text-xs text-slate-500 mt-1">Selected: {form.material_ids.length} material(s)</p>
        </div>
        {error && <div className="text-red-600 text-sm font-medium mt-2">{error}</div>}
        <div className="flex gap-3 mt-4">
          <button
            type="button"
            onClick={() => navigate('/product-materials')}
            className="flex-1 px-4 py-2 border border-slate-200 rounded-lg bg-slate-50 hover:bg-slate-100 font-medium text-slate-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Save className="h-4 w-4" /> Add Materials
          </button>
        </div>
      </form>
    </div>
  );
} 