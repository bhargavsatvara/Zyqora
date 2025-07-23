const { Wishlist } = require('../models');

// Get wishlist items for the logged-in user
exports.getWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user_id: req.user }).populate('items', 'name image');
    if (!wishlist) {
      wishlist = new Wishlist({ user_id: req.user, items: [] });
      await wishlist.save();
    }
    // Return the populated product objects
    res.json({ items: wishlist.items });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Add a product to the wishlist
exports.addItem = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }
    let wishlist = await Wishlist.findOne({ user_id: req.user });
    if (!wishlist) {
      wishlist = new Wishlist({ user_id: req.user, items: [] });
    }
    if (!wishlist.items.map(id => id.toString()).includes(productId)) {
      wishlist.items.push(productId);
      await wishlist.save();
      return res.json({ message: 'Added to wishlist', items: wishlist.items });
    } else {
      return res.status(200).json({ message: 'Already in wishlist', items: wishlist.items });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Remove a product from the wishlist
exports.removeItem = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user_id: req.user });
    if (!wishlist) return res.status(404).json({ message: 'Wishlist not found' });
    const before = wishlist.items.length;
    wishlist.items = wishlist.items.filter(id => id.toString() !== req.params.productId);
    if (wishlist.items.length === before) {
      return res.status(404).json({ message: 'Product not in wishlist', items: wishlist.items });
    }
    await wishlist.save();
    res.json({ message: 'Removed from wishlist', items: wishlist.items });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}; 