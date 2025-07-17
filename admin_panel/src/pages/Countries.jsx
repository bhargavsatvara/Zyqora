import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { countriesAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Countries() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(null); // country object or null
  const [form, setForm] = useState({ name: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCountries, setTotalCountries] = useState(0);
  const [deleteCountryId, setDeleteCountryId] = useState(null);
  const [deleteError, setDeleteError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCountries();
    // eslint-disable-next-line
  }, [currentPage, searchTerm]);

  const fetchCountries = async () => {
    setLoading(true);
    try {
      const params = { page: currentPage, limit: 10, search: searchTerm || undefined };
      const response = await countriesAPI.getCountries(params);
      let data = response.data;
      if (Array.isArray(data)) {
        setCountries(data);
        setTotalPages(1);
        setTotalCountries(data.length);
      } else if (data.data && data.data.countries) {
        setCountries(data.data.countries);
        setTotalPages(data.data.pagination?.total || 1);
        setTotalCountries(data.data.pagination?.totalRecords || data.data.countries.length);
      } else {
        setCountries([]);
        setTotalPages(1);
        setTotalCountries(0);
      }
    } catch (err) {
      setCountries([]);
      setTotalPages(1);
      setTotalCountries(0);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleAddCountry = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!form.name.trim()) {
      setError('Country name is required');
      return;
    }
    try {
      await countriesAPI.createCountry(form);
      setSuccess('Country added successfully!');
      setShowAdd(false);
      setForm({ name: '' });
      fetchCountries();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const handleEditCountry = (country) => {
    navigate(`/countries/edit/${country._id}`);
  };

  const handleUpdateCountry = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!form.name.trim()) {
      setError('Country name is required');
      return;
    }
    try {
      await countriesAPI.updateCountry(showEdit._id, form);
      setSuccess('Country updated successfully!');
      setShowEdit(null);
      setForm({ name: '' });
      fetchCountries();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const handleDeleteCountry = async () => {
    if (!deleteCountryId) return;
    setDeleteError('');
    try {
      await countriesAPI.deleteCountry(deleteCountryId);
      setDeleteCountryId(null);
      fetchCountries();
    } catch (err) {
      setDeleteError(err.response?.data?.message || err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Countries</h1>
          <p className="text-slate-600 mt-2">Manage countries</p>
        </div>
        <button onClick={() => { navigate('/countries/add'); }} className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 flex items-center gap-2 shadow-lg transition-all">
          <Plus className="h-4 w-4" />
          Add Country
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search countries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-4 pr-4 py-3 w-full border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Countries Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {countries.map((country) => (
                <tr key={country._id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-slate-900">{country.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleEditCountry(country)}
                        className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 p-2 rounded-lg transition-colors"
                        title="Edit Country"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => setDeleteCountryId(country._id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
                        title="Delete Country"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Empty State */}
        {countries.length === 0 && !loading && (
          <div className="text-center py-12">
            <h3 className="mt-2 text-sm font-medium text-slate-900">No countries found</h3>
            <p className="mt-1 text-sm text-slate-500">
              {searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating a new country.'}
            </p>
            {!searchTerm && (
              <div className="mt-6">
                <button
                  onClick={() => { navigate('/countries/add'); }}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Country
                </button>
              </div>
            )}
          </div>
        )}
        {/* Error feedback for delete */}
        {deleteError && (
          <div className="text-red-600 text-sm font-medium px-6 py-2">{deleteError}</div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="text-sm text-slate-600">
            Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, totalCountries)} of {totalCountries} countries
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-3 py-2 text-sm text-slate-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {(showAdd || showEdit) && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md p-8 relative">
            <button onClick={() => { setShowAdd(false); setShowEdit(null); setForm({ name: '' }); setError(''); setSuccess(''); }} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"><ArrowLeft className="h-5 w-5" /></button>
            <h2 className="text-xl font-bold text-slate-900 mb-2">{showAdd ? 'Add Country' : 'Edit Country'}</h2>
            <form onSubmit={showAdd ? handleAddCountry : handleUpdateCountry} className="space-y-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Country Name *</label>
                <input type="text" name="name" value={form.name} onChange={handleInputChange} className="w-full px-4 py-3 border rounded-xl border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
              </div>
              {error && <div className="text-red-600 text-sm font-medium mt-2">{error}</div>}
              {success && <div className="text-green-600 text-sm font-medium mt-2">{success}</div>}
              <div className="flex gap-3 mt-4">
                <button type="button" onClick={() => { setShowAdd(false); setShowEdit(null); setForm({ name: '' }); setError(''); setSuccess(''); }} className="flex-1 px-4 py-2 border border-slate-200 rounded-lg bg-slate-50 hover:bg-slate-100 font-medium text-slate-700">Cancel</button>
                <button type="submit" className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium flex items-center justify-center gap-2">
                  <Plus className="h-4 w-4" /> {showAdd ? 'Add Country' : 'Update Country'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      {deleteCountryId && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md p-8 relative">
            <h2 className="text-xl font-bold text-slate-900 mb-2">Delete Country</h2>
            <p className="mb-4 text-slate-700">Are you sure you want to delete this country? This action cannot be undone.</p>
            <div className="flex gap-3 mt-4">
              <button type="button" onClick={() => setDeleteCountryId(null)} className="flex-1 px-4 py-2 border border-slate-200 rounded-lg bg-slate-50 hover:bg-slate-100 font-medium text-slate-700">Cancel</button>
              <button type="button" onClick={handleDeleteCountry} className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 font-medium flex items-center justify-center gap-2">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 