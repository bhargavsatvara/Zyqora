const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SizeChartSchema = new Schema({
  title: { 
    type: String, 
    required: true,
    trim: true
  },
  description: { 
    type: String, 
    required: true 
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('SizeChart', SizeChartSchema); 