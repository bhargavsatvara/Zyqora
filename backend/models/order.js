const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User' },
  order_items: String, // Consider using an array of subdocuments for real use
  shipping_address: String,
  payment_method: String,
  payment_result: String,
  total_price: Number,
  is_paid: Boolean,
  paid_at: Date,
  is_delivered: Boolean,
  delivered_at: Date,
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema); 