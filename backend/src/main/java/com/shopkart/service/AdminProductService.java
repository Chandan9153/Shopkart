package com.shopkart.service;

import com.shopkart.dto.ProductRequest;
import com.shopkart.dto.ProductResponse;
import com.shopkart.model.Product;
import com.shopkart.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AdminProductService {

    private final ProductRepository productRepository;

    public AdminProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll()
                .stream().map(ProductResponse::from).toList();
    }

    @Transactional
    public ProductResponse createProduct(ProductRequest request) {
        Product product = new Product();
        applyRequest(product, request);
        return ProductResponse.from(productRepository.save(product));
    }

    @Transactional
    public ProductResponse updateProduct(Long id, ProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found: " + id));
        applyRequest(product, request);
        return ProductResponse.from(productRepository.save(product));
    }

    @Transactional
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new RuntimeException("Product not found: " + id);
        }
        productRepository.deleteById(id);
    }

    private void applyRequest(Product product, ProductRequest request) {
        product.setName(request.name().trim());
        product.setDescription(request.description());
        product.setPrice(request.price());
        product.setCategory(request.category().trim());
        product.setImageUrl(request.imageUrl());
        product.setStock(request.stock());
    }
}
