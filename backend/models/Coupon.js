const mongoose = require('mongoose');

// Check if the model exists before creating a new one
const Coupon = mongoose.models.Coupon || mongoose.model('Coupon', new mongoose.Schema({
    code: { 
        type: String, 
        required: true,
        unique: true
    },
    discountAmount: {
        type: Number,
        required: true
    },
    minimumOrderAmount: {
        type: Number,
        default: 0
    },
    expiryDate: {
        type: Date
    },
    isActive: {
        type: Boolean,
        default: true
    },
    usageLimit: {
        type: Number
    },
    usedCount: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}));

module.exports = Coupon; 