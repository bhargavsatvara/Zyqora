const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PaymentSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User' },
  order_id: { type: Schema.Types.ObjectId, ref: 'Order' },
  gateway: String,
  transaction_id: String,
  status: String,
  amount: Number,
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Payment', PaymentSchema); 