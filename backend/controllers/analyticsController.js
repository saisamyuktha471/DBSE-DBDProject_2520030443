const Order = require("../models/Order");
const OrderItem = require("../models/OrderItem");
const Product = require("../models/Product");
const Return = require("../models/Return");

const getAnalytics = async (req, res) => {
  try {

    // ==========================================
    // GET ORDERS
    // ==========================================

    const orders = await Order.findAll({
      attributes: [
        "id",
        "orderNumber",
        "subtotal",
        "delivery",
        "total",
        "status",
        "paymentMethod",
        "address",
        "createdAt",
      ],

      include: [
        {
          model: OrderItem,
          as: "items",

          attributes: [
            "id",
            "productId",
            "productName",
            "price",
            "quantity",
            "subtotal",
          ],

          include: [
            {
              model: Product,
              as: "product",

              attributes: [
                "id",
                "name",
                "category",
              ],
            },
          ],
        },
      ],

      order: [
        ["createdAt", "ASC"],
      ],
    });

    // ==========================================
    // BASIC ORDER CALCULATIONS
    // ==========================================

    const totalOrders =
      orders.length;

    const totalRevenue =
      orders
        .filter(
          (order) =>
            order.status !==
            "Cancelled"
        )
        .reduce(
          (sum, order) =>
            sum +
            Number(order.total || 0),
          0
        );

    const deliveredOrders =
      orders.filter(
        (order) =>
          order.status ===
          "Delivered"
      ).length;

    const cancelledOrders =
      orders.filter(
        (order) =>
          order.status ===
          "Cancelled"
      ).length;

    const activeOrders =
      orders.filter(
        (order) =>
          ![
            "Delivered",
            "Cancelled",
          ].includes(order.status)
      ).length;

    // ==========================================
    // PRODUCT SALES
    // ==========================================

    const productSales = {};

    // ==========================================
    // CATEGORY SALES
    // ==========================================

    const categorySales = {};

    orders.forEach((order) => {

      order.items?.forEach((item) => {

        const quantity =
          Number(
            item.quantity || 0
          );

        const revenue =
          Number(
            item.subtotal || 0
          );

        // ------------------------------
        // PRODUCT
        // ------------------------------

        const productName =
          item.productName ||
          item.product?.name ||
          "Unknown Product";

        if (
          !productSales[
            productName
          ]
        ) {
          productSales[
            productName
          ] = {
            productName,
            quantity: 0,
            revenue: 0,
          };
        }

        productSales[
          productName
        ].quantity += quantity;

        productSales[
          productName
        ].revenue += revenue;


        // ------------------------------
        // CATEGORY
        // ------------------------------

        const category =
          item.product?.category ||
          "Other";

        if (
          !categorySales[
            category
          ]
        ) {
          categorySales[
            category
          ] = {
            category,
            quantity: 0,
            revenue: 0,
          };
        }

        categorySales[
          category
        ].quantity += quantity;

        categorySales[
          category
        ].revenue += revenue;

      });

    });

    // ==========================================
    // RESPONSE
    // ==========================================
    const totalReturns = await Return.count();

    res.json({

      summary: {
        totalOrders,
        totalRevenue,
        deliveredOrders,
        cancelledOrders,
        activeOrders,
        totalReturns,
      },

      productSales:
        Object.values(
          productSales
        ),

      categorySales:
        Object.values(
          categorySales
        ),

      orders,

    });

  } catch (error) {

    console.error(
      "Analytics Error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to generate analytics",
    });
  }
};

module.exports = {
  getAnalytics,
};