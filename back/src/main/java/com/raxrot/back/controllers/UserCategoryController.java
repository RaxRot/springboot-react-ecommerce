package com.raxrot.back.controllers;

import com.raxrot.back.configs.AppConstants;
import com.raxrot.back.dtos.CategoryPageResponse;
import com.raxrot.back.dtos.CategoryResponse;
import com.raxrot.back.services.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/public/categories")
@RequiredArgsConstructor
public class UserCategoryController {
    private final CategoryService categoryService;

    @GetMapping
    public ResponseEntity<CategoryPageResponse> getAllCategories(
            @RequestParam(name = "pageNumber", defaultValue = AppConstants.PAGE_NUMBER, required = false) Integer pageNumber,
            @RequestParam(name = "pageSize", defaultValue = AppConstants.PAGE_SIZE, required = false) Integer pageSize,
            @RequestParam(name="sortBy", defaultValue = AppConstants.SORT_BY) String sortBy,
            @RequestParam(name = "sortOrder", defaultValue = AppConstants.SORT_DIR, required = false) String sortOrder){
        CategoryPageResponse categoryPageResponse=categoryService.getAllCategories(pageNumber, pageSize, sortBy, sortOrder);
        return ResponseEntity.ok(categoryPageResponse);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoryResponse> getCategoryById(@PathVariable Long id) {
        CategoryResponse categoryResponse=categoryService.getCategoryById(id);
        return ResponseEntity.ok(categoryResponse);
    }
}
