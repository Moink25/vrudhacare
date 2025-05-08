const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middlewares/authMiddleware");
const User = require("../models/userModel");
const Product = require("../models/productModel");
const Order = require("../models/orderModel");
const Donation = require("../models/donationModel");

// @route   GET /api/admin/stats
// @desc    Get admin dashboard statistics
// @access  Private/Admin
router.get("/stats", protect, admin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalDonations = await Donation.countDocuments();

    // Calculate total revenue from orders
    const orders = await Order.find({ isPaid: true });
    const orderRevenue = orders.reduce(
      (total, order) => total + order.totalPrice,
      0
    );

    // Calculate total donations
    const donations = await Donation.find({ status: "completed" });
    const donationAmount = donations.reduce(
      (total, donation) => total + donation.amount,
      0
    );

    // Total revenue (orders + donations)
    const totalRevenue = orderRevenue + donationAmount;

    // Count pending orders
    const pendingOrders = await Order.countDocuments({ isDelivered: false });

    res.json({
      totalUsers,
      totalProducts,
      totalOrders,
      totalDonations,
      totalRevenue,
      pendingOrders,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/admin/orders/recent
// @desc    Get recent orders for admin dashboard
// @access  Private/Admin
router.get("/orders/recent", protect, admin, async (req, res) => {
  try {
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "name email");

    res.json(recentOrders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/admin/users/recent
// @desc    Get recent users for admin dashboard
// @access  Private/Admin
router.get("/users/recent", protect, admin, async (req, res) => {
  try {
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("-password");

    res.json(recentUsers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
