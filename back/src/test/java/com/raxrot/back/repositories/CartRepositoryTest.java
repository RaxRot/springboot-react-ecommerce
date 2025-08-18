package com.raxrot.back.repositories;

import com.raxrot.back.models.Cart;
import com.raxrot.back.models.CartItem;
import com.raxrot.back.models.Product;
import com.raxrot.back.models.User;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@ActiveProfiles("test")
class CartRepositoryTest {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Test
    void testFindCartByEmail() {
        User user = new User("john", "john@example.com", "pass");
        userRepository.save(user);

        Cart cart = new Cart();
        cart.setUser(user);
        cartRepository.save(cart);

        Cart found = cartRepository.findCartByEmail("john@example.com");
        assertThat(found).isNotNull();
        assertThat(found.getUser().getUserName()).isEqualTo("john");
    }

    @Test
    void testFindCartByEmailAndCartId() {
        User user = new User("kate", "kate@example.com", "pass");
        userRepository.save(user);

        Cart cart = new Cart();
        cart.setUser(user);
        Cart saved = cartRepository.save(cart);

        Cart found = cartRepository.findCartByEmailAndCartId("kate@example.com", saved.getCartId());
        assertThat(found).isNotNull();
        assertThat(found.getUser().getEmail()).isEqualTo("kate@example.com");
    }

    @Test
    @Transactional
    void testFindCartsByProductId() {
        // given
        User user = userRepository.save(new User("testUser", "test@example.com", "password"));

        Cart cart = new Cart();
        cart.setUser(user);

        Product product = new Product();
        product.setProductName("Laptop");
        product.setPrice(1000.0);
        product.setQuantity(10);
        product = productRepository.save(product);

        CartItem cartItem = new CartItem();
        cartItem.setProduct(product);
        cartItem.setQuantity(1);
        cartItem.setProductPrice(product.getPrice());

        cartItem.setCart(cart);
        cart.getCartItems().add(cartItem);
        cart = cartRepository.save(cart);

        // when
        List<Cart> carts = cartRepository.findCartsByProductId(product.getProductId());

        // then
        assertThat(carts)
                .hasSize(1)
                .flatMap(Cart::getCartItems)
                .extracting(ci -> ci.getProduct().getProductName())
                .contains("Laptop");
    }
}