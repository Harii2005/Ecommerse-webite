const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDatabase = require("./src/config/database");
const { seedDatabase } = require("./src/config/seedData");

// Import routes
const authRoutes = require("./src/routes/auth");
const itemRoutes = require("./src/routes/items");
const cartRoutes = require("./src/routes/cart");

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL || "http://localhost:3000",
      "https://ecommerse-webite.onrender.com",
      "https://ecommerse-webiteee.onrender.com",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/cart", cartRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running successfully",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// Root endpoint
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Ecommerce API",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      items: "/api/items",
      cart: "/api/cart",
      health: "/api/health",
    },
  });
});

// Seed database endpoint (development only)
app.post("/api/seed", async (req, res) => {
  try {
    if (process.env.NODE_ENV === "production") {
      return res.status(403).json({
        success: false,
        message: "Database seeding is not allowed in production",
      });
    }

    await seedDatabase();
    res.status(200).json({
      success: true,
      message: "Database seeded successfully",
    });
  } catch (error) {
    console.error("Seed database error:", error);
    res.status(500).json({
      success: false,
      message: "Error seeding database",
      error: error.message,
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl,
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error("Global error handler:", error);

  res.status(error.status || 500).json({
    success: false,
    message: error.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  });
});

const PORT = process.env.PORT || 8080;

// Start server
const startServer = async () => {
  try {
    // Connect to database
    await connectDatabase();

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📚 API Documentation: http://localhost:${PORT}/`);
      console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
      console.log(`🌱 Seed Database: POST http://localhost:${PORT}/api/seed`);
    });
  } catch (error) {
    console.error("❌ Error starting server:", error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
