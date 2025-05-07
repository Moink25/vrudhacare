const express = require("express");
const router = express.Router();
const {
  createRazorpayOrder,
  verifyRazorpayPayment,
} = require("../controllers/paymentController");
const { protect } = require("../middlewares/authMiddleware");

// Protected route for creating payment orders
router.post("/razorpay", protect, createRazorpayOrder);

// Public route for verifying payments
router.post("/razorpay/verify", verifyRazorpayPayment);

module.exports = router;
