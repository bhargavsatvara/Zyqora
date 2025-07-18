const { State } = require('../models');

exports.getAllStates = async (req, res) => {
  try {
    const { search, page = 1, limit = 10, country_id } = req.query;
    console.log('getAllStates called with query:', req.query);
    
    // Build query
    let query = {};
    
    // Add country filter
    if (country_id) {
      query.country_id = country_id;
    }
    
    // Add search functionality
    if (search && search.trim()) {
      query.name = { $regex: search, $options: 'i' };
      console.log('Search query:', query);
    }
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Execute query with pagination
    const states = await State.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
    
    // Get total count for pagination
    const totalStates = await State.countDocuments(query);
    const totalPages = Math.ceil(totalStates / parseInt(limit));
    
    console.log('Found states:', states.length, 'Total:', totalStates);
    
    res.json({
      data: {
        states,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalRecords: totalStates,
          limit: parseInt(limit)
        }
      }
    });
  } catch (err) {
    console.error('Error in getAllStates:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getStateById = async (req, res) => {
  try {
    const state = await State.findById(req.params.id);
    if (!state) return res.status(404).json({ message: 'State not found' });
    res.json(state);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createState = async (req, res) => {
  try {
    const state = new State(req.body);
    await state.save();
    res.status(201).json(state);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateState = async (req, res) => {
  try {
    const state = await State.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!state) return res.status(404).json({ message: 'State not found' });
    res.json(state);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteState = async (req, res) => {
  try {
    const state = await State.findByIdAndDelete(req.params.id);
    if (!state) return res.status(404).json({ message: 'State not found' });
    res.json({ message: 'State deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}; 