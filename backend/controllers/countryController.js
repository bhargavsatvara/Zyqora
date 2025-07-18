const { Country } = require('../models');

exports.getAllCountries = async (req, res) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    
    // Build query
    let query = {};
    
    // Add search functionality
    if (search && search.trim()) {
      query.name = { $regex: search, $options: 'i' };
    }
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Execute query with pagination
    const countries = await Country.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
    
    // Get total count for pagination
    const totalCountries = await Country.countDocuments(query);
    const totalPages = Math.ceil(totalCountries / parseInt(limit));
    
    res.json({
      data: {
        countries,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalRecords: totalCountries,
          limit: parseInt(limit)
        }
      }
    });
  } catch (err) {
    console.error('Error in getAllCountries:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getCountryById = async (req, res) => {
  try {
    const country = await Country.findById(req.params.id);
    if (!country) return res.status(404).json({ message: 'Country not found' });
    res.json(country);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createCountry = async (req, res) => {
  try {
    const country = new Country(req.body);
    await country.save();
    res.status(201).json(country);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateCountry = async (req, res) => {
  try {
    const country = await Country.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!country) return res.status(404).json({ message: 'Country not found' });
    res.json(country);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteCountry = async (req, res) => {
  try {
    const country = await Country.findByIdAndDelete(req.params.id);
    if (!country) return res.status(404).json({ message: 'Country not found' });
    res.json({ message: 'Country deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}; 