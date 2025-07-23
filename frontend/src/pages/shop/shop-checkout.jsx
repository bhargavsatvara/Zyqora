import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import Switcher from "../../components/switcher";
import ScrollToTop from "../../components/scroll-to-top";
import { useCart } from "../../contexts/CartContext";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

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
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();

    useEffect(() => {
        fetchCart(); // Always fetch latest cart on mount
    }, [fetchCart]);

    const handleInput = e => {
        setForm(f => ({ ...f, [e.target.name]: e.target.value }));
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
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            const res = await fetch('https://zyqora.onrender.com/api/orders/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    billingAddress,
                    cartItems,
                    totalAmount: totals.total,
                    subtotal: totals.subtotal,
                    tax: totals.tax
                })
            });
            const data = await res.json();
            if (res.ok && data.clientSecret) {
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
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            const res = await fetch('https://zyqora.onrender.com/api/orders/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    billingAddress,
                    cartItems,
                    totalAmount: totals.total,
                    subtotal: totals.subtotal,
                    tax: totals.tax,
                    paymentIntentId: paymentIntent.id
                })
            });
            const data = await res.json();
            if (res.ok && (data.success || data._id)) {
                setSuccess('Order placed successfully!');
                setTimeout(() => navigate('/'), 2000);
            } else {
                setError(data.message || 'Order failed');
            }
        } catch (err) {
            setError('Order failed: ' + err.message);
        }
        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 space-y-8">
          <h2 className="text-2xl font-bold mb-4">Billing Address</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-semibold mb-1">First Name <span className="text-red-600">*</span></label>
              <input type="text" name="firstName" value={form.firstName} onChange={handleInput} className="w-full py-3 px-4 border rounded-lg focus:ring-2 focus:ring-orange-400" required />
            </div>
            <div>
              <label className="block font-semibold mb-1">Last Name <span className="text-red-600">*</span></label>
              <input type="text" name="lastName" value={form.lastName} onChange={handleInput} className="w-full py-3 px-4 border rounded-lg focus:ring-2 focus:ring-orange-400" required />
            </div>
            <div>
              <label className="block font-semibold mb-1">Username</label>
              <input type="text" name="username" value={form.username} onChange={handleInput} className="w-full py-3 px-4 border rounded-lg focus:ring-2 focus:ring-orange-400" />
            </div>
            <div>
              <label className="block font-semibold mb-1">Your Email <span className="text-red-600">*</span></label>
              <input type="email" name="email" value={form.email} onChange={handleInput} className="w-full py-3 px-4 border rounded-lg focus:ring-2 focus:ring-orange-400" required />
            </div>
            <div className="md:col-span-2">
              <label className="block font-semibold mb-1">Address <span className="text-red-600">*</span></label>
              <input type="text" name="address" value={form.address} onChange={handleInput} className="w-full py-3 px-4 border rounded-lg focus:ring-2 focus:ring-orange-400" required />
            </div>
            <div className="md:col-span-2">
              <label className="block font-semibold mb-1">Address 2</label>
              <input type="text" name="address2" value={form.address2} onChange={handleInput} className="w-full py-3 px-4 border rounded-lg focus:ring-2 focus:ring-orange-400" />
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
              <input type="number" value={zipCode} onChange={e => setZipCode(e.target.value)} className="w-full py-3 px-4 border rounded-lg focus:ring-2 focus:ring-orange-400" required />
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
    );
}

export default function ShopCheckOut(){
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
                const res = await fetch('https://zyqora.onrender.com/api/countries');
                const data = await res.json();
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
        async function fetchStates() {
            try {
                const res = await fetch(`https://zyqora.onrender.com/api/states?country_id=${selectedCountry}`);
                const data = await res.json();
                setStates((data.data && data.data.states) ? data.data.states : []);
            } catch (e) {
                setStates([]);
            }
        }
        fetchStates();
    }, [selectedCountry]);

    // Fetch cities when state changes
    useEffect(() => {
        if (!selectedState) {
            setCities([]);
            setSelectedCity('');
            return;
        }
        async function fetchCities() {
            try {
                const res = await fetch(`https://zyqora.onrender.com/api/cities?state_id=${selectedState}`);
                const data = await res.json();
                setCities((data.data && data.data.cities) ? data.data.cities : []);
            } catch (e) {
                setCities([]);
            }
        }
        fetchCities();
    }, [selectedState]);

    return(
        <>
        <Navbar navClass="defaultscroll is-sticky"/>
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
                                                src={item.image?.startsWith('/uploads') ? `http://localhost:4000${item.image}` : item.image}
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
        <Footer/>
        <Switcher/>
        <ScrollToTop/>
        </>
    )
}