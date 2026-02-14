const mongoose = require('mongoose');

const programSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Program name is required'],
    trim: true
  },
  name_ru: {
    type: String,
    default: ''
  },
  tier: {
    type: String,
    enum: ['entry', 'standard', 'popular', 'premium', 'elite'],
    default: 'standard'
  },
  tierLabel: {
    type: String,
    default: ''
  },
  tierLabel_ru: {
    type: String,
    default: ''
  },
  tagline: {
    type: String,
    default: ''
  },
  tagline_ru: {
    type: String,
    default: ''
  },
  priceAmount: {
    type: String,
    default: '0'
  },
  priceCurrency: {
    type: String,
    default: 'KGS'
  },
  priceCurrency_ru: {
    type: String,
    default: ''
  },
  priceNumeric: {
    type: Number,
    default: 0
  },
  purchaseCurrency: {
    type: String,
    default: 'KGS'
  },
  features: [{
    type: String
  }],
  features_ru: [{
    type: String
  }],
  buttonText: {
    type: String,
    default: 'Get Started'
  },
  buttonText_ru: {
    type: String,
    default: ''
  },
  cssClass: {
    type: String,
    default: ''
  },
  popular: {
    type: Boolean,
    default: false
  },
  actionType: {
    type: String,
    enum: ['purchase', 'consult'],
    default: 'purchase'
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Program', programSchema);
