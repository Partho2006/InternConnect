const express = require('express');
const router = express.Router();
const Subscription = require('../models/Subscription');
const auth = require('../middleware/auth');

// Get current user's subscription
router.get('/me', auth, async (req, res) => {
  try {
    let subscription = await Subscription.findOne({ user: req.user.id });
    
    if (!subscription) {
      subscription = new Subscription({ user: req.user.id });
      await subscription.save();
    }
    
    // Check and reset daily limits if needed
    const today = new Date().toDateString();
    
    if (subscription.lastApplicationDate?.toDateString() !== today) {
      subscription.dailyApplications = 0;
    }
    
    if (subscription.lastPostDate?.toDateString() !== today) {
      subscription.dailyPosts = 0;
    }
    
    res.json(subscription);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Upgrade subscription
router.post('/upgrade', auth, async (req, res) => {
  try {
    const { plan } = req.body; // 'basic' or 'premium'
    
    let subscription = await Subscription.findOne({ user: req.user.id });
    
    if (!subscription) {
      subscription = new Subscription({ user: req.user.id });
    }
    
    // Set limits based on plan
    subscription.plan = plan;
    
    if (plan === 'basic') {
      subscription.maxDailyApplications = 20;
      subscription.maxDailyPosts = 5;
    } else if (plan === 'premium') {
      subscription.maxDailyApplications = -1; // Unlimited
      subscription.maxDailyPosts = -1; // Unlimited
    }
    
    subscription.status = 'active';
    subscription.currentPeriodStart = new Date();
    subscription.currentPeriodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
    
    await subscription.save();
    
    res.json(subscription);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;