const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SizeSchema = new Schema({
  name: { type: String, required: true },
  description: String
});

module.exports = mongoose.model('Size', SizeSchema); 