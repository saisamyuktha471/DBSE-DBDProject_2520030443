
const { sequelize } = require("../config/database");

const Order = require("../models/Order");
const OrderItem = require("../models/OrderItem");
const Product = require("../models/Product");
const User = require("../models/User");

// ======================================================
// CREATE ORDER - CUSTOMER
// ======================================================

const createOrder = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { items, address, paymentMethod } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      await transaction.rollback();
      return res.status(400).json({
        message: "Cart is empty",
      });
    }

    if (!address) {
      await transaction.rollback();
      return res.status(400).json({
        message: "Address is required",
      });
    }

    if (!req.user || !req.user.id) {
      await transaction.rollback();
      return res.status(401).json({
        message: "User authentication required",
      });
    }

    let subtotal = 0;
    const orderItems = [];

    // Validate products and calculate subtotal.
    for (const item of items) {
      const quantity = Number(item.quantity);

      if (!Number.isInteger(quantity) || quantity <= 0) {
        await transaction.rollback();
        return res.status(400).json({
          message: "Invalid product quantity",
        });
      }

      const product = await Product.findByPk(item.productId, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!product) {
        await transaction.rollback();
        return res.status(404).json({
          message: `Product not found: ${item.productId}`,
        });
      }

      if (Number(product.stock) < quantity) {
        await transaction.rollback();
        return res.status(400).json({
          message: `Insufficient stock for ${product.name}`,
        });
      }

      const itemSubtotal = Number(product.price) * quantity;

      subtotal += itemSubtotal;

      orderItems.push({
        productId: product.id,
        productName: product.name,
        price: product.price,
        quantity,
        subtotal: itemSubtotal,
      });

      product.stock -= quantity;
      await product.save({ transaction });
    }

    // Calculate delivery and total.
    const delivery = subtotal >= 1000 ? 0 : 80;
    const total = subtotal + delivery;

    // One reward point for every ₹100 of subtotal.
    const rewardPointsEarned = Math.floor(subtotal / 100);

    // Lock the customer record.
    const user = await User.findByPk(req.user.id, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!user) {
      await transaction.rollback();
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    // Calculate updated reward balance.
    const currentPoints = Number(user.rewardPoints || 0);
    const updatedPoints = currentPoints + rewardPointsEarned;

    // Generate order number.
    const orderNumber =
      "RH" + Date.now().toString().slice(-8);

    // Create order.
    const order = await Order.create(
      {
        orderNumber,
        userId: user.id,
        subtotal,
        delivery,
        total,
        status: "Order Placed",
        paymentMethod: paymentMethod || "Cash on Delivery",
        address,
        rewardPointsEarned,
        rewardPointsReversed: false,
      },
      { transaction }
    );

    // Create order items.
    for (const item of orderItems) {
      await OrderItem.create(
        {
          orderId: order.id,
          productId: item.productId,
          productName: item.productName,
          price: item.price,
          quantity: item.quantity,
          subtotal: item.subtotal,
        },
        { transaction }
      );
    }

    // Save the updated reward balance immediately.
    await user.update(
      {
        rewardPoints: updatedPoints,
      },
      { transaction }
    );

    // Commit order, stock changes and points together.
    await transaction.commit();

    return res.status(201).json({
      message: "Order placed successfully",
      order,
      items: orderItems,
      rewardPointsEarned,
      rewardPointsBalance: updatedPoints,
    });
  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback();
    }

    console.error("Create Order Error:", error);

    return res.status(500).json({
      message: "Failed to create order",
      error: error.message,
    });
  }
};

// ======================================================
// GET MY ORDERS - CUSTOMER
// ======================================================

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: {
        userId: req.user.id,
      },
      include: [
        {
          model: OrderItem,
          as: "items",
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({ orders });
  } catch (error) {
    console.error("Get My Orders Error:", error);

    return res.status(500).json({
      message: "Failed to fetch orders",
    });
  }
};

// ======================================================
// GET ORDER BY ORDER NUMBER - CUSTOMER
// ======================================================

const getOrderByNumber = async (req, res) => {
  try {
    const { orderNumber } = req.params;

    const order = await Order.findOne({
      where: {
        orderNumber,
        userId: req.user.id,
      },
      include: [
        {
          model: OrderItem,
          as: "items",
        },
      ],
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    return res.status(200).json({ order });
  } catch (error) {
    console.error("Get Order Error:", error);

    return res.status(500).json({
      message: "Failed to fetch order",
    });
  }
};

// ======================================================
// GET ALL ORDERS - ADMIN
// ======================================================

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
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
          model: OrderItem,
          as: "items",
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({ orders });
  } catch (error) {
    console.error("Get All Orders Error:", error);

    return res.status(500).json({
      message: "Failed to fetch all orders",
    });
  }
};

// ======================================================
// UPDATE ORDER STATUS - ADMIN
// ======================================================

const updateOrderStatus = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "Order Placed",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];

    if (!status) {
      await transaction.rollback();
      return res.status(400).json({
        message: "Order status is required",
      });
    }

    if (!allowedStatuses.includes(status)) {
      await transaction.rollback();
      return res.status(400).json({
        message: "Invalid order status",
      });
    }

    const order = await Order.findByPk(id, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!order) {
      await transaction.rollback();
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // Reverse points only on the first cancellation.
    if (
      status === "Cancelled" &&
      !order.rewardPointsReversed
    ) {
      const user = await User.findByPk(order.userId, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!user) {
        await transaction.rollback();
        return res.status(404).json({
          message: "Customer not found",
        });
      }

      const pointsToReverse = Number(
        order.rewardPointsEarned || 0
      );

      if (pointsToReverse > 0) {
        const currentPoints = Number(user.rewardPoints || 0);

        await user.update(
          {
            rewardPoints: Math.max(
              0,
              currentPoints - pointsToReverse
            ),
          },
          { transaction }
        );
      }

      order.rewardPointsReversed = true;
    }

    order.status = status;

    await order.save({ transaction });

    await transaction.commit();

    return res.status(200).json({
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback();
    }

    console.error("Update Order Status Error:", error);

    return res.status(500).json({
      message: "Failed to update order status",
      error: error.message,
    });
  }
};

// ======================================================
// EXPORT ALL FUNCTIONS
// ======================================================

module.exports = {
  createOrder,
  getMyOrders,
  getOrderByNumber,
  getAllOrders,
  updateOrderStatus,
};