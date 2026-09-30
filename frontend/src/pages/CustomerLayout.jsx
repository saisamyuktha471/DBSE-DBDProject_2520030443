import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function CustomerLayout() {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("retailhubLoggedIn") === "true"
  );

  useEffect(() => {
    const checkLogin = () => {
      setIsLoggedIn(
        localStorage.getItem("retailhubLoggedIn") === "true"
      );
    };

    window.addEventListener("storage", checkLogin);

    return () => {
      window.removeEventListener("storage", checkLogin);
    };
  }, []);

  const logout = () => {
    localStorage.removeItem("retailhubLoggedIn");
    localStorage.removeItem("retailhubToken");
    localStorage.removeItem("retailhubUser");

    setIsLoggedIn(false);

    navigate("/login");
  };

  return (
    <div className="customer-layout">

      {/* NAVBAR */}
      <header className="customer-navbar">

        {/* LOGO */}
        <div
          className="customer-logo"
          onClick={() => navigate("/")}
        >
          <div className="customer-logo-icon">
            R
          </div>

          <div>
            <div className="customer-logo-name">
              RetailHub
            </div>

            <div className="customer-logo-subtitle">
              Shopping & Retail
            </div>
          </div>
        </div>

        {/* NAVIGATION */}
        <nav className="customer-navigation">

          {/* Always visible */}
          <NavLink
            to="/"
            end
            className="customer-nav-link"
          >
            Home
          </NavLink>

          <NavLink
            to="/products"
            className="customer-nav-link"
          >
            Products
          </NavLink>

          {/* Visible only after login */}
          {isLoggedIn && (
            <>
              <NavLink
                to="/cart"
                className="customer-nav-link"
              >
                Cart
              </NavLink>

              <NavLink
                to="/my-orders"
                className="customer-nav-link"
              >
                My Orders
              </NavLink>

              <NavLink
                to="/returns"
                className="customer-nav-link"
              >
                Returns
              </NavLink>

              <NavLink
                to="/rewards"
                className="customer-nav-link"
              >
                Rewards
              </NavLink>

              <NavLink
                to="/profile"
                className="customer-nav-link"
              >
                Profile
              </NavLink>

              <button
                className="customer-logout"
                onClick={logout}
              >
                Logout
              </button>
            </>
          )}

          {/* Visible only before login */}
          {!isLoggedIn && (
            <NavLink
              to="/login"
              className="customer-nav-link"
            >
              Login
            </NavLink>
          )}

        </nav>
      </header>

      {/* PAGE CONTENT */}
      <main className="customer-page-content">
        <Outlet />
      </main>

    </div>
  );
}

export default CustomerLayout;