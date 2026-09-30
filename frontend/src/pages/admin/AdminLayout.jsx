import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Boxes,
  Users,
  RotateCcw,
  BarChart3,
  Lightbulb,
  LogOut,
  Store,
} from "lucide-react";

function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove admin authentication data
    localStorage.removeItem("retailhubToken");
    localStorage.removeItem("retailhubAdminLoggedIn");
    localStorage.removeItem("retailhubUser");

    // Return to admin login
    navigate("/admin-login");
  };

  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: LayoutDashboard,
    },
    {
      name: "Orders",
      path: "/admin/orders",
      icon: ShoppingBag,
    },
    {
      name: "Products",
      path: "/admin/products",
      icon: Package,
    },
    {
      name: "Inventory",
      path: "/admin/inventory",
      icon: Boxes,
    },
    {
      name: "Customers",
      path: "/admin/customers",
      icon: Users,
    },
    {
      name: "Returns",
      path: "/admin/returns",
      icon: RotateCcw,
    },
    {
      name: "Analytics",
      path: "/admin/analytics",
      icon: BarChart3,
    },
    {
      name: "Decision Support",
      path: "/admin/decision-support",
      icon: Lightbulb,
    },
  ];

  return (
    <div className="admin-layout">

      {/* SIDEBAR */}

      <aside className="admin-sidebar">

        {/* LOGO */}

        <div className="admin-brand">

          <div className="admin-brand-icon">
            <Store size={22} />
          </div>

          <div>
            <strong>RetailHub</strong>
            <span>Business Portal</span>
          </div>

        </div>


        {/* NAVIGATION */}

        <nav className="admin-navigation">

          <span className="admin-nav-label">
            BUSINESS MANAGEMENT
          </span>

          {menuItems.map((item) => {

            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/admin"}
                className={({ isActive }) =>
                  `admin-nav-item ${
                    isActive ? "active" : ""
                  }`
                }
              >

                <Icon size={19} />

                <span>
                  {item.name}
                </span>

              </NavLink>
            );

          })}

        </nav>


        {/* SIDEBAR BOTTOM */}

        <div className="admin-sidebar-bottom">

          <div className="admin-user-box">

            <div className="admin-user-avatar">
              A
            </div>

            <div>
              <strong>
                Administrator
              </strong>

              <span>
                Business Manager
              </span>
            </div>

          </div>


          <button
            className="admin-logout-button"
            onClick={handleLogout}
          >

            <LogOut size={18} />

            <span>
              Logout
            </span>

          </button>

        </div>

      </aside>


      {/* MAIN CONTENT */}

      <main className="admin-main">

        <Outlet />

      </main>

    </div>
  );
}

export default AdminLayout;