import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("retailhubToken");

      if (!token) {
        setError("Please login to view your orders.");
        return;
      }

      const { data } = await axios.get(
        "http://localhost:5000/api/orders/my-orders",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setOrders(data.orders || []);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Failed to load orders."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const delivered = orders.filter(
    (o) => o.status === "Delivered"
  ).length;

  const active = orders.filter(
    (o) => !["Delivered", "Cancelled"].includes(o.status)
  ).length;

  if (loading) {
    return (
      <div className="standard-page">
        <div className="page-header">
          <div>
            <span className="eyebrow">PURCHASE HISTORY</span>
            <h1>My Orders</h1>
            <p>Loading your orders...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="standard-page">
      <div className="page-header">
        <div>
          <span className="eyebrow">PURCHASE HISTORY</span>
          <h1>My Orders</h1>
          <p>View and track your RetailHub purchases.</p>
        </div>
      </div>

      {error && (
        <div className="empty-state">
          <h2>Unable to load orders</h2>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={fetchOrders}>
            Try Again
          </button>
        </div>
      )}

      {!error && (
        <>
          <div className="order-stats">
            <div className="order-stat-card">
              <div className="order-stat-icon">📦</div>
              <div>
                <span>Total Orders</span>
                <strong>{orders.length}</strong>
              </div>
            </div>

            <div className="order-stat-card">
              <div className="order-stat-icon">🚚</div>
              <div>
                <span>Active Orders</span>
                <strong>{active}</strong>
              </div>
            </div>

            <div className="order-stat-card">
              <div className="order-stat-icon">✓</div>
              <div>
                <span>Delivered</span>
                <strong>{delivered}</strong>
              </div>
            </div>
          </div>

          {orders.length === 0 ? (
            <div className="empty-state">
              <h2>No orders yet</h2>
              <p>Start shopping to see your orders here.</p>
              <Link to="/products" className="btn btn-primary">
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="orders-list">
              {orders.map((order) => (
                <div className="order-card" key={order.id}>
                  <div className="order-card-header">
                    <div>
                      <span className="order-label">ORDER</span>
                      <h2>{order.orderNumber}</h2>
                      <p>
                        {new Date(order.createdAt).toLocaleDateString(
                          "en-IN"
                        )}
                      </p>
                    </div>

                    <span className={`order-status ${order.status
                      .toLowerCase()
                      .replaceAll(" ", "-")}`}>
                      {order.status}
                    </span>
                  </div>

                  <div className="order-items">
                    {order.items?.map((item) => (
                      <div className="order-item" key={item.id}>
                        <div>
                          <strong>{item.productName}</strong>
                          <span>Qty: {item.quantity}</span>
                        </div>
                        <strong>
                          ₹{Number(item.subtotal).toLocaleString("en-IN")}
                        </strong>
                      </div>
                    ))}
                  </div>

                  <div className="order-card-footer">
                    <div>
                      <span>Payment</span>
                      <strong>{order.paymentMethod}</strong>
                    </div>

                    <div>
                      <span>Total</span>
                      <strong>
                        ₹{Number(order.total).toLocaleString("en-IN")}
                      </strong>
                    </div>

                    <Link
                      to={`/order-details?orderNumber=${order.orderNumber}`}
                      className="btn btn-primary"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default MyOrders;