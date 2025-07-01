const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSizeSchema = new Schema({
  product_id: { type: Schema.Types.ObjectId, ref: 'Product' },
  size_id: { type: Schema.Types.ObjectId, ref: 'Size' }
});

module.exports = mongoose.model('ProductSize', ProductSizeSchema); 