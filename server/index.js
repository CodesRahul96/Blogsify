const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const authRoutes = require("./routes/auth"); // auth routes
const postRoutes = require("./routes/posts"); // posts routes

// Load environment variables from .env file (for local dev)
dotenv.config();

const app = express();

// Middleware
app.use(express.json({ limit: "10mb" })); // Parse JSON bodies with safe limit
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173", // Vercel frontend URL or local dev
    credentials: true, // If using cookies/sessions
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
    process.exit(1); // Exit if connection fails
  }
};

// Health check endpoint
app.get("/api/health", (req, res) => {
  const dbState = mongoose.connection.readyState;
  const statusMap = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };

  res.json({
    status: dbState === 1 ? "ok" : "degraded",
    database: statusMap[dbState] || "unknown",
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

// Root route (optional, for testing)
app.get("/", (req, res) => {
  res.json({ message: "Blogsify Backend is running" });
});

// 404 Handler for undefined API routes
app.use("/api/*", (req, res) => {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
});

// Centralized Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error("Unhandled server error:", err);
  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    message: err.message || "An unexpected internal server error occurred",
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
});

// Export the app for Vercel serverless
module.exports = app;

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;

  connectDB().then(() => {
    // Check if nodemon is being used (via process.argv or env)
    if (process.argv.includes("--nodemon") || process.env.NODEMON) {
      app.listen(PORT, () => {
        console.log(`Server running with nodemon on port ${PORT}`);
      });
    } else {
      const server = app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });

      // Handle graceful shutdown
      const shutdown = async (signal) => {
        console.log(`${signal} received. Shutting down gracefully...`);
        server.close(async () => {
          try {
            await mongoose.connection.close();
            console.log("MongoDB connection closed");
          } catch (e) {
            // ignore
          }
          process.exit(0);
        });
      };

      process.on("SIGTERM", () => shutdown("SIGTERM"));
      process.on("SIGINT", () => shutdown("SIGINT"));
    }
  });
} else {
  // For Vercel/Production, we might want to connect lazily or just call it.
  // But usually Vercel serverless functions re-use connections.
  // For now, let's keep the global call for production/export if needed,
  // but commonly we'd export a handler that connects.
  // Given the structure, we'll leave connectDB() execution for the module scope if it's production?
  // Actually, for Vercel, simply calling connectDB() is often fine as long as requests wait for it.
  connectDB();
}
