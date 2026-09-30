const express = require("express");

const {
  getDecisionSupport,
} = require("../controllers/decisionController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  getDecisionSupport
);

module.exports = router;