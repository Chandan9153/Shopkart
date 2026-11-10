import { useEffect, useState } from "react";
import { fetchAdminOrders, updateOrderStatus } from "../../services/adminService";
import { AdminNav } from "./AdminDashboard";
import "./Admin.css";

const FILTERS = ["", "PLACED", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];

const NEXT_STATUSES = {
  PLACED: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["DELIVERED"],
  DELIVERED: [],
  CANCELLED: [],
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  function loadOrders() {
    setLoading(true);
    fetchAdminOrders(status)
      .then(setOrders)
      .catch(() => setError("Could not load orders."))
      .finally(() => setLoading(false));
  }

  useEffect(loadOrders, [status]);

  async function changeStatus(order, nextStatus) {
    if (!nextStatus) return;
    setError("");
    try {
      const updated = await updateOrderStatus(order.order.id, nextStatus);
      setOrders(orders.map((item) =>
        item.order.id === updated.order.id ? updated : item));
    } catch {
      setError("That status change is not allowed. Refresh the page and try again.");
      loadOrders();
    }
  }

  if (loading) return <p className="admin-page">Loading orders...</p>;

  return (
    <main className="admin-page">
      <h1>Admin — orders</h1>
      <AdminNav />

      <label>
        Show status{" "}
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          {FILTERS.map((item) => (
            <option key={item || "all"} value={item}>
              {item || "All orders"}
            </option>
          ))}
        </select>
      </label>

      {error && <p role="alert" className="admin-error">{error}</p>}
      {orders.length === 0 && <p>No orders found for this status.</p>}

      {orders.map((entry) => {
        const order = entry.order;
        const nextOptions = NEXT_STATUSES[order.status] || [];
        return (
          <section key={order.id} className="admin-order">
            <div className="admin-order-head">
              <strong>Order #{order.id}</strong>
              <span>{order.status}</span>
            </div>
            <p>
              {entry.customerName} ({entry.customerEmail}) ·{" "}
              {order.paymentMethod} · Total{" "}
              ₹{Number(order.totalAmount).toLocaleString("en-IN")}
            </p>
            <ul>
              {order.items.map((item) => (
                <li key={item.productId}>
                  {item.productName} × {item.quantity} —{" "}
                  ₹{Number(item.subtotal).toLocaleString("en-IN")}
                </li>
              ))}
            </ul>
            <p>
              Deliver to: {order.fullName}, {order.address}, {order.city} —{" "}
              {order.pincode} · Phone: {order.phone}
            </p>
            {nextOptions.length > 0 ? (
              <label>
                Change status{" "}
                <select defaultValue=""
                  onChange={(e) => changeStatus(entry, e.target.value)}>
                  <option value="">Choose next status...</option>
                  {nextOptions.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </label>
            ) : (
              <p>This order is finished — its status cannot change.</p>
            )}
          </section>
        );
      })}
    </main>
  );
}
