import { Link, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  ShoppingCart,
  Heart,
  Star,
  Truck,
  RotateCcw,
  ShieldCheck,
  Minus,
  Plus,
} from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";

function ProductDetails() {
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const productId = params.get("id");

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [liked, setLiked] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch product from backend
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get(
          `http://localhost:5000/api/products/${productId}`
        );

        setProduct(response.data);
      } catch (error) {
        console.error("Failed to fetch product:", error);

        setError(
          error.response?.data?.message ||
          "Unable to load product."
        );
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const increaseQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const addToCart = () => {
    if (!product) return;

    const existingCart =
      JSON.parse(localStorage.getItem("retailhubCart")) || [];

    const existingProduct = existingCart.find(
      (item) => item.id === product.id
    );

    let updatedCart;

    if (existingProduct) {
      updatedCart = existingCart.map((item) =>
        item.id === product.id
          ? {
              ...item,
              quantity: item.quantity + quantity,
            }
          : item
      );
    } else {
      updatedCart = [
        ...existingCart,
        {
          ...product,
          quantity: quantity,
        },
      ];
    }

    localStorage.setItem(
      "retailhubCart",
      JSON.stringify(updatedCart)
    );

    alert(`${product.name} added to cart`);
  };

  if (loading) {
    return (
      <div className="standard-page">
        <div className="admin-empty">
          Loading product...
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="standard-page">
        <Link to="/products" className="back-products">
          <ArrowLeft size={18} />
          Back to Products
        </Link>

        <div className="admin-empty">
          {error || "Product not found."}
        </div>
      </div>
    );
  }

  return (
    <div className="product-details-page">

      {/* Back */}
      <Link to="/products" className="back-products">
        <ArrowLeft size={18} />
        Back to Products
      </Link>

      {/* Main product section */}
      <section className="product-details-container">

        {/* Image */}
        <div className="product-details-image">
          <img
            src={product.image}
            alt={product.name}
          />

          <button
            className={`details-wishlist ${
              liked ? "liked" : ""
            }`}
            onClick={() => setLiked(!liked)}
          >
            <Heart
              size={22}
              fill={liked ? "currentColor" : "none"}
            />
          </button>
        </div>

        {/* Information */}
        <div className="product-details-info">

          <span className="details-category">
            {product.category}
          </span>

          <h1>{product.name}</h1>

          <div className="details-rating">

            <span className="rating-box">
              <Star size={16} fill="currentColor" />
              {product.rating || "0.0"}
            </span>

            <span>
              Product Rating
            </span>

          </div>

          <div className="details-price">

            <strong>
              ₹{Number(product.price).toLocaleString("en-IN")}
            </strong>

          </div>

          <p className="details-description">
            {product.description}
          </p>

          {/* Stock */}
          <div className="stock-status">

            <span className="stock-dot"></span>

            {product.stock} items available in stock

          </div>

          {/* Quantity */}
          <div className="quantity-section">

            <span>Quantity</span>

            <div className="quantity-control">

              <button
                onClick={decreaseQuantity}
                disabled={quantity <= 1}
              >
                <Minus size={17} />
              </button>

              <strong>{quantity}</strong>

              <button
                onClick={increaseQuantity}
                disabled={quantity >= product.stock}
              >
                <Plus size={17} />
              </button>

            </div>

          </div>

          {/* Buttons */}
          <div className="details-buttons">

            <button
              className="details-cart-button"
              onClick={addToCart}
              disabled={product.stock <= 0}
            >
              <ShoppingCart size={20} />
              Add to Cart
            </button>

            <button className="buy-now-button">
              Buy Now
            </button>

          </div>

          {/* Benefits */}
          <div className="product-benefits">

            <div>
              <Truck size={22} />

              <div>
                <strong>Fast Delivery</strong>
                <span>Quick delivery available</span>
              </div>
            </div>

            <div>
              <RotateCcw size={22} />

              <div>
                <strong>Easy Returns</strong>
                <span>Simple return process</span>
              </div>
            </div>

            <div>
              <ShieldCheck size={22} />

              <div>
                <strong>Secure Shopping</strong>
                <span>Your information is protected</span>
              </div>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}

export default ProductDetails;