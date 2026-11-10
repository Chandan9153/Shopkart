import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <header style={{ display: "flex", justifyContent: "space-between",
      alignItems: "center", padding: "14px 20px", borderBottom: "1px solid #e2e8f0" }}>
      <Link to="/" style={{ fontWeight: 700, fontSize: 20, textDecoration: "none" }}>
        ShopKart
      </Link>
      <nav style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <Link to="/">Products</Link>
        <Link to="/cart">Cart</Link>
        {isLoggedIn && <Link to="/orders">My Orders</Link>}
        {isLoggedIn && user.role === "ADMIN" && <Link to="/admin">Admin</Link>}
        {isLoggedIn ? (
          <>
            <span>Hi, {user.name}</span>
            <button type="button" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}
