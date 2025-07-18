const ProductSize = require('../models/product_size');

// Create a new product-size association
exports.createProductSize = async (req, res) => {
  try {
    const { product_id, size_id } = req.body;
    if (!product_id || !size_id) {
      return res.status(400).json({ message: 'Product and Size are required.' });
    }
    const exists = await ProductSize.findOne({ product_id, size_id });
    if (exists) {
      return res.status(409).json({ message: 'This association already exists.' });
    }
    const ps = new ProductSize({ product_id, size_id });
    await ps.save();
    res.status(201).json(ps);
  } catch (err) {
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
      .populate('size_id', 'name');
    const totalRecords = await ProductSize.countDocuments(query);
    psQuery = psQuery.skip((page - 1) * limit).limit(Number(limit));
    let productSizes = await psQuery.exec();
    if (search) {
      productSizes = productSizes.filter(ps =>
        ps.product_id?.name?.toLowerCase().includes(search.toLowerCase()) ||
        ps.size_id?.name?.toLowerCase().includes(search.toLowerCase())
      );
    }
    res.json({
      data: {
        productSizes,
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

// Get a single product-size association by ID
exports.getProductSize = async (req, res) => {
  try {
    const ps = await ProductSize.findById(req.params.id)
      .populate('product_id', 'name')
      .populate('size_id', 'name');
    if (!ps) return res.status(404).json({ message: 'Not found' });
    res.json(ps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a product-size association
exports.updateProductSize = async (req, res) => {
  try {
    const { product_id, size_id } = req.body;
    const ps = await ProductSize.findById(req.params.id);
    if (!ps) return res.status(404).json({ message: 'Not found' });
    if (product_id) ps.product_id = product_id;
    if (size_id) ps.size_id = size_id;
    await ps.save();
    res.json(ps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a product-size association
exports.deleteProductSize = async (req, res) => {
  try {
    const ps = await ProductSize.findByIdAndDelete(req.params.id);
    if (!ps) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 