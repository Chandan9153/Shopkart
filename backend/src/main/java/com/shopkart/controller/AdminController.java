package com.shopkart.controller;

import com.shopkart.dto.AdminDashboardResponse;
import com.shopkart.dto.AdminOrderResponse;
import com.shopkart.dto.AdminUserResponse;
import com.shopkart.dto.ProductRequest;
import com.shopkart.dto.ProductResponse;
import com.shopkart.dto.UpdateOrderStatusRequest;
import com.shopkart.service.AdminDashboardService;
import com.shopkart.service.AdminOrderService;
import com.shopkart.service.AdminProductService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminProductService adminProductService;
    private final AdminOrderService adminOrderService;
    private final AdminDashboardService adminDashboardService;

    public AdminController(AdminProductService adminProductService,
                           AdminOrderService adminOrderService,
                           AdminDashboardService adminDashboardService) {
        this.adminProductService = adminProductService;
        this.adminOrderService = adminOrderService;
        this.adminDashboardService = adminDashboardService;
    }

    // GET /api/admin/dashboard
    @GetMapping("/dashboard")
    public ResponseEntity<AdminDashboardResponse> dashboard() {
        return ResponseEntity.ok(adminDashboardService.getDashboard());
    }

    // GET /api/admin/products
    @GetMapping("/products")
    public ResponseEntity<List<ProductResponse>> products() {
        return ResponseEntity.ok(adminProductService.getAllProducts());
    }

    // POST /api/admin/products
    @PostMapping("/products")
    public ResponseEntity<ProductResponse> createProduct(
            @Valid @RequestBody ProductRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(adminProductService.createProduct(request));
    }

    // PUT /api/admin/products/1
    @PutMapping("/products/{id}")
    public ResponseEntity<ProductResponse> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductRequest request) {
        return ResponseEntity.ok(adminProductService.updateProduct(id, request));
    }

    // DELETE /api/admin/products/1
    @DeleteMapping("/products/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        adminProductService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    // GET /api/admin/orders
    // GET /api/admin/orders?status=PLACED
    @GetMapping("/orders")
    public ResponseEntity<List<AdminOrderResponse>> orders(
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(adminOrderService.getAllOrders(status));
    }

    // GET /api/admin/orders/1
    @GetMapping("/orders/{id}")
    public ResponseEntity<AdminOrderResponse> orderById(@PathVariable Long id) {
        return ResponseEntity.ok(adminOrderService.getOrderById(id));
    }

    // PUT /api/admin/orders/1/status  { "status": "CONFIRMED" }
    @PutMapping("/orders/{id}/status")
    public ResponseEntity<AdminOrderResponse> updateOrderStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateOrderStatusRequest request) {
        return ResponseEntity.ok(
                adminOrderService.updateStatus(id, request.status()));
    }

    // GET /api/admin/users — no passwords, see AdminUserResponse
    @GetMapping("/users")
    public ResponseEntity<List<AdminUserResponse>> users() {
        return ResponseEntity.ok(adminDashboardService.getAllUsers());
    }
}
