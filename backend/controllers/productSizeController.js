const ProductSize = require('../models/product_size');

// Create a new product-size association
exports.createProductSize = async (req, res) => {
  try {
    const { product_id, size_ids } = req.body;
    if (!product_id) {
      return res.status(400).json({ message: 'Product is required.' });
    }
    if (!size_ids || !Array.isArray(size_ids) || size_ids.length === 0) {
      return res.status(400).json({ message: 'At least one size is required.' });
    }

    // Check if product already has sizes assigned
    const existingProduct = await ProductSize.findOne({ product_id });
    if (existingProduct) {
      return res.status(409).json({ message: 'This product already has sizes assigned. Update the existing record instead.' });
    }

    const ps = new ProductSize({ product_id, size_ids });
    await ps.save();
    
    // Populate before sending response
    await ps.populate('product_id', 'name');
    await ps.populate('size_ids', 'name');
    
    res.status(201).json(ps);
  } catch (err) {
    console.error('Error creating product size:', err);
    res.status(500).json({ message: err.message });
  }
};

// Get all product-size associations (with optional pagination/search)
exports.getProductSizes = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const query = {};
    
    let psQuery = ProductSize.find(query)
      .populate('product_id', 'name')
      .populate('size_ids', 'name')
      .sort({ createdAt: -1 });
    
    const totalRecords = await ProductSize.countDocuments(query);
    psQuery = psQuery.skip((page - 1) * limit).limit(Number(limit));
    let productSizes = await psQuery.exec();
    
    if (search) {
      productSizes = productSizes.filter(ps =>
        ps.product_id?.name?.toLowerCase().includes(search.toLowerCase()) ||
        ps.size_ids?.some(size => 
          size?.name?.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
    
    res.json({
      data: {
        productSizes,
        pagination: {
          totalPages: Math.ceil(totalRecords / limit),
          totalRecords,
          currentPage: Number(page),
          limit: Number(limit)
        },
      },
    });
  } catch (err) {
    console.error('Error getting product sizes:', err);
    res.status(500).json({ message: err.message });
  }
};

// Get a single product-size association by ID
exports.getProductSize = async (req, res) => {
  try {
    const ps = await ProductSize.findById(req.params.id)
      .populate('product_id', 'name')
      .populate('size_ids', 'name');
    if (!ps) return res.status(404).json({ message: 'Product size association not found' });
    res.json(ps);
  } catch (err) {
    console.error('Error getting product size:', err);
    res.status(500).json({ message: err.message });
  }
};

// Update a product-size association
exports.updateProductSize = async (req, res) => {
  try {
    const { product_id, size_ids } = req.body;
    const ps = await ProductSize.findById(req.params.id);
    if (!ps) return res.status(404).json({ message: 'Product size association not found' });
    
    if (product_id) ps.product_id = product_id;
    if (size_ids && Array.isArray(size_ids)) ps.size_ids = size_ids;
    
    await ps.save();
    
    // Populate before sending response
    await ps.populate('product_id', 'name');
    await ps.populate('size_ids', 'name');
    
    res.json(ps);
  } catch (err) {
    console.error('Error updating product size:', err);
    res.status(500).json({ message: err.message });
  }
};

// Delete a product-size association
exports.deleteProductSize = async (req, res) => {
  try {
    const ps = await ProductSize.findByIdAndDelete(req.params.id);
    if (!ps) return res.status(404).json({ message: 'Product size association not found' });
    res.json({ message: 'Product size association deleted successfully' });
  } catch (err) {
    console.error('Error deleting product size:', err);
    res.status(500).json({ message: err.message });
  }
};

// Get sizes for a specific product
exports.getSizesByProduct = async (req, res) => {
  try {
    const { product_id } = req.params;
    const ps = await ProductSize.findOne({ product_id })
      .populate('size_ids', 'name');
    
    if (!ps) {
      return res.json({ sizes: [] });
    }
    
    res.json({ sizes: ps.size_ids });
  } catch (err) {
    console.error('Error getting sizes by product:', err);
    res.status(500).json({ message: err.message });
  }
}; 