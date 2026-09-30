const Product = require("../models/Product");
const Order = require("../models/Order");
const OrderItem = require("../models/OrderItem");
const Return = require("../models/Return");

const getDecisionSupport = async (req, res) => {
  try {
    // ==========================================
    // PRODUCTS
    // ==========================================

    const products = await Product.findAll({
      order: [["stock", "ASC"]],
    });

    // ==========================================
    // ORDERS
    // ==========================================

    const orders = await Order.findAll({
      include: [
        {
          model: OrderItem,
          as: "items",
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    // ==========================================
    // RETURNS
    // ==========================================

    const returns = await Return.findAll({
      order: [["createdAt", "DESC"]],
    });

    // ==========================================
    // INVENTORY
    // ==========================================

    const lowStock = products.filter(
      (product) =>
        Number(product.stock || 0) > 0 &&
        Number(product.stock || 0) <= 10
    );

    const outOfStock = products.filter(
      (product) =>
        Number(product.stock || 0) === 0
    );

    // ==========================================
    // REVENUE
    // ==========================================

    const totalRevenue = orders
      .filter(
        (order) =>
          order.status !== "Cancelled"
      )
      .reduce(
        (sum, order) =>
          sum + Number(order.total || 0),
        0
      );

    // ==========================================
    // PRODUCT SALES
    // ==========================================

    const productSales = {};

    orders.forEach((order) => {
      order.items?.forEach((item) => {

        if (!productSales[item.productName]) {
          productSales[item.productName] = {
            productName: item.productName,
            quantity: 0,
            revenue: 0,
          };
        }

        productSales[
          item.productName
        ].quantity += Number(
          item.quantity || 0
        );

        productSales[
          item.productName
        ].revenue += Number(
          item.subtotal || 0
        );
      });
    });

    const topProducts = Object.values(
      productSales
    )
      .sort(
        (a, b) =>
          b.quantity - a.quantity
      )
      .slice(0, 5);

    // ==========================================
    // CANCELLED ORDERS
    // ==========================================

    const cancelledOrders =
      orders.filter(
        (order) =>
          order.status === "Cancelled"
      ).length;

    // ==========================================
    // RECOMMENDATIONS
    // ==========================================

    const recommendations = [];

    if (lowStock.length > 0) {
      recommendations.push(
        `${lowStock.length} product(s) have low stock. Consider restocking them.`
      );
    }

    if (outOfStock.length > 0) {
      recommendations.push(
        `${outOfStock.length} product(s) are out of stock.`
      );
    }

    if (topProducts.length > 0) {
      recommendations.push(
        `${topProducts[0].productName} is currently the highest-selling product.`
      );
    }

    if (returns.length > 0) {
      recommendations.push(
        `${returns.length} return request(s) have been recorded.`
      );
    }

    if (cancelledOrders > 0) {
      recommendations.push(
        `${cancelledOrders} order(s) have been cancelled.`
      );
    }

    if (recommendations.length === 0) {
      recommendations.push(
        "No immediate business issues detected."
      );
    }

    // ==========================================
    // RESPONSE
    // ==========================================

    res.json({
      // Data required by frontend
      orders,
      returns,
      products,

      // Business calculations
      totalRevenue,
      totalOrders: orders.length,
      returnRate:
        orders.length > 0
          ? (
              (returns.length /
                orders.length) *
              100
            ).toFixed(1)
          : "0.0",

      stockAlerts:
        lowStock.length +
        outOfStock.length,

      // Decision support information
      inventory: {
        lowStock,
        outOfStock,
      },

      topProducts,

      cancelledOrders,

      totalReturns:
        returns.length,

      recommendations,
    });

  } catch (error) {

    console.error(
      "Decision Support Error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to generate decision support",
    });
  }
};

module.exports = {
  getDecisionSupport,
};