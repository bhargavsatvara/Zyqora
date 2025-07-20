const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  image: { type: String },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    sparse: true
  },
  department_ids: [{
    type: Schema.Types.ObjectId,
    ref: 'Department'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Category', CategorySchema);