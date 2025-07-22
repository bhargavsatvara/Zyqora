const express = require('express');
const router = express.Router();
const { authenticate, authorizeAdmin } = require('../middleware/auth');
const User = require('../models/user');
const Product = require('../models/product');
const Order = require('../models/order');
const Review = require('../models/review');
const Category = require('../models/category');
const Brand = require('../models/brand');
const Coupon = require('../models/Coupon');
const { getDashboardStats } = require('../controllers/adminController');

// Apply admin middleware to all routes
router.use(authenticate, authorizeAdmin);

// Dashboard Analytics
router.get('/dashboard', getDashboardStats);

// User Management
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', role = '' } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    if (role) {
      query.role = role;
    }

    const users = await User.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          current: parseInt(page),
          total: Math.ceil(total / limit),
          totalRecords: total
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/users/:id/role', async (req, res) => {
  try {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// System Settings
router.get('/settings', async (req, res) => {
  try {
    // Get system statistics
    const stats = await Promise.all([
      User.countDocuments({ role: 'admin' }),
      Product.countDocuments({ isActive: true }),
      Order.countDocuments({ status: 'pending' }),
      Review.countDocuments({ isApproved: false })
    ]);

    res.json({
      success: true,
      data: {
        adminCount: stats[0],
        activeProducts: stats[1],
        pendingOrders: stats[2],
        pendingReviews: stats[3]
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Bulk Operations
router.post('/products/bulk-action', async (req, res) => {
  try {
    const { action, productIds } = req.body;
    
    if (!['activate', 'deactivate', 'delete'].includes(action)) {
      return res.status(400).json({ success: false, message: 'Invalid action' });
    }

    let updateData = {};
    switch (action) {
      case 'activate':
        updateData = { isActive: true };
        break;
      case 'deactivate':
        updateData = { isActive: false };
        break;
      case 'delete':
        await Product.deleteMany({ _id: { $in: productIds } });
        return res.json({ success: true, message: 'Products deleted successfully' });
    }

    await Product.updateMany(
      { _id: { $in: productIds } },
      updateData
    );

    res.json({ success: true, message: `Products ${action}d successfully` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Analytics and Reports
router.get('/analytics/sales', async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    const now = new Date();
    let startDate;

    switch (period) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    const salesData = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          status: { $in: ['completed', 'delivered'] }
        }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }
          },
          totalSales: { $sum: '$totalAmount' },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { '_id.date': 1 } }
    ]);

    res.json({ success: true, data: salesData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Review Management
router.put('/reviews/:id/approve', async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    res.json({ success: true, data: review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/reviews/:id', async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    res.json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router; 