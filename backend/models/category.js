const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  department_id: {
    type: Schema.Types.ObjectId,
    ref: 'Department',
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Category', CategorySchema);