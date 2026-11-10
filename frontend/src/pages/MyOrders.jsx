import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { fetchMyOrders } from "../services/orderService";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const location = useLocation();
  const placedOrderId = location.state?.placedOrderId;

  useEffect(() => {
    fetchMyOrders()
      .then(setOrders)
      .catch(() => setError("Could not load your orders."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ textAlign: "center", padding: 32 }}>Loading orders...</p>;
  if (error) return <p role="alert" style={{ textAlign: "center", padding: 32 }}>{error}</p>;

  return (
    <main style={{ maxWidth: 800, margin: "0 auto", padding: 24 }}>
      <h1>My Orders</h1>
      {placedOrderId && (
        <p style={{ color: "#15803d" }}>
          Order #{placedOrderId} placed successfully. Pay in cash when it is delivered.
        </p>
      )}
      {orders.length === 0 && <p>You have not placed any orders yet.</p>}
      {orders.map((order) => (
        <section key={order.id} style={{ border: "1px solid #e2e8f0",
          borderRadius: 10, padding: 16, marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <strong>Order #{order.id}</strong>
            <span>{order.status}</span>
          </div>
          <p>{order.paymentMethod} · Total ₹{Number(order.totalAmount).toLocaleString("en-IN")}</p>
          <ul>
            {order.items.map((item) => (
              <li key={item.productId}>
                {item.productName} × {item.quantity} — ₹{Number(item.subtotal).toLocaleString("en-IN")}
              </li>
            ))}
          </ul>
          <p>Deliver to: {order.fullName}, {order.address}, {order.city} — {order.pincode}</p>
        </section>
      ))}
    </main>
  );
}
