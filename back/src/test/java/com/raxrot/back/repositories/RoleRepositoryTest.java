package com.raxrot.back.repositories;

import com.raxrot.back.models.AppRole;
import com.raxrot.back.models.Role;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@ActiveProfiles("test")
class RoleRepositoryTest {

    @Autowired
    private RoleRepository roleRepository;

    @Test
    void findByRoleName_returnsRole_whenExists() {
        Role saved = roleRepository.save(new Role(null, AppRole.ROLE_ADMIN));
        Optional<Role> found = roleRepository.findByRoleName(AppRole.ROLE_ADMIN);

        assertThat(found).isPresent();
        assertThat(found.get().getRoleId()).isEqualTo(saved.getRoleId());
        assertThat(found.get().getRoleName()).isEqualTo(AppRole.ROLE_ADMIN);
    }

    @Test
    void findByRoleName_returnsEmpty_whenNotExists() {
        assertThat(roleRepository.findByRoleName(AppRole.ROLE_SELLER)).isEmpty();
    }
}