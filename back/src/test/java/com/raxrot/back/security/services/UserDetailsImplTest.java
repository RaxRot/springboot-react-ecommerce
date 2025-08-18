package com.raxrot.back.security.services;

import com.raxrot.back.models.AppRole;
import com.raxrot.back.models.Role;
import com.raxrot.back.models.User;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.GrantedAuthority;

import java.util.List;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

class UserDetailsImplTest {

    @Test
    void build_mapsUserToUserDetails_withAuthorities() {
        // given
        User user = new User("alice", "alice@example.com", "{noop}pwd");
        user.setUserId(42L);
        user.setRoles(Set.of(new Role(AppRole.ROLE_USER), new Role(AppRole.ROLE_ADMIN)));

        // when
        UserDetailsImpl ud = UserDetailsImpl.build(user);

        // then
        assertThat(ud.getId()).isEqualTo(42L);
        assertThat(ud.getUsername()).isEqualTo("alice");
        assertThat(ud.getEmail()).isEqualTo("alice@example.com");
        assertThat(ud.getPassword()).isEqualTo("{noop}pwd");

        List<String> auths = ud.getAuthorities().stream().map(GrantedAuthority::getAuthority).toList();
        assertThat(auths).containsExactlyInAnyOrder("ROLE_USER", "ROLE_ADMIN");
    }

    @Test
    void equals_byId_only() {
        User u1 = new User("a","a@x","p"); u1.setUserId(1L);
        User u2 = new User("b","b@x","p"); u2.setUserId(1L);

        UserDetailsImpl d1 = UserDetailsImpl.build(u1);
        UserDetailsImpl d2 = UserDetailsImpl.build(u2);

        assertThat(d1).isEqualTo(d2);
        assertThat(d1.hashCode()).isEqualTo(d2.hashCode());
    }
}