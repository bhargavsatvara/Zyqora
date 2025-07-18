import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { citiesAPI, statesAPI } from '../services/api';
import { Plus, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';

export default function AddCity() {
  const [form, setForm] = useState({
    name: '',
    state_id: '',
  });
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchStates();
  }, []);

  const fetchStates = async () => {
    try {
      const response = await statesAPI.getStates();
      console.log('States API response in AddCity:', response);
      let statesData = [];
      if (response.data && response.data.data && response.data.data.states) {
        statesData = response.data.data.states;
      } else if (response.data && response.data.states) {
        statesData = response.data.states;
      } else if (Array.isArray(response.data)) {
        statesData = response.data;
      } else {
        statesData = [];
      }
      setStates(statesData);
    } catch (err) {
      console.error('Error fetching states in AddCity:', err);
      setError('Failed to fetch states.');
      setStates([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const validate = () => {
    if (!form.name.trim()) return 'City name is required.';
    if (!form.state_id) return 'State is required.';
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
      await citiesAPI.createCity(form);
      setSuccess('City added successfully!');
      setTimeout(() => navigate('/cities'), 1200);
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
          <button onClick={() => navigate('/cities')} className="text-white hover:bg-blue-700 rounded-full p-2 transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <Plus className="h-7 w-7 text-white" />
          <div>
            <h1 className="text-2xl font-bold text-white">Add City</h1>
            <p className="text-blue-100">Fill in the details to create a new city.</p>
          </div>
        </div>
        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 py-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block font-medium mb-1 text-slate-700">City Name <span className="text-red-500">*</span></label>
              <input type="text" name="name" value={form.name} onChange={handleChange} required className="w-full border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 bg-slate-50" />
            </div>
            <div className="md:col-span-2">
              <label className="block font-medium mb-1 text-slate-700">State <span className="text-red-500">*</span></label>
              <select name="state_id" value={form.state_id} onChange={handleChange} required className="w-full border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 bg-slate-50">
                <option value="">Select a state</option>
                {Array.isArray(states) && states.map((state) => (
                  <option key={state._id} value={state._id}>{state.name}</option>
                ))}
              </select>
            </div>
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
            <button type="button" onClick={() => navigate('/cities')} className="flex-1 px-4 py-2 border border-slate-200 rounded-lg bg-slate-50 hover:bg-slate-100 font-medium text-slate-700 flex items-center justify-center gap-2">
              <ArrowLeft className="h-4 w-4" /> Cancel
            </button>
            <button type="submit" disabled={loading} className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium flex items-center justify-center gap-2">
              <Plus className="h-4 w-4" /> {loading ? 'Adding...' : 'Add City'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 