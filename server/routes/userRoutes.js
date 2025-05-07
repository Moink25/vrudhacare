const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getProfile,
  updateProfile,
} = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");

// Authentication routes
router.post("/register", register);
router.post("/login", login);

// User profile routes (protected)
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

module.exports = router;
