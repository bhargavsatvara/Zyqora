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

// Compound index: unique name per department
CategorySchema.index({ name: 1, department_ids: 1 }, { unique: true });
// Compound index: unique slug per department
CategorySchema.index({ slug: 1, department_ids: 1 }, { unique: true });

module.exports = mongoose.model('Category', CategorySchema);