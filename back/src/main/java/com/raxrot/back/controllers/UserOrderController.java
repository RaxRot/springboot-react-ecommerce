package com.raxrot.back.controllers;

import com.raxrot.back.dtos.OrderResponse;
import com.raxrot.back.dtos.PaymentResponse;
import com.raxrot.back.services.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/user/orders")
public class UserOrderController {
    private final OrderService orderService;

    @PostMapping("/place")
    public ResponseEntity<PaymentResponse> placeOrder() {
        PaymentResponse response = orderService.placeOrder();
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/confirm/{orderId}")
    public ResponseEntity<OrderResponse> confirmOrder(@PathVariable Long orderId) {
        OrderResponse response = orderService.confirmOrder(orderId);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<OrderResponse>> getMyOrders() {
        List<OrderResponse> response = orderService.getMyOrders();
        return ResponseEntity.ok(response);
    }
}
