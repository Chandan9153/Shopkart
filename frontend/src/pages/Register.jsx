import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [name, setName] = useState("");
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
      const data = await registerUser({ name, email, password });
      login(data);
      navigate("/");
    } catch {
      setError("Could not register. This email may already be registered.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 420, margin: "0 auto", padding: 24 }}>
      <h1>Create account</h1>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
        <label>
          Name
          <input value={name} required minLength={2}
            onChange={(e) => setName(e.target.value)}
            style={{ width: "100%", padding: 10 }} />
        </label>
        <label>
          Email
          <input type="email" value={email} required
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: 10 }} />
        </label>
        <label>
          Password (at least 6 characters)
          <input type="password" value={password} required minLength={6}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: 10 }} />
        </label>
        {error && <p role="alert" style={{ color: "#b91c1c" }}>{error}</p>}
        <button type="submit" disabled={loading} style={{ padding: 11 }}>
          {loading ? "Creating account..." : "Register"}
        </button>
      </form>
      <p>Already registered? <Link to="/login">Login</Link></p>
    </main>
  );
}
