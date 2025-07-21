import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../../components/navbar";
import MobileApp from "../../components/mobile-app";
import Footer from "../../components/footer";
import Switcher from "../../components/switcher";
import ScrollToTop from "../../components/scroll-to-top";

export default function ShopCheckOut(){
    const [cartData, setCartData] = useState([]);
    const [totals, setTotals] = useState({ subtotal: 0, tax: 0, total: 0 });

    // Country/State/City logic
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedState, setSelectedState] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [zipCode, setZipCode] = useState('');

    // Fetch countries on mount
    useEffect(() => {
        async function fetchCountries() {
            try {
                const res = await fetch('http://localhost:4000/api/countries');
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
                const res = await fetch(`http://localhost:4000/api/states?country_id=${selectedCountry}`);
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
                const res = await fetch(`http://localhost:4000/api/cities?state_id=${selectedState}`);
                const data = await res.json();
                setCities((data.data && data.data.cities) ? data.data.cities : []);
            } catch (e) {
                setCities([]);
            }
        }
        fetchCities();
    }, [selectedState]);

    useEffect(() => {
        async function fetchCart() {
            try {
                const response = await fetch("http://localhost:4000/api/cart");
                const data = await response.json();
                if (data.success) {
                    setCartData(data.data.items || []);
                    setTotals({
                        subtotal: data.data.subtotal || 0,
                        tax: data.data.tax || 0,
                        total: data.data.total || 0,
                    });
                }
            } catch (e) {
                setCartData([]);
                setTotals({ subtotal: 0, tax: 0, total: 0 });
            }
        }
        fetchCart();
    }, []);

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

        <section className="relative md:py-24 py-16">
            <div className="container relative">
                <div className="grid lg:grid-cols-12 md:grid-cols-2 grid-cols-1 gap-6">
                    <div className="lg:col-span-8">
                        <div className="p-6 rounded-md shadow dark:shadow-gray-800">
                            <h3 className="text-xl leading-normal font-semibold">Billing address</h3>

                            <form>
                                <div className="grid lg:grid-cols-12 grid-cols-1 mt-6 gap-5">
                                    <div className="lg:col-span-6">
                                        <label className="form-label font-semibold">First Name : <span className="text-red-600">*</span></label>
                                        <input type="text" className="w-full py-2 px-3 h-10 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded outline-none border border-gray-100 dark:border-gray-800 focus:ring-0 mt-2" placeholder="First Name:" id="firstname" name="name" required=""/>
                                    </div>

                                    <div className="lg:col-span-6">
                                        <label className="form-label font-semibold">Last Name : <span className="text-red-600">*</span></label>
                                        <input type="text" className="w-full py-2 px-3 h-10 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded outline-none border border-gray-100 dark:border-gray-800 focus:ring-0 mt-2" placeholder="Last Name:" id="lastname" name="name" required=""/>
                                    </div>

                                    <div className="lg:col-span-6">
                                        <label className="form-label font-semibold">Username</label>
                                        <div className="relative mt-2">
                                            <span className="absolute top-0.5 start-0.5 w-9 h-9 text-xl bg-gray-100 dark:bg-slate-800 inline-flex justify-center items-center text-dark dark:text-white rounded" id="basic-addon1"><i className="mdi mdi-at"></i></span>
                                            <input type="text" className="ps-12 w-full py-2 px-3 h-10 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded outline-none border border-gray-100 dark:border-gray-800 focus:ring-0" placeholder="Username" required/>
                                        </div>
                                    </div>

                                    <div className="lg:col-span-6">
                                        <label className="form-label font-semibold">Your Email : <span className="text-red-600">*</span></label>
                                        <input type="email" className="w-full py-2 px-3 h-10 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded outline-none border border-gray-100 dark:border-gray-800 focus:ring-0 mt-2" placeholder="Email" name="email" required=""/>
                                    </div>

                                    <div className="lg:col-span-12">
                                        <label className="form-label font-semibold">Address : <span className="text-red-600">*</span></label>
                                        <input type="text" className="w-full py-2 px-3 h-10 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded outline-none border border-gray-100 dark:border-gray-800 focus:ring-0 mt-2" placeholder="Address:" id="address" name="name" required=""/>
                                    </div>

                                    <div className="lg:col-span-12">
                                        <label className="form-label font-semibold">Address 2 : </label>
                                        <input type="text" className="w-full py-2 px-3 h-10 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded outline-none border border-gray-100 dark:border-gray-800 focus:ring-0 mt-2" placeholder="Address:" id="address" name="name" required=""/>
                                    </div>

                                    <div className="lg:col-span-4">
                                        <label className="font-semibold">Country:</label>
                                        <select
                                            className="form-select form-input mt-2 w-full py-2 px-3 h-10 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded outline-none border border-gray-100 dark:border-gray-800 focus:ring-0"
                                            value={selectedCountry}
                                            onChange={e => setSelectedCountry(e.target.value)}
                                        >
                                            <option value="">Select Country</option>
                                            {Array.isArray(countries) && countries.map(country => (
                                                <option key={country._id} value={country._id}>{country.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="lg:col-span-4">
                                        <label className="font-semibold">State:</label>
                                        <select
                                            className="form-select form-input mt-2 w-full py-2 px-3 h-10 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded outline-none border border-gray-100 dark:border-gray-800 focus:ring-0"
                                            value={selectedState}
                                            onChange={e => setSelectedState(e.target.value)}
                                            disabled={!selectedCountry}
                                        >
                                            <option value="">Select State</option>
                                            {Array.isArray(states) && states.map(state => (
                                                <option key={state._id} value={state._id}>{state.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="lg:col-span-4">
                                        <label className="form-label font-semibold">City:</label>
                                        <select
                                            className="form-select form-input mt-2 w-full py-2 px-3 h-10 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded outline-none border border-gray-100 dark:border-gray-800 focus:ring-0"
                                            value={selectedCity}
                                            onChange={e => setSelectedCity(e.target.value)}
                                            disabled={!selectedState}
                                        >
                                            <option value="">Select City</option>
                                            {Array.isArray(cities) && cities.map(city => (
                                                <option key={city._id} value={city._id}>{city.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="lg:col-span-4">
                                        <label className="form-label font-semibold">Zip Code : <span className="text-red-600">*</span></label>
                                        <input type="number" className="w-full py-2 px-3 h-10 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded outline-none border border-gray-100 dark:border-gray-800 focus:ring-0 mt-2" placeholder="Zip:" id="zipcode" name="number" required=""/>
                                    </div>

                                    <div className="lg:col-span-12">
                                        <div className="flex items-center w-full mb-0">
                                            <input className="form-checkbox rounded border-gray-100 dark:border-gray-800 text-orange-500 focus:border-orange-300 focus:ring focus:ring-offset-0 focus:ring-orange-200 focus:ring-opacity-50 me-2" type="checkbox" value="" id="sameaddress"/>
                                            <label className="form-check-label text-slate-400" htmlFor="sameaddress">Shipping address is the same as my billing address</label>
                                        </div>

                                        <div className="flex items-center w-full mb-0">
                                            <input className="form-checkbox rounded border-gray-100 dark:border-gray-800 text-orange-500 focus:border-orange-300 focus:ring focus:ring-offset-0 focus:ring-orange-200 focus:ring-opacity-50 me-2" type="checkbox" value="" id="savenexttime"/>
                                            <label className="form-check-label text-slate-400" htmlFor="savenexttime">Save this information for next time</label>
                                        </div>
                                    </div>
                                </div>
                            </form>

                            <h3 className="text-xl leading-normal font-semibold mt-6">Payment</h3>

                            <form>
                                <div>
                                    <div className="grid lg:grid-cols-12 grid-cols-1 mt-6 gap-5">
                                        <div className="lg:col-span-12">
                                            <div className="block">
                                                <div>
                                                    <label className="inline-flex items-center">
                                                        <input type="radio" className="form-radio border-gray-100 dark:border-gray-800 text-orange-500 focus:border-orange-300 focus:ring focus:ring-offset-0 focus:ring-orange-200 focus:ring-opacity-50 me-2" name="radio-colors" value="1" readOnly defaultChecked/>
                                                        <span className="text-slate-400">Credit card</span>
                                                    </label>
                                                </div>
                                            </div>
    
                                            <div className="block mt-2">
                                                <div>
                                                    <label className="inline-flex items-center">
                                                        <input type="radio" className="form-radio border-gray-100 dark:border-gray-800 text-orange-500 focus:border-orange-300 focus:ring focus:ring-offset-0 focus:ring-orange-200 focus:ring-opacity-50 me-2" name="radio-colors" value="1" readOnly/>
                                                        <span className="text-slate-400">Debit Card</span>
                                                    </label>
                                                </div>
                                            </div>
    
                                            <div className="block mt-2">
                                                <div>
                                                    <label className="inline-flex items-center">
                                                        <input type="radio" className="form-radio border-gray-100 dark:border-gray-800 text-orange-500 focus:border-orange-300 focus:ring focus:ring-offset-0 focus:ring-orange-200 focus:ring-opacity-50 me-2" name="radio-colors" value="1" readOnly/>
                                                        <span className="text-slate-400">PayPal</span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="lg:col-span-6">
                                            <label className="form-label font-semibold">Account Holder Name : <span className="text-red-600">*</span></label>
                                            <input type="text" className="w-full py-2 px-3 h-10 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded outline-none border border-gray-100 dark:border-gray-800 focus:ring-0 mt-2" placeholder="Name:" id="accountname" name="name" required=""/>
                                        </div>
    
                                        <div className="lg:col-span-6">
                                            <label className="form-label font-semibold">Credit card number : <span className="text-red-600">*</span></label>
                                            <input type="number" className="w-full py-2 px-3 h-10 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded outline-none border border-gray-100 dark:border-gray-800 focus:ring-0 mt-2" placeholder="**** **** **** ****" id="cardnumber" name="number" required=""/>
                                        </div>
    
                                        <div className="lg:col-span-3">
                                            <label className="form-label font-semibold">Expiration : <span className="text-red-600">*</span></label>
                                            <input type="number" className="w-full py-2 px-3 h-10 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded outline-none border border-gray-100 dark:border-gray-800 focus:ring-0 mt-2" placeholder="" id="expiration" name="number" required=""/>
                                        </div>
    
                                        <div className="lg:col-span-3">
                                            <label className="form-label font-semibold">CVV : <span className="text-red-600">*</span></label>
                                            <input type="number" className="w-full py-2 px-3 h-10 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded outline-none border border-gray-100 dark:border-gray-800 focus:ring-0 mt-2" placeholder="" id="cvv" name="number" required=""/>
                                        </div>
                                    </div>
                                </div>
                            </form>
                            <div className="mt-4">
                                <input type="submit" className="py-2 px-5 inline-block tracking-wide align-middle duration-500 text-base text-center bg-orange-500 text-white rounded-md w-full" value="Continue to checkout"/>
                            </div>
                        </div>

                    </div>

                    <div className="lg:col-span-4">
                        <div className="p-6 rounded-md shadow dark:shadow-gray-800">
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

            <MobileApp/>
        </section>
        <Footer/>
        <Switcher/>
        <ScrollToTop/>
        </>
    )
}