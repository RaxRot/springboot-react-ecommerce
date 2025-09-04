package com.raxrot.back.repositories;

import com.raxrot.back.models.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Integer> {
    List<CartItem> findByCart_Id(Long cartId);
    Optional<CartItem> findByCart_IdAndProduct_Id(Long cartId, Long productId);
}
