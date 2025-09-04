package com.raxrot.back.services;

import com.raxrot.back.dtos.CartItemRequest;
import com.raxrot.back.dtos.CartResponse;

public interface CartService {
    CartResponse getMyCart();
    CartResponse addItem(CartItemRequest request);
    CartResponse updateItem(Long itemId, Integer quantity);
    CartResponse removeItem(Long itemId);
    void clearCart();
}
