import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import Navbar from "../components/navbar";
import MobileApp from "../components/mobile-app";
import Footer from "../components/footer";
import Switcher from "../components/switcher";
import { productsAPI, reviewsAPI, wishlistAPI } from "../services/api";

import { FiHeart, FiEye, FiBookmark } from '../assets/icons/vander'
import { AiFillHeart } from 'react-icons/ai';
import ScrollToTop from "../components/scroll-to-top";
import Toast from '../components/Toast';
import { useWishlist } from '../contexts/WishlistContext';

export default function Sale() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { wishlist, refreshWishlist } = useWishlist();
    const [productRatings, setProductRatings] = useState({});
    const [toast, setToast] = useState({ message: '', type: 'info' });

    // Mock sales data - in a real app, this would come from an API
    const salesData = [
        {
            tag: "20% OFF",
            title: "First Order",
            desc: "Get 20% off on your first order",
            code: "FIRST20"
        },
        {
            tag: "30% OFF",
            title: "Season Sale",
            desc: "Seasonal discount on selected items",
            code: "SEASON30"
        },
        {
            tag: "50% OFF",
            title: "Flash Sale",
            desc: "Limited time flash sale offer",
            code: "FLASH50"
        },
        {
            tag: "75% OFF",
            title: "Clearance",
            desc: "Clearance sale on last season items",
            code: "CLEAR75"
        }
    ];

    useEffect(() => {
        fetchProducts();
        fetchWishlist();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await productsAPI.getProducts({
                page: 1,
                limit: 8,
                sort: 'created_at',
                order: 'desc'
            });
            
            if (response.data && response.data.data && response.data.data.products) {
                setProducts(response.data.data.products);
                // Fetch ratings for these products
                fetchProductRatings(response.data.data.products);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchWishlist = async () => {
        try {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            if (token) {
                const response = await wishlistAPI.getWishlist();
                if (response.data && Array.isArray(response.data.items)) {
                    // setWishlist(response.data.items.map(w => w._id || w.productId)); // Removed - using context now
                }
            } else {
                // Load from localStorage for non-authenticated users
                const localWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
                // setWishlist(localWishlist.map(w => w._id)); // Removed - using context now
            }
        } catch (error) {
            console.error('Error fetching wishlist:', error);
            // Fallback to localStorage
            const localWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
            // setWishlist(localWishlist.map(w => w._id)); // Removed - using context now
        }
    };

    const fetchProductRatings = async (products) => {
        try {
            const ratings = {};
            await Promise.all(products.map(async (product) => {
                if (product._id) {
                    try {
                        const response = await reviewsAPI.getProductReviews(product._id);
                        const reviews = response.data;
                        if (Array.isArray(reviews) && reviews.length > 0) {
                            const avg = reviews.reduce((sum, r) => sum + (Number(r.rating) || 0), 0) / reviews.length;
                            ratings[product._id] = { avg, count: reviews.length };
                        } else {
                            ratings[product._id] = { avg: 0, count: 0 };
                        }
                    } catch (error) {
                        ratings[product._id] = { avg: 0, count: 0 };
                    }
                }
            }));
            setProductRatings(ratings);
        } catch (error) {
            console.error('Error fetching product ratings:', error);
        }
    };

    const getImageUrl = (product) => {
        if (!product.image) {
            return '/assets/images/shop/default-product.jpg';
        }

        // If image starts with http, it's an external URL
        if (product.image.startsWith('http')) {
            return product.image;
        }

        // If image starts with /uploads, it's a local file
        if (product.image.startsWith('/uploads')) {
            return `https://zyqora.onrender.com${product.image}`;
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

    const isInWishlist = (productId) => {
        return wishlist.includes(productId);
    };

    const handleAddToWishlist = async (item) => {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (token) {
            try {
                await wishlistAPI.addToWishlist(item._id);
                await refreshWishlist();
                setToast({ message: 'Added to wishlist!', type: 'success' });
            } catch (error) {
                console.error('Error adding to wishlist:', error);
                setToast({ message: 'Failed to add to wishlist', type: 'error' });
            }
        } else {
            let localWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
            if (!localWishlist.find(p => p._id === item._id)) {
                localWishlist.push(item);
                localStorage.setItem('wishlist', JSON.stringify(localWishlist));
            }
            await refreshWishlist();
            setToast({ message: 'Added to wishlist (local)!', type: 'success' });
        }
    };

    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 0; i < fullStars; i++) {
            stars.push(<i key={i} className="mdi mdi-star"></i>);
        }
        if (hasHalfStar) {
            stars.push(<i key="half" className="mdi mdi-star-half"></i>);
        }
        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<i key={`empty-${i}`} className="mdi mdi-star-outline"></i>);
        }
        return stars;
    };

    // Loading skeleton for products
    const ProductsSkeleton = () => (
        <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 pt-6 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                <div key={item} className="group animate-pulse">
                    <div className="relative overflow-hidden shadow dark:shadow-gray-800 rounded-md">
                        <div className="w-full h-64 bg-gray-200"></div>
                    </div>
                    <div className="mt-4">
                        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                        <div className="flex justify-between items-center mt-2">
                            <div className="h-4 bg-gray-200 rounded w-16"></div>
                            <div className="h-4 bg-gray-200 rounded w-24"></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <>
            <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'info' })} />
            <div className="tagline bg-white dark:bg-slate-900">
                <div className="container relative">
                    <div className="grid grid-cols-1">
                        <div className="text-center">
                            <h6 className="text-slate-900 dark:text-white font-semibold">Refer a friend & get $50 in credits each 🎉</h6>
                        </div>
                    </div>
                </div>
            </div>
            <Navbar navClass="defaultscroll is-sticky tagline-height" navlight={true} />

            <section className="relative table w-full items-center pt-36 pb-52 bg-orange-600 bg-[url('../../assets/images/hero/bg-shape.png')] bg-center bg-no-repeat bg-cover">
                <div className="container relative">
                    <div className="grid grid-cols-1 text-center mt-10">
                        <h3 className="md:text-7xl text-5xl md:leading-normal leading-normal tracking-wide font-bold uppercase text-white">Sale Outlet <br /> Up to 75% Off</h3>
                        <div className="mt-6">
                            <Link to="" className="py-2 px-5 inline-block font-semibold tracking-wide align-middle text-center bg-white text-orange-500 rounded-md">Offer Grab Now</Link>
                        </div>
                    </div>
                </div>
            </section>

            <section className="relative md:py-24 py-16">
                <div className="container relative">
                    <div className="grid grid-cols-1 justify-center">
                        <div className="relative z-2 duration-500 sm:-mt-[200px] -mt-[140px] m-0">
                            <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-6">
                                {salesData.map((item, index) => {
                                    return (
                                        <div className="relative overflow-hidden rounded-md text-center shadow-md" key={index}>
                                            <div className="p-6 bg-orange-500">
                                                <span className="bg-white text-orange-500 font-bold px-2.5 py-0.5 rounded-full h-5">{item.tag}</span>

                                                <h5 className="text-white font-medium mt-2">{item.title}</h5>

                                                <p className="text-white/70 mt-2">Use this below code <br />{item.desc}</p>
                                            </div>

                                            <div className="p-6 bg-white dark:bg-slate-900">
                                                <p className="text-sm font-medium uppercase">Use Code</p>
                                                <h5 className="text-xl font-semibold uppercase mt-1">{item.code}</h5>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container relative md:mt-24 mt-16">
                    <div className="grid grid-cols-1 justify-center text-center mb-6">
                        <h5 className="font-semibold text-3xl leading-normal mb-4">Top Offers</h5>
                        <p className="text-slate-400 max-w-xl mx-auto">Shop the latest products from the most popular collections</p>
                    </div>

                    {loading ? (
                        <ProductsSkeleton />
                    ) : (
                        <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 pt-6 gap-6">
                            {products.map((item, index) => {
                                const rating = productRatings[item._id]?.avg || 0;
                                const ratingCount = productRatings[item._id]?.count || 0;
                                
                                return (
                                    <div className="group" key={item._id || index}>
                                        <div className="relative overflow-hidden shadow dark:shadow-gray-800 group-hover:shadow-lg group-hover:dark:shadow-gray-800 rounded-md duration-500">
                                            <img src={getImageUrl(item)} className="group-hover:scale-110 duration-500" alt={item.name} />

                                            <div className="absolute -bottom-20 group-hover:bottom-3 start-3 end-3 duration-500">
                                                <Link to="/shop-cart" className="py-2 px-5 inline-block font-semibold tracking-wide align-middle duration-500 text-base text-center bg-slate-900 text-white w-full rounded-md">Add to Cart</Link>
                                            </div>

                                            <ul className="list-none absolute top-[10px] end-4 opacity-0 group-hover:opacity-100 duration-500 space-y-1">
                                                <li>
                                                    <button
                                                        onClick={() => handleAddToWishlist(item)}
                                                        className="size-10 inline-flex items-center justify-center tracking-wide align-middle duration-500 text-center rounded-full bg-white text-slate-900 hover:bg-slate-900 hover:text-white shadow"
                                                    >
                                                        {isInWishlist(item._id) ? <AiFillHeart className="size-4 text-red-500" /> : <FiHeart className="size-4" />}
                                                    </button>
                                                </li>
                                                <li className="mt-1 ms-0">
                                                    <Link to={`/product-detail-one/${item._id}`} className="size-10 inline-flex items-center justify-center tracking-wide align-middle duration-500 text-center rounded-full bg-white text-slate-900 hover:bg-slate-900 hover:text-white shadow">
                                                        <FiEye className="size-4"></FiEye>
                                                    </Link>
                                                </li>
                                                <li className="mt-1 ms-0">
                                                    <Link to="#" className="size-10 inline-flex items-center justify-center tracking-wide align-middle duration-500 text-center rounded-full bg-white text-slate-900 hover:bg-slate-900 hover:text-white shadow">
                                                        <FiBookmark className="size-4"></FiBookmark>
                                                    </Link>
                                                </li>
                                            </ul>
                                        </div>

                                        <div className="mt-4">
                                            <Link to={`/product-detail-one/${item._id}`} className="hover:text-orange-500 text-lg font-medium">{item.name}</Link>
                                            <div className="flex justify-between items-center mt-1">
                                                <p>{formatPrice(item.price)}</p>
                                                <ul className="font-medium text-amber-400 list-none">
                                                    {renderStars(rating)}
                                                </ul>
                                            </div>
                                            {ratingCount > 0 && (
                                                <p className="text-sm text-gray-500 mt-1">({ratingCount} reviews)</p>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}

                </div>

                <MobileApp />
            </section>
            <Footer />
            <Switcher />
            <ScrollToTop />
        </>
    )
}