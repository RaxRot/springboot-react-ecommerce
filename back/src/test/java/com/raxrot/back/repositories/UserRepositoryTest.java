package com.raxrot.back.repositories;

import com.raxrot.back.models.AppRole;
import com.raxrot.back.models.Role;
import com.raxrot.back.models.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@DataJpaTest
@ActiveProfiles("test")
class UserRepositoryTest {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    private Role roleUser;
    private Role roleAdmin;

    @BeforeEach
    void setUp() {
        roleUser = roleRepository.save(new Role(null, AppRole.ROLE_USER));
        roleAdmin = roleRepository.save(new Role(null, AppRole.ROLE_ADMIN));
    }

    @Test
    void findByUserName_returnsUser_whenExists() {
        User u = new User("user1", "u1@mail.com", "pass");
        u.setRoles(Set.of(roleUser));
        userRepository.save(u);

        Optional<User> found = userRepository.findByUserName("user1");

        assertThat(found).isPresent();
        assertThat(found.get().getEmail()).isEqualTo("u1@mail.com");
        assertThat(found.get().getRoles()).extracting(Role::getRoleName)
                .containsExactly(AppRole.ROLE_USER);
    }

    @Test
    void existsByUserName_and_existsByEmail_work() {
        userRepository.save(new User("user2", "u2@mail.com", "pass"));

        assertThat(userRepository.existsByUserName("user2")).isTrue();
        assertThat(userRepository.existsByUserName("nope")).isFalse();

        assertThat(userRepository.existsByEmail("u2@mail.com")).isTrue();
        assertThat(userRepository.existsByEmail("nope@mail.com")).isFalse();
    }

    @Test
    void findByRoleName_returnsPagedAdmins() {
        User admin1 = new User("admin1", "a1@mail.com", "p"); admin1.setRoles(Set.of(roleAdmin));
        User admin2 = new User("admin2", "a2@mail.com", "p"); admin2.setRoles(Set.of(roleAdmin));
        User userOnly = new User("userOnly", "u@mail.com", "p"); userOnly.setRoles(Set.of(roleUser));

        userRepository.saveAll(List.of(admin1, admin2, userOnly));

        Pageable pageReq = PageRequest.of(0, 10, Sort.by("userName").ascending());
        Page<User> page = userRepository.findByRoleName(AppRole.ROLE_ADMIN, pageReq);

        assertThat(page.getTotalElements()).isEqualTo(2);
        assertThat(page.getContent()).extracting(User::getUserName)
                .containsExactly("admin1", "admin2");
    }

    @Test
    void uniqueConstraints_throwOnDuplicateUserNameOrEmail() {
        userRepository.saveAndFlush(new User("dupe", "dupe@mail.com", "p"));

        // duplicate username
        assertThatThrownBy(() ->
                userRepository.saveAndFlush(new User("dupe", "another@mail.com", "p"))
        ).isInstanceOf(DataIntegrityViolationException.class);

        // duplicate email
        assertThatThrownBy(() ->
                userRepository.saveAndFlush(new User("another", "dupe@mail.com", "p"))
        ).isInstanceOf(DataIntegrityViolationException.class);
    }
}