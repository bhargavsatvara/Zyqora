import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";

import Navbar from "../../../components/navbar";
import Footer from "../../../components/footer";
import Switcher from "../../../components/switcher";
import Filter from "../../../components/filter";
import { productsAPI, reviewsAPI, wishlistAPI } from "../../../services/api";

import { FiHeart, FiEye, FiBookmark, FiChevronLeft, FiChevronRight } from '../../../assets/icons/vander'
import { AiFillHeart } from 'react-icons/ai';
import ScrollToTop from "../../../components/scroll-to-top";
import Toast from '../../../components/Toast';
import { useWishlist } from '../../../contexts/WishlistContext';

export default function ShopListRightSidebar() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const { wishlist, refreshWishlist } = useWishlist();
    const [productRatings, setProductRatings] = useState({});
    const [sortBy, setSortBy] = useState('featured');
    const [filters, setFilters] = useState({
        search: '',
        category_id: '',
        brand_id: '',
        department_id: '',
        min_price: '',
        max_price: ''
    });
    const [toast, setToast] = useState({ message: '', type: 'info' });

    // Handle URL parameters on component mount
    useEffect(() => {
        const categoryId = searchParams.get('category_id');
        const departmentId = searchParams.get('department_id');
        const brandId = searchParams.get('brand_id');
        const search = searchParams.get('search');
        const page = searchParams.get('page');

        if (categoryId || departmentId || brandId || search || page) {
            setFilters(prev => ({
                ...prev,
                category_id: categoryId || '',
                department_id: departmentId || '',
                brand_id: brandId || '',
                search: search || ''
            }));
            if (page) {
                setCurrentPage(parseInt(page));
            }
        }
    }, [searchParams]);

    useEffect(() => {
        fetchProducts();
        fetchWishlist();
    }, [currentPage, filters, sortBy]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: currentPage,
                limit: 10,
                ...filters
            });

            // Add sorting parameters
            if (sortBy === 'price-low-high') {
                params.append('sort', 'price');
                params.append('order', 'asc');
            } else if (sortBy === 'price-high-low') {
                params.append('sort', 'price');
                params.append('order', 'desc');
            } else if (sortBy === 'alpha-a-z') {
                params.append('sort', 'name');
                params.append('order', 'asc');
            } else if (sortBy === 'alpha-z-a') {
                params.append('sort', 'name');
                params.append('order', 'desc');
            } else {
                // Default: featured (by creation date, newest first)
                params.append('sort', 'created_at');
                params.append('order', 'desc');
            }

            const response = await productsAPI.getProducts(params);
            const data = response.data;

            if (data.data && data.data.products) {
                setProducts(data.data.products);
                setTotalPages(data.data.pagination?.totalPages || 1);
                setTotalRecords(data.data.pagination?.totalRecords || 0);
                // Fetch ratings for these products
                fetchProductRatings(data.data.products);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            setProducts([]);
            setTotalPages(1);
            setTotalRecords(0);
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

    const handlePageChange = (page) => {
        setCurrentPage(page);
        // Update URL with new page
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set('page', page.toString());
        setSearchParams(newSearchParams);
    };

    const handleSortChange = (e) => {
        setSortBy(e.target.value);
        setCurrentPage(1); // Reset to first page when sorting changes
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
        <div className="grid grid-cols-1 gap-6">
            {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="group relative duration-500 w-full mx-auto animate-pulse">
                    <div className="md:flex items-center">
                        <div className="relative overflow-hidden md:shrink-0 shadow dark:shadow-gray-800 rounded-md">
                            <div className="h-full w-full md:w-48 rounded-md bg-gray-200"></div>
                        </div>
                        <div className="md:ms-6 md:mt-0 mt-4">
                            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-4 bg-gray-200 rounded w-full mt-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/4 mt-2"></div>
                            <div className="h-8 bg-gray-200 rounded w-24 mt-4"></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <>
            <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'info' })} />
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
                            <li className="inline-block uppercase text-[13px] font-bold text-orange-500" aria-current="page">Shop List</li>
                        </ul>
                    </div>
                </div>
            </section>

            <section className="relative md:py-24 py-16">
                <div className="container relative">
                    <div className="grid md:grid-cols-12 sm:grid-cols-2 grid-cols-1 gap-6">
                        <div className="lg:col-span-9 md:col-span-8">
                            <div className="md:flex justify-between items-center mb-6">
                                <span className="font-semibold">
                                    Showing {((currentPage - 1) * 10) + 1}-{Math.min(currentPage * 10, totalRecords)} of {totalRecords} items
                                </span>

                                <div className="md:flex items-center">
                                    <label className="font-semibold md:me-2">Sort by:</label>
                                    <select 
                                        value={sortBy}
                                        onChange={handleSortChange}
                                        className="form-select form-input md:w-36 w-full md:mt-0 mt-1 py-2 px-3 h-10 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded outline-none border border-gray-100 dark:border-gray-800 focus:ring-0"
                                    >
                                        <option value="featured">Featured</option>
                                        <option value="alpha-a-z">Alfa A-Z</option>
                                        <option value="alpha-z-a">Alfa Z-A</option>
                                        <option value="price-low-high">Price Low-High</option>
                                        <option value="price-high-low">Price High-Low</option>
                                    </select>
                                </div>
                            </div>
                            
                            {loading ? (
                                <ProductsSkeleton />
                            ) : (
                                <div className="grid grid-cols-1 gap-6">
                                    {products.map((item, index) => {
                                        const rating = productRatings[item._id]?.avg || 0;
                                        const ratingCount = productRatings[item._id]?.count || 0;
                                        
                                        return (
                                            <div className="group relative duration-500 w-full mx-auto" key={item._id || index}>
                                                <div className="md:flex items-center">
                                                    <div className="relative overflow-hidden md:shrink-0 shadow dark:shadow-gray-800 group-hover:shadow-lg group-hover:dark:shadow-gray-800 rounded-md duration-500">
                                                        <img className="h-full w-full object-cover md:w-48 rounded-md group-hover:scale-110 duration-500" src={getImageUrl(item)} alt={item.name} />
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
                                                    <div className="md:ms-6 md:mt-0 mt-4">
                                                        <Link to={`/product-detail-one/${item._id}`} className="hover:text-orange-500 text-lg font-medium">{item.name}</Link>
                                                        <p className="text-slate-400 md:block hidden mt-2">{item.description}</p>
                                                        <p className="mt-2">{formatPrice(item.price)}</p>

                                                        <ul className="list-none mt-2">
                                                            <li className="inline">
                                                                <Link to="" className="size-6 rounded-full ring-2 ring-gray-200 dark:ring-slate-800 bg-red-600 inline-flex align-middle" title="Red"></Link>
                                                            </li>
                                                            <li className="inline">
                                                                <Link to="" className="size-6 rounded-full ring-2 ring-gray-200 dark:ring-slate-800 bg-indigo-600 inline-flex align-middle" title="Blue"></Link>
                                                            </li>
                                                            <li className="inline">
                                                                <Link to="" className="size-6 rounded-full ring-2 ring-gray-200 dark:ring-slate-800 bg-emerald-600 inline-flex align-middle" title="Green"></Link>
                                                            </li>
                                                        </ul>

                                                        <div className="mt-4">
                                                            <Link to="/shop-cart" className="py-2 px-5 inline-block font-semibold tracking-wide align-middle duration-500 text-base text-center bg-slate-900 dark:bg-slate-800 text-white rounded-md shadow dark:shadow-gray-700">Add to Cart</Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}

                            {totalPages > 1 && (
                                <div className="grid md:grid-cols-12 grid-cols-1 mt-6">
                                    <div className="md:col-span-12 text-center">
                                        <nav aria-label="Page navigation example">
                                            <ul className="inline-flex items-center -space-x-px">
                                                <li>
                                                    <button
                                                        onClick={() => handlePageChange(currentPage - 1)}
                                                        disabled={currentPage === 1}
                                                        className="size-[40px] inline-flex justify-center items-center text-slate-400 bg-white dark:bg-slate-900 rounded-s-3xl hover:text-white border border-gray-100 dark:border-gray-800 hover:border-orange-500 dark:hover:border-orange-500 hover:bg-orange-500 dark:hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        <FiChevronLeft className="size-5 rtl:rotate-180 rtl:-mt-1"></FiChevronLeft>
                                                    </button>
                                                </li>
                                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                                    const pageNum = i + 1;
                                                    return (
                                                        <li key={pageNum}>
                                                            <button
                                                                onClick={() => handlePageChange(pageNum)}
                                                                className={`size-[40px] inline-flex justify-center items-center border ${
                                                                    currentPage === pageNum
                                                                        ? 'text-white bg-orange-500 border-orange-500'
                                                                        : 'text-slate-400 hover:text-white bg-white dark:bg-slate-900 border-gray-100 dark:border-gray-800 hover:border-orange-500 dark:hover:border-orange-500 hover:bg-orange-500 dark:hover:bg-orange-500'
                                                                }`}
                                                            >
                                                                {pageNum}
                                                            </button>
                                                        </li>
                                                    );
                                                })}
                                                <li>
                                                    <button
                                                        onClick={() => handlePageChange(currentPage + 1)}
                                                        disabled={currentPage === totalPages}
                                                        className="size-[40px] inline-flex justify-center items-center text-slate-400 bg-white dark:bg-slate-900 rounded-e-3xl hover:text-white border border-gray-100 dark:border-gray-800 hover:border-orange-500 dark:hover:border-orange-500 hover:bg-orange-500 dark:hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        <FiChevronRight className="size-5 rtl:rotate-180 rtl:-mt-1"></FiChevronRight>
                                                    </button>
                                                </li>
                                            </ul>
                                        </nav>
                                    </div>
                                </div>
                            )}
                        </div>
                        <Filter />
                    </div>
                </div>
            </section>
            <Footer />
            <Switcher />
            <ScrollToTop />
        </>
    )
}