const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

export async function fetchProducts({ search = "", category = "" } = {}) {
  const params = new URLSearchParams();
  if (search.trim()) params.set("search", search.trim());
  if (category) params.set("category", category);

  const query = params.toString();
  const response = await fetch(`${API_BASE_URL}/products${query ? `?${query}` : ""}`);

  if (!response.ok) {
    throw new Error(`Could not load products (status ${response.status})`);
  }
  return response.json();
}
