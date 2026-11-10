import { authFetch } from "./api";

export function fetchDashboard() {
  return authFetch("/admin/dashboard");
}

export function fetchAdminProducts() {
  return authFetch("/admin/products");
}

export function createProduct(payload) {
  return authFetch("/admin/products", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateProduct(id, payload) {
  return authFetch(`/admin/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteProduct(id) {
  const token = localStorage.getItem("shopkart_token");
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api"}/admin/products/${id}`,
    {
      method: "DELETE",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }
  );
  if (!response.ok) {
    throw new Error(`Could not delete the product (status ${response.status})`);
  }
}

export function fetchAdminOrders(status = "") {
  const query = status ? `?status=${encodeURIComponent(status)}` : "";
  return authFetch(`/admin/orders${query}`);
}

export function updateOrderStatus(id, status) {
  return authFetch(`/admin/orders/${id}/status`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });
}

export function fetchAdminUsers() {
  return authFetch("/admin/users");
}
