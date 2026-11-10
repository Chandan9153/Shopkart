package com.shopkart.service;

import com.shopkart.dto.AdminOrderResponse;
import com.shopkart.model.Order;
import com.shopkart.model.OrderStatus;
import com.shopkart.model.Product;
import com.shopkart.repository.OrderRepository;
import com.shopkart.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
public class AdminOrderService {

    private static final Map<OrderStatus, Set<OrderStatus>> ALLOWED = Map.of(
            OrderStatus.PLACED,
                Set.of(OrderStatus.CONFIRMED, OrderStatus.CANCELLED),
            OrderStatus.CONFIRMED,
                Set.of(OrderStatus.SHIPPED, OrderStatus.CANCELLED),
            OrderStatus.SHIPPED,
                Set.of(OrderStatus.DELIVERED),
            OrderStatus.DELIVERED, Set.of(),
            OrderStatus.CANCELLED, Set.of()
    );

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    public AdminOrderService(OrderRepository orderRepository,
                             ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
    }

    public List<AdminOrderResponse> getAllOrders(String status) {
        List<Order> orders;
        if (status == null || status.isBlank()) {
            orders = orderRepository.findAllByOrderByCreatedAtDesc();
        } else {
            orders = orderRepository.findByStatusOrderByCreatedAtDesc(
                    parseStatus(status));
        }
        return orders.stream().map(AdminOrderResponse::from).toList();
    }

    public AdminOrderResponse getOrderById(Long id) {
        return orderRepository.findById(id)
                .map(AdminOrderResponse::from)
                .orElseThrow(() -> new RuntimeException("Order not found: " + id));
    }

    @Transactional
    public AdminOrderResponse updateStatus(Long id, String newStatusText) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found: " + id));
        OrderStatus next = parseStatus(newStatusText);

        if (!ALLOWED.get(order.getStatus()).contains(next)) {
            throw new RuntimeException("Cannot change order from "
                    + order.getStatus() + " to " + next);
        }

        if (next == OrderStatus.CANCELLED) {
            for (var item : order.getItems()) {
                Product product = item.getProduct();
                if (product.getStock() != null) {
                    product.setStock(product.getStock() + item.getQuantity());
                    productRepository.save(product);
                }
            }
        }

        order.setStatus(next);
        return AdminOrderResponse.from(orderRepository.save(order));
    }

    private OrderStatus parseStatus(String text) {
        try {
            return OrderStatus.valueOf(text.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new RuntimeException("Unknown order status: " + text);
        }
    }
}
