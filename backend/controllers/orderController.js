const {  Cart } = require('../models');
const stripe = require('../utils/stripe');
const Address = require('../models/address');
const OrderItem = require('../models/order_item');
const Size = require('../models/size');
const Color = require('../models/color');
const Order = require('../models/order');
const Product = require('../models/product'); // Add this import
const mongoose = require('mongoose'); // Add this import

exports.createOrder = async (req, res) => {
  try {
    console.log('Order create request body:', req.body);
    const { billingAddress, cartItems, totalAmount, subtotal, tax, paymentIntentId } = req.body;
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }
    // 1. Save billing address
    const address = new Address({ ...billingAddress, user: req.user, isDefault: true });
    await address.save();

    // 2. Create the order first (without order_items)
    const order = new Order({
      user_id: req.user,
      billing_address: address._id,
      total_amount: totalAmount,
      subtotal,
      tax_amount: tax,
      payment_method: 'stripe',
      status: 'processing',
    });
    await order.save();

    // 3. Create order items with order_id
    const orderItemIds = [];
    for (const item of cartItems) {
      // Fetch size and color names if IDs are provided
      let sizeName = item.size;
      let colorName = item.color;
      if (item.size && typeof item.size === 'string' && item.size.length === 24) {
        const sizeDoc = await Size.findById(item.size);
        sizeName = sizeDoc ? sizeDoc.name : '';
      }
      if (item.color && typeof item.color === 'string' && item.color.length === 24) {
        const colorDoc = await Color.findById(item.color);
        colorName = colorDoc ? colorDoc.name : '';
      }
      console.log('Creating OrderItem with order_id:', order._id, 'and item:', item, 'size:', sizeName, 'color:', colorName);
      const orderItem = new OrderItem({
        order_id: order._id,
        product_id: item.product_id,
        product_name: item.name,
        sku: item.sku,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.subtotal,
        tax_amount: item.tax,
        total: item.total,
        size: sizeName || '',
        color: colorName || ''
      });
      await orderItem.save();
      orderItemIds.push(orderItem._id);

      // Decrement product stock
      const updatedProduct = await Product.findByIdAndUpdate(
        new mongoose.Types.ObjectId(item.product_id),
        { $inc: { stock_qty: -Number(item.quantity) } },
        { new: true }
      );
      console.log('Updated product:', updatedProduct);
    }

    // 4. Update the order with order_items
    order.order_items = orderItemIds;
    await order.save();

    // 5. Remove only ordered items from the user's cart
    const userId = req.user ? req.user.toString() : 'guest';
    let cart = await Cart.findOne({ user_id: userId });
    if (cart) {
      console.log('Cart before:', cart.items);
      console.log('Ordered items:', cartItems);
      cart.items = cart.items.filter(cartItem =>
        !cartItems.some(orderedItem =>
          cartItem.product_id.toString() === orderedItem.product_id &&
          String(cartItem.size || '') === String(orderedItem.size || '') &&
          String(cartItem.color || '') === String(orderedItem.color || '')
        )
      );
      console.log('Cart after:', cart.items);
    await cart.save();
    }

    res.status(201).json({ success: true, order });
  } catch (err) {
    console.error('Order creation error:', err);
    res.status(500).json({ message: err.message || 'Order creation failed' });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user_id: req.user })
      .populate('order_items') // Populate order_items to include size and color
      .exec();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    // also add billing address in order
    let order = await Order.findOne({ _id: req.params.id, user_id: req.user })
      .populate('order_items') // Populate order_items to include size and color
      .populate('billing_address')
      .exec();
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Fallback: if billing_address is just an ID, fetch the address
    if (order.billing_address && typeof order.billing_address === 'string') {
      const address = await Address.findById(order.billing_address);
      if (address) order = order.toObject();
      if (address) order.billing_address = address;
    }

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

exports.checkout = async (req, res) => {
  try {
    const { totalAmount } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100),
      currency: 'usd'
    });
    return res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error('Stripe checkout error:', err);
    return res.status(500).json({ message: err.message || 'Payment or order creation failed' });
  }
};

// Admin: Get all orders with user info and items
exports.getAllOrdersAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status } = req.query;
    const query = {};
    if (search) {
      query.$or = [
        { _id: { $regex: search, $options: 'i' } },
        // You can add more fields to search if needed
      ];
    }
    if (status && status !== 'all') {
      query.status = status;
    }
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const orders = await Order.find(query)
      .populate('user_id', 'name email')
      .populate({
        path: 'order_items',
        populate: {
          path: 'product_id',
          select: 'name brand_id',
          populate: { path: 'brand_id', select: 'name' }
        }
      })
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    const totalRecords = await Order.countDocuments(query);
    const total = Math.ceil(totalRecords / parseInt(limit));
    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          current: parseInt(page),
          total,
          totalRecords
        }
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateOrderStatusAdmin = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}; 