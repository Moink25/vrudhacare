const Donation = require("../models/donationModel");

// @desc    Create new donation
// @route   POST /api/donations
// @access  Public
exports.createDonation = async (req, res) => {
  try {
    const { name, email, amount, message, paymentId } = req.body;

    // Add user reference if logged in
    const userId = req.user ? req.user._id : null;

    const donation = await Donation.create({
      name,
      email,
      amount,
      message,
      paymentId,
      user: userId,
      status: "completed",
    });

    res.status(201).json({
      success: true,
      donation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all donations
// @route   GET /api/donations
// @access  Private/Admin
exports.getDonations = async (req, res) => {
  try {
    const donations = await Donation.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      donations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get user's donations
// @route   GET /api/donations/mydonations
// @access  Private
exports.getUserDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.json(donations);
  } catch (error) {
    console.error("Error fetching user donations:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch donations",
    });
  }
};

// @desc    Get donation statistics
// @route   GET /api/donations/stats
// @access  Private/Admin
exports.getDonationStats = async (req, res) => {
  try {
    const totalDonations = await Donation.countDocuments({
      status: "completed",
    });
    const totalAmount = await Donation.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const monthlyDonations = await Donation.aggregate([
      { $match: { status: "completed" } },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          count: { $sum: 1 },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
      { $limit: 12 },
    ]);

    res.status(200).json({
      success: true,
      totalDonations,
      totalAmount: totalAmount.length > 0 ? totalAmount[0].total : 0,
      monthlyDonations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
