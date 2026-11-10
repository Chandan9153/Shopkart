package com.shopkart.controller;

import com.shopkart.dto.CheckoutRequest;
import com.shopkart.dto.OrderResponse;
import com.shopkart.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    // POST /api/orders/checkout — Cash on Delivery only
    @PostMapping("/checkout")
    public ResponseEntity<OrderResponse> checkout(
            @Valid @RequestBody CheckoutRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(orderService.placeOrder(request));
    }

    // GET /api/orders — only the logged-in user's orders
    @GetMapping
    public ResponseEntity<List<OrderResponse>> getMyOrders() {
        return ResponseEntity.ok(orderService.getMyOrders());
    }

    // GET /api/orders/1
    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getMyOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getMyOrderById(id));
    }
}
