package com.raxrot.back.services.impl;

import com.raxrot.back.dtos.category.CategoryRequest;
import com.raxrot.back.dtos.category.CategoryResponse;
import com.raxrot.back.exceptions.ApiException;
import com.raxrot.back.models.Category;
import com.raxrot.back.repositories.CategoryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.catchThrowableOfType;
import static org.mockito.Mockito.*;

class CategoryServiceImplTest {

    private CategoryRepository repository;
    private CategoryServiceImpl service;

    @BeforeEach
    void setUp() {
        repository = mock(CategoryRepository.class);
        service = new CategoryServiceImpl(repository, new ModelMapper());
    }

    @Test
    void createCategory_ok_whenNameFree() {
        CategoryRequest req = new CategoryRequest("  Electronics  ");

        when(repository.existsByCategoryNameIgnoreCase("Electronics")).thenReturn(false);
        when(repository.save(any(Category.class)))
                .thenAnswer(inv -> {
                    Category c = inv.getArgument(0);
                    c.setCategoryId(10L);
                    return c;
                });

        CategoryResponse resp = service.createCategory(req);

        assertThat(resp.getCategoryId()).isEqualTo(10L);
        assertThat(resp.getCategoryName()).isEqualTo("Electronics");

        ArgumentCaptor<Category> captor = ArgumentCaptor.forClass(Category.class);
        verify(repository).save(captor.capture());
        assertThat(captor.getValue().getCategoryName()).isEqualTo("Electronics");
    }

    @Test
    void createCategory_conflict_whenNameExists() {
        when(repository.existsByCategoryNameIgnoreCase("Books")).thenReturn(true);

        CategoryRequest req = new CategoryRequest("Books");

        ApiException ex = catchThrowableOfType(
                () -> service.createCategory(req),
                ApiException.class
        );

        assertThat(ex.getStatus()).isEqualTo(HttpStatus.CONFLICT);
        verify(repository, never()).save(any());
    }

    @Test
    void updateCategory_ok_whenNameNotChanged() {
        Category existing = new Category(5L, "Books", null);

        when(repository.findById(5L)).thenReturn(Optional.of(existing));
        when(repository.save(any(Category.class))).thenAnswer(inv -> inv.getArgument(0));

        CategoryResponse resp = service.updateCategory(5L, new CategoryRequest("books"));

        assertThat(resp.getCategoryId()).isEqualTo(5L);
        assertThat(resp.getCategoryName()).isEqualTo("books".trim());
        verify(repository, never()).existsByCategoryNameIgnoreCase(anyString()); // имя не менялось
    }

    @Test
    void updateCategory_conflict_whenNewNameBusy() {
        Category existing = new Category(7L, "Books", null);

        when(repository.findById(7L)).thenReturn(Optional.of(existing));
        when(repository.existsByCategoryNameIgnoreCase("Electronics")).thenReturn(true);

        ApiException ex = catchThrowableOfType(
                () -> service.updateCategory(7L, new CategoryRequest("Electronics")),
                ApiException.class
        );

        assertThat(ex.getStatus()).isEqualTo(HttpStatus.CONFLICT);
        verify(repository, never()).save(any());
    }

    @Test
    void updateCategory_notFound_whenIdMissing() {
        when(repository.findById(999L)).thenReturn(Optional.empty());

        ApiException ex = catchThrowableOfType(
                () -> service.updateCategory(999L, new CategoryRequest("Anything")),
                ApiException.class
        );

        assertThat(ex.getStatus()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    void deleteCategory_ok() {
        when(repository.existsById(3L)).thenReturn(true);

        service.deleteCategory(3L);

        verify(repository).deleteById(3L);
    }

    @Test
    void deleteCategory_notFound() {
        when(repository.existsById(404L)).thenReturn(false);

        ApiException ex = catchThrowableOfType(
                () -> service.deleteCategory(404L),
                ApiException.class
        );

        assertThat(ex.getStatus()).isEqualTo(HttpStatus.NOT_FOUND);
        verify(repository, never()).deleteById(anyLong());
    }
}