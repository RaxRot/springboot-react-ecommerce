package com.raxrot.back.repositories;

import com.raxrot.back.models.Category;
import com.raxrot.back.models.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
    Page<Product> findAllByCategory(Category category, Pageable pageable);
    Page<Product> findAllByProductNameContainingIgnoreCase(String keyword, Pageable pageable);
}
