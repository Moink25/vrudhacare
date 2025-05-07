const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter product name"],
      trim: true,
      maxLength: [100, "Product name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Please enter product description"],
    },
    price: {
      type: Number,
      required: [true, "Please enter product price"],
      min: [0, "Price cannot be less than 0"],
    },
    images: [
      {
        public_id: String,
        url: String,
      },
    ],
    category: {
      type: String,
      required: [true, "Please select category for this product"],
      enum: {
        values: [
          "Clothing",
          "Accessories",
          "Home Decor",
          "Art & Craft",
          "Wellness",
          "Other",
        ],
        message: "Please select correct category",
      },
    },
    stock: {
      type: Number,
      required: [true, "Please enter product stock"],
      min: [0, "Stock cannot be less than 0"],
      default: 0,
    },
    maker: {
      type: String,
      required: [
        true,
        "Please enter name of the resident who made this product",
      ],
    },
    story: {
      type: String,
      required: false,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
