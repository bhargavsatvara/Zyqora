import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../../components/navbar";
import Usertab from "../../../components/user-tab";
import Switcher from "../../../components/switcher"
import Footer from "../../../components/footer"
import ScrollToTop from "../../../components/scroll-to-top";
import { FiTrash2 } from '../../../assets/icons/vander'
import { ordersAPI, wishlistAPI } from "../../../services/api";

export default function UserAccount() {
	const [orders, setOrders] = useState([]);
	const [wishlist, setWishlist] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const token = localStorage.getItem('token') || sessionStorage.getItem('token');
		if (!token) return;
		setLoading(true);
		
		// Fetch orders
		ordersAPI.getOrders()
			.then(res => {
				const data = res.data;
				if (Array.isArray(data)) {
					setOrders(data);
				} else if (data && Array.isArray(data.orders)) {
					setOrders(data.orders);
				}
			})
			.catch(error => {
				console.error('Error fetching orders:', error);
			});
			
		// Fetch wishlist
		wishlistAPI.getWishlist()
			.then(res => {
				const data = res.data;
				if (data && Array.isArray(data.items)) {
					setWishlist(data.items);
				}
			})
			.catch(error => {
				console.error('Error fetching wishlist:', error);
			})
			.finally(() => setLoading(false));
	}, []);

	const handleRemoveFromWishlist = async (item) => {
		const token = localStorage.getItem('token') || sessionStorage.getItem('token');
		if (token) {
			// Remove from backend
			try {
				await wishlistAPI.removeFromWishlistAlt(item._id || item.productId?._id || item.productId);
				setWishlist(wishlist => wishlist.filter(w => (w._id || w.productId?._id || w.productId) !== (item._id || item.productId?._id || item.productId)));
			} catch (error) {
				console.error('Error removing from wishlist:', error);
			}
		} else {
			// Remove from localStorage
			let localWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
			localWishlist = localWishlist.filter(w => (w._id || w.productId?._id || w.productId) !== (item._id || item.productId?._id || item.productId));
			localStorage.setItem('wishlist', JSON.stringify(localWishlist));
			setWishlist(localWishlist);
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
							<h5 className="text-lg font-semibold mb-6">My Orders</h5>
							<div className="relative overflow-x-auto shadow dark:shadow-gray-800 rounded-md">
								<table className="w-full text-start text-slate-500 dark:text-slate-400">
									<thead className="text-sm uppercase bg-slate-50 dark:bg-slate-800">
										<tr className="text-start">
											<th scope="col" className="px-2 py-3 text-start" style={{ minWidth: '104px' }}>Order no.</th>
											<th scope="col" className="px-2 py-3 text-start" style={{ minWidth: '140px' }}>Date</th>
											<th scope="col" className="px-2 py-3 text-start" style={{ minWidth: '120px' }}>Status</th>
											<th scope="col" className="px-2 py-3 text-start" style={{ minWidth: '140px' }}>Total</th>
											<th scope="col" className="px-2 py-3 text-start" style={{ minWidth: '100px' }}>Action</th>
										</tr>
									</thead>
									<tbody>
										{loading ? (
											<tr><td colSpan={5} className="text-center py-6">Loading...</td></tr>
										) : orders.length === 0 ? (
											<tr><td colSpan={5} className="text-center py-6">No orders found.</td></tr>
										) : orders.map((item, index) => {
											const status = item.status || (item.cancelled ? 'Canceled' : 'Processing');
											return (
												<tr className="bg-white dark:bg-slate-900 text-start" key={item._id || index}>
													<th className="px-2 py-3 text-start" scope="row">{item._id?.slice(-6) || index + 1}</th>
													<td className="px-2 py-3 text-start">
														{item.created_at
															? (() => {
																const date = new Date(item.created_at);
																return `${date.getDate()} ${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()} - ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}`;
															})()
															: ''}
													</td>
													{status === 'delivered' && (
														<td className="px-2 py-3 text-start text-green-600">Delivered</td>
													)}
													{status === 'shipped' && (
														<td className="px-2 py-3 text-start text-green-600">Shipped</td>
													)}
													{status === 'processing' && (
														<td className="px-2 py-3 text-start text-slate-400">Processing</td>
													)}
													{status === 'cancelled' || status === 'cancelled' ? (
														<td className="px-2 py-3 text-start text-red-600">Cancelled</td>
													) : null}
													<td className="px-2 py-3 text-start">
														${Number(item.total_amount?.$numberDecimal || item.total_amount || 0).toFixed(2)}
														<span className="text-slate-400"> for {item.order_items?.length ? `${item.order_items.length} items` : ''}</span>
													</td>
													<td className="px-2 py-3 text-start"><Link to={"/order-view/" + item._id} className="text-orange-500">View <i className="mdi mdi-chevron-right"></i></Link></td>
												</tr>
											)
										})}
									</tbody>
								</table>
							</div>

							<h5 className="text-lg font-semibold my-6">My favourite Items</h5>

							<div className="rounded-md shadow dark:shadow-gray-800 p-6 py-0">
								<ul>
									{loading ? (
										<li className="py-6 text-center">Loading...</li>
									) : wishlist.length === 0 ? (
										<li className="py-6 text-center">No favourite items found.</li>
									) : wishlist.map((item, index) => (
										<li className="flex justify-between items-center py-6 border-t first-of-type:border-0 border-gray-100 dark:border-gray-700" key={item._id || index}>
											<div className="flex items-center">
												<img src={item.image} className="rounded shadow dark:shadow-gray-800 w-16" alt={item.name || ''} />
												<div className="ms-4">
													<Link to={"/product-detail-one/" + (item._id || item.productId?._id || '')} className="font-semibold hover:text-orange-500">{item.name}</Link>
													{item.price && <p className="text-green-600 text-sm mt-1">${item.price}</p>}
												</div>
											</div>
											<div>
												<button className="size-9 inline-flex items-center justify-center tracking-wide align-middle duration-500 text-base text-center bg-red-600/5 hover:bg-red-600 text-red-600 hover:text-white rounded-full" onClick={() => handleRemoveFromWishlist(item)}>
													<FiTrash2 className="h-4 w-4"></FiTrash2>
												</button>
											</div>
										</li>
									))}
								</ul>
							</div>
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