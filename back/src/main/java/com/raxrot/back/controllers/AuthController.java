package com.raxrot.back.controllers;

import com.raxrot.back.models.AppRole;
import com.raxrot.back.models.Role;
import com.raxrot.back.models.User;
import com.raxrot.back.repositories.RoleRepository;
import com.raxrot.back.repositories.UserRepository;
import com.raxrot.back.security.dto.LoginRequest;
import com.raxrot.back.security.dto.SignupRequest;
import com.raxrot.back.security.dto.UserInfoResponse;
import com.raxrot.back.security.jwt.JwtUtils;
import com.raxrot.back.security.services.UserDetailsImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final JwtUtils jwtUtils;
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/public/signin")
    public ResponseEntity<UserInfoResponse> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()
                    )
            );
            SecurityContextHolder.getContext().setAuthentication(authentication);

            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            ResponseCookie token = jwtUtils.getJwtCookie(userDetails);

            List<String> roles = userDetails.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .toList();

            UserInfoResponse body = new UserInfoResponse(
                    userDetails.getId(),
                    userDetails.getUsername(),
                    roles
            );
            return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, token.toString()).body(body);
        } catch (AuthenticationException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(null);
        }
    }

    @PostMapping("/public/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByUserName(signUpRequest.getUsername())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "Username is already taken"));
        }
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "Email is already in use"));
        }

        User user = new User(
                signUpRequest.getUsername(),
                signUpRequest.getEmail(),
                passwordEncoder.encode(signUpRequest.getPassword())
        );

        Set<String> strRoles = signUpRequest.getRole();
        Set<Role> roles = new HashSet<>();

        if (strRoles == null || strRoles.isEmpty()) {
            Role userRole = roleRepository.findByRoleName(AppRole.ROLE_USER)
                    .orElseThrow(() -> new IllegalStateException("Role ROLE_USER not found"));
            roles.add(userRole);
        } else {
            for (String r : strRoles) {
                AppRole appRole = switch (r.toLowerCase()) {
                    case "admin" -> AppRole.ROLE_ADMIN;
                    case "seller" -> AppRole.ROLE_SELLER;
                    default -> AppRole.ROLE_USER;
                };
                Role role = roleRepository.findByRoleName(appRole)
                        .orElseThrow(() -> new IllegalStateException("Role " + appRole + " not found"));
                roles.add(role);
            }
        }

        user.setRoles(roles);
        User saved = userRepository.save(user);

        Map<String, Object> resp = Map.of(
                "id", saved.getUserId(),
                "username", saved.getUserName(),
                "email", saved.getEmail(),
                "roles", saved.getRoles().stream().map(r -> r.getRoleName().name()).toList()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(resp);
    }
}