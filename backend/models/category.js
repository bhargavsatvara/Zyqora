const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  name: { type: String, required: true },
  department_id: { type: Schema.Types.ObjectId, ref: 'Department' },
  description: String
});

module.exports = mongoose.model('Category', CategorySchema); 