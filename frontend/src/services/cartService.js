import { authFetch } from "./api";

export function fetchCart() {
  return authFetch("/cart");
}

export function addToCart(productId, quantity = 1) {
  return authFetch("/cart/items", {
    method: "POST",
    body: JSON.stringify({ productId, quantity }),
  });
}

export function updateCartItem(cartItemId, quantity) {
  return authFetch(`/cart/items/${cartItemId}`, {
    method: "PUT",
    body: JSON.stringify({ quantity }),
  });
}

export function removeCartItem(cartItemId) {
  return authFetch(`/cart/items/${cartItemId}`, { method: "DELETE" });
}
