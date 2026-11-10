package com.shopkart.service;

import com.shopkart.dto.CheckoutRequest;
import com.shopkart.dto.OrderResponse;
import com.shopkart.model.CartItem;
import com.shopkart.model.Order;
import com.shopkart.model.OrderItem;
import com.shopkart.model.Product;
import com.shopkart.model.User;
import com.shopkart.repository.CartItemRepository;
import com.shopkart.repository.OrderRepository;
import com.shopkart.repository.ProductRepository;
import com.shopkart.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final CartService cartService;

    public OrderService(OrderRepository orderRepository,
                        CartItemRepository cartItemRepository,
                        ProductRepository productRepository,
                        UserRepository userRepository,
                        CartService cartService) {
        this.orderRepository = orderRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.cartService = cartService;
    }

    @Transactional
    public OrderResponse placeOrder(CheckoutRequest request) {
        User user = getCurrentUser();
        List<CartItem> cartItems = cartItemRepository.findByUser(user);
        if (cartItems.isEmpty()) {
            throw new RuntimeException("Your cart is empty");
        }

        Order order = new Order();
        order.setUser(user);
        order.setFullName(request.fullName().trim());
        order.setPhone(request.phone().trim());
        order.setAddress(request.address().trim());
        order.setCity(request.city().trim());
        order.setPincode(request.pincode().trim());
        order.setPaymentMethod("COD");

        double total = 0;
        for (CartItem cartItem : cartItems) {
            Product product = cartItem.getProduct();
            if (product.getStock() != null
                    && product.getStock() < cartItem.getQuantity()) {
                throw new RuntimeException("Not enough stock for: " + product.getName());
            }
            order.addItem(new OrderItem(product, cartItem.getQuantity()));
            total += product.getPrice() * cartItem.getQuantity();
            if (product.getStock() != null) {
                product.setStock(product.getStock() - cartItem.getQuantity());
                productRepository.save(product);
            }
        }
        order.setTotalAmount(total);

        Order saved = orderRepository.save(order);
        cartService.clearCart(user);
        return OrderResponse.from(saved);
    }

    public List<OrderResponse> getMyOrders() {
        return orderRepository.findByUserOrderByCreatedAtDesc(getCurrentUser())
                .stream().map(OrderResponse::from).toList();
    }

    public OrderResponse getMyOrderById(Long id) {
        return orderRepository.findByIdAndUser(id, getCurrentUser())
                .map(OrderResponse::from)
                .orElseThrow(() -> new RuntimeException("Order not found: " + id));
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));
    }
}
