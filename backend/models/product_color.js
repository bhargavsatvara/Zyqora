const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductColorSchema = new Schema({
  product_id: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  color_ids: [{ type: Schema.Types.ObjectId, ref: 'Color' }]
}, {
  timestamps: true
});

module.exports = mongoose.model('ProductColor', ProductColorSchema); 