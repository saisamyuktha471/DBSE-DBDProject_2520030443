import { BrowserRouter, Routes, Route } from "react-router-dom";

// Customer pages
import CustomerLayout from "./pages/CustomerLayout";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import MyOrders from "./pages/MyOrders";
import OrderDetails from "./pages/OrderDetails";
import Returns from "./pages/Returns";
import Rewards from "./pages/Rewards";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./pages/ProtectedRoute";

// Admin pages
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminInventory from "./pages/admin/AdminInventory";
import AdminCustomers from "./pages/admin/AdminCustomers";
import AdminReturns from "./pages/admin/AdminReturns";
import Analytics from "./pages/admin/Analytics";
import DecisionSupport from "./pages/admin/DecisionSupport";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ================= CUSTOMER ================= */}

        <Route element={<CustomerLayout />}>

          <Route path="/" element={<Home />} />

          <Route path="/products" element={<Products />} />

          <Route
            path="/product-details"
            element={<ProductDetails />}
          />

          <Route path="/cart" element={<Cart />} />

          <Route path="/checkout" element={<Checkout />} />

          <Route path="/my-orders" element={<MyOrders />} />

          <Route
            path="/order-details"
            element={<OrderDetails />}
          />

          <Route path="/returns" element={<Returns />} />

          <Route path="/rewards" element={<Rewards />} />

          <Route path="/profile" element={<Profile />} />

          <Route element={<ProtectedRoute />}/>

        </Route>

        {/* Login/Register should NOT have shopping navbar */}

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />



        {/* ================= ADMIN ================= */}

        <Route
          path="/admin-login"
          element={<AdminLogin />}
        />

        <Route element={<AdminLayout />}>

          <Route
            path="/admin"
            element={<AdminDashboard />}
          />

          <Route
            path="/admin/orders"
            element={<AdminOrders />}
          />

          <Route
            path="/admin/products"
            element={<AdminProducts />}
          />

          <Route
            path="/admin/inventory"
            element={<AdminInventory />}
          />

          <Route
            path="/admin/customers"
            element={<AdminCustomers />}
          />

          <Route
            path="/admin/returns"
            element={<AdminReturns />}
          />

          <Route
            path="/admin/analytics"
            element={<Analytics />}
          />

          <Route
            path="/admin/decision-support"
            element={<DecisionSupport />}
          />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;