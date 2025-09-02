package com.raxrot.back.controllers;

import com.raxrot.back.configs.AppConstants;
import com.raxrot.back.dtos.UserPageResponse;
import com.raxrot.back.dtos.UserResponse;
import com.raxrot.back.services.AdminUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/api/admin/users")
@RestController
@RequiredArgsConstructor
public class AdminUserController {
    private final AdminUserService adminUserService;

    @GetMapping
    public ResponseEntity<UserPageResponse> getAllUsers(
            @RequestParam(name = "pageNumber", defaultValue = AppConstants.PAGE_NUMBER, required = false) Integer pageNumber,
            @RequestParam(name = "pageSize", defaultValue = AppConstants.PAGE_SIZE, required = false) Integer pageSize,
            @RequestParam(name="sortBy", defaultValue = AppConstants.SORT_BY) String sortBy,
            @RequestParam(name = "sortOrder", defaultValue = AppConstants.SORT_DIR, required = false) String sortOrder) {

        UserPageResponse userPageResponse =
                adminUserService.getAllUsers(pageNumber, pageSize, sortBy, sortOrder);
        return ResponseEntity.ok(userPageResponse);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getAdminUserById(@PathVariable Long id) {
        UserResponse userResponse=adminUserService.getUserById(id);
        return ResponseEntity.ok(userResponse);
    }
}
