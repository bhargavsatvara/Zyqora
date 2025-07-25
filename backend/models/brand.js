const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BrandSchema = new Schema({
  name: { type: String, required: true },
  description: String,
  website: String,
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Brand', BrandSchema);