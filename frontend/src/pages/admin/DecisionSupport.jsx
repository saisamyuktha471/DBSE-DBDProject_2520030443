import { useEffect, useState } from "react";
import {
  Lightbulb,
  TrendingUp,
  Package,
  RotateCcw,
  ShoppingBag,
  IndianRupee,
  AlertTriangle,
} from "lucide-react";
import axios from "axios";

function DecisionSupport() {
  const [decisionData, setDecisionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // FETCH DECISION SUPPORT DATA
  // =====================================================

  const fetchDecisionData = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem(
        "retailhubToken"
      );

      if (!token) {
        setError("Admin login required.");
        return;
      }

      const response = await axios.get(
        "http://localhost:5000/api/decision-support",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setDecisionData(response.data);
    } catch (err) {
      console.error(
        "Decision Support Error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to load decision support data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDecisionData();
  }, []);

  // =====================================================
  // GET DATA FROM BACKEND
  // =====================================================

  const orders =
    decisionData?.orders || [];

  const returns =
    decisionData?.returns || [];

  const products =
    decisionData?.products || [];

  const totalRevenue = orders.reduce(
    (sum, order) =>
      sum + Number(order.total || 0),
    0
  );

  const totalOrders =
    orders.length;

  const totalReturns =
    returns.length;

  // =====================================================
  // INVENTORY ANALYSIS
  // =====================================================

  const lowStockProducts =
    products.filter(
      (product) =>
        Number(product.stock) > 0 &&
        Number(product.stock) <= 5
    );

  const outOfStockProducts =
    products.filter(
      (product) =>
        Number(product.stock) === 0
    );

  // =====================================================
  // PRODUCT SALES
  // =====================================================

  const productSales = {};

  orders.forEach((order) => {
    (order.items || []).forEach(
      (item) => {
        const productName =
          item.productName ||
          item.name ||
          "Unknown Product";

        if (!productSales[productName]) {
          productSales[productName] = 0;
        }

        productSales[productName] +=
          Number(item.quantity || 0);
      }
    );
  });

  const topProduct =
    Object.entries(productSales)
      .sort(
        (a, b) => b[1] - a[1]
      )[0];

  // =====================================================
  // RETURN RATE
  // =====================================================

  const returnRate =
    totalOrders > 0
      ? (
          (totalReturns /
            totalOrders) *
          100
        ).toFixed(1)
      : 0;

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="standard-page">

        <div className="admin-empty">

          <Lightbulb size={40} />

          <h3>
            Loading decision support...
          </h3>

          <p>
            Please wait while business
            information is analyzed.
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
            Unable to load decision support
          </h3>

          <p>
            {error}
          </p>

          <button
            className="primary-button"
            onClick={fetchDecisionData}
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
    <div className="standard-page">

      {/* HEADER */}

      <div className="page-header">

        <div>

          <div className="eyebrow">
            BUSINESS INTELLIGENCE
          </div>

          <h1>
            Decision Support
          </h1>

          <p>
            Use customer, sales, inventory, and
            return data to support better
            business decisions.
          </p>

        </div>

      </div>


      {/* KPI CARDS */}

      <div className="admin-stats-grid">

        {/* REVENUE */}

        <div className="admin-stat-card">

          <div className="admin-stat-icon blue">

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

          </div>

        </div>


        {/* ORDERS */}

        <div className="admin-stat-card">

          <div className="admin-stat-icon purple">

            <ShoppingBag size={22} />

          </div>

          <div>

            <span>
              Total Orders
            </span>

            <strong>
              {totalOrders}
            </strong>

          </div>

        </div>


        {/* RETURNS */}

        <div className="admin-stat-card">

          <div className="admin-stat-icon orange">

            <RotateCcw size={22} />

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


        {/* STOCK ALERTS */}

        <div className="admin-stat-card">

          <div className="admin-stat-icon red">

            <AlertTriangle size={22} />

          </div>

          <div>

            <span>
              Stock Alerts
            </span>

            <strong>
              {lowStockProducts.length +
                outOfStockProducts.length}
            </strong>

          </div>

        </div>

      </div>


      {/* BUSINESS INSIGHTS */}

      <div className="admin-panel">

        <div className="admin-panel-header">

          <div>

            <h2>
              Business Insights
            </h2>

            <p>
              Automatically generated
              observations from current
              business data.
            </p>

          </div>

        </div>


        <div className="admin-mini-grid">

          {/* SALES INSIGHT */}

          <div className="admin-mini-card">

            <div className="admin-mini-icon blue">

              <TrendingUp size={22} />

            </div>

            <div>

              <h3>
                Sales Performance
              </h3>

              {totalOrders === 0 ? (

                <p>
                  No customer orders are
                  available yet. Complete some
                  customer purchases to generate
                  sales insights.
                </p>

              ) : (

                <p>

                  The system has recorded{" "}

                  <strong>
                    {totalOrders}
                  </strong>{" "}

                  orders with total revenue of{" "}

                  <strong>
                    ₹
                    {totalRevenue.toLocaleString(
                      "en-IN"
                    )}
                  </strong>.

                </p>

              )}

            </div>

          </div>


          {/* TOP PRODUCT */}

          <div className="admin-mini-card">

            <div className="admin-mini-icon purple">

              <Package size={22} />

            </div>

            <div>

              <h3>
                Product Performance
              </h3>

              {topProduct ? (

                <p>

                  <strong>
                    {topProduct[0]}
                  </strong>{" "}

                  is currently the
                  highest-selling product
                  with{" "}

                  <strong>
                    {topProduct[1]}
                  </strong>{" "}

                  units sold.

                </p>

              ) : (

                <p>
                  Product performance will
                  appear after customers place
                  orders.
                </p>

              )}

            </div>

          </div>


          {/* INVENTORY */}

          <div className="admin-mini-card">

            <div className="admin-mini-icon orange">

              <AlertTriangle size={22} />

            </div>

            <div>

              <h3>
                Inventory Recommendation
              </h3>

              {outOfStockProducts.length >
              0 ? (

                <p>

                  There are{" "}

                  <strong>
                    {outOfStockProducts.length}
                  </strong>{" "}

                  out-of-stock products.
                  Restocking should be
                  considered for continued
                  availability.

                </p>

              ) : lowStockProducts.length >
                0 ? (

                <p>

                  There are{" "}

                  <strong>
                    {lowStockProducts.length}
                  </strong>{" "}

                  products with low stock.
                  Inventory levels should be
                  monitored.

                </p>

              ) : (

                <p>
                  No immediate low-stock or
                  out-of-stock alert is available.
                </p>

              )}

            </div>

          </div>


          {/* RETURNS */}

          <div className="admin-mini-card">

            <div className="admin-mini-icon red">

              <RotateCcw size={22} />

            </div>

            <div>

              <h3>
                Return Analysis
              </h3>

              {totalReturns > 0 ? (

                <p>

                  The system has recorded{" "}

                  <strong>
                    {totalReturns}
                  </strong>{" "}

                  return requests. The business
                  can review return reasons to
                  identify products or processes
                  that need improvement.

                </p>

              ) : (

                <p>
                  No return requests have been
                  recorded yet.
                </p>

              )}

            </div>

          </div>

        </div>

      </div>


      {/* DECISION RECOMMENDATIONS */}

      <div className="admin-panel">

        <div className="admin-panel-header">

          <div>

            <h2>

              <Lightbulb size={20} />

              Recommended Business Actions

            </h2>

            <p>
              Simple recommendations based on
              the available customer and
              business data.
            </p>

          </div>

        </div>


        <div className="admin-business-summary">

          {/* INVENTORY */}

          <div className="business-summary-content">

            <div className="business-summary-icon">

              <Package size={22} />

            </div>

            <div>

              <h3>
                Monitor Inventory
              </h3>

              <p>
                Track low-stock products
                regularly and consider
                replenishment before popular
                products become unavailable.
              </p>

            </div>

          </div>


          {/* PRODUCT DEMAND */}

          <div className="business-summary-content">

            <div className="business-summary-icon">

              <TrendingUp size={22} />

            </div>

            <div>

              <h3>
                Track Product Demand
              </h3>

              <p>
                Use sales information to
                understand which products
                customers purchase most
                frequently and plan stock
                accordingly.
              </p>

            </div>

          </div>


          {/* RETURNS */}

          <div className="business-summary-content">

            <div className="business-summary-icon">

              <RotateCcw size={22} />

            </div>

            <div>

              <h3>
                Analyze Returns
              </h3>

              <p>
                Review return patterns and
                reasons to identify products or
                order processes that may require
                improvement.
              </p>

            </div>

          </div>

        </div>

      </div>


      {/* BUSINESS FLOW */}

      <div className="admin-panel">

        <div className="admin-panel-header">

          <div>

            <h2>
              Business Decision Flow
            </h2>

            <p>
              Customer activity is converted
              into useful business information.
            </p>

          </div>

        </div>


        <div className="business-summary-actions">

          <span>
            Customer Activity
          </span>

          <span>
            →
          </span>

          <span>
            Orders & Sales Data
          </span>

          <span>
            →
          </span>

          <span>
            Analytics
          </span>

          <span>
            →
          </span>

          <span>
            Business Insights
          </span>

          <span>
            →
          </span>

          <span>
            Business Decisions
          </span>

        </div>

      </div>

    </div>
  );
}

export default DecisionSupport;