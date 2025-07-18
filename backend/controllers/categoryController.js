const { Category } = require('../models');

exports.getAllCategories = async (req, res) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    
    // Build query
    let query = {};
    
    // Add search functionality
    if (search && search.trim()) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Execute query with pagination
    const categories = await Category.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
    
    // Get total count for pagination
    const totalCategories = await Category.countDocuments(query);
    const totalPages = Math.ceil(totalCategories / parseInt(limit));
    
    res.json({
      data: {
        categories,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalRecords: totalCategories,
          limit: parseInt(limit)
        }
      }
    });
  } catch (err) {
    console.error('Error in getAllCategories:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const category = new Category(req.body);
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}; 