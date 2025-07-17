const { Category } = require('../models');

exports.getAllCategories = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status } = req.query;
    const skip = (page - 1) * limit;
    
    // Build query
    let query = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { slug: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (status && status !== 'all') {
      query.isActive = status === 'active';
    }
    
    // Get total count for pagination
    const totalRecords = await Category.countDocuments(query);
    
    // Get categories with pagination
    const categories = await Category.find(query)
      .populate('parentId', 'name')
      .populate('department_id', 'name')
      .sort({ sortOrder: 1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    // Add product count (you might want to implement this based on your product model)
    const categoriesWithCount = categories.map(category => ({
      ...category.toObject(),
      productCount: 0 // TODO: Implement actual product count
    }));
    
    const totalPages = Math.ceil(totalRecords / limit);
    
    res.json({
      success: true,
      data: {
        categories: categoriesWithCount,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalRecords,
          limit: parseInt(limit)
        }
      }
    });
  } catch (err) {
    console.error('Error in getAllCategories:', err);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: err.message 
    });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id)
      .populate('parentId', 'name')
      .populate('department_id', 'name');
      
    if (!category) {
      return res.status(404).json({ 
        success: false,
        message: 'Category not found' 
      });
    }
    
    res.json({
      success: true,
      data: category
    });
  } catch (err) {
    console.error('Error in getCategoryById:', err);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: err.message 
    });
  }
};

exports.createCategory = async (req, res) => {
  try {
    console.log("createCategory :: req.body :: ", req.body);
    
    // Validate required fields
    const { name, description, slug } = req.body;
    if (!name || !description || !slug) {
      return res.status(400).json({
        success: false,
        message: 'Name, description, and slug are required'
      });
    }
    
    // Check if slug already exists
    const existingCategory = await Category.findOne({ slug });
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'Category with this slug already exists'
      });
    }
    
    // Prepare category data
    const categoryData = {
      name: req.body.name,
      description: req.body.description,
      slug: req.body.slug,
      parentId: req.body.parentId || null,
      image: req.body.image || null,
      metaTitle: req.body.metaTitle || req.body.name,
      metaDescription: req.body.metaDescription || req.body.description,
      isActive: req.body.isActive !== undefined ? req.body.isActive : true,
      isFeatured: req.body.isFeatured || false,
      sortOrder: req.body.sortOrder || 0,
      department_id: req.body.department_id || null
    };
    
    const category = new Category(categoryData);
    await category.save();
    
    // Populate references
    await category.populate('parentId', 'name');
    await category.populate('department_id', 'name');
    
    res.status(201).json({
      success: true,
      data: category,
      message: 'Category created successfully'
    });
  } catch (err) {
    console.error('Error in createCategory:', err);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: err.message 
    });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if category exists
    const existingCategory = await Category.findById(id);
    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    // Check if slug is being updated and if it already exists
    if (req.body.slug && req.body.slug !== existingCategory.slug) {
      const slugExists = await Category.findOne({ 
        slug: req.body.slug,
        _id: { $ne: id }
      });
      if (slugExists) {
        return res.status(400).json({
          success: false,
          message: 'Category with this slug already exists'
        });
      }
    }
    
    // Prepare update data
    const updateData = {
      name: req.body.name,
      description: req.body.description,
      slug: req.body.slug,
      parentId: req.body.parentId !== undefined ? req.body.parentId : existingCategory.parentId,
      image: req.body.image !== undefined ? req.body.image : existingCategory.image,
      metaTitle: req.body.metaTitle,
      metaDescription: req.body.metaDescription,
      isActive: req.body.isActive !== undefined ? req.body.isActive : existingCategory.isActive,
      isFeatured: req.body.isFeatured !== undefined ? req.body.isFeatured : existingCategory.isFeatured,
      sortOrder: req.body.sortOrder !== undefined ? req.body.sortOrder : existingCategory.sortOrder,
      department_id: req.body.department_id !== undefined ? req.body.department_id : existingCategory.department_id
    };
    
    const category = await Category.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true, runValidators: true }
    ).populate('parentId', 'name').populate('department_id', 'name');
    
    res.json({
      success: true,
      data: category,
      message: 'Category updated successfully'
    });
  } catch (err) {
    console.error('Error in updateCategory:', err);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: err.message 
    });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if category exists
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    // Check if category has subcategories
    const hasSubcategories = await Category.exists({ parentId: id });
    if (hasSubcategories) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete category with subcategories. Please delete subcategories first.'
      });
    }
    
    // TODO: Check if category has products
    // const hasProducts = await Product.exists({ category: id });
    // if (hasProducts) {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'Cannot delete category with products. Please remove or reassign products first.'
    //   });
    // }
    
    await Category.findByIdAndDelete(id);
    
    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (err) {
    console.error('Error in deleteCategory:', err);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: err.message 
    });
  }
}; 