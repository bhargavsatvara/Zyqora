const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderItemSchema = new Schema({
  order_id: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
  product_id: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  product_name: { type: String, maxlength: 255 },
  sku: { type: String, maxlength: 100 },
  quantity: { type: Number, required: true },
  price: { type: mongoose.Schema.Types.Decimal128, required: true },
  subtotal: { type: mongoose.Schema.Types.Decimal128, required: true },
  tax_amount: { type: mongoose.Schema.Types.Decimal128, default: 0 },
  total: { type: mongoose.Schema.Types.Decimal128, required: true },
}, {
  timestamps: true
});

module.exports = mongoose.model('OrderItem', OrderItemSchema); 