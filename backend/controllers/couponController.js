const { Coupon } = require("../models");


// Get all coupons
exports.getAllCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find();
        res.json(coupons);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Apply a coupon
exports.applyCoupon = async (req, res) => {
    try {
        const { code, orderTotal } = req.body;
        const coupon = await Coupon.findOne({ code });

        if (!coupon) {
            return res.status(400).json({ message: 'Invalid coupon code' });
        }

        if (coupon.expiryDate && new Date() > coupon.expiryDate) {
            return res.status(400).json({ message: 'Coupon has expired' });
        }

        if (coupon.minimumOrderAmount && orderTotal < coupon.minimumOrderAmount) {
            return res.status(400).json({ 
                message: `Minimum order amount of ${coupon.minimumOrderAmount} required` 
            });
        }

        res.json({
            discount: coupon.discountAmount,
            message: 'Coupon applied successfully'
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 