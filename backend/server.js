const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Atlas connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

connectDB();

// Import routes - USE ONLY ONE ANIME ROUTES FILE
const animeRoutes = require('./routes/anime');
const voteRoutes = require('./routes/votes');

// Use routes
app.use('/api/anime', animeRoutes);
app.use('/api/votes', voteRoutes);

// Basic routes
app.get('/', (req, res) => {
  res.json({ message: 'AnimeRank API is running with MongoDB!' });
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working with MongoDB!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Using MongoDB Atlas database');
});