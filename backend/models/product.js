const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  name: { type: String, required: true },
  sku: String,
  category_id: { type: Schema.Types.ObjectId, ref: 'Category' },
  department_id: { type: Schema.Types.ObjectId, ref: 'Department' },
  brand_id: { type: Schema.Types.ObjectId, ref: 'Brand' },
  price: Number,
  description: String,
  stock_qty: Number,
  image: String, // URL to the product image
  size_chart_id: { type: Schema.Types.ObjectId, ref: 'SizeChart' },
  attributes: [{
    attribute_name: { type: String, required: true }, // e.g., "Size", "Color", "Material"
    attribute_values: [{ type: String }] // e.g., ["S", "M", "L"] or ["Red", "Blue", "Green"]
  }],
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', ProductSchema);  