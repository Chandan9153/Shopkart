package com.shopkart.dto;

import com.shopkart.model.Product;

public record ProductResponse(
        Long id,
        String name,
        String description,
        Double price,
        String category,
        String imageUrl,
        Integer stock
) {
    public static ProductResponse from(Product product) {
        return new ProductResponse(
                product.getId(),
                product.getName(),
                product.getDescription(),
                product.getPrice(),
                product.getCategory(),
                product.getImageUrl(),
                product.getStock()
        );
    }
}
