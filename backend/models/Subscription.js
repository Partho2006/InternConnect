const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  plan: {
    type: String,
    enum: ['free', 'basic', 'premium'],
    default: 'free'
  },
  // Daily limits
  dailyApplications: {
    type: Number,
    default: 0
  },
  dailyPosts: {
    type: Number,
    default: 0
  },
  lastApplicationDate: Date,
  lastPostDate: Date,
  
  // Plan limits
  maxDailyApplications: {
    type: Number,
    default: 5 // Free plan
  },
  maxDailyPosts: {
    type: Number,
    default: 1 // Free plan
  },
  
  // Stripe info
  stripeCustomerId: String,
  stripeSubscriptionId: String,
  stripePriceId: String,
  
  // Subscription status
  status: {
    type: String,
    enum: ['active', 'canceled', 'past_due'],
    default: 'active'
  },
  currentPeriodStart: Date,
  currentPeriodEnd: Date,
  
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Method to check if user can apply
SubscriptionSchema.methods.canApply = function() {
  const today = new Date().toDateString();
  const lastDate = this.lastApplicationDate ? this.lastApplicationDate.toDateString() : null;
  
  // Reset counter if it's a new day
  if (lastDate !== today) {
    this.dailyApplications = 0;
    this.lastApplicationDate = new Date();
  }
  
  return this.dailyApplications < this.maxDailyApplications;
};

// Method to check if user can post
SubscriptionSchema.methods.canPost = function() {
  const today = new Date().toDateString();
  const lastDate = this.lastPostDate ? this.lastPostDate.toDateString() : null;
  
  // Reset counter if it's a new day
  if (lastDate !== today) {
    this.dailyPosts = 0;
    this.lastPostDate = new Date();
  }
  
  return this.dailyPosts < this.maxDailyPosts;
};

// Increment application counter
SubscriptionSchema.methods.incrementApplications = async function() {
  this.dailyApplications += 1;
  this.lastApplicationDate = new Date();
  await this.save();
};

// Increment post counter
SubscriptionSchema.methods.incrementPosts = async function() {
  this.dailyPosts += 1;
  this.lastPostDate = new Date();
  await this.save();
};

module.exports = mongoose.model('Subscription', SubscriptionSchema);