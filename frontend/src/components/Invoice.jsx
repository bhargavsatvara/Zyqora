import React from 'react';
import { Download, Printer } from 'lucide-react';

const Invoice = ({ invoiceData, onClose }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price || 0);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Create a printable version of the invoice
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
                  <td>${formatPrice(item.price)}</td>
                  <td>${formatPrice(item.total)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="totals">
            <table>
              <tr>
                <td><strong>Subtotal:</strong></td>
                <td>${formatPrice(invoiceData.subtotal)}</td>
              </tr>
              <tr>
                <td><strong>Tax:</strong></td>
                <td>${formatPrice(invoiceData.tax)}</td>
              </tr>
              <tr>
                <td><strong>Shipping:</strong></td>
                <td>${formatPrice(invoiceData.shipping)}</td>
              </tr>
              <tr>
                <td><strong>Discount:</strong></td>
                <td>-${formatPrice(invoiceData.discount)}</td>
              </tr>
              <tr>
                <td><strong>Total:</strong></td>
                <td><strong>${formatPrice(invoiceData.total)}</strong></td>
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
  };

  return (
    <div className="fixed inset-0 bg-gray-100 bg-opacity-90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-200">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
            <div>
              <h2 className="text-3xl font-bold text-gray-800">Invoice {invoiceData.invoiceNumber}</h2>
              <p className="text-gray-600 mt-1">Generated on {new Date().toLocaleDateString()}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              >
                <Download className="h-4 w-4" />
                Download
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors shadow-sm"
              >
                <Printer className="h-4 w-4" />
                Print
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors shadow-sm"
              >
                Close
              </button>
            </div>
          </div>

          {/* Company Information */}
          <div className="mb-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
            <h3 className="font-bold text-xl text-blue-900 mb-3">{invoiceData.company.name}</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-700 font-medium">{invoiceData.company.address}</p>
                <p className="text-gray-600">Phone: {invoiceData.company.phone}</p>
              </div>
              <div>
                <p className="text-gray-600">Email: {invoiceData.company.email}</p>
                <p className="text-gray-600">Website: {invoiceData.company.website}</p>
              </div>
            </div>
          </div>

          {/* Invoice and Customer Details */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="font-semibold mb-2">Invoice Details</h4>
              <p><strong>Invoice Number:</strong> {invoiceData.invoiceNumber}</p>
              <p><strong>Order Number:</strong> {invoiceData.orderNumber}</p>
              <p><strong>Order Date:</strong> {invoiceData.orderDate}</p>
              <p><strong>Due Date:</strong> {invoiceData.dueDate}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Bill To</h4>
              <p className="font-medium">{invoiceData.customer.name}</p>
              <p className="text-gray-600">{invoiceData.customer.email}</p>
              {invoiceData.customer.address && (
                <>
                  <p className="text-gray-600">{invoiceData.customer.address.street}</p>
                  <p className="text-gray-600">
                    {invoiceData.customer.address.city}, {invoiceData.customer.address.state} {invoiceData.customer.address.zipCode}
                  </p>
                  <p className="text-gray-600">{invoiceData.customer.address.country}</p>
                </>
              )}
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-6">
            <h4 className="font-semibold mb-3">Order Items</h4>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-2 text-left">Item</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">SKU</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Size</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Color</th>
                    <th className="border border-gray-300 px-4 py-2 text-center">Qty</th>
                    <th className="border border-gray-300 px-4 py-2 text-right">Price</th>
                    <th className="border border-gray-300 px-4 py-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceData.items.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2">{item.name}</td>
                      <td className="border border-gray-300 px-4 py-2">{item.sku}</td>
                      <td className="border border-gray-300 px-4 py-2">{item.size}</td>
                      <td className="border border-gray-300 px-4 py-2">{item.color}</td>
                      <td className="border border-gray-300 px-4 py-2 text-center">{item.quantity}</td>
                      <td className="border border-gray-300 px-4 py-2 text-right">{formatPrice(item.price)}</td>
                      <td className="border border-gray-300 px-4 py-2 text-right">{formatPrice(item.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals */}
          <div className="flex justify-end mb-6">
            <div className="w-80">
              <table className="w-full">
                <tbody>
                  <tr>
                    <td className="py-1"><strong>Subtotal:</strong></td>
                    <td className="py-1 text-right">{formatPrice(invoiceData.subtotal)}</td>
                  </tr>
                  <tr>
                    <td className="py-1"><strong>Tax:</strong></td>
                    <td className="py-1 text-right">{formatPrice(invoiceData.tax)}</td>
                  </tr>
                  <tr>
                    <td className="py-1"><strong>Shipping:</strong></td>
                    <td className="py-1 text-right">{formatPrice(invoiceData.shipping)}</td>
                  </tr>
                  <tr>
                    <td className="py-1"><strong>Discount:</strong></td>
                    <td className="py-1 text-right">-{formatPrice(invoiceData.discount)}</td>
                  </tr>
                  <tr className="border-t-2 border-gray-300">
                    <td className="py-2"><strong>Total:</strong></td>
                    <td className="py-2 text-right"><strong>{formatPrice(invoiceData.total)}</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-gray-600 border-t pt-6">
            <p className="mb-2">Thank you for your business!</p>
            <p className="mb-1"><strong>Payment Method:</strong> {invoiceData.paymentMethod}</p>
            <p><strong>Order Status:</strong> {invoiceData.status}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoice; 