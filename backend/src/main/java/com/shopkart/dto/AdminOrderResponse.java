package com.shopkart.dto;

import com.shopkart.model.Order;

public record AdminOrderResponse(
        OrderResponse order,
        Long customerId,
        String customerName,
        String customerEmail
) {
    public static AdminOrderResponse from(Order order) {
        return new AdminOrderResponse(
                OrderResponse.from(order),
                order.getUser().getId(),
                order.getUser().getName(),
                order.getUser().getEmail());
    }
}
