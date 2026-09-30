const express = require("express");

const {
  createOrder,
  getMyOrders,
  getOrderByNumber,
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/orderController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();


// ======================================================
// CUSTOMER ROUTES
// ======================================================

// Place an order
router.post(
  "/",
  authMiddleware,
  createOrder
);

// Get logged-in customer's orders
router.get(
  "/my-orders",
  authMiddleware,
  getMyOrders
);

// Get one customer's order
router.get(
  "/:orderNumber",
  authMiddleware,
  getOrderByNumber
);


// ======================================================
// ADMIN ROUTES
// ======================================================

// Get all customer orders
router.get(
  "/admin/all",
  authMiddleware,
  adminMiddleware,
  getAllOrders
);

// Update order status
router.put(
  "/admin/:id/status",
  authMiddleware,
  adminMiddleware,
  updateOrderStatus
);


module.exports = router;