const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User' },
  product_id: { type: Schema.Types.ObjectId, ref: 'Product' },
  rating: Number,
  comment: String,
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Review', ReviewSchema); 