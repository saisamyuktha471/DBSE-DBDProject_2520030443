const express = require("express");

const {
  createReturn,
  getMyReturns,
} = require("../controllers/returnController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createReturn);

router.get("/my-returns", authMiddleware, getMyReturns);

module.exports = router;