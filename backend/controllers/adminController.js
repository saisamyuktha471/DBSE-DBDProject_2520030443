const User = require("../models/User");
const Order = require("../models/Order");
const Return = require("../models/Return");


// ======================================================
// GET CUSTOMERS
// ======================================================

const getCustomers = async (req, res) => {
  try {
    const customers = await User.findAll({
      where: {
        role: "customer",
      },

      attributes: [
        "id",
        "name",
        "email",
        "phone",
        "createdAt",
      ],

      include: [
        {
          model: Order,
          as: "orders",
          attributes: [
            "id",
            "orderNumber",
            "total",
            "status",
            "address",
            "createdAt",
          ],
        },
      ],

      order: [["createdAt", "DESC"]],
    });

    const formattedCustomers = customers.map(
      (customer) => {
        const orders = customer.orders || [];

        const spending = orders.reduce(
          (sum, order) =>
            sum + Number(order.total || 0),
          0
        );

        return {
          id: customer.id,
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          city: "Not provided",
          orders: orders.length,
          spending: spending,
        };
      }
    );

    res.status(200).json({
      customers: formattedCustomers,
    });

  } catch (error) {
    console.error(
      "Get Customers Error:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch customers",
    });
  }
};


// ======================================================
// GET INVENTORY
// ======================================================

const getInventory = async (req, res) => {
  try {
    const Product = require("../models/Product");

    const products = await Product.findAll({
      order: [["stock", "ASC"]],
    });

    res.status(200).json({
      products,
    });

  } catch (error) {
    console.error(
      "Get Inventory Error:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch inventory",
    });
  }
};


// ======================================================
// GET RETURNS
// ======================================================

const getReturns = async (req, res) => {
  try {
    const returns = await Return.findAll({
      include: [
        {
          model: User,
          as: "user",
          attributes: [
            "id",
            "name",
            "email",
            "phone",
          ],
        },

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
    console.error(
      "Get Returns Error:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch returns",
    });
  }
};


// ======================================================
// UPDATE RETURN STATUS
// ======================================================

const updateReturnStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const returnRequest =
      await Return.findByPk(req.params.id);

    if (!returnRequest) {
      return res.status(404).json({
        message: "Return request not found",
      });
    }

    const validStatuses = [
      "Processing",
      "Approved",
      "Rejected",
      "Completed",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid return status",
      });
    }

    returnRequest.status = status;

    await returnRequest.save();

    res.status(200).json({
      message: "Return status updated successfully",
      return: returnRequest,
    });

  } catch (error) {
    console.error(
      "Update Return Error:",
      error
    );

    res.status(500).json({
      message: "Failed to update return status",
    });
  }
};


// ======================================================
// EXPORTS
// ======================================================

module.exports = {
  getCustomers,
  getInventory,
  getReturns,
  updateReturnStatus,
};