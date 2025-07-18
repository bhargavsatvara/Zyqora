const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  name: { type: String, required: true },
  sku: String,
  category_id: { type: Schema.Types.ObjectId, ref: 'Category' },
  brand_id: { type: Schema.Types.ObjectId, ref: 'Brand' },
  price: Number,
  description: String,
  stock_qty: Number,
  image: String, // URL to the product image
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', ProductSchema);  