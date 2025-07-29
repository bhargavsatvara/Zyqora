const {  Cart } = require('../models');
const stripe = require('../utils/stripe');
const Address = require('../models/address');
const OrderItem = require('../models/order_item');
const Size = require('../models/size');
const Color = require('../models/color');
const Order = require('../models/order');
const Product = require('../models/product'); // Add this import
const User = require('../models/user'); // Add this import
const mongoose = require('mongoose'); // Add this import
const path = require('path'); // Add this import
const CartAbandonmentService = require('../services/cartAbandonmentService');
const transporter = require('../utils/mailer'); // Add this import
const { orderConfirmationEmail } = require('../utils/emailTemplates'); // Add this import

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
      
      // Reset abandonment count if cart is now empty or if items were removed
      if (cart.items.length === 0) {
        await CartAbandonmentService.resetAbandonmentCount(cart._id);
      }
    }

    // 6. Send order confirmation email
    try {
      let userEmail = null;
      let userName = null;
      let shouldSendEmail = false;

      // Check if user is authenticated
      if (req.user) {
        const user = await User.findById(req.user);
        if (user && user.email && user.settings?.emailNotifications !== false) {
          userEmail = user.email;
          userName = user.name || user.email.split('@')[0];
          shouldSendEmail = true;
        }
      } else {
        // For guest users, check if email is provided in billing address
        if (billingAddress && billingAddress.email) {
          userEmail = billingAddress.email;
          userName = billingAddress.first_name || billingAddress.email.split('@')[0];
          shouldSendEmail = true;
        }
      }

      if (shouldSendEmail && userEmail) {
        // Get order items with product images
        const populatedOrderItems = await OrderItem.find({ _id: { $in: orderItemIds } })
          .populate('product_id', 'image');

        // Generate order URL
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        const orderUrl = `${frontendUrl}/order-view/${order._id}`;

        // Generate email HTML
        const emailHtml = orderConfirmationEmail(userName, order, populatedOrderItems, orderUrl);

        // Send email
        const mailOptions = {
          from: `"Zyqora Team" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
          to: userEmail,
          subject: `Order Confirmation - Order #${order._id}`,
          html: emailHtml,
          attachments: [
            {
              filename: 'zyqora-logo.png',
              path: path.resolve(__dirname, '..', '..', 'frontend', 'src', 'assets', 'images', 'logo.png'),
              cid: 'zyqoraLogo'
            }
          ]
        };

        await transporter.sendMail(mailOptions);
        console.log(`Order confirmation email sent to ${userEmail} for order ${order._id}`);
      }
    } catch (emailError) {
      console.error('Error sending order confirmation email:', emailError);
      // Don't fail the order creation if email fails
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

// Generate invoice for an order
exports.generateInvoice = async (req, res) => {
  try {
    const orderId = req.params.id;
    
    // Get order with all related data
    const order = await Order.findById(orderId)
      .populate('user_id', 'name email')
      .populate('order_items')
      .populate('billing_address')
      .exec();

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user has permission to access this order
    console.log('User info:', { 
      userId: req.user,
      orderUserId: order.user_id?._id || order.user_id 
    });
    
    // If no user is authenticated, deny access
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    // Check if user is admin
    let isAdmin = false;
    try {
      const user = await User.findById(req.user);
      isAdmin = user && user.role === 'admin';
      console.log('User role check:', { userId: req.user, role: user?.role, isAdmin });
    } catch (error) {
      console.error('Error checking user role:', error);
      return res.status(500).json({ message: 'Error checking permissions' });
    }
    
    // If not admin, check if user owns this order
    if (!isAdmin) {
      const userId = req.user.toString();
      const orderUserId = (order.user_id._id || order.user_id).toString();
      
      console.log('Permission check:', { userId, orderUserId, match: userId === orderUserId });
      
      if (userId !== orderUserId) {
        return res.status(403).json({ message: 'Access denied - You can only access your own orders' });
      }
    }

    // Generate invoice data
    const invoiceData = {
      invoiceNumber: `INV-${order._id.toString().slice(-8).toUpperCase()}`,
      orderNumber: order._id.toString().slice(-8).toUpperCase(),
      orderDate: new Date(order.created_at).toLocaleDateString(),
      dueDate: new Date(order.created_at).toLocaleDateString(),
      
      // Company information
      company: {
        name: 'Zyqora',
        address: '123 Fashion Street, New York, NY 10001',
        phone: '+1 (555) 123-4567',
        email: 'support@zyqora.com',
        website: 'https://zyqora.com'
      },
      
      // Customer information
      customer: {
        name: order.user_id?.name || 'Guest Customer',
        email: order.user_id?.email || 'guest@example.com',
        address: order.billing_address ? {
          street: order.billing_address.street || '',
          city: order.billing_address.city || '',
          state: order.billing_address.state || '',
          country: order.billing_address.country || '',
          zipCode: order.billing_address.zipCode || ''
        } : null
      },
      
      // Order items
      items: order.order_items.map(item => ({
        name: item.product_name,
        sku: item.sku || 'N/A',
        quantity: item.quantity,
        price: Number(item.price?.$numberDecimal || item.price || 0),
        total: Number(item.total?.$numberDecimal || item.total || 0),
        size: item.size || '',
        color: item.color || ''
      })),
      
      // Totals
      subtotal: Number(order.subtotal?.$numberDecimal || order.subtotal || 0),
      tax: Number(order.tax_amount?.$numberDecimal || order.tax_amount || 0),
      shipping: Number(order.shipping_charge?.$numberDecimal || order.shipping_charge || 0),
      discount: Number(order.discount_amount?.$numberDecimal || order.discount_amount || 0),
      total: Number(order.total_amount?.$numberDecimal || order.total_amount || 0),
      
      // Payment information
      paymentMethod: order.payment_method || 'Credit Card',
      status: order.status
    };

    res.json({
      success: true,
      invoice: invoiceData
    });
  } catch (err) {
    console.error('Invoice generation error:', err);
    res.status(500).json({ message: 'Failed to generate invoice' });
  }
}; 