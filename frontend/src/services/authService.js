import { API_BASE_URL } from "./api";

async function postAuth(path, payload) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error("Login or registration failed. Check your details and try again.");
  }
  return response.json();
}

export function registerUser(payload) {
  return postAuth("/auth/register", payload);
}

export function loginUser(payload) {
  return postAuth("/auth/login", payload);
}
