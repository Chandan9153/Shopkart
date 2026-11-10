package com.shopkart.service;

import com.shopkart.dto.AddToCartRequest;
import com.shopkart.dto.CartItemResponse;
import com.shopkart.dto.CartResponse;
import com.shopkart.model.CartItem;
import com.shopkart.model.Product;
import com.shopkart.model.User;
import com.shopkart.repository.CartItemRepository;
import com.shopkart.repository.ProductRepository;
import com.shopkart.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public CartService(CartItemRepository cartItemRepository,
                       ProductRepository productRepository,
                       UserRepository userRepository) {
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    public CartResponse getMyCart() {
        List<CartItemResponse> items = cartItemRepository.findByUser(getCurrentUser())
                .stream().map(CartItemResponse::from).toList();
        double total = items.stream().mapToDouble(CartItemResponse::subtotal).sum();
        int count = items.stream().mapToInt(CartItemResponse::quantity).sum();
        return new CartResponse(items, total, count);
    }

    @Transactional
    public CartResponse addToCart(AddToCartRequest request) {
        User user = getCurrentUser();
        Product product = productRepository.findById(request.productId())
                .orElseThrow(() -> new RuntimeException(
                        "Product not found: " + request.productId()));

        CartItem item = cartItemRepository
                .findByUserAndProductId(user, product.getId())
                .orElseGet(() -> new CartItem(user, product, 0));
        item.setQuantity(item.getQuantity() + request.quantity());
        cartItemRepository.save(item);
        return getMyCart();
    }

    @Transactional
    public CartResponse updateQuantity(Long cartItemId, Integer quantity) {
        CartItem item = cartItemRepository
                .findByIdAndUser(cartItemId, getCurrentUser())
                .orElseThrow(() -> new RuntimeException("Cart item not found: " + cartItemId));
        if (quantity == null || quantity < 1) {
            throw new RuntimeException("Quantity must be at least 1");
        }
        item.setQuantity(quantity);
        cartItemRepository.save(item);
        return getMyCart();
    }

    @Transactional
    public CartResponse removeItem(Long cartItemId) {
        CartItem item = cartItemRepository
                .findByIdAndUser(cartItemId, getCurrentUser())
                .orElseThrow(() -> new RuntimeException("Cart item not found: " + cartItemId));
        cartItemRepository.delete(item);
        return getMyCart();
    }

    @Transactional
    public void clearCart(User user) {
        cartItemRepository.deleteByUser(user);
    }

    public User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));
    }
}
