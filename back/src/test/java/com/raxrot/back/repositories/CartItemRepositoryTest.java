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

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@ActiveProfiles("test")
class CartItemRepositoryTest {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Test
    void testFindCartItemByProductIdAndCartId() {
        User user = new User("alex", "alex@example.com", "pass");
        userRepository.save(user);

        Product product = new Product();
        product.setProductName("Phone");
        product.setPrice(500.0);
        productRepository.save(product);

        Cart cart = new Cart();
        cart.setUser(user);
        cartRepository.save(cart);

        CartItem item = new CartItem();
        item.setCart(cart);
        item.setProduct(product);
        item.setQuantity(2);
        cartItemRepository.save(item);

        CartItem found = cartItemRepository.findCartItemByProductIdAndCartId(cart.getCartId(), product.getProductId());
        assertThat(found).isNotNull();
        assertThat(found.getQuantity()).isEqualTo(2);
    }

    @Test
    @Transactional
    void testDeleteCartItemByProductIdAndCartId() {
        User user = new User("maria", "maria@example.com", "pass");
        userRepository.save(user);

        Product product = new Product();
        product.setProductName("Book");
        product.setPrice(20.0);
        productRepository.save(product);

        Cart cart = new Cart();
        cart.setUser(user);
        cartRepository.save(cart);

        CartItem item = new CartItem();
        item.setCart(cart);
        item.setProduct(product);
        item.setQuantity(3);
        cartItemRepository.save(item);

        cartItemRepository.deleteCartItemByProductIdAndCartId(cart.getCartId(), product.getProductId());

        CartItem deleted = cartItemRepository.findCartItemByProductIdAndCartId(cart.getCartId(), product.getProductId());
        assertThat(deleted).isNull();
    }

    @Test
    @Transactional
    void testDeleteAllByCartId() {
        User user = new User("tom", "tom@example.com", "pass");
        userRepository.save(user);

        Product p1 = new Product();
        p1.setProductName("Table");
        p1.setPrice(100.0);
        productRepository.save(p1);

        Product p2 = new Product();
        p2.setProductName("Chair");
        p2.setPrice(50.0);
        productRepository.save(p2);

        Cart cart = new Cart();
        cart.setUser(user);
        cartRepository.save(cart);

        cartItemRepository.save(new CartItem(null, cart, p1, 1, 0.0, p1.getPrice()));
        cartItemRepository.save(new CartItem(null, cart, p2, 2, 0.0, p2.getPrice()));

        cartItemRepository.deleteAllByCartId(cart.getCartId());

        assertThat(cartItemRepository.findAll()).isEmpty();
    }
}