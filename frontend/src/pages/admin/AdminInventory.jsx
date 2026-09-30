import { useEffect, useState } from "react";
import {
  Package,
  AlertTriangle,
  Boxes,
  IndianRupee,
  Search,
} from "lucide-react";
import axios from "axios";

function AdminInventory() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);


  // ======================================================
  // FETCH PRODUCTS FROM DATABASE
  // ======================================================

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        "http://localhost:5000/api/products"
      );

      setProducts(response.data || []);

    } catch (err) {
      console.error("Fetch Inventory Error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load inventory."
      );
    } finally {
      setLoading(false);
    }
  };


  // ======================================================
  // LOAD INVENTORY WHEN PAGE OPENS
  // ======================================================

  useEffect(() => {
    fetchProducts();
  }, []);


  // ======================================================
  // UPDATE STOCK IN DATABASE
  // ======================================================

  const updateStock = async (id, value) => {
    const newStock = Math.max(
      0,
      Number(value) || 0
    );

    try {
      const token = localStorage.getItem(
        "retailhubToken"
      );

      if (!token) {
        alert("Admin login required.");
        return;
      }

      setUpdatingId(id);

      await axios.put(
        `http://localhost:5000/api/products/${id}`,
        {
          stock: newStock,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update the screen after successful database update

      setProducts((previousProducts) =>
        previousProducts.map((product) =>
          product.id === id
            ? {
                ...product,
                stock: newStock,
              }
            : product
        )
      );

    } catch (err) {
      console.error(
        "Update Stock Error:",
        err
      );

      alert(
        err.response?.data?.message ||
          "Failed to update stock."
      );

    } finally {
      setUpdatingId(null);
    }
  };


  // ======================================================
  // SEARCH
  // ======================================================

  const filteredProducts = products.filter(
    (product) =>
      `${product.name} ${product.category}`
        .toLowerCase()
        .includes(search.toLowerCase())
  );


  // ======================================================
  // INVENTORY CALCULATIONS
  // ======================================================

  const totalUnits = products.reduce(
    (sum, product) =>
      sum + Number(product.stock || 0),
    0
  );


  const lowStock = products.filter(
    (product) =>
      Number(product.stock || 0) > 0 &&
      Number(product.stock || 0) <= 10
  ).length;


  const outOfStock = products.filter(
    (product) =>
      Number(product.stock || 0) === 0
  ).length;


  const inventoryValue = products.reduce(
    (sum, product) =>
      sum +
      Number(product.price || 0) *
        Number(product.stock || 0),
    0
  );


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

            <h1>
              Inventory
            </h1>

            <p>
              Monitor product stock levels and identify
              products that need restocking.
            </p>

          </div>

        </div>


        <div className="admin-panel">

          <div className="admin-empty">

            <Package size={40} />

            <h3>
              Loading inventory...
            </h3>

            <p>
              Fetching stock information from the database.
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

            <h1>
              Inventory
            </h1>

            <p>
              Monitor product stock levels and identify
              products that need restocking.
            </p>

          </div>

        </div>


        <div className="admin-panel">

          <div className="admin-empty">

            <Package size={40} />

            <h3>
              Unable to load inventory
            </h3>

            <p>
              {error}
            </p>

            <button
              className="btn btn-primary"
              onClick={fetchProducts}
            >
              Try Again
            </button>

          </div>

        </div>

      </div>
    );
  }


  return (
    <div className="standard-page">

      {/* HEADER */}

      <div className="page-header">

        <div>

          <span className="eyebrow">
            BUSINESS MANAGEMENT
          </span>

          <h1>
            Inventory
          </h1>

          <p>
            Monitor product stock levels and identify
            products that need restocking.
          </p>

        </div>

      </div>


      {/* INVENTORY SUMMARY */}

      <div className="admin-stats-grid">

        {/* TOTAL UNITS */}

        <div className="admin-stat-card">

          <div className="admin-stat-icon blue">

            <Boxes size={22} />

          </div>

          <div>

            <span>
              Total Units
            </span>

            <strong>
              {totalUnits}
            </strong>

            <small>
              Units currently available
            </small>

          </div>

        </div>


        {/* LOW STOCK */}

        <div className="admin-stat-card">

          <div className="admin-stat-icon orange">

            <AlertTriangle size={22} />

          </div>

          <div>

            <span>
              Low Stock
            </span>

            <strong>
              {lowStock}
            </strong>

            <small>
              Products below stock level
            </small>

          </div>

        </div>


        {/* OUT OF STOCK */}

        <div className="admin-stat-card">

          <div className="admin-stat-icon red">

            <Package size={22} />

          </div>

          <div>

            <span>
              Out of Stock
            </span>

            <strong>
              {outOfStock}
            </strong>

            <small>
              Products unavailable
            </small>

          </div>

        </div>


        {/* INVENTORY VALUE */}

        <div className="admin-stat-card">

          <div className="admin-stat-icon green">

            <IndianRupee size={22} />

          </div>

          <div>

            <span>
              Inventory Value
            </span>

            <strong>
              ₹
              {inventoryValue.toLocaleString(
                "en-IN"
              )}
            </strong>

            <small>
              Value of available stock
            </small>

          </div>

        </div>

      </div>


      {/* SEARCH */}

      <div className="products-toolbar">

        <div className="product-search">

          <Search size={18} />

          <input
            type="text"
            placeholder="Search products or categories..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

      </div>


      {/* INVENTORY TABLE */}

      <div className="admin-panel">

        <div className="admin-panel-header">

          <div>

            <h2>
              Stock Management
            </h2>

            <p>
              Update stock quantities directly.
            </p>

          </div>

        </div>


        {filteredProducts.length === 0 ? (

          <div className="admin-empty">

            <Package size={40} />

            <h3>
              No products found
            </h3>

            <p>
              Add products from the Admin Products page.
            </p>

          </div>

        ) : (

          <div className="admin-table-wrapper">

            <table className="admin-table">

              <thead>

                <tr>

                  <th>
                    Product
                  </th>

                  <th>
                    Category
                  </th>

                  <th>
                    Price
                  </th>

                  <th>
                    Current Stock
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Update Stock
                  </th>

                </tr>

              </thead>


              <tbody>

                {filteredProducts.map(
                  (product) => {

                    const stock =
                      Number(product.stock) || 0;

                    let status = "In Stock";

                    if (stock === 0) {
                      status = "Out of Stock";
                    } else if (stock <= 10) {
                      status = "Low Stock";
                    }


                    return (

                      <tr key={product.id}>

                        {/* PRODUCT */}

                        <td>

                          <strong>
                            {product.name}
                          </strong>

                        </td>


                        {/* CATEGORY */}

                        <td>
                          {product.category}
                        </td>


                        {/* PRICE */}

                        <td>

                          ₹
                          {Number(
                            product.price || 0
                          ).toLocaleString(
                            "en-IN"
                          )}

                        </td>


                        {/* CURRENT STOCK */}

                        <td>

                          <strong>
                            {stock}
                          </strong>

                        </td>


                        {/* STATUS */}

                        <td>

                          <span
                            className="admin-status"
                            style={{
                              background:
                                stock === 0
                                  ? "#fef2f2"
                                  : stock <= 10
                                  ? "#fff7ed"
                                  : "#f0fdf4",

                              color:
                                stock === 0
                                  ? "#dc2626"
                                  : stock <= 10
                                  ? "#f97316"
                                  : "#16a34a",
                            }}
                          >

                            {status}

                          </span>

                        </td>


                        {/* UPDATE STOCK */}

                        <td>

                          <input
                            type="number"
                            min="0"
                            value={stock}
                            disabled={
                              updatingId ===
                              product.id
                            }
                            onChange={(e) =>
                              updateStock(
                                product.id,
                                e.target.value
                              )
                            }
                            style={{
                              width: "90px",
                              padding: "8px 10px",
                              border:
                                "1px solid #cbd5e1",
                              borderRadius: "8px",
                              outline: "none",
                              opacity:
                                updatingId ===
                                product.id
                                  ? 0.6
                                  : 1,
                            }}
                          />

                          {updatingId ===
                            product.id && (
                            <small
                              style={{
                                marginLeft: "8px",
                                color: "#64748b",
                              }}
                            >
                              Saving...
                            </small>
                          )}

                        </td>

                      </tr>

                    );
                  }
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>


      {/* BUSINESS INFORMATION */}

      <div className="admin-business-summary">

        <div className="business-summary-content">

          <div className="business-summary-icon">

            <AlertTriangle size={24} />

          </div>

          <div>

            <span className="eyebrow">
              INVENTORY INSIGHT
            </span>

            <h2>
              Monitor stock before products run out
            </h2>

            <p>
              Low-stock information helps the business
              identify products that may require
              restocking. This information can later be
              combined with sales and order data to
              support better inventory decisions.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default AdminInventory;