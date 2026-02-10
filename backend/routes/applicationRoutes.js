const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const Internship = require('../models/Internship');
const auth = require('../middleware/auth');

// Apply to internship (student only)
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Only students can apply' });
    }

    const { internshipId, coverLetter } = req.body;

    // Check if already applied
    const existingApp = await Application.findOne({
      internship: internshipId,
      student: req.user.id
    });

    if (existingApp) {
      return res.status(400).json({ message: 'Already applied to this internship' });
    }

    const application = new Application({
      internship: internshipId,
      student: req.user.id,
      coverLetter
    });

    await application.save();
    
    // Add student to internship applicants
    await Internship.findByIdAndUpdate(internshipId, {
      $push: { applicants: req.user.id }
    });

    res.json(application);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get student's applications
router.get('/my-applications', auth, async (req, res) => {
  try {
    const applications = await Application.find({ student: req.user.id })
      .populate('internship')
      .sort({ appliedAt: -1 });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get applications for an internship (company only)
router.get('/internship/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'company') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const applications = await Application.find({ internship: req.params.id })
      .populate('student', 'name email skills education resume portfolio');
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update application status (company only)
router.patch('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'company') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { status } = req.body;
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json(application);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;