import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  CheckCircle,
  Package,
  Truck,
  MapPin,
  CreditCard,
  Clock,
} from "lucide-react";

function OrderDetails() {
  const [params] = useSearchParams();
  const orderNumber = params.get("orderNumber");

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem("retailhubToken");

        if (!token) {
          setError("Please login to view this order.");
          return;
        }

        const { data } = await axios.get(
          `http://localhost:5000/api/orders/${orderNumber}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setOrder(data.order);
      } catch (err) {
        console.error(err);
        setError(
          err.response?.data?.message ||
            "Failed to load order details."
        );
      } finally {
        setLoading(false);
      }
    };

    if (orderNumber) {
      fetchOrder();
    } else {
      setError("Order number is missing.");
      setLoading(false);
    }
  }, [orderNumber]);

  if (loading) {
    return (
      <div className="standard-page">
        <div className="empty-state">
          <Package size={48} />
          <h2>Loading order...</h2>
          <p>Please wait while we load your order.</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="standard-page">
        <div className="empty-state">
          <Package size={48} />

          <h2>Order not found</h2>

          <p>{error}</p>

          <Link to="/my-orders" className="btn btn-primary">
            Back to My Orders
          </Link>
        </div>
      </div>
    );
  }

  const status = order.status || "Order Placed";

  const isDelivered = status === "Delivered";

  const isShipped =
    status === "Shipped" || isDelivered;

  const isProcessing =
    status === "Processing" ||
    status === "Order Placed";

  const orderDate = new Date(
    order.createdAt
  ).toLocaleDateString("en-IN");

  return (
    <div className="standard-page">

      {/* HEADER */}

      <div className="page-header">

        <div>

          <Link
            to="/my-orders"
            className="text-link"
          >
            <ArrowLeft size={17} />
            Back to My Orders
          </Link>

          <span className="eyebrow order-details-eyebrow">
            ORDER DETAILS
          </span>

          <h1>{order.orderNumber}</h1>

          <p>
            Placed on {orderDate}
          </p>

        </div>

        <div
          className={`order-status ${
            isDelivered
              ? "delivered"
              : isShipped
              ? "shipped"
              : "processing"
          }`}
        >
          {isDelivered ? (
            <CheckCircle size={17} />
          ) : isShipped ? (
            <Truck size={17} />
          ) : (
            <Clock size={17} />
          )}

          {status}
        </div>

      </div>

      {/* ORDER TRACKING */}

      <section className="order-tracking">

        <div className="tracking-header">

          <div>
            <h2>Order Tracking</h2>

            <p>
              Track the progress of your order.
            </p>
          </div>

        </div>

        <div className="tracking-steps">

          {/* ORDER PLACED */}

          <div className="tracking-step completed">

            <div className="tracking-icon">
              <CheckCircle size={20} />
            </div>

            <div>
              <strong>Order Placed</strong>
              <span>{orderDate}</span>
            </div>

          </div>

          <div className="tracking-line completed-line" />

          {/* PROCESSING */}

          <div
            className={`tracking-step ${
              isProcessing || isShipped || isDelivered
                ? "completed"
                : ""
            }`}
          >

            <div className="tracking-icon">
              <Package size={20} />
            </div>

            <div>
              <strong>Processing</strong>

              <span>
                {isProcessing || isShipped || isDelivered
                  ? "Order is being processed"
                  : "Waiting for processing"}
              </span>
            </div>

          </div>

          <div className="tracking-line" />

          {/* SHIPPED */}

          <div
            className={`tracking-step ${
              isShipped ? "completed" : ""
            }`}
          >

            <div className="tracking-icon">
              <Truck size={20} />
            </div>

            <div>
              <strong>Shipped</strong>

              <span>
                {isShipped
                  ? "Order shipped"
                  : "Waiting for shipment"}
              </span>
            </div>

          </div>

          <div className="tracking-line" />

          {/* DELIVERED */}

          <div
            className={`tracking-step ${
              isDelivered ? "completed" : ""
            }`}
          >

            <div className="tracking-icon">
              <CheckCircle size={20} />
            </div>

            <div>
              <strong>Delivered</strong>

              <span>
                {isDelivered
                  ? "Order delivered"
                  : "Not delivered yet"}
              </span>
            </div>

          </div>

        </div>

      </section>

      {/* MAIN CONTENT */}

      <div className="order-details-layout">

        {/* LEFT SIDE */}

        <div>

          {/* PRODUCTS */}

          <section className="details-card">

            <div className="details-card-header">

              <div>

                <h2>
                  Items in Your Order
                </h2>

                <p>
                  {order.items?.length || 0} product
                  {order.items?.length !== 1
                    ? "s"
                    : ""}
                </p>

              </div>

            </div>

            <div className="details-products">

              {order.items?.map((item) => (

                <div
                  className="details-product"
                  key={item.id}
                >

                  <div className="details-product-image">
                    <Package size={30} />
                  </div>

                  <div className="details-product-info">

                    <h3>
                      {item.productName}
                    </h3>

                    <p>
                      Quantity: {item.quantity}
                    </p>

                    <p>
                      Price: ₹
                      {Number(item.price).toLocaleString(
                        "en-IN"
                      )}
                    </p>

                  </div>

                  <strong>
                    ₹
                    {Number(item.subtotal).toLocaleString(
                      "en-IN"
                    )}
                  </strong>

                </div>

              ))}

            </div>

          </section>

          {/* DELIVERY ADDRESS */}

          <section className="details-card">

            <div className="details-heading">

              <div className="details-heading-icon">
                <MapPin size={20} />
              </div>

              <div>

                <h2>
                  Delivery Address
                </h2>

                <p>
                  Shipping information
                </p>

              </div>

            </div>

            <div className="address-details">

              <span>
                {order.address}
              </span>

            </div>

          </section>

          {/* PAYMENT */}

          <section className="details-card">

            <div className="details-heading">

              <div className="details-heading-icon">
                <CreditCard size={20} />
              </div>

              <div>

                <h2>
                  Payment Information
                </h2>

                <p>
                  Payment method used for this order
                </p>

              </div>

            </div>

            <div className="payment-info">

              <span>
                Payment Method
              </span>

              <strong>
                {order.paymentMethod}
              </strong>

            </div>

          </section>

        </div>

        {/* RIGHT SIDE */}

        <aside className="order-details-summary">

          <h2>Order Summary</h2>

          <div className="summary-row">

            <span>Subtotal</span>

            <strong>
              ₹
              {Number(order.subtotal).toLocaleString(
                "en-IN"
              )}
            </strong>

          </div>

          <div className="summary-row">

            <span>Delivery</span>

            <strong className="free-text">

              {Number(order.delivery) === 0
                ? "FREE"
                : `₹${Number(order.delivery).toLocaleString(
                    "en-IN"
                  )}`}

            </strong>

          </div>

          <div className="summary-divider" />

          <div className="summary-total">

            <span>Total</span>

            <strong>
              ₹
              {Number(order.total).toLocaleString(
                "en-IN"
              )}
            </strong>

          </div>

          <div className="delivery-note">

            <Clock size={18} />

            <span>

              {isDelivered
                ? "Your order has been successfully delivered."
                : "Your order is being processed."}

            </span>

          </div>

          <Link
            to="/products"
            className="primary-button full-width"
          >
            Continue Shopping
          </Link>

        </aside>

      </div>

    </div>
  );
}

export default OrderDetails;