const { City } = require('../models');

exports.getAllCities = async (req, res) => {
  try {
    const { search, page = 1, limit = 10, state_id } = req.query;
    
    // Build query
    let query = {};
    
    // Add state filter
    if (state_id) {
      query.state_id = state_id;
    }
    
    // Add search functionality
    if (search && search.trim()) {
      query.name = { $regex: search, $options: 'i' };
    }
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Execute query with pagination
    const cities = await City.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
    
    // Get total count for pagination
    const totalCities = await City.countDocuments(query);
    const totalPages = Math.ceil(totalCities / parseInt(limit));
    
    res.json({
      data: {
        cities,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalRecords: totalCities,
          limit: parseInt(limit)
        }
      }
    });
  } catch (err) {
    console.error('Error in getAllCities:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getCityById = async (req, res) => {
  try {
    const city = await City.findById(req.params.id);
    if (!city) return res.status(404).json({ message: 'City not found' });
    res.json(city);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createCity = async (req, res) => {
  try {
    const city = new City(req.body);
    await city.save();
    res.status(201).json(city);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateCity = async (req, res) => {
  try {
    const city = await City.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!city) return res.status(404).json({ message: 'City not found' });
    res.json(city);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteCity = async (req, res) => {
  try {
    const city = await City.findByIdAndDelete(req.params.id);
    if (!city) return res.status(404).json({ message: 'City not found' });
    res.json({ message: 'City deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}; 