package com.shopkart.dto;

import jakarta.validation.constraints.NotBlank;

public record CheckoutRequest(
        @NotBlank(message = "Full name is required")
        String fullName,

        @NotBlank(message = "Phone is required")
        String phone,

        @NotBlank(message = "Address is required")
        String address,

        @NotBlank(message = "City is required")
        String city,

        @NotBlank(message = "Pincode is required")
        String pincode
) {
}
