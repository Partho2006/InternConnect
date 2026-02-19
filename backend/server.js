const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

// CORS - Allow credentials and specific origin
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// Body parser
app.use(express.json());


// Serve uploaded files statically - IMPORTANT!
// This allows accessing files via import.meta.env.VITE_API_URL + /uploads/resumes/filename.pdf
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Add logging for static file requests (for debugging)
app.use('/uploads', (req, res, next) => {
  console.log('📥 Static file request:', req.url);
  next();
});

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'InternConnect API is running!' });
});

// Database connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('❌ MongoDB Error:', err));

// Routes
app.use('/api/auth', require('./routes/AuthRoutes'));
app.use('/api/internships', require('./routes/internshipRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes'));
app.use('/api/profile', require('./routes/profileRoutes'));
app.use('/api/subscription', require('./routes/subscriptionRoutes'));
app.use('/api/reviews', require('./routes/Reviewroutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📁 Static files served from: ${path.join(__dirname, 'uploads')}`);
});