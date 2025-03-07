const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const postRoutes = require("./routes/posts"); // Assuming your routes are in routes/posts.js

// Load environment variables from .env file (for local dev)
dotenv.config();

const app = express();

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173", // Vercel frontend URL or local dev
    credentials: true, // If you use cookies/sessions
  })
);

// MongoDB Atlas Connection
const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }
    await mongoose.connect(uri);
    console.log("Connected to MongoDB Atlas");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1); // Exit process if connection fails
  }
};

// Connect to DB
connectDB();

// Routes
app.use("/api/posts", postRoutes); // Mount your post routes

// Root route (optional, for testing)
app.get("/", (req, res) => {
  res.json({ message: "Blogify Backend is running" });
});

// Export the app for Vercel serverless
module.exports = app;

// Optional: Start server locally (not needed on Vercel)
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
