package com.shopkart.service;

import com.shopkart.dto.AdminDashboardResponse;
import com.shopkart.dto.AdminUserResponse;
import com.shopkart.model.OrderStatus;
import com.shopkart.repository.OrderRepository;
import com.shopkart.repository.ProductRepository;
import com.shopkart.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class AdminDashboardService {

    private static final int LOW_STOCK_LIMIT = 5;

    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    public AdminDashboardService(ProductRepository productRepository,
                                 OrderRepository orderRepository,
                                 UserRepository userRepository) {
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
    }

    public AdminDashboardResponse getDashboard() {
        Map<String, Long> byStatus = new LinkedHashMap<>();
        for (OrderStatus status : OrderStatus.values()) {
            byStatus.put(status.name(), orderRepository.countByStatus(status));
        }
        return new AdminDashboardResponse(
                productRepository.count(),
                orderRepository.count(),
                userRepository.count(),
                orderRepository.sumRevenueExcludingCancelled(),
                productRepository.findByStockLessThanEqual(LOW_STOCK_LIMIT).size(),
                byStatus
        );
    }

    public List<AdminUserResponse> getAllUsers() {
        return userRepository.findAll()
                .stream().map(AdminUserResponse::from).toList();
    }
}
