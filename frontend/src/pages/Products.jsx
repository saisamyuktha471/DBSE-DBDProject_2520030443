import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Products() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get(
          "http://localhost:5000/api/products"
        );

        setProducts(response.data);
      } catch (error) {
        console.error("Failed to fetch products:", error);

        setError(
          "Unable to load products. Please make sure the backend is running."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    let categoryMatch = true;

    if (category !== "All") {
      if (category === "Home") {
        categoryMatch =
          product.category === "Home" ||
          product.category === "Home & Kitchen";
      } else {
        categoryMatch = product.category === category;
      }
    }

    const searchMatch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());

    return categoryMatch && searchMatch;
  });

  const addToCart = (product) => {
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
              quantity: item.quantity + 1,
            }
          : item
      );
    } else {
      updatedCart = [
        ...existingCart,
        {
          ...product,
          quantity: 1,
        },
      ];
    }

    localStorage.setItem(
      "retailhubCart",
      JSON.stringify(updatedCart)
    );

    alert(`${product.name} added to cart`);
  };

  return (
    <div className="standard-page">

      <div className="page-header">
        <div>
          <span className="eyebrow">RETAILHUB SHOPPING</span>

          <h1>Products</h1>

          <p>
            Explore our products and add your favourites to the cart.
          </p>
        </div>

        <Link to="/cart" className="btn btn-primary">
          View Cart
        </Link>
      </div>

      <div className="products-toolbar">

        <input
          type="text"
          className="product-search"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="category-buttons">

          {["All", "Electronics", "Fashion", "Home"].map(
            (item) => (
              <button
                key={item}
                className={
                  category === item
                    ? "category-button active"
                    : "category-button"
                }
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            )
          )}

        </div>

      </div>

      {loading && (
        <div className="admin-empty">
          Loading products...
        </div>
      )}

      {error && (
        <div className="login-error">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="products-result">
            Showing {filteredProducts.length} products
          </div>

          <div className="product-grid">

            {filteredProducts.map((product) => (

              <div
                className="product-card"
                key={product.id}
              >

                <div className="product-image">
                  <img
                    src={product.image}
                    alt={product.name}
                  />
                </div>

                <div className="product-info">

                  <div className="product-category">
                    {product.category}
                  </div>

                  <h3 className="product-name">
                    {product.name}
                  </h3>

                  <div className="product-price">

                    <span className="current-price">
                      ₹{Number(product.price).toLocaleString("en-IN")}
                    </span>

                  </div>

                  <div className="product-actions">

                    <button
                      className="btn btn-primary"
                      onClick={() => addToCart(product)}
                    >
                      Add to Cart
                    </button>

                    <Link
                      to={`/product-details?id=${product.id}`}
                      className="btn btn-secondary"
                    >
                      View Details
                    </Link>

                  </div>

                </div>

              </div>

            ))}

          </div>

          {filteredProducts.length === 0 && (
            <div className="admin-empty">
              No products found.
            </div>
          )}
        </>
      )}

    </div>
  );
}

export default Products;