package com.raxrot.back.security.jwt;

import com.raxrot.back.security.services.UserDetailsServiceImpl;
import jakarta.servlet.FilterChain;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthTokenFilterTest {

    @InjectMocks
    private AuthTokenFilter filter;

    @Mock
    private JwtUtils jwtUtils;

    @Mock
    private UserDetailsServiceImpl userDetailsService;

    @Mock
    private FilterChain chain;

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void doFilter_setsAuthentication_whenValidToken() throws Exception {
        String token = "valid.jwt.token";
        String username = "alice";
        var req = new MockHttpServletRequest();
        req.addHeader("Authorization", "Bearer " + token);
        var res = new MockHttpServletResponse();

        when(jwtUtils.getJwtFromHeader(req)).thenReturn(token);
        when(jwtUtils.validateJwtToken(token)).thenReturn(true);
        when(jwtUtils.getUserNameFromJwtToken(token)).thenReturn(username);
        when(userDetailsService.loadUserByUsername(username))
                .thenReturn(User.withUsername(username).password("x").authorities("ROLE_USER").build());

        filter.doFilter(req, res, chain);

        verify(chain, times(1)).doFilter(req, res);
        var auth = SecurityContextHolder.getContext().getAuthentication();
        assertThat(auth).isNotNull();
        assertThat(auth.getName()).isEqualTo("alice");
        assertThat(auth.getAuthorities()).extracting("authority").containsExactly("ROLE_USER");
    }

    @Test
    void doFilter_doesNotAuthenticate_whenNoToken() throws Exception {
        var req = new MockHttpServletRequest();
        var res = new MockHttpServletResponse();

        when(jwtUtils.getJwtFromHeader(req)).thenReturn(null);

        filter.doFilter(req, res, chain);

        verify(chain, times(1)).doFilter(req, res);
        assertThat(SecurityContextHolder.getContext().getAuthentication()).isNull();
    }

    @Test
    void doFilter_doesNotAuthenticate_whenInvalidToken() throws Exception {
        String token = "bad";
        var req = new MockHttpServletRequest();
        req.addHeader("Authorization", "Bearer " + token);
        var res = new MockHttpServletResponse();

        when(jwtUtils.getJwtFromHeader(req)).thenReturn(token);
        when(jwtUtils.validateJwtToken(token)).thenReturn(false);

        filter.doFilter(req, res, chain);

        verify(chain, times(1)).doFilter(req, res);
        assertThat(SecurityContextHolder.getContext().getAuthentication()).isNull();
    }
}