const { Cart, Product } = require('../models');

exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user_id: req.user });
    if (!cart) cart = new Cart({ user_id: req.user, items: '[]' });
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Add item to cart
exports.addItem = async (req, res) => {
  try {
    const { productId, quantity, color, size } = req.body;
    let cart = await Cart.findOne({ user_id: req.user });
    if (!cart) cart = new Cart({ user_id: req.user, items: '[]' });
    let items = JSON.parse(cart.items || '[]');
    const index = items.findIndex(i => i.productId === productId && i.color === color && i.size === size);
    if (index > -1) {
      items[index].quantity += quantity;
    } else {
      items.push({ productId, quantity, color, size });
    }
    cart.items = JSON.stringify(items);
    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update cart item
exports.updateItem = async (req, res) => {
  try {
    const { itemId, quantity } = req.body;
    let cart = await Cart.findOne({ user_id: req.user });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    let items = JSON.parse(cart.items || '[]');
    const index = items.findIndex(i => i.productId === itemId);
    if (index > -1) {
      items[index].quantity = quantity;
      cart.items = JSON.stringify(items);
      await cart.save();
      res.json(cart);
    } else {
      res.status(404).json({ message: 'Item not found in cart' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Remove item from cart
exports.removeItem = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user_id: req.user });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    let items = JSON.parse(cart.items || '[]');
    items = items.filter(i => i.productId !== req.params.itemId);
    cart.items = JSON.stringify(items);
    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Clear cart
exports.clearCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user_id: req.user });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    cart.items = '[]';
    await cart.save();
    res.json({ message: 'Cart cleared' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}; 