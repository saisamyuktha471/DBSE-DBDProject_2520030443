const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { connectDB, sequelize } = require("./config/database");

// ======================================================
// MODELS
// ======================================================

const User = require("./models/User");
const Product = require("./models/Product");
const Order = require("./models/Order");
const OrderItem = require("./models/OrderItem");
const Return = require("./models/Return");


// ======================================================
// DATABASE RELATIONSHIPS
// ======================================================

// User → Orders
User.hasMany(Order, {
  foreignKey: "userId",
  as: "orders",
});

Order.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});


// Order → Order Items
Order.hasMany(OrderItem, {
  foreignKey: "orderId",
  as: "items",
});

OrderItem.belongsTo(Order, {
  foreignKey: "orderId",
  as: "order",
});


// Product → Order Items
Product.hasMany(OrderItem, {
  foreignKey: "productId",
  as: "orderItems",
});

OrderItem.belongsTo(Product, {
  foreignKey: "productId",
  as: "product",
});


// User → Returns
User.hasMany(Return, {
  foreignKey: "userId",
  as: "returns",
});

Return.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});


// Order → Returns
Order.hasMany(Return, {
  foreignKey: "orderId",
  as: "returns",
});

Return.belongsTo(Order, {
  foreignKey: "orderId",
  as: "order",
});


// ======================================================
// ROUTES
// ======================================================

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const returnRoutes = require("./routes/returnRoutes");

// Admin / Analytics routes
const adminRoutes = require("./routes/adminRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const decisionRoutes = require("./routes/decisionRoutes");


// ======================================================
// CREATE EXPRESS APP
// ======================================================

const app = express();


// ======================================================
// MIDDLEWARE
// ======================================================

app.use(cors());

app.use(express.json());


// ======================================================
// API ROUTES
// ======================================================

// Authentication
app.use("/api/auth", authRoutes);

// Products
app.use("/api/products", productRoutes);

// Orders
app.use("/api/orders", orderRoutes);

// Returns
app.use("/api/returns", returnRoutes);

// Admin
app.use("/api/admin", adminRoutes);

// Analytics
app.use("/api/analytics", analyticsRoutes);

// Decision Support
app.use("/api/decision-support", decisionRoutes);


// ======================================================
// HOME / TEST ROUTE
// ======================================================

app.get("/", (req, res) => {
  res.json({
    message: "RetailHub Backend is running successfully",
  });
});


// ======================================================
// 404 ROUTE
// ======================================================

app.use((req, res) => {
  res.status(404).json({
    message: "API route not found",
  });
});


// ======================================================
// ERROR HANDLER
// ======================================================

app.use((error, req, res, next) => {
  console.error("Server Error:", error);

  res.status(500).json({
    message: "Internal server error",
  });
});


// ======================================================
// SERVER PORT
// ======================================================

const PORT = process.env.PORT || 5000;


// ======================================================
// START SERVER
// ======================================================

const startServer = async () => {
  try {
    // Connect to MySQL
    await connectDB();

    // Create/update database tables
    await sequelize.sync();

    console.log("Database Tables Created Successfully");

    // Start Express server
    app.listen(PORT, () => {
      console.log(
        `Server running on http://localhost:${PORT}`
      );
    });

  } catch (error) {
    console.error("Server Startup Failed:");
    console.error(error.message);
  }
};


// ======================================================
// RUN SERVER
// ======================================================

startServer();