package com.raxrot.back.services;

import com.raxrot.back.dtos.UserPageResponse;
import com.raxrot.back.dtos.UserResponse;

public interface AdminUserService {
    UserPageResponse getAllUsers(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder);
    UserResponse getUserById(Long id);
}
