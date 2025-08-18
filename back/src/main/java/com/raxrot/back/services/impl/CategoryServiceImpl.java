package com.raxrot.back.services.impl;

import com.raxrot.back.dtos.category.CategoryPageResponse;
import com.raxrot.back.dtos.category.CategoryRequest;
import com.raxrot.back.dtos.category.CategoryResponse;
import com.raxrot.back.exceptions.ApiException;
import com.raxrot.back.models.Category;
import com.raxrot.back.repositories.CategoryRepository;
import com.raxrot.back.services.CategoryService;
import lombok.extern.slf4j.Slf4j;
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
@Slf4j
public class CategoryServiceImpl implements CategoryService {
    private final CategoryRepository categoryRepository;
    private final ModelMapper modelMapper;

    public CategoryServiceImpl(CategoryRepository categoryRepository, ModelMapper modelMapper) {
        this.categoryRepository = categoryRepository;
        this.modelMapper = modelMapper;
    }

    @Override
    public CategoryResponse createCategory(CategoryRequest categoryRequest) {
        log.info("Create category requested: name='{}'", categoryRequest.getCategoryName());
        String normalizeName = normalizeCategoryName(categoryRequest.getCategoryName());

        if (categoryRepository.existsByCategoryNameIgnoreCase(normalizeName)) {
            log.warn("Category create conflict: name='{}' already exists", normalizeName);
            throw new ApiException("Category already exist", HttpStatus.CONFLICT);
        }

        Category category = modelMapper.map(categoryRequest, Category.class);
        category.setCategoryName(normalizeName);
        Category savedCategory = categoryRepository.save(category);

        log.info("Category created: id={}, name='{}'", savedCategory.getCategoryId(), savedCategory.getCategoryName());
        return modelMapper.map(savedCategory, CategoryResponse.class);
    }

    @Override
    public CategoryPageResponse getCategories(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder) {
        log.debug("Get categories: pageNumber={}, pageSize={}, sortBy='{}', sortOrder='{}'",
                pageNumber, pageSize, sortBy, sortOrder);

        Sort sort = sortOrder.equalsIgnoreCase("desc") ?
                Sort.by(sortBy).descending() :
                Sort.by(sortBy).ascending();

        Pageable pageDetails = PageRequest.of(pageNumber, pageSize, sort);
        Page<Category> categoryPage = categoryRepository.findAll(pageDetails);

        log.debug("Categories page fetched: number={}, size={}, totalElements={}, totalPages={}, last={}",
                categoryPage.getNumber(), categoryPage.getSize(), categoryPage.getTotalElements(),
                categoryPage.getTotalPages(), categoryPage.isLast());

        List<CategoryResponse> categoryResponses = categoryPage.getContent().stream()
                .map(category -> modelMapper.map(category, CategoryResponse.class))
                .collect(Collectors.toList());

        CategoryPageResponse categoryPageResponse = new CategoryPageResponse();
        categoryPageResponse.setContent(categoryResponses);
        categoryPageResponse.setPageNumber(categoryPage.getNumber());
        categoryPageResponse.setPageSize(categoryPage.getSize());
        categoryPageResponse.setTotalElements(categoryPage.getTotalElements());
        categoryPageResponse.setTotalPages(categoryPage.getTotalPages());
        categoryPageResponse.setLastPage(categoryPage.isLast());
        return categoryPageResponse;
    }

    @Override
    public CategoryResponse updateCategory(Long categoryId, CategoryRequest categoryRequest) {
        log.info("Update category requested: id={}, newName='{}'", categoryId, categoryRequest.getCategoryName());

        Category categoryFromDB = categoryRepository.findById(categoryId)
                .orElseThrow(() -> {
                    log.warn("Category not found for update: id={}", categoryId);
                    return new ApiException("Category not found", HttpStatus.NOT_FOUND);
                });

        log.debug("Found category for update: id={}, currentName='{}'",
                categoryFromDB.getCategoryId(), categoryFromDB.getCategoryName());

        String normalized = normalizeCategoryName(categoryRequest.getCategoryName());
        boolean nameChanged = !normalized.equalsIgnoreCase(categoryFromDB.getCategoryName());

        if (nameChanged && categoryRepository.existsByCategoryNameIgnoreCase(normalized)) {
            log.warn("Category update conflict: id={}, desiredName='{}' already exists", categoryId, normalized);
            throw new ApiException("Category already exists", HttpStatus.CONFLICT);
        }

        categoryFromDB.setCategoryName(normalized);
        Category savedCategory = categoryRepository.save(categoryFromDB);

        log.info("Category updated: id={}, name='{}'", savedCategory.getCategoryId(), savedCategory.getCategoryName());
        return modelMapper.map(savedCategory, CategoryResponse.class);
    }

    @Override
    public void deleteCategory(Long categoryId) {
        log.info("Delete category requested: id={}", categoryId);

        if (!categoryRepository.existsById(categoryId)) {
            log.warn("Category not found for deletion: id={}", categoryId);
            throw new ApiException("Category not found", HttpStatus.NOT_FOUND);
        }

        categoryRepository.deleteById(categoryId);
        log.info("Category deleted: id={}", categoryId);
    }

    private String normalizeCategoryName(String categoryName) {
        String normalized = categoryName.trim();
        log.trace("Normalize category name: '{}' -> '{}'", categoryName, normalized);
        return normalized;
    }
}