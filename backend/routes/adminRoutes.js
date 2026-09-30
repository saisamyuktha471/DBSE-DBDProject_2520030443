const express = require("express");

const {
  getCustomers,
  getInventory,
  getReturns,
  updateReturnStatus,
} = require("../controllers/adminController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

router.get(
  "/customers",
  authMiddleware,
  adminMiddleware,
  getCustomers
);

router.get(
  "/inventory",
  authMiddleware,
  adminMiddleware,
  getInventory
);

router.get(
  "/returns",
  authMiddleware,
  adminMiddleware,
  getReturns
);

router.put(
  "/returns/:id/status",
  authMiddleware,
  adminMiddleware,
  updateReturnStatus
);

module.exports = router;