import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  IndianRupee,
  ShoppingBag,
  RotateCcw,
  TrendingUp,
} from "lucide-react";

import axios from "axios";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

import {
  Bar,
  Line,
  Doughnut,
} from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler
);

function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // FETCH ANALYTICS FROM BACKEND
  // =====================================================

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError("");

      const token =
        localStorage.getItem("retailhubToken");

      if (!token) {
        setError("Admin login required.");
        return;
      }

      const response = await axios.get(
        "http://localhost:5000/api/analytics",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAnalytics(response.data);

    } catch (err) {
      console.error(
        "Fetch Analytics Error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to load analytics data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  // =====================================================
  // DATA FROM BACKEND
  // =====================================================

  const summary =
    analytics?.summary || {};

  const orders =
    analytics?.orders || [];

  const productSales =
    analytics?.productSales || [];

  const categorySales =
    analytics?.categorySales || [];

  const totalRevenue =
    Number(summary.totalRevenue || 0);

  const totalOrders =
    Number(summary.totalOrders || 0);

  const totalReturns =
    Number(summary.totalReturns || 0);

  const averageOrderValue =
    totalOrders > 0
      ? Math.round(
          totalRevenue / totalOrders
        )
      : 0;

  // =====================================================
  // COLOUR PALETTE
  // =====================================================

  const chartColors = [
    "#2563EB",
    "#16A34A",
    "#F97316",
    "#8B5CF6",
    "#E11D48",
    "#0891B2",
    "#CA8A04",
    "#4F46E5",
  ];

  // =====================================================
  // PRODUCT PERFORMANCE
  // =====================================================

  const productChartData = useMemo(() => {
    const names =
      productSales.map(
        (item) =>
          item.productName ||
          "Unknown Product"
      );

    const quantities =
      productSales.map(
        (item) =>
          Number(item.quantity || 0)
      );

    return {
      labels:
        names.length > 0
          ? names
          : ["No sales yet"],

      datasets: [
        {
          label: "Units Sold",

          data:
            quantities.length > 0
              ? quantities
              : [0],

          backgroundColor:
            quantities.length > 0
              ? chartColors.slice(
                  0,
                  quantities.length
                )
              : "#CBD5E1",

          borderColor:
            quantities.length > 0
              ? chartColors.slice(
                  0,
                  quantities.length
                )
              : "#94A3B8",

          borderWidth: 1,

          borderRadius: 6,
        },
      ],
    };
  }, [productSales]);

  // =====================================================
  // CATEGORY SALES
  // =====================================================

  const categoryChartData =
    useMemo(() => {
      const labels =
        categorySales.map(
          (item) =>
            item.category ||
            "Other"
        );

      const values =
        categorySales.map(
          (item) =>
            Number(
              item.revenue || 0
            )
        );

      return {
        labels:
          labels.length > 0
            ? labels
            : ["No data"],

        datasets: [
          {
            label: "Category Sales",

            data:
              values.length > 0
                ? values
                : [1],

            backgroundColor:
              values.length > 0
                ? chartColors.slice(
                    0,
                    values.length
                  )
                : ["#CBD5E1"],

            borderColor: "#FFFFFF",

            borderWidth: 2,
          },
        ],
      };
    }, [categorySales]);

  // =====================================================
  // ORDER STATUS
  // =====================================================

  const orderStatusData =
    useMemo(() => {
      const data = {};

      orders.forEach((order) => {
        const status =
          order.status ||
          "Order Placed";

        if (!data[status]) {
          data[status] = 0;
        }

        data[status]++;
      });

      return data;
    }, [orders]);

  const statusColors = {
    "Order Placed": "#2563EB",
    Processing: "#F97316",
    Shipped: "#8B5CF6",
    Delivered: "#16A34A",
    Cancelled: "#DC2626",
  };

  const statusChartData = {
    labels:
      Object.keys(
        orderStatusData
      ).length > 0
        ? Object.keys(
            orderStatusData
          )
        : ["No orders"],

    datasets: [
      {
        data:
          Object.values(
            orderStatusData
          ).length > 0
            ? Object.values(
                orderStatusData
              )
            : [1],

        backgroundColor:
          Object.keys(
            orderStatusData
          ).length > 0
            ? Object.keys(
                orderStatusData
              ).map(
                (status) =>
                  statusColors[
                    status
                  ] ||
                  "#64748B"
              )
            : ["#CBD5E1"],

        borderColor: "#FFFFFF",

        borderWidth: 2,
      },
    ],
  };

  // =====================================================
  // REVENUE TREND
  // =====================================================

  const revenueByDate = {};

  orders.forEach((order) => {
    const date = order.createdAt
      ? new Date(
          order.createdAt
        ).toLocaleDateString(
          "en-IN",
          {
            day: "2-digit",
            month: "short",
          }
        )
      : "Unknown";

    if (!revenueByDate[date]) {
      revenueByDate[date] = 0;
    }

    if (
      order.status !==
      "Cancelled"
    ) {
      revenueByDate[date] +=
        Number(order.total || 0);
    }
  });

  const revenueLabels =
    Object.keys(revenueByDate);

  const revenueValues =
    Object.values(revenueByDate);

  const revenueChartData = {
    labels:
      revenueLabels.length > 0
        ? revenueLabels
        : ["No orders"],

    datasets: [
      {
        label: "Revenue",

        data:
          revenueValues.length > 0
            ? revenueValues
            : [0],

        borderColor: "#2563EB",

        backgroundColor:
          "rgba(37, 99, 235, 0.12)",

        pointBackgroundColor:
          "#2563EB",

        pointBorderColor:
          "#FFFFFF",

        pointBorderWidth: 2,

        pointRadius: 5,

        borderWidth: 3,

        tension: 0.3,

        fill: true,
      },
    ],
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="standard-page">

        <div className="admin-empty">

          <TrendingUp size={40} />

          <h3>
            Loading analytics...
          </h3>

          <p>
            Please wait while business
            analytics are loaded.
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

          <BarChart3 size={40} />

          <h3>
            Unable to load analytics
          </h3>

          <p>
            {error}
          </p>

          <button
            className="primary-button"
            onClick={fetchAnalytics}
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

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="standard-page">

      {/* HEADER */}

      <div className="page-header">

        <div>

          <span className="eyebrow">
            BUSINESS INTELLIGENCE
          </span>

          <h1>
            Analytics
          </h1>

          <p>
            Analyze sales, revenue, orders
            and customer purchasing activity.
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

            <small>
              Revenue from orders
            </small>

          </div>

        </div>


        {/* ORDERS */}

        <div className="admin-stat-card">

          <div className="admin-stat-icon green">
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
              Customer purchases
            </small>

          </div>

        </div>


        {/* AVERAGE ORDER VALUE */}

        <div className="admin-stat-card">

          <div className="admin-stat-icon orange">
            <TrendingUp size={22} />
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

            <small>
              Average spending per order
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
              Total Returns
            </span>

            <strong>
              {totalReturns}
            </strong>

            <small>
              Customer return requests
            </small>

          </div>

        </div>

      </div>


      {/* REVENUE TREND */}

      <div className="admin-panel analytics-chart-panel">

        <div className="admin-panel-header">

          <div>

            <h2>
              Revenue Trend
            </h2>

            <p>
              Revenue generated from
              customer orders.
            </p>

          </div>

        </div>

        <div className="analytics-chart">

          <Line
            data={revenueChartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,

              plugins: {
                legend: {
                  display: true,
                },

                tooltip: {
                  callbacks: {
                    label: (context) =>
                      ` Revenue: ₹${Number(
                        context.raw
                      ).toLocaleString(
                        "en-IN"
                      )}`,
                  },
                },
              },

              scales: {
                y: {
                  beginAtZero: true,

                  ticks: {
                    callback: (value) =>
                      `₹${Number(
                        value
                      ).toLocaleString(
                        "en-IN"
                      )}`,
                  },
                },
              },
            }}
          />

        </div>

      </div>


      {/* TWO CHARTS */}

      <div className="admin-dashboard-grid">

        {/* PRODUCT PERFORMANCE */}

        <div className="admin-panel">

          <div className="admin-panel-header">

            <div>

              <h2>
                Product Performance
              </h2>

              <p>
                Units sold for each product.
              </p>

            </div>

          </div>

          <div className="analytics-chart">

            <Bar
              data={productChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,

                plugins: {
                  legend: {
                    display: true,
                  },

                  tooltip: {
                    callbacks: {
                      label: (context) =>
                        ` Units Sold: ${context.raw}`,
                    },
                  },
                },

                scales: {
                  y: {
                    beginAtZero: true,

                    ticks: {
                      precision: 0,
                    },
                  },
                },
              }}
            />

          </div>

        </div>


        {/* CATEGORY SALES */}

        <div className="admin-panel">

          <div className="admin-panel-header">

            <div>

              <h2>
                Category Sales
              </h2>

              <p>
                Sales distribution by category.
              </p>

            </div>

          </div>

          <div className="analytics-chart">

            <Doughnut
              data={categoryChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,

                plugins: {
                  legend: {
                    position: "top",
                  },

                  tooltip: {
                    callbacks: {
                      label: (context) =>
                        ` ${context.label}: ₹${Number(
                          context.raw
                        ).toLocaleString(
                          "en-IN"
                        )}`,
                    },
                  },
                },

                cutout: "55%",
              }}
            />

          </div>

        </div>

      </div>


      {/* ORDER STATUS */}

      <div className="admin-panel analytics-status-panel">

        <div className="admin-panel-header">

          <div>

            <h2>
              Order Status Analysis
            </h2>

            <p>
              Current distribution of
              customer orders.
            </p>

          </div>

          <BarChart3 size={22} />

        </div>

        <div className="analytics-chart analytics-status-chart">

          <Doughnut
            data={statusChartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,

              plugins: {
                legend: {
                  position: "top",
                },

                tooltip: {
                  callbacks: {
                    label: (context) =>
                      ` ${context.label}: ${context.raw} order(s)`,
                  },
                },
              },

              cutout: "55%",
            }}
          />

        </div>

      </div>


      {/* BUSINESS INSIGHT */}

      <div className="admin-business-summary">

        <div className="business-summary-content">

          <div className="business-summary-icon">

            <TrendingUp size={24} />

          </div>

          <div>

            <span className="eyebrow">
              BUSINESS ANALYTICS
            </span>

            <h2>
              Customer activity is converted
              into useful business information
            </h2>

            <p>
              The analytics dashboard combines
              order, revenue, product and return
              information generated by customers.
              These results help the business
              understand sales performance,
              product demand and customer
              purchasing patterns.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Analytics;