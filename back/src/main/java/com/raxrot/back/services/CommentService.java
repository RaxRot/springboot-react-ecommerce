package com.raxrot.back.services;

import com.raxrot.back.dtos.CommentPageResponse;
import com.raxrot.back.dtos.CommentRequest;
import com.raxrot.back.dtos.CommentResponse;

public interface CommentService {
    CommentResponse createComment(CommentRequest comment);
    CommentPageResponse getAllComments(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder);
    CommentPageResponse getAllCommentsByProduct(Long productId,Integer pageNumber, Integer pageSize, String sortBy, String sortOrder);
    CommentPageResponse getAllCommentsByUserId(Long userId,Integer pageNumber, Integer pageSize, String sortBy, String sortOrder);
    CommentResponse updateComment(Long id, CommentRequest commentRequest);
    void deleteComment(Long id);
}
