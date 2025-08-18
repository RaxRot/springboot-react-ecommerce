package com.raxrot.back.security.jwt;

import com.raxrot.back.security.services.UserDetailsImpl;
import io.jsonwebtoken.ExpiredJwtException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseCookie;
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

    @Test
    void testGetCleanJwtCookie() {
        // given
        String cookieName = "testJwtCookie";
        ReflectionTestUtils.setField(jwtUtils, "jwtCookie", cookieName);

        // when
        ResponseCookie cookie = jwtUtils.getCleanJwtCookie();

        // then
        assertEquals(cookieName, cookie.getName());
        assertEquals("", cookie.getValue());
        assertEquals("/api", cookie.getPath());
    }

    @Test
    void testGetJwtCookie() {
        // given
        var userDetails = new UserDetailsImpl(1L, "john", "john@example.com", "pass", null);

        // when
        ResponseCookie cookie = jwtUtils.getJwtCookie(userDetails);

        // then
        assertEquals("springBootEcom", cookie.getName());
        assertNotNull(cookie.getValue());
        assertFalse(cookie.getValue().isEmpty());
        assertEquals("/api", cookie.getPath());
    }
}