package com.raxrot.back.services.impl;

import com.raxrot.back.dtos.CartItemRequest;
import com.raxrot.back.dtos.CartItemResponse;
import com.raxrot.back.dtos.CartResponse;
import com.raxrot.back.exceptions.ApiException;
import com.raxrot.back.models.Cart;
import com.raxrot.back.models.CartItem;
import com.raxrot.back.models.Product;
import com.raxrot.back.models.User;
import com.raxrot.back.repositories.CartItemRepository;
import com.raxrot.back.repositories.CartRepository;
import com.raxrot.back.repositories.ProductRepository;
import com.raxrot.back.services.CartService;
import com.raxrot.back.utils.AuthUtil;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final ModelMapper modelMapper;
    private final AuthUtil authUtil;

    @Override
    public CartResponse getMyCart() {
        User me = authUtil.loggedInUser();

        Cart cart = cartRepository.findByUser_Id(me.getId())
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setUser(me);
                    newCart.setTotalPrice(BigDecimal.ZERO);
                    return cartRepository.save(newCart);
                });

        return mapToCartResponse(cart);
    }

    @Override
    public CartResponse addItem(CartItemRequest request) {
        User me = authUtil.loggedInUser();
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ApiException("Product not found", HttpStatus.NOT_FOUND));

        if (request.getQuantity() <= 0) {
            throw new ApiException("Quantity must be greater than zero", HttpStatus.BAD_REQUEST);
        }

        if (request.getQuantity() > product.getQuantity()) {
            throw new ApiException("Not enough stock available", HttpStatus.BAD_REQUEST);
        }

        Cart cart = cartRepository.findByUser_Id(me.getId())
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setUser(me);
                    newCart.setTotalPrice(BigDecimal.ZERO);
                    return cartRepository.save(newCart);
                });

        CartItem cartItem = cartItemRepository.findByCart_IdAndProduct_Id(cart.getId(), product.getId())
                .orElseGet(() -> {
                    CartItem newItem = new CartItem();
                    newItem.setCart(cart);
                    newItem.setProduct(product);
                    newItem.setQuantity(0);
                    return newItem;
                });

        int newQuantity = cartItem.getQuantity() + request.getQuantity();
        if (newQuantity > product.getQuantity()) {
            throw new ApiException("Not enough stock available", HttpStatus.BAD_REQUEST);
        }

        cartItem.setQuantity(newQuantity);
        cartItemRepository.save(cartItem);

        recalculateCartTotal(cart);

        return mapToCartResponse(cart);
    }

    @Override
    public CartResponse updateItem(Long itemId, Integer quantity) {
        CartItem cartItem = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ApiException("Cart item not found", HttpStatus.NOT_FOUND));

        if (quantity <= 0) {
            cartItemRepository.delete(cartItem);
        } else {
            if (quantity > cartItem.getProduct().getQuantity()) {
                throw new ApiException("Not enough stock available", HttpStatus.BAD_REQUEST);
            }
            cartItem.setQuantity(quantity);
            cartItemRepository.save(cartItem);
        }

        recalculateCartTotal(cartItem.getCart());
        return mapToCartResponse(cartItem.getCart());
    }

    @Override
    public CartResponse removeItem(Long itemId) {
        CartItem cartItem = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ApiException("Cart item not found", HttpStatus.NOT_FOUND));

        Cart cart = cartItem.getCart();
        cartItemRepository.delete(cartItem);

        recalculateCartTotal(cart);

        return mapToCartResponse(cart);
    }

    @Override
    public void clearCart() {
        User me = authUtil.loggedInUser();
        Cart cart = cartRepository.findByUser_Id(me.getId())
                .orElseThrow(() -> new ApiException("Cart not found", HttpStatus.NOT_FOUND));

        cart.getItems().clear();
        cart.setTotalPrice(BigDecimal.ZERO);

        cartRepository.save(cart);
    }

    private void recalculateCartTotal(Cart cart) {
        BigDecimal total = cart.getItems().stream()
                .map(item -> item.getProduct().getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        cart.setTotalPrice(total);
        cartRepository.save(cart);
    }

    private CartResponse mapToCartResponse(Cart cart) {
        List<CartItemResponse> itemResponses = cart.getItems().stream()
                .map(item -> new CartItemResponse(
                        item.getId(),
                        item.getProduct().getId(),
                        item.getProduct().getName(),
                        item.getProduct().getImageUrl(),
                        item.getProduct().getPrice(),
                        item.getQuantity(),
                        item.getProduct().getPrice().multiply(BigDecimal.valueOf(item.getQuantity()))
                ))
                .toList();

        return new CartResponse(
                cart.getId(),
                cart.getUser().getUserName(),
                itemResponses,
                cart.getTotalPrice()
        );
    }
}
