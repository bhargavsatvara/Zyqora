import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productsAPI } from '../services/api';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
const FILE_BASE_URL = API_BASE_URL.replace(/\/api$/, '');

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showError } = useToast();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
    // eslint-disable-next-line
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const response = await productsAPI.getProduct(id);
      let prod = response.data;
      let imageUrl = prod.image
        ? prod.image.startsWith('/uploads/')
          ? FILE_BASE_URL + prod.image
          : prod.image
        : null;
      setProduct({ ...prod, imageUrl });
    } catch (error) {
      showError('Error fetching product: ' + (error.response?.data?.message || error.message));
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={() => navigate('/products')}
          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-3xl font-bold text-slate-900">Product Details</h1>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 flex flex-col md:flex-row gap-8">
        <div className="flex-shrink-0 w-full md:w-80 flex items-center justify-center">
          <img
            src={product.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image'}
            alt={product.name}
            className="w-full h-64 object-cover rounded-xl border"
          />
        </div>
        <div className="flex-1 space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">{product.name}</h2>
            <p className="text-slate-600 mb-2">SKU: <span className="font-mono">{product.sku || 'N/A'}</span></p>
            <p className="text-slate-600 mb-2">Category: <span className="font-medium">{product.category_id?.name || 'Uncategorized'}</span></p>
            <p className="text-slate-600 mb-2">Brand: <span className="font-medium">{product.brand_id?.name || 'No Brand'}</span></p>
            <p className="text-slate-600 mb-2">Stock: <span className="font-medium">{product.stock_qty || 0}</span></p>
            <p className="text-slate-600 mb-2">Price: <span className="font-bold text-lg">${product.price?.toFixed(2) || '0.00'}</span></p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Description</h3>
            <p className="text-slate-700 whitespace-pre-line">{product.description || 'No description provided.'}</p>
          </div>
        </div>
      </div>
    </div>
  );
} 