import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { productsAPI, reviewsAPI, wishlistAPI } from "../services/api";
import { FiHeart, FiEye, FiBookmark } from '../assets/icons/vander'
import { AiFillHeart } from 'react-icons/ai';

export default function ArrivalItem() {
	const [newProducts, setNewProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [wishlist, setWishlist] = useState([]);
	const [productRatings, setProductRatings] = useState({});

	useEffect(() => {
		fetchNewProducts();
		fetchWishlist();
	}, []);

	const fetchNewProducts = async () => {
		try {
			setLoading(true);
			const response = await productsAPI.getFeaturedProducts();

			if (response.data && Array.isArray(response.data)) {
				// Take only the first 4 products for new arrivals
				const featuredProducts = response.data.slice(0, 4);
				setNewProducts(featuredProducts);
				// Fetch ratings for these products
				fetchProductRatings(featuredProducts);
			}
		} catch (error) {
			console.error('Error fetching new products:', error);
			setNewProducts([]);
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
					setWishlist(response.data.items.map(w => w._id || w.productId));
				}
			} else {
				// Load from localStorage for non-authenticated users
				const localWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
				setWishlist(localWishlist.map(w => w._id));
			}
		} catch (error) {
			console.error('Error fetching wishlist:', error);
			// Fallback to localStorage
			const localWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
			setWishlist(localWishlist.map(w => w._id));
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

	if (loading) {
		return (
			<div className="container lg:mt-24 mt-16">
				<div className="grid grid-cols-1 mb-6 text-center">
					<h3 className="font-semibold text-3xl leading-normal">New Arrival Items</h3>
				</div>
				<div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6 pt-6">
					{[1, 2, 3, 4].map((item) => (
						<div key={item} className="animate-pulse">
							<div className="bg-gray-200 h-64 rounded-md"></div>
							<div className="mt-4">
								<div className="bg-gray-200 h-4 rounded w-3/4"></div>
								<div className="bg-gray-200 h-4 rounded w-1/2 mt-2"></div>
							</div>
						</div>
					))}
				</div>
			</div>
		);
	}

	return (
		<div className="container lg:mt-24 mt-16">
			<div className="grid grid-cols-1 mb-6 text-center">
				<h3 className="font-semibold text-3xl leading-normal">New Arrival Items</h3>
			</div>

			<div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6 pt-6">
				{newProducts.map((item, index) => {
					const rating = productRatings[item._id]?.avg || 0;
					const ratingCount = productRatings[item._id]?.count || 0;

					return (
						<div className="group" key={item._id || index}>
							<div className="relative overflow-hidden shadow dark:shadow-gray-800 group-hover:shadow-lg group-hover:dark:shadow-gray-800 rounded-md duration-500">
								<img src={getImageUrl(item)} className="group-hover:scale-110 w-full h-64 object-cover duration-500" alt={item.name} />

								<div className="absolute -bottom-20 group-hover:bottom-3 start-3 end-3 duration-500">
									<Link to="/shop-cart" className="py-2 px-5 inline-block font-semibold tracking-wide align-middle duration-500 text-base text-center bg-slate-900 text-white w-full rounded-md">Add to Cart</Link>
								</div>

								<ul className="list-none absolute top-[10px] end-4 opacity-0 group-hover:opacity-100 duration-500 space-y-1">
									<li>
										<Link to="#" className="size-10 inline-flex items-center justify-center tracking-wide align-middle duration-500 text-center rounded-full bg-white text-slate-900 hover:bg-slate-900 hover:text-white shadow">
											{isInWishlist(item._id) ? <AiFillHeart className="size-4 text-red-500" /> : <FiHeart className="size-4" />}
										</Link>
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
		</div>
	)
}
