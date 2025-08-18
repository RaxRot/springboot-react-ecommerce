package com.raxrot.back.services;

import com.raxrot.back.dtos.product.ProductPageResponse;
import com.raxrot.back.dtos.product.ProductRequest;
import com.raxrot.back.dtos.product.ProductResponse;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface ProductService {
    ProductResponse createProduct(Long categoryId, ProductRequest productRequest);

    ProductPageResponse getAllProducts(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder, String keyword, String category);

    ProductPageResponse searchByCategory(Long categoryId, Integer pageNumber, Integer pageSize, String sortBy, String sortOrder);

    ProductPageResponse searchProductByKeyword(String keyword, Integer pageNumber, Integer pageSize, String sortBy, String sortOrder);

    ProductResponse updateProduct(Long productId, ProductRequest productRequest);

    void deleteProduct(Long productId);

    ProductResponse updateProductImage(Long productId, MultipartFile image) throws IOException;
}
