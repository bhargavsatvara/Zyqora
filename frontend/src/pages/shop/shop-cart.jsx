import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import Navbar from "../../components/navbar";
import MobileApp from "../../components/mobile-app";
import Footer from "../../components/footer";
import Switcher from "../../components/switcher";
import Counter from "../../components/counter";

import ScrollToTop from "../../components/scroll-to-top";

export default function Shopcart(props){
    const [cartData, setCartData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totals, setTotals] = useState({
        subtotal: 0,
        tax: 0,
        total: 0
    });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchCartData();
        // Check if user just added an item (from URL params or sessionStorage)
        const addedItem = sessionStorage.getItem('addedToCart');
        if (addedItem) {
            setMessage('Product added to cart successfully!');
            sessionStorage.removeItem('addedToCart');
            setTimeout(() => setMessage(''), 3000);
        }
    }, []);

    const fetchCartData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            const response = await fetch('http://localhost:4000/api/cart', {
                headers: {
                    ...(token && { 'Authorization': `Bearer ${token}` })
                }
            });
            const data = await response.json();
            
            if (data.success) {
                setCartData(data.data.items || []);
                setTotals({
                    subtotal: data.data.subtotal || 0,
                    tax: data.data.tax || 0,
                    total: data.data.total || 0
                });
            } else {
                setCartData([]);
                setTotals({ subtotal: 0, tax: 0, total: 0 });
            }
        } catch (error) {
            console.error('Error fetching cart:', error);
            setCartData([]);
            setTotals({ subtotal: 0, tax: 0, total: 0 });
        } finally {
            setLoading(false);
        }
    };

    // Helper to recalculate totals instantly
    const recalculateTotals = (cartItems) => {
        const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const tax = subtotal * 0.1;
        const total = subtotal + tax;
        setTotals({ subtotal, tax, total });
    };

    const handleQuantityChange = async (itemId, newQuantity) => {
        setCartData(prevCartData => {
            const updatedCart = prevCartData.map(item =>
                item.product_id === itemId
                    ? { ...item, quantity: newQuantity }
                    : item
            );
            recalculateTotals(updatedCart);
            return updatedCart;
        });

        try {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            const response = await fetch('http://localhost:4000/api/cart/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { 'Authorization': `Bearer ${token}` })
                },
                body: JSON.stringify({
                    itemId: itemId,
                    quantity: newQuantity
                })
            });

            if (!response.ok) {
                fetchCartData();
            }
        } catch (error) {
            fetchCartData();
        }
    };

    const removeFromCart = async (item) => {
        try {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            const response = await fetch('http://localhost:4000/api/cart/remove', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    ...(token && { 'Authorization': `Bearer ${token}` })
                },
                body: JSON.stringify({
                    product_id: item.product_id,
                    size: item.size,
                    color: item.color
                })
            });
            const text = await response.text();
            console.log('Remove response:', text);
            if (response.ok) {
                setCartData(prevCartData => {
                    const updatedCart = prevCartData.filter(
                        i => !(i.product_id === item.product_id && i.size === item.size && i.color === item.color)
                    );
                    recalculateTotals(updatedCart);
                    return updatedCart;
                });
            } else {
                setMessage('Error removing item from cart');
                setTimeout(() => setMessage(''), 3000);
            }
        } catch (error) {
            setMessage('Error removing item from cart');
            setTimeout(() => setMessage(''), 3000);
        }
    };

    const clearCart = async () => {
        try {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            const response = await fetch('http://localhost:4000/api/cart/clear', {
                method: 'DELETE',
                headers: {
                    ...(token && { 'Authorization': `Bearer ${token}` })
                }
            });

            if (response.ok) {
                setMessage('Cart cleared successfully');
                setTimeout(() => setMessage(''), 3000);
                fetchCartData();
            } else {
                setMessage('Error clearing cart');
                setTimeout(() => setMessage(''), 3000);
            }
        } catch (error) {
            console.error('Error clearing cart:', error);
            setMessage('Error clearing cart');
            setTimeout(() => setMessage(''), 3000);
        }
    };

    const handleProceedToCheckout = () => {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        if (token) {
            navigate("/shop-checkout");
        } else {
            navigate("/login");
        }
    };

    const getImageUrl = (imagePath) => {
        if (!imagePath) {
            return '/assets/images/shop/default-product.jpg';
        }
        
        // If image starts with http, it's an external URL
        if (imagePath.startsWith('http')) {
            return imagePath;
        }
        
        // If image starts with /uploads, it's a local file
        if (imagePath.startsWith('/uploads')) {
            return `http://localhost:4000${imagePath}`;
        }
        
        // Default fallback
        return '/assets/images/shop/default-product.jpg';
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(price || 0);
    };
   
    return(
        <>
        <Navbar navClass="defaultscroll is-sticky" role="navigation"/>
        <section className="relative table w-full py-20 lg:py-24 md:pt-28 bg-gray-50 dark:bg-slate-800" role="banner">
            <div className="container relative">
                <div className="grid grid-cols-1 mt-14">
                    <h3 className="text-3xl leading-normal font-semibold">Shopping Cart</h3>
                </div>

                <div className="relative mt-3">
                    <ul className="tracking-[0.5px] mb-0 inline-block">
                        <li className="inline-block uppercase text-[13px] font-bold duration-500 ease-in-out hover:text-orange-500"><Link to="/">Zyqora</Link></li>
                        <li className="inline-block text-base text-slate-950 dark:text-white mx-0.5 ltr:rotate-0 rtl:rotate-180"><i className="mdi mdi-chevron-right"></i></li>
                        <li className="inline-block uppercase text-[13px] font-bold text-orange-500" aria-current="page">Shopping Cart</li>
                    </ul>
                </div>
            </div>
        </section>

        <section className="relative md:py-24 py-16" role="main">
            <div className="container relative">
                {/* Success Message */}
                {message && (
                    <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-lg" role="status">
                        <div className="flex items-center">
                            <i className="mdi mdi-check-circle text-green-600 mr-2"></i>
                            {message}
                        </div>
                    </div>
                )}

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                    </div>
                ) : cartData.length === 0 ? (
                    <div className="text-center py-20">
                        <h3 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-300">Your cart is empty</h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">Add some products to your cart to get started.</p>
                        <Link to="/products" className="inline-block px-6 py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors">
                            Continue Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-1">
                        <div className="relative overflow-x-auto shadow dark:shadow-gray-800 rounded-md">
                            <table className="w-full text-start" role="table">
                                <thead className="text-sm uppercase bg-slate-50 dark:bg-slate-800">
                                    <tr>
                                        <th scope="col" className="p-4 w-4"></th>
                                        <th scope="col" className="text-start p-4 min-w-[220px]">Product</th>
                                        <th scope="col" className="p-4 w-24 min-w-[100px]">Price</th>
                                        <th scope="col" className="p-4 w-56 min-w-[220px]">Qty</th>
                                        <th scope="col" className="p-4 w-24 min-w-[100px]">Total($)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cartData.map((item, index) => (
                                        <tr className="bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-gray-800" key={index}>
                                            <td className="p-4">
                                                <button 
                                                    onClick={() => removeFromCart(item)}
                                                    className="transition-colors text-red-600 hover:text-red-800"
                                                    title="Remove item"
                                                >
                                                    <i className="mdi mdi-window-close"></i>
                                                </button>
                                            </td>
                                            <td className="p-4">
                                                <span className="flex items-center">
                                                    <img src={getImageUrl(item.image)} className="rounded shadow dark:shadow-gray-800 w-12 h-12 object-cover" alt={item.name}/>
                                                    <span className="ms-3">
                                                        <span className="block font-semibold">{item.name}</span>
                                                        {item.size && <span className="text-sm text-gray-500">Size: {item.size}</span>}
                                                        {item.color && <span className="text-sm text-gray-500">Color: {item.color}</span>}
                                                    </span>
                                                </span>
                                            </td>
                                            <td className="p-4 text-center">{formatPrice(item.price)}</td>
                                            <td className="p-4 text-center">
                                                <Counter 
                                                    qtn={item.quantity} 
                                                    total="" 
                                                    onQuantityChange={(newQty) => handleQuantityChange(item.product_id, newQty)}
                                                />
                                            </td>
                                            <td className="p-4 text-end">{formatPrice(item.price * item.quantity)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="grid lg:grid-cols-12 md:grid-cols-2 grid-cols-1 mt-6 gap-6">
                            <div className="lg:col-span-9 md:order-1 order-3">
                                <div className="space-x-1">
                                    <button 
                                        onClick={handleProceedToCheckout}
                                        className="py-2 px-5 inline-block font-semibold tracking-wide align-middle text-base text-center bg-orange-500 text-white rounded-md mt-2"
                                    >
                                        Proceed to Checkout
                                    </button>
                                    <Link to="/products" className="py-2 px-5 inline-block font-semibold tracking-wide align-middle text-base text-center rounded-md bg-orange-500/5 hover:bg-orange-500 text-orange-500 hover:text-white mt-2">Continue Shopping</Link>
                                    <button 
                                        onClick={clearCart}
                                        className="py-2 px-5 inline-block font-semibold tracking-wide align-middle text-base text-center rounded-md bg-red-500/5 hover:bg-red-500 text-red-500 hover:text-white mt-2"
                                    >
                                        Clear Cart
                                    </button>
                                </div>
                            </div>

                            <div className="lg:col-span-3 md:order-2 order-1">
                                <ul className="list-none shadow dark:shadow-gray-800 rounded-md">
                                    <li className="flex justify-between p-4">
                                        <span className="font-semibold text-lg">Subtotal :</span>
                                        <span className="text-slate-400">{formatPrice(totals.subtotal)}</span>
                                    </li>
                                    <li className="flex justify-between p-4 border-t border-gray-100 dark:border-gray-800">
                                        <span className="font-semibold text-lg">Taxes :</span>
                                        <span className="text-slate-400">{formatPrice(totals.tax)}</span>
                                    </li>
                                    <li className="flex justify-between font-semibold p-4 border-t border-gray-200 dark:border-gray-600">
                                        <span className="font-semibold text-lg">Total :</span>
                                        <span className="font-semibold">{formatPrice(totals.total)}</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <MobileApp/>
        </section>
        <Footer/>
        <Switcher/>
        <ScrollToTop/>
        </>
    )
}