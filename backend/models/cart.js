const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CartItemSchema = new Schema({
  product_id: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: String,
  quantity: { type: Number, required: true, min: 1 },
  size: String,
  color: String,
  stock_qty: Number
});

const CartSchema = new Schema({
  user_id: { type: String, default: 'guest' }, // For now using string, can be ObjectId for real users
  items: [CartItemSchema],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// Update the updated_at field before saving
CartSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

module.exports = mongoose.model('Cart', CartSchema); 