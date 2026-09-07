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

// Universal CORS setup for frontend clients and Vercel domains
app.use(
  cors({
    origin: (origin, callback) => callback(null, true),
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  })
);
app.options("*", cors());

app.use(express.json({ limit: "10mb" })); // Parse JSON bodies with safe limit
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// Root route (for service health check, does not block if DB is pending)
app.get("/", (req, res) => {
  res.json({
    message: "Blogsify Backend is running",
    status: "ok",
    database: mongoose.connection.readyState === 1 ? "connected" : "connecting",
  });
});

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

// MongoDB Atlas Connection (cached for Vercel serverless invocations)
let cachedDb = null;
const connectDB = async () => {
  if (cachedDb && mongoose.connection.readyState === 1) {
    return cachedDb;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not defined in environment variables");
  }

  const db = await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000,
  });
  cachedDb = db;
  console.log("Connected to MongoDB Atlas");
  return db;
};

// Ensure database is connected on every data API request
app.use(async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      await connectDB();
    }
    next();
  } catch (err) {
    console.error("Database connection failure:", err.message);
    res.status(503).json({
      message: "Database service unavailable. Please check MONGODB_URI in Vercel settings.",
      error: err.message,
    });
  }
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

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

  connectDB()
    .then(() => {
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
    })
    .catch((err) => {
      console.error("Failed to connect to DB in development:", err.message);
    });
}
