import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../../components/navbar";
import Usertab from "../../../components/user-tab";
import Footer from "../../../components/footer";
import Switcher from "../../../components/switcher";
import ScrollToTop from "../../../components/scroll-to-top";
import { FiEdit, FiMapPin, FiPhone } from '../../../assets/icons/vander'

export default function UserBilling() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [formType, setFormType] = useState('billing');
  const [formData, setFormData] = useState({
    street: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
    isDefault: false
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = () => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) return;
    setLoading(true);
    fetch('https://zyqora.onrender.com/api/addresses', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setAddresses(data);
        }
      })
      .finally(() => setLoading(false));
  };

  const renderAddress = (address) => (
    <>
      <ul className="list-none">
        <li className="flex ms-0">
          <FiMapPin className="size-4 me-2 mt-1"></FiMapPin>
          <p className="text-slate-400">
            {address?.street || ''}<br />
            {address?.city || ''}{address?.state ? ', ' + address.state : ''}{address?.country ? ', ' + address.country : ''} {address?.zipCode || ''}
          </p>
        </li>
      </ul>
      {address?.isDefault && <span className="text-xs text-orange-500">Default</span>}
    </>
  );

  const handleEditClick = (type) => {
    setFormType(type);
    setShowAddressForm(true);
    setFormData({
      street: '',
      city: '',
      state: '',
      country: '',
      zipCode: '',
      isDefault: false
    });
    setError('');
  };

  const handleFormChange = (e) => {
    const { name, value, type: inputType, checked } = e.target;
    setFormData({
      ...formData,
      [name]: inputType === 'checkbox' ? checked : value
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    try {
      const res = await fetch('https://zyqora.onrender.com/api/addresses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      if (!res.ok) {
        const err = await res.json();
        setError(err.message || 'Failed to add address');
      } else {
        setShowAddressForm(false);
        fetchAddresses();
      }
    } catch (err) {
      setError('Failed to add address');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar navClass="defaultscroll is-sticky" />
      <section className="relative lg:pb-24 pb-16 md:mt-[84px] mt-[70px]">
        <div className="md:container container-fluid relative">
          <div className="relative overflow-hidden md:rounded-md shadow dark:shadow-gray-700 h-52 bg-[url('../../assets/images/hero/pages.jpg')] bg-center bg-no-repeat bg-cover"></div>
        </div>

        <div className="container relative md:mt-24 mt-16">
          <div className="md:flex">
            <Usertab />

            <div className="lg:w-3/4 md:w-2/3 md:px-3 mt-6 md:mt-0">
              <div className="p-6 rounded-md shadow dark:shadow-gray-800 bg-white dark:bg-slate-900">
                <h6 className="text-slate-400 mb-0">The following addresses will be used on the checkout page by default.</h6>
                <div className="grid lg:grid-cols-2 grid-cols-1 gap-6 mt-6">
                  <div className="">
                    <div className="flex items-center mb-4 justify-between">
                      <h5 className="text-xl font-medium">Billing Address:</h5>
                      <button type="button" className="text-orange-500 text-lg" onClick={() => handleEditClick('billing')}><FiEdit className="size-4"></FiEdit></button>
                    </div>
                    <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                      {loading ? (
                        <p className="text-slate-400">Loading...</p>
                      ) : addresses.length > 0 ? (
                        renderAddress(addresses[0])
                      ) : (
                        <p className="text-slate-400">No billing address found.</p>
                      )}
                    </div>
                  </div>

                  <div className="">
                    <div className="flex items-center mb-4 justify-between">
                      <h5 className="text-xl font-medium">Shipping Address:</h5>
                      <button type="button" className="text-orange-500 text-lg" onClick={() => handleEditClick('shipping')}><FiEdit className="size-4"></FiEdit></button>
                    </div>
                    <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                      {loading ? (
                        <p className="text-slate-400">Loading...</p>
                      ) : addresses.length > 1 ? (
                        renderAddress(addresses[1])
                      ) : addresses.length === 1 ? (
                        renderAddress(addresses[0])
                      ) : (
                        <p className="text-slate-400">No shipping address found.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              {/* Address Form Modal */}
              {showAddressForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                  <div className="bg-white dark:bg-slate-900 p-8 rounded shadow-lg w-full max-w-md relative">
                    <button className="absolute top-2 right-2 text-gray-400 hover:text-orange-500" onClick={() => setShowAddressForm(false)}>&times;</button>
                    <h4 className="text-lg font-semibold mb-4">Add {formType === 'billing' ? 'Billing' : 'Shipping'} Address</h4>
                    <form onSubmit={handleFormSubmit} className="space-y-3">
                      <input type="text" name="street" value={formData.street} onChange={handleFormChange} placeholder="Street Address" className="w-full border rounded px-3 py-2" required />
                      <input type="text" name="city" value={formData.city} onChange={handleFormChange} placeholder="City" className="w-full border rounded px-3 py-2" required />
                      <input type="text" name="state" value={formData.state} onChange={handleFormChange} placeholder="State" className="w-full border rounded px-3 py-2" required />
                      <input type="text" name="country" value={formData.country} onChange={handleFormChange} placeholder="Country" className="w-full border rounded px-3 py-2" required />
                      <input type="text" name="zipCode" value={formData.zipCode} onChange={handleFormChange} placeholder="ZIP/Postal Code" className="w-full border rounded px-3 py-2" required />
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" name="isDefault" checked={formData.isDefault} onChange={handleFormChange} />
                        <span>Set as default address</span>
                      </label>
                      {error && <div className="text-red-500 text-sm">{error}</div>}
                      <button type="submit" className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600" disabled={submitting}>{submitting ? 'Saving...' : 'Save Address'}</button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      <Footer />
      <Switcher />
      <ScrollToTop />
    </>
  )
}