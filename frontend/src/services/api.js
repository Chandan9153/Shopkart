const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

export function getToken() {
  return localStorage.getItem("shopkart_token");
}

export async function authFetch(path, options = {}) {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  if (response.status === 401) {
    localStorage.removeItem("shopkart_token");
    localStorage.removeItem("shopkart_user");
    throw new Error("Session expired. Please log in again.");
  }
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed (status ${response.status})`);
  }
  return response.json();
}

export { API_BASE_URL };
