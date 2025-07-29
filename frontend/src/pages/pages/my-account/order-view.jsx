import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../../../components/navbar";
import Usertab from "../../../components/user-tab";
import Footer from "../../../components/footer";
import Switcher from "../../../components/switcher";
import ScrollToTop from "../../../components/scroll-to-top";
import { ordersAPI, reviewsAPI } from "../../../services/api";
import { useToast } from "../../../contexts/ToastContext";
import Invoice from "../../../components/Invoice";

export default function OrderView() {
  const { id } = useParams();
  const { showSuccess, showError } = useToast();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewProductId, setReviewProductId] = useState("");
  const [review, setReview] = useState({ rating: '', comment: '' });
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState("");
  const [productReviews, setProductReviews] = useState({});
  const [showInvoice, setShowInvoice] = useState(false);
  const [invoiceData, setInvoiceData] = useState(null);
  const [invoiceLoading, setInvoiceLoading] = useState(false);

  useEffect(() => {
    async function fetchOrder() {
      setLoading(true);
      setError("");
      try {
        const res = await ordersAPI.getOrder(id);
        console.log("data :: ", res.data);
        setOrder(res.data);
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
        reviewsAPI.getProductReviews(item.product_id)
          .then(res => {
            setProductReviews(prev => ({ ...prev, [item.product_id]: res.data }));
          })
          .catch(error => {
            console.error('Error fetching reviews:', error);
          });
      });
    }
  }, [order]);

  function formatDate(dateStr) {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return `${date.getDate()} ${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()} - ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}`;
  }

  const handleGenerateInvoice = async () => {
    setInvoiceLoading(true);
    try {
      const response = await ordersAPI.generateInvoice(id);
      setInvoiceData(response.data.invoice);
      setShowInvoice(true);
      showSuccess('Invoice generated successfully!');
    } catch (error) {
      console.error('Error generating invoice:', error);
      showError('Failed to generate invoice');
    } finally {
      setInvoiceLoading(false);
    }
  };

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
    try {
      const res = await reviewsAPI.addReview({
        rating: review.rating,
        comment: review.comment,
        product_id: reviewProductId
      });
      setReviewSuccess("Review submitted successfully!");
      setShowReviewModal(false);
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
              <div className="flex items-center gap-4 mb-6">
                <Link
                  to="/user-account"
                  className="inline-flex items-center gap-2 px-4 py-2 text-black font-medium rounded-lg shadow-md hover:from-orange-700 hover:to-orange-800 transform hover:scale-105 transition-all duration-200"
                >
                  <i className="mdi mdi-arrow-left text-lg"></i>
                </Link>
                <div className="flex-1">
                  <h5 className="text-xl font-bold text-gray-800">Order Details</h5>
                  <p className="text-sm text-gray-600 mt-1">Order #{id}</p>
                </div>
              </div>

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
                    <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
                      <button
                        onClick={handleGenerateInvoice}
                        disabled={invoiceLoading}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      >
                        {invoiceLoading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Generating...
                          </>
                        ) : (
                          <>
                            <i className="mdi mdi-file-document-outline text-lg"></i>
                            Generate Invoice
                          </>
                        )}
                      </button>

                      <button
                        onClick={async () => {
                          try {
                            const response = await ordersAPI.generateInvoice(id);
                            const invoiceData = response.data.invoice;

                            const printWindow = window.open('', '_blank');
                            printWindow.document.write(`
                              <html>
                                <head>
                                  <title>Invoice ${invoiceData.invoiceNumber}</title>
                                  <style>
                                    body { 
                                      font-family: Arial, sans-serif; 
                                      margin: 0; 
                                      padding: 20px; 
                                      background-color: #f8f9fa;
                                    }
                                    .invoice-container {
                                      max-width: 800px;
                                      margin: 0 auto;
                                      background: white;
                                      padding: 40px;
                                      border-radius: 8px;
                                      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                                    }
                                    .invoice-header { 
                                      text-align: center; 
                                      margin-bottom: 30px; 
                                      border-bottom: 2px solid #e9ecef;
                                      padding-bottom: 20px;
                                    }
                                    .invoice-header h1 {
                                      color: #2c3e50;
                                      margin: 0;
                                      font-size: 2.5em;
                                    }
                                    .invoice-header h2 {
                                      color: #7f8c8d;
                                      margin: 10px 0 0 0;
                                      font-size: 1.2em;
                                    }
                                    .company-info { 
                                      margin-bottom: 30px; 
                                      padding: 20px;
                                      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                                      color: white;
                                      border-radius: 8px;
                                    }
                                    .company-info h3 {
                                      margin: 0 0 10px 0;
                                      font-size: 1.5em;
                                    }
                                    .company-info p {
                                      margin: 5px 0;
                                      font-size: 0.9em;
                                    }
                                    .invoice-details { 
                                      display: flex; 
                                      justify-content: space-between; 
                                      margin-bottom: 30px; 
                                      gap: 40px;
                                    }
                                    .invoice-details > div {
                                      flex: 1;
                                      padding: 20px;
                                      background: #f8f9fa;
                                      border-radius: 8px;
                                    }
                                    .customer-info { 
                                      margin-bottom: 20px; 
                                    }
                                    .customer-info h4 {
                                      color: #2c3e50;
                                      margin: 0 0 10px 0;
                                      border-bottom: 1px solid #dee2e6;
                                      padding-bottom: 5px;
                                    }
                                    table { 
                                      width: 100%; 
                                      border-collapse: collapse; 
                                      margin-bottom: 30px; 
                                      background: white;
                                      border-radius: 8px;
                                      overflow: hidden;
                                      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                                    }
                                    th, td { 
                                      border: 1px solid #dee2e6; 
                                      padding: 15px; 
                                      text-align: left; 
                                    }
                                    th { 
                                      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                                      color: white;
                                      font-weight: 600;
                                    }
                                    tr:nth-child(even) {
                                      background-color: #f8f9fa;
                                    }
                                    .totals { 
                                      text-align: right; 
                                      margin-top: 20px;
                                    }
                                    .totals table { 
                                      width: 300px; 
                                      margin-left: auto; 
                                      background: white;
                                      border-radius: 8px;
                                      overflow: hidden;
                                      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                                    }
                                    .totals td { 
                                      border: none; 
                                      padding: 12px 15px; 
                                      border-bottom: 1px solid #dee2e6;
                                    }
                                    .totals tr:last-child td {
                                      border-bottom: none;
                                      font-weight: bold;
                                      font-size: 1.1em;
                                      background: #e8f5e8;
                                      color: #2c5aa0;
                                    }
                                    .footer { 
                                      margin-top: 40px; 
                                      text-align: center; 
                                      color: #6c757d;
                                      padding: 20px;
                                      background: #f8f9fa;
                                      border-radius: 8px;
                                      border-top: 2px solid #e9ecef;
                                    }
                                    .footer p {
                                      margin: 5px 0;
                                    }
                                    .status-badge {
                                      display: inline-block;
                                      padding: 5px 15px;
                                      border-radius: 20px;
                                      font-size: 0.8em;
                                      font-weight: bold;
                                      text-transform: uppercase;
                                    }
                                    .status-delivered { background: #d4edda; color: #155724; }
                                    .status-processing { background: #fff3cd; color: #856404; }
                                    .status-pending { background: #f8d7da; color: #721c24; }
                                    @media print {
                                      body { background: white; }
                                      .invoice-container { box-shadow: none; }
                                      .no-print { display: none; }
                                    }
                                  </style>
                                </head>
                                <body>
                                  <div class="invoice-container">
                                    <div class="invoice-header">
                                      <h1>INVOICE</h1>
                                      <h2>${invoiceData.company.name}</h2>
                                    </div>
                                    
                                    <div class="company-info">
                                      <h3>${invoiceData.company.name}</h3>
                                      <p>${invoiceData.company.address}</p>
                                      <p>Phone: ${invoiceData.company.phone} | Email: ${invoiceData.company.email}</p>
                                      <p>Website: ${invoiceData.company.website}</p>
                                    </div>
                                    
                                    <div class="invoice-details">
                                      <div>
                                        <h4>Invoice Details</h4>
                                        <p><strong>Invoice Number:</strong> ${invoiceData.invoiceNumber}</p>
                                        <p><strong>Order Number:</strong> ${invoiceData.orderNumber}</p>
                                        <p><strong>Order Date:</strong> ${invoiceData.orderDate}</p>
                                        <p><strong>Due Date:</strong> ${invoiceData.dueDate}</p>
                                      </div>
                                      <div class="customer-info">
                                        <h4>Bill To</h4>
                                        <p><strong>${invoiceData.customer.name}</strong></p>
                                        <p>${invoiceData.customer.email}</p>
                                        ${invoiceData.customer.address ? `
                                          <p>${invoiceData.customer.address.street}</p>
                                          <p>${invoiceData.customer.address.city}, ${invoiceData.customer.address.state} ${invoiceData.customer.address.zipCode}</p>
                                          <p>${invoiceData.customer.address.country}</p>
                                        ` : ''}
                                      </div>
                                    </div>
                                    
                                    <table>
                                      <thead>
                                        <tr>
                                          <th>Item</th>
                                          <th>SKU</th>
                                          <th>Size</th>
                                          <th>Color</th>
                                          <th>Qty</th>
                                          <th>Price</th>
                                          <th>Total</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        ${invoiceData.items.map(item => `
                                          <tr>
                                            <td><strong>${item.name}</strong></td>
                                            <td>${item.sku}</td>
                                            <td>${item.size}</td>
                                            <td>${item.color}</td>
                                            <td>${item.quantity}</td>
                                            <td>$${(item.price || 0).toFixed(2)}</td>
                                            <td><strong>$${(item.total || 0).toFixed(2)}</strong></td>
                                          </tr>
                                        `).join('')}
                                      </tbody>
                                    </table>
                                    
                                    <div class="totals">
                                      <table>
                                        <tr>
                                          <td><strong>Subtotal:</strong></td>
                                          <td>$${(invoiceData.subtotal || 0).toFixed(2)}</td>
                                        </tr>
                                        <tr>
                                          <td><strong>Tax:</strong></td>
                                          <td>$${(invoiceData.tax || 0).toFixed(2)}</td>
                                        </tr>
                                        <tr>
                                          <td><strong>Shipping:</strong></td>
                                          <td>$${(invoiceData.shipping || 0).toFixed(2)}</td>
                                        </tr>
                                        <tr>
                                          <td><strong>Discount:</strong></td>
                                          <td>-$${(invoiceData.discount || 0).toFixed(2)}</td>
                                        </tr>
                                        <tr>
                                          <td><strong>Total:</strong></td>
                                          <td><strong>$${(invoiceData.total || 0).toFixed(2)}</strong></td>
                                        </tr>
                                      </table>
                                    </div>
                                    
                                    <div class="footer">
                                      <p><strong>Thank you for your business!</strong></p>
                                      <p>Payment Method: ${invoiceData.paymentMethod}</p>
                                      <p>Order Status: <span class="status-badge status-${invoiceData.status}">${invoiceData.status}</span></p>
                                      <p style="margin-top: 20px; font-size: 0.8em; color: #adb5bd;">
                                        Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}
                                      </p>
                                    </div>
                                  </div>
                                </body>
                              </html>
                            `);
                            printWindow.document.close();
                            showSuccess('Invoice opened in new tab!');
                          } catch (error) {
                            console.error('Error downloading invoice:', error);
                            showError('Failed to download invoice');
                          }
                        }}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:from-emerald-600 hover:to-emerald-700 transform hover:scale-105 transition-all duration-200"
                      >
                        <i className="mdi mdi-download text-lg"></i>
                        Download Invoice
                      </button>


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
                        {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} Star{n > 1 ? 's' : ''}</option>)}
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

      {/* Invoice Modal */}
      {showInvoice && invoiceData && (
        <Invoice
          invoiceData={invoiceData}
          onClose={() => setShowInvoice(false)}
        />
      )}

      <Footer />
      <Switcher />
      <ScrollToTop />
    </>
  );
} 