const { Order, Cart } = require('../models');

exports.createOrder = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user_id: req.user });
    if (!cart) return res.status(400).json({ message: 'Cart is empty' });
    const order = new Order({
      user_id: req.user,
      order_items: cart.items,
      shipping_address: req.body.shipping_address,
      payment_method: req.body.payment_method,
      total_price: req.body.total_price,
      is_paid: false,
      is_delivered: false,
      created_at: new Date()
    });
    await order.save();
    // Optionally clear cart
    cart.items = '[]';
    await cart.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user_id: req.user });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user_id: req.user });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, user_id: req.user },
      { status },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, user_id: req.user },
      { status: 'cancelled' },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ message: 'Order cancelled successfully', order });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}; 