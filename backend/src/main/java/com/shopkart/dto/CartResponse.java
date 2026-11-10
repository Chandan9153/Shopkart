package com.shopkart.dto;

import java.util.List;

public record CartResponse(
        List<CartItemResponse> items,
        Double totalAmount,
        Integer totalItems
) {
}
