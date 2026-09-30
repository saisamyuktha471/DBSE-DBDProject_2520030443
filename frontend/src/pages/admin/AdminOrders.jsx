import { useEffect, useState } from "react";
import {
  ShoppingBag,
  Search,
  Eye,
  PackageCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ======================================================
  // FETCH ALL ORDERS FROM BACKEND
  // ======================================================

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("retailhubToken");

      if (!token) {
        setError("Admin login required.");
        setLoading(false);
        return;
      }

      const response = await axios.get(
        "http://localhost:5000/api/orders/admin/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrders(response.data.orders || []);
    } catch (err) {
      console.error("Fetch Admin Orders Error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load orders."
      );
    } finally {
      setLoading(false);
    }
  };


  // ======================================================
  // LOAD ORDERS WHEN PAGE OPENS
  // ======================================================

  useEffect(() => {
    fetchOrders();
  }, []);


  // ======================================================
  // UPDATE ORDER STATUS
  // ======================================================

  const updateStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("retailhubToken");

      if (!token) {
        alert("Admin login required.");
        return;
      }

      await axios.put(
        `http://localhost:5000/api/orders/admin/${orderId}/status`,
        {
          status: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update UI immediately
      setOrders((previousOrders) =>
        previousOrders.map((order) =>
          order.id === orderId
            ? {
                ...order,
                status: newStatus,
              }
            : order
        )
      );

    } catch (err) {
      console.error("Update Order Status Error:", err);

      alert(
        err.response?.data?.message ||
          "Failed to update order status."
      );
    }
  };


  // ======================================================
  // SEARCH + FILTER
  // ======================================================

  const filteredOrders = orders.filter((order) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      String(order.id || "")
        .toLowerCase()
        .includes(searchText) ||

      String(order.orderNumber || "")
        .toLowerCase()
        .includes(searchText) ||

      String(order.user?.name || "")
        .toLowerCase()
        .includes(searchText) ||

      String(order.user?.email || "")
        .toLowerCase()
        .includes(searchText);

    const matchesFilter =
      filter === "All" ||
      order.status === filter;

    return matchesSearch && matchesFilter;
  });


  // ======================================================
  // SUMMARY COUNTS
  // ======================================================

  const processingOrders = orders.filter(
    (order) => order.status === "Processing"
  ).length;

  const deliveredOrders = orders.filter(
    (order) => order.status === "Delivered"
  ).length;


  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {
    return (
      <div className="standard-page">

        <div className="page-header">
          <div>
            <span className="eyebrow">
              BUSINESS MANAGEMENT
            </span>

            <h1>Orders</h1>

            <p>
              View and manage customer orders from one place.
            </p>
          </div>
        </div>

        <div className="admin-panel">
          <div className="admin-empty">

            <ShoppingBag size={40} />

            <h3>Loading orders...</h3>

            <p>
              Fetching orders from the database.
            </p>

          </div>
        </div>

      </div>
    );
  }


  // ======================================================
  // ERROR
  // ======================================================

  if (error) {
    return (
      <div className="standard-page">

        <div className="page-header">
          <div>
            <span className="eyebrow">
              BUSINESS MANAGEMENT
            </span>

            <h1>Orders</h1>

            <p>
              View and manage customer orders from one place.
            </p>
          </div>
        </div>

        <div className="admin-panel">
          <div className="admin-empty">

            <ShoppingBag size={40} />

            <h3>Unable to load orders</h3>

            <p>{error}</p>

            <button
              className="btn btn-primary"
              onClick={fetchOrders}
            >
              Try Again
            </button>

          </div>
        </div>

      </div>
    );
  }


  // ======================================================
  // PAGE
  // ======================================================

  return (
    <div className="standard-page">

      {/* HEADER */}

      <div className="page-header">

        <div>

          <span className="eyebrow">
            BUSINESS MANAGEMENT
          </span>

          <h1>Orders</h1>

          <p>
            View and manage customer orders from one place.
          </p>

        </div>

      </div>


      {/* SUMMARY */}

      <div className="admin-stats-grid">

        {/* TOTAL ORDERS */}

        <div className="admin-stat-card">

          <div className="admin-stat-icon blue">
            <ShoppingBag size={22} />
          </div>

          <div>

            <span>Total Orders</span>

            <strong>
              {orders.length}
            </strong>

            <small>
              All customer orders
            </small>

          </div>

        </div>


        {/* PROCESSING */}

        <div className="admin-stat-card">

          <div className="admin-stat-icon orange">
            <PackageCheck size={22} />
          </div>

          <div>

            <span>Processing</span>

            <strong>
              {processingOrders}
            </strong>

            <small>
              Orders being processed
            </small>

          </div>

        </div>


        {/* DELIVERED */}

        <div className="admin-stat-card">

          <div className="admin-stat-icon green">
            <PackageCheck size={22} />
          </div>

          <div>

            <span>Delivered</span>

            <strong>
              {deliveredOrders}
            </strong>

            <small>
              Completed orders
            </small>

          </div>

        </div>

      </div>


      {/* SEARCH + FILTER */}

      <div className="products-toolbar">

        {/* SEARCH */}

        <div className="product-search">

          <Search size={18} />

          <input
            type="text"
            placeholder="Search order ID or customer..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>


        {/* FILTER */}

        <div className="category-buttons">

          {[
            "All",
            "Order Placed",
            "Processing",
            "Shipped",
            "Delivered",
            "Cancelled",
          ].map((status) => (

            <button
              key={status}
              className={`category-button ${
                filter === status
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setFilter(status)
              }
            >
              {status}
            </button>

          ))}

        </div>

      </div>


      {/* ORDERS TABLE */}

      <div className="admin-panel">

        <div className="admin-panel-header">

          <div>

            <h2>
              Customer Orders
            </h2>

            <p>
              {filteredOrders.length} order
              {filteredOrders.length !== 1
                ? "s"
                : ""}{" "}
              found
            </p>

          </div>

        </div>


        {/* NO ORDERS */}

        {filteredOrders.length === 0 ? (

          <div className="admin-empty">

            <ShoppingBag size={40} />

            <h3>
              No orders found
            </h3>

            <p>
              Customer orders will appear here after checkout.
            </p>

            <Link
              to="/products"
              className="btn btn-primary"
            >
              View Products
            </Link>

          </div>

        ) : (

          <div className="admin-table-wrapper">

            <table className="admin-table">

              <thead>

                <tr>

                  <th>
                    Order ID
                  </th>

                  <th>
                    Customer
                  </th>

                  <th>
                    Date
                  </th>

                  <th>
                    Items
                  </th>

                  <th>
                    Total
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Action
                  </th>

                </tr>

              </thead>


              <tbody>

                {filteredOrders.map(
                  (order) => (

                    <tr key={order.id}>

                      {/* ORDER ID */}

                      <td>

                        <strong>
                          #
                          {order.orderNumber ||
                            order.id}
                        </strong>

                      </td>


                      {/* CUSTOMER */}

                      <td>

                        <div className="table-customer">

                          <strong>
                            {order.user?.name ||
                              "Customer"}
                          </strong>

                          <span>
                            {order.user?.email ||
                              "No email"}
                          </span>

                        </div>

                      </td>


                      {/* DATE */}

                      <td>

                        {order.createdAt
                          ? new Date(
                              order.createdAt
                            ).toLocaleDateString(
                              "en-IN"
                            )
                          : "-"}

                      </td>


                      {/* ITEMS */}

                      <td>

                        {order.items?.length ||
                          0}

                      </td>


                      {/* TOTAL */}

                      <td>

                        <strong>

                          ₹
                          {Number(
                            order.total || 0
                          ).toLocaleString(
                            "en-IN"
                          )}

                        </strong>

                      </td>


                      {/* STATUS */}

                      <td>

                        <select
                          value={
                            order.status ||
                            "Order Placed"
                          }
                          onChange={(e) =>
                            updateStatus(
                              order.id,
                              e.target.value
                            )
                          }
                          className="order-status-select"
                        >

                          <option value="Order Placed">
                            Order Placed
                          </option>

                          <option value="Processing">
                            Processing
                          </option>

                          <option value="Shipped">
                            Shipped
                          </option>

                          <option value="Delivered">
                            Delivered
                          </option>

                          <option value="Cancelled">
                            Cancelled
                          </option>

                        </select>

                      </td>


                      {/* VIEW */}

                      <td>

                        <Link
                          to={`/order-details?orderNumber=${order.orderNumber}`}
                          className="table-view-button"
                        >

                          <Eye size={16} />

                          View

                        </Link>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
}

export default AdminOrders;