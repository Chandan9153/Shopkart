import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchCart, removeCartItem, updateCartItem } from "../services/cartService";

export default function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function loadCart() {
    setLoading(true);
    fetchCart()
      .then(setCart)
      .catch(() => setError("Could not load your cart. Please log in again."))
      .finally(() => setLoading(false));
  }

  useEffect(loadCart, []);

  async function changeQuantity(item, quantity) {
    if (quantity < 1) return;
    setCart(await updateCartItem(item.id, quantity));
  }

  async function remove(item) {
    setCart(await removeCartItem(item.id));
  }

  if (loading) return <p style={{ textAlign: "center", padding: 32 }}>Loading cart...</p>;
  if (error) return <p role="alert" style={{ textAlign: "center", padding: 32 }}>{error}</p>;
  if (!cart || cart.items.length === 0) {
    return (
      <main style={{ textAlign: "center", padding: 32 }}>
        <h1>Your cart is empty</h1>
        <Link to="/">Continue shopping</Link>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 800, margin: "0 auto", padding: 24 }}>
      <h1>Your cart</h1>
      {cart.items.map((item) => (
        <div key={item.id} style={{ display: "flex", gap: 16, justifyContent: "space-between",
          borderBottom: "1px solid #e2e8f0", padding: "14px 0" }}>
          <div>
            <strong>{item.productName}</strong>
            <p>₹{Number(item.price).toLocaleString("en-IN")} each</p>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button type="button" onClick={() => changeQuantity(item, item.quantity - 1)}>-</button>
            <span>{item.quantity}</span>
            <button type="button" onClick={() => changeQuantity(item, item.quantity + 1)}>+</button>
            <strong>₹{Number(item.subtotal).toLocaleString("en-IN")}</strong>
            <button type="button" onClick={() => remove(item)}>Remove</button>
          </div>
        </div>
      ))}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20 }}>
        <span>Total ({cart.totalItems} items)</span>
        <strong>₹{Number(cart.totalAmount).toLocaleString("en-IN")}</strong>
      </div>
      <button type="button" onClick={() => navigate("/checkout")}
        style={{ width: "100%", padding: 12, marginTop: 16 }}>
        Proceed to Checkout
      </button>
    </main>
  );
}
