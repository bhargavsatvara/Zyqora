const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductColorSchema = new Schema({
  product_id: { type: Schema.Types.ObjectId, ref: 'Product' },
  color_id: { type: Schema.Types.ObjectId, ref: 'Color' }
});

module.exports = mongoose.model('ProductColor', ProductColorSchema); 