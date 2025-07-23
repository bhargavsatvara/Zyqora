import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../../../components/navbar";
import Usertab from "../../../components/user-tab";
import Footer from "../../../components/footer";
import Switcher from "../../../components/switcher";
import ScrollToTop from "../../../components/scroll-to-top";

export default function OrderView() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewProductId, setReviewProductId] = useState("");
  const [review, setReview] = useState({ rating: '', comment: '' });
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState("");
  const [productReviews, setProductReviews] = useState({});

  useEffect(() => {
    async function fetchOrder() {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      try {
        const res = await fetch(`https://zyqora.onrender.com/api/orders/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        console.log("data :: ", data);
        if (res.ok) {
          setOrder(data);
        } else {
          setError(data.message || "Order not found");
        }
      } catch (e) {
        setError("Failed to fetch order");
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [id]);

  useEffect(() => {
    if (order && order.order_items) {
      order.order_items.forEach(item => {
        fetch(`https://zyqora.onrender.com/api/reviews/${item.product_id}`)
          .then(res => res.json())
          .then(data => {
            setProductReviews(prev => ({ ...prev, [item.product_id]: data }));
          });
      });
    }
  }, [order]);

  function formatDate(dateStr) {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return `${date.getDate()} ${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()} - ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}`;
  }

  const openReviewModal = (productId) => {
    setReviewProductId(productId);
    setReview({ rating: '', comment: '' });
    setShowReviewModal(true);
    setReviewSuccess("");
  };

  const handleReviewChange = (e) => {
    setReview(r => ({ ...r, [e.target.name]: e.target.value }));
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewSubmitting(true);
    setReviewSuccess("");
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    try {
      const res = await fetch(`https://zyqora.onrender.com/api/reviews/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ rating: review.rating, comment: review.comment, product_id: reviewProductId })
      });
      if (res.ok) {
        setReviewSuccess("Review submitted successfully!");
        setShowReviewModal(false);
      } else {
        const err = await res.json();
        setReviewSuccess(err.message || "Failed to submit review");
      }
    } catch (err) {
      setReviewSuccess("Failed to submit review");
    } finally {
      setReviewSubmitting(false);
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
              <h5 className="text-lg font-semibold mb-6">Order Details</h5>
              {loading ? (
                <div className="py-10 text-center">Loading...</div>
              ) : error ? (
                <div className="py-10 text-center text-red-500">{error}</div>
              ) : order ? (
                <div className="rounded-md shadow dark:shadow-gray-800 p-6 bg-white dark:bg-slate-900">
                  <div className="mb-4 flex flex-col md:flex-row md:justify-between md:items-center">
                    <div>
                      <h6 className="font-semibold">Order #{order._id?.slice(-6)}</h6>
                      <div className="text-slate-400 text-sm">Placed: {formatDate(order.created_at)}</div>
                      <div className="text-slate-400 text-sm">Status: <span className={
                        order.status === 'delivered' ? 'text-green-600' : order.status === 'processing' ? 'text-slate-400' : 'text-red-600'
                      }>{order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}</span></div>
                    </div>
                    <div className="mt-4 md:mt-0">
                      <Link to="/user-account" className="text-orange-500">&larr; Back to Orders</Link>
                    </div>
                  </div>
                  <div className="mb-6">
                    <h6 className="font-semibold mb-2">Billing Address</h6>
                    <div className="text-slate-500 text-sm">
                      {order.billing_address && typeof order.billing_address === 'object' ? (
                        <>
                          {order.billing_address.street}<br />
                          {order.billing_address.city}, {order.billing_address.state}, {order.billing_address.country} {order.billing_address.zipCode}
                        </>
                      ) : (
                        <span>Not available</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <h6 className="font-semibold mb-2">Order Items</h6>
                    <div className="overflow-x-auto">
                      <table className="w-full text-start text-slate-500 dark:text-slate-400">
                        <thead className="text-sm uppercase bg-slate-50 dark:bg-slate-800">
                          <tr>
                            <th className="px-2 py-3 text-start">Product</th>
                            <th className="px-2 py-3 text-start">Quantity</th>
                            <th className="px-2 py-3 text-start">Price</th>
                            <th className="px-2 py-3 text-start">Total</th>
                            <th className="px-2 py-3 text-start">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {order.order_items?.map((item, idx) => (
                            <React.Fragment key={item._id || idx}>
                              <tr className="bg-white dark:bg-slate-900">
                                <td className="px-2 py-3">{item.product_name}</td>
                                <td className="px-2 py-3">{item.quantity}</td>
                                <td className="px-2 py-3">${Number(item.price?.$numberDecimal || item.price || 0).toFixed(2)}</td>
                                <td className="px-2 py-3">${Number(item.total?.$numberDecimal || item.total || 0).toFixed(2)}</td>
                                <td className="px-2 py-3">
                                  <button className="text-orange-500 underline" onClick={() => openReviewModal(item.product_id)}>
                                    Add Review
                                  </button>
                                </td>
                              </tr>
                              {/* Show reviews for this product */}
                              <tr>
                                <td colSpan={5} className="px-2 pb-4 pt-0">
                                  {productReviews[item.product_id] && productReviews[item.product_id].length > 0 ? (
                                    <div className="mt-2 text-xs bg-gray-50 dark:bg-slate-800 rounded p-2">
                                      <div className="font-semibold mb-1">Reviews:</div>
                                      {productReviews[item.product_id].map((review, i) => (
                                        <div key={i} className="mb-1 border-b border-gray-100 dark:border-gray-700 pb-1 last:border-0 last:pb-0">
                                          <span className="font-semibold">{review.user_id?.name || 'User'}:</span>
                                          <span className="ml-2">Rating: {review.rating}★</span>
                                          <span className="ml-2">{review.comment}</span>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <span className="text-slate-400">No reviews yet</span>
                                  )}
                                </td>
                              </tr>
                            </React.Fragment>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="mt-6 flex flex-col md:flex-row md:justify-between md:items-center">
                    <div>
                      <div className="text-slate-500 text-sm">Subtotal: <span className="font-semibold">${Number(order.subtotal?.$numberDecimal || order.subtotal || 0).toFixed(2)}</span></div>
                      <div className="text-slate-500 text-sm">Tax: <span className="font-semibold">${Number(order.tax_amount?.$numberDecimal || order.tax_amount || 0).toFixed(2)}</span></div>
                      <div className="text-slate-500 text-sm">Shipping: <span className="font-semibold">${Number(order.shipping_charge?.$numberDecimal || order.shipping_charge || 0).toFixed(2)}</span></div>
                      <div className="text-slate-500 text-sm">Discount: <span className="font-semibold">${Number(order.discount_amount?.$numberDecimal || order.discount_amount || 0).toFixed(2)}</span></div>
                    </div>
                    <div className="text-lg font-bold mt-4 md:mt-0">Total: ${Number(order.total_amount?.$numberDecimal || order.total_amount || 0).toFixed(2)}</div>
                  </div>
                </div>
              ) : null}
              {/* Review Modal */}
              {showReviewModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                  <div className="bg-white dark:bg-slate-900 p-8 rounded shadow-lg w-full max-w-md relative">
                    <button className="absolute top-2 right-2 text-gray-400 hover:text-orange-500" onClick={() => setShowReviewModal(false)}>&times;</button>
                    <h4 className="text-lg font-semibold mb-4">Add Review</h4>
                    <form onSubmit={handleReviewSubmit} className="space-y-3">
                      <label className="block font-medium">Rating</label>
                      <select name="rating" value={review.rating} onChange={handleReviewChange} className="w-full border rounded px-3 py-2" required>
                        <option value="">Select Rating</option>
                        {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} Star{n > 1 ? 's' : ''}</option>)}
                      </select>
                      <label className="block font-medium">Comment</label>
                      <textarea name="comment" value={review.comment} onChange={handleReviewChange} className="w-full border rounded px-3 py-2" required />
                      {reviewSuccess && <div className="text-green-600 text-sm">{reviewSuccess}</div>}
                      <button type="submit" className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600" disabled={reviewSubmitting}>{reviewSubmitting ? 'Submitting...' : 'Submit Review'}</button>
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
  );
} 