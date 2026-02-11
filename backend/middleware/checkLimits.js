const Subscription = require('../models/Subscription');

// Middleware to check application limits
const checkApplicationLimit = async (req, res, next) => {
  try {
    let subscription = await Subscription.findOne({ user: req.user.id });
    
    // Create subscription if doesn't exist
    if (!subscription) {
      subscription = new Subscription({ user: req.user.id });
      await subscription.save();
    }
    
    if (!subscription.canApply()) {
      return res.status(403).json({ 
        message: `Daily application limit reached (${subscription.maxDailyApplications}/day). Upgrade to apply more!`,
        limitReached: true,
        currentPlan: subscription.plan,
        dailyApplications: subscription.dailyApplications,
        maxDailyApplications: subscription.maxDailyApplications
      });
    }
    
    req.subscription = subscription;
    next();
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Middleware to check posting limits
const checkPostLimit = async (req, res, next) => {
  try {
    let subscription = await Subscription.findOne({ user: req.user.id });
    
    // Create subscription if doesn't exist
    if (!subscription) {
      subscription = new Subscription({ user: req.user.id });
      await subscription.save();
    }
    
    if (!subscription.canPost()) {
      return res.status(403).json({ 
        message: `Daily posting limit reached (${subscription.maxDailyPosts}/day). Upgrade to post more!`,
        limitReached: true,
        currentPlan: subscription.plan,
        dailyPosts: subscription.dailyPosts,
        maxDailyPosts: subscription.maxDailyPosts
      });
    }
    
    req.subscription = subscription;
    next();
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { checkApplicationLimit, checkPostLimit };