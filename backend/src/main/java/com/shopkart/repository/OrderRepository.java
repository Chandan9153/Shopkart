package com.shopkart.repository;
import org.springframework.data.jpa.repository.Query;
import com.shopkart.model.OrderStatus;

import com.shopkart.model.Order;
import com.shopkart.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByUserOrderByCreatedAtDesc(User user);

    Optional<Order> findByIdAndUser(Long id, User user);

// All orders, newest first — the admin order list
    List<Order> findAllByOrderByCreatedAtDesc();

    // Admin order list filtered by one status
    List<Order> findByStatusOrderByCreatedAtDesc(OrderStatus status);

    long countByStatus(OrderStatus status);

    // Revenue = money from orders that were not cancelled
    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o "
            + "WHERE o.status <> com.shopkart.model.OrderStatus.CANCELLED")
    Double sumRevenueExcludingCancelled();
}
