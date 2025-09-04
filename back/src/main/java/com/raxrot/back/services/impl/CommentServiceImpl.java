package com.raxrot.back.services.impl;

import com.raxrot.back.dtos.CommentPageResponse;
import com.raxrot.back.dtos.CommentRequest;
import com.raxrot.back.dtos.CommentResponse;
import com.raxrot.back.exceptions.ApiException;
import com.raxrot.back.models.AppRole;
import com.raxrot.back.models.Comment;
import com.raxrot.back.models.Product;
import com.raxrot.back.models.User;
import com.raxrot.back.repositories.CommentRepository;
import com.raxrot.back.repositories.ProductRepository;
import com.raxrot.back.services.CommentService;
import com.raxrot.back.utils.AuthUtil;
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
public class CommentServiceImpl implements CommentService {
    private final CommentRepository commentRepository;
    private final ProductRepository productRepository;
    private final ModelMapper modelMapper;
    private final AuthUtil authUtil;

    @Override
    public CommentResponse createComment(CommentRequest request) {
        User me=authUtil.loggedInUser();
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ApiException("Product not found", HttpStatus.NOT_FOUND));
        Comment comment = modelMapper.map(request, Comment.class);
        comment.setProduct(product);
        comment.setUser(me);
        Comment savedComment = commentRepository.save(comment);
        return modelMapper.map(savedComment, CommentResponse.class);
    }

    @Override
    public CommentPageResponse getAllComments(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder) {
        Sort sort = sortOrder.equalsIgnoreCase("desc") ?
                Sort.by(sortBy).descending() :
                Sort.by(sortBy).ascending();

        Pageable pageDetails = PageRequest.of(pageNumber, pageSize, sort);
        Page<Comment> commentsPage = commentRepository.findAll(pageDetails);
        List<CommentResponse> content = commentsPage.getContent().stream()
                .map(comment -> new CommentResponse(
                        comment.getId(),
                        comment.getText(),
                        comment.getRating(),
                        comment.getProduct().getId(),
                        comment.getUser().getUserName(),
                        comment.getCreatedAt()
                ))
                .collect(Collectors.toList());

        return new CommentPageResponse(content,
                commentsPage.getNumber(),
                commentsPage.getSize(),
                commentsPage.getTotalPages(),
                commentsPage.getTotalElements(),
                commentsPage.isLast());
    }

    @Override
    public CommentPageResponse getAllCommentsByProduct(Long productId, Integer pageNumber, Integer pageSize, String sortBy, String sortOrder) {
        Sort sort = sortOrder.equalsIgnoreCase("desc") ?
                Sort.by(sortBy).descending() :
                Sort.by(sortBy).ascending();

        Pageable pageDetails = PageRequest.of(pageNumber, pageSize, sort);
        Page<Comment> commentsPage = commentRepository.findByProduct_Id(productId,pageDetails);
        List<CommentResponse> content = commentsPage.getContent().stream()
                .map(comment -> new CommentResponse(
                        comment.getId(),
                        comment.getText(),
                        comment.getRating(),
                        comment.getProduct().getId(),
                        comment.getUser().getUserName(),
                        comment.getCreatedAt()
                ))
                .collect(Collectors.toList());

        return new CommentPageResponse(content,
                commentsPage.getNumber(),
                commentsPage.getSize(),
                commentsPage.getTotalPages(),
                commentsPage.getTotalElements(),
                commentsPage.isLast());
    }

    @Override
    public CommentPageResponse getAllCommentsByUserId(Long userId, Integer pageNumber, Integer pageSize, String sortBy, String sortOrder) {
        Sort sort = sortOrder.equalsIgnoreCase("desc") ?
                Sort.by(sortBy).descending() :
                Sort.by(sortBy).ascending();

        Pageable pageDetails = PageRequest.of(pageNumber, pageSize, sort);
        Page<Comment> commentsPage = commentRepository.findByUser_Id(userId,pageDetails);
        List<CommentResponse> content = commentsPage.getContent().stream()
                .map(comment -> new CommentResponse(
                        comment.getId(),
                        comment.getText(),
                        comment.getRating(),
                        comment.getProduct().getId(),
                        comment.getUser().getUserName(),
                        comment.getCreatedAt()
                ))
                .collect(Collectors.toList());

        return new CommentPageResponse(content,
                commentsPage.getNumber(),
                commentsPage.getSize(),
                commentsPage.getTotalPages(),
                commentsPage.getTotalElements(),
                commentsPage.isLast());
    }

    @Override
    public CommentResponse updateComment(Long id, CommentRequest commentRequest) {
        User me=authUtil.loggedInUser();
        Comment comment=commentRepository.findById(id)
                .orElseThrow(() -> new ApiException("Comment not found", HttpStatus.NOT_FOUND));
        if (!comment.getUser().getId().equals(me.getId())) {
            throw new ApiException("You are not allowed to update this comment", HttpStatus.FORBIDDEN);
        }
        comment.setText(commentRequest.getText());
        comment.setRating(commentRequest.getRating());
        Comment savedComment = commentRepository.save(comment);
        return modelMapper.map(savedComment, CommentResponse.class);
    }

    @Override
    public void deleteComment(Long id) {
        User me=authUtil.loggedInUser();
        Comment comment=commentRepository.findById(id)
                .orElseThrow(() -> new ApiException("Comment not found", HttpStatus.NOT_FOUND));
        boolean isAdmin=me.getRoles().stream().anyMatch(role->role.getRoleName().equals(AppRole.ROLE_ADMIN));
        if (isAdmin || comment.getUser().getId().equals(me.getId())) {
            commentRepository.delete(comment);
        }else{
            throw new ApiException("You are not allowed to delete this comment", HttpStatus.FORBIDDEN);
        }
    }
}
