import { authFetch } from "./api";

export function placeOrder(address) {
  return authFetch("/orders/checkout", {
    method: "POST",
    body: JSON.stringify(address),
  });
}

export function fetchMyOrders() {
  return authFetch("/orders");
}
