const ProductMaterial = require('../models/product_material');

// Create a new product-material association
exports.createProductMaterial = async (req, res) => {
  try {
    const { product_id, material_id } = req.body;
    if (!product_id || !material_id) {
      return res.status(400).json({ message: 'Product and Material are required.' });
    }
    const exists = await ProductMaterial.findOne({ product_id, material_id });
    if (exists) {
      return res.status(409).json({ message: 'This association already exists.' });
    }
    const pm = new ProductMaterial({ product_id, material_id });
    await pm.save();
    res.status(201).json(pm);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all product-material associations (with optional pagination/search)
exports.getProductMaterials = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const query = {};
    if (search) {
      // Search by product or material name (populate and filter)
      // We'll filter after population for simplicity
    }
    let pmQuery = ProductMaterial.find(query)
      .populate('product_id', 'name')
      .populate('material_id', 'name');
    const totalRecords = await ProductMaterial.countDocuments(query);
    pmQuery = pmQuery.skip((page - 1) * limit).limit(Number(limit));
    let productMaterials = await pmQuery.exec();
    if (search) {
      productMaterials = productMaterials.filter(pm =>
        pm.product_id?.name?.toLowerCase().includes(search.toLowerCase()) ||
        pm.material_id?.name?.toLowerCase().includes(search.toLowerCase())
      );
    }
    res.json({
      data: {
        productMaterials,
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

// Get a single product-material association by ID
exports.getProductMaterial = async (req, res) => {
  try {
    const pm = await ProductMaterial.findById(req.params.id)
      .populate('product_id', 'name')
      .populate('material_id', 'name');
    if (!pm) return res.status(404).json({ message: 'Not found' });
    res.json(pm);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a product-material association
exports.updateProductMaterial = async (req, res) => {
  try {
    const { product_id, material_id } = req.body;
    const pm = await ProductMaterial.findById(req.params.id);
    if (!pm) return res.status(404).json({ message: 'Not found' });
    if (product_id) pm.product_id = product_id;
    if (material_id) pm.material_id = material_id;
    await pm.save();
    res.json(pm);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a product-material association
exports.deleteProductMaterial = async (req, res) => {
  try {
    const pm = await ProductMaterial.findByIdAndDelete(req.params.id);
    if (!pm) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 