import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCart } from "../services/cartService";
import { placeOrder } from "../services/orderService";

const EMPTY_FORM = { fullName: "", phone: "", address: "", city: "", pincode: "" };

export default function Checkout() {
  const [cart, setCart] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState("");
  const [placing, setPlacing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart().then(setCart).catch(() => setError("Could not load your cart."));
  }, []);

  function updateField(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setPlacing(true);
    try {
      const order = await placeOrder(form);
      navigate("/orders", { state: { placedOrderId: order.id } });
    } catch {
      setError("Could not place the order. Check your cart and try again.");
    } finally {
      setPlacing(false);
    }
  }

  if (!cart) return <p style={{ textAlign: "center", padding: 32 }}>Loading checkout...</p>;

  return (
    <main style={{ maxWidth: 640, margin: "0 auto", padding: 24 }}>
      <h1>Checkout</h1>
      <p>Order total: <strong>₹{Number(cart.totalAmount).toLocaleString("en-IN")}</strong></p>
      <p>Payment method: <strong>Cash on Delivery</strong> — pay when your order arrives.</p>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12, marginTop: 16 }}>
        <input name="fullName" placeholder="Full name" required value={form.fullName} onChange={updateField} style={{ padding: 10 }} />
        <input name="phone" placeholder="Phone number" required value={form.phone} onChange={updateField} style={{ padding: 10 }} />
        <textarea name="address" placeholder="Full address" required value={form.address} onChange={updateField} style={{ padding: 10 }} />
        <input name="city" placeholder="City" required value={form.city} onChange={updateField} style={{ padding: 10 }} />
        <input name="pincode" placeholder="Pincode" required value={form.pincode} onChange={updateField} style={{ padding: 10 }} />
        {error && <p role="alert" style={{ color: "#b91c1c" }}>{error}</p>}
        <button type="submit" disabled={placing || cart.items.length === 0} style={{ padding: 12 }}>
          {placing ? "Placing order..." : "Place Order — Cash on Delivery"}
        </button>
      </form>
    </main>
  );
}
