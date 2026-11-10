package com.shopkart.service;

import com.shopkart.dto.ProductResponse;
import com.shopkart.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    /**
     * List products, with optional search text and category filter.
     * Search wins when both are given, so the UI stays predictable.
     */
    public List<ProductResponse> getProducts(String search, String category) {
        if (search != null && !search.isBlank()) {
            return productRepository.findByNameContainingIgnoreCase(search.trim())
                    .stream().map(ProductResponse::from).toList();
        }
        if (category != null && !category.isBlank()) {
            return productRepository.findByCategoryIgnoreCase(category.trim())
                    .stream().map(ProductResponse::from).toList();
        }
        return productRepository.findAll()
                .stream().map(ProductResponse::from).toList();
    }

    public ProductResponse getProductById(Long id) {
        return productRepository.findById(id)
                .map(ProductResponse::from)
                .orElseThrow(() -> new RuntimeException("Product not found: " + id));
    }
}
