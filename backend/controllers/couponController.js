const { Coupon } = require("../models");

// Get all coupons
exports.getAllCoupons = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '', status = '' } = req.query;
        
        const query = {};
        
        // Search by coupon code
        if (search) {
            query.code = { $regex: search, $options: 'i' };
        }
        
        // Filter by status
        if (status === 'active') {
            query.isActive = true;
            query.$or = [
                { expiryDate: { $gt: new Date() } },
                { expiryDate: null }
            ];
        } else if (status === 'expired') {
            query.$or = [
                { isActive: false },
                { expiryDate: { $lt: new Date() } }
            ];
        }
        
        const skip = (page - 1) * limit;
        
        const coupons = await Coupon.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));
            
        const total = await Coupon.countDocuments(query);
        
        res.json({
            success: true,
            data: {
                coupons,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(total / limit),
                    totalRecords: total,
                    limit: parseInt(limit)
                }
            }
        });
    } catch (error) {
        console.error('Error fetching coupons:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching coupons',
            error: error.message 
        });
    }
};

// Get coupon by ID
exports.getCouponById = async (req, res) => {
    try {
        const coupon = await Coupon.findById(req.params.id);
        
        if (!coupon) {
            return res.status(404).json({ 
                success: false, 
                message: 'Coupon not found' 
            });
        }
        
        res.json({
            success: true,
            data: coupon
        });
    } catch (error) {
        console.error('Error fetching coupon:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching coupon',
            error: error.message 
        });
    }
};

// Create new coupon
exports.createCoupon = async (req, res) => {
    try {
        const { 
            code, 
            discountAmount, 
            minimumOrderAmount = 0, 
            expiryDate, 
            isActive = true, 
            usageLimit 
        } = req.body;
        
        // Validate required fields
        if (!code || !discountAmount) {
            return res.status(400).json({ 
                success: false, 
                message: 'Code and discount amount are required' 
            });
        }
        
        // Check if coupon code already exists
        const existingCoupon = await Coupon.findOne({ code });
        if (existingCoupon) {
            return res.status(400).json({ 
                success: false, 
                message: 'Coupon code already exists' 
            });
        }
        
        // Validate discount amount
        if (discountAmount <= 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Discount amount must be greater than 0' 
            });
        }
        
        // Validate minimum order amount
        if (minimumOrderAmount < 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Minimum order amount cannot be negative' 
            });
        }
        
        // Validate expiry date
        if (expiryDate && new Date(expiryDate) <= new Date()) {
            return res.status(400).json({ 
                success: false, 
                message: 'Expiry date must be in the future' 
            });
        }
        
        // Validate usage limit
        if (usageLimit && usageLimit <= 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Usage limit must be greater than 0' 
            });
        }
        
        const coupon = new Coupon({
            code: code.toUpperCase(),
            discountAmount,
            minimumOrderAmount,
            expiryDate: expiryDate ? new Date(expiryDate) : null,
            isActive,
            usageLimit
        });
        
        await coupon.save();
        
        res.status(201).json({
            success: true,
            message: 'Coupon created successfully',
            data: coupon
        });
    } catch (error) {
        console.error('Error creating coupon:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error creating coupon',
            error: error.message 
        });
    }
};

// Update coupon
exports.updateCoupon = async (req, res) => {
    try {
        const { 
            code, 
            discountAmount, 
            minimumOrderAmount, 
            expiryDate, 
            isActive, 
            usageLimit 
        } = req.body;
        
        const coupon = await Coupon.findById(req.params.id);
        
        if (!coupon) {
            return res.status(404).json({ 
                success: false, 
                message: 'Coupon not found' 
            });
        }
        
        // Check if new code already exists (excluding current coupon)
        if (code && code !== coupon.code) {
            const existingCoupon = await Coupon.findOne({ code });
            if (existingCoupon) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Coupon code already exists' 
                });
            }
        }
        
        // Validate discount amount
        if (discountAmount !== undefined && discountAmount <= 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Discount amount must be greater than 0' 
            });
        }
        
        // Validate minimum order amount
        if (minimumOrderAmount !== undefined && minimumOrderAmount < 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Minimum order amount cannot be negative' 
            });
        }
        
        // Validate expiry date
        if (expiryDate && new Date(expiryDate) <= new Date()) {
            return res.status(400).json({ 
                success: false, 
                message: 'Expiry date must be in the future' 
            });
        }
        
        // Validate usage limit
        if (usageLimit !== undefined && usageLimit <= 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Usage limit must be greater than 0' 
            });
        }
        
        // Update fields
        if (code !== undefined) coupon.code = code.toUpperCase();
        if (discountAmount !== undefined) coupon.discountAmount = discountAmount;
        if (minimumOrderAmount !== undefined) coupon.minimumOrderAmount = minimumOrderAmount;
        if (expiryDate !== undefined) coupon.expiryDate = expiryDate ? new Date(expiryDate) : null;
        if (isActive !== undefined) coupon.isActive = isActive;
        if (usageLimit !== undefined) coupon.usageLimit = usageLimit;
        
        await coupon.save();
        
        res.json({
            success: true,
            message: 'Coupon updated successfully',
            data: coupon
        });
    } catch (error) {
        console.error('Error updating coupon:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error updating coupon',
            error: error.message 
        });
    }
};

// Delete coupon
exports.deleteCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findById(req.params.id);
        
        if (!coupon) {
            return res.status(404).json({ 
                success: false, 
                message: 'Coupon not found' 
            });
        }
        
        await Coupon.findByIdAndDelete(req.params.id);
        
        res.json({
            success: true,
            message: 'Coupon deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting coupon:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error deleting coupon',
            error: error.message 
        });
    }
};

// Validate coupon code
exports.validateCoupon = async (req, res) => {
    try {
        const { code } = req.params;
        const { orderTotal = 0 } = req.query;
        
        const coupon = await Coupon.findOne({ code: code.toUpperCase() });
        
        if (!coupon) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid coupon code' 
            });
        }
        
        // Check if coupon is active
        if (!coupon.isActive) {
            return res.status(400).json({ 
                success: false, 
                message: 'Coupon is inactive' 
            });
        }
        
        // Check if coupon has expired
        if (coupon.expiryDate && new Date() > coupon.expiryDate) {
            return res.status(400).json({ 
                success: false, 
                message: 'Coupon has expired' 
            });
        }
        
        // Check minimum order amount
        if (coupon.minimumOrderAmount && orderTotal < coupon.minimumOrderAmount) {
            return res.status(400).json({ 
                success: false, 
                message: `Minimum order amount of $${coupon.minimumOrderAmount} required` 
            });
        }
        
        // Check usage limit
        if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
            return res.status(400).json({ 
                success: false, 
                message: 'Coupon usage limit reached' 
            });
        }
        
        res.json({
            success: true,
            message: 'Coupon is valid',
            data: {
                code: coupon.code,
                discountAmount: coupon.discountAmount,
                minimumOrderAmount: coupon.minimumOrderAmount,
                expiryDate: coupon.expiryDate
            }
        });
    } catch (error) {
        console.error('Error validating coupon:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error validating coupon',
            error: error.message 
        });
    }
};

// Apply a coupon (legacy function - kept for backward compatibility)
exports.applyCoupon = async (req, res) => {
    try {
        const { code, orderTotal } = req.body;
        const coupon = await Coupon.findOne({ code: code.toUpperCase() });

        if (!coupon) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid coupon code' 
            });
        }

        // Check if coupon is active
        if (!coupon.isActive) {
            return res.status(400).json({ 
                success: false, 
                message: 'Coupon is inactive' 
            });
        }

        if (coupon.expiryDate && new Date() > coupon.expiryDate) {
            return res.status(400).json({ 
                success: false, 
                message: 'Coupon has expired' 
            });
        }

        if (coupon.minimumOrderAmount && orderTotal < coupon.minimumOrderAmount) {
            return res.status(400).json({ 
                success: false, 
                message: `Minimum order amount of $${coupon.minimumOrderAmount} required` 
            });
        }

        // Check usage limit
        if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
            return res.status(400).json({ 
                success: false, 
                message: 'Coupon usage limit reached' 
            });
        }

        res.json({
            success: true,
            message: 'Coupon applied successfully',
            data: {
                discount: coupon.discountAmount,
                code: coupon.code
            }
        });
    } catch (error) {
        console.error('Error applying coupon:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error applying coupon',
            error: error.message 
        });
    }
}; 