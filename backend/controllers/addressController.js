const { Address, Country, State, City } = require('../models');

exports.getAllAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.user });
    res.json(addresses);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAddressById = async (req, res) => {
  try {
    const address = await Address.findOne({ _id: req.params.id, user: req.user });
    if (!address) return res.status(404).json({ message: 'Address not found' });
    res.json(address);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createAddress = async (req, res) => {
  try {
    console.log("createAddress :: req.body :: ", req.body);
    
    // Extract IDs from request body
    const { country_id, state_id, city_id, ...otherFields } = req.body;
    
    // Fetch names from database using IDs
    let countryName = '';
    let stateName = '';
    let cityName = '';
    
    if (country_id) {
      const country = await Country.findById(country_id);
      countryName = country ? country.name : '';
    }
    
    if (state_id) {
      const state = await State.findById(state_id);
      stateName = state ? state.name : '';
    }
    
    if (city_id) {
      const city = await City.findById(city_id);
      cityName = city ? city.name : '';
    }
    
    // Create address with names instead of IDs
    const address = new Address({
      ...otherFields,
      country: countryName,
      state: stateName,
      city: cityName,
      user: req.user
    });
    
    await address.save();
    res.status(201).json(address);
  } catch (err) {
    console.log("createAddress :: err :: ", err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateAddress = async (req, res) => {
  try {
    // Extract IDs from request body
    const { country_id, state_id, city_id, ...otherFields } = req.body;
    
    // Prepare update data
    let updateData = { ...otherFields };
    
    // Fetch names from database using IDs if provided
    if (country_id) {
      const country = await Country.findById(country_id);
      updateData.country = country ? country.name : '';
    }
    
    if (state_id) {
      const state = await State.findById(state_id);
      updateData.state = state ? state.name : '';
    }
    
    if (city_id) {
      const city = await City.findById(city_id);
      updateData.city = city ? city.name : '';
    }
    
    const address = await Address.findOneAndUpdate(
      { _id: req.params.id, user: req.user },
      updateData,
      { new: true }
    );
    if (!address) return res.status(404).json({ message: 'Address not found' });
    res.json(address);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteAddress = async (req, res) => {
  try {
    const address = await Address.findOneAndDelete({ _id: req.params.id, user: req.user });
    if (!address) return res.status(404).json({ message: 'Address not found' });
    res.json({ message: 'Address deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}; 