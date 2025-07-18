const { Material } = require('../models');

exports.getAllMaterials = async (req, res) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    let query = {};
    if (search && search.trim()) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const materials = await Material.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ name: 1 });
    const total = await Material.countDocuments(query);
    res.json({
      data: {
        materials,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalRecords: total,
          limit: parseInt(limit)
        }
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getMaterialById = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);
    if (!material) return res.status(404).json({ message: 'Material not found' });
    res.json(material);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createMaterial = async (req, res) => {
  try {
    const material = new Material(req.body);
    await material.save();
    res.status(201).json(material);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateMaterial = async (req, res) => {
  try {
    const material = await Material.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!material) return res.status(404).json({ message: 'Material not found' });
    res.json(material);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteMaterial = async (req, res) => {
  try {
    const material = await Material.findByIdAndDelete(req.params.id);
    if (!material) return res.status(404).json({ message: 'Material not found' });
    res.json({ message: 'Material deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}; 