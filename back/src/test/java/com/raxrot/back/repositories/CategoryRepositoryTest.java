package com.raxrot.back.repositories;

import com.raxrot.back.models.Category;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@ActiveProfiles("test")
class CategoryRepositoryTest {

    @Autowired
    private CategoryRepository categoryRepository;

    @Test
    void existsByCategoryNameIgnoreCase_returnsTrue_whenCategoryExists() {
        // given
        Category category = new Category();
        category.setCategoryName("Electronics");
        categoryRepository.save(category);

        // when
        boolean exists = categoryRepository.existsByCategoryNameIgnoreCase("electronics");

        // then
        assertThat(exists).isTrue();
    }

    @Test
    void existsByCategoryNameIgnoreCase_returnsFalse_whenCategoryDoesNotExist() {
        // when
        boolean exists = categoryRepository.existsByCategoryNameIgnoreCase("nonexistent");

        // then
        assertThat(exists).isFalse();
    }

    @Test
    void findByCategoryNameIgnoreCase_returnsCategory_whenExists() {
        // given
        Category category = new Category();
        category.setCategoryName("Books");
        categoryRepository.save(category);

        // when
        Optional<Category> found = categoryRepository.findByCategoryNameIgnoreCase("books");

        // then
        assertThat(found).isPresent();
        assertThat(found.get().getCategoryName()).isEqualTo("Books");
    }

    @Test
    void findByCategoryNameIgnoreCase_returnsEmpty_whenNotExists() {
        // when
        Optional<Category> found = categoryRepository.findByCategoryNameIgnoreCase("toys");

        // then
        assertThat(found).isEmpty();
    }
}