const express = require("express");
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductCategories,
} = require("../controllers/productController");
const { protect, admin } = require("../middlewares/authMiddleware");

// Public routes
router.get("/", getProducts);
router.get("/categories", getProductCategories);
router.get("/:id", getProductById);

// Admin routes (protected)
router.post("/", protect, admin, createProduct);
router.put("/:id", protect, admin, updateProduct);
router.delete("/:id", protect, admin, deleteProduct);

module.exports = router;
