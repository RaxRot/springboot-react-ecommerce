package com.raxrot.back.services;

import com.raxrot.back.dtos.CategoryPageResponse;
import com.raxrot.back.dtos.CategoryRequest;
import com.raxrot.back.dtos.CategoryResponse;

public interface CategoryService {
    CategoryResponse create(CategoryRequest categoryRequest);
    CategoryPageResponse getAllCategories(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder);
    CategoryResponse getCategoryById(Long id);
    CategoryResponse updateCategory(Long id,CategoryRequest categoryRequest);
    void deleteCategoryById(Long id);
}
