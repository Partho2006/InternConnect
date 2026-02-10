const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// Get user profile
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update profile
router.put('/me', auth, async (req, res) => {
  try {
    const allowedFields = req.user.role === 'student' 
      ? ['name', 'skills', 'education', 'bio', 'phone', 'resume', 'portfolio', 'github', 'linkedin']
      : ['name', 'companyName', 'companyWebsite', 'companyDescription', 'companyLogo', 'companySize', 'industry', 'location', 'foundedYear'];

    const updates = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;