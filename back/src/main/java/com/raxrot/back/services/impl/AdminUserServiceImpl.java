package com.raxrot.back.services.impl;

import com.raxrot.back.dtos.UserPageResponse;
import com.raxrot.back.dtos.UserResponse;
import com.raxrot.back.exceptions.ApiException;
import com.raxrot.back.models.User;
import com.raxrot.back.repositories.UserRepository;
import com.raxrot.back.services.AdminUserService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminUserServiceImpl implements AdminUserService {
    private final ModelMapper modelMapper;
    private final UserRepository userRepository;
    @Override
    public UserPageResponse getAllUsers(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder) {
        Sort sort = sortOrder.equalsIgnoreCase("desc") ?
                Sort.by(sortBy).descending() :
                Sort.by(sortBy).ascending();

        Pageable pageDetails = PageRequest.of(pageNumber, pageSize, sort);
        Page<User> users = userRepository.findAll(pageDetails);

        List<UserResponse> content = users.getContent().stream()
                .map(user -> new UserResponse(
                        user.getId(),
                        user.getUserName(),
                        user.getEmail(),
                        user.getRoles().stream()
                                .map(r -> r.getRoleName().name())
                                .toList()
                ))
                .toList();

        return new UserPageResponse(
                content,
                users.getNumber(),
                users.getSize(),
                users.getTotalPages(),
                users.getTotalElements(),
                users.isLast()
        );
    }

    @Override
    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ApiException("User Not Found", HttpStatus.NOT_FOUND));

        return new UserResponse(
                user.getId(),
                user.getUserName(),
                user.getEmail(),
                user.getRoles().stream()
                        .map(r -> r.getRoleName().name())
                        .toList()
        );
    }
}
