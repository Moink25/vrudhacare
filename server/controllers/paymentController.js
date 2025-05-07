const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../models/orderModel");

// Create Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc    Create Razorpay order
// @route   POST /api/payments/razorpay
// @access  Private
exports.createRazorpayOrder = async (req, res) => {
  try {
    const {
      amount,
      currency = "INR",
      receipt = "order_receipt",
      notes = {},
    } = req.body;

    const options = {
      amount: amount * 100, // Razorpay expects amount in smallest currency unit
      currency,
      receipt,
      notes,
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Razorpay order creation error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Verify Razorpay payment and create order
// @route   POST /api/payments/razorpay/verify
// @access  Public
exports.verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderData,
    } = req.body;

    // Creating hmac object
    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);

    // Passing the data to be hashed
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);

    // Creating the hmac in the required format
    const generated_signature = hmac.digest("hex");

    // Checking if the signature generated and the signature received are the same
    if (generated_signature === razorpay_signature) {
      // Create order in our database
      if (!orderData) {
        return res.status(400).json({
          success: false,
          message: "Order data is required",
        });
      }

      // Create order
      const order = await Order.create({
        ...orderData,
        isPaid: true,
        paidAt: Date.now(),
        paymentResult: {
          id: razorpay_payment_id,
          status: "completed",
          update_time: Date.now(),
        },
      });

      // Update product stock (if needed)
      // This part is handled in the order controller, but we need to replicate it here
      if (orderData.orderItems && orderData.orderItems.length > 0) {
        const Product = require("../models/productModel");
        for (const item of orderData.orderItems) {
          const product = await Product.findById(item.product);
          if (product) {
            product.stock -= item.quantity;
            await product.save();
          }
        }
      }

      return res.status(200).json({
        success: true,
        message: "Payment verified successfully",
        _id: order._id,
        paymentId: razorpay_payment_id,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
