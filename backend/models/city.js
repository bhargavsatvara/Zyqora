const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CitySchema = new Schema({
  name: { type: String, required: true },
  state_id: { type: Schema.Types.ObjectId, ref: 'State' }
});

module.exports = mongoose.model('City', CitySchema); 