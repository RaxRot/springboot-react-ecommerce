package com.raxrot.back.repositories;

import com.raxrot.back.models.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    Page<Comment> findByProduct_Id(Long productId, Pageable pageable);
    Page<Comment> findByUser_Id(Long userId,Pageable pageable);
}
