const { Brand } = require('../models');

// GET /brands?search=&status=&page=&limit=
exports.getAllBrands = async (req, res) => {
  try {
    const { search = '', status, page = 1, limit = 10 } = req.query;
    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    if (status) query.status = status;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [brands, totalRecords] = await Promise.all([
      Brand.find(query).skip(skip).limit(parseInt(limit)),
      Brand.countDocuments(query),
    ]);
    res.json({
      data: {
        brands,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: Math.ceil(totalRecords / limit),
          totalRecords,
        },
      },
      message: 'Brands fetched successfully',
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /brands/:id
exports.getBrandById = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) return res.status(404).json({ message: 'Brand not found' });
    res.json({ data: brand, message: 'Brand fetched successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /brands (multipart/form-data)
exports.createBrand = async (req, res) => {
  try {
    let logoUrl = '';
    if (req.file) {
      logoUrl = `/uploads/${req.file.filename}`;
    }
    const brand = new Brand({
      ...req.body,
      logo: logoUrl || req.body.logo,
    });
    await brand.save();
    res.status(201).json({ data: brand, message: 'Brand created successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /brands/:id (multipart/form-data)
exports.updateBrand = async (req, res) => {
  try {
    let logoUrl = '';
    if (req.file) {
      logoUrl = `/uploads/${req.file.filename}`;
    }
    const updateData = { ...req.body };
    if (logoUrl) updateData.logo = logoUrl;
    const brand = await Brand.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!brand) return res.status(404).json({ message: 'Brand not found' });
    res.json({ data: brand, message: 'Brand updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE /brands/:id
exports.deleteBrand = async (req, res) => {
  try {
    const brand = await Brand.findByIdAndDelete(req.params.id);
    if (!brand) return res.status(404).json({ message: 'Brand not found' });
    res.json({ message: 'Brand deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}; 