const { Product } = require('../models');

exports.getAllProducts = async (req, res) => {
  try {
    console.log("getAllProducts api called");
    const {
      category_id,
      brand_id,
      min_price,
      max_price,
      color_id,
      size_id,
      material_id,
      search
    } = req.query;
    let filter = {};
    if (category_id) filter.category_id = category_id;
    if (brand_id) filter.brand_id = brand_id;
    if (min_price || max_price) filter.price = {};
    if (min_price) filter.price.$gte = Number(min_price);
    if (max_price) filter.price.$lte = Number(max_price);
    // For color, size, material, use related collections (product_colors, product_sizes, product_materials)
    // This is a simple version, for advanced filtering use aggregation
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    let products = await Product.find(filter).populate('category_id brand_id');
    // Filter by color, size, material if provided
    if (color_id || size_id || material_id) {
      const ids = products.map(p => p._id.toString());
      // For demo, just return all products (implement aggregation for real use)
      // You can join with product_colors, product_sizes, product_materials for advanced filtering
      // ...
    }
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category_id brand_id');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct('category_id');
    res.json(categories);
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
        { description: { $regex: query, $options: 'i' } }
      ]
    }).populate('category_id brand_id');
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.filterProducts = async (req, res) => {
  try {
    const { category, brand, minPrice, maxPrice } = req.query;
    let filter = {};
    
    if (category) filter.category_id = category;
    if (brand) filter.brand_id = brand;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    
    const products = await Product.find(filter).populate('category_id brand_id');
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ is_featured: true })
      .populate('category_id brand_id')
      .limit(10);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getNewProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .sort({ created_at: -1 })
      .populate('category_id brand_id')
      .limit(10);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getSaleProducts = async (req, res) => {
  try {
    const products = await Product.find({ discount_price: { $exists: true, $ne: null } })
      .populate('category_id brand_id')
      .limit(10);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}; 