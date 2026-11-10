package com.shopkart.dto;

import java.util.Map;

public record AdminDashboardResponse(
        long totalProducts,
        long totalOrders,
        long totalUsers,
        double totalRevenue,
        long lowStockProducts,
        Map<String, Long> ordersByStatus
) {
}
