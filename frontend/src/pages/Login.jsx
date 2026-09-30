import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        }
      );

      // Save JWT token
      localStorage.setItem(
        "retailhubToken",
        response.data.token
      );

      // Save customer information
      localStorage.setItem(
        "retailhubUser",
        JSON.stringify(response.data.user)
      );

      // Mark customer as logged in
      localStorage.setItem(
        "retailhubLoggedIn",
        "true"
      );

      // Go to home page
      navigate("/");

    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="customer-login-page">

      <div className="customer-login-card">

        {/* LOGO */}
        <div className="login-logo-icon">
          R
        </div>

        <h1>RetailHub</h1>

        <p className="login-subtitle">
          Shopping & Retail
        </p>

        <h2>Customer Login</h2>

        <p className="login-description">
          Login to access your RetailHub account
        </p>

        {/* LOGIN FORM */}
        <form onSubmit={handleLogin}>

          <label>
            Email
          </label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>
            Password
          </label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="customer-login-button"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        {/* CREATE ACCOUNT */}
        <div className="create-account-section">

          <span>
            Don't have an account?
          </span>

          <Link to="/register">
            Create Account
          </Link>

        </div>

        {/* BUSINESS LOGIN */}
        <div className="business-login-section">

          <div className="business-login-title">
            Business / Admin?
          </div>

          <Link
            to="/admin-login"
            className="business-login-button"
          >
            Login to Business Portal
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Login;