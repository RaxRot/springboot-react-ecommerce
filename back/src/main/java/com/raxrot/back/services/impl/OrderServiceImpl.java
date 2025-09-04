package com.raxrot.back.services.impl;

import com.raxrot.back.dtos.OrderItemResponse;
import com.raxrot.back.dtos.OrderPageResponse;
import com.raxrot.back.dtos.OrderResponse;
import com.raxrot.back.dtos.PaymentResponse;
import com.raxrot.back.exceptions.ApiException;
import com.raxrot.back.models.*;
import com.raxrot.back.repositories.CartRepository;
import com.raxrot.back.repositories.OrderItemRepository;
import com.raxrot.back.repositories.OrderRepository;
import com.raxrot.back.repositories.ProductRepository;
import com.raxrot.back.services.OrderService;
import com.raxrot.back.utils.AuthUtil;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {
    private final CartRepository cartRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ProductRepository productRepository;
    private final AuthUtil authUtil;

    @Override
    public PaymentResponse placeOrder() {
        User me = authUtil.loggedInUser();

        Cart cart = cartRepository.findByUser_Id(me.getId())
                .orElseThrow(() -> new ApiException("Cart not found", HttpStatus.NOT_FOUND));

        if (cart.getItems().isEmpty()) {
            throw new ApiException("Cart is empty", HttpStatus.BAD_REQUEST);
        }

        Order order = new Order();
        order.setUser(me);
        order.setStatus(OrderStatus.PENDING);
        order.setTotalAmount(cart.getTotalPrice());
        order.setCreatedAt(LocalDateTime.now());
        order = orderRepository.save(order);

        for (CartItem ci : cart.getItems()) {
            OrderItem oi = new OrderItem();
            oi.setOrder(order);
            oi.setProduct(ci.getProduct());
            oi.setQuantity(ci.getQuantity());
            oi.setPrice(ci.getProduct().getPrice());
            orderItemRepository.save(oi);
            order.getItems().add(oi);
        }
        order = orderRepository.save(order);

        try {
            // Stripe PaymentIntent
            PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                    .setAmount(order.getTotalAmount().multiply(BigDecimal.valueOf(100)).longValue()) // в центах
                    .setCurrency("eur")
                    .setAutomaticPaymentMethods(
                            PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
                                    .setEnabled(true)
                                    .build()
                    )
                    .build();

            PaymentIntent intent = PaymentIntent.create(params);

            order.setPaymentIntentId(intent.getId());
            orderRepository.save(order);

            return new PaymentResponse(intent.getClientSecret(), order.getId(), order.getTotalAmount());

        } catch (Exception e) {
            throw new ApiException("Stripe error: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public OrderResponse confirmOrder(Long orderId) {
        User me = authUtil.loggedInUser();

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ApiException("Order not found", HttpStatus.NOT_FOUND));

        if (!order.getUser().getId().equals(me.getId())) {
            throw new ApiException("You can't confirm this order", HttpStatus.FORBIDDEN);
        }

        if (order.getStatus() == OrderStatus.PAID) {
            throw new ApiException("Order already paid", HttpStatus.BAD_REQUEST);
        }

        try {
            PaymentIntent intent = PaymentIntent.retrieve(order.getPaymentIntentId());
            if (!"succeeded".equals(intent.getStatus())) {
                throw new ApiException("Payment not completed", HttpStatus.BAD_REQUEST);
            }
        } catch (Exception e) {
            throw new ApiException("Stripe check failed: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }

        order.setStatus(OrderStatus.PAID);
        orderRepository.save(order);

        for (OrderItem oi : order.getItems()) {
            Product product = oi.getProduct();
            int newQuantity = product.getQuantity() - oi.getQuantity();
            if (newQuantity < 0) {
                throw new ApiException("Not enough stock for product " + product.getName(), HttpStatus.BAD_REQUEST);
            }
            product.setQuantity(newQuantity);
            productRepository.save(product);
        }

        // очищаем корзину
        Cart cart = cartRepository.findByUser_Id(me.getId())
                .orElseThrow(() -> new ApiException("Cart not found", HttpStatus.NOT_FOUND));
        cart.getItems().clear();
        cart.setTotalPrice(BigDecimal.ZERO);
        cartRepository.save(cart);

        return mapToOrderResponse(order);
    }

    @Override
    public List<OrderResponse> getMyOrders() {
        User me = authUtil.loggedInUser();
        return orderRepository.findByUser_Id(me.getId()).stream()
                .map(this::mapToOrderResponse)
                .toList();
    }

    @Override
    public OrderPageResponse getAllOrders(int page, int size, String sortBy, String sortOrder) {
        Sort sort = sortOrder.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Order> ordersPage = orderRepository.findAll(pageable);

        List<OrderResponse> content = ordersPage.getContent().stream()
                .map(this::mapToOrderResponse)
                .toList();

        return new OrderPageResponse(
                content,
                ordersPage.getNumber(),
                ordersPage.getSize(),
                ordersPage.getTotalPages(),
                ordersPage.getTotalElements(),
                ordersPage.isLast()
        );
    }

    @Override
    public List<OrderResponse> getOrdersByUserId(Long userId) {
        return orderRepository.findByUser_Id(userId).stream()
                .map(this::mapToOrderResponse)
                .toList();
    }

    @Override
    public List<OrderResponse> getOrdersByProductId(Long productId) {
        return orderItemRepository.findByProduct_Id(productId).stream()
                .map(OrderItem::getOrder)
                .distinct()
                .map(this::mapToOrderResponse)
                .toList();
    }

    private OrderResponse mapToOrderResponse(Order order) {
        List<OrderItemResponse> itemResponses = order.getItems().stream()
                .map(oi -> new OrderItemResponse(
                        oi.getId(),
                        oi.getProduct().getId(),
                        oi.getProduct().getName(),
                        oi.getPrice(),
                        oi.getQuantity()
                ))
                .toList();

        return new OrderResponse(
                order.getId(),
                order.getStatus().name(),
                order.getTotalAmount(),
                order.getCreatedAt(),
                order.getUser().getUserName(),
                itemResponses
        );
    }
}
