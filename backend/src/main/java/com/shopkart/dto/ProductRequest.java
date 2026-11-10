package com.shopkart.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ProductRequest(
        @NotBlank(message = "Product name is required")
        String name,

        String description,

        @NotNull(message = "Price is required")
        @DecimalMin(value = "0.01", message = "Price must be more than 0")
        Double price,

        @NotBlank(message = "Category is required")
        String category,

        String imageUrl,

        @NotNull(message = "Stock is required")
        @Min(value = 0, message = "Stock cannot be negative")
        Integer stock
) {
}
