const SizeChart = require('../models/sizeChart');

// Create a new size chart
exports.createSizeChart = async (req, res) => {
  try {
    const { title, description } = req.body;
    
    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required.' });
    }

    const sizeChart = new SizeChart({ title, description });
    await sizeChart.save();
    
    res.status(201).json(sizeChart);
  } catch (err) {
    console.error('Error creating size chart:', err);
    res.status(500).json({ message: err.message });
  }
};

// Get all size charts (with optional pagination/search)
exports.getSizeCharts = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const query = {};
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    let sizeChartsQuery = SizeChart.find(query).sort({ createdAt: -1 });
    
    const totalRecords = await SizeChart.countDocuments(query);
    sizeChartsQuery = sizeChartsQuery.skip((page - 1) * limit).limit(Number(limit));
    const sizeCharts = await sizeChartsQuery.exec();
    
    res.json({
      data: {
        sizeCharts,
        pagination: {
          totalPages: Math.ceil(totalRecords / limit),
          totalRecords,
          currentPage: Number(page),
          limit: Number(limit)
        },
      },
    });
  } catch (err) {
    console.error('Error getting size charts:', err);
    res.status(500).json({ message: err.message });
  }
};

// Get a single size chart by ID
exports.getSizeChart = async (req, res) => {
  try {
    const sizeChart = await SizeChart.findById(req.params.id);
    if (!sizeChart) return res.status(404).json({ message: 'Size chart not found' });
    res.json(sizeChart);
  } catch (err) {
    console.error('Error getting size chart:', err);
    res.status(500).json({ message: err.message });
  }
};

// Update a size chart
exports.updateSizeChart = async (req, res) => {
  try {
    const { title, description } = req.body;
    
    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required.' });
    }
    
    const sizeChart = await SizeChart.findByIdAndUpdate(
      req.params.id,
      { title, description },
      { new: true }
    );
    
    if (!sizeChart) return res.status(404).json({ message: 'Size chart not found' });
    res.json(sizeChart);
  } catch (err) {
    console.error('Error updating size chart:', err);
    res.status(500).json({ message: err.message });
  }
};

// Delete a size chart
exports.deleteSizeChart = async (req, res) => {
  try {
    const sizeChart = await SizeChart.findByIdAndDelete(req.params.id);
    if (!sizeChart) return res.status(404).json({ message: 'Size chart not found' });
    res.json({ message: 'Size chart deleted successfully' });
  } catch (err) {
    console.error('Error deleting size chart:', err);
    res.status(500).json({ message: err.message });
  }
};

// Bulk delete size charts
exports.bulkDeleteSizeCharts = async (req, res) => {
  try {
    const { sizeChartIds } = req.body;
    if (!sizeChartIds || !Array.isArray(sizeChartIds)) {
      return res.status(400).json({ message: 'Size chart IDs array is required' });
    }
    
    const result = await SizeChart.deleteMany({ _id: { $in: sizeChartIds } });
    res.json({ 
      message: `${result.deletedCount} size charts deleted successfully`,
      deletedCount: result.deletedCount
    });
  } catch (err) {
    console.error('Error bulk deleting size charts:', err);
    res.status(500).json({ message: err.message });
  }
}; 