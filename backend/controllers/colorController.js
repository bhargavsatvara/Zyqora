const { Color } = require('../models');

exports.getAllColors = async (req, res) => {
  try {
    const colors = await Color.find();
    res.json(colors);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getColorById = async (req, res) => {
  try {
    const color = await Color.findById(req.params.id);
    if (!color) return res.status(404).json({ message: 'Color not found' });
    res.json(color);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createColor = async (req, res) => {
  try {
    const color = new Color(req.body);
    await color.save();
    res.status(201).json(color);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateColor = async (req, res) => {
  try {
    const color = await Color.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!color) return res.status(404).json({ message: 'Color not found' });
    res.json(color);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteColor = async (req, res) => {
  try {
    const color = await Color.findByIdAndDelete(req.params.id);
    if (!color) return res.status(404).json({ message: 'Color not found' });
    res.json({ message: 'Color deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}; 