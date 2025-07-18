const ProductColor = require('../models/product_color');

// Create a new product-color association
exports.createProductColor = async (req, res) => {
  try {
    const { product_id, color_id } = req.body;
    if (!product_id || !color_id) {
      return res.status(400).json({ message: 'Product and Color are required.' });
    }
    const exists = await ProductColor.findOne({ product_id, color_id });
    if (exists) {
      return res.status(409).json({ message: 'This association already exists.' });
    }
    const pc = new ProductColor({ product_id, color_id });
    await pc.save();
    res.status(201).json(pc);
  } catch (err) {
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
      .populate('color_id', 'name');
    const totalRecords = await ProductColor.countDocuments(query);
    pcQuery = pcQuery.skip((page - 1) * limit).limit(Number(limit));
    let productColors = await pcQuery.exec();
    if (search) {
      productColors = productColors.filter(pc =>
        pc.product_id?.name?.toLowerCase().includes(search.toLowerCase()) ||
        pc.color_id?.name?.toLowerCase().includes(search.toLowerCase())
      );
    }
    res.json({
      data: {
        productColors,
        pagination: {
          totalPages: Math.ceil(totalRecords / limit),
          totalRecords,
          currentPage: Number(page),
        },
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a single product-color association by ID
exports.getProductColor = async (req, res) => {
  try {
    const pc = await ProductColor.findById(req.params.id)
      .populate('product_id', 'name')
      .populate('color_id', 'name');
    if (!pc) return res.status(404).json({ message: 'Not found' });
    res.json(pc);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a product-color association
exports.updateProductColor = async (req, res) => {
  try {
    const { product_id, color_id } = req.body;
    const pc = await ProductColor.findById(req.params.id);
    if (!pc) return res.status(404).json({ message: 'Not found' });
    if (product_id) pc.product_id = product_id;
    if (color_id) pc.color_id = color_id;
    await pc.save();
    res.json(pc);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a product-color association
exports.deleteProductColor = async (req, res) => {
  try {
    const pc = await ProductColor.findByIdAndDelete(req.params.id);
    if (!pc) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 