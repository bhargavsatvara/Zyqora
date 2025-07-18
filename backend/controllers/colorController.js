const { Color } = require('../models');

exports.getAllColors = async (req, res) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    
    // Build query
    let query = {};
    
    // Add search functionality
    if (search && search.trim()) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { hex_code: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Execute query with pagination
    const colors = await Color.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
    
    // Get total count for pagination
    const totalColors = await Color.countDocuments(query);
    const totalPages = Math.ceil(totalColors / parseInt(limit));
    
    res.json({
      data: {
        colors,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalRecords: totalColors,
          limit: parseInt(limit)
        }
      }
    });
  } catch (err) {
    console.error('Error in getAllColors:', err);
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