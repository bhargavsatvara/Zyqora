const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CartSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User' },
  items: String, // Consider using an array of ObjectIds for real use
  created_at: { type: Date, default: Date.now },
  updated_at: Date
});

module.exports = mongoose.model('Cart', CartSchema); 