const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StateSchema = new Schema({
  name: { type: String, required: true },
  country_id: { type: Schema.Types.ObjectId, ref: 'Country' }
});

module.exports = mongoose.model('State', StateSchema); 