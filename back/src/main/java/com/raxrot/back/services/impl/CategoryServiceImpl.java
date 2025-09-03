package com.raxrot.back.services.impl;

import com.raxrot.back.dtos.CategoryPageResponse;
import com.raxrot.back.dtos.CategoryRequest;
import com.raxrot.back.dtos.CategoryResponse;
import com.raxrot.back.exceptions.ApiException;
import com.raxrot.back.models.Category;
import com.raxrot.back.repositories.CategoryRepository;
import com.raxrot.back.services.CategoryService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {
    private final CategoryRepository categoryRepository;
    private final ModelMapper modelMapper;

    @Override
    public CategoryResponse create(CategoryRequest categoryRequest) {
        if (categoryRepository.existsByName(categoryRequest.getName())) {
            throw new ApiException("Category already exist", HttpStatus.CONFLICT);
        }
        Category category = modelMapper.map(categoryRequest, Category.class);
        Category savedCategory = categoryRepository.save(category);
        return modelMapper.map(savedCategory, CategoryResponse.class);
    }

    @Override
    public CategoryPageResponse getAllCategories(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder) {
        Sort sort = sortOrder.equalsIgnoreCase("desc") ?
                Sort.by(sortBy).descending() :
                Sort.by(sortBy).ascending();

        Pageable pageDetails = PageRequest.of(pageNumber, pageSize, sort);
        Page<Category> categoriesPage = categoryRepository.findAll(pageDetails);

        List<Category>categories = categoriesPage.getContent();
        List<CategoryResponse> categoriesResponse = categories.stream()
                .map((element) -> modelMapper.map(element, CategoryResponse.class))
                .collect(Collectors.toList());

        CategoryPageResponse categoryPageResponse = new CategoryPageResponse();
        categoryPageResponse.setContent(categoriesResponse);
        categoryPageResponse.setTotalElements(categoriesPage.getTotalElements());
        categoryPageResponse.setTotalPages(categoriesPage.getTotalPages());
        categoryPageResponse.setLastPage(categoriesPage.isLast());
        categoryPageResponse.setPageNumber(pageNumber);
        categoryPageResponse.setPageSize(pageSize);
        return categoryPageResponse;
    }

    @Override
    public CategoryResponse getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ApiException("Category not found", HttpStatus.NOT_FOUND));
        return modelMapper.map(category, CategoryResponse.class);
    }

    @Override
    public CategoryResponse updateCategory(Long id, CategoryRequest categoryRequest) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ApiException("Category not found", HttpStatus.NOT_FOUND));
        boolean isNameChanged = !categoryRequest.getName().equals(category.getName());
        if (isNameChanged && categoryRepository.existsByName(categoryRequest.getName())) {
            throw new ApiException("Category already exist", HttpStatus.CONFLICT);
        }
        category.setName(categoryRequest.getName());
        Category savedCategory = categoryRepository.save(category);
        return modelMapper.map(savedCategory, CategoryResponse.class);
    }

    @Override
    public void deleteCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ApiException("Category not found", HttpStatus.NOT_FOUND));
        categoryRepository.delete(category);
    }
}
