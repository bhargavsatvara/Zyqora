const ProductMaterial = require('../models/product_material');

// Create a new product-material association
exports.createProductMaterial = async (req, res) => {
  try {
    const { product_id, material_ids } = req.body;
    if (!product_id) {
      return res.status(400).json({ message: 'Product is required.' });
    }
    if (!material_ids || !Array.isArray(material_ids) || material_ids.length === 0) {
      return res.status(400).json({ message: 'At least one material is required.' });
    }

    // Check if product already has materials assigned
    const existingProduct = await ProductMaterial.findOne({ product_id });
    if (existingProduct) {
      return res.status(409).json({ message: 'This product already has materials assigned. Update the existing record instead.' });
    }

    const pm = new ProductMaterial({ product_id, material_ids });
    await pm.save();
    
    // Populate before sending response
    await pm.populate('product_id', 'name');
    await pm.populate('material_ids', 'name');
    
    res.status(201).json(pm);
  } catch (err) {
    console.error('Error creating product material:', err);
    res.status(500).json({ message: err.message });
  }
};

// Get all product-material associations (with optional pagination/search)
exports.getProductMaterials = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const query = {};
    
    let pmQuery = ProductMaterial.find(query)
      .populate('product_id', 'name')
      .populate('material_ids', 'name')
      .sort({ createdAt: -1 });
    
    const totalRecords = await ProductMaterial.countDocuments(query);
    pmQuery = pmQuery.skip((page - 1) * limit).limit(Number(limit));
    let productMaterials = await pmQuery.exec();
    
    if (search) {
      productMaterials = productMaterials.filter(pm =>
        pm.product_id?.name?.toLowerCase().includes(search.toLowerCase()) ||
        pm.material_ids?.some(material => 
          material?.name?.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
    
    res.json({
      data: {
        productMaterials,
        pagination: {
          totalPages: Math.ceil(totalRecords / limit),
          totalRecords,
          currentPage: Number(page),
          limit: Number(limit)
        },
      },
    });
  } catch (err) {
    console.error('Error getting product materials:', err);
    res.status(500).json({ message: err.message });
  }
};

// Get a single product-material association by ID
exports.getProductMaterial = async (req, res) => {
  try {
    const pm = await ProductMaterial.findById(req.params.id)
      .populate('product_id', 'name')
      .populate('material_ids', 'name');
    if (!pm) return res.status(404).json({ message: 'Product material association not found' });
    res.json(pm);
  } catch (err) {
    console.error('Error getting product material:', err);
    res.status(500).json({ message: err.message });
  }
};

// Update a product-material association
exports.updateProductMaterial = async (req, res) => {
  try {
    const { product_id, material_ids } = req.body;
    const pm = await ProductMaterial.findById(req.params.id);
    if (!pm) return res.status(404).json({ message: 'Product material association not found' });
    
    if (product_id) pm.product_id = product_id;
    if (material_ids && Array.isArray(material_ids)) pm.material_ids = material_ids;
    
    await pm.save();
    
    // Populate before sending response
    await pm.populate('product_id', 'name');
    await pm.populate('material_ids', 'name');
    
    res.json(pm);
  } catch (err) {
    console.error('Error updating product material:', err);
    res.status(500).json({ message: err.message });
  }
};

// Delete a product-material association
exports.deleteProductMaterial = async (req, res) => {
  try {
    const pm = await ProductMaterial.findByIdAndDelete(req.params.id);
    if (!pm) return res.status(404).json({ message: 'Product material association not found' });
    res.json({ message: 'Product material association deleted successfully' });
  } catch (err) {
    console.error('Error deleting product material:', err);
    res.status(500).json({ message: err.message });
  }
};

// Get materials for a specific product
exports.getMaterialsByProduct = async (req, res) => {
  try {
    const { product_id } = req.params;
    const pm = await ProductMaterial.findOne({ product_id })
      .populate('material_ids', 'name');
    
    if (!pm) {
      return res.json({ materials: [] });
    }
    
    res.json({ materials: pm.material_ids });
  } catch (err) {
    console.error('Error getting materials by product:', err);
    res.status(500).json({ message: err.message });
  }
}; 