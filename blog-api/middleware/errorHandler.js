// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((error) => error.message);
    return res.status(400).json({ message: "Validation Error", errors: messages });
  }

  // Mongoose cast error (invalid ObjectId, etc.)
  if (err.name === "CastError") {
    return res.status(400).json({ message: "Invalid ID format" });
  }

  // Default server error (don't expose internal error details)
  res.status(err.status || 500).json({
    message: err.message || "Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

module.exports = errorHandler;

