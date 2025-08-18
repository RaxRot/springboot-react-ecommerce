package com.raxrot.back.security.jwt;

import io.jsonwebtoken.ExpiredJwtException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;

public class JwtUtilsTest {

    private JwtUtils jwtUtils;

    @BeforeEach
    void setUp() {
        jwtUtils = new JwtUtils();

        String strongSecret = "3n8XHt6yDgdzfCq9so5A0L2pW4gG1YzTb1P4k5q6r3c=";

        ReflectionTestUtils.setField(jwtUtils, "jwtSecret", strongSecret);
        ReflectionTestUtils.setField(jwtUtils, "jwtExpirationMs", 3600000);
        ReflectionTestUtils.setField(jwtUtils, "jwtCookie", "springBootEcom");
    }

    @Test
    void generateTokenFromUsername_ShouldReturnValidToken() {
        String token = jwtUtils.generateTokenFromUsername("john");
        assertNotNull(token);
    }

    @Test
    void getUserNameFromJwtToken_ShouldReturnCorrectUsername() {
        String token = jwtUtils.generateTokenFromUsername("alice");
        String username = jwtUtils.getUserNameFromJwtToken(token);
        assertEquals("alice", username);
    }

    @Test
    void validateJwtToken_ShouldReturnTrueForValidToken() {
        String token = jwtUtils.generateTokenFromUsername("bob");
        assertTrue(jwtUtils.validateJwtToken(token));
    }

    @Test
    void validateJwtToken_ShouldReturnFalseForInvalidToken() {
        assertFalse(jwtUtils.validateJwtToken("invalid.token.here"));
    }

    @Test
    void validateJwtToken_ShouldReturnFalseForExpiredToken() {
        ReflectionTestUtils.setField(jwtUtils, "jwtExpirationMs", -1000);
        String expiredToken = jwtUtils.generateTokenFromUsername("tim");
        assertThrows(ExpiredJwtException.class, () -> jwtUtils.getUserNameFromJwtToken(expiredToken));
    }
}