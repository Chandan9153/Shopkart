import { useEffect, useState } from "react";
import { fetchAdminUsers } from "../../services/adminService";
import { AdminNav } from "./AdminDashboard";
import "./Admin.css";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminUsers()
      .then(setUsers)
      .catch(() => setError("Could not load customers."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="admin-page">Loading customers...</p>;

  return (
    <main className="admin-page">
      <h1>Admin — customers</h1>
      <AdminNav />
      {error && <p role="alert" className="admin-error">{error}</p>}
      <table className="admin-table">
        <thead>
          <tr><th>Id</th><th>Name</th><th>Email</th><th>Role</th></tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {users.length === 0 && <p>No registered users yet.</p>}
    </main>
  );
}
