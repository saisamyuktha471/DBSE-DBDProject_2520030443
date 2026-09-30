const express = require("express");

const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();


// ======================================================
// CUSTOMER ROUTES
// ======================================================

// Get all products
router.get("/", getProducts);

// Get single product
router.get("/:id", getProductById);


// ======================================================
// ADMIN ROUTES
// ======================================================

// Add new product
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  createProduct
);

// Update product
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  updateProduct
);

// Delete product
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  deleteProduct
);


module.exports = router;