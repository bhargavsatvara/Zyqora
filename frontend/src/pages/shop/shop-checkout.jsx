import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import ScrollToTop from "../../components/scroll-to-top";
import { useCart } from "../../contexts/CartContext";
import { userAPI, ordersAPI, countriesAPI, statesAPI, citiesAPI } from "../../services/api";

const stripePromise = loadStripe('pk_test_51RnLFbFW8XM59bhWaYOroZ29ELB4xWqWiadqhP8CPAl3RvZL8ahBcZTdHxI94f9r0hn9IJNaO8BOGcQXrpE2SBYF00CkTXOTtd'); // TODO: Replace with your real Stripe publishable key

function CheckoutForm({ countries, states, cities, selectedCountry, setSelectedCountry, selectedState, setSelectedState, selectedCity, setSelectedCity, zipCode, setZipCode }) {
    const { cartData, totals, fetchCart } = useCart();
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        address: '',
        address2: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
    const [addresses, setAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState('');
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [addressForm, setAddressForm] = useState({
        street: '',
        city: '',
        state: '',
        country: '',
        zipCode: '',
        isDefault: false
    });
    const [addingAddress, setAddingAddress] = useState(false);
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();

    // Add state for address form dropdowns
    const [addressCountry, setAddressCountry] = useState('');
    const [addressState, setAddressState] = useState('');
    const [addressCity, setAddressCity] = useState('');
    const [addressStates, setAddressStates] = useState([]);
    const [addressCities, setAddressCities] = useState([]);

    const [, setUser] = useState({ name: '', email: '' });

    useEffect(() => {
        // Fetch data only once on mount
        const initializeData = async () => {
            try {
                // Fetch addresses
                await fetchAddresses();
                
                // Fetch user info
                const token = localStorage.getItem('token') || sessionStorage.getItem('token');
                if (token) {
                    const res = await userAPI.getProfile();
                    const name = res.data.name || (res.data.data && res.data.data.name) || '';
                    const email = res.data.email || (res.data.data && res.data.data.email) || '';
                    setUser({ name, email });
                    setForm(f => ({ ...f, firstName: name, email }));
                }
            } catch (error) {
                console.error('Error initializing checkout data:', error);
            }
        };
        
        initializeData();
    }, []); // Empty dependency array - run only once



    const fetchAddresses = async () => {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) return;
        try {
            const res = await userAPI.getAddresses();
            const data = res.data;
            if (Array.isArray(data)) {
                setAddresses(data);
            }
        } catch (e) {
            setAddresses([]);
        }
    };

    // When an address is selected, fill the form fields
    useEffect(() => {
        if (selectedAddressId && addresses.length > 0 && countries.length > 0) {
            const addr = addresses.find(a => a._id === selectedAddressId);
            if (addr) {
                setForm(f => ({
                    ...f,
                    address: addr.street,
                    address2: '',
                }));
                setZipCode(addr.zipCode || '');
                
                // Find and set country, state, city IDs
                const countryId = countries.find(c => c.name === addr.country)?._id || '';
                const stateId = states.find(s => s.name === addr.state)?._id || '';
                const cityId = cities.find(c => c.name === addr.city)?._id || '';
                
                setSelectedCountry(countryId);
                setSelectedState(stateId);
                setSelectedCity(cityId);
            }
        }
    }, [selectedAddressId, addresses, countries, states, cities, setZipCode, setSelectedCountry, setSelectedState, setSelectedCity]);

    // Fetch states for address form
    useEffect(() => {
        if (!addressCountry) {
            setAddressStates([]);
            setAddressState('');
            setAddressCities([]);
            setAddressCity('');
            return;
        }
        
        let isMounted = true;
        async function fetchStates() {
            try {
                const res = await statesAPI.getStates({ country_id: addressCountry });
                if (isMounted) {
                    const data = res.data;
                    setAddressStates((data.data && data.data.states) ? data.data.states : []);
                }
            } catch (e) {
                if (isMounted) {
                    setAddressStates([]);
                }
            }
        }
        fetchStates();
        
        return () => {
            isMounted = false;
        };
    }, [addressCountry]);
    
    // Fetch cities for address form
    useEffect(() => {
        if (!addressState) {
            setAddressCities([]);
            setAddressCity('');
            return;
        }
        
        let isMounted = true;
        async function fetchCities() {
            try {
                const res = await citiesAPI.getCities({ state_id: addressState });
                if (isMounted) {
                    const data = res.data;
                    setAddressCities((data.data && data.data.cities) ? data.data.cities : []);
                }
            } catch (e) {
                if (isMounted) {
                    setAddressCities([]);
                }
            }
        }
        fetchCities();
        
        return () => {
            isMounted = false;
        };
    }, [addressState]);

    const handleInput = e => {
        setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    };

    const handleAddressFormChange = e => {
        const { name, value, type, checked } = e.target;
        if (name === 'country') {
            setAddressCountry(value);
            setAddressForm(f => ({ ...f, country: countries.find(c => c._id === value)?.name || '' }));
        } else if (name === 'state') {
            setAddressState(value);
            setAddressForm(f => ({ ...f, state: addressStates.find(s => s._id === value)?.name || '' }));
        } else if (name === 'city') {
            setAddressCity(value);
            setAddressForm(f => ({ ...f, city: addressCities.find(c => c._id === value)?.name || '' }));
        } else {
            setAddressForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
        }
    };

    const handleAddAddress = async e => {
        e.preventDefault();
        setAddingAddress(true);
        setError('');
        try {
            await userAPI.createAddress(addressForm);
            setShowAddressForm(false);
            setAddressForm({ street: '', city: '', state: '', country: '', zipCode: '', isDefault: false });
            fetchAddresses();
        } catch (err) {
            setError('Failed to add address');
        } finally {
            setAddingAddress(false);
        }
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);
        if (!stripe || !elements) {
            setError('Stripe not loaded');
            setLoading(false);
            return;
        }
        // Require city selection
        if (!selectedCity) {
            setError('Please select a city.');
            setLoading(false);
            return;
        }
        // 1. Prepare billing address and cart items
        const countryNameToCode = {
            'Canada': 'CA',
            'United States': 'US',
            'India': 'IN',
            // Add more as needed
        };
        const countryCode = countries.find(c => c._id === selectedCountry)?.code || countryNameToCode[countries.find(c => c._id === selectedCountry)?.name] || '';
        const billingAddress = {
            street: form.address,
            city: cities.find(c => c._id === selectedCity)?.name || '',
            state: states.find(s => s._id === selectedState)?.name || '',
            country: countryCode,
            zipCode,
        };
        const cartItems = cartData.map(item => ({
            product_id: item.product_id,
            name: item.name,
            sku: item.sku, // Ensure sku is included
            quantity: item.quantity,
            price: item.price,
            subtotal: item.price * item.quantity,
            tax: (item.price * item.quantity * 0.1),
            total: (item.price * item.quantity * 1.1),
            size: item.size || '',   // Always include size
            color: item.color || ''  // Always include color
        }));
        // 2. Get PaymentIntent client_secret from backend
        let clientSecret;
        try {
            const res = await ordersAPI.checkout({
                billingAddress,
                cartItems,
                totalAmount: totals.total,
                subtotal: totals.subtotal,
                tax: totals.tax
            });
            const data = res.data;
            if (data.clientSecret) {
                clientSecret = data.clientSecret;
            } else {
                setError(data.message || 'Payment initiation failed');
                setLoading(false);
                return;
            }
        } catch (err) {
            setError('Payment initiation failed: ' + err.message);
            setLoading(false);
            return;
        }
        // 3. Confirm card payment with Stripe.js
        const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement),
                billing_details: {
                    name: `${form.firstName} ${form.lastName}`,
                    email: form.email,
                    address: {
                        line1: form.address,
                        line2: form.address2,
                        city: cities.find(c => c._id === selectedCity)?.name || '',
                        state: states.find(s => s._id === selectedState)?.name || '',
                        country: countryCode,
                        postal_code: zipCode
                    }
                }
            }
        });
        if (stripeError) {
            setError(stripeError.message);
            setLoading(false);
            return;
        }
        if (paymentIntent.status !== 'succeeded') {
            setError('Payment not successful.');
            setLoading(false);
            return;
        }
        // 4. After payment, send order creation request to backend
        try {
            const res = await ordersAPI.createOrder({
                billingAddress,
                cartItems,
                totalAmount: totals.total,
                subtotal: totals.subtotal,
                tax: totals.tax,
                paymentIntentId: paymentIntent.id
            });
            const data = res.data;
            if (data.success || data._id) {
                setSuccess('Order placed successfully!');
                setShowSuccessAnimation(true);
                // Clear the cart context after successful order
                await fetchCart();
                setTimeout(() => {
                    setShowSuccessAnimation(false);
                    navigate('/');
                }, 3000);
            } else {
                setError(data.message || 'Order failed');
            }
        } catch (err) {
            setError('Order failed: ' + err.message);
        }
        setLoading(false);
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 space-y-8">
            <h2 className="text-2xl font-bold mb-4">Billing Address</h2>
            {/* Address selection */}
            {addresses.length > 0 && !showAddressForm && (
                <div className="mb-4">
                    <label className="block font-semibold mb-2">Select Address</label>
                    {addresses.map(addr => (
                        <div key={addr._id} className="flex items-center mb-2">
                            <input
                                type="radio"
                                name="selectedAddress"
                                value={addr._id}
                                checked={selectedAddressId === addr._id}
                                onChange={() => setSelectedAddressId(addr._id)}
                                className="mr-2"
                            />
                            <span>{addr.street}, {addr.city}, {addr.state}, {addr.country} {addr.zipCode}</span>
                            {addr.isDefault && <span className="ml-2 text-xs text-orange-500">Default</span>}
                        </div>
                    ))}
                    <button type="button" className="mt-2 text-orange-500 underline" onClick={() => { setShowAddressForm(true); setSelectedAddressId(''); }}>+ Add New Address</button>
                </div>
            )}
            {/* Address form for adding new address */}
            {showAddressForm && (
                <div className="mb-4 p-4 border rounded">
                    <h4 className="font-semibold mb-2">Add New Address</h4>
                    <form onSubmit={handleAddAddress} className="space-y-2">
                        <input type="text" name="street" value={addressForm.street} onChange={handleAddressFormChange} placeholder="Street Address" className="w-full border rounded px-3 py-2" required />
                        {/* Country dropdown */}
                        <select name="country" value={addressCountry} onChange={handleAddressFormChange} className="w-full border rounded px-3 py-2" required>
                            <option value="">Select Country</option>
                            {countries.map(country => (
                                <option key={country._id} value={country._id}>{country.name}</option>
                            ))}
                        </select>
                        {/* State dropdown */}
                        <select name="state" value={addressState} onChange={handleAddressFormChange} className="w-full border rounded px-3 py-2" required disabled={!addressCountry}>
                            <option value="">Select State</option>
                            {addressStates.map(state => (
                                <option key={state._id} value={state._id}>{state.name}</option>
                            ))}
                        </select>
                        {/* City dropdown */}
                        <select name="city" value={addressCity} onChange={handleAddressFormChange} className="w-full border rounded px-3 py-2" required disabled={!addressState}>
                            <option value="">Select City</option>
                            {addressCities.map(city => (
                                <option key={city._id} value={city._id}>{city.name}</option>
                            ))}
                        </select>
                        <input type="text" name="zipCode" value={addressForm.zipCode} onChange={handleAddressFormChange} placeholder="ZIP/Postal Code" className="w-full border rounded px-3 py-2" required />
                        <label className="flex items-center space-x-2">
                            <input type="checkbox" name="isDefault" checked={addressForm.isDefault} onChange={handleAddressFormChange} />
                            <span>Set as default address</span>
                        </label>
                        <div className="flex gap-2 mt-2">
                            <button type="submit" className="bg-orange-500 text-white px-4 py-2 rounded" disabled={addingAddress}>{addingAddress ? 'Saving...' : 'Save Address'}</button>
                            <button type="button" className="bg-gray-300 text-gray-800 px-4 py-2 rounded" onClick={() => setShowAddressForm(false)}>Cancel</button>
                        </div>
                        {error && <div className="text-red-500 text-sm">{error}</div>}
                    </form>
                </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block font-semibold mb-1">Name <span className="text-red-600">*</span></label>
                    <input type="text" name="firstName" value={form.firstName} onChange={handleInput} className="w-full py-3 px-4 border rounded-lg focus:ring-2 focus:ring-orange-400" required />
                </div>
                <div>
                    <label className="block font-semibold mb-1">Your Email <span className="text-red-600">*</span></label>
                    <input type="email" name="email" value={form.email} onChange={handleInput} className="w-full py-3 px-4 border rounded-lg focus:ring-2 focus:ring-orange-400" required />
                </div>
                <div className="md:col-span-2">
                    <label className="block font-semibold mb-1">Address <span className="text-red-600">*</span></label>
                    <input type="text" name="address" value={form.address} onChange={handleInput} className="w-full py-3 px-4 border rounded-lg focus:ring-2 focus:ring-orange-400" required />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <label className="font-semibold mb-1 block">Country</label>
                    <select value={selectedCountry} onChange={e => setSelectedCountry(e.target.value)} className="form-select w-full py-3 px-4 border rounded-lg focus:ring-2 focus:ring-orange-400">
                        <option value="">Select Country</option>
                        {Array.isArray(countries) && countries.map(country => (
                            <option key={country._id} value={country._id}>{country.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="font-semibold mb-1 block">State</label>
                    <select value={selectedState} onChange={e => setSelectedState(e.target.value)} className="form-select w-full py-3 px-4 border rounded-lg focus:ring-2 focus:ring-orange-400" disabled={!selectedCountry}>
                        <option value="">Select State</option>
                        {Array.isArray(states) && states.map(state => (
                            <option key={state._id} value={state._id}>{state.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="font-semibold mb-1 block">City</label>
                    <select value={selectedCity} onChange={e => setSelectedCity(e.target.value)} className="form-select w-full py-3 px-4 border rounded-lg focus:ring-2 focus:ring-orange-400" disabled={!selectedState}>
                        <option value="">Select City</option>
                        {Array.isArray(cities) && cities.map(city => (
                            <option key={city._id} value={city._id}>{city.name}</option>
                        ))}
                    </select>
                </div>
                <div className="md:col-span-3">
                    <label className="block font-semibold mb-1">Zip Code <span className="text-red-600">*</span></label>
                    <input type="text" value={zipCode} onChange={e => setZipCode(e.target.value)} className="w-full py-3 px-4 border rounded-lg focus:ring-2 focus:ring-orange-400" required />
                </div>
            </div>
            <h2 className="text-2xl font-bold mb-4 mt-8">Payment</h2>
            <div className="mb-4">
                <CardElement options={{ hidePostalCode: true }} className="p-3 border rounded-lg" />
            </div>
            {error && <div className="text-red-600 mb-2" role="status">{error}</div>}
            {success && <div className="text-green-600 mb-2" role="status">{success}</div>}
            <button type="submit" className="w-full py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition">
                {loading ? 'Processing...' : 'Continue to checkout'}
            </button>
        </form>

        {/* Success Animation Overlay */}
        {showSuccessAnimation && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-8 text-center max-w-md mx-4 animate-bounce">
                    <div className="mb-4">
                        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-green-600 mb-2">Order Placed Successfully!</h3>
                        <p className="text-gray-600">Thank you for your purchase. You will receive an email confirmation shortly.</p>
                    </div>
                    <div className="mt-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
                        <p className="text-sm text-gray-500 mt-2">Redirecting to homepage...</p>
                    </div>
                </div>
            </div>
        )}
        </>
    );
}

export default function ShopCheckOut() {
    // Remove local cart state, use CartContext instead
    // const [cartData, setCartData] = useState([]);
    // const [totals, setTotals] = useState({ subtotal: 0, tax: 0, total: 0 });

    // Country/State/City logic
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedState, setSelectedState] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [zipCode, setZipCode] = useState('');
    const { cartData, totals } = useCart(); // <-- Add this line

    // Fetch countries on mount
    useEffect(() => {
        async function fetchCountries() {
            try {
                const res = await countriesAPI.getCountries();
                const data = res.data;
                setCountries((data.data && data.data.countries) ? data.data.countries : []);
            } catch (e) {
                setCountries([]);
            }
        }
        fetchCountries();
    }, []);

    // Fetch states when country changes
    useEffect(() => {
        if (!selectedCountry) {
            setStates([]);
            setCities([]);
            setSelectedState('');
            setSelectedCity('');
            return;
        }
        
        let isMounted = true;
        async function fetchStates() {
            try {
                const res = await statesAPI.getStates({ country_id: selectedCountry });
                if (isMounted) {
                    const data = res.data;
                    setStates((data.data && data.data.states) ? data.data.states : []);
                }
            } catch (e) {
                if (isMounted) {
                    setStates([]);
                }
            }
        }
        fetchStates();
        
        return () => {
            isMounted = false;
        };
    }, [selectedCountry]);

    // Fetch cities when state changes
    useEffect(() => {
        if (!selectedState) {
            setCities([]);
            setSelectedCity('');
            return;
        }
        
        let isMounted = true;
        async function fetchCities() {
            try {
                const res = await citiesAPI.getCities({ state_id: selectedState });
                if (isMounted) {
                    const data = res.data;
                    setCities((data.data && data.data.cities) ? data.data.cities : []);
                }
            } catch (e) {
                if (isMounted) {
                    setCities([]);
                }
            }
        }
        fetchCities();
        
        return () => {
            isMounted = false;
        };
    }, [selectedState]);

    return (
        <>
            <Navbar navClass="defaultscroll is-sticky" />
            <section className="relative table w-full py-20 lg:py-24 md:pt-28 bg-gray-50 dark:bg-slate-800">
                <div className="container relative">
                    <div className="grid grid-cols-1 mt-14">
                        <h3 className="text-3xl leading-normal font-semibold">Fashion</h3>
                    </div>

                    <div className="relative mt-3">
                        <ul className="tracking-[0.5px] mb-0 inline-block">
                            <li className="inline-block uppercase text-[13px] font-bold duration-500 ease-in-out hover:text-orange-500"><Link to="/">Zyqora</Link></li>
                            <li className="inline-block text-base text-slate-950 dark:text-white mx-0.5 ltr:rotate-0 rtl:rotate-180"><i className="mdi mdi-chevron-right"></i></li>
                            <li className="inline-block uppercase text-[13px] font-bold text-orange-500" aria-current="page">Checkout</li>
                        </ul>
                    </div>
                </div>
            </section>

            <section className="relative md:py-24 py-16" role="main">
                <div className="container relative">
                    <div className="grid lg:grid-cols-12 md:grid-cols-2 grid-cols-1 gap-6">
                        <div className="lg:col-span-8">
                            <div className="p-6 rounded-md shadow dark:shadow-gray-800">
                                <Elements stripe={stripePromise}>
                                    <CheckoutForm
                                        countries={countries}
                                        states={states}
                                        cities={cities}
                                        selectedCountry={selectedCountry}
                                        setSelectedCountry={setSelectedCountry}
                                        selectedState={selectedState}
                                        setSelectedState={setSelectedState}
                                        selectedCity={selectedCity}
                                        setSelectedCity={setSelectedCity}
                                        zipCode={zipCode}
                                        setZipCode={setZipCode}
                                    />
                                </Elements>
                            </div>
                        </div>

                        <div className="lg:col-span-4">
                            <div className="p-6 rounded-md shadow dark:shadow-gray-800" role="region" aria-label="Cart Summary">
                                <div className="flex justify-between items-center">
                                    <h5 className="text-lg font-semibold">Your Cart</h5>
                                    <span className="bg-orange-500 flex justify-center items-center text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full h-5">
                                        {cartData.length}
                                    </span>
                                </div>
                                <div className="mt-4 rounded-md shadow dark:shadow-gray-800">
                                    {cartData.map((item, idx) => (
                                        <div key={idx} className="p-3 flex justify-between items-center border-b border-gray-100 dark:border-gray-800">
                                            <div className="flex items-center">
                                                <img
                                                    src={item.image?.startsWith('/uploads') ? `https://zyqora.onrender.com${item.image}` : item.image}
                                                    alt={item.name}
                                                    className="w-10 h-10 rounded object-cover mr-3"
                                                />
                                                <div>
                                                    <h5 className="font-semibold">{item.name}</h5>
                                                    <p className="text-sm text-slate-400">
                                                        {item.size && <>Size: {item.size} </>}
                                                        {item.color && <>Color: {item.color}</>}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-slate-400 font-semibold">
                                                    {item.quantity} x {item.price.toLocaleString('en-CA', { style: 'currency', currency: 'CAD' })}
                                                </p>
                                                <p className="font-semibold">
                                                    {(item.price * item.quantity).toLocaleString('en-CA', { style: 'currency', currency: 'CAD' })}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="p-3 flex justify-between items-center border-t border-gray-100 dark:border-gray-800">
                                        <div>
                                            <h5 className="font-semibold">Subtotal</h5>
                                        </div>
                                        <p className="font-semibold">{totals.subtotal.toLocaleString('en-CA', { style: 'currency', currency: 'CAD' })}</p>
                                    </div>
                                    <div className="p-3 flex justify-between items-center border-t border-gray-100 dark:border-gray-800">
                                        <div>
                                            <h5 className="font-semibold">Tax</h5>
                                        </div>
                                        <p className="font-semibold">{totals.tax.toLocaleString('en-CA', { style: 'currency', currency: 'CAD' })}</p>
                                    </div>
                                    <div className="p-3 flex justify-between items-center border-t border-gray-100 dark:border-gray-800">
                                        <div>
                                            <h5 className="font-semibold">Total (CAD)</h5>
                                        </div>
                                        <p className="font-semibold">{totals.total.toLocaleString('en-CA', { style: 'currency', currency: 'CAD' })}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
            <ScrollToTop />
        </>
    )
}