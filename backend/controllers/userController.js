const { User, Address } = require('../models');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user, req.body, { new: true, select: '-password' });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user).select('settings');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user.settings || {});
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user,
      { $set: { settings: req.body } },
      { new: true, select: 'settings' }
    );
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user.settings);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.user });
    res.json(addresses);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addAddress = async (req, res) => {
  try {
    const address = new Address({
      ...req.body,
      user: req.user
    });
    await address.save();
    res.status(201).json(address);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateAddress = async (req, res) => {
  try {
    const address = await Address.findOneAndUpdate(
      { _id: req.params.id, user: req.user },
      req.body,
      { new: true }
    );
    if (!address) return res.status(404).json({ message: 'Address not found' });
    res.json(address);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteAddress = async (req, res) => {
  try {
    const address = await Address.findOneAndDelete({ _id: req.params.id, user: req.user });
    if (!address) return res.status(404).json({ message: 'Address not found' });
    res.json({ message: 'Address deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}; 