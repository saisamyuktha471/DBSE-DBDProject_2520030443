import { useEffect, useState } from "react";
import {
  Package,
  RotateCcw,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";

function Returns() {
  const [showForm, setShowForm] = useState(false);
  const [returns, setReturns] = useState([]);

  const [formData, setFormData] = useState({
    orderId: "",
    product: "",
    reason: "",
  });

  // Load previous return requests
  useEffect(() => {
    const savedReturns =
      JSON.parse(
        localStorage.getItem("retailhubReturns")
      ) || [];

    setReturns(savedReturns);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const submitReturn = (e) => {
    e.preventDefault();

    const newReturn = {
      id: `RET${Date.now()
        .toString()
        .slice(-8)}`,

      orderId: formData.orderId,

      product: formData.product,

      reason: formData.reason,

      date: new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),

      status: "Processing",

      statusType: "processing",
    };

    const updatedReturns = [
      newReturn,
      ...returns,
    ];

    setReturns(updatedReturns);

    localStorage.setItem(
      "retailhubReturns",
      JSON.stringify(updatedReturns)
    );

    setFormData({
      orderId: "",
      product: "",
      reason: "",
    });

    setShowForm(false);

    alert("Return request submitted successfully.");
  };

  return (
    <div className="standard-page">

      {/* HEADER */}

      <div className="page-header">

        <div>

          <span className="eyebrow">
            CUSTOMER SERVICE
          </span>

          <h1>Returns</h1>

          <p>
            Manage your product returns and track
            return requests.
          </p>

        </div>

        <button
          className="primary-button"
          onClick={() =>
            setShowForm(!showForm)
          }
        >
          <RotateCcw size={18} />
          Request a Return
        </button>

      </div>

      {/* RETURN FORM */}

      {showForm && (

        <section className="return-form-card">

          <div className="details-heading">

            <div className="details-heading-icon">
              <RotateCcw size={20} />
            </div>

            <div>

              <h2>
                Request Product Return
              </h2>

              <p>
                Provide the details of the product
                you want to return.
              </p>

            </div>

          </div>

          <form onSubmit={submitReturn}>

            <div className="form-grid">

              <div className="form-group">

                <label>
                  Order ID
                </label>

                <input
                  type="text"
                  name="orderId"
                  placeholder="Example: RH20260913001"
                  value={formData.orderId}
                  onChange={handleChange}
                  required
                />

              </div>

              <div className="form-group">

                <label>
                  Product Name
                </label>

                <input
                  type="text"
                  name="product"
                  placeholder="Enter product name"
                  value={formData.product}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>

            <div className="form-group">

              <label>
                Reason for Return
              </label>

              <select
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                required
              >

                <option value="">
                  Select a reason
                </option>

                <option value="Product damaged">
                  Product damaged
                </option>

                <option value="Wrong product received">
                  Wrong product received
                </option>

                <option value="Size issue">
                  Size issue
                </option>

                <option value="Product not suitable">
                  Product not suitable
                </option>

                <option value="Other">
                  Other
                </option>

              </select>

            </div>

            <div className="return-form-actions">

              <button
                type="button"
                className="outline-button"
                onClick={() =>
                  setShowForm(false)
                }
              >
                Cancel
              </button>

              <button
                type="submit"
                className="primary-button"
              >
                Submit Return Request
              </button>

            </div>

          </form>

        </section>
      )}

      {/* RETURN INFORMATION */}

      <div className="return-info-grid">

        <div className="return-info-card">

          <div className="return-info-icon">
            <Package size={21} />
          </div>

          <div>

            <h3>
              Easy Returns
            </h3>

            <p>
              Submit a return request for eligible
              products.
            </p>

          </div>

        </div>

        <div className="return-info-card">

          <div className="return-info-icon">
            <Clock size={21} />
          </div>

          <div>

            <h3>
              Track Requests
            </h3>

            <p>
              Check the current status of your
              return request.
            </p>

          </div>

        </div>

        <div className="return-info-card">

          <div className="return-info-icon">
            <CheckCircle size={21} />
          </div>

          <div>

            <h3>
              Quick Processing
            </h3>

            <p>
              Approved requests move through the
              return process.
            </p>

          </div>

        </div>

      </div>

      {/* RETURN HISTORY */}

      <section className="returns-section">

        <div className="section-heading-row">

          <div>

            <h2>
              Return History
            </h2>

            <p>
              Your previous and current return
              requests.
            </p>

          </div>

          <span className="return-count">
            {returns.length}{" "}
            {returns.length === 1
              ? "Request"
              : "Requests"}
          </span>

        </div>

        {returns.length === 0 ? (

          <div className="empty-state">

            <RotateCcw size={42} />

            <h2>
              No return requests
            </h2>

            <p>
              Your return requests will appear
              here.
            </p>

          </div>

        ) : (

          <div className="returns-list">

            {returns.map((item) => (

              <div
                className="return-card"
                key={item.id}
              >

                <div className="return-main">

                  <div className="return-product-icon">
                    <Package size={22} />
                  </div>

                  <div className="return-product-info">

                    <span className="return-id">
                      {item.id}
                    </span>

                    <h3>
                      {item.product}
                    </h3>

                    <p>
                      Order: {item.orderId}
                    </p>

                    <p>
                      Reason: {item.reason}
                    </p>

                    <span className="return-date">
                      Requested on {item.date}
                    </span>

                  </div>

                </div>

                <div
                  className={`return-status ${
                    item.statusType
                  }`}
                >

                  {item.statusType ===
                  "approved" ? (
                    <CheckCircle size={17} />
                  ) : (
                    <Clock size={17} />
                  )}

                  {item.status}

                </div>

              </div>

            ))}

          </div>

        )}

      </section>

      {/* RETURN POLICY */}

      <div className="return-policy">

        <AlertCircle size={20} />

        <div>

          <strong>
            Return Policy
          </strong>

          <p>
            Return eligibility depends on the
            product and order conditions. Return
            requests are reviewed before approval.
          </p>

        </div>

      </div>

    </div>
  );
}

export default Returns;