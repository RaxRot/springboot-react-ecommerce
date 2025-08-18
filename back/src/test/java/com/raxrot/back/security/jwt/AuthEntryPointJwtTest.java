package com.raxrot.back.security.jwt;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

import org.springframework.security.core.AuthenticationException;

import static org.assertj.core.api.Assertions.assertThat;

class AuthEntryPointJwtTest {

    @Test
    void commence_returns401_withJsonBody() throws Exception {
        var entry = new AuthEntryPointJwt();
        var req = new MockHttpServletRequest();
        req.setServletPath("/api/public/products");
        var res = new MockHttpServletResponse();

        AuthenticationException ex = new AuthenticationException("Bad credentials") {};

        entry.commence(req, res, ex);

        assertThat(res.getStatus()).isEqualTo(401);
        assertThat(res.getContentType()).isEqualTo(MediaType.APPLICATION_JSON_VALUE);

        String body = res.getContentAsString();
        assertThat(body).contains("\"status\":401");
        assertThat(body).contains("\"error\":\"Unauthorized\"");
        assertThat(body).contains("\"message\":\"Bad credentials\"");
        assertThat(body).contains("\"path\":\"/api/public/products\"");
    }
}