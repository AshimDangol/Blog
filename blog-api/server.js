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
    },
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
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};

connectDB();
