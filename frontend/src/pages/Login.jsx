import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await loginUser({ email, password });
      login(data);
      navigate("/");
    } catch {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 420, margin: "0 auto", padding: 24 }}>
      <h1>Login</h1>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
        <label>
          Email
          <input type="email" value={email} required
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: 10 }} />
        </label>
        <label>
          Password
          <input type="password" value={password} required
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: 10 }} />
        </label>
        {error && <p role="alert" style={{ color: "#b91c1c" }}>{error}</p>}
        <button type="submit" disabled={loading} style={{ padding: 11 }}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <p>New to ShopKart? <Link to="/register">Create an account</Link></p>
    </main>
  );
}
