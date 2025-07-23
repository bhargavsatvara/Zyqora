const { Address } = require('../models');

exports.getAllAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.user });
    res.json(addresses);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAddressById = async (req, res) => {
  try {
    const address = await Address.findOne({ _id: req.params.id, user: req.user });
    if (!address) return res.status(404).json({ message: 'Address not found' });
    res.json(address);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createAddress = async (req, res) => {
  try {
    console.log("createAddress :: req.body :: ", req.body);
    const address = new Address({
      ...req.body,
      user: req.user
    });
    await address.save();
    res.status(201).json(address);
  } catch (err) {
    console.log("createAddress :: err :: ", err);
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