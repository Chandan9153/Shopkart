package com.shopkart.repository;

import com.shopkart.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    // SELECT * FROM products WHERE category = ?
    List<Product> findByCategoryIgnoreCase(String category);

    // SELECT * FROM products WHERE LOWER(name) LIKE LOWER('%keyword%')
    List<Product> findByNameContainingIgnoreCase(String keyword);

    // Dashboard warning: products running out, stock of 5 or less
    List<Product> findByStockLessThanEqual(Integer stock);
}
