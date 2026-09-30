import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";

function Cart() {
  const [cart, setCart] = useState([]);

  // Load cart
  useEffect(() => {
    const savedCart =
      JSON.parse(localStorage.getItem("retailhubCart") || "[]");

    setCart(savedCart);
  }, []);

  // Update quantity
  const updateCart = (id, change) => {
    const updatedCart = cart
      .map((item) => {
        if (item.id !== id) {
          return item;
        }

        return {
          ...item,
          quantity: Math.max(
            1,
            Number(item.quantity || 1) + change
          ),
        };
      });

    setCart(updatedCart);

    localStorage.setItem(
      "retailhubCart",
      JSON.stringify(updatedCart)
    );
  };

  // Remove item
  const removeItem = (id) => {
    const updatedCart = cart.filter(
      (item) => item.id !== id
    );

    setCart(updatedCart);

    localStorage.setItem(
      "retailhubCart",
      JSON.stringify(updatedCart)
    );
  };

  // Subtotal
  const subtotal = cart.reduce(
    (total, item) =>
      total +
      Number(item.price || 0) *
        Number(item.quantity || 1),
    0
  );

  // Same delivery rule used in Checkout
  const delivery = subtotal >= 1000 ? 0 : 80;

  // Final total
  const total = subtotal + delivery;

  // Total number of products
  const totalItems = cart.reduce(
    (total, item) =>
      total + Number(item.quantity || 1),
    0
  );

  return (
    <div className="standard-page">

      {/* HEADER */}
      <div className="page-header">
        <div>
          <span className="eyebrow">
            RETAILHUB SHOPPING
          </span>

          <h1>Your Cart</h1>

          <p>
            Review your selected products before
            proceeding to checkout.
          </p>
        </div>

        <Link
          to="/products"
          className="btn btn-secondary"
        >
          Continue Shopping
        </Link>
      </div>

      {/* EMPTY CART */}
      {cart.length === 0 ? (
        <div className="empty-state">

          <ShoppingBag size={45} />

          <h2>Your cart is empty</h2>

          <p>
            You haven't added any products to your
            cart yet.
          </p>

          <Link
            to="/products"
            className="btn btn-primary"
          >
            Start Shopping
            <ArrowRight size={17} />
          </Link>

        </div>
      ) : (

        /* CART */
        <div className="cart-layout">

          {/* CART ITEMS */}
          <div className="cart-items">

            {cart.map((item) => (

              <div
                className="cart-item"
                key={item.id}
              >

                {/* PRODUCT IMAGE */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="cart-item-image"
                />

                {/* PRODUCT INFORMATION */}
                <div className="cart-item-info">

                  <span className="product-category">
                    {item.category}
                  </span>

                  <h3>
                    {item.name}
                  </h3>

                  <strong>
                    ₹
                    {Number(item.price || 0).toLocaleString(
                      "en-IN"
                    )}
                  </strong>

                  {/* QUANTITY */}
                  <div className="quantity-control">

                    <button
                      type="button"
                      onClick={() =>
                        updateCart(item.id, -1)
                      }
                    >
                      <Minus size={15} />
                    </button>

                    <span>
                      {Number(item.quantity || 1)}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        updateCart(item.id, 1)
                      }
                    >
                      <Plus size={15} />
                    </button>

                  </div>

                </div>

                {/* ITEM TOTAL */}
                <div className="cart-item-right">

                  <strong>
                    ₹
                    {(
                      Number(item.price || 0) *
                      Number(item.quantity || 1)
                    ).toLocaleString("en-IN")}
                  </strong>

                  <button
                    type="button"
                    className="remove-button"
                    onClick={() =>
                      removeItem(item.id)
                    }
                  >
                    <Trash2 size={17} />
                    Remove
                  </button>

                </div>

              </div>

            ))}

          </div>

          {/* ORDER SUMMARY */}
          <div className="cart-summary">

            <h2>
              Order Summary
            </h2>

            <div className="summary-row">
              <span>
                Items
              </span>

              <strong>
                {totalItems}
              </strong>
            </div>

            <div className="summary-row">
              <span>
                Subtotal
              </span>

              <strong>
                ₹
                {subtotal.toLocaleString("en-IN")}
              </strong>
            </div>

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

            <div className="summary-divider"></div>

            <div className="summary-total">
              <span>
                Total
              </span>

              <strong>
                ₹
                {total.toLocaleString("en-IN")}
              </strong>
            </div>

            <Link
              to="/checkout"
              className="btn btn-primary checkout-button"
            >
              Proceed to Checkout
              <ArrowRight size={17} />
            </Link>

          </div>

        </div>
      )}

    </div>
  );
}

export default Cart;