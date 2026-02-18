const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const User = require('../models/User');
const auth = require('../middleware/auth');

// ── GET all reviews for a company ─────────────────────────────
router.get('/company/:companyId', async (req, res) => {
  try {
    const reviews = await Review.find({
      company: req.params.companyId,
      isApproved: true
    }).select('-reviewer') // NEVER send reviewer id to frontend
      .sort({ createdAt: -1 });

    // Calculate aggregate stats
    const stats = reviews.reduce((acc, r) => {
      acc.overall += r.overallRating;
      acc.stipend += r.stipendRating;
      acc.culture += r.cultureRating;
      acc.learning += r.learningRating;
      acc.mentor += r.mentorRating;
      acc.recommend += r.wouldRecommend ? 1 : 0;
      return acc;
    }, { overall: 0, stipend: 0, culture: 0, learning: 0, mentor: 0, recommend: 0 });

    const count = reviews.length;
    const avgStats = count > 0 ? {
      overall: (stats.overall / count).toFixed(1),
      stipend: (stats.stipend / count).toFixed(1),
      culture: (stats.culture / count).toFixed(1),
      learning: (stats.learning / count).toFixed(1),
      mentor: (stats.mentor / count).toFixed(1),
      recommendPercent: Math.round((stats.recommend / count) * 100),
      avgStipend: reviews.filter(r => r.stipend).reduce((a, r) => a + r.stipend, 0) /
                  (reviews.filter(r => r.stipend).length || 1)
    } : null;

    res.json({ reviews, stats: avgStats, count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ── GET all companies with review counts (for browse page) ────
router.get('/companies', async (req, res) => {
  try {
    const companies = await User.find({ role: 'company' })
      .select('companyName companyLogo industry location companySize');

    const companiesWithStats = await Promise.all(
      companies.map(async (company) => {
        const reviews = await Review.find({ company: company._id, isApproved: true });
        const avgRating = reviews.length > 0
          ? (reviews.reduce((a, r) => a + r.overallRating, 0) / reviews.length).toFixed(1)
          : null;
        return {
          ...company.toObject(),
          reviewCount: reviews.length,
          avgRating
        };
      })
    );

    // Sort by review count
    companiesWithStats.sort((a, b) => b.reviewCount - a.reviewCount);
    res.json(companiesWithStats);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ── POST submit a review (students only) ──────────────────────
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Only students can submit reviews' });
    }

    const {
      companyId, overallRating, stipendRating, cultureRating,
      learningRating, mentorRating, title, pros, cons, advice,
      role, duration, stipend, workType, year, wouldRecommend
    } = req.body;

    // Check for existing review
    const existing = await Review.findOne({
      company: companyId,
      reviewer: req.user.id
    });
    if (existing) {
      return res.status(400).json({ message: 'You have already reviewed this company' });
    }

    const review = new Review({
      company: companyId,
      reviewer: req.user.id,
      isAnonymous: true,
      overallRating, stipendRating, cultureRating,
      learningRating, mentorRating,
      title, pros, cons, advice,
      role, duration, stipend, workType, year,
      wouldRecommend
    });

    await review.save();

    // Return without reviewer field
    const saved = await Review.findById(review._id).select('-reviewer');
    res.status(201).json(saved);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'You have already reviewed this company' });
    }
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ── PATCH mark review as helpful ──────────────────────────────
router.patch('/:id/helpful', auth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    const idx = review.helpful.indexOf(req.user.id);
    if (idx > -1) {
      review.helpful.splice(idx, 1); // toggle off
    } else {
      review.helpful.push(req.user.id); // toggle on
    }
    await review.save();
    res.json({ helpfulCount: review.helpful.length });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;