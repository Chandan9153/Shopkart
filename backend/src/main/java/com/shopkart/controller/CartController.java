package com.shopkart.controller;

import com.shopkart.dto.AddToCartRequest;
import com.shopkart.dto.CartResponse;
import com.shopkart.service.CartService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    // GET /api/cart
    @GetMapping
    public ResponseEntity<CartResponse> getMyCart() {
        return ResponseEntity.ok(cartService.getMyCart());
    }

    // POST /api/cart/items  { "productId": 1, "quantity": 2 }
    @PostMapping("/items")
    public ResponseEntity<CartResponse> addToCart(
            @Valid @RequestBody AddToCartRequest request) {
        return ResponseEntity.ok(cartService.addToCart(request));
    }

    // PUT /api/cart/items/5  { "quantity": 3 }
    @PutMapping("/items/{id}")
    public ResponseEntity<CartResponse> updateQuantity(
            @PathVariable Long id,
            @RequestBody Map<String, Integer> body) {
        return ResponseEntity.ok(cartService.updateQuantity(id, body.get("quantity")));
    }

    // DELETE /api/cart/items/5
    @DeleteMapping("/items/{id}")
    public ResponseEntity<CartResponse> removeItem(@PathVariable Long id) {
        return ResponseEntity.ok(cartService.removeItem(id));
    }
}
