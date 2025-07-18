const { Size } = require('../models');

exports.getAllSizes = async (req, res) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    console.log('getAllSizes called with query:', req.query);
    
    // Build query
    let query = {};
    
    // Add search functionality
    if (search && search.trim()) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
      console.log('Search query:', query);
    }
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Execute query with pagination
    const sizes = await Size.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
    
    // Get total count for pagination
    const totalSizes = await Size.countDocuments(query);
    const totalPages = Math.ceil(totalSizes / parseInt(limit));
    
    console.log('Found sizes:', sizes.length, 'Total:', totalSizes);
    
    res.json({
      data: {
        sizes,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalRecords: totalSizes,
          limit: parseInt(limit)
        }
      }
    });
  } catch (err) {
    console.error('Error in getAllSizes:', err);
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