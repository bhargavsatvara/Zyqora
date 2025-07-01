const { Country } = require('../models');

exports.getAllCountries = async (req, res) => {
  try {
    const countries = await Country.find();
    res.json(countries);
  } catch (err) {
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