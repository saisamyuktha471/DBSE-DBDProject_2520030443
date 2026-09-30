import { Link } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  Headphones,
  RotateCcw,
  ShieldCheck,
  ShoppingCart,
  Star,
  Truck,
} from "lucide-react";

function Home() {
  const products = [
    {
      id: 1,
      name: "Wireless Headphones",
      category: "Electronics",
      price: 2499,
      oldPrice: 3499,
      rating: 4.7,
      reviews: 128,
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=80",
    },
    {
      id: 2,
      name: "Smart Watch",
      category: "Electronics",
      price: 3299,
      oldPrice: 4499,
      rating: 4.6,
      reviews: 94,
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=80",
    },
    {
      id: 3,
      name: "Classic Backpack",
      category: "Fashion",
      price: 1599,
      oldPrice: 2199,
      rating: 4.5,
      reviews: 76,
      image:
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=700&q=80",
    },
    {
      id: 4,
      name: "Running Shoes",
      category: "Fashion",
      price: 2899,
      oldPrice: 3999,
      rating: 4.8,
      reviews: 156,
      image:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=80",
    },
  ];

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="hero-inner">

          <div className="hero-content">
            <div className="hero-badge">
              SMART SHOPPING EXPERIENCE
            </div>

            <h1>
              Everything you need,
              <br />
              <span>all in one place.</span>
            </h1>

            <p>
              Discover products, manage your orders, track deliveries,
              and enjoy a simple and secure shopping experience with
              RetailHub.
            </p>

            <div className="hero-buttons">
              <Link to="/products" className="btn btn-primary">
                Shop Now
                <ArrowRight size={17} />
              </Link>

              <Link to="/register" className="btn btn-secondary">
                Create Account
              </Link>
            </div>
          </div>

          {/* HERO CARD */}
          <div className="hero-visual">
            <div className="hero-card">

              <div className="hero-card-header">
                <span className="hero-card-title">
                  RetailHub Services
                </span>

                <span className="hero-card-status">
                  ACTIVE
                </span>
              </div>

              <div className="hero-card-row">
                <div className="hero-card-icon">
                  <ShoppingCart size={20} />
                </div>

                <div>
                  <strong>Easy Shopping</strong>
                  <span>Browse and order products</span>
                </div>
              </div>

              <div className="hero-card-row">
                <div className="hero-card-icon">
                  <Truck size={20} />
                </div>

                <div>
                  <strong>Fast Delivery</strong>
                  <span>Track your orders easily</span>
                </div>
              </div>

              <div className="hero-card-row">
                <div className="hero-card-icon">
                  <ShieldCheck size={20} />
                </div>

                <div>
                  <strong>Secure Shopping</strong>
                  <span>Protected customer account</span>
                </div>
              </div>

              <div className="hero-card-row">
                <div className="hero-card-icon">
                  <BarChart3 size={20} />
                </div>

                <div>
                  <strong>Smart Analytics</strong>
                  <span>Business insights from user activity</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* FEATURES */}
      <section className="section">
        <div className="section-header">
          <div>
            <h2 className="section-title">
              Why RetailHub?
            </h2>

            <p className="section-subtitle">
              A complete digital platform for customers and retail
              business management.
            </p>
          </div>
        </div>

        <div className="features-grid">

          <div className="feature-card">
            <div className="feature-icon">
              <Truck size={22} />
            </div>

            <h3>Fast Delivery</h3>

            <p>
              Track your orders and stay updated throughout the
              delivery process.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <ShieldCheck size={22} />
            </div>

            <h3>Secure Shopping</h3>

            <p>
              Customer accounts and order information are protected
              through secure authentication.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <RotateCcw size={22} />
            </div>

            <h3>Easy Returns</h3>

            <p>
              Submit return requests and monitor return status
              through your account.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <Headphones size={22} />
            </div>

            <h3>Customer Support</h3>

            <p>
              Access assistance for products, orders, deliveries,
              and returns.
            </p>
          </div>

        </div>
      </section>

      {/* PRODUCTS */}
      <section className="section">

        <div className="section-header">
          <div>
            <h2 className="section-title">
              Popular Products
            </h2>

            <p className="section-subtitle">
              Explore products available on RetailHub.
            </p>
          </div>

          <Link to="/products" className="section-link">
            View All
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="product-grid">

          {products.map((product) => (
            <div className="product-card" key={product.id}>

              <Link
                to={`/product-details?id=${product.id}`}
                className="product-image"
              >
                <img
                  src={product.image}
                  alt={product.name}
                />
              </Link>

              <div className="product-info">

                <div className="product-category">
                  {product.category}
                </div>

                <Link
                  to={`/product-details?id=${product.id}`}
                  className="product-name"
                >
                  {product.name}
                </Link>

                <div className="product-rating">
                  <span className="rating-stars">
                    <Star size={14} fill="currentColor" />
                  </span>

                  <strong>{product.rating}</strong>

                  <span className="rating-count">
                    ({product.reviews})
                  </span>
                </div>

                <div className="product-price">
                  <span className="current-price">
                    ₹{product.price.toLocaleString()}
                  </span>

                  <span className="old-price">
                    ₹{product.oldPrice.toLocaleString()}
                  </span>

                  <span className="discount">
                    {Math.round(
                      ((product.oldPrice - product.price) /
                        product.oldPrice) *
                        100
                    )}
                    % OFF
                  </span>
                </div>

                <div className="product-actions">
                  <Link
                    to={`/product-details?id=${product.id}`}
                    className="btn btn-primary"
                  >
                    View Product
                  </Link>
                </div>

              </div>
            </div>
          ))}

        </div>
      </section>

      {/* BUSINESS SIDE */}
      <section className="section">

        <div className="section-header">
          <div>
            <h2 className="section-title">
              From Customer Activity to Business Insights
            </h2>

            <p className="section-subtitle">
              RetailHub converts customer activities into useful
              information for retail business management.
            </p>
          </div>
        </div>

        <div className="features-grid">

          <div className="feature-card">
            <div className="feature-icon">
              <ShoppingCart size={22} />
            </div>

            <h3>Customer Activity</h3>

            <p>
              Users browse products, add items to cart, place orders,
              make purchases, and request returns.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <BarChart3 size={22} />
            </div>

            <h3>Business Data</h3>

            <p>
              Orders, customers, sales, inventory, and returns are
              stored in the database.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <BarChart3 size={22} />
            </div>

            <h3>Analytics</h3>

            <p>
              Administrators can study sales, product performance,
              order trends, and return patterns.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <ShieldCheck size={22} />
            </div>

            <h3>Decision Support</h3>

            <p>
              Business insights help administrators make better
              decisions about products, inventory, and sales.
            </p>
          </div>

        </div>
      </section>

      {/* REWARDS */}
      <section className="section">

        <div className="rewards-banner">

          <h2>
            Shop more. Earn more.
          </h2>

          <p>
            Earn loyalty points from your purchases and redeem them
            for available rewards and offers.
          </p>

          <br />

          <Link to="/rewards" className="btn btn-orange">
            Explore Rewards
            <ArrowRight size={17} />
          </Link>

        </div>

      </section>

      {/* TRUST */}
      <section className="section">

        <div className="features-grid">

          <div className="feature-card">
            <div className="feature-icon">
              <ShieldCheck size={22} />
            </div>

            <h3>Secure Platform</h3>

            <p>
              Secure account and authentication management.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <Truck size={22} />
            </div>

            <h3>Reliable Delivery</h3>

            <p>
              Monitor order processing and delivery progress.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <RotateCcw size={22} />
            </div>

            <h3>Simple Returns</h3>

            <p>
              Manage return requests through the customer account.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <BarChart3 size={22} />
            </div>

            <h3>Business Analytics</h3>

            <p>
              Convert retail data into useful business information.
            </p>
          </div>

        </div>

      </section>
    </>
  );
}

export default Home;