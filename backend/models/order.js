const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Counter = require('./counter');

const OrderSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User' },
  status: {
    type: String,
    enum: ['pending', 'processing', 'on-hold', 'completed', 'cancelled', 'refunded', 'failed'],
    default: 'pending'
  },
  total_amount: { type: mongoose.Schema.Types.Decimal128, required: true },
  subtotal: { type: mongoose.Schema.Types.Decimal128, required: true },
  tax_amount: { type: mongoose.Schema.Types.Decimal128, default: 0 },
  shipping_charge: { type: mongoose.Schema.Types.Decimal128, default: 0 },
  discount_amount: { type: mongoose.Schema.Types.Decimal128, default: 0 },
  payment_method: { type: String, maxlength: 100 },
  shipping_address: { type: Schema.Types.ObjectId, ref: 'Address' },
  billing_address: { type: Schema.Types.ObjectId, ref: 'Address' },
  order_items: [{ type: Schema.Types.ObjectId, ref: 'OrderItem' }],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

OrderSchema.pre('save', async function(next) {
  this.updated_at = Date.now();
  next();
});

module.exports = mongoose.model('Order', OrderSchema); 