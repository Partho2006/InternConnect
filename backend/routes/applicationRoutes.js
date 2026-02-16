const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const Internship = require('../models/Internship');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const { checkApplicationLimit } = require('../middleware/checkLimits');
const path = require('path'); // Add this

// Apply to internship (student only) - WITH RESUME UPLOAD
router.post('/', auth, checkApplicationLimit, upload.single('resume'), async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Only students can apply' });
    }

    // Check if resume was uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'Resume is required' });
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

    // IMPORTANT: Use forward slashes for URLs (works on both Windows and Linux)
    const resumeUrl = `/uploads/resumes/${req.file.filename}`;
    
    console.log('✅ Resume uploaded successfully!');
    console.log('📄 Original name:', req.file.originalname);
    console.log('🔗 Resume URL:', resumeUrl);

    const application = new Application({
      internship: internshipId,
      student: req.user.id,
      coverLetter: coverLetter || '',
      resumeUrl: resumeUrl,
      resumeOriginalName: req.file.originalname
    });

    await application.save();
    
    console.log('✅ Application saved with resume!');
    
    // Add student to internship applicants
    await Internship.findByIdAndUpdate(internshipId, {
      $push: { applicants: req.user.id }
    });

    // Increment application counter
    await req.subscription.incrementApplications();

    res.json(application);
  } catch (err) {
    console.error('❌ Application error:', err);
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
      .populate('student', 'name email skills education resume portfolio phone bio');
    
    console.log(`📋 Found ${applications.length} applications`);
    if (applications.length > 0) {
      console.log('📎 First app resume:', applications[0].resumeUrl);
      console.log('📎 First app resume name:', applications[0].resumeOriginalName);
    }
    
    res.json(applications);
  } catch (err) {
    console.error('❌ Fetch error:', err);
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