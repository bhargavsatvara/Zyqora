const { Size } = require('../models');

exports.getAllSizes = async (req, res) => {
  try {
    const sizes = await Size.find();
    res.json(sizes);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getSizeById = async (req, res) => {
  try {
    const size = await Size.findById(req.params.id);
    if (!size) return res.status(404).json({ message: 'Size not found' });
    res.json(size);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createSize = async (req, res) => {
  try {
    const size = new Size(req.body);
    await size.save();
    res.status(201).json(size);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateSize = async (req, res) => {
  try {
    const size = await Size.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!size) return res.status(404).json({ message: 'Size not found' });
    res.json(size);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteSize = async (req, res) => {
  try {
    const size = await Size.findByIdAndDelete(req.params.id);
    if (!size) return res.status(404).json({ message: 'Size not found' });
    res.json({ message: 'Size deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}; 