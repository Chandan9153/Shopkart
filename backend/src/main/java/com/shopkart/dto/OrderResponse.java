package com.shopkart.dto;

import com.shopkart.model.Order;

import java.time.LocalDateTime;
import java.util.List;

public record OrderResponse(
        Long id,
        Double totalAmount,
        String status,
        String paymentMethod,
        String fullName,
        String phone,
        String address,
        String city,
        String pincode,
        LocalDateTime createdAt,
        List<OrderItemResponse> items
) {
    public record OrderItemResponse(
            Long productId,
            String productName,
            Double price,
            Integer quantity,
            Double subtotal
    ) {
    }

    public static OrderResponse from(Order order) {
        List<OrderItemResponse> items = order.getItems().stream()
                .map(item -> new OrderItemResponse(
                        item.getProduct().getId(),
                        item.getProductName(),
                        item.getPrice(),
                        item.getQuantity(),
                        item.getPrice() * item.getQuantity()))
                .toList();
        return new OrderResponse(
                order.getId(),
                order.getTotalAmount(),
                order.getStatus().name(),
                order.getPaymentMethod(),
                order.getFullName(),
                order.getPhone(),
                order.getAddress(),
                order.getCity(),
                order.getPincode(),
                order.getCreatedAt(),
                items
        );
    }
}
