package com.raxrot.back.services;

import com.raxrot.back.dtos.OrderPageResponse;
import com.raxrot.back.dtos.OrderResponse;
import com.raxrot.back.dtos.PaymentResponse;

import java.util.List;

public interface OrderService {
    PaymentResponse placeOrder();
    OrderResponse confirmOrder(Long orderId);
    List<OrderResponse> getMyOrders();
    OrderPageResponse getAllOrders(int page, int size, String sortBy, String sortOrder);
    List<OrderResponse> getOrdersByUserId(Long userId);
    List<OrderResponse> getOrdersByProductId(Long productId);
}