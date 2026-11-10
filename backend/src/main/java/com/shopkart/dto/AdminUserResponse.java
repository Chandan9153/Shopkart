package com.shopkart.dto;

import com.shopkart.model.User;

public record AdminUserResponse(
        Long id,
        String name,
        String email,
        String role
) {
    public static AdminUserResponse from(User user) {
        return new AdminUserResponse(
                user.getId(), user.getName(),
                user.getEmail(), user.getRole().name());
    }
}
