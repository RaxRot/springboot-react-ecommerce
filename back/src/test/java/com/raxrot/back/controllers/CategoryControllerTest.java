package com.raxrot.back.controllers;

import com.raxrot.back.dtos.category.CategoryPageResponse;
import com.raxrot.back.dtos.category.CategoryRequest;
import com.raxrot.back.dtos.category.CategoryResponse;
import com.raxrot.back.services.CategoryService;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentMatchers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = CategoryController.class)
class CategoryControllerTest {

    @Autowired
    private MockMvc mvc;

    @MockBean
    private CategoryService service;

    @Test
    void createCategory_returns201_onValid() throws Exception {
        when(service.createCategory(ArgumentMatchers.any(CategoryRequest.class)))
                .thenReturn(new CategoryResponse(1L, "Books"));

        mvc.perform(post("/api/admin/categories")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"categoryName":"Books"}
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.categoryId").value(1))
                .andExpect(jsonPath("$.categoryName").value("Books"));
    }

    @Test
    void createCategory_returns400_onBlankName() throws Exception {
        mvc.perform(post("/api/admin/categories")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"categoryName":" "}
                                """))
                .andExpect(status().isBadRequest());
        verify(service, never()).createCategory(any());
    }

    @Test
    void getAllCategories_returns200() throws Exception {
        CategoryPageResponse page = CategoryPageResponse.builder()
                .content(List.of(new CategoryResponse(1L, "Books")))
                .pageNumber(0).pageSize(10).totalPages(1).totalElements(1L).lastPage(true)
                .build();

        when(service.getCategories(0, 10, "categoryId", "asc")).thenReturn(page);

        mvc.perform(get("/api/public/categories")
                        .param("pageNumber", "0")
                        .param("pageSize", "10")
                        .param("sortBy", "categoryId")
                        .param("sortOrder", "asc"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].categoryName").value("Books"));

        verify(service).getCategories(0, 10, "categoryId", "asc");
    }

    @Test
    void updateCategory_returns200() throws Exception {
        when(service.updateCategory(eq(5L), any(CategoryRequest.class)))
                .thenReturn(new CategoryResponse(5L, "Electronics"));

        mvc.perform(put("/api/admin/categories/{id}", 5)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"categoryName":"Electronics"}
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.categoryId").value(5))
                .andExpect(jsonPath("$.categoryName").value("Electronics"));
    }

    @Test
    void deleteCategory_returns204() throws Exception {
        mvc.perform(delete("/api/admin/categories/{id}", 9))
                .andExpect(status().isNoContent());
        verify(service).deleteCategory(9L);
    }
}