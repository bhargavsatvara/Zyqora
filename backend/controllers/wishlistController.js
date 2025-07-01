const { Wishlist } = require('../models');

exports.getWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user_id: req.user });
    if (!wishlist) wishlist = new Wishlist({ user_id: req.user, items: '[]' });
    res.json(wishlist);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addItem = async (req, res) => {
  try {
    const { productId } = req.body;
    let wishlist = await Wishlist.findOne({ user_id: req.user });
    if (!wishlist) wishlist = new Wishlist({ user_id: req.user, items: '[]' });
    let items = JSON.parse(wishlist.items || '[]');
    if (!items.includes(productId)) {
      items.push(productId);
    }
    wishlist.items = JSON.stringify(items);
    await wishlist.save();
    res.json(wishlist);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.removeItem = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user_id: req.user });
    if (!wishlist) return res.status(404).json({ message: 'Wishlist not found' });
    let items = JSON.parse(wishlist.items || '[]');
    items = items.filter(id => id !== req.params.productId);
    wishlist.items = JSON.stringify(items);
    await wishlist.save();
    res.json(wishlist);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}; 