const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Register a new user
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = new User({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    // Handle duplicate key error (unique email constraint)
    if (error.code === 11000) {
      return res.status(400).json({ message: "Email already registered" });
    }
    // Pass other errors to error handler middleware
    next(error);
  }
};

module.exports = {
  registerUser,
};

