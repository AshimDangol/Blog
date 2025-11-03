const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const errorHandler = require("./middleware/errorHandler");

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get("/", (req, res) => {
  res.json({
    message: "Blog API is running",
    status: "ok",
    endpoints: {
      register: "POST /api/users/register",
      health: "GET /health",
    },
  });
});

// Dedicated health check endpoint for monitoring/ping services
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    mongodb: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

// Routes
app.use("/api/users", userRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

// MongoDB connection options
const mongooseOptions = {
  serverSelectionTimeoutMS: 10000, // Timeout after 10s (longer for Atlas)
  socketTimeoutMS: 45000,
};

// Connect to MongoDB before starting server
const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in .env file");
    }

    await mongoose.connect(process.env.MONGO_URI, mongooseOptions);
    console.log("✅ MongoDB Connected");

    // Only start server after successful DB connection
    const PORT = process.env.PORT || 5000;
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

    // Handle server listen errors (e.g., port already in use)
    server.on("error", (error) => {
      if (error.code === "EADDRINUSE") {
        console.error(`❌ Port ${PORT} is already in use.`);
        console.error(`   Try one of these solutions:`);
        console.error(`   1. Kill the process using port ${PORT}:`);
        console.error(`      Windows: netstat -ano | findstr :${PORT}`);
        console.error(`      Then: taskkill /PID <PID> /F`);
        console.error(`   2. Use a different port by setting PORT environment variable`);
        console.error(`      Example: $env:PORT=5001; npm start`);
        process.exit(1);
      } else {
        console.error("❌ Server Error:", error.message);
        process.exit(1);
      }
    });

    // Graceful shutdown
    const shutdown = async (signal) => {
      console.log(`\n${signal} received. Shutting down gracefully...`);
      server.close(async () => {
        console.log("HTTP server closed.");
        try {
          await mongoose.connection.close();
          console.log("MongoDB connection closed.");
          process.exit(0);
        } catch (error) {
          console.error("Error closing MongoDB connection:", error);
          process.exit(1);
        }
      });
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));

    // Optional: Internal keep-alive mechanism (pings itself every 10 minutes)
    // Note: On Render's free tier, external ping services are more reliable
    // This helps maintain 30+ day uptime by preventing the 15-minute inactivity timeout
    if (process.env.ENABLE_KEEP_ALIVE === "true") {
      const keepAliveInterval = 10 * 60 * 1000; // 10 minutes (less than Render's 15-min timeout)
      const keepAliveUrl = process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`;
      
      setInterval(async () => {
        try {
          const https = require("https");
          const http = require("http");
          
          const parsedUrl = new URL(keepAliveUrl);
          const client = parsedUrl.protocol === "https:" ? https : http;
          
          const req = client.request({
            hostname: parsedUrl.hostname,
            port: parsedUrl.port || (parsedUrl.protocol === "https:" ? 443 : 80),
            path: "/health",
            method: "GET",
            timeout: 5000,
          }, (res) => {
            console.log(`🔄 Keep-alive ping sent at ${new Date().toISOString()}`);
          });
          
          req.on("error", (err) => {
            console.log(`⚠️ Keep-alive ping failed (this is normal if service is starting): ${err.message}`);
          });
          
          req.end();
        } catch (error) {
          console.log(`⚠️ Keep-alive error: ${error.message}`);
        }
      }, keepAliveInterval);
      
      console.log("🔄 Keep-alive mechanism enabled (pinging every 10 minutes to maintain 30+ day uptime)");
    }
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};

connectDB();
