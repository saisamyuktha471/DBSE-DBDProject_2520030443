import { useEffect, useState } from "react";
import {
  RotateCcw,
  Search,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import axios from "axios";

function AdminReturns() {
  const [returns, setReturns] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // FETCH RETURNS FROM BACKEND
  // =====================================================

  const fetchReturns = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("retailhubToken");

      if (!token) {
        setError("Admin login required.");
        return;
      }

      const response = await axios.get(
        "http://localhost:5000/api/admin/returns",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setReturns(response.data.returns || []);
    } catch (err) {
      console.error("Fetch Returns Error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load return requests."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReturns();
  }, []);

  // =====================================================
  // UPDATE RETURN STATUS
  // =====================================================

  const updateStatus = async (returnId, newStatus) => {
    try {
      const token = localStorage.getItem("retailhubToken");

      if (!token) {
        alert("Admin login required.");
        return;
      }

      await axios.put(
        `http://localhost:5000/api/admin/returns/${returnId}/status`,
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
      setReturns((previousReturns) =>
        previousReturns.map((item) =>
          item.id === returnId
            ? {
                ...item,
                status: newStatus,
              }
            : item
        )
      );

    } catch (err) {
      console.error(
        "Update Return Status Error:",
        err
      );

      alert(
        err.response?.data?.message ||
          "Failed to update return status."
      );
    }
  };

  // =====================================================
  // FILTER RETURNS
  // =====================================================

  const filteredReturns = returns.filter((item) => {
    const searchText = search.toLowerCase();

    const returnNumber = String(
      item.returnNumber || ""
    ).toLowerCase();

    const orderNumber = String(
      item.order?.orderNumber || ""
    ).toLowerCase();

    const customerName = String(
      item.user?.name || ""
    ).toLowerCase();

    const reason = String(
      item.reason || ""
    ).toLowerCase();

    const matchesSearch =
      returnNumber.includes(searchText) ||
      orderNumber.includes(searchText) ||
      customerName.includes(searchText) ||
      reason.includes(searchText);

    const matchesFilter =
      filter === "All" ||
      item.status === filter;

    return (
      matchesSearch &&
      matchesFilter
    );
  });

  // =====================================================
  // SUMMARY COUNTS
  // =====================================================

  const totalReturns = returns.length;

  const processingReturns = returns.filter(
    (item) => item.status === "Processing"
  ).length;

  const approvedReturns = returns.filter(
    (item) => item.status === "Approved"
  ).length;

  const rejectedReturns = returns.filter(
    (item) => item.status === "Rejected"
  ).length;

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) {
      return "—";
    }

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="standard-page">

      {/* HEADER */}

      <div className="page-header">

        <div>

          <span className="eyebrow">
            BUSINESS MANAGEMENT
          </span>

          <h1>Returns</h1>

          <p>
            Manage customer return requests and
            monitor return activity.
          </p>

        </div>

      </div>


      {/* SUMMARY CARDS */}

      <div className="admin-stats-grid">

        {/* TOTAL */}

        <div className="admin-stat-card">

          <div className="admin-stat-icon blue">
            <RotateCcw size={22} />
          </div>

          <div>

            <span>Total Returns</span>

            <strong>
              {totalReturns}
            </strong>

            <small>
              All return requests
            </small>

          </div>

        </div>


        {/* PROCESSING */}

        <div className="admin-stat-card">

          <div className="admin-stat-icon orange">
            <Clock size={22} />
          </div>

          <div>

            <span>Processing</span>

            <strong>
              {processingReturns}
            </strong>

            <small>
              Awaiting action
            </small>

          </div>

        </div>


        {/* APPROVED */}

        <div className="admin-stat-card">

          <div className="admin-stat-icon green">
            <CheckCircle size={22} />
          </div>

          <div>

            <span>Approved</span>

            <strong>
              {approvedReturns}
            </strong>

            <small>
              Approved requests
            </small>

          </div>

        </div>


        {/* REJECTED */}

        <div className="admin-stat-card">

          <div className="admin-stat-icon red">
            <XCircle size={22} />
          </div>

          <div>

            <span>Rejected</span>

            <strong>
              {rejectedReturns}
            </strong>

            <small>
              Rejected requests
            </small>

          </div>

        </div>

      </div>


      {/* SEARCH AND FILTER */}

      <div className="products-toolbar">

        <div className="product-search">

          <Search size={18} />

          <input
            type="text"
            placeholder="Search return ID, order ID, customer or reason..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>


        <div className="category-buttons">

          {[
            "All",
            "Processing",
            "Approved",
            "Rejected",
            "Completed",
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


      {/* RETURNS TABLE */}

      <div className="admin-panel">

        <div className="admin-panel-header">

          <div>

            <h2>
              Customer Return Requests
            </h2>

            <p>
              {filteredReturns.length} request
              {filteredReturns.length !== 1
                ? "s"
                : ""}{" "}
              found
            </p>

          </div>

        </div>


        {/* LOADING */}

        {loading && (

          <div className="admin-empty">

            <RotateCcw size={40} />

            <h3>
              Loading return requests...
            </h3>

            <p>
              Please wait while the return
              information is loaded.
            </p>

          </div>

        )}


        {/* ERROR */}

        {!loading && error && (

          <div className="admin-empty">

            <XCircle size={40} />

            <h3>
              Unable to load returns
            </h3>

            <p>
              {error}
            </p>

            <button
              className="primary-button"
              onClick={fetchReturns}
              style={{
                marginTop: "15px",
              }}
            >
              Try Again
            </button>

          </div>

        )}


        {/* NO RETURNS */}

        {!loading &&
          !error &&
          filteredReturns.length === 0 && (

            <div className="admin-empty">

              <RotateCcw size={40} />

              <h3>
                No return requests found
              </h3>

              <p>
                Customer return requests will
                appear here when they submit
                a return.
              </p>

            </div>

          )}


        {/* RETURNS TABLE */}

        {!loading &&
          !error &&
          filteredReturns.length > 0 && (

            <div className="admin-table-wrapper">

              <table className="admin-table">

                <thead>

                  <tr>

                    <th>
                      Return ID
                    </th>

                    <th>
                      Order ID
                    </th>

                    <th>
                      Customer
                    </th>

                    <th>
                      Reason
                    </th>

                    <th>
                      Date
                    </th>

                    <th>
                      Status
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {filteredReturns.map(
                    (item) => (

                      <tr key={item.id}>

                        {/* RETURN ID */}

                        <td>

                          <strong>
                            {item.returnNumber ||
                              `#${item.id}`}
                          </strong>

                        </td>


                        {/* ORDER ID */}

                        <td>

                          {item.order
                            ?.orderNumber ||
                            "—"}

                        </td>


                        {/* CUSTOMER */}

                        <td>

                          <strong>
                            {item.user?.name ||
                              "Unknown Customer"}
                          </strong>

                          <br />

                          <small>
                            {item.user?.email ||
                              ""}
                          </small>

                        </td>


                        {/* REASON */}

                        <td>

                          {item.reason ||
                            "No reason provided"}

                        </td>


                        {/* DATE */}

                        <td>

                          {formatDate(
                            item.createdAt
                          )}

                        </td>


                        {/* STATUS */}

                        <td>

                          <select
                            value={
                              item.status ||
                              "Processing"
                            }
                            onChange={(e) =>
                              updateStatus(
                                item.id,
                                e.target.value
                              )
                            }
                            className="order-status-select"
                          >

                            <option value="Processing">
                              Processing
                            </option>

                            <option value="Approved">
                              Approved
                            </option>

                            <option value="Rejected">
                              Rejected
                            </option>

                            <option value="Completed">
                              Completed
                            </option>

                          </select>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

      </div>


      {/* BUSINESS INSIGHT */}

      <div className="admin-business-summary">

        <div className="business-summary-content">

          <div className="business-summary-icon">

            <RotateCcw size={24} />

          </div>


          <div>

            <span className="eyebrow">
              RETURN INSIGHT
            </span>

            <h2>
              Return patterns can help improve
              business decisions
            </h2>

            <p>
              Return information can be combined
              with product and order data to
              identify products with frequent
              returns and understand customer
              return behaviour. This data will
              later contribute to the Analytics
              and Decision Support modules.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default AdminReturns;