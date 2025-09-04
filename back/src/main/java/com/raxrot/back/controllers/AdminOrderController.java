package com.raxrot.back.controllers;

import com.raxrot.back.dtos.OrderPageResponse;
import com.raxrot.back.dtos.OrderResponse;
import com.raxrot.back.services.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/orders")
public class AdminOrderController {
    private final OrderService orderService;

    @GetMapping
    public ResponseEntity<OrderPageResponse> getAllOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortOrder
    ) {
        OrderPageResponse response = orderService.getAllOrders(page, size, sortBy, sortOrder);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<OrderResponse>> getOrdersByUser(@PathVariable Long userId) {
        List<OrderResponse> response = orderService.getOrdersByUserId(userId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<OrderResponse>> getOrdersByProduct(@PathVariable Long productId) {
        List<OrderResponse> response = orderService.getOrdersByProductId(productId);
        return ResponseEntity.ok(response);
    }
}

