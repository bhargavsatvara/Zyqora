const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSizeSchema = new Schema({
  product_id: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  size_ids: [{ type: Schema.Types.ObjectId, ref: 'Size' }]
}, {
  timestamps: true
});

module.exports = mongoose.model('ProductSize', ProductSizeSchema);