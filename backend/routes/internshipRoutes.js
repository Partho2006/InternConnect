const express = require('express');
const router = express.Router();
const Internship = require('../models/Internship');
const auth = require('../middleware/auth');
const { checkPostLimit } = require('../middleware/checkLimits');

// Get all internships
router.get('/', async (req, res) => {
  try {
    const internships = await Internship.find({ status: 'active' })
      .populate('company', 'name companyName email')
      .sort({ createdAt: -1 });
    res.json(internships);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single internship
router.get('/:id', async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id)
      .populate('company', 'name companyName email companyWebsite companyDescription companySize industry location');
    
    if (!internship) {
      return res.status(404).json({ message: 'Internship not found' });
    }
    
    res.json(internship);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Post new internship (company only)
router.post('/', auth, checkPostLimit, async (req, res) => {
  try {
    if (req.user.role !== 'company') {
      return res.status(403).json({ message: 'Only companies can post internships' });
    }

    const internship = new Internship({
      ...req.body,
      company: req.user.id
    });

    await internship.save();
    
    // Increment post counter
    await req.subscription.incrementPosts();

    res.json(internship);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update internship (company only)
router.put('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'company') {
      return res.status(403).json({ message: 'Only companies can update internships' });
    }

    const internship = await Internship.findById(req.params.id);
    
    if (!internship) {
      return res.status(404).json({ message: 'Internship not found' });
    }

    if (internship.company.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedInternship = await Internship.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.json(updatedInternship);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete internship (company only)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'company') {
      return res.status(403).json({ message: 'Only companies can delete internships' });
    }

    const internship = await Internship.findById(req.params.id);
    
    if (!internship) {
      return res.status(404).json({ message: 'Internship not found' });
    }

    if (internship.company.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Internship.findByIdAndDelete(req.params.id);
    res.json({ message: 'Internship deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get company's internships
router.get('/company/my-internships', auth, async (req, res) => {
  try {
    const internships = await Internship.find({ company: req.user.id })
      .sort({ createdAt: -1 });
    res.json(internships);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;