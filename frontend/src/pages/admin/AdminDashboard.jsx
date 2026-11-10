import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchDashboard } from "../../services/adminService";
import "./Admin.css";

export function AdminNav() {
  return (
    <nav className="admin-nav">
      <Link to="/admin">Dashboard</Link>
      <Link to="/admin/products">Products</Link>
      <Link to="/admin/orders">Orders</Link>
      <Link to="/admin/users">Customers</Link>
    </nav>
  );
}

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboard()
      .then(setData)
      .catch(() => setError("Could not load the dashboard. Are you logged in as admin?"));
  }, []);

  if (error) return <p role="alert" className="admin-page">{error}</p>;
  if (!data) return <p className="admin-page">Loading dashboard...</p>;

  return (
    <main className="admin-page">
      <h1>Admin dashboard</h1>
      <AdminNav />

      <div className="admin-cards">
        <div className="admin-card">
          <span>Total products</span>
          <strong>{data.totalProducts}</strong>
        </div>
        <div className="admin-card">
          <span>Total orders</span>
          <strong>{data.totalOrders}</strong>
        </div>
        <div className="admin-card">
          <span>Total customers</span>
          <strong>{data.totalUsers}</strong>
        </div>
        <div className="admin-card">
          <span>Revenue (not cancelled)</span>
          <strong>₹{Number(data.totalRevenue).toLocaleString("en-IN")}</strong>
        </div>
        <div className="admin-card">
          <span>Low stock (5 or less)</span>
          <strong>{data.lowStockProducts}</strong>
        </div>
      </div>

      <h2>Orders by status</h2>
      <ul className="admin-status-list">
        {Object.entries(data.ordersByStatus).map(([status, count]) => (
          <li key={status}>
            <span>{status}</span>
            <strong>{count}</strong>
          </li>
        ))}
      </ul>
    </main>
  );
}
