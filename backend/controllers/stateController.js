const { State } = require('../models');

exports.getAllStates = async (req, res) => {
  try {
    const filter = req.query.country_id ? { country_id: req.query.country_id } : {};
    const states = await State.find(filter);
    res.json(states);
  } catch (err) {
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