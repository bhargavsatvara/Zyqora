const { Category } = require('../models');
const slugify = require('slugify');

// Helper function to migrate old schema to new schema
async function migrateCategoryIfNeeded(category) {
  if (category.department_id && !category.department_ids) {
    // This is an old schema category, migrate it
    await Category.findByIdAndUpdate(category._id, {
      $set: { department_ids: [category.department_id] },
      $unset: { department_id: 1 }
    });
    category.department_ids = [category.department_id];
    delete category.department_id;
  }
  return category;
}

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
    
    // Execute query with pagination and populate department_ids
    const categories = await Category.find(query)
      .populate('department_ids', 'name')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
    
    // Migrate any old schema categories
    for (let category of categories) {
      category = await migrateCategoryIfNeeded(category);
    }
    
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
    res.status(500).json({ message: err.message || 'Server error' });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    let category = await Category.findById(req.params.id).populate('department_ids', 'name');
    if (!category) return res.status(404).json({ message: 'Category not found' });
    
    // Migrate if needed
    category = await migrateCategoryIfNeeded(category);
    
    res.json({ data: category });
  } catch (err) {
    console.error('Error in getCategoryById:', err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name, department_ids, image, ...rest } = req.body;
    
    // Generate slug from name
    const slug = slugify(name, { lower: true, strict: true });
    
    // Create category with department_ids array
    const category = new Category({ 
      name, 
      slug, 
      department_ids: department_ids || [],
      image: image || '',
      ...rest 
    });
    
    await category.save();
    
    // Populate department_ids before sending response
    await category.populate('department_ids', 'name');
    
    res.status(201).json(category);
  } catch (err) {
    console.error('Error in createCategory:', err);
    if (err.code === 11000) {
      res.status(400).json({ message: 'Category with this name already exists' });
    } else {
      res.status(500).json({ message: err.message || 'Server error' });
    }
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { name, department_ids, image, ...rest } = req.body;
    
    // If name is being updated, generate new slug
    if (name) {
      const slug = slugify(name, { lower: true, strict: true });
      rest.slug = slug;
    }
    
    const category = await Category.findByIdAndUpdate(
      req.params.id, 
      { 
        name, 
        department_ids: department_ids || [],
        image: image || '',
        ...rest 
      }, 
      { new: true }
    ).populate('department_ids', 'name');
    
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(category);
  } catch (err) {
    console.error('Error in updateCategory:', err);
    if (err.code === 11000) {
      res.status(400).json({ message: 'Category with this name already exists' });
    } else {
      res.status(500).json({ message: err.message || 'Server error' });
    }
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    console.error('Error in deleteCategory:', err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
}; 