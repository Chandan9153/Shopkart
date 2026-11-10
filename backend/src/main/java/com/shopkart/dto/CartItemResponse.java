package com.shopkart.dto;

import com.shopkart.model.CartItem;

public record CartItemResponse(
        Long id,
        Long productId,
        String productName,
        Double price,
        Integer quantity,
        Double subtotal
) {
    public static CartItemResponse from(CartItem item) {
        Double price = item.getProduct().getPrice();
        return new CartItemResponse(
                item.getId(),
                item.getProduct().getId(),
                item.getProduct().getName(),
                price,
                item.getQuantity(),
                price * item.getQuantity()
        );
    }
}
