const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'InternConnect API is running!' });
});

// Database connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('MongoDB Error:', err));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/internships', require('./routes/internshipRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes'));
app.use('/api/profile', require('./routes/profileRoutes')); // Add this line

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});