package com.raxrot.back.security.services;

import com.raxrot.back.models.AppRole;
import com.raxrot.back.models.Role;
import com.raxrot.back.models.User;
import com.raxrot.back.repositories.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Optional;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserDetailsServiceImplTest {

    @Mock
    UserRepository userRepository;

    @InjectMocks
    UserDetailsServiceImpl service;

    @Test
    void loadUserByUsername_returnsUserDetails_whenUserExists() {
        // given
        User user = new User("alice", "alice@example.com", "{noop}pwd");
        user.setUserId(7L);
        user.setRoles(Set.of(new Role(AppRole.ROLE_USER)));
        when(userRepository.findByUserName("alice")).thenReturn(Optional.of(user));

        // when
        UserDetails ud = service.loadUserByUsername("alice");

        // then
        assertThat(ud.getUsername()).isEqualTo("alice");
        assertThat(ud.getPassword()).isEqualTo("{noop}pwd");
        assertThat(ud.getAuthorities()).extracting("authority").containsExactly("ROLE_USER");
        verify(userRepository, times(1)).findByUserName("alice");
    }

    @Test
    void loadUserByUsername_throws_whenNotFound() {
        when(userRepository.findByUserName("ghost")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.loadUserByUsername("ghost"))
                .isInstanceOf(UsernameNotFoundException.class)
                .hasMessageContaining("User Not Found with username: ghost");

        verify(userRepository, times(1)).findByUserName("ghost");
    }
}