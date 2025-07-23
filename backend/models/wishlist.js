const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WishlistSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User' },
  items: [{ type: Schema.Types.ObjectId, ref: 'Product' }], // Now an array of product ObjectIds
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Wishlist', WishlistSchema); 