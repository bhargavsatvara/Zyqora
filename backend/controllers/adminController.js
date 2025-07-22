const Order = require('../models/order');
const Product = require('../models/product');
const User = require('../models/user');
const OrderItem = require('../models/order_item');

exports.getDashboardStats = async (req, res) => {
  try {
    // Recent Orders (last 5)
    const recentOrders = await Order.find()
      .sort({ created_at: -1 })
      .limit(5)
      .populate('user_id', 'name email')
      .populate({
        path: 'order_items',
        populate: { path: 'product_id', select: 'name image' }
      });

    // Low Stock Products (stock_qty < 10)
    const lowStockProducts = await Product.find({ stock_qty: { $lt: 10 } })
      .sort({ stock_qty: 1 })
      .limit(5);

    // Top Selling Products (by sales count)
    const topProductsAgg = await OrderItem.aggregate([
      { $group: { _id: '$product_id', sales: { $sum: '$quantity' } } },
      { $sort: { sales: -1 } },
      { $limit: 5 }
    ]);
    const topProductIds = topProductsAgg.map(p => p._id);
    const topProducts = await Product.find({ _id: { $in: topProductIds } });

    res.json({
      data: {
        recentOrders,
        lowStockProducts,
        topProducts
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Server error' });
  }
}; 