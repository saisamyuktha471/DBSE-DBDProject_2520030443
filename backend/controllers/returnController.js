const Return = require("../models/Return");
const Order = require("../models/Order");

const createReturn = async (req, res) => {
  try {
    const { orderNumber, reason } = req.body;

    if (!orderNumber) {
      return res.status(400).json({
        message: "Order number is required",
      });
    }

    if (!reason) {
      return res.status(400).json({
        message: "Return reason is required",
      });
    }

    const order = await Order.findOne({
      where: {
        orderNumber,
        userId: req.user.id,
      },
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    const existingReturn = await Return.findOne({
      where: {
        orderId: order.id,
        userId: req.user.id,
      },
    });

    if (existingReturn) {
      return res.status(400).json({
        message: "Return request already exists for this order",
      });
    }

    const returnNumber =
      "RET" + Date.now().toString().slice(-8);

    const newReturn = await Return.create({
      returnNumber,
      userId: req.user.id,
      orderId: order.id,
      reason,
      status: "Processing",
    });

    res.status(201).json({
      message: "Return request created successfully",
      return: newReturn,
    });
  } catch (error) {
    console.error("Create Return Error:", error);

    res.status(500).json({
      message: "Failed to create return request",
    });
  }
};


const getMyReturns = async (req, res) => {
  try {
    const returns = await Return.findAll({
      where: {
        userId: req.user.id,
      },
      include: [
        {
          model: Order,
          as: "order",
          attributes: [
            "orderNumber",
            "total",
            "status",
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      returns,
    });
  } catch (error) {
    console.error("Get Returns Error:", error);

    res.status(500).json({
      message: "Failed to fetch returns",
    });
  }
};


module.exports = {
  createReturn,
  getMyReturns,
};