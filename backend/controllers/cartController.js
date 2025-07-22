const { Cart, Product } = require('../models');

// Helper function to normalize product ID for comparison
const normalizeProductId = (productId) => {
  return productId ? productId.toString() : null;
};

exports.getCart = async (req, res) => {
  try {
    console.log('req.user:', req.user);
    // Use logged-in user if available, otherwise guest
    const userId = req.user ? req.user.toString() : 'guest';
    let cart = await Cart.findOne({ user_id: userId });
    
    if (!cart) {
      cart = new Cart({ user_id: userId, items: [] });
      await cart.save();
    }
    
    // Calculate totals
    const items = cart.items || [];
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;
    
    res.json({
      success: true,
      data: {
        items: items,
        subtotal: subtotal,
        tax: tax,
        total: total,
        itemCount: items.length
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Add item to cart
exports.addItem = async (req, res) => {
  try {
    console.log('req.user:', req.user);
    const { product_id, name, price, image, quantity, size, color, stock_qty } = req.body;
    
    // Validate required fields
    if (!product_id || !name || !price || !quantity) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check stock availability
    if (stock_qty !== undefined && quantity > stock_qty) {
      return res.status(400).json({ 
        message: `Only ${stock_qty} items available in stock` 
      });
    }

    // Use logged-in user if available, otherwise guest
    const userId = req.user ? req.user.toString() : 'guest';
    let cart = await Cart.findOne({ user_id: userId });
    if (!cart) {
      cart = new Cart({ 
        user_id: userId, 
        items: [] 
      });
    }

    // Parse items if it's a string
    let items = Array.isArray(cart.items) ? cart.items : JSON.parse(cart.items || '[]');
    
    // Check if item already exists with same size and color
    const existingItemIndex = items.findIndex(item => {
      const normalizedExistingId = normalizeProductId(item.product_id);
      const normalizedNewId = normalizeProductId(product_id);
      return normalizedExistingId === normalizedNewId && 
                   item.size === size && 
                   item.color === color;
    });

    if (existingItemIndex > -1) {
      // Update existing item quantity
      const newQuantity = items[existingItemIndex].quantity + quantity;
      // Check stock again for updated quantity
      if (stock_qty !== undefined && newQuantity > stock_qty) {
        return res.status(400).json({ 
          message: `Cannot add more items. Only ${stock_qty} available in stock` 
        });
      }
      items[existingItemIndex].quantity = newQuantity;
    } else {
      // Add new item
      items.push({
        product_id,
        name,
        price,
        image,
        quantity,
        size,
        color,
        stock_qty
      });
    }

    cart.items = items;
    await cart.save();
    
    res.json({
      success: true,
      message: 'Product added to cart successfully',
      cart: cart
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update cart item
exports.updateItem = async (req, res) => {
  try {
    console.log('req.user:', req.user);
    const { itemId, quantity } = req.body;
    if (!itemId || quantity === undefined) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const userId = req.user ? req.user.toString() : 'guest';
    let cart = await Cart.findOne({ user_id: userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    const items = cart.items || [];
    const itemIndex = items.findIndex(item => normalizeProductId(item.product_id) === normalizeProductId(itemId));
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }
    if (quantity <= 0) {
      items.splice(itemIndex, 1);
    } else {
      if (items[itemIndex].stock_qty !== undefined && quantity > items[itemIndex].stock_qty) {
        return res.status(400).json({ message: `Only ${items[itemIndex].stock_qty} items available in stock` });
      }
      items[itemIndex].quantity = quantity;
    }
    cart.items = items;
    await cart.save();
    res.json({
      success: true,
      message: 'Cart updated successfully',
      cart: cart
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Remove item from cart
exports.removeItem = async (req, res) => {
  try {
    console.log('req.user:', req.user);
    const { product_id, size, color } = req.body;
    const userId = req.user ? req.user.toString() : 'guest';
    let cart = await Cart.findOne({ user_id: userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const items = cart.items || [];
    const filteredItems = items.filter(item =>
      !(
        normalizeProductId(item.product_id) === normalizeProductId(product_id) &&
        item.size === size &&
        item.color === color
      )
    );

    if (filteredItems.length === items.length) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    cart.items = filteredItems;
    await cart.save();

    res.json({
      success: true,
      message: 'Item removed from cart',
      cart: cart
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Clear cart
exports.clearCart = async (req, res) => {
  try {
    console.log('req.user:', req.user);
    // Use logged-in user if available, otherwise guest
    const userId = req.user ? req.user.toString() : 'guest';
    let cart = await Cart.findOne({ user_id: userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    cart.items = [];
    await cart.save();
    res.json({ message: 'Cart cleared' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}; 