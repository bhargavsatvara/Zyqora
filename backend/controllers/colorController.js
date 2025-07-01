const { Color } = require('../models');

exports.getAllColors = async (req, res) => {
  try {
    const colors = await Color.find();
    res.json(colors);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}; 