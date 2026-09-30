import { useEffect, useState } from "react";
import {
  Package,
  Plus,
  Search,
  Edit,
  Trash2,
  X,
} from "lucide-react";
import axios from "axios";

function AdminProducts() {
  const [products, setProducts] = useState([]);

  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [editingProduct, setEditingProduct] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    category: "Electronics",
    price: "",
    stock: "",
    image: "",
    description: "",
    rating: "",
  });


  // ======================================================
  // FETCH PRODUCTS
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
      console.error("Fetch Products Error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load products."
      );
    } finally {
      setLoading(false);
    }
  };


  // ======================================================
  // LOAD PRODUCTS WHEN PAGE OPENS
  // ======================================================

  useEffect(() => {
    fetchProducts();
  }, []);


  // ======================================================
  // FORM CHANGE
  // ======================================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


  // ======================================================
  // RESET FORM
  // ======================================================

  const resetForm = () => {
    setFormData({
      name: "",
      category: "Electronics",
      price: "",
      stock: "",
      image: "",
      description: "",
      rating: "",
    });

    setEditingProduct(null);
    setShowForm(false);
  };


  // ======================================================
  // ADD / UPDATE PRODUCT
  // ======================================================

  const saveProduct = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      formData.price === "" ||
      formData.stock === ""
    ) {
      alert("Please fill all required product details.");
      return;
    }

    try {
      const token = localStorage.getItem(
        "retailhubToken"
      );

      if (!token) {
        alert("Admin login required.");
        return;
      }

      const productData = {
        name: formData.name,
        category: formData.category,
        price: Number(formData.price),
        stock: Number(formData.stock),
        image: formData.image || null,
        description: formData.description || null,
        rating:
          formData.rating === ""
            ? 0
            : Number(formData.rating),
      };


      // UPDATE PRODUCT

      if (editingProduct) {
        await axios.put(
          `http://localhost:5000/api/products/${editingProduct.id}`,
          productData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        alert("Product updated successfully.");

      }

      // ADD PRODUCT

      else {
        await axios.post(
          "http://localhost:5000/api/products",
          productData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        alert("Product added successfully.");
      }


      // Reload products from database

      await fetchProducts();

      resetForm();

    } catch (err) {
      console.error("Save Product Error:", err);

      alert(
        err.response?.data?.message ||
          "Failed to save product."
      );
    }
  };


  // ======================================================
  // EDIT PRODUCT
  // ======================================================

  const editProduct = (product) => {
    setEditingProduct(product);

    setFormData({
      name: product.name || "",
      category: product.category || "Electronics",
      price: product.price ?? "",
      stock: product.stock ?? "",
      image: product.image || "",
      description: product.description || "",
      rating: product.rating ?? "",
    });

    setShowForm(true);
  };


  // ======================================================
  // DELETE PRODUCT
  // ======================================================

  const deleteProduct = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const token = localStorage.getItem(
        "retailhubToken"
      );

      if (!token) {
        alert("Admin login required.");
        return;
      }

      await axios.delete(
        `http://localhost:5000/api/products/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProducts((previousProducts) =>
        previousProducts.filter(
          (product) => product.id !== id
        )
      );

      alert("Product deleted successfully.");

    } catch (err) {
      console.error("Delete Product Error:", err);

      alert(
        err.response?.data?.message ||
          "Failed to delete product."
      );
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
  // SUMMARY
  // ======================================================

  const totalStock = products.reduce(
    (sum, product) =>
      sum + Number(product.stock || 0),
    0
  );

  const lowStock = products.filter(
    (product) =>
      Number(product.stock || 0) <= 10
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

            <h1>Products</h1>

            <p>
              Manage your product catalog, prices and
              available stock.
            </p>
          </div>

        </div>

        <div className="admin-panel">

          <div className="admin-empty">

            <Package size={40} />

            <h3>
              Loading products...
            </h3>

            <p>
              Fetching products from the database.
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

            <h1>Products</h1>

            <p>
              Manage your product catalog, prices and
              available stock.
            </p>
          </div>

        </div>

        <div className="admin-panel">

          <div className="admin-empty">

            <Package size={40} />

            <h3>
              Unable to load products
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


  // ======================================================
  // MAIN PAGE
  // ======================================================

  return (
    <div className="standard-page">

      {/* HEADER */}

      <div className="page-header">

        <div>

          <span className="eyebrow">
            BUSINESS MANAGEMENT
          </span>

          <h1>
            Products
          </h1>

          <p>
            Manage your product catalog, prices and
            available stock.
          </p>

        </div>


        <button
          className="btn btn-primary"
          onClick={() => {
            if (showForm) {
              resetForm();
            } else {
              setShowForm(true);
            }
          }}
        >

          {showForm ? (
            <X size={17} />
          ) : (
            <Plus size={17} />
          )}

          {showForm
            ? "Close"
            : "Add Product"}

        </button>

      </div>


      {/* PRODUCT SUMMARY */}

      <div className="admin-stats-grid">

        {/* TOTAL PRODUCTS */}

        <div className="admin-stat-card">

          <div className="admin-stat-icon blue">

            <Package size={22} />

          </div>

          <div>

            <span>
              Total Products
            </span>

            <strong>
              {products.length}
            </strong>

            <small>
              Products in catalog
            </small>

          </div>

        </div>


        {/* AVAILABLE STOCK */}

        <div className="admin-stat-card">

          <div className="admin-stat-icon green">

            <Package size={22} />

          </div>

          <div>

            <span>
              Available Stock
            </span>

            <strong>
              {totalStock}
            </strong>

            <small>
              Total units
            </small>

          </div>

        </div>


        {/* LOW STOCK */}

        <div className="admin-stat-card">

          <div className="admin-stat-icon orange">

            <Package size={22} />

          </div>

          <div>

            <span>
              Low Stock
            </span>

            <strong>
              {lowStock}
            </strong>

            <small>
              Need attention
            </small>

          </div>

        </div>

      </div>


      {/* ADD / EDIT PRODUCT FORM */}

      {showForm && (

        <div className="admin-panel">

          <div className="admin-panel-header">

            <div>

              <h2>
                {editingProduct
                  ? "Edit Product"
                  : "Add New Product"}
              </h2>

              <p>
                {editingProduct
                  ? "Update the product information below."
                  : "Enter the product information below."}
              </p>

            </div>

          </div>


          <form
            className="form-grid"
            onSubmit={saveProduct}
          >

            {/* PRODUCT NAME */}

            <div className="form-group">

              <label>
                Product Name
              </label>

              <input
                type="text"
                name="name"
                placeholder="Enter product name"
                value={formData.name}
                onChange={handleChange}
              />

            </div>


            {/* CATEGORY */}

            <div className="form-group">

              <label>
                Category
              </label>

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
              >

                <option value="Electronics">
                  Electronics
                </option>

                <option value="Fashion">
                  Fashion
                </option>

                <option value="Home">
                  Home
                </option>

              </select>

            </div>


            {/* PRICE */}

            <div className="form-group">

              <label>
                Price
              </label>

              <input
                type="number"
                name="price"
                min="0"
                placeholder="Enter price"
                value={formData.price}
                onChange={handleChange}
              />

            </div>


            {/* STOCK */}

            <div className="form-group">

              <label>
                Stock Quantity
              </label>

              <input
                type="number"
                name="stock"
                min="0"
                placeholder="Enter stock"
                value={formData.stock}
                onChange={handleChange}
              />

            </div>


            {/* IMAGE */}

            <div className="form-group">

              <label>
                Image URL
              </label>

              <input
                type="text"
                name="image"
                placeholder="Enter image URL"
                value={formData.image}
                onChange={handleChange}
              />

            </div>


            {/* RATING */}

            <div className="form-group">

              <label>
                Rating
              </label>

              <input
                type="number"
                name="rating"
                min="0"
                max="5"
                step="0.1"
                placeholder="Example: 4.5"
                value={formData.rating}
                onChange={handleChange}
              />

            </div>


            {/* DESCRIPTION */}

            <div
              className="form-group"
              style={{
                gridColumn: "1 / -1",
              }}
            >

              <label>
                Description
              </label>

              <textarea
                name="description"
                placeholder="Enter product description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
              />

            </div>


            {/* BUTTONS */}

            <div
              className="form-group"
              style={{
                display: "flex",
                gap: "10px",
                alignItems: "end",
              }}
            >

              <button
                type="submit"
                className="btn btn-primary"
              >

                {editingProduct ? (
                  <Edit size={17} />
                ) : (
                  <Plus size={17} />
                )}

                {editingProduct
                  ? "Update Product"
                  : "Save Product"}

              </button>


              {editingProduct && (

                <button
                  type="button"
                  className="btn"
                  onClick={resetForm}
                >
                  Cancel
                </button>

              )}

            </div>

          </form>

        </div>

      )}


      {/* SEARCH */}

      <div className="products-toolbar">

        <div className="product-search">

          <Search size={18} />

          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

      </div>


      {/* PRODUCTS TABLE */}

      <div className="admin-panel">

        <div className="admin-panel-header">

          <div>

            <h2>
              Product Catalog
            </h2>

            <p>
              {filteredProducts.length} product
              {filteredProducts.length !== 1
                ? "s"
                : ""}{" "}
              found
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
              Add a product or change your search.
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
                    Stock
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

                {filteredProducts.map(
                  (product) => (

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


                      {/* STOCK */}

                      <td>
                        {product.stock}
                      </td>


                      {/* STATUS */}

                      <td>

                        <span
                          className="admin-status"
                          style={{
                            background:
                              Number(
                                product.stock
                              ) <= 10
                                ? "#fff7ed"
                                : "#f0fdf4",

                            color:
                              Number(
                                product.stock
                              ) <= 10
                                ? "#f97316"
                                : "#16a34a",
                          }}
                        >

                          {Number(
                            product.stock
                          ) <= 10
                            ? "Low Stock"
                            : "In Stock"}

                        </span>

                      </td>


                      {/* ACTION */}

                      <td>

                        <div
                          style={{
                            display: "flex",
                            gap: "8px",
                          }}
                        >

                          {/* EDIT */}

                          <button
                            className="table-view-button"
                            onClick={() =>
                              editProduct(
                                product
                              )
                            }
                          >

                            <Edit size={15} />

                            Edit

                          </button>


                          {/* DELETE */}

                          <button
                            className="table-view-button"
                            onClick={() =>
                              deleteProduct(
                                product.id
                              )
                            }
                            style={{
                              color: "#dc2626",
                              background:
                                "#fef2f2",
                              border: "none",
                              cursor: "pointer",
                            }}
                          >

                            <Trash2 size={15} />

                            Delete

                          </button>

                        </div>

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

export default AdminProducts;