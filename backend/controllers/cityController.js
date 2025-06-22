const { City } = require('../models');

exports.getAllCities = async (req, res) => {
  try {
    const filter = req.query.state_id ? { state_id: req.query.state_id } : {};
    const cities = await City.find(filter);
    res.json(cities);
  } catch (err) {
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