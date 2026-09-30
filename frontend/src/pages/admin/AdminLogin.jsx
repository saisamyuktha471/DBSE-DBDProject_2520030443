import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await axios.post(
        "http://localhost:5000/api/auth/admin-login",
        {
          email,
          password,
        }
      );

      const { token, user } = response.data;

      // Save the real JWT token
      localStorage.setItem(
        "retailhubToken",
        token
      );

      // Save admin login state
      localStorage.setItem(
        "retailhubAdminLoggedIn",
        "true"
      );

      // Save admin user information
      localStorage.setItem(
        "retailhubUser",
        JSON.stringify(user)
      );

      // Go to admin dashboard
      navigate("/admin");

    } catch (err) {
      console.error(
        "Admin Login Error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Invalid business admin email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">

      <div className="admin-login-card">

        <div className="admin-login-icon">
          R
        </div>

        <h1>
          RetailHub
        </h1>

        <p className="admin-login-subtitle">
          Business Administration Portal
        </p>

        <div className="admin-login-divider"></div>

        <h2>
          Business Admin Login
        </h2>

        <p className="admin-login-description">
          Login to manage orders, inventory, customers,
          returns and retail analytics.
        </p>

        <form onSubmit={handleLogin}>

          <label>
            Email Address
          </label>

          <input
            type="email"
            placeholder="admin@retailhub.com"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
          />

          <label>
            Password
          </label>

          <input
            type="password"
            placeholder="Enter admin password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
          />

          {error && (
            <div className="admin-login-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="admin-login-button"
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : "Login to Business Portal"}
          </button>

        </form>

        <Link
          to="/login"
          className="admin-customer-link"
        >
          ← Go to Customer Login
        </Link>

      </div>

    </div>
  );
}

export default AdminLogin;