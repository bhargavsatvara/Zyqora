const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductMaterialSchema = new Schema({
  product_id: { type: Schema.Types.ObjectId, ref: 'Product' },
  material_id: { type: Schema.Types.ObjectId, ref: 'Material' }
});

module.exports = mongoose.model('ProductMaterial', ProductMaterialSchema); 