package com.raxrot.back.repositories;

import com.raxrot.back.models.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    Page<Comment> findByProduct_Id(Long productId, Pageable pageable);
    Page<Comment> findByUser_Id(Long userId,Pageable pageable);
    @Query("SELECT AVG(c.rating) FROM Comment c WHERE c.product.id = :productId")
    Double getAverageRatingByProductId(@Param("productId") Long productId);

    @Query("SELECT COUNT(c) FROM Comment c WHERE c.product.id = :productId")
    Long getReviewCountByProductId(@Param("productId") Long productId);
}
