package com.raxrot.back.repositories;

import com.raxrot.back.models.Cart;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Integer> {
    Optional<Cart> findByUser_Id(Long userId);
}
