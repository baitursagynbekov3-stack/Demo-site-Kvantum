const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Testimonial text is required']
  },
  text_ru: {
    type: String,
    default: ''
  },
  authorName: {
    type: String,
    required: [true, 'Author name is required'],
    trim: true
  },
  authorInitial: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    default: ''
  },
  role_ru: {
    type: String,
    default: ''
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Testimonial', testimonialSchema);
