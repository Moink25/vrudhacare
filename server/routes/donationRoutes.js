const express = require("express");
const router = express.Router();
const {
  createDonation,
  getDonations,
  getDonationStats,
  getUserDonations,
} = require("../controllers/donationController");
const { protect, admin } = require("../middlewares/authMiddleware");

// Public route for creating donations
router.post("/", createDonation);

// User route for getting their donations
router.get("/mydonations", protect, getUserDonations);

// Admin routes for viewing donation history and stats
router.get("/", protect, admin, getDonations);
router.get("/stats", protect, admin, getDonationStats);

module.exports = router;
