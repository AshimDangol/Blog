const express = require("express");
const router = express.Router();
const { registerUser } = require("../controllers/userController");
const { validateUserRegistration, checkValidation } = require("../middleware/validation");

// Register route with validation
router.post("/register", validateUserRegistration, checkValidation, registerUser);

module.exports = router;
