const ProductColor = require('../models/product_color');

// Create a new product-color association
exports.createProductColor = async (req, res) => {
  try {
    const { product_id, color_ids } = req.body;
    if (!product_id) {
      return res.status(400).json({ message: 'Product is required.' });
    }
    if (!color_ids || !Array.isArray(color_ids) || color_ids.length === 0) {
      return res.status(400).json({ message: 'At least one color is required.' });
    }

    // Check if product already has colors assigned
    const existingProduct = await ProductColor.findOne({ product_id });
    if (existingProduct) {
      return res.status(409).json({ message: 'This product already has colors assigned. Update the existing record instead.' });
    }

    const pc = new ProductColor({ product_id, color_ids });
    await pc.save();
    
    // Populate before sending response
    await pc.populate('product_id', 'name');
    await pc.populate('color_ids', 'name');
    
    res.status(201).json(pc);
  } catch (err) {
    console.error('Error creating product color:', err);
    res.status(500).json({ message: err.message });
  }
};

// Get all product-color associations (with optional pagination/search)
exports.getProductColors = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const query = {};
    
    let pcQuery = ProductColor.find(query)
      .populate('product_id', 'name')
      .populate('color_ids', 'name')
      .sort({ createdAt: -1 });
    
    const totalRecords = await ProductColor.countDocuments(query);
    pcQuery = pcQuery.skip((page - 1) * limit).limit(Number(limit));
    let productColors = await pcQuery.exec();
    
    if (search) {
      productColors = productColors.filter(pc =>
        pc.product_id?.name?.toLowerCase().includes(search.toLowerCase()) ||
        pc.color_ids?.some(color => 
          color?.name?.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
    
    res.json({
      data: {
        productColors,
        pagination: {
          totalPages: Math.ceil(totalRecords / limit),
          totalRecords,
          currentPage: Number(page),
          limit: Number(limit)
        },
      },
    });
  } catch (err) {
    console.error('Error getting product colors:', err);
    res.status(500).json({ message: err.message });
  }
};

// Get a single product-color association by ID
exports.getProductColor = async (req, res) => {
  try {
    const pc = await ProductColor.findById(req.params.id)
      .populate('product_id', 'name')
      .populate('color_ids', 'name');
    if (!pc) return res.status(404).json({ message: 'Product color association not found' });
    res.json(pc);
  } catch (err) {
    console.error('Error getting product color:', err);
    res.status(500).json({ message: err.message });
  }
};

// Update a product-color association
exports.updateProductColor = async (req, res) => {
  try {
    const { product_id, color_ids } = req.body;
    const pc = await ProductColor.findById(req.params.id);
    if (!pc) return res.status(404).json({ message: 'Product color association not found' });
    
    if (product_id) pc.product_id = product_id;
    if (color_ids && Array.isArray(color_ids)) pc.color_ids = color_ids;
    
    await pc.save();
    
    // Populate before sending response
    await pc.populate('product_id', 'name');
    await pc.populate('color_ids', 'name');
    
    res.json(pc);
  } catch (err) {
    console.error('Error updating product color:', err);
    res.status(500).json({ message: err.message });
  }
};

// Delete a product-color association
exports.deleteProductColor = async (req, res) => {
  try {
    const pc = await ProductColor.findByIdAndDelete(req.params.id);
    if (!pc) return res.status(404).json({ message: 'Product color association not found' });
    res.json({ message: 'Product color association deleted successfully' });
  } catch (err) {
    console.error('Error deleting product color:', err);
    res.status(500).json({ message: err.message });
  }
};

// Get colors for a specific product
exports.getColorsByProduct = async (req, res) => {
  try {
    const { product_id } = req.params;
    const pc = await ProductColor.findOne({ product_id })
      .populate('color_ids', 'name');
    
    if (!pc) {
      return res.json({ colors: [] });
    }
    
    res.json({ colors: pc.color_ids });
  } catch (err) {
    console.error('Error getting colors by product:', err);
    res.status(500).json({ message: err.message });
  }
}; 