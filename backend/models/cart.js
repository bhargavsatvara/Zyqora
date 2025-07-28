const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CartItemSchema = new Schema({
  product_id: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: String,
  quantity: { type: Number, required: true, min: 1 },
  size: String,
  color: String,
  stock_qty: Number,
  added_at: { type: Date, default: Date.now } // Track when item was added
});

const CartSchema = new Schema({
  user_id: { type: String, default: 'guest' }, // For now using string, can be ObjectId for real users
  items: [CartItemSchema],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  // Email notification tracking
  last_abandonment_email_sent: { type: Date, default: null },
  abandonment_email_count: { type: Number, default: 0 },
  max_abandonment_emails: { type: Number, default: 3 } // Maximum emails to send
});

// Update the updated_at field before saving
CartSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

// Method to check if cart has been abandoned (items older than 24 hours)
CartSchema.methods.isAbandoned = function() {
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  return this.items.some(item => item.added_at < twentyFourHoursAgo);
};

// Method to get abandoned items (items older than specified hours)
CartSchema.methods.getAbandonedItems = function(hours = 24) {
  const cutoffTime = new Date(Date.now() - hours * 60 * 60 * 1000);
  return this.items.filter(item => item.added_at < cutoffTime);
};

// Method to check if we can send another abandonment email
CartSchema.methods.canSendAbandonmentEmail = function() {
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  return (
    this.abandonment_email_count < this.max_abandonment_emails &&
    (!this.last_abandonment_email_sent || this.last_abandonment_email_sent < twentyFourHoursAgo)
  );
};

module.exports = mongoose.model('Cart', CartSchema); 