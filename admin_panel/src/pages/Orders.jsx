import React, { useState, useEffect } from 'react';
import { Search, Eye, Edit, Package, Truck, CheckCircle, Clock, Calendar, DollarSign, ShoppingCart, AlertTriangle, Trash2, FileText } from 'lucide-react';
import { ordersAPI } from '../services/api';
import { useToast } from '../contexts/ToastContext';

export default function Orders() {
  const { showSuccess, showError } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [invoiceLoading, setInvoiceLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [currentPage, searchTerm, statusFilter, dateFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 10,
        search: searchTerm || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
      };

      const response = await ordersAPI.getOrders(params);
      console.log('Orders API response:', response.data);
      const apiData = response.data && response.data.data ? response.data.data : { orders: [], pagination: { total: 0, totalRecords: 0 } };
      const { orders: ordersData, pagination } = apiData;
      setOrders(ordersData);
      setTotalPages(pagination.total);
      setTotalOrders(pagination.totalRecords);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (order.user_id?.name && order.user_id.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (order.user_id?.email && order.user_id.email.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await ordersAPI.updateOrderStatus(orderId, newStatus);
      setOrders(prev => prev.map(order => 
        order._id === orderId ? { ...order, status: newStatus } : order
      ));
      showSuccess('Order status updated successfully!');
    } catch (error) {
      showError('Error updating order status: ' + (error.response?.data?.message || error.message));
    }
  };

  const deleteOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await ordersAPI.deleteOrder(orderId);
        setOrders(prev => prev.filter(order => order._id !== orderId));
        showSuccess('Order deleted successfully!');
      } catch (error) {
        showError('Error deleting order: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const handleEditOrder = (order) => {
    setEditingOrder(order);
    setShowEditModal(true);
  };

  const handleGenerateInvoice = async (orderId) => {
    console.log('Generating invoice for order:', orderId);
    setInvoiceLoading(true);
    try {
      console.log('Calling ordersAPI.generateInvoice...');
      const response = await ordersAPI.generateInvoice(orderId);
      console.log('Invoice API response:', response);
      const invoiceData = response.data.invoice;
      
      // Open invoice in new tab
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <html>
          <head>
            <title>Invoice ${invoiceData.invoiceNumber}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
              .invoice-header { text-align: center; margin-bottom: 30px; }
              .company-info { margin-bottom: 20px; }
              .invoice-details { display: flex; justify-content: space-between; margin-bottom: 30px; }
              .customer-info { margin-bottom: 20px; }
              table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
              th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
              th { background-color: #f8f9fa; }
              .totals { text-align: right; }
              .totals table { width: 300px; margin-left: auto; }
              .totals td { border: none; padding: 5px; }
              .footer { margin-top: 40px; text-align: center; color: #666; }
            </style>
          </head>
          <body>
            <div class="invoice-header">
              <h1>INVOICE</h1>
              <h2>${invoiceData.company.name}</h2>
            </div>
            
            <div class="company-info">
              <p><strong>${invoiceData.company.name}</strong></p>
              <p>${invoiceData.company.address}</p>
              <p>Phone: ${invoiceData.company.phone} | Email: ${invoiceData.company.email}</p>
              <p>Website: ${invoiceData.company.website}</p>
            </div>
            
            <div class="invoice-details">
              <div>
                <p><strong>Invoice Number:</strong> ${invoiceData.invoiceNumber}</p>
                <p><strong>Order Number:</strong> ${invoiceData.orderNumber}</p>
                <p><strong>Order Date:</strong> ${invoiceData.orderDate}</p>
                <p><strong>Due Date:</strong> ${invoiceData.dueDate}</p>
              </div>
              <div class="customer-info">
                <p><strong>Bill To:</strong></p>
                <p>${invoiceData.customer.name}</p>
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
                    <td>${item.name}</td>
                    <td>${item.sku}</td>
                    <td>${item.size}</td>
                    <td>${item.color}</td>
                    <td>${item.quantity}</td>
                    <td>$${(item.price || 0).toFixed(2)}</td>
                    <td>$${(item.total || 0).toFixed(2)}</td>
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
              <p>Thank you for your business!</p>
              <p>Payment Method: ${invoiceData.paymentMethod}</p>
              <p>Order Status: ${invoiceData.status}</p>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      showSuccess('Invoice opened in new tab!');
    } catch (error) {
      console.error('Error generating invoice:', error);
      console.error('Error details:', error.response?.data);
      console.error('Error status:', error.response?.status);
      showError('Failed to generate invoice: ' + (error.response?.data?.message || error.message));
    } finally {
      setInvoiceLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'processing':
        return <Package className="h-4 w-4" />;
      case 'shipped':
        return <Truck className="h-4 w-4" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-100 text-amber-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-emerald-100 text-emerald-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Orders</h1>
          <p className="text-slate-600 mt-2">Manage customer orders and track their status</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Orders</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{totalOrders}</p>
            </div>
            <div className="p-3 rounded-2xl bg-blue-100">
              <ShoppingCart className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Pending</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">
                {orders.filter(o => o.status === 'pending').length}
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-amber-100">
              <Clock className="h-6 w-6 text-amber-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Processing</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">
                {orders.filter(o => o.status === 'processing').length}
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-blue-100">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Delivered</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">
                {orders.filter(o => o.status === 'delivered').length}
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-100">
              <CheckCircle className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search orders by ID, customer name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 w-full border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Order ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Customer</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Amount</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredOrders.map((order) => (
                <tr key={order._id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-900">#{order._id.slice(-8)}</p>
                    <div className="text-sm text-slate-600">
                      {order.order_items?.map(item => (
                        <div key={item._id} className="mb-1">
                          <div>Product: {item.product_name}</div>
                          <div>Brand: {item.product_id?.brand_id?.name || 'N/A'}</div>
                          <div>Color: {item.color}</div>
                          <div>Size: {item.size}</div>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-slate-900">{order.user_id?.name || 'Unknown'}</p>
                      <p className="text-sm text-slate-600">{order.user_id?.email || 'No email'}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900">
                      ${Number(order.total_amount?.$numberDecimal || 0).toFixed(2)}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={order.status}
                      onChange={e => updateOrderStatus(order._id, e.target.value)}
                      className="border rounded px-2 py-1"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleViewOrder(order)}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                        title="View Order Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleEditOrder(order)}
                        className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 p-2 rounded-lg transition-colors"
                        title="Edit Order"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleGenerateInvoice(order._id)}
                        disabled={invoiceLoading}
                        className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 p-2 rounded-lg transition-colors disabled:opacity-50"
                        title="Generate Invoice"
                      >
                        <FileText className="h-4 w-4" />
                      </button>

                      <button 
                        onClick={() => deleteOrder(order._id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="text-sm text-slate-600">
            Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, totalOrders)} of {totalOrders} orders
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-3 py-2 text-sm text-slate-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

            {/* View Order Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowOrderModal(false)}>
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Order Details</h2>
              <button
                onClick={() => setShowOrderModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Order Information</h3>
                <p><strong>Order ID:</strong> {selectedOrder._id}</p>
                <p><strong>Status:</strong> <span className={`px-2 py-1 rounded text-xs ${getStatusColor(selectedOrder.status)}`}>{selectedOrder.status}</span></p>
                <p><strong>Date:</strong> {new Date(selectedOrder.created_at).toLocaleDateString()}</p>
                <p><strong>Total Amount:</strong> ${Number(selectedOrder.total_amount?.$numberDecimal || 0).toFixed(2)}</p>
                <p><strong>Payment Method:</strong> {selectedOrder.payment_method || 'N/A'}</p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Customer Information</h3>
                <p><strong>Name:</strong> {selectedOrder.user_id?.name || 'Unknown'}</p>
                <p><strong>Email:</strong> {selectedOrder.user_id?.email || 'No email'}</p>
                <p><strong>Phone:</strong> {selectedOrder.user_id?.phone || 'No phone'}</p>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="font-semibold mb-2">Order Items</h3>
              <div className="space-y-2">
                {selectedOrder.order_items?.map((item, index) => (
                  <div key={index} className="border rounded p-3">
                    <p><strong>Product:</strong> {item.product_name}</p>
                    <p><strong>Brand:</strong> {item.product_id?.brand_id?.name || 'N/A'}</p>
                    <p><strong>Color:</strong> {item.color}</p>
                    <p><strong>Size:</strong> {item.size}</p>
                    <p><strong>Quantity:</strong> {item.quantity}</p>
                    <p><strong>Price:</strong> ${Number(item.price || 0).toFixed(2)}</p>
                    <p><strong>Total:</strong> ${Number(item.total || 0).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowOrderModal(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Order Modal */}
      {showEditModal && editingOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowEditModal(false)}>
                    <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Edit Order</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Order Status</label>
                <select
                  value={editingOrder.status}
                  onChange={(e) => setEditingOrder({...editingOrder, status: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Order ID</label>
                <input
                  type="text"
                  value={editingOrder._id}
                  disabled
                  className="w-full border rounded px-3 py-2 bg-gray-100"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
                <input
                  type="text"
                  value={editingOrder.user_id?.name || 'Unknown'}
                  disabled
                  className="w-full border rounded px-3 py-2 bg-gray-100"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Amount</label>
                <input
                  type="text"
                  value={`$${Number(editingOrder.total_amount?.$numberDecimal || 0).toFixed(2)}`}
                  disabled
                  className="w-full border rounded px-3 py-2 bg-gray-100"
                />
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  try {
                    await updateOrderStatus(editingOrder._id, editingOrder.status);
                    setShowEditModal(false);
                    showSuccess('Order updated successfully!');
                  } catch (error) {
                    showError('Failed to update order');
                  }
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
} 