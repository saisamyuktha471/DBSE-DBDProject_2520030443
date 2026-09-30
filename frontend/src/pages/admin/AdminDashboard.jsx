import { useEffect, useState } from "react";
import {
  ShoppingBag,
  Users,
  IndianRupee,
  RotateCcw,
  Package,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";

function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [returns, setReturns] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // FETCH DASHBOARD DATA
  // =====================================================

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const token =
        localStorage.getItem("retailhubToken");

      if (!token) {
        setError("Admin login required.");
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const [
        ordersResponse,
        returnsResponse,
        productsResponse,
        customersResponse,
      ] = await Promise.all([
        axios.get(
          "http://localhost:5000/api/orders/admin/all",
          config
        ),

        axios.get(
          "http://localhost:5000/api/admin/returns",
          config
        ),

        axios.get(
          "http://localhost:5000/api/products",
          config
        ),

        axios.get(
          "http://localhost:5000/api/admin/customers",
          config
        ),
      ]);

      setOrders(
        ordersResponse.data.orders || []
      );

      setReturns(
        returnsResponse.data.returns || []
      );

      setProducts(
        productsResponse.data.products || []
      );

      setCustomers(
        customersResponse.data.customers || []
      );

    } catch (err) {
      console.error(
        "Dashboard Data Error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to load dashboard data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // =====================================================
  // BUSINESS CALCULATIONS
  // =====================================================

  const totalOrders =
    orders.length;

  const totalRevenue =
    orders.reduce(
      (sum, order) =>
        sum +
        Number(order.total || 0),
      0
    );

  const totalCustomers =
    customers.length;

  const pendingOrders =
    orders.filter(
      (order) =>
        order.status === "Order Placed" ||
        order.status === "Processing"
    ).length;

  const deliveredOrders =
    orders.filter(
      (order) =>
        order.status === "Delivered"
    ).length;

  const returnedOrders =
    returns.length;

  const averageOrderValue =
    totalOrders > 0
      ? Math.round(
          totalRevenue / totalOrders
        )
      : 0;

  // =====================================================
  // RECENT ORDERS
  // =====================================================

  const recentOrders = [
    ...orders,
  ]
    .sort(
      (a, b) =>
        new Date(b.createdAt || 0) -
        new Date(a.createdAt || 0)
    )
    .slice(0, 5);

  // =====================================================
  // INVENTORY DATA
  // =====================================================

  const lowStockProducts =
    products
      .filter(
        (product) =>
          Number(product.stock || 0) <= 10
      )
      .sort(
        (a, b) =>
          Number(a.stock || 0) -
          Number(b.stock || 0)
      )
      .slice(0, 5);

  // =====================================================
  // RETURN RATE
  // =====================================================

  const returnRate =
    totalOrders > 0
      ? (
          (returnedOrders /
            totalOrders) *
          100
        ).toFixed(1)
      : "0.0";

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="standard-page">

        <div className="admin-empty">

          <TrendingUp size={40} />

          <h3>
            Loading dashboard...
          </h3>

          <p>
            Please wait while business
            information is loaded.
          </p>

        </div>

      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <div className="standard-page">

        <div className="admin-empty">

          <AlertTriangle size={40} />

          <h3>
            Unable to load dashboard
          </h3>

          <p>
            {error}
          </p>

          <button
            className="primary-button"
            onClick={fetchDashboardData}
            style={{
              marginTop: "15px",
            }}
          >
            Try Again
          </button>

        </div>

      </div>
    );
  }

  return (
    <div className="standard-page admin-dashboard-page">

      {/* =========================================
          PAGE HEADER
      ========================================= */}

      <div className="page-header">

        <div>

          <span className="eyebrow">
            BUSINESS MANAGEMENT
          </span>

          <h1>
            Admin Dashboard
          </h1>

          <p>
            Monitor customer activity, orders,
            revenue, returns and overall retail
            business performance.
          </p>

        </div>

      </div>


      {/* =========================================
          MAIN BUSINESS NAVIGATION
      ========================================= */}

      <section className="admin-panel">

        <div className="admin-panel-header">

          <div>

            <h2>
              Business Management
            </h2>

            <p>
              Manage and analyze your retail
              business operations.
            </p>

          </div>

        </div>


        <div className="business-summary-actions">

          <Link
            to="/admin/orders"
            className="btn btn-secondary"
          >
            Orders
          </Link>

          <Link
            to="/admin/products"
            className="btn btn-secondary"
          >
            Products
          </Link>

          <Link
            to="/admin/inventory"
            className="btn btn-secondary"
          >
            Inventory
          </Link>

          <Link
            to="/admin/customers"
            className="btn btn-secondary"
          >
            Customers
          </Link>

          <Link
            to="/admin/returns"
            className="btn btn-secondary"
          >
            Returns
          </Link>

          <Link
            to="/admin/analytics"
            className="btn btn-primary"
          >
            Analytics
          </Link>

          <Link
            to="/admin/decision-support"
            className="btn btn-primary"
          >
            Decision Support
          </Link>

        </div>

      </section>


      {/* =========================================
          OVERVIEW CARDS
      ========================================= */}

      <section className="admin-stats-grid">

        {/* TOTAL ORDERS */}

        <div className="admin-stat-card">

          <div className="admin-stat-icon blue">

            <ShoppingBag size={22} />

          </div>

          <div>

            <span>
              Total Orders
            </span>

            <strong>
              {totalOrders}
            </strong>

            <small>
              Customer orders
            </small>

          </div>

        </div>


        {/* TOTAL REVENUE */}

        <div className="admin-stat-card">

          <div className="admin-stat-icon green">

            <IndianRupee size={22} />

          </div>

          <div>

            <span>
              Total Revenue
            </span>

            <strong>
              ₹
              {totalRevenue.toLocaleString(
                "en-IN"
              )}
            </strong>

            <small>
              From customer orders
            </small>

          </div>

        </div>


        {/* CUSTOMERS */}

        <div className="admin-stat-card">

          <div className="admin-stat-icon orange">

            <Users size={22} />

          </div>

          <div>

            <span>
              Customers
            </span>

            <strong>
              {totalCustomers}
            </strong>

            <small>
              Registered customers
            </small>

          </div>

        </div>


        {/* RETURNS */}

        <div className="admin-stat-card">

          <div className="admin-stat-icon red">

            <RotateCcw size={22} />

          </div>

          <div>

            <span>
              Returns
            </span>

            <strong>
              {returnedOrders}
            </strong>

            <small>
              Return requests
            </small>

          </div>

        </div>

      </section>


      {/* =========================================
          SECONDARY BUSINESS METRICS
      ========================================= */}

      <section className="admin-mini-grid">

        {/* PENDING ORDERS */}

        <div className="admin-mini-card">

          <div className="admin-mini-icon">

            <Package size={20} />

          </div>

          <div>

            <span>
              Pending Orders
            </span>

            <strong>
              {pendingOrders}
            </strong>

          </div>

        </div>


        {/* DELIVERED ORDERS */}

        <div className="admin-mini-card">

          <div className="admin-mini-icon">

            <TrendingUp size={20} />

          </div>

          <div>

            <span>
              Delivered Orders
            </span>

            <strong>
              {deliveredOrders}
            </strong>

          </div>

        </div>


        {/* AVERAGE ORDER VALUE */}

        <div className="admin-mini-card">

          <div className="admin-mini-icon">

            <IndianRupee size={20} />

          </div>

          <div>

            <span>
              Average Order Value
            </span>

            <strong>
              ₹
              {averageOrderValue.toLocaleString(
                "en-IN"
              )}
            </strong>

          </div>

        </div>

      </section>


      {/* =========================================
          RECENT ORDERS + INVENTORY
      ========================================= */}

      <section className="admin-dashboard-grid">

        {/* =====================================
            RECENT ORDERS
        ===================================== */}

        <div className="admin-panel">

          <div className="admin-panel-header">

            <div>

              <h2>
                Recent Orders
              </h2>

              <p>
                Latest customer purchases
              </p>

            </div>

            <Link
              to="/admin/orders"
              className="admin-panel-link"
            >
              View All
              <ArrowRight size={16} />
            </Link>

          </div>


          {recentOrders.length === 0 ? (

            <div className="admin-empty">

              <ShoppingBag size={35} />

              <h3>
                No orders yet
              </h3>

              <p>
                Customer orders will appear here
                after checkout.
              </p>

            </div>

          ) : (

            <div className="admin-orders-list">

              {recentOrders.map(
                (order) => (

                  <div
                    className="admin-order-row"
                    key={order.id}
                  >

                    <div className="admin-order-main">

                      <div className="admin-order-icon">

                        <ShoppingBag
                          size={18}
                        />

                      </div>

                      <div>

                        <strong>
                          #
                          {order.orderNumber ||
                            order.id}
                        </strong>

                        <span>
                          {order.user?.name ||
                            "Customer"}
                        </span>

                      </div>

                    </div>


                    <div className="admin-order-info">

                      <span>
                        {order.createdAt
                          ? new Date(
                              order.createdAt
                            ).toLocaleDateString(
                              "en-IN"
                            )
                          : "Recent"}
                      </span>

                      <strong>
                        ₹
                        {Number(
                          order.total || 0
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </strong>

                    </div>


                    <span
                      className={`admin-status ${String(
                        order.status ||
                          "Order Placed"
                      )
                        .toLowerCase()
                        .replaceAll(
                          " ",
                          "-"
                        )}`}
                    >
                      {order.status ||
                        "Order Placed"}
                    </span>

                  </div>

                )
              )}

            </div>

          )}

        </div>


        {/* =====================================
            INVENTORY ALERTS
        ===================================== */}

        <div className="admin-panel">

          <div className="admin-panel-header">

            <div>

              <h2>
                Inventory Alerts
              </h2>

              <p>
                Products requiring attention
              </p>

            </div>

            <Link
              to="/admin/inventory"
              className="admin-panel-link"
            >
              Inventory
              <ArrowRight size={16} />
            </Link>

          </div>


          {lowStockProducts.length === 0 ? (

            <div className="admin-empty">

              <Package size={35} />

              <h3>
                Inventory is healthy
              </h3>

              <p>
                No low-stock products need
                attention.
              </p>

            </div>

          ) : (

            <div className="inventory-alert-list">

              {lowStockProducts.map(
                (product) => (

                  <div
                    className="inventory-alert-row"
                    key={product.id}
                  >

                    <div className="inventory-product-icon">

                      <Package size={18} />

                    </div>

                    <div className="inventory-product-info">

                      <strong>
                        {product.name}
                      </strong>

                      <span>
                        {Number(
                          product.stock
                        ) === 0
                          ? "Out of stock"
                          : `Only ${product.stock} units remaining`}
                      </span>

                    </div>

                    <AlertTriangle
                      size={20}
                      className="inventory-warning"
                    />

                  </div>

                )
              )}

            </div>

          )}

        </div>

      </section>


      {/* =========================================
          BUSINESS PERFORMANCE SUMMARY
      ========================================= */}

      <section className="admin-business-summary">

        <div className="business-summary-content">

          <div className="business-summary-icon">

            <TrendingUp size={25} />

          </div>

          <div>

            <span className="eyebrow">
              BUSINESS OVERVIEW
            </span>

            <h2>
              Customer activity is driving
              your business data
            </h2>

            <p>
              Every product search, cart
              activity, checkout, order, return
              and reward interaction can be used
              to understand customer behaviour
              and support better business
              decisions.
            </p>

          </div>

        </div>


        <div className="business-summary-actions">

          <Link
            to="/admin/analytics"
            className="btn btn-primary"
          >
            View Analytics
            <ArrowRight size={17} />
          </Link>

          <Link
            to="/admin/decision-support"
            className="btn btn-secondary"
          >
            Decision Support
          </Link>

        </div>

      </section>


      {/* =========================================
          BUSINESS METRICS SUMMARY
      ========================================= */}

      <section className="admin-panel">

        <div className="admin-panel-header">

          <div>

            <h2>
              Business Performance Summary
            </h2>

            <p>
              Current indicators from customer
              activity.
            </p>

          </div>

        </div>


        <div className="admin-mini-grid">

          {/* ORDER COMPLETION */}

          <div className="admin-mini-card">

            <div className="admin-mini-icon">

              <ShoppingBag size={20} />

            </div>

            <div>

              <span>
                Order Completion
              </span>

              <strong>
                {totalOrders > 0
                  ? `${Math.round(
                      (deliveredOrders /
                        totalOrders) *
                        100
                    )}%`
                  : "0%"}
              </strong>

            </div>

          </div>


          {/* RETURN RATE */}

          <div className="admin-mini-card">

            <div className="admin-mini-icon">

              <RotateCcw size={20} />

            </div>

            <div>

              <span>
                Return Rate
              </span>

              <strong>
                {returnRate}%
              </strong>

            </div>

          </div>


          {/* CUSTOMER BASE */}

          <div className="admin-mini-card">

            <div className="admin-mini-icon">

              <Users size={20} />

            </div>

            <div>

              <span>
                Customer Base
              </span>

              <strong>
                {totalCustomers}
              </strong>

            </div>

          </div>

        </div>

      </section>

    </div>
  );
}

export default AdminDashboard;