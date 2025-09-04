package com.raxrot.back.controllers;

import com.raxrot.back.configs.AppConstants;
import com.raxrot.back.dtos.CommentPageResponse;
import com.raxrot.back.services.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/comments")
public class AdminCommentController {
    private final CommentService commentService;

    @GetMapping
    public ResponseEntity<CommentPageResponse>getAllComments(
            @RequestParam(name = "pageNumber", defaultValue = AppConstants.PAGE_NUMBER, required = false) Integer pageNumber,
            @RequestParam(name = "pageSize", defaultValue = AppConstants.PAGE_SIZE, required = false) Integer pageSize,
            @RequestParam(name="sortBy", defaultValue = AppConstants.SORT_BY) String sortBy,
            @RequestParam(name = "sortOrder", defaultValue = AppConstants.SORT_DIR, required = false) String sortOrder){
        CommentPageResponse commentPageResponse=commentService.getAllComments(pageNumber,pageSize,sortBy,sortOrder);
        return ResponseEntity.ok(commentPageResponse);
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<CommentPageResponse>getAllCommentsByProduct(
            @PathVariable Long productId,
            @RequestParam(name = "pageNumber", defaultValue = AppConstants.PAGE_NUMBER, required = false) Integer pageNumber,
            @RequestParam(name = "pageSize", defaultValue = AppConstants.PAGE_SIZE, required = false) Integer pageSize,
            @RequestParam(name="sortBy", defaultValue = AppConstants.SORT_BY) String sortBy,
            @RequestParam(name = "sortOrder", defaultValue = AppConstants.SORT_DIR, required = false) String sortOrder){
                CommentPageResponse commentPageResponse=commentService.getAllCommentsByProduct(productId,pageNumber,pageSize,sortBy,sortOrder);
                return ResponseEntity.ok(commentPageResponse);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<CommentPageResponse>getAllCommentsByUserId(
            @PathVariable Long userId,
            @RequestParam(name = "pageNumber", defaultValue = AppConstants.PAGE_NUMBER, required = false) Integer pageNumber,
            @RequestParam(name = "pageSize", defaultValue = AppConstants.PAGE_SIZE, required = false) Integer pageSize,
            @RequestParam(name="sortBy", defaultValue = AppConstants.SORT_BY) String sortBy,
            @RequestParam(name = "sortOrder", defaultValue = AppConstants.SORT_DIR, required = false) String sortOrder){
        CommentPageResponse commentPageResponse=commentService.getAllCommentsByUserId(userId,pageNumber,pageSize,sortBy,sortOrder);
        return ResponseEntity.ok(commentPageResponse);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long id) {
        commentService.deleteComment(id);
        return ResponseEntity.noContent().build();
    }
}
