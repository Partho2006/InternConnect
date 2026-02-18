const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Anonymous display - never expose reviewer identity
  isAnonymous: {
    type: Boolean,
    default: true
  },
  // Ratings (1-5)
  overallRating: { type: Number, required: true, min: 1, max: 5 },
  stipendRating: { type: Number, required: true, min: 1, max: 5 },
  cultureRating: { type: Number, required: true, min: 1, max: 5 },
  learningRating: { type: Number, required: true, min: 1, max: 5 },
  mentorRating: { type: Number, required: true, min: 1, max: 5 },

  // Written review
  title: { type: String, required: true, maxlength: 100 },
  pros: { type: String, required: true, maxlength: 1000 },
  cons: { type: String, required: true, maxlength: 1000 },
  advice: { type: String, maxlength: 500 }, // advice to management

  // Internship context
  role: { type: String, required: true }, // e.g. "Frontend Developer Intern"
  duration: { type: String, required: true }, // e.g. "3 months"
  stipend: { type: Number }, // actual stipend received in ₹
  workType: { type: String, enum: ['remote', 'onsite', 'hybrid'] },
  year: { type: Number }, // year of internship

  // Recommendations
  wouldRecommend: { type: Boolean, required: true },

  // Moderation
  isApproved: { type: Boolean, default: true },
  helpful: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // users who found it helpful

  createdAt: { type: Date, default: Date.now }
});

// Prevent duplicate reviews from same user for same company
ReviewSchema.index({ company: 1, reviewer: 1 }, { unique: true });

module.exports = mongoose.model('Review', ReviewSchema);