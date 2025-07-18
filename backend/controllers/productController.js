const { Product, Category, Brand } = require('../models');
const path = require('path');

// All product endpoints now support the 'image' field (string URL)

exports.getAllProducts = async (req, res) => {
  try {
    const { search, page = 1, limit = 10, category_id, brand_id, min_price, max_price } = req.query;
    console.log('getAllProducts called with query:', req.query);
    
    // Build query
    let query = {};
    
    // Add search functionality
    if (search && search.trim()) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } }
      ];
      console.log('Search query:', query);
    }
    
    // Add filters
    if (category_id) query.category_id = category_id;
    if (brand_id) query.brand_id = brand_id;
    if (min_price || max_price) {
      query.price = {};
      if (min_price) query.price.$gte = Number(min_price);
      if (max_price) query.price.$lte = Number(max_price);
    }
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Execute query with pagination and populate
    const products = await Product.find(query)
      .populate('category_id', 'name')
      .populate('brand_id', 'name')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ created_at: -1 });
    
    // Get total count for pagination
    const totalProducts = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / parseInt(limit));
    
    console.log('Found products:', products.length, 'Total:', totalProducts);
    
    res.json({
      data: {
        products, // Each product includes the 'image' field if set
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalRecords: totalProducts,
          limit: parseInt(limit)
        }
      }
    });
  } catch (err) {
    console.error('Error in getAllProducts:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category_id', 'name')
      .populate('brand_id', 'name');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product); // Includes 'image' field
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createProduct = async (req, res) => {
  try {
    console.log('REQ FILE:', req.file);
    console.log('REQ BODY:', req.body);
    // Accept 'image' field in req.body or file upload
    let imageUrl = req.body.image;
    if (req.file) {
      // Serve from /uploads/products/...
      imageUrl = `/uploads/products/${req.file.filename}`;
    }
    const product = new Product({
      ...req.body,
      image: imageUrl
    });
    await product.save();
    // Populate the saved product
    const populatedProduct = await Product.findById(product._id)
      .populate('category_id', 'name')
      .populate('brand_id', 'name');
    res.status(201).json(populatedProduct); // Includes 'image' field
  } catch (err) {
    console.error('Error creating product:', err);
    res.status(500).json({ message: 'Server error', error: err.message, stack: err.stack });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    // Accept 'image' field in req.body or file upload
    let imageUrl = req.body.image;
    if (req.file) {
      imageUrl = `/uploads/products/${req.file.filename}`;
    }
    const updateData = { ...req.body };
    if (imageUrl) updateData.image = imageUrl;
    const product = await Product.findByIdAndUpdate(
      req.params.id, 
      updateData, 
      { new: true }
    ).populate('category_id', 'name').populate('brand_id', 'name');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product); // Includes 'image' field
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.bulkDeleteProducts = async (req, res) => {
  try {
    const { productIds } = req.body;
    if (!productIds || !Array.isArray(productIds)) {
      return res.status(400).json({ message: 'Product IDs array is required' });
    }
    
    const result = await Product.deleteMany({ _id: { $in: productIds } });
    res.json({ 
      message: `${result.deletedCount} products deleted successfully`,
      deletedCount: result.deletedCount
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.searchProducts = async (req, res) => {
  try {
    const { query } = req.query;
    const products = await Product.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { sku: { $regex: query, $options: 'i' } }
      ]
    }).populate('category_id', 'name').populate('brand_id', 'name');
    res.json(products); // Each product includes 'image' field
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate('category_id', 'name')
      .populate('brand_id', 'name')
      .sort({ created_at: -1 })
      .limit(10);
    res.json(products); // Each product includes 'image' field
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}; 