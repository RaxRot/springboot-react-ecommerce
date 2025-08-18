package com.raxrot.back.security.jwt;

import static org.junit.jupiter.api.Assertions.*;

import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.User;
import org.springframework.test.util.ReflectionTestUtils;

import javax.crypto.SecretKey;
import java.security.Key;
import java.util.Date;

import static org.assertj.core.api.Assertions.assertThat;

public class JwtUtilsTest {

    private JwtUtils jwtUtils;

    private static final String SECRET_B64 = "dGVzdHRlc3R0ZXN0dGVzdHRlc3R0ZXN0dGVzdHRlc3Q="; // "testtesttesttesttesttesttesttest"
    private static final int EXP_MS = 60_000;

    @BeforeEach
    void setUp() {
        jwtUtils = new JwtUtils();
        ReflectionTestUtils.setField(jwtUtils, "jwtSecret", SECRET_B64);
        ReflectionTestUtils.setField(jwtUtils, "jwtExpirationMs", EXP_MS);
    }

    @Test
    void getJwtFromHeader_ok() {
        var req = new org.springframework.mock.web.MockHttpServletRequest();
        req.addHeader("Authorization", "Bearer abc.def.ghi");
        assertThat(jwtUtils.getJwtFromHeader(req)).isEqualTo("abc.def.ghi");
    }

    @Test
    void getJwtFromHeader_null_whenNoBearer() {
        var req = new org.springframework.mock.web.MockHttpServletRequest();
        req.addHeader("Authorization", "Basic something");
        assertThat(jwtUtils.getJwtFromHeader(req)).isNull();
    }

    @Test
    void generate_and_validate_and_extractUsername_ok() {
        var ud = User.withUsername("alice").password("x").authorities("ROLE_USER").build();

        String token = jwtUtils.generateTokenFromUsername(ud);
        assertThat(jwtUtils.validateJwtToken(token)).isTrue();
        assertThat(jwtUtils.getUserNameFromJwtToken(token)).isEqualTo("alice");
    }

    @Test
    void validateJwtToken_false_whenExpired() {
        SecretKey key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(SECRET_B64));
        String expired = io.jsonwebtoken.Jwts.builder()
                .subject("bob")
                .issuedAt(new Date(System.currentTimeMillis() - 120_000))
                .expiration(new Date(System.currentTimeMillis() - 60_000))
                .signWith((Key) key)
                .compact();

        assertThat(jwtUtils.validateJwtToken(expired)).isFalse();
    }
}