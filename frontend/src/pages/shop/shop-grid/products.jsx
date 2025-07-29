import React, { useState, useEffect, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";

import Navbar from "../../../components/navbar";
import Footer from "../../../components/footer";
import Switcher from "../../../components/switcher";
import Filter from "../../../components/filter";
import Toast from '../../../components/Toast';

import { FiHeart, FiEye, FiBookmark, FiChevronLeft, FiChevronRight } from '../../../assets/icons/vander'
import { AiFillHeart } from 'react-icons/ai';
import ScrollToTop from "../../../components/scroll-to-top";
import { productsAPI, wishlistAPI, reviewsAPI, cartAPI } from "../../../services/api";
import { useWishlist } from '../../../contexts/WishlistContext';

export default function Products() {
	const [searchParams] = useSearchParams();
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [totalRecords, setTotalRecords] = useState(0);
	const [filters, setFilters] = useState({
		search: null,
		category_id: null,
		brand_id: null,
		department_id: null,
		min_price: null,
		max_price: null
	});
	const { wishlist, refreshWishlist } = useWishlist();
	const [productRatings, setProductRatings] = useState({});
	const [toast, setToast] = useState({ message: '', type: 'info' });
	console.log("products :: ", searchParams.get('category_id'));
	// Wrap fetchProducts in useCallback for user interactions
	const fetchProducts = useCallback(async () => {
		setLoading(true);
		try {
			console.log('Current filters state:', filters);
			
			// Clean up filters - remove empty values
			const cleanFilters = Object.fromEntries(
				Object.entries(filters).filter(([key, value]) => 
					value !== '' && value !== null && value !== undefined
				)
			);

			const params = {
				page: currentPage,
				limit: 12,
				...cleanFilters
			};

			console.log('Fetching products with params:', params);
			const response = await productsAPI.getProducts(params);
			const data = response.data;

			if (data.data && data.data.products) {
				setProducts(data.data.products);
				setTotalPages(data.data.pagination?.totalPages || 1);
				setTotalRecords(data.data.pagination?.totalRecords || 0);
			}
		} catch (error) {
			console.error('Error fetching products:', error);
			setProducts([]);
		} finally {
			setLoading(false);
		}
	}, [currentPage, filters]);

	// Handle URL parameters on component mount and fetch products
	useEffect(() => {
		const categoryId = searchParams.get('category_id');
		const departmentId = searchParams.get('department_id');
		const brandId = searchParams.get('brand_id');
		const search = searchParams.get('search');
		console.log("categoryId :: ", categoryId);

		const newFilters = {
			category_id: categoryId || null,
			department_id: departmentId || null,
			brand_id: brandId || null,
			search: search || null,
			min_price: null,
			max_price: null
		};

		setFilters(newFilters);
		
		// Fetch products with the new filters
		const fetchWithFilters = async () => {
			setLoading(true);
			try {
				console.log('Current filters state:', newFilters);
				
				// Clean up filters - remove empty values
				const cleanFilters = Object.fromEntries(
					Object.entries(newFilters).filter(([key, value]) => 
						value !== '' && value !== null && value !== undefined
					)
				);

				const params = {
					page: 1,
					limit: 12,
					...cleanFilters
				};

				console.log('Fetching products with params:', params);
				const response = await productsAPI.getProducts(params);
				const data = response.data;

				if (data.data && data.data.products) {
					setProducts(data.data.products);
					setTotalPages(data.data.pagination?.totalPages || 1);
					setTotalRecords(data.data.pagination?.totalRecords || 0);
				}
			} catch (error) {
				console.error('Error fetching products:', error);
				setProducts([]);
			} finally {
				setLoading(false);
			}
		};

		fetchWithFilters();
	}, [searchParams]);

	// Fetch products when filters change (for user interactions)
	useEffect(() => {
		// Skip the initial fetch since it's handled by the URL params effect
		if (filters.category_id !== null || filters.department_id !== null || 
			filters.brand_id !== null || filters.search !== null ||
			filters.min_price !== null || filters.max_price !== null) {
			fetchProducts();
		}
	}, [filters, fetchProducts]);

	// Load wishlist on mount
	useEffect(() => {
		const token = localStorage.getItem('token') || sessionStorage.getItem('token');
		console.log("token :: ", token);
		if (token) {
			// Fetch wishlist from API
			wishlistAPI.getWishlist()
				.then(res => {
					if (res.data && Array.isArray(res.data.items)) {
						// setWishlist(res.data.items.map(w => w._id || w.productId)); // This line is removed as per edit hint
					}
				})
				.catch(error => {
					console.error('Error fetching wishlist:', error);
				});
		} else {
			// Load from localStorage
			const localWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
			// setWishlist(localWishlist.map(w => w._id)); // This line is removed as per edit hint
		}
	}, []);

	// Fetch ratings for visible products
	useEffect(() => {
		async function fetchRatings() {
			const ratings = {};
			await Promise.all(products.map(async (item) => {
				if (item._id) {
					try {
						const res = await reviewsAPI.getProductReviews(item._id);
						const data = res.data;
						if (Array.isArray(data) && data.length > 0) {
							const avg = data.reduce((sum, r) => sum + (Number(r.rating) || 0), 0) / data.length;
							ratings[item._id] = { avg, count: data.length };
						} else {
							ratings[item._id] = { avg: 0, count: 0 };
						}
					} catch (error) {
						ratings[item._id] = { avg: 0, count: 0 };
					}
				}
			}));
			setProductRatings(ratings);
		}
		if (products.length > 0) fetchRatings();
	}, [products]);

	const handleFilterChange = (newFilters) => {
		setFilters(prev => ({ ...prev, ...newFilters }));
		setCurrentPage(1);
	};

	const handlePageChange = (page) => {
		setCurrentPage(page);
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

	// Update wishlist state on add
	const handleAddToWishlist = async (item) => {
		const token = localStorage.getItem('token') || sessionStorage.getItem('token');
		if (token) {
			try {
				await wishlistAPI.addToWishlistAlt({ productId: item._id });
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

	return (
		<>
			<Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'info' })} />
			<Navbar navClass="defaultscroll is-sticky" />
			<section className="relative table w-full py-20 lg:py-24 md:pt-28 bg-gray-50 dark:bg-slate-800">
				<div className="container relative">
					<div className="grid grid-cols-1 mt-14">
						<h3 className="text-3xl leading-normal font-semibold">Products</h3>
					</div>

					<div className="relative mt-3">
						<ul className="tracking-[0.5px] mb-0 inline-block">
							<li className="inline-block uppercase text-[13px] font-bold duration-500 ease-in-out hover:text-orange-500"><Link to="/">Zyqora</Link></li>
							<li className="inline-block text-base text-slate-950 dark:text-white mx-0.5 ltr:rotate-0 rtl:rotate-180"><i className="mdi mdi-chevron-right"></i></li>
							<li className="inline-block uppercase text-[13px] font-bold text-orange-500" aria-current="page">Products</li>
						</ul>
					</div>
				</div>
			</section>
			<section className="relative md:py-24 py-16" role="main">
				<div className="container relative">
					<div className="grid md:grid-cols-12 sm:grid-cols-2 grid-cols-1 gap-6">
						<Filter onFilterChange={handleFilterChange} filters={filters} />
						<div className="lg:col-span-9 md:col-span-8">
							<div className="md:flex justify-between items-center mb-6">
								<span className="font-semibold">
									{products.length === 0 ? (
										<span role="status">No products found</span>
									) : (
										`Showing ${((currentPage - 1) * 12) + 1}-${Math.min(currentPage * 12, totalRecords)} of ${totalRecords} items`
									)}
								</span>

								<div className="md:flex items-center">
									<label className="font-semibold md:me-2">Sort by:</label>
									<select className="form-select form-input md:w-36 w-full md:mt-0 mt-1 py-2 px-3 h-10 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded outline-none border border-gray-100 dark:border-gray-800 focus:ring-0">
										<option defaultValue="">Featured</option>
										<option defaultValue="">Sale</option>
										<option defaultValue="">Alfa A-Z</option>
										<option defaultValue="">Alfa Z-A</option>
										<option defaultValue="">Price Low-High</option>
										<option defaultValue="">Price High-Low</option>
									</select>
								</div>
							</div>

							{loading ? (
								<div className="flex items-center justify-center py-20" role="status">
									<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
								</div>
							) : products.length === 0 ? (
								<div className="flex flex-col items-center justify-center py-20" role="status">
									<div className="text-6xl mb-4 text-gray-300">
										<i className="mdi mdi-package-variant"></i>
									</div>
									<h3 className="text-xl font-semibold mb-2 text-gray-700 dark:text-gray-300">No Products Found</h3>
									<p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
										We couldn't find any products matching your current filters. Try adjusting your search criteria or browse our full collection.
									</p>
									<button
										onClick={() => {
											setFilters({
												search: '',
												category_id: '',
												brand_id: '',
												department_id: '',
												min_price: '',
												max_price: ''
											});
											setCurrentPage(1);
										}}
										className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
									>
										Clear All Filters
									</button>
								</div>
							) : (
								<div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6" role="region" aria-label="Product Grid">
									{products.map((item, index) => (
										<div className="group" key={item._id || index}>
											<div className="relative overflow-hidden shadow dark:shadow-gray-800 group-hover:shadow-lg group-hover:dark:shadow-gray-800 rounded-md duration-500">
												<img
													src={getImageUrl(item)}
													className="group-hover:scale-110 duration-500 w-full h-64 object-cover"
													alt={item.name}
													onError={(e) => {
														e.target.src = '/assets/images/shop/default-product.jpg';
													}}
												/>

												<div className="absolute -bottom-20 group-hover:bottom-3 start-3 end-3 duration-500">
													<Link to={`/product-detail-one/${item._id}`} className="py-2 px-5 inline-block font-semibold tracking-wide align-middle duration-500 text-base text-center bg-slate-900 text-white w-full rounded-md">
														View Details
													</Link>
												</div>

												<ul className="list-none absolute top-[10px] end-4 opacity-0 group-hover:opacity-100 duration-500 space-y-1">
													<li>
														<button
															type="button"
															className={`inline-flex items-center justify-center w-10 h-10 rounded-full shadow duration-500 border-none focus:outline-none ${wishlist.includes(item._id) ? 'bg-red-100 text-red-500' : 'bg-white text-slate-900 hover:bg-slate-900 hover:text-white'}`}
															onClick={async (e) => {
																e.preventDefault();
																handleAddToWishlist(item);
															}}
														>
															{wishlist.includes(item._id) ? (
																<AiFillHeart className="w-4 h-4" color="#ef4444" />
															) : (
																<FiHeart className="w-4 h-4" />
															)}
														</button>
													</li>
													<li className="mt-1 ms-0"><Link to={`/product-detail-one/${item._id}`} className="size-10 inline-flex items-center justify-center tracking-wide align-middle duration-500 text-center rounded-full bg-white text-slate-900 hover:bg-slate-900 hover:text-white shadow"><FiEye className="size-4"></FiEye></Link></li>
													{/* <li className="mt-1 ms-0"><Link to="#" className="size-10 inline-flex items-center justify-center tracking-wide align-middle duration-500 text-center rounded-full bg-white text-slate-900 hover:bg-slate-900 hover:text-white shadow"><FiBookmark className="size-4"></FiBookmark></Link></li> */}
												</ul>
											</div>

											<div className="mt-4">
												<Link to={`/product-detail-one/${item._id}`} className="hover:text-orange-500 text-lg font-medium">{item.name}</Link>
												<div className="flex justify-between items-center mt-1">
													<p className="text-lg font-semibold">${item.price || 0}</p>
													<ul className="font-medium text-amber-400 list-none">
														{[1, 2, 3, 4, 5].map(n => (
															<li className="inline" key={n}>
																<i className={`mdi mdi-star${(productRatings[item._id]?.avg || 0) >= n ? '' : '-outline'}`}></i>
															</li>
														))}
														<span className="text-slate-400 ms-2 text-sm align-middle">{productRatings[item._id]?.avg ? productRatings[item._id].avg.toFixed(1) : '0.0'} ({productRatings[item._id]?.count || 0})</span>
													</ul>
												</div>
												{item.category_id && (
													<p className="text-sm text-slate-500 mt-1">{item.category_id.name}</p>
												)}
											</div>
										</div>
									))}
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
												{Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
													<li key={page}>
														<button
															onClick={() => handlePageChange(page)}
															className={`size-[40px] inline-flex justify-center items-center ${currentPage === page
																? 'text-white bg-orange-500 border border-orange-500'
																: 'text-slate-400 hover:text-white bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-800 hover:border-orange-500 dark:hover:border-orange-500 hover:bg-orange-500 dark:hover:bg-orange-500'
																}`}
														>
															{page}
														</button>
													</li>
												))}
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
					</div>
				</div>
			</section>
			<Footer />
			<Switcher />
			<ScrollToTop />
		</>
	)
} 