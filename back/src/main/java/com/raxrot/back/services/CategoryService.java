package com.raxrot.back.services;

import com.raxrot.back.dtos.CategoryPageResponse;
import com.raxrot.back.dtos.CategoryRequest;
import com.raxrot.back.dtos.CategoryResponse;

public interface CategoryService {
    CategoryResponse createCategory(CategoryRequest categoryRequest);
    CategoryPageResponse getCategories(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder);
    CategoryResponse updateCategory(Long categoryId,CategoryRequest categoryRequest);
    void deleteCategory(Long categoryId);
}
