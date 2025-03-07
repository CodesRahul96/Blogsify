const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const postRoutes = require('./routes/posts'); // Your posts routes
const authRoutes = require('./routes/auth'); // Your posts routes

// Load environment variables from .env file (for local dev)
dotenv.config();

const app = express();

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Vercel frontend URL or local dev
  credentials: true, // If using cookies/sessions
}));

// MongoDB Atlas Connection
const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }
    await mongoose.connect(uri);
    console.log('Connected to MongoDB Atlas');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1); // Exit if connection fails
  }
};

// Connect to DB
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

// Root route (optional, for testing)
app.get('/', (req, res) => {
  res.json({ message: 'Blogify Backend is running' });
});

// Export the app for Vercel serverless
module.exports = app;

// Start server locally with nodemon or node (not needed on Vercel)
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;

  // Check if nodemon is being used (via process.argv or env)
  if (process.argv.includes('--nodemon') || process.env.NODEMON) {
    app.listen(PORT, () => {
      console.log(`Server running with nodemon on port ${PORT}`);
    });
  } else {
    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    // Handle graceful shutdown for nodemon
    process.on('SIGTERM', () => {
      console.log('SIGTERM received. Shutting down gracefully...');
      server.close(() => {
        mongoose.connection.close(false, () => {
          console.log('MongoDB connection closed');
          process.exit(0);
        });
      });
    });
  }
}