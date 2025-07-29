import React, { useState, useEffect } from 'react';
import { Search, Eye, Edit, Package, Truck, CheckCircle, Clock, Calendar, DollarSign, ShoppingCart, AlertTriangle, Trash2, FileText } from 'lucide-react';
import { ordersAPI } from '../services/api';
import { useToast } from '../contexts/ToastContext';
import Invoice from '../components/Invoice';

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
  const [showInvoice, setShowInvoice] = useState(false);
  const [invoiceData, setInvoiceData] = useState(null);
  const [invoiceLoading, setInvoiceLoading] = useState(false);

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

  const handleGenerateInvoice = async (orderId) => {
    setInvoiceLoading(true);
    try {
      const response = await ordersAPI.generateInvoice(orderId);
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
                      <button className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-2 rounded-lg transition-colors">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 p-2 rounded-lg transition-colors">
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
                      {invoiceData && (
                        <button 
                          onClick={() => {
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
                                    @media print {
                                      .no-print { display: none; }
                                    }
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
                            printWindow.print();
                          }}
                          className="text-green-600 hover:text-green-700 hover:bg-green-50 p-2 rounded-lg transition-colors"
                          title="Download Invoice"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      )}
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

      {/* Invoice Modal */}
      {showInvoice && invoiceData && (
        <Invoice
          invoiceData={invoiceData}
          onClose={() => setShowInvoice(false)}
        />
      )}
    </div>
  );
} 