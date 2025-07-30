import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../../components/navbar";
import Usertab from "../../../components/user-tab";
import Footer from "../../../components/footer";
import Switcher from "../../../components/switcher";
import ScrollToTop from "../../../components/scroll-to-top";
import { FiEdit, FiMapPin, FiPhone } from '../../../assets/icons/vander'
import { addressesAPI, countriesAPI, statesAPI, citiesAPI } from "../../../services/api";

export default function UserBilling() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [formType, setFormType] = useState('billing');
  const [formData, setFormData] = useState({
    street: '',
    city_id: '',
    state_id: '',
    country_id: '',
    zipCode: '',
    isDefault: false
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);

  useEffect(() => {
    fetchAddresses();
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    setLoadingCountries(true);
    try {
      console.log('Fetching countries...');
      const response = await countriesAPI.getCountries();
      console.log('Countries response:', response);
      const data = response.data;
      console.log('Countries data:', data);
      
      // Handle nested response structure
      let countriesData = [];
      if (data && data.data && data.data.countries) {
        countriesData = data.data.countries;
      } else if (Array.isArray(data)) {
        countriesData = data;
      } else if (data && Array.isArray(data.countries)) {
        countriesData = data.countries;
      }
      
      console.log('Countries data extracted:', countriesData);
      setCountries(countriesData);
    } catch (error) {
      console.error('Error fetching countries:', error);
    } finally {
      setLoadingCountries(false);
    }
  };

  const fetchStates = async (countryId) => {
    if (!countryId) {
      setStates([]);
      return;
    }
    setLoadingStates(true);
    try {
      console.log('Fetching states for country:', countryId);
      const response = await statesAPI.getStates({ country_id: countryId });
      console.log('States response:', response);
      const data = response.data;
      console.log('States data:', data);
      
      // Handle nested response structure
      let statesData = [];
      if (data && data.data && data.data.states) {
        statesData = data.data.states;
      } else if (Array.isArray(data)) {
        statesData = data;
      } else if (data && Array.isArray(data.states)) {
        statesData = data.states;
      }
      
      console.log('States data extracted:', statesData);
      setStates(statesData);
    } catch (error) {
      console.error('Error fetching states:', error);
    } finally {
      setLoadingStates(false);
    }
  };

  const fetchCities = async (stateId) => {
    if (!stateId) {
      setCities([]);
      return;
    }
    setLoadingCities(true);
    try {
      console.log('Fetching cities for state:', stateId);
      const response = await citiesAPI.getCities({ state_id: stateId });
      console.log('Cities response:', response);
      const data = response.data;
      console.log('Cities data:', data);
      
      // Handle nested response structure
      let citiesData = [];
      if (data && data.data && data.data.cities) {
        citiesData = data.data.cities;
      } else if (Array.isArray(data)) {
        citiesData = data;
      } else if (data && Array.isArray(data.cities)) {
        citiesData = data.cities;
      }
      
      console.log('Cities data extracted:', citiesData);
      setCities(citiesData);
    } catch (error) {
      console.error('Error fetching cities:', error);
    } finally {
      setLoadingCities(false);
    }
  };

  const fetchAddresses = () => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) return;
    setLoading(true);
    addressesAPI.getAddresses()
      .then(res => {
        const data = res.data;
        if (Array.isArray(data)) {
          setAddresses(data);
        }
      })
      .catch(error => {
        console.error('Error fetching addresses:', error);
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
      city_id: '',
      state_id: '',
      country_id: '',
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

    // Handle cascading dropdowns
    if (name === 'country_id') {
      // Reset state and city when country changes
      setFormData(prev => ({
        ...prev,
        state_id: '',
        city_id: ''
      }));
      setStates([]);
      setCities([]);
      if (value) {
        fetchStates(value);
      }
    } else if (name === 'state_id') {
      // Reset city when state changes
      setFormData(prev => ({
        ...prev,
        city_id: ''
      }));
      setCities([]);
      if (value) {
        fetchCities(value);
      }
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const res = await addressesAPI.createAddress(formData);
      setShowAddressForm(false);
      fetchAddresses();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add address');
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
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-40">
                  <div className="bg-white dark:bg-slate-900 p-8 rounded shadow-lg w-full max-w-md relative">
                    <button className="absolute top-2 right-2 text-gray-400 hover:text-orange-500" onClick={() => setShowAddressForm(false)}>&times;</button>
                    <h4 className="text-lg font-semibold mb-4">Add {formType === 'billing' ? 'Billing' : 'Shipping'} Address</h4>
                    <form onSubmit={handleFormSubmit} className="space-y-3">
                      <input type="text" name="street" value={formData.street} onChange={handleFormChange} placeholder="Street Address" className="w-full border rounded px-3 py-2" required />
                      
                      {/* Country Dropdown */}
                      <select 
                        name="country_id" 
                        value={formData.country_id} 
                        onChange={handleFormChange} 
                        className="w-full border rounded px-3 py-2" 
                        required
                        disabled={loadingCountries}
                      >
                        <option value="">{loadingCountries ? 'Loading countries...' : 'Select Country'}</option>
                        {countries.map(country => (
                          <option key={country._id} value={country._id}>
                            {country.name}
                          </option>
                        ))}
                      </select>
                      
                      {/* State Dropdown */}
                      <select 
                        name="state_id" 
                        value={formData.state_id} 
                        onChange={handleFormChange} 
                        className="w-full border rounded px-3 py-2" 
                        required
                        disabled={loadingStates || !formData.country_id}
                      >
                        <option value="">{loadingStates ? 'Loading states...' : 'Select State'}</option>
                        {states.map(state => (
                          <option key={state._id} value={state._id}>
                            {state.name}
                          </option>
                        ))}
                      </select>
                      
                      {/* City Dropdown */}
                      <select 
                        name="city_id" 
                        value={formData.city_id} 
                        onChange={handleFormChange} 
                        className="w-full border rounded px-3 py-2" 
                        required
                        disabled={loadingCities || !formData.state_id}
                      >
                        <option value="">{loadingCities ? 'Loading cities...' : 'Select City'}</option>
                        {cities.map(city => (
                          <option key={city._id} value={city._id}>
                            {city.name}
                          </option>
                        ))}
                      </select>
                      
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