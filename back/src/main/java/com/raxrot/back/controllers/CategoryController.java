package com.raxrot.back.controllers;

import com.raxrot.back.configs.AppConstants;
import com.raxrot.back.dtos.CategoryPageResponse;
import com.raxrot.back.dtos.CategoryRequest;
import com.raxrot.back.dtos.CategoryResponse;
import com.raxrot.back.services.CategoryService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/api")
@Slf4j
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService){
        this.categoryService = categoryService;
    }

    @PostMapping("/admin/categories")
    public ResponseEntity<CategoryResponse> createCategory(@Valid @RequestBody CategoryRequest categoryRequest) {
        log.info("POST /admin/categories - creating category: '{}'", categoryRequest.getCategoryName());
        CategoryResponse categoryResponse = categoryService.createCategory(categoryRequest);
        log.info("Category created with id={}", categoryResponse.getCategoryId());
        return new ResponseEntity<>(categoryResponse, HttpStatus.CREATED);
    }

    @GetMapping("/public/categories")
    public ResponseEntity<CategoryPageResponse> getAllCategories(
            @RequestParam(name = "pageNumber", defaultValue = AppConstants.PAGE_NUMBER, required = false) Integer pageNumber,
            @RequestParam(name = "pageSize", defaultValue = AppConstants.PAGE_SIZE, required = false) Integer pageSize,
            @RequestParam(name = "sortBy", defaultValue = AppConstants.SORT_CATEGORIES_BY, required = false) String sortBy,
            @RequestParam(name = "sortOrder", defaultValue = AppConstants.SORT_DIR, required = false) String sortOrder) {
        log.debug("GET /public/categories?pageNumber={}&pageSize={}&sortBy={}&sortOrder={}",
                pageNumber, pageSize, sortBy, sortOrder);
        CategoryPageResponse categoryResponse = categoryService.getCategories(pageNumber, pageSize, sortBy, sortOrder);
        log.info("Fetched {} categories (page {}/{})",
                categoryResponse.getContent().size(),
                categoryResponse.getPageNumber() + 1,
                categoryResponse.getTotalPages());
        return new ResponseEntity<>(categoryResponse, HttpStatus.OK);
    }

    @PutMapping("/admin/categories/{categoryId}")
    public ResponseEntity<CategoryResponse> updateCategory(@PathVariable Long categoryId,
                                                           @Valid @RequestBody CategoryRequest categoryRequest) {
        log.info("PUT /admin/categories/{} - updating category to '{}'", categoryId, categoryRequest.getCategoryName());
        CategoryResponse categoryResponse = categoryService.updateCategory(categoryId, categoryRequest);
        log.info("Category updated id={}, newName='{}'", categoryResponse.getCategoryId(), categoryResponse.getCategoryName());
        return new ResponseEntity<>(categoryResponse, HttpStatus.OK);
    }

    @DeleteMapping("/admin/categories/{categoryId}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long categoryId) {
        log.info("DELETE /admin/categories/{} - deleting category", categoryId);
        categoryService.deleteCategory(categoryId);
        log.info("Category deleted id={}", categoryId);
        return ResponseEntity.noContent().build();
    }
}