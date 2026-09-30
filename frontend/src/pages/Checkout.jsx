import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  MapPin,
  CreditCard,
  ShieldCheck,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

function Checkout() {
  const navigate = useNavigate();

  const [placed, setPlaced] = useState(false);

  // Current cart
  const [cartItems, setCartItems] = useState([]);

  // Keep purchased items for confirmation page
  const [orderedItems, setOrderedItems] = useState([]);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [orderId, setOrderId] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
    payment: "Cash on Delivery",
  });

  // =====================================================
  // LOAD CART
  // =====================================================

  useEffect(() => {
    const savedCart =
      JSON.parse(
        localStorage.getItem("retailhubCart") || "[]"
      );

    setCartItems(savedCart);
  }, []);

  // =====================================================
  // CALCULATIONS
  // =====================================================

  const subtotal = cartItems.reduce(
    (total, item) =>
      total +
      Number(item.price || 0) *
        Number(item.quantity || 1),
    0
  );

  // Same delivery rule as Cart
  const delivery = subtotal >= 1000 ? 0 : 80;

  const total = subtotal + delivery;

  // Total quantity
  const totalItems = cartItems.reduce(
    (total, item) =>
      total + Number(item.quantity || 1),
    0
  );

  // =====================================================
  // FORM CHANGE
  // =====================================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =====================================================
  // PLACE ORDER
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      // Get logged-in user's token
      const token =
        localStorage.getItem("retailhubToken");

      if (!token) {
        alert(
          "Please login before placing an order."
        );

        navigate("/login");

        return;
      }

      // =================================================
      // SAVE ITEMS BEFORE CLEARING CART
      // =================================================

      setOrderedItems(
        cartItems.map((item) => ({
          ...item,
          quantity: Number(item.quantity || 1),
          price: Number(item.price || 0),
        }))
      );

      // =================================================
      // FULL DELIVERY ADDRESS
      // =================================================

      const fullAddress =
        `${formData.name}, ` +
        `${formData.phone}, ` +
        `${formData.address}, ` +
        `${formData.city}, ` +
        `${formData.pincode}`;

      // =================================================
      // DATA SENT TO BACKEND
      // =================================================

      const orderData = {
        items: cartItems.map((item) => ({
          productId: item.id,
          quantity: Number(item.quantity || 1),
        })),

        address: fullAddress,

        paymentMethod: formData.payment,
      };

      console.log(
        "Order data sent to backend:",
        orderData
      );

      // =================================================
      // CREATE ORDER
      // =================================================

      const response = await axios.post(
        "http://localhost:5000/api/orders",
        orderData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "Order Response:",
        response.data
      );

      // =================================================
      // SAVE ORDER NUMBER
      // =================================================

      setOrderId(
        response.data.order.orderNumber
      );

      // =================================================
      // SHOW SUCCESS PAGE
      // =================================================

      setPlaced(true);

      // =================================================
      // CLEAR CART ONLY AFTER SUCCESS
      // =================================================

      localStorage.removeItem(
        "retailhubCart"
      );

    } catch (error) {
      console.error(
        "Order Error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to place order. Please try again."
      );

      // If order failed, do not clear cart
      setOrderedItems([]);

    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // EMPTY CART
  // =====================================================

  if (
    !placed &&
    cartItems.length === 0
  ) {
    return (
      <div className="standard-page">

        <div className="page-header">

          <div>

            <span className="eyebrow">
              SECURE CHECKOUT
            </span>

            <h1>
              Checkout
            </h1>

            <p>
              Your cart is empty.
            </p>

          </div>

          <Link
            to="/products"
            className="btn btn-primary"
          >
            Start Shopping
          </Link>

        </div>

        <div className="empty-state">

          <h2>
            No products to checkout
          </h2>

          <p>
            Add products to your cart before
            proceeding to checkout.
          </p>

          <Link
            to="/products"
            className="btn btn-primary"
          >
            Browse Products →
          </Link>

        </div>

      </div>
    );
  }

  // =====================================================
  // SUCCESS PAGE
  // =====================================================

  if (placed) {
    return (
      <div className="standard-page">

        <div className="success-card">

          <div className="success-icon">
            <CheckCircle size={52} />
          </div>

          <span className="eyebrow">
            ORDER CONFIRMED
          </span>

          <h1>
            Order Placed Successfully
          </h1>

          <p>
            Thank you for shopping with RetailHub.
            Your order has been successfully placed.
          </p>

          {/* ORDER NUMBER */}
          <div className="order-confirmation-box">

            <span>
              Order ID
            </span>

            <strong>
              {orderId}
            </strong>

          </div>

          {/* PURCHASED ITEMS */}
          <div
            style={{
              width: "100%",
              marginTop: "24px",
              textAlign: "left",
              border: "1px solid #E2E8F0",
              borderRadius: "12px",
              padding: "20px",
            }}
          >

            <h3
              style={{
                marginTop: 0,
                marginBottom: "16px",
              }}
            >
              Items in Your Order
            </h3>

            {orderedItems.map((item) => (

              <div
                key={item.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "12px 0",
                  borderBottom:
                    "1px solid #E2E8F0",
                  gap: "20px",
                }}
              >

                <div>

                  <strong>
                    {item.name}
                  </strong>

                  <div
                    style={{
                      fontSize: "14px",
                      color: "#64748B",
                      marginTop: "4px",
                    }}
                  >
                    Quantity:{" "}
                    {item.quantity}
                  </div>

                </div>

                <strong>
                  ₹
                  {(
                    item.price *
                    item.quantity
                  ).toLocaleString(
                    "en-IN"
                  )}
                </strong>

              </div>

            ))}

            {/* ITEM COUNT */}
            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                marginTop: "16px",
              }}
            >
              <span>
                Total Items
              </span>

              <strong>
                {orderedItems.reduce(
                  (sum, item) =>
                    sum +
                    Number(
                      item.quantity || 1
                    ),
                  0
                )}
              </strong>
            </div>

          </div>

          {/* PAYMENT DETAILS */}
          <div className="success-details">

            <div>

              <span>
                Payment
              </span>

              <strong>
                {formData.payment}
              </strong>

            </div>

            <div>

              <span>
                Total Amount
              </span>

              <strong>
                ₹
                {total.toLocaleString(
                  "en-IN"
                )}
              </strong>

            </div>

          </div>

          {/* ACTIONS */}
          <div className="success-actions">

            <Link
              to="/my-orders"
              className="primary-button"
            >
              View My Orders
              <ArrowRight size={18} />
            </Link>

            <Link
              to="/products"
              className="outline-button"
            >
              Continue Shopping
            </Link>

          </div>

        </div>

      </div>
    );
  }

  // =====================================================
  // CHECKOUT PAGE
  // =====================================================

  return (
    <div className="standard-page">

      {/* HEADER */}

      <div className="page-header">

        <div>

          <span className="eyebrow">
            SECURE CHECKOUT
          </span>

          <h1>
            Checkout
          </h1>

          <p>
            Enter your delivery and payment details.
          </p>

        </div>

      </div>

      {/* ERROR */}

      {error && (
        <div
          style={{
            background: "#FEF2F2",
            color: "#B91C1C",
            border: "1px solid #FECACA",
            padding: "12px 16px",
            borderRadius: "8px",
            marginBottom: "20px",
          }}
        >
          {error}
        </div>
      )}

      <div className="checkout-layout">

        {/* =================================================
            LEFT SIDE
        ================================================= */}

        <form
          className="checkout-form"
          onSubmit={handleSubmit}
        >

          {/* DELIVERY INFORMATION */}

          <div className="checkout-section">

            <div className="checkout-heading">

              <div className="checkout-icon">
                <MapPin size={21} />
              </div>

              <div>

                <h2>
                  Delivery Information
                </h2>

                <p>
                  Enter the address where you
                  want your order delivered.
                </p>

              </div>

            </div>

            <div className="form-grid">

              <div className="form-group">

                <label>
                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />

              </div>

              <div className="form-group">

                <label>
                  Phone Number
                </label>

                <input
                  type="tel"
                  name="phone"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>

            <div className="form-group">

              <label>
                Delivery Address
              </label>

              <textarea
                name="address"
                placeholder="House number, street, area"
                rows="4"
                value={formData.address}
                onChange={handleChange}
                required
              />

            </div>

            <div className="form-grid">

              <div className="form-group">

                <label>
                  City
                </label>

                <input
                  type="text"
                  name="city"
                  placeholder="Enter city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />

              </div>

              <div className="form-group">

                <label>
                  PIN Code
                </label>

                <input
                  type="text"
                  name="pincode"
                  placeholder="Enter PIN code"
                  value={formData.pincode}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>

          </div>

          {/* PAYMENT */}

          <div className="checkout-section">

            <div className="checkout-heading">

              <div className="checkout-icon">
                <CreditCard size={21} />
              </div>

              <div>

                <h2>
                  Payment Method
                </h2>

                <p>
                  Select your preferred payment
                  option.
                </p>

              </div>

            </div>

            <div className="payment-options">

              {/* COD */}

              <label className="payment-option">

                <input
                  type="radio"
                  name="payment"
                  value="Cash on Delivery"
                  checked={
                    formData.payment ===
                    "Cash on Delivery"
                  }
                  onChange={handleChange}
                />

                <div>

                  <strong>
                    Cash on Delivery
                  </strong>

                  <span>
                    Pay when your order arrives
                  </span>

                </div>

              </label>

              {/* UPI */}

              <label className="payment-option">

                <input
                  type="radio"
                  name="payment"
                  value="UPI"
                  checked={
                    formData.payment === "UPI"
                  }
                  onChange={handleChange}
                />

                <div>

                  <strong>
                    UPI
                  </strong>

                  <span>
                    Pay securely using UPI
                  </span>

                </div>

              </label>

              {/* CARD */}

              <label className="payment-option">

                <input
                  type="radio"
                  name="payment"
                  value="Card"
                  checked={
                    formData.payment === "Card"
                  }
                  onChange={handleChange}
                />

                <div>

                  <strong>
                    Credit / Debit Card
                  </strong>

                  <span>
                    Pay securely using your card
                  </span>

                </div>

              </label>

            </div>

          </div>

          {/* SECURITY */}

          <div className="secure-checkout-note">

            <ShieldCheck size={20} />

            <div>

              <strong>
                Secure Checkout
              </strong>

              <p>
                Your information is protected and
                used only for processing your order.
              </p>

            </div>

          </div>

          {/* PLACE ORDER */}

          <button
            type="submit"
            className="primary-button checkout-submit"
            disabled={loading}
          >

            {loading
              ? "Placing Order..."
              : "Place Order"}

            {!loading && (
              <ArrowRight size={18} />
            )}

          </button>

        </form>

        {/* =================================================
            RIGHT SIDE - ORDER SUMMARY
        ================================================= */}

        <aside className="checkout-summary">

          <h2>
            Order Summary
          </h2>

          {/* ALL CART ITEMS */}

          <div className="checkout-products">

            {cartItems.map((item) => (

              <div
                className="checkout-product"
                key={item.id}
              >

                <div>

                  <strong>
                    {item.name}
                  </strong>

                  <span>
                    Qty:{" "}
                    {Number(
                      item.quantity || 1
                    )}
                  </span>

                </div>

                <strong>
                  ₹
                  {(
                    Number(item.price || 0) *
                    Number(item.quantity || 1)
                  ).toLocaleString(
                    "en-IN"
                  )}
                </strong>

              </div>

            ))}

          </div>

          <div className="summary-divider" />

          {/* TOTAL ITEMS */}

          <div className="summary-row">

            <span>
              Items
            </span>

            <strong>
              {totalItems}
            </strong>

          </div>

          {/* SUBTOTAL */}

          <div className="summary-row">

            <span>
              Subtotal
            </span>

            <strong>
              ₹
              {subtotal.toLocaleString(
                "en-IN"
              )}
            </strong>

          </div>

          {/* DELIVERY */}

          <div className="summary-row">

            <span>
              Delivery
            </span>

            <strong>
              {delivery === 0
                ? "FREE"
                : `₹${delivery}`}
            </strong>

          </div>

          <div className="summary-divider" />

          {/* FINAL TOTAL */}

          <div className="summary-total">

            <span>
              Total
            </span>

            <strong>
              ₹
              {total.toLocaleString(
                "en-IN"
              )}
            </strong>

          </div>

        </aside>

      </div>

    </div>
  );
}

export default Checkout;