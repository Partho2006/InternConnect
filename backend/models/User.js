const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['student', 'company'],
    required: true
  },
  
  // Student specific fields
  skills: [String],
  education: String,
  bio: String,
  phone: String,
  resume: String,
  portfolio: String,
  github: String,
  linkedin: String,
  
  // Company specific fields
  companyName: String,
  companyWebsite: String,
  companyDescription: String,
  companyLogo: String,
  companySize: {
    type: String,
    enum: ['1-10', '11-50', '51-200', '201-500', '500+']
  },
  industry: String,
  location: String,
  foundedYear: Number,
  
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', UserSchema);