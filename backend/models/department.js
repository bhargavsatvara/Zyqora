const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DepartmentSchema = new Schema({
  name: { type: String, required: true },
  description: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Department', DepartmentSchema); 