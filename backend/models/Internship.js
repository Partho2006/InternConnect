const mongoose = require('mongoose');

const InternshipSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  skills: [String],
  duration: String,
  stipend: Number,
  location: String,
  type: {
    type: String,
    enum: ['remote', 'onsite', 'hybrid']
  },
  status: {
    type: String,
    enum: ['active', 'closed', 'draft'],
    default: 'active'
  },
  applicants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Internship', InternshipSchema);