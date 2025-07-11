const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MaterialSchema = new Schema({
  name: { type: String, required: true },
  description: String
});

module.exports = mongoose.model('Material', MaterialSchema); 