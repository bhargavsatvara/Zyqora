const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  slug: { 
    type: String, 
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  description: { 
    type: String, 
    required: true,
    trim: true
  },
  parentId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Category',
    default: null
  },
  image: { 
    type: String,
    default: null
  },
  metaTitle: { 
    type: String,
    trim: true
  },
  metaDescription: { 
    type: String,
    trim: true
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  isFeatured: { 
    type: Boolean, 
    default: false 
  },
  sortOrder: { 
    type: Number, 
    default: 0 
  },
  department_id: { 
    type: Schema.Types.ObjectId, 
    ref: 'Department',
    default: null
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for status (computed from isActive)
CategorySchema.virtual('status').get(function() {
  return this.isActive ? 'active' : 'inactive';
});

// Index for better query performance
CategorySchema.index({ slug: 1 });
CategorySchema.index({ parentId: 1 });
CategorySchema.index({ isActive: 1 });
CategorySchema.index({ sortOrder: 1 });

// Pre-save middleware to ensure slug is unique
CategorySchema.pre('save', async function(next) {
  if (this.isModified('slug')) {
    const existingCategory = await this.constructor.findOne({ 
      slug: this.slug,
      _id: { $ne: this._id }
    });
    if (existingCategory) {
      const error = new Error('Category with this slug already exists');
      error.name = 'ValidationError';
      return next(error);
    }
  }
  next();
});

module.exports = mongoose.model('Category', CategorySchema); 