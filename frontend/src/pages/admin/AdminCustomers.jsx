import { useEffect, useState } from "react";
import {
  Users,
  Search,
  ShoppingBag,
  IndianRupee,
  Eye,
} from "lucide-react";
import axios from "axios";

function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  // ======================================================
  // FETCH CUSTOMERS FROM DATABASE
  // ======================================================

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem(
        "retailhubToken"
      );

      if (!token) {
        setError("Admin login required.");
        setLoading(false);
        return;
      }

      const response = await axios.get(
        "http://localhost:5000/api/admin/customers",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCustomers(response.data.customers || []);

    } catch (err) {
      console.error(
        "Fetch Customers Error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to load customers."
      );
    } finally {
      setLoading(false);
    }
  };


  // ======================================================
  // LOAD CUSTOMERS
  // ======================================================

  useEffect(() => {
    fetchCustomers();
  }, []);


  // ======================================================
  // SEARCH
  // ======================================================

  const filteredCustomers = customers.filter(
    (customer) => {
      const text = search.toLowerCase();

      return (
        String(customer.name || "")
          .toLowerCase()
          .includes(text) ||

        String(customer.email || "")
          .toLowerCase()
          .includes(text) ||

        String(customer.phone || "")
          .toLowerCase()
          .includes(text) ||

        String(customer.city || "")
          .toLowerCase()
          .includes(text)
      );
    }
  );


  // ======================================================
  // SUMMARY
  // ======================================================

  const totalCustomers = customers.length;

  const totalCustomerOrders = customers.reduce(
    (sum, customer) =>
      sum + Number(customer.orders || 0),
    0
  );

  const totalCustomerSpending =
    customers.reduce(
      (sum, customer) =>
        sum +
        Number(customer.spending || 0),
      0
    );


  // ======================================================
  // CUSTOMER DETAILS
  // ======================================================

  const viewCustomer = (customer) => {
    alert(
      `Customer: ${customer.name}\n\n` +
      `Email: ${customer.email}\n` +
      `Phone: ${customer.phone || "Not provided"}\n` +
      `City: ${customer.city || "Not provided"}\n` +
      `Orders: ${customer.orders || 0}\n` +
      `Total Spending: ₹${Number(
        customer.spending || 0
      ).toLocaleString("en-IN")}`
    );
  };


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
              Customers
            </h1>

            <p>
              Understand your customers and their
              purchasing activity.
            </p>

          </div>

        </div>


        <div className="admin-panel">

          <div className="admin-empty">

            <Users size={40} />

            <h3>
              Loading customers...
            </h3>

            <p>
              Fetching customer information from the database.
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
              Customers
            </h1>

            <p>
              Understand your customers and their
              purchasing activity.
            </p>

          </div>

        </div>


        <div className="admin-panel">

          <div className="admin-empty">

            <Users size={40} />

            <h3>
              Unable to load customers
            </h3>

            <p>
              {error}
            </p>

            <button
              className="btn btn-primary"
              onClick={fetchCustomers}
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
            Customers
          </h1>

          <p>
            Understand your customers and their
            purchasing activity.
          </p>

        </div>

      </div>


      {/* CUSTOMER SUMMARY */}

      <div className="admin-stats-grid">

        {/* TOTAL CUSTOMERS */}

        <div className="admin-stat-card">

          <div className="admin-stat-icon blue">

            <Users size={22} />

          </div>

          <div>

            <span>
              Total Customers
            </span>

            <strong>
              {totalCustomers}
            </strong>

            <small>
              Registered customers
            </small>

          </div>

        </div>


        {/* TOTAL ORDERS */}

        <div className="admin-stat-card">

          <div className="admin-stat-icon orange">

            <ShoppingBag size={22} />

          </div>

          <div>

            <span>
              Total Orders
            </span>

            <strong>
              {totalCustomerOrders}
            </strong>

            <small>
              Customer purchases
            </small>

          </div>

        </div>


        {/* TOTAL SPENDING */}

        <div className="admin-stat-card">

          <div className="admin-stat-icon green">

            <IndianRupee size={22} />

          </div>

          <div>

            <span>
              Customer Spending
            </span>

            <strong>
              ₹
              {totalCustomerSpending.toLocaleString(
                "en-IN"
              )}
            </strong>

            <small>
              Total order value
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
            placeholder="Search customer name, email or phone..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

      </div>


      {/* CUSTOMER TABLE */}

      <div className="admin-panel">

        <div className="admin-panel-header">

          <div>

            <h2>
              Customer List
            </h2>

            <p>
              {filteredCustomers.length} customer
              {filteredCustomers.length !== 1
                ? "s"
                : ""}{" "}
              found
            </p>

          </div>

        </div>


        {filteredCustomers.length === 0 ? (

          <div className="admin-empty">

            <Users size={40} />

            <h3>
              No customers found
            </h3>

            <p>
              Registered customers will appear here.
            </p>

          </div>

        ) : (

          <div className="admin-table-wrapper">

            <table className="admin-table">

              <thead>

                <tr>

                  <th>
                    Customer
                  </th>

                  <th>
                    Phone
                  </th>

                  <th>
                    City
                  </th>

                  <th>
                    Orders
                  </th>

                  <th>
                    Total Spending
                  </th>

                  <th>
                    Activity
                  </th>

                </tr>

              </thead>


              <tbody>

                {filteredCustomers.map(
                  (customer) => (

                    <tr
                      key={customer.id}
                    >

                      {/* CUSTOMER */}

                      <td>

                        <div className="table-customer">

                          <strong>
                            {customer.name ||
                              "Customer"}
                          </strong>

                          <span>
                            {customer.email}
                          </span>

                        </div>

                      </td>


                      {/* PHONE */}

                      <td>
                        {customer.phone ||
                          "Not provided"}
                      </td>


                      {/* CITY */}

                      <td>
                        {customer.city ||
                          "Not provided"}
                      </td>


                      {/* ORDERS */}

                      <td>

                        <strong>
                          {customer.orders || 0}
                        </strong>

                      </td>


                      {/* SPENDING */}

                      <td>

                        <strong>
                          ₹
                          {Number(
                            customer.spending || 0
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </strong>

                      </td>


                      {/* ACTIVITY */}

                      <td>

                        <button
                          className="table-view-button"
                          onClick={() =>
                            viewCustomer(
                              customer
                            )
                          }
                        >

                          <Eye size={15} />

                          View

                        </button>

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

            <Users size={24} />

          </div>

          <div>

            <span className="eyebrow">
              CUSTOMER INSIGHT
            </span>

            <h2>
              Customer activity helps the business
              understand purchasing behaviour
            </h2>

            <p>
              Customer order history can be used to
              identify purchasing patterns, repeat
              customers and spending behaviour. This
              information will later be used in the
              Analytics and Decision Support modules.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default AdminCustomers;