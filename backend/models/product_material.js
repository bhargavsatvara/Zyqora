const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductMaterialSchema = new Schema({
  product_id: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  material_ids: [{ type: Schema.Types.ObjectId, ref: 'Material' }]
}, {
  timestamps: true
});

module.exports = mongoose.model('ProductMaterial', ProductMaterialSchema); 